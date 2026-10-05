/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { toEmbedder } = require('./Embedder');

let idCounter = 0;

/** A random-looking id for records added without one (no crypto dependency, so it also runs in the browser). */
function newId() {
  idCounter = (idCounter + 1) % 1e6;
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}${idCounter.toString(36)}`;
}

/**
 * Base class of every vector store: Memory, Pinecone, Qdrant, Chroma, Weaviate, Milvus, Elasticsearch, pgvector,
 * Firestore and Vertex AI Vector Search share this interface, so an Assistant or a RAG step can swap them.
 *
 * Records are { id, vector, text?, metadata? }. Query results are { id, score, text, metadata } sorted by score,
 * where a higher score is more similar (each store converts its own distance to a similarity).
 *
 * Subclasses implement upsert(records), query({ vector, topK, filter }) and delete(ids); the base class adds
 * text embedding (addDocuments, search) through the optional embedder.
 */
class VectorStore {
  /**
   * @param {object} options - { embedder }: an Embedder, a function async (texts, { kind }) => vectors, or
   *   { provider, apiKey, model, options } to build one (see store/Embedder.js).
   */
  constructor(options = {}) {
    this.embedder = options.embedder ? toEmbedder(options.embedder) : null;
  }

  /** Embed texts with the store's embedder. kind is 'document' or 'query' (Gemini and Cohere embed them differently). */
  async embed(texts, kind = 'document') {
    if (!this.embedder) {
      throw new Error(`${this.constructor.name} has no embedder: pass { embedder } to the constructor, or give vectors.`);
    }
    const list = Array.isArray(texts) ? texts : [texts];
    if (list.length === 0) return [];
    const vectors = await this.embedder.embed(list, { kind });
    if (!Array.isArray(vectors) || vectors.length !== list.length) {
      throw new Error(`The embedder returned ${Array.isArray(vectors) ? vectors.length : 'no'} vectors for ${list.length} texts.`);
    }
    return vectors;
  }

  /**
   * Add documents, embedding the ones without a vector. Returns the ids.
   * @param {Array<{id?: string, text: string, metadata?: object, vector?: number[]}>|string[]} documents
   */
  async addDocuments(documents) {
    const records = (documents || []).map((document) => (typeof document === 'string' ? { text: document } : { ...document }));
    const missing = records.filter((record) => !Array.isArray(record.vector));
    if (missing.length > 0) {
      const vectors = await this.embed(missing.map((record) => String(record.text || '')), 'document');
      missing.forEach((record, index) => { record.vector = vectors[index]; });
    }
    for (const record of records) {
      if (record.id === undefined || record.id === null || record.id === '') record.id = newId();
      record.id = String(record.id);
      record.metadata = record.metadata || {};
    }
    await this.upsert(records);
    return records.map((record) => record.id);
  }

  /** Embed the query text and return the topK closest records: [{ id, score, text, metadata }]. */
  async search(text, topK = 5, filter = null) {
    const [vector] = await this.embed([String(text)], 'query');
    return this.query({ vector, topK, filter });
  }

  /** Upsert [{ id, vector, text?, metadata? }]. */
  async upsert() {
    throw new Error(`${this.constructor.name}.upsert is not implemented.`);
  }

  /**
   * Nearest records to a vector (or to a text when an embedder is set).
   * @param {{vector?: number[], text?: string, topK?: number, filter?: object}} params - filter is metadata
   *   equality ({ key: value }, all must match); each store also accepts its own native filter as `nativeFilter`.
   */
  async query() {
    throw new Error(`${this.constructor.name}.query is not implemented.`);
  }

  /** Delete records by id. */
  async delete() {
    throw new Error(`${this.constructor.name}.delete is not implemented.`);
  }

  // The vector of a query: params.vector, or the embedded params.text.
  async _queryVector(params = {}) {
    if (Array.isArray(params.vector)) return params.vector;
    if (params.text !== undefined && params.text !== null) {
      const [vector] = await this.embed([String(params.text)], 'query');
      return vector;
    }
    throw new Error('query needs a vector, or a text and an embedder.');
  }
}

/** True when every key of filter equals the same key of metadata (arrays in the filter mean "one of"). */
function matchesFilter(metadata, filter) {
  if (!filter) return true;
  const data = metadata || {};
  return Object.entries(filter).every(([key, expected]) => {
    const actual = data[key];
    if (Array.isArray(expected)) return expected.some((value) => value === actual);
    return actual === expected;
  });
}

function cosineSimilarity(a, b) {
  if (a.length !== b.length) throw new Error(`Vector size mismatch: ${a.length} and ${b.length}.`);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = { VectorStore, matchesFilter, cosineSimilarity, newId };
