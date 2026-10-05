const assert = require('assert');
const fs = require('fs');
const { Readable } = require('stream');
const os = require('os');
const path = require('path');
const FetchClient = require('../../utils/FetchClient');
const TextSplitter = require('../../utils/TextSplitter');
const { Assistant } = require('../../function/Assistant');
const { MemoryVectorStore } = require('../../store/MemoryVectorStore');
const { Embedder } = require('../../store/Embedder');
const { MemoryChatHistory, FileChatHistory } = require('../../store/ChatHistory');
const { FirestoreChatHistory } = require('../../store/FirestoreChatHistory');
const { FirestoreVectorStore } = require('../../store/FirestoreVectorStore');
const { VertexRAGStore } = require('../../store/VertexRAGStore');
const { VertexVectorSearchStore, VertexVectorSearchIndexStore, dataObjectId } = require('../../store/VertexVectorSearchStore');
const { Firestore, FirestoreVector } = require('../../store/GoogleCloud');

// Records every FetchClient call (with merged headers) and answers from a script.
async function withMockedHttp(replies, run) {
  const calls = [];
  const originals = { post: FetchClient.prototype.post, get: FetchClient.prototype.get, request: FetchClient.prototype.request };
  const respond = (call) => {
    calls.push(call);
    const reply = typeof replies === 'function' ? replies(call, calls.length - 1) : replies[calls.length - 1];
    if (reply === undefined) throw new Error(`unexpected request #${calls.length}: ${call.method} ${call.url}`);
    const value = typeof reply === 'function' ? reply(call) : reply;
    if (value instanceof Error) throw value;
    return value;
  };
  FetchClient.prototype.post = async function (url, body, extra = {}) {
    return respond({ method: 'POST', url, body, headers: { ...this.defaultHeaders, ...(extra.headers || {}) } });
  };
  FetchClient.prototype.get = async function (url, extra = {}) {
    return respond({ method: 'GET', url, headers: { ...this.defaultHeaders, ...(extra.headers || {}) } });
  };
  FetchClient.prototype.request = async function (method, url, body, extra = {}) {
    return respond({ method, url, body, headers: { ...this.defaultHeaders, ...(extra.headers || {}) } });
  };
  try {
    return await run(calls);
  } finally {
    Object.assign(FetchClient.prototype, originals);
  }
}

// A deterministic keyword embedder: one dimension per word of a small vocabulary.
const VOCABULARY = ['refund', 'return', 'days', 'shipping', 'express', 'laptop', 'name', 'sam', 'policy', 'weather'];
function fakeEmbed(texts) {
  return texts.map((text) => {
    const words = String(text).toLowerCase();
    const vector = VOCABULARY.map((word) => (words.includes(word) ? 1 : 0));
    vector.push(0.01);
    return vector;
  });
}

const geminiReply = (text) => ({ candidates: [{ content: { role: 'model', parts: [{ text }] } }], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 2, totalTokenCount: 12 } });

function testTextSplitter() {
  const text = `${'First paragraph sentence. '.repeat(20)}\n\n${'Second part words '.repeat(30)}`;
  const chunks = TextSplitter.split(text, { chunkSize: 200, chunkOverlap: 40 });
  assert.ok(chunks.length > 2);
  assert.ok(chunks.every((chunk) => chunk.length <= 200), 'chunks respect the size');
  assert.ok(chunks[1].startsWith('sentence') || chunks[1].startsWith('First'), 'chunks start at a word boundary');
  const documents = TextSplitter.toDocuments('a b c', { source: 'doc.md' });
  assert.deepStrictEqual(documents, [{ id: 'doc.md#0', text: 'a b c', metadata: { source: 'doc.md', chunk: 0 } }]);
  assert.deepStrictEqual(TextSplitter.split(''), []);
  assert.throws(() => TextSplitter.split('x', { chunkSize: 10, chunkOverlap: 10 }), /smaller/);
}

async function testHistories() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'intellinode-history-'));
  try {
    for (const history of [new MemoryChatHistory(), new FileChatHistory({ dir: directory })]) {
      await history.saveConversation({ id: 'c1', userId: 'u1', title: 'First' });
      const stored = await history.addMessages('c1', [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'hello', metadata: { references: [] } }]);
      assert.ok(stored[0].id && stored[0].createdAt);
      await history.addMessages('c2', [{ role: 'user', content: 'other' }]);
      assert.deepStrictEqual((await history.getMessages('c1')).map((m) => m.content), ['hi', 'hello']);
      assert.deepStrictEqual((await history.getMessages('c1', { limit: 1 })).map((m) => m.content), ['hello']);
      const conversation = await history.getConversation('c1');
      assert.strictEqual(conversation.title, 'First');
      assert.strictEqual(conversation.userId, 'u1');
      assert.strictEqual(conversation.messageCount, 2);
      assert.deepStrictEqual((await history.listConversations({ userId: 'u1' })).map((c) => c.id), ['c1']);
      assert.strictEqual((await history.listConversations()).length, 2);
      await history.deleteLastMessages('c1', 1);
      assert.strictEqual((await history.getMessages('c1')).length, 1);
      await history.deleteConversation('c1');
      assert.strictEqual(await history.getConversation('c1'), null);
      assert.deepStrictEqual(await history.getMessages('missing'), []);
    }
    assert.throws(() => new FileChatHistory({ dir: directory })._file('..'), /Invalid conversation id/);
    assert.ok(new FileChatHistory({ dir: directory })._file('../x').startsWith(directory), 'ids cannot leave the directory');
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

async function testEmbedder() {
  const embedder = new Embedder({ provider: 'cohere', apiKey: 'k' });
  let captured;
  embedder.remote.getEmbeddings = async (input) => {
    captured = input;
    return input.texts.map((text, index) => ({ index, embedding: [index] }));
  };
  assert.deepStrictEqual(await embedder.embed(['a', 'b'], { kind: 'query' }), [[0], [1]]);
  assert.strictEqual(captured.inputType, 'search_query', 'Cohere queries use search_query');

  const openai = new Embedder({ provider: 'openai', apiKey: 'k', dimensions: 256, batchSize: 1 });
  const batches = [];
  openai.remote.getEmbeddings = async (input) => {
    batches.push(input);
    return [{ index: 0, embedding: [batches.length] }];
  };
  assert.deepStrictEqual(await openai.embed(['a', 'b']), [[1], [2]], 'texts are sent in batches and kept in order');
  assert.strictEqual(batches[0].dimensions, 256);

  await withMockedHttp([{ embeddings: [{ values: [9] }] }], async (calls) => {
    const gemini = new Embedder({ provider: 'gemini', apiKey: 'k' });
    assert.deepStrictEqual(await gemini.embed(['q'], { kind: 'query' }), [[9]]);
    assert.strictEqual(calls[0].body.requests[0].taskType, 'RETRIEVAL_QUERY');
  });
}

async function testAssistant() {
  const knowledge = new MemoryVectorStore({ embedder: fakeEmbed });
  const memory = new MemoryVectorStore({ embedder: fakeEmbed });
  const history = new MemoryChatHistory();
  const assistant = new Assistant({ provider: 'gemini', apiKey: 'k', history, knowledge, memory, systemMessage: 'You are Acme support.', maxHistory: 4 });
  const ids = await assistant.addDocuments([
    { id: 'policy.md', text: 'Refund policy: return within 30 days. Laptop returns take 15 days.', metadata: { title: 'Refunds' } },
    { id: 'shipping.md', text: 'Express shipping takes 2 days.' },
  ]);
  assert.deepStrictEqual(ids, ['policy.md#0', 'shipping.md#0']);

  const streamReply = () => Readable.from([`data: ${JSON.stringify(geminiReply('Express takes 2 days.'))}\r\n\r\n`]);
  await withMockedHttp([{ ...geminiReply('Laptops have 15 days [1].'), modelVersion: 'gemini-x-001' }, streamReply, geminiReply('You asked about laptop returns.')], async (calls) => {
    const first = await assistant.chat('How many days to return a laptop?', { userId: 'u1' });
    assert.strictEqual(first.text, 'Laptops have 15 days [1].');
    assert.strictEqual(first.references[0].id, 'policy.md#0');
    assert.strictEqual(first.references[0].index, 1);
    assert.deepStrictEqual(first.usage, { inputTokens: 10, outputTokens: 2, totalTokens: 12 });
    assert.strictEqual(first.model, 'gemini-x-001', 'the model comes from the response');
    assert.deepStrictEqual(first.references.map((reference) => reference.cited), [true, false], 'only [1] is cited');
    const system = calls[0].body.systemInstruction.parts[0].text;
    assert.ok(system.startsWith('You are Acme support.') && system.includes('[1] Refunds') && system.includes('Laptop returns take 15 days'),
      'numbered sources go into the system instruction');
    assert.strictEqual(calls[0].body.contents.length, 1);

    const events = [];
    for await (const event of assistant.stream('And express shipping days?', { conversationId: first.conversationId, userId: 'u1' })) events.push(event);
    assert.strictEqual(events[0].type, 'start');
    assert.strictEqual(events[events.length - 1].type, 'done');
    // the previous exchange is sent as history
    assert.deepStrictEqual(calls[1].body.contents.map((content) => content.role), ['user', 'model', 'user']);

    // a new conversation recalls the earlier exchange from long-term memory
    const recall = await assistant.chat('What did I ask about laptop returns?', { userId: 'u1' });
    assert.ok(recall.memories.length >= 1 && recall.memories[0].text.includes('laptop'));
    assert.ok(calls[2].body.systemInstruction.parts[0].text.includes('Notes from earlier conversations'));
    const messages = await assistant.getMessages(first.conversationId);
    assert.strictEqual(messages.length, 4);
    assert.strictEqual(messages[1].metadata.references[0].id, 'policy.md#0');
    assert.strictEqual(messages[1].metadata.references[0].cited, true);
  });

  await assert.rejects(assistant.chat('hi', { conversationId: (await history.listConversations())[0].id, userId: 'intruder' }), /belongs to another user/);
  assert.throws(() => new Assistant({ provider: 'openai', apiKey: 'k', googleSearch: true }), /gemini or vertex/);
}

async function testAssistantAttachmentsAndTools() {
  const image = { data: Buffer.from('png').toString('base64'), mimeType: 'image/png', name: 'a.png' };
  const anthropic = new Assistant({ provider: 'anthropic', apiKey: 'k' });
  const openai = new Assistant({ provider: 'openai', apiKey: 'k', model: 'gpt-4.1' });
  const gemini = new Assistant({ provider: 'gemini', apiKey: 'k', googleSearch: true });
  const pdf = { data: 'JVBE', mimeType: 'application/pdf' };

  const anthropicInput = anthropic._createInput('sys');
  anthropic._addUserTurn(anthropicInput, 'what?', [image, pdf]);
  assert.deepStrictEqual(anthropicInput.messages[0].content.map((block) => block.type), ['image', 'document', 'text']);
  const openaiInput = openai._createInput('sys');
  openai._addUserTurn(openaiInput, 'what?', [image]);
  assert.strictEqual(openaiInput.messages[1].content[1].image_url.url, `data:image/png;base64,${image.data}`);
  assert.throws(() => openai._addUserTurn(openai._createInput('sys'), 'x', [pdf]), /image attachments/);
  const geminiInput = gemini._createInput('sys');
  gemini._addUserTurn(geminiInput, 'what?', [image]);
  assert.deepStrictEqual(geminiInput.getChatInput().tools, [{ googleSearch: {} }]);
  assert.strictEqual(geminiInput.messages[0].parts[1].inlineData.mimeType, 'image/png');
  assert.strictEqual(Assistant._readAttachment('gs://bucket/report.pdf').mimeType, 'application/pdf');
  assert.strictEqual(Assistant._readAttachment('data:image/jpeg;base64,QUJD').data, 'QUJD');

  const grounded = {
    candidates: [{ content: { parts: [{ text: 'Node 24 [1]' }] }, groundingMetadata: { groundingChunks: [{ web: { uri: 'https://nodejs.org', title: 'nodejs.org' } }] } }],
  };
  const toolCall = { candidates: [{ content: { parts: [{ functionCall: { name: 'add', args: { a: 1, b: 2 } } }] } }] };
  await withMockedHttp([grounded, toolCall, geminiReply('3'), geminiReply('web'), geminiReply('plain')], async (calls) => {
    const answer = await gemini.chat('Latest Node?');
    assert.deepStrictEqual(answer.citations, [{ title: 'nodejs.org', uri: 'https://nodejs.org' }]);
    const stored = await gemini.getMessages(answer.conversationId);
    assert.deepStrictEqual(stored[1].metadata.citations, answer.citations);

    const calculator = new Assistant({
      provider: 'gemini', apiKey: 'k',
      tools: [{ name: 'add', description: 'Add', parameters: { type: 'object', properties: { a: { type: 'number' }, b: { type: 'number' } } }, handler: ({ a, b }) => a + b }],
    });
    const sum = await calculator.chat('1 + 2?');
    assert.strictEqual(sum.text, '3');
    assert.strictEqual(sum.toolSteps[0].result, 3);

    // Google Search for one turn only
    const plain = new Assistant({ provider: 'gemini', apiKey: 'k' });
    await plain.chat('news?', { googleSearch: true });
    assert.deepStrictEqual(calls[3].body.tools, [{ googleSearch: {} }]);
    await plain.chat('hello');
    assert.strictEqual(calls[4].body.tools, undefined);
    await assert.rejects(new Assistant({ provider: 'openai', apiKey: 'k' }).chat('x', { googleSearch: true }), /gemini or vertex/);
  });
}

async function testFirestoreStores() {
  // vector encoding matches the Firestore SDKs
  assert.deepStrictEqual(Firestore.toValue(new FirestoreVector([0.5])), {
    mapValue: { fields: { __type__: { stringValue: '__vector__' }, value: { arrayValue: { values: [{ doubleValue: 0.5 }] } } } },
  });
  assert.deepStrictEqual(Firestore.fromFields(Firestore.toFields({ a: 1, b: 1.5, c: 'x', d: [true, null], e: { f: 'g' } })), { a: 1, b: 1.5, c: 'x', d: [true, null], e: { f: 'g' } });
  assert.strictEqual(Firestore.docId('docs/a.md#0'), 'docs%2Fa%2Emd%230');

  const root = 'projects/p1/databases/(default)/documents';
  const document = (id, distance) => ({
    document: {
      name: `${root}/vectors/${id}`,
      fields: Firestore.toFields({ id, text: `text ${id}`, metadata: { lang: 'en' }, _distance: distance }),
    },
  });
  await withMockedHttp([{}, [document('a', 0.1), document('b', 0.4)], {}], async (calls) => {
    const store = new FirestoreVectorStore({ projectId: 'p1', collection: 'vectors', accessToken: 'tok' });
    await store.upsert([{ id: 'a', vector: [1, 0], text: 'text a', metadata: { lang: 'en' } }]);
    assert.strictEqual(calls[0].url, `https://firestore.googleapis.com/v1/${root}:commit`);
    assert.strictEqual(calls[0].headers.Authorization, 'Bearer tok');
    const write = calls[0].body.writes[0].update;
    assert.strictEqual(write.name, `${root}/vectors/a`);
    assert.strictEqual(write.fields.embedding.mapValue.fields.__type__.stringValue, '__vector__');

    const hits = await store.query({ vector: [1, 0], topK: 2, filter: { lang: 'en' } });
    assert.deepStrictEqual(hits.map((hit) => [hit.id, Number(hit.score.toFixed(2))]), [['a', 0.9], ['b', 0.6]], 'cosine distance becomes 1 - distance');
    const query = calls[1].body.structuredQuery;
    assert.strictEqual(calls[1].url, `https://firestore.googleapis.com/v1/${root}:runQuery`);
    assert.deepStrictEqual(query.where, { fieldFilter: { field: { fieldPath: 'metadata.lang' }, op: 'EQUAL', value: { stringValue: 'en' } } });
    assert.strictEqual(query.findNearest.distanceMeasure, 'COSINE');
    assert.strictEqual(query.findNearest.distanceResultField, '_distance');

    await store.delete(['a']);
    assert.deepStrictEqual(calls[2].body.writes, [{ delete: `${root}/vectors/a` }]);
    assert.ok(store.indexCommand(768).includes('"dimension":"768"'));
  });

  const conversationName = `${root}/conversations/c1`;
  const notFound = Object.assign(new Error('HTTP error 404: {}'), { status: 404 });
  const messageDoc = (id, role, content, seq) => ({ document: { name: `${conversationName}/messages/${id}`, fields: Firestore.toFields({ id, role, content, createdAt: '2026-10-05T00:00:00.000Z', seq }) } });
  await withMockedHttp([
    notFound, {},
    {},
    [messageDoc('m2', 'assistant', 'hello', 2), messageDoc('m1', 'user', 'hi', 1)],
    [{ document: { name: conversationName, fields: Firestore.toFields({ userId: 'u1', updatedAt: '2026-10-05T01:00:00.000Z' }) } }],
    [messageDoc('m2', 'assistant', 'hello', 2), messageDoc('m1', 'user', 'hi', 1)], {},
  ], async (calls) => {
    const history = new FirestoreChatHistory({ projectId: 'p1', accessToken: 'tok' });
    await history.saveConversation({ id: 'c1', userId: 'u1' });
    assert.strictEqual(calls[1].body.writes[0].update.name, conversationName);
    await history.addMessages('c1', [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'hello' }]);
    const writes = calls[2].body.writes;
    assert.ok(writes[0].update.name.startsWith(`${conversationName}/messages/`));
    assert.ok(Number(writes[1].update.fields.seq.integerValue) > Number(writes[0].update.fields.seq.integerValue), 'seq keeps the order of one batch');
    assert.deepStrictEqual(writes[2].updateMask, { fieldPaths: ['updatedAt'] });
    assert.deepStrictEqual((await history.getMessages('c1', { limit: 2 })).map((message) => message.content), ['hi', 'hello'], 'oldest first');
    assert.deepStrictEqual(calls[3].body.structuredQuery.orderBy, [{ field: { fieldPath: 'seq' }, direction: 'DESCENDING' }]);
    const conversations = await history.listConversations({ userId: 'u1' });
    assert.deepStrictEqual(conversations.map((conversation) => conversation.id), ['c1']);
    assert.deepStrictEqual(calls[4].body.structuredQuery.where, { fieldFilter: { field: { fieldPath: 'userId' }, op: 'EQUAL', value: { stringValue: 'u1' } } });
    await history.deleteConversation('c1');
    assert.deepStrictEqual(calls[6].body.writes.map((write) => write.delete), [`${conversationName}/messages/m2`, `${conversationName}/messages/m1`, conversationName]);
  });
}

async function testVertexStores() {
  const corpus = 'projects/p1/locations/europe-west4/ragCorpora/123';
  await withMockedHttp([
    { contexts: { contexts: [{ sourceUri: 'policy.pdf', sourceDisplayName: 'Policy', text: 'Refunds in 30 days', score: 0.25, chunk: { chunkId: 'c9', pageSpan: { firstPage: 2, lastPage: 2 } } }] } },
    { ragFile: { name: `${corpus}/ragFiles/f1` } },
    { name: 'projects/p1/locations/europe-west4/operations/o1', done: true, response: { importedRagFilesCount: '2' } },
  ], async (calls) => {
    const rag = new VertexRAGStore({ projectId: 'p1', location: 'europe-west4', corpus: '123', accessToken: 'tok' });
    const hits = await rag.query({ text: 'refunds', topK: 3 });
    assert.deepStrictEqual(hits, [{ id: 'c9', score: 0.75, text: 'Refunds in 30 days', metadata: { source: 'policy.pdf', title: 'Policy', pages: { firstPage: 2, lastPage: 2 } } }]);
    assert.strictEqual(calls[0].url, 'https://europe-west4-aiplatform.googleapis.com/v1/projects/p1/locations/europe-west4:retrieveContexts');
    assert.deepStrictEqual(calls[0].body, { vertexRagStore: { ragResources: [{ ragCorpus: corpus }] }, query: { text: 'refunds', ragRetrievalConfig: { topK: 3 } } });

    const names = await rag.addDocuments([{ id: 'faq', text: 'Q and A' }]);
    assert.deepStrictEqual(names, [`${corpus}/ragFiles/f1`]);
    assert.strictEqual(calls[1].url, `https://europe-west4-aiplatform.googleapis.com/upload/v1/${corpus}/ragFiles:upload`);
    assert.strictEqual(calls[1].headers['X-Goog-Upload-Protocol'], 'multipart');
    assert.strictEqual(typeof calls[1].body.getBuffer, 'function', 'the upload is multipart form data');
    const form = calls[1].body.getBuffer().toString();
    assert.ok(form.includes('"displayName":"faq.txt"') && form.includes('"chunkSize":512') && form.includes('Q and A'));

    const result = await rag.importFiles(['gs://bucket/docs/', 'https://drive.google.com/drive/folders/FOLDER1']);
    assert.deepStrictEqual(result, { importedRagFilesCount: '2' });
    const importConfig = calls[2].body.importRagFilesConfig;
    assert.deepStrictEqual(importConfig.gcsSource, { uris: ['gs://bucket/docs/'] });
    assert.deepStrictEqual(importConfig.googleDriveSource.resourceIds, [{ resourceType: 'RESOURCE_TYPE_FOLDER', resourceId: 'FOLDER1' }]);
    assert.deepStrictEqual(await rag.tool({ topK: 2 }), { retrieval: { vertexRagStore: { ragResources: [{ ragCorpus: corpus }], ragRetrievalConfig: { topK: 2 } } } });
    await assert.rejects(rag.upsert([]), /embeds files itself/);
    await assert.rejects(rag.query({ vector: [1] }), /queries by text/);
  });

  assert.strictEqual(dataObjectId('doc-1'), 'doc-1');
  const mapped = dataObjectId('Docs/Policy.md#0');
  assert.ok(/^[a-z](?:[-a-z0-9]{0,61}[a-z0-9])?$/.test(mapped), `${mapped} is a valid data object id`);
  assert.strictEqual(mapped, dataObjectId('Docs/Policy.md#0'), 'the mapping is stable');
  assert.notStrictEqual(mapped, dataObjectId('docs/policy.md#0'));

  const notFound = Object.assign(new Error('HTTP error 404'), { status: 404 });
  const collection = 'projects/p1/locations/us-central1/collections/kb';
  await withMockedHttp([notFound, {}, { results: [{ dataObject: { dataObjectId: 'a', data: { text: 'hello', sourceId: 'A', lang: 'en' } }, distance: 0.2 }] }], async (calls) => {
    const store = new VertexVectorSearchStore({ projectId: 'p1', collection: 'kb', accessToken: 'tok' });
    await store.upsert([{ id: 'A', vector: [0.1], text: 'hello', metadata: { lang: 'en' } }]);
    assert.strictEqual(calls[0].method, 'DELETE');
    assert.strictEqual(calls[1].url, `https://vectorsearch.googleapis.com/v1/${collection}/dataObjects:batchCreate`);
    assert.deepStrictEqual(calls[1].body.requests[0].dataObject, { data: { lang: 'en', text: 'hello', sourceId: 'A' }, vectors: { embedding: { dense: { values: [0.1] } } } });
    const hits = await store.query({ vector: [0.1], topK: 1, filter: { lang: 'en' } });
    assert.deepStrictEqual(hits, [{ id: 'A', score: 0.8, text: 'hello', metadata: { lang: 'en' } }]);
    assert.deepStrictEqual(calls[2].body.vectorSearch.filter, { lang: { $eq: 'en' } });
  });

  await withMockedHttp([{}, { nearestNeighbors: [{ neighbors: [{ datapoint: { datapointId: 'a', embeddingMetadata: { text: 't', metadata: { lang: 'en' } } }, distance: 0.9 }] }] }], async (calls) => {
    const store = new VertexVectorSearchIndexStore({
      projectId: 'p1', index: 'i1', indexEndpoint: 'e1', deployedIndexId: 'd1', publicEndpointDomain: '1.us-central1-2.vdb.vertexai.goog', restrictKeys: ['lang'], accessToken: 'tok',
    });
    await store.upsert([{ id: 'a', vector: [1], text: 't', metadata: { lang: 'en' } }]);
    assert.strictEqual(calls[0].url, 'https://us-central1-aiplatform.googleapis.com/v1/projects/p1/locations/us-central1/indexes/i1:upsertDatapoints');
    assert.deepStrictEqual(calls[0].body.datapoints[0].restricts, [{ namespace: 'lang', allowList: ['en'] }]);
    const hits = await store.query({ vector: [1], topK: 1, filter: { lang: 'en' } });
    assert.deepStrictEqual(hits, [{ id: 'a', score: 0.9, text: 't', metadata: { lang: 'en' } }]);
    assert.strictEqual(calls[1].url, 'https://1.us-central1-2.vdb.vertexai.goog/v1/projects/p1/locations/us-central1/indexEndpoints/e1:findNeighbors');
  });
}

async function testAssistantStores() {
  testTextSplitter();
  await testHistories();
  await testEmbedder();
  await testAssistant();
  await testAssistantAttachmentsAndTools();
  await testFirestoreStores();
  await testVertexStores();
  console.log('Assistant, history and Google Cloud store tests passed.');
}

module.exports = testAssistantStores;

if (require.main === module) {
  testAssistantStores().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
