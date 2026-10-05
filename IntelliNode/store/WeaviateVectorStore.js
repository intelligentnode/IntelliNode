/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('../utils/FetchClient');
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');
const { stableUuid } = require('./QdrantVectorStore');

const ID_PROPERTY = 'recordId';
const METADATA_PROPERTY = 'metadataJson';
// metadata keys that can also be stored as their own (filterable) property
const PROPERTY_NAME = /^[_a-z][_0-9A-Za-z]*$/;
const RESERVED = new Set(['id', '_id', '_additional', ID_PROPERTY, METADATA_PROPERTY]);

function isScalar(value) {
  return typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value));
}

function valueKey(value) {
  if (typeof value === 'boolean') return 'valueBoolean';
  if (typeof value === 'number') return 'valueNumber';
  return 'valueText';
}

function toWeaviateWhere(filter) {
  const operands = Object.entries(filter || {}).map(([key, value]) => {
    if (!Array.isArray(value)) return { path: [key], operator: 'Equal', [valueKey(value)]: value };
    const options = value.map((item) => ({ path: [key], operator: 'Equal', [valueKey(item)]: item }));
    return options.length === 1 ? options[0] : { operator: 'Or', operands: options };
  });
  if (operands.length === 0) return null;
  return operands.length === 1 ? operands[0] : { operator: 'And', operands };
}

// GraphQL input literal: object keys are bare names and `operator` values are enums.
function gql(value, key) {
  if (Array.isArray(value)) return `[${value.map((item) => gql(item)).join(', ')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value).map(([name, item]) => `${name}: ${gql(item, name)}`).join(', ')}}`;
  }
  if (key === 'operator' && /^[A-Za-z]+$/.test(String(value))) return String(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error(`Weaviate cannot take the number ${value}.`);
    return String(value);
  }
  return JSON.stringify(value);
}

function parseMetadata(value) {
  if (!value) return {};
  try {
    return JSON.parse(value);
  } catch (error) {
    return {};
  }
}

function weaviateError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `Weaviate error: ${wrapped.message}`;
  return wrapped;
}

/**
 * A Weaviate collection (class) through the REST and GraphQL APIs, with vectors you provide.
 *
 *   const store = new WeaviateVectorStore({ url: 'http://localhost:8080', className: 'Docs', embedder });
 *
 * Objects need UUIDs, so each record id is stored as its UUID v5 (the same as the Python client's
 * generate_uuid5(id)) and the original id goes in the recordId property. Metadata is kept whole as JSON in
 * metadataJson, and its scalar keys (lowercase names) are also written as their own properties so `filter` can
 * match them (Equal; a text property follows its tokenization). nativeFilter is a Weaviate where object, e.g.
 * { path: ['year'], operator: 'GreaterThan', valueInt: 2020 }.
 *
 * A new class is created with a self-provided named vector (vectorName = 'default'); an existing class keeps its
 * own vector setup (named or legacy). Scores: cosine 1 - distance, dot -distance, other metrics 1 / (1 + distance).
 */
class WeaviateVectorStore extends VectorStore {
  // API: https://docs.weaviate.io/weaviate/api/graphql/search-operators (GraphQL), /v1/batch/objects and /v1/schema (REST)
  /**
   * @param {object} options - { url = 'http://localhost:8080', apiKey, className, textKey = 'text',
   *   vectorName = 'default' (null for the legacy unnamed vector), distance = 'cosine', createClass = true,
   *   headers (e.g. module API keys), batchSize = 100, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.className) throw new Error('WeaviateVectorStore needs a className.');
    const name = String(options.className);
    this.className = name.charAt(0).toUpperCase() + name.slice(1);
    if (!/^[A-Z][_0-9A-Za-z]*$/.test(this.className)) throw new Error(`Invalid Weaviate class name '${options.className}'.`);
    this.textKey = options.textKey || 'text';
    this.vectorName = options.vectorName === undefined ? 'default' : options.vectorName;
    this.distance = options.distance || 'cosine';
    this.createClass = options.createClass !== false;
    this.batchSize = options.batchSize || 100;
    this._classReady = false;
    this._loading = null;
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (options.apiKey) headers.Authorization = `Bearer ${options.apiKey}`;
    this.client = new FetchClient({ baseURL: String(options.url || 'http://localhost:8080').replace(/\/+$/, ''), headers });
  }

  async upsert(records) {
    const items = toItems(records);
    if (items.length === 0) return [];
    await this._prepare(true);
    const objects = items.map((item) => {
      const properties = { [this.textKey]: item.text, [ID_PROPERTY]: item.id, [METADATA_PROPERTY]: JSON.stringify(item.metadata) };
      for (const [key, value] of Object.entries(item.metadata)) {
        if (key === this.textKey || RESERVED.has(key) || !PROPERTY_NAME.test(key)) continue;
        if (isScalar(value) || (Array.isArray(value) && value.length > 0 && value.every(isScalar))) properties[key] = value;
      }
      const object = { class: this.className, id: stableUuid(item.id), properties };
      if (this.vectorName) object.vectors = { [this.vectorName]: item.vector };
      else object.vector = item.vector;
      return object;
    });
    for (let start = 0; start < objects.length; start += this.batchSize) {
      const results = await this._request('POST', '/v1/batch/objects', { objects: objects.slice(start, start + this.batchSize) });
      // the batch answers 200 and reports failures per object
      const failed = (Array.isArray(results) ? results : []).find((result) => result.result && result.result.errors);
      if (failed) {
        const messages = (failed.result.errors.error || []).map((error) => error.message).join('; ');
        throw new Error(`Weaviate error: object ${failed.id}: ${messages || JSON.stringify(failed.result.errors)}`);
      }
    }
    return items.map((item) => item.id);
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    await this._prepare(false);
    const near = { vector };
    if (this.vectorName) near.targetVectors = [this.vectorName];
    const args = [`nearVector: ${gql(near)}`, `limit: ${Math.floor(params.topK || 5)}`];
    const where = params.nativeFilter || toWeaviateWhere(params.filter);
    if (where) args.push(`where: ${gql(where)}`);
    const fields = `${this.textKey} ${ID_PROPERTY} ${METADATA_PROPERTY} _additional { id distance }`;
    const data = await this._request('POST', '/v1/graphql', { query: `{ Get { ${this.className}(${args.join(', ')}) { ${fields} } } }` });
    if (data && Array.isArray(data.errors) && data.errors.length > 0) {
      throw new Error(`Weaviate error: ${data.errors.map((error) => error.message).join('; ')}`);
    }
    const objects = (data && data.data && data.data.Get && data.data.Get[this.className]) || [];
    return objects.map((object) => {
      const additional = object._additional || {};
      return {
        id: object[ID_PROPERTY] ?? additional.id,
        score: this._score(additional.distance),
        text: object[this.textKey] ?? null,
        metadata: parseMetadata(object[METADATA_PROPERTY]),
      };
    }).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const uuids = (ids || []).map(stableUuid);
    for (let start = 0; start < uuids.length; start += 1000) {
      await this._request('DELETE', '/v1/batch/objects', {
        match: { class: this.className, where: { path: ['id'], operator: 'ContainsAny', valueTextArray: uuids.slice(start, start + 1000) } },
        output: 'minimal',
      });
    }
  }

  _score(distance) {
    if (this.distance === 'cosine') return 1 - distance;
    if (this.distance === 'dot') return -distance;
    return 1 / (1 + distance);
  }

  // Read the class once: an existing class decides the vector setup; a missing one is created on the first upsert.
  async _prepare(create) {
    if (this._classReady) return;
    if (!this._loading) this._loading = this._loadClass().finally(() => { this._loading = null; });
    if (await this._loading) {
      this._classReady = true;
    } else if (create && this.createClass) {
      await this._createClass();
      this._classReady = true;
    }
  }

  async _loadClass() {
    let schema;
    try {
      schema = await this._request('GET', `/v1/schema/${this.className}`);
    } catch (error) {
      if (error.status === 404) return false;
      throw error;
    }
    const named = schema && schema.vectorConfig ? Object.keys(schema.vectorConfig) : [];
    if (named.length === 0) {
      this.vectorName = null;
    } else if (!named.includes(this.vectorName)) {
      this.vectorName = named[0];
    }
    const indexConfig = this.vectorName ? schema.vectorConfig[this.vectorName].vectorIndexConfig : schema && schema.vectorIndexConfig;
    if (indexConfig && indexConfig.distance) this.distance = indexConfig.distance;
    return true;
  }

  async _createClass() {
    const vectorIndexConfig = { distance: this.distance };
    const definition = {
      class: this.className,
      properties: [
        { name: this.textKey, dataType: ['text'] },
        { name: ID_PROPERTY, dataType: ['text'], tokenization: 'field' },
        { name: METADATA_PROPERTY, dataType: ['text'], indexFilterable: false, indexSearchable: false },
      ],
    };
    if (this.vectorName) {
      definition.vectorConfig = { [this.vectorName]: { vectorizer: { none: {} }, vectorIndexType: 'hnsw', vectorIndexConfig } };
    } else {
      Object.assign(definition, { vectorizer: 'none', vectorIndexType: 'hnsw', vectorIndexConfig });
    }
    try {
      await this._request('POST', '/v1/schema', definition, { retries: 0 });
    } catch (error) {
      // created meanwhile by another call
      if (!(await this._loadClass().catch(() => false))) throw error;
    }
  }

  async _request(method, path, body, extraConfig = {}) {
    try {
      return await this.client.request(method, path, body, extraConfig);
    } catch (error) {
      throw weaviateError(error);
    }
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

module.exports = { WeaviateVectorStore };
