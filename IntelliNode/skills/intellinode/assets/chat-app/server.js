// A local Gemini / ChatGPT-style chat app on IntelliNode: conversations saved to disk (or Firestore), answers
// grounded on your documents with numbered sources, long-term memory across conversations, Google Search,
// file attachments and image generation. No framework: Node's http module plus one HTML page.
//
//   npm install intellinode dotenv
//   VERTEX_API_KEY=... node server.js          (or GEMINI_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY)
//   open http://localhost:3300
require('dotenv').config({ quiet: true });
const fs = require('fs');
const http = require('http');
const path = require('path');
const {
  Assistant, FileChatHistory, FirestoreChatHistory, FirestoreVectorStore, MemoryVectorStore, RemoteImageModel, ImageModelInput,
} = require('intellinode');

const PORT = Number(process.env.PORT) || 3300;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');

// The first provider with a key, unless PROVIDER is set.
const PROVIDERS = [
  { provider: 'vertex', key: 'VERTEX_API_KEY', embed: 'vertex' },
  { provider: 'gemini', key: 'GEMINI_API_KEY', embed: 'gemini' },
  { provider: 'openai', key: 'OPENAI_API_KEY', embed: 'openai' },
  { provider: 'anthropic', key: 'ANTHROPIC_API_KEY', embed: null },
];
const chosen = PROVIDERS.find((item) => item.provider === process.env.PROVIDER) || PROVIDERS.find((item) => process.env[item.key]);
if (!chosen || !process.env[chosen.key]) {
  console.error(`Set one of ${PROVIDERS.map((item) => item.key).join(', ')} in the environment or a .env file.`);
  process.exit(1);
}
const apiKey = process.env[chosen.key];
const isGoogle = chosen.provider === 'vertex' || chosen.provider === 'gemini';
const googleOptions = chosen.provider === 'vertex' && process.env.VERTEX_PROJECT_ID
  ? { projectId: process.env.VERTEX_PROJECT_ID, ...(process.env.VERTEX_LOCATION && { location: process.env.VERTEX_LOCATION }) }
  : {};

// Embeddings for documents and memory: the chat provider's, else OpenAI's (Anthropic has no embedding API).
const embedProvider = chosen.embed || (process.env.OPENAI_API_KEY ? 'openai' : null);
const embedder = embedProvider
  ? { provider: embedProvider, apiKey: embedProvider === chosen.embed ? apiKey : process.env.OPENAI_API_KEY, options: googleOptions }
  : null;

// HISTORY=firestore keeps conversations and memory in Google Cloud Firestore (needs gcloud ADC or a service account).
const useFirestore = process.env.HISTORY === 'firestore';
const history = useFirestore
  ? new FirestoreChatHistory({ projectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.VERTEX_PROJECT_ID })
  : new FileChatHistory({ dir: path.join(DATA_DIR, 'conversations') });
const knowledge = embedder ? new MemoryVectorStore({ embedder, path: path.join(DATA_DIR, 'knowledge.json') }) : null;
const memory = !embedder ? null : useFirestore
  ? new FirestoreVectorStore({ projectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.VERTEX_PROJECT_ID, collection: 'memories', embedder })
  : new MemoryVectorStore({ embedder, path: path.join(DATA_DIR, 'memory.json') });

const settings = {
  provider: chosen.provider,
  apiKey,
  model: process.env.MODEL || null,
  options: googleOptions,
  systemMessage: process.env.SYSTEM_MESSAGE || 'You are a helpful assistant. Use Markdown for lists and code.',
  history,
  knowledge,
  memory,
  minScore: 0.35,
  autoTitle: true,
  // Gemini 3 thinks before answering; low keeps a chat responsive
  ...(isGoogle && { inputOptions: { generationConfig: { thinkingConfig: { thinkingLevel: 'low' } } } }),
};
const assistant = new Assistant(settings);

async function readJson(request, limit = 25 * 1024 * 1024) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > limit) throw Object.assign(new Error('The request is too large.'), { status: 413 });
    chunks.push(chunk);
  }
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
}

function sendJson(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(data));
}

// Provider errors carry their JSON at the end of the message; show the readable part only.
function errorMessage(error) {
  const raw = String((error && error.message) || error);
  const start = raw.indexOf('{');
  if (start >= 0) {
    try {
      const parsed = JSON.parse(raw.slice(start));
      const message = (parsed.error && parsed.error.message) || parsed.message;
      if (message) return message;
    } catch (parseError) {
      // not JSON
    }
  }
  return raw.slice(0, 500);
}

const routes = {
  'GET /api/config': async () => ({
    provider: chosen.provider,
    knowledge: Boolean(knowledge),
    webSearch: isGoogle,
    images: isGoogle || chosen.provider === 'openai',
    history: useFirestore ? 'firestore' : 'files',
  }),
  'GET /api/conversations': async () => assistant.listConversations({ limit: 100 }),
  'GET /api/conversation': async (request, url) => ({
    conversation: await history.getConversation(url.searchParams.get('id')),
    messages: await assistant.getMessages(url.searchParams.get('id')),
  }),
  'DELETE /api/conversation': async (request, url) => {
    await assistant.deleteConversation(url.searchParams.get('id'));
    return { ok: true };
  },
  'POST /api/documents': async (request) => {
    if (!knowledge) throw Object.assign(new Error('Documents need an embedding provider (Gemini, Vertex AI or OpenAI).'), { status: 400 });
    const { name, text } = await readJson(request);
    if (!text || !String(text).trim()) throw Object.assign(new Error('The document is empty.'), { status: 400 });
    const ids = await assistant.addDocuments([{ id: String(name || 'document').slice(0, 120), text, metadata: { title: name } }]);
    return { chunks: ids.length };
  },
  'POST /api/image': async (request) => {
    const { prompt } = await readJson(request);
    const provider = isGoogle ? chosen.provider : 'openai';
    const model = new RemoteImageModel(apiKey, provider, googleOptions);
    const input = new ImageModelInput({ prompt, numberOfImages: 1, width: 1024, height: 1024, ...(provider === 'openai' && { imageSize: '1024x1024' }) });
    const [image] = await model.generateImages(input);
    return { image: /^https?:/.test(image) ? image : `data:image/png;base64,${image}` };
  },
};

// POST /api/chat streams server-sent events: start (sources), text chunks, done (the saved answer).
async function chat(request, response) {
  const { conversationId, message, attachments, webSearch } = await readJson(request);
  response.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  const send = (event) => response.write(`data: ${JSON.stringify(event)}\n\n`);
  try {
    const options = { conversationId: conversationId || undefined, attachments: attachments || [], ...(isGoogle && { googleSearch: Boolean(webSearch) }) };
    for await (const event of assistant.stream(String(message || ''), options)) {
      send(event);
    }
  } catch (error) {
    console.error(error);
    send({ type: 'error', message: errorMessage(error) });
  }
  response.end();
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  try {
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(path.join(__dirname, 'public', 'index.html')).pipe(response);
    }
    if (request.method === 'POST' && url.pathname === '/api/chat') return await chat(request, response);
    const route = routes[`${request.method} ${url.pathname}`];
    if (!route) return sendJson(response, 404, { error: 'Not found' });
    return sendJson(response, 200, await route(request, url));
  } catch (error) {
    console.error(error);
    return sendJson(response, error.status || 500, { error: errorMessage(error) });
  }
});

// local by default: the server holds your API key
server.listen(PORT, process.env.HOST || '127.0.0.1', () => {
  console.log(`IntelliNode chat on http://localhost:${PORT} (${chosen.provider}, history: ${useFirestore ? 'Firestore' : DATA_DIR})`);
});
