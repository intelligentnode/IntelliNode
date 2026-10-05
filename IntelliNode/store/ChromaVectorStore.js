/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('../utils/FetchClient');
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');

// Chroma rejects a where clause with more than one key unless the conditions are wrapped in $and.
function toChromaWhere(filter) {
  const clauses = Object.entries(filter || {}).map(([key, value]) => ({
    [key]: Array.isArray(value) ? { $in: value } : { $eq: value },
  }));
  if (clauses.length === 0) return null;
  return clauses.length === 1 ? clauses[0] : { $and: clauses };
}

// The distance space of a collection; Chroma's default is l2.
function collectionSpace(collection) {
  const config = collection.configuration_json || {};
  return (config.hnsw && config.hnsw.space)
    || (config.spann && config.spann.space)
    || (collection.metadata && collection.metadata['hnsw:space'])
    || 'l2';
}

// upsert and delete answer {} or { deleted } depending on the server version; only errors matter
function parseText(text) {
  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    return {};
  }
}

function chromaError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `Chroma error: ${wrapped.message}`;
  return wrapped;
}

/**
 * A Chroma server (self-hosted or Chroma Cloud) through the v2 REST API.
 *
 *   const store = new ChromaVectorStore({ url: 'http://localhost:8000', collection: 'docs', embedder });
 *
 * The collection is fetched or created by name (with the cosine space) on first use. Scores are converted from
 * the collection's distance: cosine and ip give 1 - distance, l2 gives 1 / (1 + distance).
 * filter becomes a where clause ($eq / $in, joined by $and); nativeFilter is a Chroma where clause.
 * Chroma metadata values must be strings, numbers, booleans or arrays of them (no nested objects).
 */
class ChromaVectorStore extends VectorStore {
  // API: https://docs.trychroma.com/reference/chroma-api/record/query-collection
  /**
   * @param {object} options - { url = 'http://localhost:8000', collection, tenant = 'default_tenant',
   *   database = 'default_database', apiKey (Chroma Cloud, sent as x-chroma-token), space = 'cosine' (for a new
   *   collection), batchSize = 1000, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.collection) throw new Error('ChromaVectorStore needs a collection name.');
    this.collection = options.collection;
    this.tenant = options.tenant || 'default_tenant';
    this.database = options.database || 'default_database';
    this.space = options.space || 'cosine';
    this.batchSize = options.batchSize || 1000;
    this.collectionId = null;
    this._ready = null;
    const headers = { 'Content-Type': 'application/json' };
    if (options.apiKey) headers['x-chroma-token'] = options.apiKey;
    this.client = new FetchClient({ baseURL: String(options.url || 'http://localhost:8000').replace(/\/+$/, ''), headers });
  }

  /** Get or create the collection by name; returns its id. */
  async getCollection() {
    if (!this._ready) {
      this._ready = this._request('POST', `${this._databasePath()}/collections`, {
        name: this.collection,
        metadata: { 'hnsw:space': this.space },
        get_or_create: true,
      }).then((collection) => {
        this.collectionId = collection.id;
        this.space = collectionSpace(collection);
        return collection.id;
      }).catch((error) => {
        this._ready = null;
        throw error;
      });
    }
    return this._ready;
  }

  async upsert(records) {
    const items = toItems(records);
    if (items.length === 0) return [];
    const path = await this._collectionPath();
    for (let start = 0; start < items.length; start += this.batchSize) {
      const batch = items.slice(start, start + this.batchSize);
      await this._request('POST', `${path}/upsert`, {
        ids: batch.map((item) => item.id),
        embeddings: batch.map((item) => item.vector),
        documents: batch.map((item) => item.text),
        // older Chroma servers reject an empty metadata object
        metadatas: batch.map((item) => (Object.keys(item.metadata).length > 0 ? item.metadata : null)),
      }, { responseType: 'text' });
    }
    return items.map((item) => item.id);
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const path = await this._collectionPath();
    const where = params.nativeFilter || toChromaWhere(params.filter);
    const body = { query_embeddings: [vector], n_results: params.topK || 5, include: ['documents', 'metadatas', 'distances'] };
    if (where) body.where = where;
    const data = await this._request('POST', `${path}/query`, body);
    const first = (list) => (Array.isArray(list) && Array.isArray(list[0]) ? list[0] : []);
    const documents = first(data.documents);
    const metadatas = first(data.metadatas);
    const distances = first(data.distances);
    return first(data.ids).map((id, index) => ({
      id,
      score: this._score(distances[index]),
      text: documents[index] ?? null,
      metadata: metadatas[index] || {},
    })).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const list = (ids || []).map(String);
    if (list.length === 0) return;
    const path = await this._collectionPath();
    for (let start = 0; start < list.length; start += this.batchSize) {
      await this._request('POST', `${path}/delete`, { ids: list.slice(start, start + this.batchSize) }, { responseType: 'text' });
    }
  }

  // cosine distance is 1 - cos and ip distance is 1 - dot; l2 is the squared euclidean distance
  _score(distance) {
    return this.space === 'l2' ? 1 / (1 + distance) : 1 - distance;
  }

  _databasePath() {
    return `/api/v2/tenants/${encodeURIComponent(this.tenant)}/databases/${encodeURIComponent(this.database)}`;
  }

  async _collectionPath() {
    const id = await this.getCollection();
    return `${this._databasePath()}/collections/${encodeURIComponent(id)}`;
  }

  async _request(method, path, body, extraConfig = {}) {
    try {
      const data = await this.client.request(method, path, body, extraConfig);
      return extraConfig.responseType === 'text' ? parseText(data) : data;
    } catch (error) {
      throw chromaError(error);
    }
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

module.exports = { ChromaVectorStore };
