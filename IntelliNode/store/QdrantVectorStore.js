/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('../utils/FetchClient');
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// RFC 4122 DNS namespace: the same mapping as uuid.uuid5(uuid.NAMESPACE_DNS, id) in Python and Weaviate's generate_uuid5(id)
const NAMESPACE_BYTES = [0x6b, 0xa7, 0xb8, 0x10, 0x9d, 0xad, 0x11, 0xd1, 0x80, 0xb4, 0x00, 0xc0, 0x4f, 0xd4, 0x30, 0xc8];
const DISTANCE_METRICS = new Set(['Euclid', 'Manhattan']);

function sha1(bytes) {
  // process.getBuiltinModule (Node 20.16+) reaches crypto without a require() that browserify would bundle
  const crypto = typeof process !== 'undefined' && typeof process.getBuiltinModule === 'function'
    ? process.getBuiltinModule('crypto') : null;
  if (crypto && typeof crypto.createHash === 'function') {
    return Array.from(crypto.createHash('sha1').update(Uint8Array.from(bytes)).digest());
  }
  return sha1Fallback(bytes);
}

function sha1Fallback(bytes) {
  const length = bytes.length;
  const words = new Uint32Array((((length + 8) >> 6) + 1) * 16);
  for (let i = 0; i < length; i++) words[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
  words[length >> 2] |= 0x80 << (24 - (length % 4) * 8);
  words[words.length - 1] = length * 8;
  const state = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  const w = new Uint32Array(80);
  for (let block = 0; block < words.length; block += 16) {
    for (let t = 0; t < 16; t++) w[t] = words[block + t];
    for (let t = 16; t < 80; t++) {
      const x = w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16];
      w[t] = (x << 1) | (x >>> 31);
    }
    let [a, b, c, d, e] = state;
    for (let t = 0; t < 80; t++) {
      const f = t < 20 ? ((b & c) | (~b & d)) + 0x5a827999
        : t < 40 ? (b ^ c ^ d) + 0x6ed9eba1
          : t < 60 ? ((b & c) | (b & d) | (c & d)) + 0x8f1bbcdc
            : (b ^ c ^ d) + 0xca62c1d6;
      const next = (((a << 5) | (a >>> 27)) + f + e + w[t]) >>> 0;
      e = d;
      d = c;
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = next;
    }
    state[0] = (state[0] + a) >>> 0;
    state[1] = (state[1] + b) >>> 0;
    state[2] = (state[2] + c) >>> 0;
    state[3] = (state[3] + d) >>> 0;
    state[4] = (state[4] + e) >>> 0;
  }
  const digest = [];
  for (const word of state) digest.push(word >>> 24, (word >>> 16) & 0xff, (word >>> 8) & 0xff, word & 0xff);
  return digest;
}

/**
 * The UUID a store that only accepts UUID ids (Qdrant, Weaviate) keeps for a record id: the id itself when it
 * already is a UUID, otherwise its UUID v5 (so upsert, query and delete always map an id to the same point).
 */
function stableUuid(id) {
  const text = String(id);
  if (UUID_PATTERN.test(text)) return text.toLowerCase();
  const bytes = sha1([...NAMESPACE_BYTES, ...new TextEncoder().encode(text)]).slice(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function toQdrantFilter(filter) {
  const conditions = Object.entries(filter || {}).map(([key, value]) => ({
    key: `metadata.${key}`,
    match: Array.isArray(value) ? { any: value } : { value },
  }));
  return conditions.length > 0 ? { must: conditions } : null;
}

function qdrantError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `Qdrant error: ${wrapped.message}`;
  return wrapped;
}

/**
 * Qdrant (self-hosted or Qdrant Cloud) through its REST API.
 *
 *   const store = new QdrantVectorStore({ url: 'http://localhost:6333', collection: 'docs', embedder });
 *
 * Qdrant point ids must be unsigned integers or UUIDs, so every record id is stored as its UUID v5 (see stableUuid)
 * and the original id is kept in the payload: { text, metadata, id }. Query results return the original id.
 * filter matches payload.metadata keys with match.value (keyword, integer, bool) or match.any for arrays;
 * nativeFilter is a Qdrant filter object ({ must, should, must_not }).
 */
class QdrantVectorStore extends VectorStore {
  // API: https://api.qdrant.tech/api-reference/points/upsert-points
  /**
   * @param {object} options - { url = 'http://localhost:6333', apiKey, collection, distance = 'Cosine' (Cosine,
   *   Dot, Euclid, Manhattan), createCollection = true, dimension, vectorName (a named vector), textKey = 'text',
   *   batchSize = 256, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.collection) throw new Error('QdrantVectorStore needs a collection name.');
    this.collection = options.collection;
    this.distance = options.distance || 'Cosine';
    this.createCollection = options.createCollection !== false;
    this.dimension = options.dimension || null;
    this.vectorName = options.vectorName || null;
    this.textKey = options.textKey || 'text';
    this.batchSize = options.batchSize || 256;
    this._ready = null;
    const headers = { 'Content-Type': 'application/json' };
    if (options.apiKey) headers['api-key'] = options.apiKey;
    this.client = new FetchClient({ baseURL: String(options.url || 'http://localhost:6333').replace(/\/+$/, ''), headers });
  }

  /** Create the collection when it does not exist. Returns true when it was created. */
  async ensureCollection(dimension = this.dimension) {
    if (await this._exists()) return false;
    if (!dimension) throw new Error(`Qdrant collection '${this.collection}' does not exist and no dimension is known to create it.`);
    const vectors = { size: dimension, distance: this.distance };
    try {
      // a conflict means another call created it: no retries, then check again
      await this._request('PUT', this._path(), { vectors: this.vectorName ? { [this.vectorName]: vectors } : vectors }, { retries: 0 });
    } catch (error) {
      if (await this._exists().catch(() => false)) return false;
      throw error;
    }
    return true;
  }

  async upsert(records) {
    const items = toItems(records);
    if (items.length === 0) return [];
    if (this.createCollection) await this._prepare(items[0].vector.length);
    const points = items.map((item) => ({
      id: stableUuid(item.id),
      vector: this.vectorName ? { [this.vectorName]: item.vector } : item.vector,
      payload: { [this.textKey]: item.text, metadata: item.metadata, id: item.id },
    }));
    for (let start = 0; start < points.length; start += this.batchSize) {
      await this._request('PUT', `${this._path()}/points?wait=true`, { points: points.slice(start, start + this.batchSize) });
    }
    return items.map((item) => item.id);
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const filter = params.nativeFilter || toQdrantFilter(params.filter);
    const body = { query: vector, limit: params.topK || 5, with_payload: true };
    if (this.vectorName) body.using = this.vectorName;
    if (filter) body.filter = filter;
    const data = await this._request('POST', `${this._path()}/points/query`, body);
    const points = (data && data.result && data.result.points) || [];
    return points.map((point) => {
      const payload = point.payload || {};
      return {
        id: payload.id !== undefined && payload.id !== null ? String(payload.id) : String(point.id),
        // Cosine and Dot are similarities; Euclid and Manhattan are distances
        score: DISTANCE_METRICS.has(this.distance) ? 1 / (1 + point.score) : point.score,
        text: payload[this.textKey] ?? null,
        metadata: payload.metadata || {},
      };
    }).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const points = (ids || []).map(stableUuid);
    for (let start = 0; start < points.length; start += 1000) {
      await this._request('POST', `${this._path()}/points/delete?wait=true`, { points: points.slice(start, start + 1000) });
    }
  }

  _path() {
    return `/collections/${encodeURIComponent(this.collection)}`;
  }

  async _exists() {
    const data = await this._request('GET', `${this._path()}/exists`);
    return Boolean(data && data.result && data.result.exists);
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

  async _request(method, path, body, extraConfig = {}) {
    try {
      return await this.client.request(method, path, body, extraConfig);
    } catch (error) {
      throw qdrantError(error);
    }
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

module.exports = { QdrantVectorStore, stableUuid };
