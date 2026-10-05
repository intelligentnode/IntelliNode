const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const FetchClient = require('../../utils/FetchClient');
const { VectorStore, matchesFilter, cosineSimilarity } = require('../../store/VectorStore');
const { MemoryVectorStore } = require('../../store/MemoryVectorStore');
const { PineconeVectorStore } = require('../../store/PineconeVectorStore');
const { QdrantVectorStore, stableUuid } = require('../../store/QdrantVectorStore');
const { ChromaVectorStore } = require('../../store/ChromaVectorStore');
const { WeaviateVectorStore } = require('../../store/WeaviateVectorStore');
const { MilvusVectorStore } = require('../../store/MilvusVectorStore');
const { ElasticsearchVectorStore } = require('../../store/ElasticsearchVectorStore');
const { PgVectorStore } = require('../../store/PgVectorStore');
const { MongoDBAtlasVectorStore } = require('../../store/MongoDBAtlasVectorStore');

// A deterministic embedder: one axis per keyword, so related texts are close.
const AXES = ['cat', 'dog', 'car'];
const embedText = (text) => AXES.map((word) => (String(text).toLowerCase().includes(word) ? 1 : 0.01));
function fakeEmbedder(log = []) {
  return async (texts, { kind } = {}) => {
    log.push({ texts: [...texts], kind });
    return texts.map(embedText);
  };
}

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} is not ${expected}`);

function httpError(status, body = '') {
  return Object.assign(new Error(`HTTP error ${status}: ${body}`), { status, body });
}

// Every FetchClient request is recorded and answered by reply(call, index), shaped like the real API.
async function withHttp(reply, run, prototypes = [FetchClient.prototype]) {
  const calls = [];
  const originals = prototypes.map((prototype) => [prototype, Object.getOwnPropertyDescriptor(prototype, 'request')]);
  const fake = async function (method, endpoint, data, extraConfig = {}) {
    const call = {
      method,
      url: endpoint.startsWith('http') ? endpoint : this.baseURL + endpoint,
      headers: { ...this.defaultHeaders, ...(extraConfig.headers || {}) },
      body: data,
      extraConfig,
    };
    calls.push(call);
    const response = await reply(call, calls.length - 1);
    if (response instanceof Error) throw response;
    if (extraConfig.responseType === 'text') return typeof response === 'string' ? response : JSON.stringify(response ?? {});
    return response;
  };
  for (const prototype of prototypes) prototype.request = fake;
  try {
    return await run(calls);
  } finally {
    for (const [prototype, descriptor] of originals) {
      if (descriptor) Object.defineProperty(prototype, 'request', descriptor);
      else delete prototype.request;
    }
  }
}

// ---------------------------------------------------------------------
// Base class and memory store
// ---------------------------------------------------------------------

async function testVectorStoreBase() {
  assert.strictEqual(matchesFilter({ a: 1, b: 'x' }, { a: 1 }), true);
  assert.strictEqual(matchesFilter({ a: 1 }, { a: [2, 1] }), true);
  assert.strictEqual(matchesFilter({ a: 1 }, { a: 2 }), false);
  assert.strictEqual(matchesFilter({}, null), true);
  near(cosineSimilarity([1, 0], [1, 0]), 1);
  near(cosineSimilarity([1, 0], [0, 1]), 0);
  assert.strictEqual(cosineSimilarity([0, 0], [1, 0]), 0);
  assert.throws(() => cosineSimilarity([1], [1, 2]), /size mismatch/);

  // addDocuments embeds only records without a vector, as documents; search embeds the query as a query
  const log = [];
  const store = new MemoryVectorStore({ embedder: fakeEmbedder(log) });
  const ids = await store.addDocuments([
    'My cat sleeps.',
    { id: 'dog', text: 'The dog barks.', metadata: { kind: 'pet' } },
    { id: 7, text: 'ignored', vector: [0.01, 0.01, 1] },
  ]);
  assert.strictEqual(ids.length, 3);
  assert.ok(typeof ids[0] === 'string' && ids[0].length > 5);
  assert.deepStrictEqual(ids.slice(1), ['dog', '7']);
  assert.deepStrictEqual(log, [{ texts: ['My cat sleeps.', 'The dog barks.'], kind: 'document' }]);
  const [first] = await store.get([ids[0]]);
  assert.deepStrictEqual(first.metadata, {});

  const hits = await store.search('a cat', 2);
  assert.strictEqual(log[1].kind, 'query');
  assert.strictEqual(hits.length, 2);
  assert.strictEqual(hits[0].id, ids[0]);
  assert.strictEqual(hits[0].text, 'My cat sleeps.');
  near(hits[0].score, 1);
  assert.ok(hits[0].score > hits[1].score);

  // query takes a text through the embedder, and a filter
  const dogs = await store.query({ text: 'dog', topK: 5, filter: { kind: 'pet' } });
  assert.deepStrictEqual(dogs.map((hit) => hit.id), ['dog']);

  // embedder objects with embed(), and errors
  const objectStore = new MemoryVectorStore({ embedder: { embed: async (texts) => texts.map(embedText) } });
  assert.deepStrictEqual(await objectStore.embed('car'), [embedText('car')]);
  await assert.rejects(new MemoryVectorStore().addDocuments(['x']), /has no embedder/);
  await assert.rejects(new MemoryVectorStore().query({}), /needs a vector/);
  const short = new MemoryVectorStore({ embedder: async () => [[1, 0, 0]] });
  await assert.rejects(short.addDocuments(['a', 'b']), /returned 1 vectors for 2 texts/);
  await assert.rejects(new VectorStore().upsert([]), /not implemented/);
}

async function testMemoryVectorStore() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'intellinode-vectors-'));
  const file = path.join(directory, 'nested', 'store.json');
  try {
    const store = new MemoryVectorStore({ path: file });
    await store.upsert([
      { id: 'a', vector: [1, 0, 0], text: 'Alpha', metadata: { topic: 'x', lang: 'en' } },
      { id: 'b', vector: [0.8, 0.6, 0], text: 'Beta', metadata: { topic: 'y', lang: 'fr' } },
      { id: 'c', vector: [0, 0, 1], metadata: { topic: 'x', lang: 'de' } },
    ]);
    let hits = await store.query({ vector: [1, 0.1, 0], topK: 3 });
    assert.deepStrictEqual(hits.map((hit) => hit.id), ['a', 'b', 'c']);
    near(hits[0].score, cosineSimilarity([1, 0.1, 0], [1, 0, 0]));
    assert.strictEqual(hits[2].text, null);

    hits = await store.query({ vector: [1, 0.1, 0], filter: { topic: 'x' } });
    assert.deepStrictEqual(hits.map((hit) => hit.id), ['a', 'c']);
    hits = await store.query({ vector: [1, 0.1, 0], filter: { lang: ['fr', 'de'] } });
    assert.deepStrictEqual(hits.map((hit) => hit.id), ['b', 'c']);
    hits = await store.query({ vector: [1, 0.1, 0], filter: { topic: 'x' }, nativeFilter: (metadata) => metadata.lang === 'fr' });
    assert.deepStrictEqual(hits.map((hit) => hit.id), ['b']);
    assert.strictEqual((await store.query({ vector: [1, 0, 0], topK: 1 })).length, 1);

    // the records survive in the file and load in a new instance
    assert.ok(fs.existsSync(file));
    assert.ok(!fs.existsSync(`${file}.tmp`));
    const reopened = new MemoryVectorStore({ path: file });
    assert.strictEqual(await reopened.count(), 3);
    assert.deepStrictEqual((await reopened.get(['b']))[0].metadata, { topic: 'y', lang: 'fr' });

    await reopened.delete(['a']);
    assert.strictEqual(await new MemoryVectorStore({ path: file }).count(), 2);
    await reopened.clear({ topic: 'x' });
    assert.deepStrictEqual((await reopened.query({ vector: [1, 0, 0] })).map((hit) => hit.id), ['b']);
    await reopened.clear();
    assert.strictEqual(await new MemoryVectorStore({ path: file }).count(), 0);

    await assert.rejects(store.upsert([{ id: 'x' }]), /has no vector/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------
// Pinecone
// ---------------------------------------------------------------------

async function testPinecone() {
  const store = new PineconeVectorStore({ apiKey: 'pc-key', indexHost: 'docs-abc.svc.pinecone.io/', namespace: 'ns', batchSize: 2, embedder: fakeEmbedder() });
  assert.ok(store.client instanceof FetchClient);
  assert.throws(() => new PineconeVectorStore({ indexHost: 'h' }), /apiKey/);

  const reply = (call) => {
    if (call.url.endsWith('/query')) {
      return {
        matches: [
          { id: 'b', score: 0.2, metadata: { topic: 'y' } },
          { id: 'a', score: 0.9, metadata: { topic: 'x', text: 'Alpha' } },
        ],
        namespace: 'ns',
      };
    }
    return call.url.endsWith('/vectors/upsert') ? { upsertedCount: call.body.vectors.length } : {};
  };

  await withHttp(reply, async (calls) => {
    const ids = await store.upsert([
      { id: 'a', vector: [1, 0, 0], text: 'Alpha', metadata: { topic: 'x', empty: null } },
      { id: 'b', vector: [0, 1, 0] },
      { id: 'c', vector: [0, 0, 1], text: 'Gamma' },
    ]);
    assert.deepStrictEqual(ids, ['a', 'b', 'c']);
    assert.strictEqual(calls.length, 2);
    assert.strictEqual(calls[0].method, 'POST');
    assert.strictEqual(calls[0].url, 'https://docs-abc.svc.pinecone.io/vectors/upsert');
    assert.strictEqual(calls[0].headers['Api-Key'], 'pc-key');
    assert.strictEqual(calls[0].headers['X-Pinecone-Api-Version'], '2026-07');
    assert.deepStrictEqual(calls[0].body, {
      vectors: [{ id: 'a', values: [1, 0, 0], metadata: { topic: 'x', text: 'Alpha' } }, { id: 'b', values: [0, 1, 0] }],
      namespace: 'ns',
    });
    assert.deepStrictEqual(calls[1].body, { vectors: [{ id: 'c', values: [0, 0, 1], metadata: { text: 'Gamma' } }], namespace: 'ns' });

    const hits = await store.query({ text: 'cat', topK: 2, filter: { topic: 'x', lang: ['en', 'fr'] } });
    assert.strictEqual(calls[2].url, 'https://docs-abc.svc.pinecone.io/query');
    assert.deepStrictEqual(calls[2].body, {
      vector: embedText('cat'),
      topK: 2,
      includeMetadata: true,
      includeValues: false,
      namespace: 'ns',
      filter: { topic: { $eq: 'x' }, lang: { $in: ['en', 'fr'] } },
    });
    assert.deepStrictEqual(hits, [
      { id: 'a', score: 0.9, text: 'Alpha', metadata: { topic: 'x' } },
      { id: 'b', score: 0.2, text: null, metadata: { topic: 'y' } },
    ]);

    await store.query({ vector: [1, 0, 0], filter: { topic: 'x' }, nativeFilter: { year: { $gte: 2020 } } });
    assert.deepStrictEqual(calls[3].body.filter, { year: { $gte: 2020 } });
    assert.strictEqual(calls[3].body.topK, 5);

    await store.delete(['a', 'b']);
    assert.strictEqual(calls[4].url, 'https://docs-abc.svc.pinecone.io/vectors/delete');
    assert.deepStrictEqual(calls[4].body, { ids: ['a', 'b'], namespace: 'ns' });
  });

  // no namespace, https host kept, euclidean distances become similarities
  const euclid = new PineconeVectorStore({ apiKey: 'k', indexHost: 'https://host.pinecone.io', metric: 'euclidean', apiVersion: '2025-10' });
  await withHttp(() => ({ matches: [{ id: 'far', score: 3 }, { id: 'close', score: 1 }] }), async (calls) => {
    const hits = await euclid.query({ vector: [1, 0] });
    assert.strictEqual(calls[0].url, 'https://host.pinecone.io/query');
    assert.strictEqual(calls[0].headers['X-Pinecone-Api-Version'], '2025-10');
    assert.ok(!('namespace' in calls[0].body));
    assert.deepStrictEqual(hits.map((hit) => [hit.id, hit.score]), [['close', 0.5], ['far', 0.25]]);
  });

  // errors name the store and keep status and body
  await withHttp(() => httpError(401, '{"error":"invalid key"}'), async () => {
    await assert.rejects(store.delete(['a']), (error) => error.message.startsWith('Pinecone error: HTTP error 401')
      && error.status === 401 && error.body === '{"error":"invalid key"}');
  });
}

// ---------------------------------------------------------------------
// Qdrant
// ---------------------------------------------------------------------

async function testQdrant() {
  // UUID v5 in the DNS namespace, as uuid.uuid5(uuid.NAMESPACE_DNS, id) in Python
  assert.strictEqual(stableUuid('doc-1'), 'eea9cb72-744e-5814-a929-652d970d86ac');
  assert.strictEqual(stableUuid('héllo wörld ✓'), '2f61da51-3dde-5e00-b999-51a7cb5f532e');
  assert.strictEqual(stableUuid(''), '4ebd0208-8328-5d69-8c44-ec50939c0967');
  assert.strictEqual(stableUuid('EEA9CB72-744E-5814-A929-652D970D86AC'), 'eea9cb72-744e-5814-a929-652d970d86ac');
  // the pure JavaScript SHA-1 (browser, older Node) gives the same ids as Node crypto
  const getBuiltinModule = process.getBuiltinModule;
  const samples = ['doc-1', 'x'.repeat(200), 'ünïcødé ✓', '55', ''];
  const withCrypto = samples.map(stableUuid);
  try {
    process.getBuiltinModule = undefined;
    assert.deepStrictEqual(samples.map(stableUuid), withCrypto);
    assert.strictEqual(stableUuid('a'), '4f3f2898-69e3-5a0d-820a-c4e87987dbce');
  } finally {
    process.getBuiltinModule = getBuiltinModule;
  }

  const store = new QdrantVectorStore({ url: 'http://qdrant.test:6333/', apiKey: 'qd-key', collection: 'docs', embedder: fakeEmbedder() });
  assert.ok(store.client instanceof FetchClient);
  const reply = (call) => {
    if (call.url.endsWith('/exists')) return { result: { exists: false }, status: 'ok' };
    if (call.url.endsWith('/points/query')) {
      return {
        result: {
          points: [
            { id: stableUuid('b'), version: 1, score: 0.4, payload: { text: null, metadata: { topic: 'y' }, id: 'b' } },
            { id: stableUuid('a'), version: 1, score: 0.95, payload: { text: 'Alpha', metadata: { topic: 'x' }, id: 'a' } },
            { id: 42, version: 1, score: 0.1, payload: {} },
          ],
        },
        status: 'ok',
      };
    }
    return { result: call.method === 'PUT' && call.url.endsWith('/docs') ? true : { status: 'completed', operation_id: 1 }, status: 'ok' };
  };
  await withHttp(reply, async (calls) => {
    const ids = await store.upsert([
      { id: 'a', vector: [1, 0, 0], text: 'Alpha', metadata: { topic: 'x' } },
      { id: 'b', vector: [0, 1, 0] },
    ]);
    assert.deepStrictEqual(ids, ['a', 'b']);
    assert.deepStrictEqual(calls.map((call) => `${call.method} ${call.url}`), [
      'GET http://qdrant.test:6333/collections/docs/exists',
      'PUT http://qdrant.test:6333/collections/docs',
      'PUT http://qdrant.test:6333/collections/docs/points?wait=true',
    ]);
    assert.strictEqual(calls[0].headers['api-key'], 'qd-key');
    assert.deepStrictEqual(calls[1].body, { vectors: { size: 3, distance: 'Cosine' } });
    assert.strictEqual(calls[1].extraConfig.retries, 0);
    assert.deepStrictEqual(calls[2].body, {
      points: [
        { id: stableUuid('a'), vector: [1, 0, 0], payload: { text: 'Alpha', metadata: { topic: 'x' }, id: 'a' } },
        { id: stableUuid('b'), vector: [0, 1, 0], payload: { text: null, metadata: {}, id: 'b' } },
      ],
    });

    // the collection is checked once per store
    await store.upsert([{ id: 'c', vector: [0, 0, 1] }]);
    assert.strictEqual(calls.length, 4);

    const hits = await store.query({ text: 'cat', topK: 3, filter: { topic: 'x', lang: ['en', 'fr'] } });
    assert.strictEqual(calls[4].url, 'http://qdrant.test:6333/collections/docs/points/query');
    assert.deepStrictEqual(calls[4].body, {
      query: embedText('cat'),
      limit: 3,
      with_payload: true,
      filter: { must: [{ key: 'metadata.topic', match: { value: 'x' } }, { key: 'metadata.lang', match: { any: ['en', 'fr'] } }] },
    });
    assert.deepStrictEqual(hits, [
      { id: 'a', score: 0.95, text: 'Alpha', metadata: { topic: 'x' } },
      { id: 'b', score: 0.4, text: null, metadata: { topic: 'y' } },
      { id: '42', score: 0.1, text: null, metadata: {} },
    ]);

    await store.query({ vector: [1, 0, 0], filter: { topic: 'x' }, nativeFilter: { must_not: [{ key: 'metadata.topic', match: { value: 'y' } }] } });
    assert.deepStrictEqual(calls[5].body.filter, { must_not: [{ key: 'metadata.topic', match: { value: 'y' } }] });
    assert.ok(!('filter' in (await store.query({ vector: [1, 0, 0] }), calls[6].body)));

    await store.delete(['a', 'b']);
    assert.strictEqual(calls[7].method, 'POST');
    assert.strictEqual(calls[7].url, 'http://qdrant.test:6333/collections/docs/points/delete?wait=true');
    assert.deepStrictEqual(calls[7].body, { points: [stableUuid('a'), stableUuid('b')] });
  });

  // a named vector, Euclid distances, and a collection created by a concurrent call (409, then it exists)
  const named = new QdrantVectorStore({ collection: 'img', vectorName: 'clip', distance: 'Euclid' });
  let existsChecks = 0;
  await withHttp((call) => {
    if (call.url.endsWith('/exists')) return { result: { exists: existsChecks++ > 0 } };
    if (call.method === 'PUT' && call.url.endsWith('/collections/img')) return httpError(409, '{"status":{"error":"already exists"}}');
    if (call.url.endsWith('/points/query')) return { result: { points: [{ id: 1, score: 3, payload: { id: 'far' } }, { id: 2, score: 0, payload: { id: 'same' } }] } };
    return { result: { status: 'completed' } };
  }, async (calls) => {
    await named.upsert([{ id: 'p', vector: [1, 2] }]);
    assert.strictEqual(calls[0].url, 'http://localhost:6333/collections/img/exists');
    assert.deepStrictEqual(calls[1].body, { vectors: { clip: { size: 2, distance: 'Euclid' } } });
    assert.deepStrictEqual(calls[3].body.points[0].vector, { clip: [1, 2] });
    const hits = await named.query({ vector: [1, 2] });
    assert.strictEqual(calls[4].body.using, 'clip');
    assert.deepStrictEqual(hits.map((hit) => [hit.id, hit.score]), [['same', 1], ['far', 0.25]]);
  });

  // createCollection: false never checks; errors keep their status
  const fixed = new QdrantVectorStore({ collection: 'docs', createCollection: false });
  await withHttp(() => httpError(404, '{"status":{"error":"Not found: Collection `docs` doesn\'t exist!"}}'), async (calls) => {
    await assert.rejects(fixed.upsert([{ id: 'a', vector: [1] }]), (error) => error.message.startsWith('Qdrant error: HTTP error 404') && error.status === 404);
    assert.strictEqual(calls.length, 1);
    assert.ok(calls[0].url.endsWith('/points?wait=true'));
  });
}

// ---------------------------------------------------------------------
// Chroma
// ---------------------------------------------------------------------

async function testChroma() {
  const store = new ChromaVectorStore({ url: 'https://chroma.test/', collection: 'docs', apiKey: 'ck-key', embedder: fakeEmbedder() });
  assert.ok(store.client instanceof FetchClient);
  const base = 'https://chroma.test/api/v2/tenants/default_tenant/databases/default_database';
  const reply = (call) => {
    if (call.url === `${base}/collections`) {
      return { id: 'col-1', name: 'docs', configuration_json: { hnsw: { space: 'cosine' } }, metadata: { 'hnsw:space': 'cosine' } };
    }
    if (call.url.endsWith('/query')) {
      return {
        ids: [['b', 'a']],
        documents: [[null, 'Alpha']],
        metadatas: [[null, { topic: 'x' }]],
        distances: [[0.6, 0.1]],
        embeddings: null,
        include: ['documents', 'metadatas', 'distances'],
      };
    }
    if (call.url.endsWith('/delete')) return { deleted: 2 };
    return {};
  };
  await withHttp(reply, async (calls) => {
    const ids = await store.upsert([
      { id: 'a', vector: [1, 0, 0], text: 'Alpha', metadata: { topic: 'x' } },
      { id: 'b', vector: [0, 1, 0] },
    ]);
    assert.deepStrictEqual(ids, ['a', 'b']);
    assert.strictEqual(calls[0].method, 'POST');
    assert.strictEqual(calls[0].url, `${base}/collections`);
    assert.strictEqual(calls[0].headers['x-chroma-token'], 'ck-key');
    assert.deepStrictEqual(calls[0].body, { name: 'docs', metadata: { 'hnsw:space': 'cosine' }, get_or_create: true });
    assert.strictEqual(calls[1].url, `${base}/collections/col-1/upsert`);
    assert.strictEqual(calls[1].extraConfig.responseType, 'text');
    assert.deepStrictEqual(calls[1].body, {
      ids: ['a', 'b'],
      embeddings: [[1, 0, 0], [0, 1, 0]],
      documents: ['Alpha', null],
      metadatas: [{ topic: 'x' }, null],
    });
    assert.strictEqual(store.collectionId, 'col-1');

    const hits = await store.query({ text: 'cat', topK: 2, filter: { topic: 'x', lang: ['en', 'fr'] } });
    assert.strictEqual(calls.length, 3);
    assert.strictEqual(calls[2].url, `${base}/collections/col-1/query`);
    assert.deepStrictEqual(calls[2].body, {
      query_embeddings: [embedText('cat')],
      n_results: 2,
      include: ['documents', 'metadatas', 'distances'],
      where: { $and: [{ topic: { $eq: 'x' } }, { lang: { $in: ['en', 'fr'] } }] },
    });
    assert.strictEqual(hits[0].id, 'a');
    near(hits[0].score, 0.9);
    assert.strictEqual(hits[0].text, 'Alpha');
    assert.deepStrictEqual(hits[0].metadata, { topic: 'x' });
    assert.deepStrictEqual([hits[1].id, hits[1].text, hits[1].metadata], ['b', null, {}]);
    near(hits[1].score, 0.4);

    await store.query({ vector: [1, 0, 0], filter: { topic: 'x' } });
    assert.deepStrictEqual(calls[3].body.where, { topic: { $eq: 'x' } });
    await store.query({ vector: [1, 0, 0], filter: { topic: 'x' }, nativeFilter: { year: { $gte: 2020 } } });
    assert.deepStrictEqual(calls[4].body.where, { year: { $gte: 2020 } });

    await store.delete(['a', 'b']);
    assert.strictEqual(calls[5].url, `${base}/collections/col-1/delete`);
    assert.deepStrictEqual(calls[5].body, { ids: ['a', 'b'] });
  });

  // an existing l2 collection in another tenant and database: squared distances become 1 / (1 + d)
  const l2 = new ChromaVectorStore({ collection: 'old', tenant: 'team a', database: 'prod' });
  await withHttp((call) => (call.url.endsWith('/collections')
    ? { id: 'col-2', configuration_json: { hnsw: { space: 'l2' } } }
    : { ids: [['p']], documents: [['P']], metadatas: [[{}]], distances: [[1]] }), async (calls) => {
    const hits = await l2.query({ vector: [1, 0] });
    assert.strictEqual(calls[0].url, 'http://localhost:8000/api/v2/tenants/team%20a/databases/prod/collections');
    assert.strictEqual(calls[1].url, 'http://localhost:8000/api/v2/tenants/team%20a/databases/prod/collections/col-2/query');
    assert.strictEqual(l2.space, 'l2');
    assert.deepStrictEqual(hits, [{ id: 'p', score: 0.5, text: 'P', metadata: {} }]);
  });

  // a failed get-or-create is retried on the next call
  const flaky = new ChromaVectorStore({ collection: 'docs' });
  let attempts = 0;
  await withHttp((call) => {
    if (call.url.endsWith('/collections')) return attempts++ === 0 ? httpError(500, 'boom') : { id: 'col-3' };
    return {};
  }, async () => {
    await assert.rejects(flaky.delete(['a']), (error) => error.message === 'Chroma error: HTTP error 500: boom' && error.status === 500);
    await flaky.delete(['a']);
    assert.strictEqual(flaky.collectionId, 'col-3');
  });
}

// ---------------------------------------------------------------------
// Weaviate
// ---------------------------------------------------------------------

async function testWeaviate() {
  const store = new WeaviateVectorStore({ url: 'https://weaviate.test', apiKey: 'wv-key', className: 'docs', embedder: fakeEmbedder() });
  assert.strictEqual(store.className, 'Docs');
  assert.ok(store.client instanceof FetchClient);
  assert.throws(() => new WeaviateVectorStore({ className: 'Bad-Name' }), /Invalid Weaviate class name/);

  const reply = (call) => {
    if (call.url.endsWith('/v1/schema/Docs')) return httpError(404, '');
    if (call.url.endsWith('/v1/schema')) return { class: 'Docs' };
    if (call.url.endsWith('/v1/batch/objects') && call.method === 'POST') {
      return call.body.objects.map((object) => ({ id: object.id, class: object.class, result: {} }));
    }
    if (call.url.endsWith('/v1/graphql')) {
      return {
        data: {
          Get: {
            Docs: [
              { text: null, recordId: 'b', metadataJson: '{"topic":"y"}', _additional: { id: stableUuid('b'), distance: 0.7 } },
              { text: 'Alpha', recordId: 'a', metadataJson: '{"topic":"x","nested":{"k":1}}', _additional: { id: stableUuid('a'), distance: 0.05 } },
            ],
          },
        },
      };
    }
    return { results: { matches: 2, successful: 2, failed: 0 } };
  };

  await withHttp(reply, async (calls) => {
    const ids = await store.upsert([
      { id: 'a', vector: [1, 0, 0], text: 'Alpha', metadata: { topic: 'x', year: 2024, tags: ['p', 'q'], nested: { k: 1 }, Upper: 1, recordId: 'spoof' } },
      { id: 'b', vector: [0, 1, 0] },
    ]);
    assert.deepStrictEqual(ids, ['a', 'b']);
    assert.deepStrictEqual(calls.map((call) => `${call.method} ${call.url}`), [
      'GET https://weaviate.test/v1/schema/Docs',
      'POST https://weaviate.test/v1/schema',
      'POST https://weaviate.test/v1/batch/objects',
    ]);
    assert.strictEqual(calls[0].headers.Authorization, 'Bearer wv-key');
    assert.deepStrictEqual(calls[1].body, {
      class: 'Docs',
      properties: [
        { name: 'text', dataType: ['text'] },
        { name: 'recordId', dataType: ['text'], tokenization: 'field' },
        { name: 'metadataJson', dataType: ['text'], indexFilterable: false, indexSearchable: false },
      ],
      vectorConfig: { default: { vectorizer: { none: {} }, vectorIndexType: 'hnsw', vectorIndexConfig: { distance: 'cosine' } } },
    });
    assert.deepStrictEqual(calls[2].body.objects[0], {
      class: 'Docs',
      id: stableUuid('a'),
      properties: {
        text: 'Alpha',
        recordId: 'a',
        metadataJson: JSON.stringify({ topic: 'x', year: 2024, tags: ['p', 'q'], nested: { k: 1 }, Upper: 1, recordId: 'spoof' }),
        topic: 'x',
        year: 2024,
        tags: ['p', 'q'],
      },
      vectors: { default: [1, 0, 0] },
    });
    assert.deepStrictEqual(calls[2].body.objects[1].properties, { text: null, recordId: 'b', metadataJson: '{}' });

    const hits = await store.query({ text: 'cat', topK: 2, filter: { topic: 'x', lang: ['en', 'fr'], year: 2024, draft: false } });
    assert.strictEqual(calls[3].url, 'https://weaviate.test/v1/graphql');
    const where = '{operator: And, operands: ['
      + '{path: ["topic"], operator: Equal, valueText: "x"}, '
      + '{operator: Or, operands: [{path: ["lang"], operator: Equal, valueText: "en"}, {path: ["lang"], operator: Equal, valueText: "fr"}]}, '
      + '{path: ["year"], operator: Equal, valueNumber: 2024}, '
      + '{path: ["draft"], operator: Equal, valueBoolean: false}]}';
    assert.strictEqual(calls[3].body.query,
      `{ Get { Docs(nearVector: {vector: [1, 0.01, 0.01], targetVectors: ["default"]}, limit: 2, where: ${where}) `
      + '{ text recordId metadataJson _additional { id distance } } } }');
    assert.strictEqual(hits[0].id, 'a');
    near(hits[0].score, 0.95);
    assert.deepStrictEqual(hits[0].metadata, { topic: 'x', nested: { k: 1 } });
    assert.deepStrictEqual([hits[1].id, hits[1].text, hits[1].metadata], ['b', null, { topic: 'y' }]);
    near(hits[1].score, 0.3);

    await store.query({ vector: [1, 0], filter: { topic: 'x' }, nativeFilter: { path: ['year'], operator: 'GreaterThan', valueInt: 2020 } });
    assert.ok(calls[4].body.query.includes('where: {path: ["year"], operator: GreaterThan, valueInt: 2020}'));

    await store.delete(['a', 'b']);
    assert.strictEqual(calls[5].method, 'DELETE');
    assert.strictEqual(calls[5].url, 'https://weaviate.test/v1/batch/objects');
    assert.deepStrictEqual(calls[5].body, {
      match: { class: 'Docs', where: { path: ['id'], operator: 'ContainsAny', valueTextArray: [stableUuid('a'), stableUuid('b')] } },
      output: 'minimal',
    });
    // the class is only read once
    assert.strictEqual(calls.filter((call) => call.url.includes('/v1/schema')).length, 2);
  });

  // an existing legacy class (unnamed vector, dot distance), per-object batch errors and GraphQL errors
  const legacy = new WeaviateVectorStore({ className: 'Legacy' });
  await withHttp((call) => {
    if (call.url.endsWith('/v1/schema/Legacy')) return { class: 'Legacy', vectorizer: 'none', vectorIndexConfig: { distance: 'dot' } };
    if (call.url.endsWith('/v1/batch/objects')) {
      return [{ id: 'x', result: { errors: { error: [{ message: 'vector lengths don\'t match' }] } } }];
    }
    if (call.body.query.includes('limit: 1')) return { data: { Get: { Legacy: [{ text: 'T', recordId: 'r', metadataJson: null, _additional: { id: 'u', distance: -0.8 } }] } } };
    return { errors: [{ message: 'Cannot query field "text"' }] };
  }, async (calls) => {
    await assert.rejects(legacy.upsert([{ id: 'r', vector: [1, 0] }]), /Weaviate error: object x: vector lengths don't match/);
    assert.deepStrictEqual(calls[1].body.objects[0].vector, [1, 0]);
    assert.ok(!('vectors' in calls[1].body.objects[0]));
    assert.deepStrictEqual(await legacy.query({ vector: [1, 0], topK: 1 }), [{ id: 'r', score: 0.8, text: 'T', metadata: {} }]);
    assert.ok(calls[2].body.query.includes('nearVector: {vector: [1, 0]}, limit: 1'));
    await assert.rejects(legacy.query({ vector: [1, 0], topK: 2 }), /Weaviate error: Cannot query field "text"/);
  });

  // an existing class with another named vector uses that one
  const other = new WeaviateVectorStore({ className: 'Named' });
  await withHttp((call) => (call.method === 'GET'
    ? { class: 'Named', vectorConfig: { body: { vectorizer: { none: {} }, vectorIndexConfig: { distance: 'cosine' } } } }
    : { data: { Get: { Named: [] } } }), async (calls) => {
    assert.deepStrictEqual(await other.query({ vector: [1] }), []);
    assert.ok(calls[1].body.query.includes('targetVectors: ["body"]'));
  });
}

// ---------------------------------------------------------------------
// Milvus
// ---------------------------------------------------------------------

async function testMilvus() {
  const store = new MilvusVectorStore({ url: 'http://milvus.test:19530', token: 'root:Milvus', collection: 'docs', dbName: 'rag', embedder: fakeEmbedder() });
  assert.ok(store.client instanceof FetchClient);
  const reply = (call) => {
    if (call.url.endsWith('/collections/has')) return { code: 0, data: { has: false } };
    if (call.url.endsWith('/entities/search')) {
      return {
        code: 0,
        cost: 0,
        data: [
          { id: 'b', distance: 0.3, text: '', metadata: '{"topic":"y"}' },
          { id: 'a', distance: 0.97, text: 'Alpha', metadata: { topic: 'x' } },
        ],
      };
    }
    return { code: 0, data: {} };
  };
  await withHttp(reply, async (calls) => {
    const ids = await store.upsert([
      { id: 'a', vector: [0, 1, 0], text: 'old' },
      { id: 'b', vector: [0, 1, 0] },
      { id: 'a', vector: [1, 0, 0], text: 'Alpha', metadata: { topic: 'x' } },
    ]);
    assert.deepStrictEqual(ids, ['a', 'b', 'a']);
    assert.deepStrictEqual(calls.map((call) => `${call.method} ${call.url}`), [
      'POST http://milvus.test:19530/v2/vectordb/collections/has',
      'POST http://milvus.test:19530/v2/vectordb/collections/create',
      'POST http://milvus.test:19530/v2/vectordb/entities/upsert',
    ]);
    assert.strictEqual(calls[0].headers.Authorization, 'Bearer root:Milvus');
    assert.deepStrictEqual(calls[0].body, { collectionName: 'docs', dbName: 'rag' });
    assert.deepStrictEqual(calls[1].body, {
      collectionName: 'docs',
      dbName: 'rag',
      schema: {
        autoId: false,
        fields: [
          { fieldName: 'id', dataType: 'VarChar', isPrimary: true, elementTypeParams: { max_length: 512 } },
          { fieldName: 'vector', dataType: 'FloatVector', elementTypeParams: { dim: '3' } },
          { fieldName: 'text', dataType: 'VarChar', elementTypeParams: { max_length: 65535 } },
          { fieldName: 'metadata', dataType: 'JSON' },
        ],
      },
      indexParams: [{ fieldName: 'vector', indexName: 'vector', metricType: 'COSINE', indexType: 'AUTOINDEX' }],
    });
    // a repeated id is sent once, with its last values
    assert.deepStrictEqual(calls[2].body, {
      collectionName: 'docs',
      dbName: 'rag',
      data: [
        { id: 'a', vector: [1, 0, 0], text: 'Alpha', metadata: { topic: 'x' } },
        { id: 'b', vector: [0, 1, 0], text: '', metadata: {} },
      ],
    });

    const hits = await store.query({ text: 'cat', topK: 2, filter: { topic: 'x', lang: ['en', 'fr'], year: 2024, quote: 'say "hi"' } });
    assert.strictEqual(calls[3].url, 'http://milvus.test:19530/v2/vectordb/entities/search');
    assert.deepStrictEqual(calls[3].body, {
      collectionName: 'docs',
      dbName: 'rag',
      data: [embedText('cat')],
      annsField: 'vector',
      limit: 2,
      outputFields: ['text', 'metadata'],
      searchParams: { metricType: 'COSINE' },
      filter: 'metadata["topic"] == "x" and metadata["lang"] in ["en", "fr"] and metadata["year"] == 2024 and metadata["quote"] == "say \\"hi\\""',
    });
    assert.deepStrictEqual(hits, [
      { id: 'a', score: 0.97, text: 'Alpha', metadata: { topic: 'x' } },
      { id: 'b', score: 0.3, text: null, metadata: { topic: 'y' } },
    ]);

    await store.query({ vector: [1, 0, 0], filter: { topic: 'x' }, nativeFilter: 'metadata["year"] > 2020' });
    assert.strictEqual(calls[4].body.filter, 'metadata["year"] > 2020');

    await store.delete(['a', 'b"c']);
    assert.strictEqual(calls[5].url, 'http://milvus.test:19530/v2/vectordb/entities/delete');
    assert.deepStrictEqual(calls[5].body, { collectionName: 'docs', dbName: 'rag', filter: 'id in ["a", "b\\"c"]' });
  });

  // Milvus reports failures with HTTP 200 and a code; L2 distances become similarities
  const l2 = new MilvusVectorStore({ collection: 'docs', metricType: 'L2', createCollection: false, consistencyLevel: 'Strong' });
  await withHttp((call) => (call.url.endsWith('/search')
    ? { code: 0, data: [{ id: 7, distance: 3 }, { id: 8, distance: 1, text: 'x' }] }
    : { code: 100, message: 'collection not found[collection=docs]' }), async (calls) => {
    const hits = await l2.query({ vector: [1, 0] });
    assert.strictEqual(calls[0].url, 'http://localhost:19530/v2/vectordb/entities/search');
    assert.strictEqual(calls[0].body.consistencyLevel, 'Strong');
    assert.ok(!('dbName' in calls[0].body));
    assert.deepStrictEqual(hits, [{ id: '8', score: 0.5, text: 'x', metadata: {} }, { id: '7', score: 0.25, text: null, metadata: {} }]);
    await assert.rejects(l2.upsert([{ id: 'a', vector: [1, 0] }]), (error) => error.message === 'Milvus error: collection not found[collection=docs] (code 100)'
      && JSON.parse(error.body).code === 100);
    assert.strictEqual(calls.length, 2);
  });
}

// ---------------------------------------------------------------------
// Elasticsearch
// ---------------------------------------------------------------------

async function testElasticsearch() {
  const store = new ElasticsearchVectorStore({ url: 'https://es.test:9200/', apiKey: 'es-key', index: 'docs', embedder: fakeEmbedder() });
  assert.ok(store.client instanceof FetchClient);
  const ndjsonPrototype = Object.getPrototypeOf(store.client);
  const reply = (call) => {
    if (call.method === 'HEAD') return httpError(404, '');
    if (call.url.startsWith('https://es.test:9200/_bulk')) {
      const actions = call.body.trim().split('\n').map((line) => JSON.parse(line)).filter((line) => line.index || line.delete);
      return {
        took: 3,
        errors: actions.some((action) => action.delete && action.delete._id === 'missing'),
        items: actions.map((action) => (action.index
          ? { index: { _index: 'docs', _id: action.index._id, status: 201, result: 'created' } }
          : { delete: { _index: 'docs', _id: action.delete._id, status: action.delete._id === 'missing' ? 404 : 200, result: action.delete._id === 'missing' ? 'not_found' : 'deleted', ...(action.delete._id === 'missing' ? { error: { type: 'not_found' } } : {}) } })),
      };
    }
    if (call.url.endsWith('/_search')) {
      return {
        hits: {
          total: { value: 2 },
          hits: [
            { _index: 'docs', _id: 'b', _score: 0.6, _source: { text: null, metadata: { topic: 'y' } } },
            { _index: 'docs', _id: 'a', _score: 0.975, _source: { text: 'Alpha', metadata: { topic: 'x' } } },
          ],
        },
      };
    }
    return { acknowledged: true };
  };
  await withHttp(reply, async (calls) => {
    const ids = await store.upsert([
      { id: 'a', vector: [1, 0, 0], text: 'Alpha', metadata: { topic: 'x' } },
      { id: 'b', vector: [0, 1, 0] },
    ]);
    assert.deepStrictEqual(ids, ['a', 'b']);
    assert.deepStrictEqual(calls.map((call) => `${call.method} ${call.url}`), [
      'HEAD https://es.test:9200/docs',
      'PUT https://es.test:9200/docs',
      'POST https://es.test:9200/_bulk?refresh=wait_for',
    ]);
    assert.strictEqual(calls[0].headers.Authorization, 'ApiKey es-key');
    assert.deepStrictEqual(calls[1].body, {
      mappings: {
        dynamic_templates: [{ metadata_strings: { path_match: 'metadata.*', match_mapping_type: 'string', mapping: { type: 'keyword' } } }],
        properties: {
          embedding: { type: 'dense_vector', dims: 3, index: true, similarity: 'cosine' },
          text: { type: 'text' },
          metadata: { type: 'object' },
        },
      },
    });
    assert.strictEqual(calls[2].body, [
      '{"index":{"_index":"docs","_id":"a"}}',
      '{"text":"Alpha","metadata":{"topic":"x"},"embedding":[1,0,0]}',
      '{"index":{"_index":"docs","_id":"b"}}',
      '{"text":null,"metadata":{},"embedding":[0,1,0]}',
      '',
    ].join('\n'));

    const hits = await store.query({ text: 'cat', topK: 2, filter: { topic: 'x', lang: ['en', 'fr'] } });
    assert.strictEqual(calls[3].url, 'https://es.test:9200/docs/_search');
    assert.deepStrictEqual(calls[3].body, {
      knn: {
        field: 'embedding',
        query_vector: embedText('cat'),
        k: 2,
        num_candidates: 100,
        filter: { bool: { filter: [{ term: { 'metadata.topic': 'x' } }, { terms: { 'metadata.lang': ['en', 'fr'] } }] } },
      },
      size: 2,
      _source: { excludes: ['embedding'] },
    });
    // (1 + cos) / 2 back to cos
    assert.strictEqual(hits[0].id, 'a');
    near(hits[0].score, 0.95);
    assert.deepStrictEqual([hits[0].text, hits[0].metadata], ['Alpha', { topic: 'x' }]);
    near(hits[1].score, 0.2);
    assert.deepStrictEqual([hits[1].id, hits[1].text, hits[1].metadata], ['b', null, { topic: 'y' }]);

    await store.query({ vector: [1, 0, 0], topK: 50, filter: { topic: 'x' }, nativeFilter: { range: { 'metadata.year': { gte: 2020 } } } });
    assert.deepStrictEqual(calls[4].body.knn.filter, { range: { 'metadata.year': { gte: 2020 } } });
    assert.strictEqual(calls[4].body.knn.num_candidates, 500);

    // a delete of a missing id is not an error
    await store.delete(['a', 'missing']);
    assert.strictEqual(calls[5].url, 'https://es.test:9200/_bulk?refresh=wait_for');
    assert.strictEqual(calls[5].body, '{"delete":{"_index":"docs","_id":"a"}}\n{"delete":{"_index":"docs","_id":"missing"}}\n');
  }, [FetchClient.prototype, ndjsonPrototype]);

  // per-item bulk failures throw; refresh: false and basic auth
  const basic = new ElasticsearchVectorStore({ index: 'logs', username: 'elastic', password: 'secret', refresh: false, createIndex: false });
  await withHttp(() => ({
    errors: true,
    items: [{ index: { _id: 'a', status: 400, error: { type: 'document_parsing_exception', reason: 'dims mismatch' } } }],
  }), async (calls) => {
    await assert.rejects(basic.upsert([{ id: 'a', vector: [1] }]), (error) => error.message === 'Elasticsearch error: index a: dims mismatch' && error.status === 400);
    assert.strictEqual(calls[0].url, 'http://localhost:9200/_bulk');
    assert.strictEqual(calls[0].headers.Authorization, `Basic ${Buffer.from('elastic:secret').toString('base64')}`);
  }, [FetchClient.prototype, ndjsonPrototype]);
}

// The NDJSON body goes over the wire as is (FetchClient would JSON-encode a string).
async function testElasticsearchBulkOverHttp() {
  const received = [];
  let bulkCalls = 0;
  const server = http.createServer((request, response) => {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => {
      received.push({ method: request.method, url: request.url, headers: request.headers, body });
      const send = (status, data) => {
        response.writeHead(status, { 'Content-Type': 'application/json' });
        response.end(data === undefined ? '' : JSON.stringify(data));
      };
      if (request.method === 'HEAD') return send(200);
      if (!request.url.startsWith('/_bulk')) return send(404, { error: 'unexpected' });
      bulkCalls++;
      if (bulkCalls === 1) return send(429, { error: 'es_rejected_execution_exception' });
      if (body.includes('"reject"')) return send(400, { error: { type: 'illegal_argument_exception' } });
      return send(200, { errors: false, items: [{ index: { _id: 'a', status: 201 } }] });
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const store = new ElasticsearchVectorStore({ url: `http://127.0.0.1:${server.address().port}`, index: 'docs', username: 'elastic', password: 'pässword' });
    store.client.setRequestOptions({ retries: 1, retryDelay: 1, timeout: 5000 });
    assert.deepStrictEqual(await store.upsert([{ id: 'a', vector: [1, 0], text: 'Alpha', metadata: { lang: 'en' } }]), ['a']);
    const bulks = received.filter((entry) => entry.url.startsWith('/_bulk'));
    assert.strictEqual(received[0].method, 'HEAD');
    assert.strictEqual(bulks.length, 2);
    assert.strictEqual(bulks[1].url, '/_bulk?refresh=wait_for');
    assert.strictEqual(bulks[1].headers['content-type'], 'application/x-ndjson');
    assert.strictEqual(bulks[1].headers.authorization, `Basic ${Buffer.from('elastic:pässword', 'utf8').toString('base64')}`);
    assert.strictEqual(bulks[1].body, '{"index":{"_index":"docs","_id":"a"}}\n{"text":"Alpha","metadata":{"lang":"en"},"embedding":[1,0]}\n');

    await assert.rejects(store.upsert([{ id: 'reject', vector: [1, 0] }]), (error) => error.message.startsWith('Elasticsearch error: HTTP error 400')
      && error.status === 400 && JSON.parse(error.body).error.type === 'illegal_argument_exception');

    const cancelled = new AbortController();
    cancelled.abort();
    store.client.setRequestOptions({ signal: cancelled.signal });
    await assert.rejects(store.delete(['a']), (error) => error.name === 'AbortError');
  } finally {
    server.close();
  }
}

// ---------------------------------------------------------------------
// pgvector and MongoDB Atlas (fake driver objects)
// ---------------------------------------------------------------------

function fakePgClient(respond = () => ({ rows: [] })) {
  const calls = [];
  return {
    calls,
    async query(sql, params) {
      const call = { sql: sql.replace(/\s+/g, ' ').trim(), params };
      calls.push(call);
      const result = respond(call);
      if (result instanceof Error) throw result;
      return result;
    },
  };
}

async function testPgVector() {
  assert.throws(() => new PgVectorStore({}), /needs \{ client \}/);
  assert.throws(() => new PgVectorStore({ client: fakePgClient(), table: 'docs; DROP TABLE users' }), /Invalid table name/);
  assert.throws(() => new PgVectorStore({ client: fakePgClient(), table: 'a.b.c' }), /Invalid table name/);
  assert.ok(new PgVectorStore({ client: fakePgClient(), table: 'rag.docs_v2' }));

  const client = fakePgClient((call) => (call.sql.startsWith('SELECT')
    ? { rows: [{ id: 'b', text: null, metadata: '{"topic":"y"}', score: '0.25' }, { id: 'a', text: 'Alpha', metadata: { topic: 'x' }, score: 0.9 }] }
    : { rows: [] }));
  const store = new PgVectorStore({ client, dimension: 3, embedder: fakeEmbedder() });
  const ids = await store.upsert([
    { id: 'a', vector: [0, 1, 0], text: 'old' },
    { id: 'b', vector: [0, 1, 0] },
    { id: 'a', vector: [1, 0, 0], text: 'Alpha', metadata: { topic: 'x' } },
  ]);
  assert.deepStrictEqual(ids, ['a', 'b', 'a']);
  assert.deepStrictEqual(client.calls.slice(0, 3).map((call) => call.sql), [
    'CREATE EXTENSION IF NOT EXISTS vector',
    'CREATE TABLE IF NOT EXISTS intellinode_vectors ( id text PRIMARY KEY, text text, metadata jsonb NOT NULL DEFAULT \'{}\'::jsonb, embedding vector(3) NOT NULL )',
    'CREATE INDEX IF NOT EXISTS intellinode_vectors_embedding_idx ON intellinode_vectors USING hnsw (embedding vector_cosine_ops)',
  ]);
  assert.strictEqual(client.calls[3].sql, 'INSERT INTO intellinode_vectors (id, text, metadata, embedding) VALUES ($1, $2, $3::jsonb, $4::vector), ($5, $6, $7::jsonb, $8::vector) '
    + 'ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, metadata = EXCLUDED.metadata, embedding = EXCLUDED.embedding');
  assert.deepStrictEqual(client.calls[3].params, ['a', 'Alpha', '{"topic":"x"}', '[1,0,0]', 'b', null, '{}', '[0,1,0]']);

  const hits = await store.query({ text: 'cat', topK: 2, filter: { topic: 'x', lang: ['en', 'fr'] } });
  assert.strictEqual(client.calls.length, 5);
  assert.strictEqual(client.calls[4].sql, 'SELECT id, text, metadata, 1 - (embedding <=> $1::vector) AS score FROM intellinode_vectors '
    + 'WHERE $2::jsonb @> (metadata -> $3::text) AND metadata @> $4::jsonb ORDER BY embedding <=> $1::vector LIMIT $5');
  assert.deepStrictEqual(client.calls[4].params, ['[1,0.01,0.01]', '["en","fr"]', 'lang', '{"topic":"x"}', 2]);
  assert.deepStrictEqual(hits, [
    { id: 'a', score: 0.9, text: 'Alpha', metadata: { topic: 'x' } },
    { id: 'b', score: 0.25, text: null, metadata: { topic: 'y' } },
  ]);

  await store.query({ vector: [1, 0, 0], filter: { topic: 'x' }, nativeFilter: { sql: '(metadata->>\'year\')::int > $1 AND text ILIKE $2', params: [2020, '%cat%'] } });
  assert.strictEqual(client.calls[5].sql, 'SELECT id, text, metadata, 1 - (embedding <=> $1::vector) AS score FROM intellinode_vectors '
    + 'WHERE ((metadata->>\'year\')::int > $2 AND text ILIKE $3) ORDER BY embedding <=> $1::vector LIMIT $4');
  assert.deepStrictEqual(client.calls[5].params, ['[1,0,0]', 2020, '%cat%', 5]);
  await store.query({ vector: [1, 0, 0], nativeFilter: 'text IS NOT NULL' });
  assert.ok(client.calls[6].sql.includes('WHERE (text IS NOT NULL) ORDER BY'));

  await store.delete(['a', 'b']);
  assert.strictEqual(client.calls[7].sql, 'DELETE FROM intellinode_vectors WHERE id = ANY($1::text[])');
  assert.deepStrictEqual(client.calls[7].params, [['a', 'b']]);

  // over 2,000 dimensions: no HNSW index; createTable: false runs no DDL
  const wide = fakePgClient();
  await new PgVectorStore({ client: wide, table: 'rag.big' }).upsert([{ id: 'x', vector: new Array(3072).fill(0.5) }]);
  assert.ok(wide.calls[1].sql.includes('CREATE TABLE IF NOT EXISTS rag.big'));
  assert.ok(wide.calls[1].sql.includes('vector(3072)'));
  assert.ok(wide.calls[2].sql.startsWith('INSERT INTO rag.big'));
  const plain = fakePgClient();
  await new PgVectorStore({ client: plain, createTable: false }).upsert([{ id: 'x', vector: [1] }]);
  assert.strictEqual(plain.calls.length, 1);
  assert.ok(plain.calls[0].sql.startsWith('INSERT INTO intellinode_vectors'));

  // driver errors keep their SQLSTATE code
  const failing = fakePgClient(() => Object.assign(new Error('relation "intellinode_vectors" does not exist'), { code: '42P01' }));
  await assert.rejects(new PgVectorStore({ client: failing, createTable: false }).query({ vector: [1] }),
    (error) => error.message === 'pgvector error: relation "intellinode_vectors" does not exist' && error.code === '42P01');
  await assert.rejects(new PgVectorStore({ client: fakePgClient() }).upsert([{ id: 'x', vector: [NaN] }]), /cannot store the value NaN/);
}

function fakeMongoCollection(rows = []) {
  const calls = [];
  return {
    calls,
    async bulkWrite(operations, options) { calls.push({ method: 'bulkWrite', operations, options }); return { upsertedCount: operations.length }; },
    aggregate(pipeline) {
      calls.push({ method: 'aggregate', pipeline });
      return { toArray: async () => rows };
    },
    async deleteMany(filter) { calls.push({ method: 'deleteMany', filter }); return { deletedCount: 1 }; },
    async createSearchIndex(definition) { calls.push({ method: 'createSearchIndex', definition }); return definition.name; },
  };
}

async function testMongoDBAtlas() {
  assert.throws(() => new MongoDBAtlasVectorStore({ collection: {} }), /needs \{ collection \}/);
  const collection = fakeMongoCollection([
    { _id: 'b', metadata: { topic: 'y' }, score: 0.6 },
    { _id: 'a', text: 'Alpha', metadata: { topic: 'x' }, score: 0.975 },
  ]);
  const store = new MongoDBAtlasVectorStore({ collection, embedder: fakeEmbedder() });

  assert.deepStrictEqual(await store.upsert([
    { id: 'a', vector: [1, 0, 0], text: 'Alpha', metadata: { topic: 'x' } },
    { id: 'b', vector: [0, 1, 0] },
  ]), ['a', 'b']);
  assert.deepStrictEqual(collection.calls[0], {
    method: 'bulkWrite',
    operations: [
      { replaceOne: { filter: { _id: 'a' }, replacement: { text: 'Alpha', metadata: { topic: 'x' }, embedding: [1, 0, 0] }, upsert: true } },
      { replaceOne: { filter: { _id: 'b' }, replacement: { text: null, metadata: {}, embedding: [0, 1, 0] }, upsert: true } },
    ],
    options: { ordered: true },
  });

  const hits = await store.query({ text: 'cat', topK: 2, filter: { topic: 'x', lang: ['en', 'fr'] } });
  assert.deepStrictEqual(collection.calls[1].pipeline, [
    {
      $vectorSearch: {
        index: 'vector_index',
        path: 'embedding',
        queryVector: embedText('cat'),
        numCandidates: 40,
        limit: 2,
        filter: { $and: [{ 'metadata.topic': { $eq: 'x' } }, { 'metadata.lang': { $in: ['en', 'fr'] } }] },
      },
    },
    { $project: { _id: 1, text: 1, metadata: 1, score: { $meta: 'vectorSearchScore' } } },
  ]);
  assert.strictEqual(hits[0].id, 'a');
  near(hits[0].score, 0.95);
  assert.deepStrictEqual([hits[0].text, hits[0].metadata], ['Alpha', { topic: 'x' }]);
  near(hits[1].score, 0.2);
  assert.deepStrictEqual([hits[1].id, hits[1].text, hits[1].metadata], ['b', null, { topic: 'y' }]);

  await store.query({ vector: [1, 0, 0], filter: { topic: 'x' } });
  assert.deepStrictEqual(collection.calls[2].pipeline[0].$vectorSearch.filter, { 'metadata.topic': { $eq: 'x' } });
  await store.query({ vector: [1, 0, 0], topK: 1000, filter: { topic: 'x' }, nativeFilter: { year: { $gte: 2020 } } });
  assert.deepStrictEqual(collection.calls[3].pipeline[0].$vectorSearch.filter, { year: { $gte: 2020 } });
  assert.strictEqual(collection.calls[3].pipeline[0].$vectorSearch.numCandidates, 10000);

  await store.delete(['a', 'b']);
  assert.deepStrictEqual(collection.calls[4], { method: 'deleteMany', filter: { _id: { $in: ['a', 'b'] } } });

  await store.createIndex({ dimension: 3, filterFields: ['topic', 'lang'] });
  assert.deepStrictEqual(collection.calls[5].definition, {
    name: 'vector_index',
    type: 'vectorSearch',
    definition: {
      fields: [
        { type: 'vector', path: 'embedding', numDimensions: 3, similarity: 'cosine' },
        { type: 'filter', path: 'metadata.topic' },
        { type: 'filter', path: 'metadata.lang' },
      ],
    },
  });

  // custom keys, a nested vector path, euclidean scores kept, driver errors wrapped
  const custom = fakeMongoCollection([{ _id: 1, body: 'B', score: 0.5 }]);
  const other = new MongoDBAtlasVectorStore({ collection: custom, path: 'vec.values', textKey: 'body', indexName: 'idx', similarity: 'euclidean' });
  await other.upsert([{ id: 'x', vector: [1, 2], text: 'B' }]);
  assert.deepStrictEqual(custom.calls[0].operations[0].replaceOne.replacement, { body: 'B', metadata: {}, vec: { values: [1, 2] } });
  assert.deepStrictEqual(await other.query({ vector: [1, 2], topK: 1 }), [{ id: '1', score: 0.5, text: 'B', metadata: {} }]);
  assert.strictEqual(custom.calls[1].pipeline[0].$vectorSearch.index, 'idx');
  assert.deepStrictEqual(custom.calls[1].pipeline[1].$project, { _id: 1, body: 1, metadata: 1, score: { $meta: 'vectorSearchScore' } });
  const broken = { ...fakeMongoCollection(), aggregate: () => ({ toArray: async () => { throw Object.assign(new Error('PlanExecutor error'), { code: 8 }); } }) };
  await assert.rejects(new MongoDBAtlasVectorStore({ collection: broken }).query({ vector: [1] }),
    (error) => error.message === 'MongoDB error: PlanExecutor error' && error.code === 8);
}

// ---------------------------------------------------------------------
// Shared contract
// ---------------------------------------------------------------------

function testBrowserSafeModules() {
  // no Node-only module may be required (a lazy require('crypto') would still pull crypto-browserify into the bundle)
  const allowed = new Set(['../utils/FetchClient', '../utils/ConnHelper', './VectorStore', './QdrantVectorStore', 'cross-fetch']);
  for (const name of ['Pinecone', 'Qdrant', 'Chroma', 'Weaviate', 'Milvus', 'Elasticsearch', 'Pg', 'MongoDBAtlas']) {
    const source = fs.readFileSync(path.join(__dirname, '../../store', `${name}VectorStore.js`), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    for (const [, module] of source.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)) {
      assert.ok(allowed.has(module), `${name}VectorStore requires ${module}`);
    }
  }
  for (const Store of [PineconeVectorStore, QdrantVectorStore, ChromaVectorStore, WeaviateVectorStore, MilvusVectorStore,
    ElasticsearchVectorStore, PgVectorStore, MongoDBAtlasVectorStore]) {
    assert.ok(Store.prototype instanceof VectorStore, `${Store.name} extends VectorStore`);
  }
}

module.exports = async function testVectorStores() {
  testBrowserSafeModules();
  await testVectorStoreBase();
  await testMemoryVectorStore();
  await testPinecone();
  await testQdrant();
  await testChroma();
  await testWeaviate();
  await testMilvus();
  await testElasticsearch();
  await testElasticsearchBulkOverHttp();
  await testPgVector();
  await testMongoDBAtlas();
  console.log('Vector store tests passed.');
};

if (require.main === module) {
  module.exports().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
