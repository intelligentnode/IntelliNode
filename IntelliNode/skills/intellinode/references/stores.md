# Vector databases and chat history

Every vector store shares one interface:

```js
await store.addDocuments([{ id: 'doc-1', text: '...', metadata: { source: 'a.md' } }]);  // embeds with the store's embedder
await store.upsert([{ id, vector, text, metadata }]);                                    // your own vectors
const hits = await store.search('question', 5, { source: 'a.md' });                       // [{ id, score, text, metadata }]
const same = await store.query({ text: 'question', topK: 5, filter: { lang: 'en' } });    // or { vector }
await store.delete(['doc-1']);
```

`addDocuments` keeps your ids; `Assistant.addDocuments` splits each document into chunks with ids `<id>#0`,
`<id>#1`, ..., so adding the same id again replaces those chunks (delete extra chunks yourself if a document
shrinks). Embed once: `MemoryVectorStore` has `count()` and `clear(filter)` for that check.

`score` is a similarity (higher is closer). `filter` is metadata equality (an array value means one of); pass the
store's own syntax as `nativeFilter` for anything else.

## The embedder

```js
{ embedder: { provider: 'openai', apiKey } }                                  // text-embedding-3-small
{ embedder: { provider: 'vertex', apiKey, dimensions: 768 } }                 // gemini-embedding-001 on Vertex AI
{ embedder: { provider: 'gemini', apiKey } }                                  // Developer API, 3072 numbers
{ embedder: { provider: 'cohere', apiKey } }                                  // documents and queries embedded differently
{ embedder: { provider: 'ollama', model: 'nomic-embed-text', options: { baseUrl: 'http://localhost:11434/v1' } } }
{ embedder: async (texts, { kind }) => myVectors(texts) }                     // your own function
```

Use the same embedder (provider, model and `dimensions`) for the life of a store.

## Which store

| Store | Class | Needs | Notes |
| --- | --- | --- | --- |
| In process, optional JSON file | `MemoryVectorStore({ path })` | nothing | exact cosine search; good up to a few thousand chunks, local apps, tests, the browser |
| Google Cloud Firestore | `FirestoreVectorStore({ projectId, collection })` | OAuth, a vector index | data next to your app's Firestore data; `store.indexCommand(dim)` prints the gcloud command |
| Vertex AI RAG Engine | `VertexRAGStore({ projectId, location, corpus })` | OAuth, a supported region | Google parses, chunks and embeds files (`uploadFile`, `importFiles` from gs:// or Drive); query by text; `await store.tool()` grounds Gemini directly |
| Vertex AI Vector Search 2.0 | `VertexVectorSearchStore({ projectId, collection })` | OAuth | managed collections that store text and metadata; `createCollection({ dimensions })` once |
| Vertex AI Vector Search 1.0 | `VertexVectorSearchIndexStore({ index, indexEndpoint, deployedIndexId, publicEndpointDomain })` | OAuth, a deployed stream-update index | text and metadata in `embeddingMetadata` (2 KB); `restrictKeys` turn metadata into filters |
| AlloyDB, Cloud SQL, Supabase, Neon, Postgres | `PgVectorStore({ client: pgPool, dimension })` | `npm i pg`, the pgvector extension | creates the table and an HNSW index (up to 2000 dimensions) |
| Pinecone | `PineconeVectorStore({ apiKey, indexHost })` | an index with the right dimension | metadata cannot hold nulls or nested objects |
| Qdrant | `QdrantVectorStore({ url, apiKey, collection })` | Qdrant server or cloud | creates the collection on first upsert; string ids are mapped to UUIDs |
| Chroma | `ChromaVectorStore({ url, collection })` | `chroma run` or Chroma Cloud | cosine space by default |
| Weaviate | `WeaviateVectorStore({ url, apiKey, className })` | Weaviate 1.2x+ | class name must be capitalized |
| Milvus / Zilliz | `MilvusVectorStore({ url, token, collection, dimension })` | Milvus 2.5+ REST | use `consistencyLevel: 'Strong'` to read your own writes at once |
| Elasticsearch | `ElasticsearchVectorStore({ url, apiKey, index, dimension })` | Elasticsearch 8+ | creates a `dense_vector` mapping |
| MongoDB Atlas | `MongoDBAtlasVectorStore({ collection })` | `npm i mongodb`, an Atlas vector index | `store.createIndex({ dimension, filterFields })`; filtered keys must be index filter fields |

## Google Cloud setup (OAuth)

```bash
gcloud auth application-default login            # local development
export GOOGLE_CLOUD_PROJECT=my-project
gcloud firestore indexes composite create --collection-group=intellinode_vectors --query-scope=COLLECTION \
  --field-config field-path=embedding,vector-config='{"dimension":"768","flat":"{}"}' --database='(default)'
```

On Cloud Run, GKE or Compute Engine the metadata server supplies the token; elsewhere set
`GOOGLE_APPLICATION_CREDENTIALS` to a service account key file or pass `accessToken`. RAG Engine: europe-west3 and
europe-west4 are generally available; us-central1 and us-east4 need an allowlist for new projects.

```js
const { VertexRAGStore } = require('intellinode');
const corpus = await VertexRAGStore.createCorpus({ projectId, location: 'europe-west4', displayName: 'handbook' });
const rag = new VertexRAGStore({ projectId, location: 'europe-west4', corpus: corpus.name });
await rag.uploadFile('handbook.pdf');                    // or rag.importFiles(['gs://bucket/docs/'])
const hits = await rag.query({ text: 'refund policy', topK: 5 });
```

## Chat history

| Class | Where | Notes |
| --- | --- | --- |
| `MemoryChatHistory()` | process memory | default of `Assistant`; lost on restart |
| `FileChatHistory({ dir })` | one JSON file per conversation | local apps and desktop tools (Node) |
| `FirestoreChatHistory({ projectId, collection })` | `conversations/{id}` + `messages` subcollection | multi-user servers; no composite index needed |

Methods: `getMessages(id, { limit })`, `addMessages(id, messages)`, `getConversation(id)`, `saveConversation({ id, title, userId })`,
`listConversations({ userId })`, `deleteConversation(id)`, `deleteLastMessages(id, count)`. Extend `ChatHistory` for
another database (Redis, Postgres, DynamoDB) with those seven methods.

With Firestore for both history and memory, everything about a user's conversations stays in your Google Cloud project:

```js
const assistant = new Assistant({
  provider: 'vertex', apiKey: process.env.VERTEX_API_KEY,
  history: new FirestoreChatHistory({ projectId }),
  memory: new FirestoreVectorStore({ projectId, collection: 'memories', embedder: { provider: 'vertex', apiKey: process.env.VERTEX_API_KEY, dimensions: 768 } }),
});
```
