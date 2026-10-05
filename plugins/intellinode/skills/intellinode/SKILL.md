---
name: intellinode
description: Build AI features and apps in JavaScript or TypeScript with the IntelliNode npm package (Node.js or the browser). Use when the user wants a Gemini- or ChatGPT-style chat app, an assistant that keeps conversations and long-term memory, RAG over their documents, a vector database (Firestore, Vertex AI RAG Engine or Vector Search, Pinecone, Qdrant, Chroma, Weaviate, Milvus, Elasticsearch, pgvector, MongoDB Atlas), Gemini or Vertex AI features (Google Search grounding, image, video, music and speech generation, the Live API), one API across OpenAI, Anthropic, Gemini, Mistral, Cohere, NVIDIA and local models, tool calling, or the IntelliNode MCP server. Not for Python projects (use the Intelli library).
license: Apache-2.0
---

# IntelliNode

Follow these rules, then use the recipes. Details live in [references/google.md](references/google.md) (Gemini and
Vertex AI), [references/stores.md](references/stores.md) (vector databases and chat history) and
[references/providers.md](references/providers.md) (providers, models, the MCP server). A runnable chat app template
is in [assets/chat-app](assets/chat-app).

## Setup

- Install: `npm install intellinode` (3.1.0 or later; check with `npm ls intellinode`). CommonJS
  (`const { Assistant } = require('intellinode')`) and ESM (`import { Assistant } from 'intellinode'`) both work.
  TypeScript types ship with the package (`node_modules/intellinode/index.d.ts`).
- Keys come from the environment; for a `.env` file use `require('dotenv').config({ quiet: true })` (without
  `quiet`, dotenv 17 prints a line to stdout). Never hardcode, print, log or commit a key, and never send a server
  key to a browser. Stop with a clear message when a needed key is missing.
- Provider: the one the user names. Otherwise use the first key that is set, in this order: `OPENAI_API_KEY`,
  `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `VERTEX_API_KEY`, then a local Ollama model. Tell the user which one you used.

## Pick the layer

| The user wants | Use |
| --- | --- |
| One prompt in, text / JSON / code out | `Gen` (`Gen.generate_text`, `Gen.generate_json`, `Gen.generate_component`, ...) |
| Chat turns, streaming, tool calling, structured output on any provider | `Chatbot` with `Chatbot.createInput(provider, system, options)` |
| A whole chat app: saved conversations, answers from documents with sources, memory, attachments | `Assistant` + a `ChatHistory` + `VectorStore`s |
| Gemini-only features: image / video / music / speech generation, Live API, Files API, caching | `GoogleAIWrapper` |
| Store and search vectors | a `VectorStore` class with an `embedder` |
| Cross-provider tools inside the code editor | the MCP server, see [references/providers.md](references/providers.md) |

## Gemini and Vertex AI keys

- An AI Studio key uses the Gemini Developer API: provider `'gemini'`, or `new GoogleAIWrapper(key)`.
- A Google Cloud Agent Platform key (it starts with `AQ.`) uses Vertex AI express mode: provider `'vertex'`, or
  `new GoogleAIWrapper(key, { vertex: true })`. Sent to the Developer API it fails with `API_KEY_SERVICE_BLOCKED`.
- Add `projectId` (`{ vertex: true, projectId }`) for Veo video, Lyria 2 music, the Live API and Agent Engine.
- The Google Cloud stores (Firestore, RAG Engine, Vector Search) reject API keys and need OAuth:
  `gcloud auth application-default login`, a service account in `GOOGLE_APPLICATION_CREDENTIALS`, or `accessToken`.

## Recipe: a Gemini-style assistant

```js
require('dotenv').config({ quiet: true });
const { Assistant, FileChatHistory, MemoryVectorStore } = require('intellinode');

const key = process.env.VERTEX_API_KEY;
if (!key) throw new Error('Set VERTEX_API_KEY');
const embedder = { provider: 'vertex', apiKey: key, dimensions: 768 };
const knowledge = new MemoryVectorStore({ embedder, path: './data/knowledge.json' });
const assistant = new Assistant({
  provider: 'vertex', apiKey: key,
  systemMessage: 'You are the support assistant for Acme.',
  history: new FileChatHistory({ dir: './data/conversations' }),          // or FirestoreChatHistory
  knowledge,
  memory: new MemoryVectorStore({ embedder, path: './data/memory.json' }), // recalls earlier conversations
  inputOptions: { generationConfig: { thinkingConfig: { thinkingLevel: 'low' } } },
  autoTitle: true,
});
// embed documents once, not on every start; chunk ids are '<id>#0', '<id>#1', ... and the same id replaces them
if (await knowledge.count() === 0) {
  await assistant.addDocuments([{ id: 'policy.md', text: policyText, metadata: { title: 'Refund policy' } }]);
}
const reply = await assistant.chat('How long do refunds take?', { userId: 'u1' });
// reply: { conversationId, text, references, citations, memories, usage, model }
const sources = reply.references.filter((reference) => reference.cited);   // the chunks the answer cites as [n]
const next = await assistant.chat('And for laptops?', { conversationId: reply.conversationId, userId: 'u1' });
```

Stream to a browser with server-sent events:

```js
for await (const event of assistant.stream(message, { conversationId, userId, attachments, googleSearch })) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);   // start (retrieved sources), text chunks, done (the saved answer)
}
res.end();
```

For a complete local app (Node http server + one HTML page, streaming, cited sources, a web search toggle, `/image`),
copy `assets/chat-app/` into the project and follow its README.

## Rules (checked by running code)

1. `chatbot.chat(input)` returns an array of replies: strings, or `{ content, tool_calls }`; `chatbot.lastResponse`
   keeps the raw provider response. `assistant.chat()` returns one object with `usage` and `model` (`Assistant` uses a
   per-turn view of its chatbot, so read those from the reply, not from `assistant.chatbot.lastResponse`).
2. `reply.references` are the chunks retrieved for the question (up to `topK`), not proof of use: the answer cites
   the ones it used as `[n]` and those have `cited: true`. Raise `minScore` to drop weak matches.
3. For Gemini inputs pass `systemInstruction: true` to `Chatbot.createInput('gemini' | 'vertex', system, options)`
   so the system message is a real system instruction. Without it the old user / model turn pair is sent.
4. Gemini 3 models think before answering. For chat set `generationConfig: { thinkingConfig: { thinkingLevel: 'low' } }`.
   A small `maxTokens` can be spent on thinking and return an empty string; raise it rather than retrying.
5. Google Search grounding: `googleSearch: true` on the `Assistant` (every turn) or in the turn options (one turn),
   gemini and vertex only. Web citations are `{ title, uri }` where `uri` is a Google redirect link and `title` is
   often just the domain; show them as links.
6. Gemini image models return one image per call: `GoogleAIWrapper.extractImages(response)[0]` is
   `{ mimeType, data (base64) }`; pick the file extension from `mimeType`. Shape it with
   `{ imageConfig: { aspectRatio: '16:9' } }`. Speech: `await wrapper.textToSpeech(text, { voice: 'Kore' })` returns
   a WAV Buffer.
7. Keep one embedder per vector store forever: a different model or `dimensions` breaks the stored vectors.
   `gemini-embedding-001` returns 3072 numbers unless `dimensions` is set.
8. Vector store results are `{ id, score, text, metadata }`, score as similarity (higher is closer); `filter` is
   metadata equality (`{ lang: 'en' }`, an array means one of). `VertexRAGStore` queries by text only.
9. `Assistant` conversations belong to the first `userId` they were used with; another `userId` gets an error.
   Pass the signed-in user's id on every call, and keep servers that hold keys on 127.0.0.1 or behind auth.
10. Image, video and music generation are billed per call (Veo also takes minutes); tell the user before running
    them. Provider-specific limits (Claude thinking budgets, Firestore indexes, the Live API WebSocket) are in the
    references.

## Verify before you report

Run a short script with the real key and read the output: the text must answer the question, a document question
must cite at least one reference (`cited: true`), and saved conversations must reload (`assistant.getMessages(id)`).
An empty string usually means the thinking budget ate `maxTokens`. Report `reply.model`, the provider, where
conversations and vectors are stored, and what you did not test (for example OAuth-only Google Cloud services
without credentials).
