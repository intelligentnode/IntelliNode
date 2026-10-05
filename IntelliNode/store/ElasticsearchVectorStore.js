/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('../utils/FetchClient');
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');

const RETRY_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

/**
 * FetchClient JSON-encodes every body, but _bulk takes NDJSON: this client sends a string body as is (with the
 * same headers, timeout, retries and signal) and leaves every other request to FetchClient.
 */
class NdjsonFetchClient extends FetchClient {
  async request(method, endpoint, data, extraConfig = {}) {
    if (typeof data !== 'string') return super.request(method, endpoint, data, extraConfig);
    const fetch = require('cross-fetch');
    const url = endpoint.startsWith('http') ? endpoint : this.baseURL + endpoint;
    const headers = { ...this.defaultHeaders, 'Content-Type': 'application/x-ndjson', ...(extraConfig.headers || {}) };
    const options = this.resolveOptions(extraConfig);
    const aborted = () => Object.assign(new Error('The request was aborted.'), { name: 'AbortError', code: 'ABORT_ERR' });
    for (let attempt = 0; ; attempt++) {
      if (options.signal && options.signal.aborted) throw aborted();
      const controller = new AbortController();
      const abort = () => controller.abort();
      if (options.signal) options.signal.addEventListener('abort', abort, { once: true });
      let timedOut = false;
      const timer = options.timeout ? setTimeout(() => { timedOut = true; abort(); }, options.timeout) : null;
      let response;
      let text;
      try {
        response = await fetch(url, { method, headers, body: data, signal: controller.signal });
        text = await response.text();
      } catch (error) {
        if (options.signal && options.signal.aborted) throw aborted();
        if (attempt < options.retries) {
          await new Promise((resolve) => setTimeout(resolve, options.retryDelay * (2 ** attempt)));
          continue;
        }
        if (timedOut) throw Object.assign(new Error(`Request timed out after ${options.timeout}ms: ${url}`), { code: 'ETIMEDOUT' });
        throw error;
      } finally {
        if (timer) clearTimeout(timer);
        if (options.signal) options.signal.removeEventListener('abort', abort);
      }
      if (response.ok) return text ? JSON.parse(text) : {};
      if (attempt < options.retries && RETRY_STATUSES.has(response.status)) {
        await new Promise((resolve) => setTimeout(resolve, options.retryDelay * (2 ** attempt)));
        continue;
      }
      throw Object.assign(new Error(`HTTP error ${response.status}: ${text}`), { status: response.status, body: text });
    }
  }
}

function toBase64(text) {
  if (typeof Buffer !== 'undefined') return Buffer.from(text, 'utf8').toString('base64');
  return btoa(unescape(encodeURIComponent(text)));
}

function toElasticFilter(filter) {
  const clauses = Object.entries(filter || {}).map(([key, value]) => (
    Array.isArray(value) ? { terms: { [`metadata.${key}`]: value } } : { term: { [`metadata.${key}`]: value } }
  ));
  return clauses.length > 0 ? { bool: { filter: clauses } } : null;
}

function elasticError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `Elasticsearch error: ${wrapped.message}`;
  return wrapped;
}

/**
 * An Elasticsearch index (self-managed, Elastic Cloud or Serverless) with a dense_vector field, through the REST API.
 *
 *   const store = new ElasticsearchVectorStore({ url: 'https://my-deployment.es.io', apiKey, index: 'docs', embedder });
 *
 * A missing index is created on the first upsert: the vector field (dense_vector, index: true, similarity cosine),
 * `text`, and `metadata` whose string values are mapped as keyword so filters match exact values. Upserts and
 * deletes go through _bulk; queries use the top-level knn search. Elasticsearch scores cosine and dot_product as
 * (1 + cos) / 2, which is converted back to the cosine similarity; l2_norm keeps 1 / (1 + distance^2).
 * filter becomes term / terms clauses on metadata.<key>; nativeFilter is a query DSL filter for knn.filter.
 */
class ElasticsearchVectorStore extends VectorStore {
  // API: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/dense-vector
  /**
   * @param {object} options - { url = 'http://localhost:9200', apiKey (the encoded API key, sent as
   *   Authorization: ApiKey), username, password, index, dimension, similarity = 'cosine', createIndex = true,
   *   vectorField = 'embedding', refresh = 'wait_for' (false to skip waiting), numCandidates (default 10 x topK,
   *   at least 100), batchSize = 500, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.index) throw new Error('ElasticsearchVectorStore needs an index name.');
    this.index = options.index;
    this.dimension = options.dimension || null;
    this.similarity = options.similarity || 'cosine';
    this.createIndex = options.createIndex !== false;
    this.vectorField = options.vectorField || 'embedding';
    this.refresh = options.refresh === undefined ? 'wait_for' : options.refresh;
    this.numCandidates = options.numCandidates || null;
    this.batchSize = options.batchSize || 500;
    this._ready = null;
    const headers = { 'Content-Type': 'application/json' };
    if (options.apiKey) headers.Authorization = `ApiKey ${options.apiKey}`;
    else if (options.username) headers.Authorization = `Basic ${toBase64(`${options.username}:${options.password || ''}`)}`;
    this.client = new NdjsonFetchClient({ baseURL: String(options.url || 'http://localhost:9200').replace(/\/+$/, ''), headers });
  }

  /** Create the index with the vector mapping when it does not exist. Returns true when it was created. */
  async ensureIndex(dimension = this.dimension) {
    if (await this._exists()) return false;
    if (!dimension) throw new Error(`Elasticsearch index '${this.index}' does not exist and no dimension is known to create it.`);
    try {
      await this._request('PUT', this._path(), {
        mappings: {
          dynamic_templates: [{
            metadata_strings: { path_match: 'metadata.*', match_mapping_type: 'string', mapping: { type: 'keyword' } },
          }],
          properties: {
            [this.vectorField]: { type: 'dense_vector', dims: dimension, index: true, similarity: this.similarity },
            text: { type: 'text' },
            metadata: { type: 'object' },
          },
        },
      });
    } catch (error) {
      // resource_already_exists_exception: created meanwhile by another call
      if (await this._exists().catch(() => false)) return false;
      throw error;
    }
    return true;
  }

  async upsert(records) {
    const items = toItems(records);
    if (items.length === 0) return [];
    if (this.createIndex) await this._prepare(items[0].vector.length);
    for (let start = 0; start < items.length; start += this.batchSize) {
      const lines = [];
      for (const item of items.slice(start, start + this.batchSize)) {
        lines.push(JSON.stringify({ index: { _index: this.index, _id: item.id } }));
        lines.push(JSON.stringify({ text: item.text, metadata: item.metadata, [this.vectorField]: item.vector }));
      }
      await this._bulk(lines);
    }
    return items.map((item) => item.id);
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const topK = params.topK || 5;
    const knn = {
      field: this.vectorField,
      query_vector: vector,
      k: topK,
      num_candidates: Math.min(10000, Math.max(topK, this.numCandidates || Math.max(100, topK * 10))),
    };
    const filter = params.nativeFilter || toElasticFilter(params.filter);
    if (filter) knn.filter = filter;
    const data = await this._request('POST', `${this._path()}/_search`, { knn, size: topK, _source: { excludes: [this.vectorField] } });
    const hits = (data && data.hits && data.hits.hits) || [];
    return hits.map((hit) => {
      const source = hit._source || {};
      return { id: hit._id, score: this._score(hit._score), text: source.text ?? null, metadata: source.metadata || {} };
    }).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const list = (ids || []).map(String);
    for (let start = 0; start < list.length; start += this.batchSize) {
      await this._bulk(list.slice(start, start + this.batchSize).map((id) => JSON.stringify({ delete: { _index: this.index, _id: id } })));
    }
  }

  _score(score) {
    return this.similarity === 'cosine' || this.similarity === 'dot_product' ? 2 * score - 1 : score;
  }

  _path() {
    return `/${encodeURIComponent(this.index)}`;
  }

  async _exists() {
    try {
      await this._request('HEAD', this._path(), undefined, { responseType: 'text' });
      return true;
    } catch (error) {
      if (error.status === 404) return false;
      throw error;
    }
  }

  _prepare(dimension) {
    if (!this._ready) {
      this._ready = this.ensureIndex(this.dimension || dimension).catch((error) => {
        this._ready = null;
        throw error;
      });
    }
    return this._ready;
  }

  // _bulk answers 200 and reports failures per item; a delete of a missing id is not a failure.
  async _bulk(lines) {
    const refresh = this.refresh ? `?refresh=${encodeURIComponent(this.refresh)}` : '';
    const data = await this._request('POST', `/_bulk${refresh}`, `${lines.join('\n')}\n`);
    if (!data || !data.errors) return data;
    for (const item of data.items || []) {
      const [action, result] = Object.entries(item)[0] || [];
      if (!result || !result.error || (action === 'delete' && result.status === 404)) continue;
      const reason = result.error.reason || result.error.type || JSON.stringify(result.error);
      const error = new Error(`Elasticsearch error: ${action} ${result._id}: ${reason}`);
      error.status = result.status;
      error.body = JSON.stringify(result.error);
      throw error;
    }
    return data;
  }

  async _request(method, path, body, extraConfig = {}) {
    try {
      return await this.client.request(method, path, body, extraConfig);
    } catch (error) {
      throw elasticError(error);
    }
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

module.exports = { ElasticsearchVectorStore };
