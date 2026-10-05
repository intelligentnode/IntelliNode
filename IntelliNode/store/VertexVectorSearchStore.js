/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
// API: Vector Search 2.0 (vectorsearch.googleapis.com v1: collections, dataObjects:batchCreate / search) and
// Vector Search 1.0 (aiplatform v1: indexes:upsertDatapoints / removeDatapoints, indexEndpoints:findNeighbors)
const { VectorStore } = require('./VectorStore');
const { GoogleCloudService } = require('./GoogleCloud');

const VECTOR_SEARCH_BASE = 'https://vectorsearch.googleapis.com/v1';

// Data object ids must be 1-63 lowercase letters, digits or hyphens and start with a letter (RFC 1035).
function dataObjectId(id) {
  const text = String(id);
  if (/^[a-z](?:[-a-z0-9]{0,61}[a-z0-9])?$/.test(text)) return text;
  // FNV-1a, two rounds, so any id maps to a stable valid id
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ code, 0x811c9dc5) >>> 0;
  }
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  return `d-${slug ? `${slug}-` : ''}${h1.toString(16)}${h2.toString(16)}`.slice(0, 63).replace(/-+$/, '');
}

/**
 * Vertex AI Vector Search 2.0 collections: managed vector search that stores the data objects (text and metadata)
 * with their vectors. Create the collection once with createCollection({ dimensions }).
 * Metadata keys are stored as top-level data fields, so filters work on them ({ genre: 'sci-fi' }).
 * Credentials: OAuth (accessToken, a service account, or `gcloud auth application-default login`).
 */
class VertexVectorSearchStore extends VectorStore {
  /**
   * @param {object} options - { projectId, location = 'us-central1', collection, vectorField = 'embedding',
   *   distanceMetric = 'COSINE_DISTANCE' (or 'DOT_PRODUCT'), accessToken, credentials, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.collection) throw new Error('VertexVectorSearchStore needs a collection id.');
    this.service = new GoogleCloudService({ ...options, label: 'Vertex AI Vector Search' });
    this.client = this.service.client;
    this.location = options.location || 'us-central1';
    this.collection = options.collection;
    this.vectorField = options.vectorField || 'embedding';
    this.distanceMetric = options.distanceMetric || 'COSINE_DISTANCE';
  }

  async _collectionName() {
    if (this.collection.startsWith('projects/')) return this.collection;
    return `projects/${await this.service._project()}/locations/${this.location}/collections/${this.collection}`;
  }

  /** Create the collection (once). Waits for the operation when the API returns one. */
  async createCollection({ dimensions, displayName = null, description = null } = {}) {
    if (!dimensions) throw new Error('createCollection needs the vector dimensions.');
    const parent = `projects/${await this.service._project()}/locations/${this.location}`;
    const body = {
      displayName: displayName || this.collection,
      ...(description && { description }),
      vectorSchema: { [this.vectorField]: { denseVector: { dimensions } } },
      dataSchema: { type: 'object', properties: { text: { type: 'string' }, sourceId: { type: 'string' } } },
    };
    const result = await this.service._request('POST', `${VECTOR_SEARCH_BASE}/${parent}/collections?collectionId=${encodeURIComponent(this.collection)}`, body);
    if (result && result.name && result.done !== undefined) {
      return this.service.waitForOperation(result, (name) => `${VECTOR_SEARCH_BASE}/${name}`);
    }
    return result;
  }

  async upsert(records) {
    const collection = await this._collectionName();
    // create fails on an existing id, so replaced records are deleted first
    await this.delete((records || []).map((record) => record.id), { ignoreMissing: true });
    for (let start = 0; start < (records || []).length; start += 1000) {
      const requests = records.slice(start, start + 1000).map((record) => {
        if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
        return {
          dataObjectId: dataObjectId(record.id),
          dataObject: {
            data: { ...(record.metadata || {}), text: record.text ?? null, sourceId: String(record.id) },
            vectors: { [this.vectorField]: { dense: { values: record.vector } } },
          },
        };
      });
      await this.service._request('POST', `${VECTOR_SEARCH_BASE}/${collection}/dataObjects:batchCreate`, { requests });
    }
    return (records || []).map((record) => String(record.id));
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const filter = params.nativeFilter || VertexVectorSearchStore._filter(params.filter);
    const body = {
      vectorSearch: {
        searchField: this.vectorField,
        vector: { values: vector },
        topK: params.topK || 5,
        distanceMetric: this.distanceMetric,
        ...(filter && { filter }),
      },
    };
    const result = await this.service._request('POST', `${VECTOR_SEARCH_BASE}/${await this._collectionName()}/dataObjects:search`, body);
    return (result.results || []).map((item) => {
      const object = item.dataObject || {};
      const { text = null, sourceId = null, ...metadata } = object.data || {};
      return {
        id: sourceId || object.dataObjectId || (object.name || '').split('/').pop(),
        score: this._score(item.distance),
        text,
        metadata,
      };
    }).sort((a, b) => b.score - a.score);
  }

  _score(distance) {
    if (typeof distance !== 'number') return 0;
    return this.distanceMetric === 'COSINE_DISTANCE' ? 1 - distance : distance;
  }

  static _filter(filter) {
    if (!filter) return null;
    const clauses = Object.entries(filter).map(([key, value]) => ({ [key]: Array.isArray(value) ? { $in: value } : { $eq: value } }));
    if (!clauses.length) return null;
    return clauses.length === 1 ? clauses[0] : { $and: clauses };
  }

  async delete(ids, { ignoreMissing = false } = {}) {
    const collection = await this._collectionName();
    for (const id of ids || []) {
      try {
        await this.service._request('DELETE', `${VECTOR_SEARCH_BASE}/${collection}/dataObjects/${dataObjectId(id)}`);
      } catch (error) {
        if (!(ignoreMissing && error.status === 404)) throw error;
      }
    }
  }
}

/**
 * Vertex AI Vector Search 1.0: an index with stream updates deployed to a public index endpoint. Text and metadata
 * travel in embeddingMetadata (up to 2 KB per datapoint); metadata equality filters use restricts.
 */
class VertexVectorSearchIndexStore extends VectorStore {
  /**
   * @param {object} options - { projectId, location = 'us-central1', index (id or name), indexEndpoint (id or name),
   *   deployedIndexId, publicEndpointDomain (e.g. 123.us-central1-456.vdb.vertexai.goog), distanceMeasure =
   *   'DOT_PRODUCT_DISTANCE' (or 'COSINE_DISTANCE', 'SQUARED_L2_DISTANCE'), restrictKeys (metadata keys sent as
   *   restricts), accessToken, credentials, embedder }.
   */
  constructor(options = {}) {
    super(options);
    for (const key of ['index', 'indexEndpoint', 'deployedIndexId', 'publicEndpointDomain']) {
      if (!options[key]) throw new Error(`VertexVectorSearchIndexStore needs ${key}.`);
    }
    this.service = new GoogleCloudService({ ...options, label: 'Vertex AI Vector Search' });
    this.client = this.service.client;
    this.location = options.location || 'us-central1';
    this.index = options.index;
    this.indexEndpoint = options.indexEndpoint;
    this.deployedIndexId = options.deployedIndexId;
    this.publicEndpointDomain = String(options.publicEndpointDomain).replace(/^https?:\/\//, '').replace(/\/+$/, '');
    this.distanceMeasure = options.distanceMeasure || 'DOT_PRODUCT_DISTANCE';
    this.restrictKeys = options.restrictKeys || [];
  }

  async _name(kind, value) {
    if (String(value).startsWith('projects/')) return value;
    return `projects/${await this.service._project()}/locations/${this.location}/${kind}/${value}`;
  }

  async upsert(records) {
    const index = await this._name('indexes', this.index);
    const datapoints = (records || []).map((record) => {
      if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
      const metadata = record.metadata || {};
      const restricts = this.restrictKeys
        .filter((key) => metadata[key] !== undefined && metadata[key] !== null)
        .map((key) => ({ namespace: key, allowList: (Array.isArray(metadata[key]) ? metadata[key] : [metadata[key]]).map(String) }));
      return {
        datapointId: String(record.id),
        featureVector: record.vector,
        ...(restricts.length && { restricts }),
        embeddingMetadata: { text: record.text ?? null, metadata },
      };
    });
    const url = `https://${this.location}-aiplatform.googleapis.com/v1/${index}:upsertDatapoints`;
    for (let start = 0; start < datapoints.length; start += 1000) {
      await this.service._request('POST', url, { datapoints: datapoints.slice(start, start + 1000) });
    }
    return datapoints.map((datapoint) => datapoint.datapointId);
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const restricts = Object.entries(params.filter || {}).map(([key, value]) => ({ namespace: key, allowList: (Array.isArray(value) ? value : [value]).map(String) }));
    const endpoint = await this._name('indexEndpoints', this.indexEndpoint);
    const body = {
      deployedIndexId: this.deployedIndexId,
      returnFullDatapoint: true,
      queries: [{
        datapoint: { datapointId: 'query', featureVector: vector, ...(restricts.length && { restricts }), ...(params.nativeFilter || {}) },
        neighborCount: params.topK || 5,
      }],
    };
    const result = await this.service._request('POST', `https://${this.publicEndpointDomain}/v1/${endpoint}:findNeighbors`, body);
    const neighbors = (result.nearestNeighbors && result.nearestNeighbors[0] && result.nearestNeighbors[0].neighbors) || [];
    return neighbors.map((neighbor) => {
      const datapoint = neighbor.datapoint || {};
      const payload = datapoint.embeddingMetadata || {};
      return { id: datapoint.datapointId, score: this._score(neighbor.distance), text: payload.text ?? null, metadata: payload.metadata || {} };
    }).sort((a, b) => b.score - a.score);
  }

  // DOT_PRODUCT_DISTANCE comes back as the dot product (higher is closer); the others are distances.
  _score(distance) {
    if (typeof distance !== 'number') return 0;
    if (this.distanceMeasure === 'COSINE_DISTANCE') return 1 - distance;
    if (this.distanceMeasure === 'SQUARED_L2_DISTANCE') return 1 / (1 + distance);
    return distance;
  }

  async delete(ids) {
    const index = await this._name('indexes', this.index);
    await this.service._request('POST', `https://${this.location}-aiplatform.googleapis.com/v1/${index}:removeDatapoints`, { datapointIds: (ids || []).map(String) });
  }
}

module.exports = { VertexVectorSearchStore, VertexVectorSearchIndexStore, dataObjectId };
