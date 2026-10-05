/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('../utils/FetchClient');
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');

// Pinecone rejects upsert requests over 2MB; stay under it with room for the JSON envelope
const MAX_BATCH_BYTES = 1500000;

function toPineconeFilter(filter) {
  const entries = Object.entries(filter || {});
  if (entries.length === 0) return null;
  const result = {};
  for (const [key, value] of entries) result[key] = Array.isArray(value) ? { $in: value } : { $eq: value };
  return result;
}

// Pinecone metadata takes strings, numbers, booleans and string lists, and rejects nulls.
function cleanMetadata(metadata) {
  const result = {};
  for (const [key, value] of Object.entries(metadata || {})) {
    if (value !== null && value !== undefined) result[key] = value;
  }
  return result;
}

function pineconeError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `Pinecone error: ${wrapped.message}`;
  return wrapped;
}

/**
 * A Pinecone index through the data plane REST API.
 *
 *   const store = new PineconeVectorStore({ apiKey, indexHost: 'docs-abc123.svc.aped-4627-b74a.pinecone.io', embedder });
 *
 * Create the index first (console or control plane) with the embedder's dimension; with the cosine metric the
 * scores are cosine similarities. The record text is kept in the metadata under textKey. filter becomes
 * { key: { $eq } } or { key: { $in } }; nativeFilter is a Pinecone metadata filter.
 */
class PineconeVectorStore extends VectorStore {
  // API: https://docs.pinecone.io/reference/api/2026-07/data-plane/upsert
  /**
   * @param {object} options - { apiKey, indexHost (the index host, with or without https://), namespace,
   *   apiVersion = '2026-07', metric = 'cosine' (the index metric: cosine, dotproduct or euclidean),
   *   textKey = 'text', batchSize = 100, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.apiKey) throw new Error('PineconeVectorStore needs an apiKey.');
    if (!options.indexHost) throw new Error('PineconeVectorStore needs the indexHost of the index.');
    const host = String(options.indexHost).replace(/\/+$/, '');
    this.namespace = options.namespace || null;
    this.metric = options.metric || 'cosine';
    this.textKey = options.textKey || 'text';
    this.batchSize = Math.min(options.batchSize || 100, 1000);
    this.client = new FetchClient({
      baseURL: /^https?:\/\//i.test(host) ? host : `https://${host}`,
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': options.apiKey,
        'X-Pinecone-Api-Version': options.apiVersion || '2026-07',
      },
    });
  }

  async upsert(records) {
    const items = toItems(records);
    const vectors = items.map((item) => {
      const metadata = cleanMetadata(item.metadata);
      if (item.text !== null) metadata[this.textKey] = item.text;
      return Object.keys(metadata).length > 0
        ? { id: item.id, values: item.vector, metadata }
        : { id: item.id, values: item.vector };
    });
    let batch = [];
    let bytes = 0;
    for (const vector of vectors) {
      const size = JSON.stringify(vector).length;
      if (batch.length > 0 && (batch.length >= this.batchSize || bytes + size > MAX_BATCH_BYTES)) {
        await this._request('POST', '/vectors/upsert', this._withNamespace({ vectors: batch }));
        batch = [];
        bytes = 0;
      }
      batch.push(vector);
      bytes += size;
    }
    if (batch.length > 0) await this._request('POST', '/vectors/upsert', this._withNamespace({ vectors: batch }));
    return items.map((item) => item.id);
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const filter = params.nativeFilter || toPineconeFilter(params.filter);
    const body = this._withNamespace({ vector, topK: params.topK || 5, includeMetadata: true, includeValues: false });
    if (filter) body.filter = filter;
    const data = await this._request('POST', '/query', body);
    return ((data && data.matches) || []).map((match) => {
      const { [this.textKey]: text = null, ...metadata } = match.metadata || {};
      // cosine and dotproduct scores are similarities; euclidean is a distance
      const score = this.metric === 'euclidean' ? 1 / (1 + match.score) : match.score;
      return { id: match.id, score, text, metadata };
    }).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const list = (ids || []).map(String);
    for (let start = 0; start < list.length; start += 1000) {
      await this._request('POST', '/vectors/delete', this._withNamespace({ ids: list.slice(start, start + 1000) }));
    }
  }

  _withNamespace(body) {
    return this.namespace ? { ...body, namespace: this.namespace } : body;
  }

  async _request(method, path, body) {
    try {
      return await this.client.request(method, path, body);
    } catch (error) {
      throw pineconeError(error);
    }
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

module.exports = { PineconeVectorStore };
