/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('../utils/FetchClient');
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');

// Milvus string literals are double quoted with backslash escapes, which JSON.stringify produces.
function literal(value) {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error(`Milvus filters cannot take the number ${value}.`);
    return String(value);
  }
  if (typeof value === 'boolean') return String(value);
  return JSON.stringify(String(value));
}

function toMilvusFilter(filter) {
  const conditions = Object.entries(filter || {}).map(([key, value]) => {
    const field = `metadata[${JSON.stringify(key)}]`;
    return Array.isArray(value)
      ? `${field} in [${value.map(literal).join(', ')}]`
      : `${field} == ${literal(value)}`;
  });
  return conditions.length > 0 ? conditions.join(' and ') : null;
}

function parseMetadata(value) {
  if (!value) return {};
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return {};
  }
}

function milvusError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `Milvus error: ${wrapped.message}`;
  return wrapped;
}

/**
 * Milvus or Zilliz Cloud through the RESTful API v2.
 *
 *   const store = new MilvusVectorStore({ url: 'http://localhost:19530', token: 'root:Milvus', collection: 'docs', embedder });
 *
 * A missing collection is created on the first upsert with a VarChar primary key `id`, a FloatVector `vector`
 * (AUTOINDEX, COSINE), a VarChar `text` and a JSON `metadata` field; it is loaded right away. With COSINE (and IP)
 * Milvus returns the similarity itself in `distance`; L2 distances become 1 / (1 + distance).
 * filter becomes a boolean expression on the JSON field (metadata["key"] == "value", metadata["key"] in [...]);
 * nativeFilter is a Milvus expression string.
 */
class MilvusVectorStore extends VectorStore {
  // API: https://milvus.io/api-reference/restful/v2.6.x/v2/Vector%20(v2)/Search.md
  /**
   * @param {object} options - { url = 'http://localhost:19530', token ('user:password' or a Zilliz Cloud API key),
   *   collection, dbName, dimension, metricType = 'COSINE', createCollection = true, maxTextLength = 65535,
   *   consistencyLevel (e.g. 'Strong' to read your own writes), batchSize = 500, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.collection) throw new Error('MilvusVectorStore needs a collection name.');
    this.collection = options.collection;
    this.dbName = options.dbName || null;
    this.dimension = options.dimension || null;
    this.metricType = options.metricType || 'COSINE';
    this.createCollection = options.createCollection !== false;
    this.maxTextLength = options.maxTextLength || 65535;
    this.consistencyLevel = options.consistencyLevel || null;
    this.batchSize = options.batchSize || 500;
    this._ready = null;
    const headers = { 'Content-Type': 'application/json' };
    if (options.token) headers.Authorization = `Bearer ${options.token}`;
    this.client = new FetchClient({ baseURL: String(options.url || 'http://localhost:19530').replace(/\/+$/, ''), headers });
  }

  /** Create the collection when it does not exist. Returns true when it was created. */
  async ensureCollection(dimension = this.dimension) {
    if (await this._has()) return false;
    if (!dimension) throw new Error(`Milvus collection '${this.collection}' does not exist and no dimension is known to create it.`);
    try {
      await this._request('/v2/vectordb/collections/create', {
        schema: {
          autoId: false,
          fields: [
            { fieldName: 'id', dataType: 'VarChar', isPrimary: true, elementTypeParams: { max_length: 512 } },
            { fieldName: 'vector', dataType: 'FloatVector', elementTypeParams: { dim: String(dimension) } },
            { fieldName: 'text', dataType: 'VarChar', elementTypeParams: { max_length: this.maxTextLength } },
            { fieldName: 'metadata', dataType: 'JSON' },
          ],
        },
        indexParams: [{ fieldName: 'vector', indexName: 'vector', metricType: this.metricType, indexType: 'AUTOINDEX' }],
      });
    } catch (error) {
      if (await this._has().catch(() => false)) return false;
      throw error;
    }
    return true;
  }

  async upsert(records) {
    const items = lastById(toItems(records));
    if (items.length === 0) return [];
    if (this.createCollection) await this._prepare(items[0].vector.length);
    const rows = items.map((item) => ({ id: item.id, vector: item.vector, text: item.text ?? '', metadata: item.metadata }));
    for (let start = 0; start < rows.length; start += this.batchSize) {
      await this._request('/v2/vectordb/entities/upsert', { data: rows.slice(start, start + this.batchSize) });
    }
    return (records || []).map((record) => String(record.id));
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const filter = params.nativeFilter || toMilvusFilter(params.filter);
    const body = {
      data: [vector],
      annsField: 'vector',
      limit: params.topK || 5,
      outputFields: ['text', 'metadata'],
      searchParams: { metricType: this.metricType },
    };
    if (filter) body.filter = filter;
    if (this.consistencyLevel) body.consistencyLevel = this.consistencyLevel;
    const hits = await this._request('/v2/vectordb/entities/search', body);
    return (Array.isArray(hits) ? hits.flat() : []).map((hit) => ({
      id: String(hit.id),
      score: this.metricType === 'L2' ? 1 / (1 + hit.distance) : hit.distance,
      text: hit.text === '' || hit.text === undefined ? null : hit.text,
      metadata: parseMetadata(hit.metadata),
    })).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const list = (ids || []).map(String);
    for (let start = 0; start < list.length; start += this.batchSize) {
      const batch = list.slice(start, start + this.batchSize);
      await this._request('/v2/vectordb/entities/delete', { filter: `id in [${batch.map(literal).join(', ')}]` });
    }
  }

  async _has() {
    const data = await this._request('/v2/vectordb/collections/has', {});
    return Boolean(data && data.has);
  }

  _prepare(dimension) {
    if (!this._ready) {
      this._ready = this.ensureCollection(this.dimension || dimension).catch((error) => {
        this._ready = null;
        throw error;
      });
    }
    return this._ready;
  }

  // Every v2 call is a POST that answers HTTP 200 with { code, message } on failure, so check code too.
  async _request(path, body) {
    let response;
    try {
      response = await this.client.request('POST', path, {
        collectionName: this.collection,
        ...(this.dbName ? { dbName: this.dbName } : {}),
        ...body,
      });
    } catch (error) {
      throw milvusError(error);
    }
    if (response && response.code !== undefined && response.code !== 0 && response.code !== 200) {
      const error = new Error(`Milvus error: ${response.message || 'request failed'} (code ${response.code})`);
      error.body = JSON.stringify(response);
      throw error;
    }
    return response ? response.data : undefined;
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

// Milvus rejects a batch that repeats a primary key; the last record wins, like separate upserts.
function lastById(items) {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

module.exports = { MilvusVectorStore };
