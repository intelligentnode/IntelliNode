require('dotenv').config();
const assert = require('assert');
const { PineconeVectorStore } = require('../../store/PineconeVectorStore');
const { QdrantVectorStore } = require('../../store/QdrantVectorStore');
const { ChromaVectorStore } = require('../../store/ChromaVectorStore');
const { WeaviateVectorStore } = require('../../store/WeaviateVectorStore');
const { MilvusVectorStore } = require('../../store/MilvusVectorStore');
const { ElasticsearchVectorStore } = require('../../store/ElasticsearchVectorStore');
const { PgVectorStore } = require('../../store/PgVectorStore');
const { MongoDBAtlasVectorStore } = require('../../store/MongoDBAtlasVectorStore');

/*
Live checks for the vector store adapters. Each store runs only when its settings are present, otherwise it prints
"skipped". No embedding key is needed: a fake embedder puts one keyword per axis.

  QDRANT_URL [QDRANT_API_KEY]
  CHROMA_URL [CHROMA_API_KEY CHROMA_TENANT CHROMA_DATABASE]
  PINECONE_API_KEY PINECONE_INDEX_HOST   (an existing cosine index of VECTOR_TEST_DIMENSION, default 8)
  WEAVIATE_URL [WEAVIATE_API_KEY]
  MILVUS_URL [MILVUS_TOKEN]
  ELASTICSEARCH_URL [ELASTICSEARCH_API_KEY | ELASTICSEARCH_USERNAME ELASTICSEARCH_PASSWORD]
  PG_CONNECTION_STRING                   (needs `npm install pg` and the pgvector extension)
  MONGODB_URI MONGODB_DB MONGODB_COLLECTION [MONGODB_INDEX]
                                         (needs `npm install mongodb` and an Atlas Vector Search index on
                                          `embedding` with filter fields metadata.topic and metadata.lang)

Collections, classes, indexes and tables are created with a unique name and dropped at the end.
*/

const env = process.env;
const DIMENSION = Number(env.VECTOR_TEST_DIMENSION || 8);
const KEYWORDS = ['cat', 'dog', 'car', 'bus', 'sofa', 'park', 'tires', 'noon'];
const RUN = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

async function embedder(texts) {
  return texts.map((text) => {
    const words = String(text).toLowerCase();
    return Array.from({ length: DIMENSION }, (_, index) => (KEYWORDS[index] && words.includes(KEYWORDS[index]) ? 1 : 0.01));
  });
}

const DOCUMENTS = [
  { id: `${RUN}-cat`, text: 'The cat sleeps on the sofa', metadata: { topic: 'animals', lang: 'en' } },
  { id: `${RUN}-dog`, text: 'A dog runs in the park', metadata: { topic: 'animals', lang: 'fr' } },
  { id: `${RUN}-car`, text: 'The car needs new tires', metadata: { topic: 'vehicles', lang: 'en' } },
  { id: `${RUN}-bus`, text: 'The bus leaves at noon', metadata: { topic: 'vehicles', lang: 'de' } },
];

// Some stores (Pinecone, Atlas) are eventually consistent: retry until check passes.
async function eventually(read, check, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const value = await read();
    try {
      check(value);
      return value;
    } catch (error) {
      if (Date.now() > deadline) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

const ids = (hits) => hits.map((hit) => hit.id);

async function exercise(store) {
  assert.deepStrictEqual(await store.addDocuments(DOCUMENTS), DOCUMENTS.map((document) => document.id));

  const hits = await eventually(() => store.search('cat on a sofa', 4), (result) => assert.strictEqual(result.length, 4));
  assert.strictEqual(hits[0].id, `${RUN}-cat`);
  assert.ok(hits[0].score > 0.99 && hits[0].score <= 1.0001, `cosine similarity, got ${hits[0].score}`);
  assert.strictEqual(hits[0].text, 'The cat sleeps on the sofa');
  assert.deepStrictEqual(hits[0].metadata, { topic: 'animals', lang: 'en' });
  hits.forEach((hit, index) => index === 0 || assert.ok(hits[index - 1].score >= hit.score, 'sorted by score'));

  const vehicles = await store.query({ text: 'cat', topK: 4, filter: { topic: 'vehicles' } });
  assert.deepStrictEqual(ids(vehicles).sort(), [`${RUN}-bus`, `${RUN}-car`]);
  const oneOf = await store.query({ text: 'dog', topK: 4, filter: { lang: ['fr', 'de'] } });
  assert.deepStrictEqual(ids(oneOf).sort(), [`${RUN}-bus`, `${RUN}-dog`]);
  assert.strictEqual(oneOf[0].id, `${RUN}-dog`);
  const both = await store.query({ vector: (await embedder(['car']))[0], topK: 4, filter: { topic: 'vehicles', lang: 'en' } });
  assert.deepStrictEqual(ids(both), [`${RUN}-car`]);

  // upsert replaces a record
  await store.upsert([{ id: `${RUN}-car`, vector: (await embedder(['car']))[0], text: 'The car is red', metadata: { topic: 'vehicles', lang: 'it' } }]);
  await eventually(() => store.query({ text: 'car', topK: 1 }), (result) => {
    assert.strictEqual(result[0].text, 'The car is red');
    assert.deepStrictEqual(result[0].metadata, { topic: 'vehicles', lang: 'it' });
  });

  await store.delete([`${RUN}-cat`]);
  await eventually(() => store.search('cat on a sofa', 4), (result) => {
    assert.ok(!ids(result).includes(`${RUN}-cat`));
    assert.strictEqual(result.length, 3);
  });
}

const STORES = [
  {
    name: 'Qdrant',
    needs: ['QDRANT_URL'],
    create: () => new QdrantVectorStore({ url: env.QDRANT_URL, apiKey: env.QDRANT_API_KEY, collection: `intellinode_test_${RUN}`, embedder }),
    cleanup: (store) => store.client.request('DELETE', `/collections/${store.collection}`),
  },
  {
    name: 'Chroma',
    needs: ['CHROMA_URL'],
    create: () => new ChromaVectorStore({
      url: env.CHROMA_URL, apiKey: env.CHROMA_API_KEY, tenant: env.CHROMA_TENANT, database: env.CHROMA_DATABASE, collection: `intellinode_test_${RUN}`, embedder,
    }),
    cleanup: (store) => store.client.request('DELETE', `${store._databasePath()}/collections/${store.collection}`, undefined, { responseType: 'text' }),
  },
  {
    name: 'Pinecone',
    needs: ['PINECONE_API_KEY', 'PINECONE_INDEX_HOST'],
    create: () => new PineconeVectorStore({ apiKey: env.PINECONE_API_KEY, indexHost: env.PINECONE_INDEX_HOST, namespace: `intellinode-test-${RUN}`, embedder }),
    cleanup: (store) => store.delete(DOCUMENTS.map((document) => document.id)),
  },
  {
    name: 'Weaviate',
    needs: ['WEAVIATE_URL'],
    create: () => new WeaviateVectorStore({ url: env.WEAVIATE_URL, apiKey: env.WEAVIATE_API_KEY, className: `IntellinodeTest${RUN}`, embedder }),
    cleanup: (store) => store.client.request('DELETE', `/v1/schema/${store.className}`, undefined, { responseType: 'text' }),
  },
  {
    name: 'Milvus',
    needs: ['MILVUS_URL'],
    create: () => new MilvusVectorStore({ url: env.MILVUS_URL, token: env.MILVUS_TOKEN, collection: `intellinode_test_${RUN}`, consistencyLevel: 'Strong', embedder }),
    cleanup: (store) => store.client.request('POST', '/v2/vectordb/collections/drop', { collectionName: store.collection }),
  },
  {
    name: 'Elasticsearch',
    needs: ['ELASTICSEARCH_URL'],
    create: () => new ElasticsearchVectorStore({
      url: env.ELASTICSEARCH_URL,
      apiKey: env.ELASTICSEARCH_API_KEY,
      username: env.ELASTICSEARCH_USERNAME,
      password: env.ELASTICSEARCH_PASSWORD,
      index: `intellinode-test-${RUN}`,
      embedder,
    }),
    cleanup: (store) => store.client.request('DELETE', `/${store.index}`),
  },
  {
    name: 'pgvector',
    needs: ['PG_CONNECTION_STRING'],
    module: 'pg',
    create: () => {
      const { Pool } = require('pg');
      return new PgVectorStore({ client: new Pool({ connectionString: env.PG_CONNECTION_STRING }), table: `intellinode_test_${RUN}`, dimension: DIMENSION, embedder });
    },
    cleanup: async (store) => {
      try {
        await store.client.query(`DROP TABLE IF EXISTS ${store.table}`);
      } finally {
        await store.client.end();
      }
    },
  },
  {
    name: 'MongoDB Atlas',
    needs: ['MONGODB_URI', 'MONGODB_DB', 'MONGODB_COLLECTION'],
    module: 'mongodb',
    create: async () => {
      const { MongoClient } = require('mongodb');
      const client = await new MongoClient(env.MONGODB_URI).connect();
      const store = new MongoDBAtlasVectorStore({
        collection: client.db(env.MONGODB_DB).collection(env.MONGODB_COLLECTION), indexName: env.MONGODB_INDEX || 'vector_index', embedder,
      });
      store.mongoClient = client;
      return store;
    },
    cleanup: async (store) => {
      try {
        await store.delete(DOCUMENTS.map((document) => document.id));
      } finally {
        await store.mongoClient.close();
      }
    },
  },
];

function installed(name) {
  try {
    require.resolve(name);
    return true;
  } catch (error) {
    return false;
  }
}

(async () => {
  console.log('========================================');
  console.log('   Vector Store Integration Tests');
  console.log('========================================');
  const failures = [];
  for (const entry of STORES) {
    const missing = entry.needs.filter((name) => !env[name]);
    if (missing.length > 0) {
      console.log(`${entry.name}: skipped (set ${missing.join(', ')})`);
      continue;
    }
    if (entry.module && !installed(entry.module)) {
      console.log(`${entry.name}: skipped (npm install ${entry.module})`);
      continue;
    }
    let store = null;
    try {
      store = await entry.create();
      await exercise(store);
      console.log(`${entry.name}: passed`);
    } catch (error) {
      failures.push(entry.name);
      console.error(`${entry.name}: FAILED`, error);
    } finally {
      if (store && entry.cleanup) {
        await Promise.resolve().then(() => entry.cleanup(store)).catch((error) => console.warn(`${entry.name}: cleanup failed: ${error.message}`));
      }
    }
  }
  if (failures.length > 0) {
    console.error(`\nFailed: ${failures.join(', ')}`);
    process.exit(1);
  }
  console.log('\nVector store integration tests completed.');
})();
