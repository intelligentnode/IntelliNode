const assert = require('assert');
const http = require('http');
const crypto = require('crypto');
const { Readable } = require('stream');
const config = require('../../config.json');
const FetchClient = require('../../utils/FetchClient');
const GeminiAIWrapper = require('../../wrappers/GeminiAIWrapper');
const GoogleAIWrapper = require('../../wrappers/GoogleAIWrapper');
const GoogleAuth = require('../../utils/GoogleAuth');
const { Chatbot, SupportedChatModels } = require('../../function/Chatbot');
const { GeminiInput } = require('../../model/input/ChatModelInput');
const { RemoteImageModel } = require('../../controller/RemoteImageModel');
const { RemoteSpeechModel } = require('../../controller/RemoteSpeechModel');
const { RemoteEmbedModel } = require('../../controller/RemoteEmbedModel');
const EmbedInput = require('../../model/input/EmbedInput');
const ImageModelInput = require('../../model/input/ImageModelInput');
const Text2SpeechInput = require('../../model/input/Text2SpeechInput');

const KEY = 'AQ.test-key-1234567890';
const { GoogleAIError } = GeminiAIWrapper;

// Every FetchClient call is recorded with its merged headers; replies are scripted per call (a value, a function
// of the request, or an Error to throw).
async function withMockedHttp(replies, run) {
  const calls = [];
  const originals = { post: FetchClient.prototype.post, get: FetchClient.prototype.get, request: FetchClient.prototype.request };
  const respond = (call) => {
    calls.push(call);
    const reply = replies[calls.length - 1];
    if (reply === undefined) throw new Error(`unexpected request #${calls.length}: ${call.method} ${call.url}`);
    const value = typeof reply === 'function' ? reply(call) : reply;
    if (value instanceof Error) throw value;
    return value;
  };
  const url = (client, endpoint) => (endpoint.startsWith('http') ? endpoint : client.baseURL + endpoint);
  FetchClient.prototype.post = async function (endpoint, data, extra = {}) {
    return respond({ method: 'POST', url: url(this, endpoint), body: data, headers: { ...this.defaultHeaders, ...(extra.headers || {}) }, extra });
  };
  FetchClient.prototype.get = async function (endpoint, extra = {}) {
    return respond({ method: 'GET', url: url(this, endpoint), headers: { ...this.defaultHeaders, ...(extra.headers || {}) }, extra });
  };
  FetchClient.prototype.request = async function (method, endpoint, data, extra = {}) {
    return respond({ method, url: url(this, endpoint), body: data, headers: { ...this.defaultHeaders, ...(extra.headers || {}) }, extra });
  };
  try {
    return await run(calls);
  } finally {
    Object.assign(FetchClient.prototype, originals);
  }
}

const textReply = (text, extra = {}) => ({ candidates: [{ content: { role: 'model', parts: [{ text }] }, finishReason: 'STOP', ...extra }] });
const sse = (events) => Readable.from(events.map((event) => `data: ${JSON.stringify(event)}\r\n\r\n`));

async function testBackendsAndUrls() {
  const dev = new GeminiAIWrapper('dev-key');
  assert.strictEqual(dev.vertex, false);
  assert.strictEqual(dev.client.defaultHeaders['x-goog-api-key'], 'dev-key', 'the Developer API key stays a client default header');
  assert.strictEqual(await dev._modelUrl('gemini-3.6-flash', 'generateContent'), 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent');

  const express = new GeminiAIWrapper(KEY, { vertex: true });
  assert.strictEqual(await express._modelUrl('gemini-3.8-flash', 'generateContent'), 'https://aiplatform.googleapis.com/v1beta1/publishers/google/models/gemini-3.8-flash:generateContent');
  assert.strictEqual(express._defaultModel('chat'), config.url.gemini.vertex.models.chat);

  const project = new GeminiAIWrapper(KEY, { vertex: true, projectId: 'p1' });
  assert.strictEqual(project.location, 'global');
  assert.strictEqual(await project._modelUrl('gemini-3.8-flash', 'generateContent'),
    'https://aiplatform.googleapis.com/v1beta1/projects/p1/locations/global/publishers/google/models/gemini-3.8-flash:generateContent');
  assert.strictEqual(project._locationFor('video'), 'us-central1', 'Veo goes to us-central1 when the location was not given');
  const regional = new GeminiAIWrapper(KEY, { projectId: 'p1', location: 'europe-west4' });
  assert.strictEqual(regional.vertex, true, 'a projectId selects Vertex AI');
  assert.strictEqual(regional._locationFor('video'), 'europe-west4', 'an explicit location wins');
  assert.ok((await regional._modelUrl('m', 'predict')).startsWith('https://europe-west4-aiplatform.googleapis.com/v1beta1/projects/p1/locations/europe-west4/'));
  assert.strictEqual(new GeminiAIWrapper(KEY, { projectId: 'p1', location: 'eu' })._vertexHost('eu'), 'https://aiplatform.eu.rep.googleapis.com');
  assert.strictEqual(GeminiAIWrapper._vertexModelPath('anthropic/claude-x'), 'publishers/anthropic/models/claude-x');
  assert.strictEqual(GeminiAIWrapper._vertexModelPath('models/gemini-x'), 'publishers/google/models/gemini-x');

  // the environment switch applies to a wrapper built directly, never to fromOptions (Chatbot, controllers)
  process.env.GOOGLE_GENAI_USE_VERTEXAI = 'true';
  try {
    assert.strictEqual(new GeminiAIWrapper(KEY).vertex, true);
    assert.strictEqual(GeminiAIWrapper.fromOptions(KEY, {}).vertex, false);
  } finally {
    delete process.env.GOOGLE_GENAI_USE_VERTEXAI;
  }
  assert.strictEqual(GeminiAIWrapper.fromOptions(KEY, { project_id: 'p2' }).projectId, 'p2');

  // GoogleAIWrapper keeps the Cloud TTS client and uses a separate client for Gemini
  const google = new GoogleAIWrapper('cloud-key', { vertex: true });
  assert.ok(google.client.baseURL.includes('texttospeech'));
  assert.notStrictEqual(google.client, google.genaiClient);
  assert.strictEqual(google.genaiClient.defaultHeaders['x-goog-api-key'], 'cloud-key');
  assert.ok(google instanceof GeminiAIWrapper);
}

async function testGenerateContentBodies() {
  await withMockedHttp([textReply('hi'), textReply('ok'), textReply('a')], async (calls) => {
    const vertex = new GeminiAIWrapper(KEY, { vertex: true });
    await vertex.generateContent({ model: 'gemini-x', contents: [{ parts: [{ text: 'q' }] }], system_instruction: 'be brief', generation_config: { max_output_tokens: 5 } });
    assert.ok(calls[0].url.endsWith('/publishers/google/models/gemini-x:generateContent'));
    assert.strictEqual(calls[0].body.model, undefined, 'the model is in the URL only');
    assert.strictEqual(calls[0].body.contents[0].role, 'user', 'Vertex needs roles');
    assert.deepStrictEqual(calls[0].body.systemInstruction, { parts: [{ text: 'be brief' }] });
    assert.ok(calls[0].body.generationConfig, 'snake_case keys are camelized');

    assert.strictEqual(await vertex.generateText('hello', { systemInstruction: 'x', generationConfig: { thinkingConfig: { thinkingLevel: 'low' } } }), 'ok');
    assert.deepStrictEqual(calls[1].body.contents, [{ role: 'user', parts: [{ text: 'hello' }] }]);
    assert.deepStrictEqual(calls[1].body.generationConfig, { thinkingConfig: { thinkingLevel: 'low' } });

    // a function call turn without a role is a model turn
    await vertex.generateContent({ contents: [{ parts: [{ text: 'q' }] }, { parts: [{ functionCall: { name: 'f', args: {} } }] }, { parts: [{ functionResponse: { name: 'f', response: {} } }] }] });
    assert.deepStrictEqual(calls[2].body.contents.map((content) => content.role), ['user', 'model', 'user']);
  });
}

async function testErrorsRedactAndHint() {
  const error = Object.assign(new Error(`HTTP error 403: {"error":{"message":"blocked for key ${KEY}","status":"PERMISSION_DENIED","details":[{"reason":"API_KEY_SERVICE_BLOCKED"}]}}`), {
    status: 403, body: `{"error":{"message":"blocked for key ${KEY}","details":[{"reason":"API_KEY_SERVICE_BLOCKED"}]}}`,
  });
  await withMockedHttp([error], async () => {
    try {
      await new GeminiAIWrapper(KEY).generateText('hi');
      assert.fail('expected an error');
    } catch (caught) {
      assert.ok(caught instanceof GoogleAIError);
      assert.strictEqual(caught.status, 403);
      assert.ok(!caught.message.includes(KEY) && !JSON.stringify(caught.details).includes(KEY), 'the key never appears in errors');
      assert.ok(caught.message.includes('pass { vertex: true }'), 'the blocked-key hint is added');
      assert.ok(caught.message.trim().endsWith('}'), 'the provider JSON stays at the end of the message');
    }
  });
  const timeout = Object.assign(new Error('Request timed out'), { code: 'ETIMEDOUT' });
  await withMockedHttp([timeout], async () => {
    await assert.rejects(new GeminiAIWrapper(KEY).generateText('hi'), (caught) => caught.code === 'ETIMEDOUT');
  });
}

async function testBearerAuth() {
  await withMockedHttp([textReply('ok')], async (calls) => {
    const wrapper = new GeminiAIWrapper(null, { projectId: 'p1', accessToken: async () => 'token-abc' });
    assert.strictEqual(await wrapper.generateText('hi'), 'ok');
    assert.strictEqual(calls[0].headers.Authorization, 'Bearer token-abc');
    assert.strictEqual(calls[0].headers['x-goog-api-key'], undefined);
    assert.ok(calls[0].url.includes('/projects/p1/locations/global/'));
  });
  await assert.rejects(new GeminiAIWrapper(null).generateText('hi'), /needs an API key/);
}

async function testStreaming() {
  const events = [textReply('Hel'), { ...textReply('lo'), usageMetadata: { totalTokenCount: 3 } }];
  await withMockedHttp([() => sse(events), () => sse(events), () => sse([{ error: { code: 500, message: 'boom' } }])], async (calls) => {
    const wrapper = new GeminiAIWrapper('k');
    let text = '';
    for await (const chunk of wrapper.streamText('hi')) text += chunk;
    assert.strictEqual(text, 'Hello');
    assert.ok(calls[0].url.endsWith(':streamGenerateContent?alt=sse'));
    assert.strictEqual(calls[0].extra.responseType, 'stream');

    const chat = wrapper.startChat({ systemInstruction: 'x' });
    let streamed = '';
    for await (const chunk of chat.stream('q')) streamed += chunk;
    assert.strictEqual(streamed, 'Hello');
    assert.deepStrictEqual(chat.history[1], { role: 'model', parts: [{ text: 'Hello' }] }, 'streamed text parts are merged into one');
    assert.strictEqual(chat.lastResponse.usageMetadata.totalTokenCount, 3);

    await assert.rejects(async () => {
      for await (const chunk of wrapper.streamText('hi')) assert.ok(chunk);
    }, /Gemini stream error/);
  });
}

async function testChatSession() {
  const signed = { candidates: [{ content: { role: 'model', parts: [{ functionCall: { name: 'f', args: { a: 1 } }, thoughtSignature: 'sig' }] } }] };
  const blocked = { candidates: [{ finishReason: 'SAFETY', content: { parts: [] } }] };
  await withMockedHttp([signed, textReply('done'), blocked], async (calls) => {
    const chat = new GeminiAIWrapper('k').startChat({ tools: [{ functionDeclarations: [{ name: 'f' }] }] });
    const response = await chat.send('use f');
    assert.deepStrictEqual(GeminiAIWrapper.extractFunctionCalls(response), [{ name: 'f', args: { a: 1 } }]);
    assert.strictEqual(await chat.sendFunctionResponse('f', { ok: true }).then(GeminiAIWrapper.extractText), 'done');
    assert.strictEqual(calls[1].body.contents[1].parts[0].thoughtSignature, 'sig', 'thought signatures are sent back');
    assert.deepStrictEqual(calls[1].body.tools, [{ functionDeclarations: [{ name: 'f' }] }]);
    const before = chat.history.length;
    await chat.send('next');
    assert.strictEqual(chat.history.length, before, 'a blocked reply does not join the history');
    assert.strictEqual(GeminiAIWrapper.extractFinishReason(chat.lastResponse), 'SAFETY');
  });
}

async function testEmbeddings() {
  await withMockedHttp([
    { embeddings: [{ values: [1, 2] }, { values: [3, 4] }] },
    { predictions: [{ embeddings: { values: [5] } }] },
    { predictions: [{ embeddings: { values: [6] } }] },
    { embedding: { values: [7] } },
    { embeddings: [{ values: [8] }] },
  ], async (calls) => {
    const dev = new GeminiAIWrapper('k');
    assert.deepStrictEqual(await dev.embedTexts(['a', 'b'], null, { taskType: 'RETRIEVAL_QUERY', outputDimensionality: 2 }), [[1, 2], [3, 4]]);
    assert.ok(calls[0].url.endsWith('gemini-embedding-001:batchEmbedContents'));
    assert.deepStrictEqual(calls[0].body.requests[0], { model: 'models/gemini-embedding-001', content: { parts: [{ text: 'a' }] }, taskType: 'RETRIEVAL_QUERY', outputDimensionality: 2 });

    const vertex = new GeminiAIWrapper(KEY, { vertex: true });
    assert.deepStrictEqual(await vertex.embedTexts(['a', 'b'], null, { taskType: 'RETRIEVAL_DOCUMENT' }), [[5], [6]], 'gemini-embedding-001 takes one instance per Vertex request');
    assert.ok(calls[1].url.endsWith('gemini-embedding-001:predict'));
    assert.deepStrictEqual(calls[1].body, { instances: [{ content: 'a', task_type: 'RETRIEVAL_DOCUMENT' }] });

    // the old return shapes stay: getEmbeddings -> { values }, getBatchEmbeddings -> [{ values }]
    assert.deepStrictEqual(await dev.getEmbeddings({ model: 'models/gemini-embedding-001', content: { parts: [{ text: 'x' }] } }), { values: [7] });
    assert.strictEqual(calls[3].body.model, 'models/gemini-embedding-001');
    assert.deepStrictEqual(await dev.getBatchEmbeddings({ requests: [{ model: 'models/gemini-embedding-001', content: { parts: [{ text: 'x' }] } }] }), [{ values: [8] }]);
  });
}

async function testMediaAndGeneration() {
  const wrapper = new GeminiAIWrapper('k');
  assert.deepStrictEqual(wrapper.mediaPart(Buffer.from('abc'), 'image/png'), { inlineData: { mimeType: 'image/png', data: 'YWJj' } });
  assert.deepStrictEqual(wrapper.mediaPart('gs://b/x.pdf'), { fileData: { mimeType: 'application/pdf', fileUri: 'gs://b/x.pdf' } });
  assert.strictEqual(wrapper.mediaPart('https://youtu.be/abc').fileData.mimeType, 'video/mp4');
  assert.deepStrictEqual(wrapper.mediaPart('data:image/jpeg;base64,QUJD'), { inlineData: { mimeType: 'image/jpeg', data: 'QUJD' } });
  assert.deepStrictEqual(wrapper.mediaPart({ data: 'QUJD', mimeType: 'audio/wav' }), { inlineData: { mimeType: 'audio/wav', data: 'QUJD' } });
  assert.throws(() => wrapper.mediaPart(Buffer.from('x')), /mimeType is required/);
  assert.throws(() => wrapper.mediaPart('https://example.com/files/abc'), /Could not tell the file type/);
  assert.strictEqual(wrapper.mediaPart('gs://b/clip.mp4', null, { videoMetadata: { startOffset: '1s' } }).videoMetadata.startOffset, '1s');

  const image = { candidates: [{ content: { parts: [{ text: 'here' }, { inlineData: { mimeType: 'image/png', data: 'iVBO' } }] } }] };
  const operation = { name: 'projects/p1/locations/us-central1/publishers/google/models/veo/operations/op1' };
  await withMockedHttp([image, operation, { done: true, response: { videos: [{ bytesBase64Encoded: 'AAAA', mimeType: 'video/mp4' }] } }, { predictions: [{ bytesBase64Encoded: 'UklG', mimeType: 'audio/wav' }] }], async (calls) => {
    const response = await wrapper.generateImage('a fox', { imageConfig: { aspectRatio: '16:9' } }, null, { images: [{ data: 'QUJD', mimeType: 'image/png' }] });
    assert.deepStrictEqual(GeminiAIWrapper.extractImages(response), [{ mimeType: 'image/png', data: 'iVBO' }]);
    assert.ok(calls[0].url.endsWith(`${config.url.gemini.models.image}:generateContent`));
    assert.deepStrictEqual(calls[0].body.generationConfig, { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '16:9' } });
    assert.strictEqual(calls[0].body.contents[0].parts[1].inlineData.data, 'QUJD');

    const vertex = new GeminiAIWrapper(KEY, { vertex: true, projectId: 'p1' });
    const started = await vertex.generateVideo('drone shot', { durationSeconds: 4 });
    assert.strictEqual(calls[1].url, `https://us-central1-aiplatform.googleapis.com/v1beta1/projects/p1/locations/us-central1/publishers/google/models/${config.url.gemini.vertex.models.video}:predictLongRunning`);
    assert.deepStrictEqual(calls[1].body.parameters, { aspectRatio: '16:9', durationSeconds: 4 });
    const done = await vertex.waitForVideoCompletion(started, { pollMs: 1 });
    assert.ok(calls[2].url.endsWith('/publishers/google/models/veo:fetchPredictOperation'));
    assert.deepStrictEqual(GeminiAIWrapper.extractVideos(done), [{ mimeType: 'video/mp4', data: 'AAAA', uri: null }]);

    const music = await vertex.generateMusic('calm piano', { negativePrompt: 'drums', seed: 3 });
    assert.ok(calls[3].url.includes('/locations/us-central1/') && calls[3].url.endsWith('lyria-002:predict'));
    assert.deepStrictEqual(calls[3].body, { instances: [{ prompt: 'calm piano', negative_prompt: 'drums', seed: 3 }] });
    assert.strictEqual(GeminiAIWrapper.extractAudio(music)[0].mimeType, 'audio/wav');
  });

  await assert.rejects(new GeminiAIWrapper(KEY, { vertex: true }).generateVideo('x'), /needs a project/);
  await assert.rejects(new GeminiAIWrapper('k').generateMusic('x', { model: 'lyria-002' }), /runs on Vertex AI/);
  await assert.rejects(new GeminiAIWrapper(KEY, { vertex: true }).uploadFile('x.png'), /only available on the Gemini Developer API/);
  await assert.rejects(new GeminiAIWrapper('k').computeTokens('x'), /only available on Vertex AI/);
  assert.throws(() => wrapper._imagenModel(null), /retired/);
}

function testExtractorsAndAudio() {
  const grounded = {
    candidates: [{
      content: { parts: [{ text: 'thought', thought: true }, { text: 'Answer' }] },
      groundingMetadata: { groundingChunks: [{ web: { uri: 'https://a', title: 'A', domain: 'a.com' } }, { web: { uri: 'https://a', title: 'A' } }, { retrievedContext: { uri: 'gs://b/doc.pdf', title: 'doc' } }] },
    }],
    usageMetadata: { totalTokenCount: 9 },
  };
  assert.strictEqual(GeminiAIWrapper.extractText(grounded), 'Answer', 'thought parts are skipped');
  assert.strictEqual(GeminiAIWrapper.extractText(grounded, true), 'thoughtAnswer');
  assert.deepStrictEqual(GeminiAIWrapper.extractCitations(grounded), [{ title: 'A', uri: 'https://a', domain: 'a.com' }, { title: 'doc', uri: 'gs://b/doc.pdf' }]);
  assert.deepStrictEqual(GeminiAIWrapper.extractUsage(grounded), { totalTokenCount: 9 });
  assert.strictEqual(GeminiAIWrapper.extractFinishReason({ promptFeedback: { blockReason: 'SAFETY' } }), 'SAFETY');

  const pcm = Buffer.alloc(480);
  const wav = GeminiAIWrapper.audioToWav({ mimeType: 'audio/L16;codec=pcm;rate=16000', data: pcm.toString('base64') });
  assert.strictEqual(wav.slice(0, 4).toString(), 'RIFF');
  assert.strictEqual(wav.readUInt32LE(24), 16000, 'the sample rate comes from the mime type');
  assert.strictEqual(wav.readUInt32LE(40), 480);
  // a streamed WAV whose header claims more data than it has is corrected
  const truncated = Buffer.from(GeminiAIWrapper.pcmToWav(Buffer.alloc(100)));
  truncated.writeUInt32LE(99999, 40);
  assert.strictEqual(GeminiAIWrapper.audioToWav({ mimeType: 'audio/wav', data: truncated }).readUInt32LE(40), 100);
  assert.deepStrictEqual(GeminiAIWrapper.modelCatalog().live, config.url.gemini.vertex.catalog.live);
}

async function testChatbotGemini() {
  const events = [textReply('Par'), { ...textReply('is'), usageMetadata: { totalTokenCount: 4 } }];
  await withMockedHttp([textReply('Paris'), () => sse(events)], async (calls) => {
    const bot = new Chatbot(KEY, SupportedChatModels.VERTEX, null, { projectId: 'p1', location: 'us-central1' });
    const input = Chatbot.createInput(SupportedChatModels.VERTEX, 'Be brief.', { systemInstruction: true, generationConfig: { thinkingConfig: { thinkingLevel: 'low' } }, model: 'gemini-x' });
    input.addUserMessage('Capital of France?', [{ data: Buffer.from('img'), mimeType: 'image/png' }]);
    assert.deepStrictEqual(await bot.chat(input), ['Paris']);
    assert.strictEqual(calls[0].url, 'https://us-central1-aiplatform.googleapis.com/v1beta1/projects/p1/locations/us-central1/publishers/google/models/gemini-x:generateContent');
    assert.deepStrictEqual(calls[0].body.systemInstruction, { parts: [{ text: 'Be brief.' }] });
    assert.strictEqual(calls[0].body.contents.length, 1, 'no user / model instruction pair with systemInstruction: true');
    assert.deepStrictEqual(calls[0].body.contents[0].parts[1], { inlineData: { mimeType: 'image/png', data: Buffer.from('img').toString('base64') } });
    assert.deepStrictEqual(calls[0].body.generationConfig.thinkingConfig, { thinkingLevel: 'low' });
    assert.strictEqual(bot.lastResponse.candidates[0].content.parts[0].text, 'Paris');

    let streamed = '';
    for await (const chunk of bot.stream(input)) streamed += chunk;
    assert.strictEqual(streamed, 'Paris');
    assert.strictEqual(bot.lastResponse.usageMetadata.totalTokenCount, 4, 'the last stream chunk is kept for usage and grounding');
  });

  // an input left at the Developer API default model uses the Vertex AI default on the vertex provider
  await withMockedHttp([textReply('a'), textReply('b'), textReply('c')], async (calls) => {
    const plainInput = new GeminiInput('x');
    plainInput.addUserMessage('hi');
    await new Chatbot(KEY, SupportedChatModels.VERTEX).chat(plainInput);
    assert.ok(calls[0].url.endsWith(`/${config.url.gemini.vertex.models.chat}:generateContent`));
    await new Chatbot('k', SupportedChatModels.GEMINI).chat(plainInput);
    assert.ok(calls[1].url.endsWith(`/${config.url.gemini.models.chat}:generateContent`));
    const pinned = new GeminiInput('x', { model: config.url.gemini.models.chat });
    pinned.addUserMessage('hi');
    await new Chatbot(KEY, SupportedChatModels.VERTEX).chat(pinned);
    assert.ok(calls[2].url.endsWith(`/${config.url.gemini.models.chat}:generateContent`), 'an explicit model is kept');
  });

  // the old GeminiInput shape is unchanged
  const legacy = new GeminiInput('You are a bot.');
  legacy.addUserMessage('hi');
  assert.deepStrictEqual(legacy.getChatInput().contents.map((content) => content.role), ['user', 'model', 'user']);
  assert.strictEqual(legacy.getChatInput().systemInstruction, undefined);
}

async function testControllers() {
  const pcm = Buffer.alloc(48).toString('base64');
  await withMockedHttp([
    { candidates: [{ content: { parts: [{ inlineData: { mimeType: 'image/png', data: 'IMG1' } }] } }] },
    { candidates: [{ content: { parts: [{ inlineData: { mimeType: 'audio/L16;codec=pcm;rate=24000', data: pcm } }] } }] },
    { predictions: [{ embeddings: { values: [0.5] } }] },
  ], async (calls) => {
    const images = await new RemoteImageModel(KEY, 'vertex').generateImages(new ImageModelInput({ prompt: 'leaf', width: 1920, height: 1080 }));
    assert.deepStrictEqual(images, ['IMG1']);
    assert.deepStrictEqual(calls[0].body.generationConfig.imageConfig, { aspectRatio: '16:9' });
    assert.ok(calls[0].url.startsWith('https://aiplatform.googleapis.com/'));

    const audio = await new RemoteSpeechModel('k', 'gemini').generateSpeech(new Text2SpeechInput({ text: 'hello', gender: 'MALE' }));
    assert.strictEqual(Buffer.from(audio, 'base64').slice(0, 4).toString(), 'RIFF', 'Gemini PCM comes back as base64 WAV');
    assert.strictEqual(calls[1].body.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName, 'Puck');

    const vectors = await new RemoteEmbedModel(KEY, 'vertex').getEmbeddings(new EmbedInput({ texts: ['a'] }));
    assert.deepStrictEqual(vectors, [{ object: 'embedding', index: 0, embedding: [0.5] }]);
  });
  assert.strictEqual(ImageModelInput.aspectRatio(1024, 1024), '1:1');
  assert.strictEqual(ImageModelInput.aspectRatio(1080, 1920), '9:16');
}

// A local token endpoint for the service account flow.
async function testGoogleAuth() {
  assert.strictEqual(await new GoogleAuth({ accessToken: ' tok ' }).getAccessToken(), 'tok');
  assert.deepStrictEqual(await new GoogleAuth({ accessToken: async () => 'fn-token', quotaProjectId: 'q' }).getHeaders(), { Authorization: 'Bearer fn-token', 'x-goog-user-project': 'q' });

  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048, privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } });
  let received = null;
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      received = new URLSearchParams(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ access_token: 'sa-token', expires_in: 3600 }));
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const tokenUri = `http://127.0.0.1:${server.address().port}/token`;
    const auth = new GoogleAuth({ credentials: { type: 'service_account', client_email: 'sa@p.iam.gserviceaccount.com', private_key: privateKey, token_uri: tokenUri, project_id: 'sa-project' } });
    assert.strictEqual(await auth.getAccessToken(), 'sa-token');
    assert.strictEqual(received.get('grant_type'), 'urn:ietf:params:oauth:grant-type:jwt-bearer');
    const [header, claims, signature] = received.get('assertion').split('.');
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(`${header}.${claims}`);
    assert.ok(verifier.verify(publicKey, Buffer.from(signature, 'base64')), 'the JWT is signed with the service account key');
    const payload = JSON.parse(Buffer.from(claims, 'base64').toString());
    assert.strictEqual(payload.scope, GoogleAuth.CLOUD_SCOPE);
    assert.strictEqual(payload.aud, tokenUri);
    received = null;
    assert.strictEqual(await auth.getAccessToken(), 'sa-token');
    assert.strictEqual(received, null, 'the token is cached until it expires');
    assert.strictEqual(await auth.getProjectId(), 'sa-project');
  } finally {
    server.close();
  }
}

async function testGoogleGenAI() {
  await testBackendsAndUrls();
  await testGenerateContentBodies();
  await testErrorsRedactAndHint();
  await testBearerAuth();
  await testStreaming();
  await testChatSession();
  await testEmbeddings();
  await testMediaAndGeneration();
  testExtractorsAndAudio();
  await testChatbotGemini();
  await testControllers();
  await testGoogleAuth();
  console.log('Google Gemini / Vertex AI tests passed.');
}

module.exports = testGoogleGenAI;

if (require.main === module) {
  testGoogleGenAI().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
