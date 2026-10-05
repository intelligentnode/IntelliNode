/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');

function toAtlasFilter(filter) {
  const clauses = Object.entries(filter || {}).map(([key, value]) => ({
    [`metadata.${key}`]: Array.isArray(value) ? { $in: value } : { $eq: value },
  }));
  if (clauses.length === 0) return null;
  return clauses.length === 1 ? clauses[0] : { $and: clauses };
}

// The document for a record; a dotted path ('embedding.values') becomes nested fields.
function toDocument(item, textKey, path) {
  const document = { [textKey]: item.text, metadata: item.metadata };
  const keys = path.split('.');
  let target = document;
  for (const key of keys.slice(0, -1)) {
    target[key] = target[key] && typeof target[key] === 'object' ? target[key] : {};
    target = target[key];
  }
  target[keys[keys.length - 1]] = item.vector;
  return document;
}

function mongoError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `MongoDB error: ${wrapped.message}`;
  return wrapped;
}

/**
 * MongoDB Atlas Vector Search, without a driver dependency: pass a driver Collection
 * (client.db(name).collection(name) from the `mongodb` package).
 *
 *   const store = new MongoDBAtlasVectorStore({ collection: client.db('app').collection('docs'), embedder });
 *
 * Documents are { _id: id, text, metadata, embedding }. The collection needs an Atlas Vector Search index
 * (indexName) on `path`; createIndex({ dimension, filterFields }) creates one. Atlas only filters on paths
 * indexed as "filter" fields, so every metadata key used in `filter` must be listed there (as metadata.<key>).
 * filter becomes $eq / $in on metadata.<key> (joined by $and); nativeFilter is a $vectorSearch filter.
 * Atlas scores cosine and dotProduct as (1 + similarity) / 2, converted back to the similarity; euclidean keeps
 * 1 / (1 + distance).
 */
class MongoDBAtlasVectorStore extends VectorStore {
  // API: https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-stage/
  /**
   * @param {object} options - { collection, indexName = 'vector_index', path = 'embedding', textKey = 'text',
   *   similarity = 'cosine' (the index similarity), numCandidatesMultiplier = 20 (numCandidates = topK x it, at
   *   most 10,000), batchSize = 1000, embedder }.
   */
  constructor(options = {}) {
    super(options);
    const collection = options.collection;
    if (!collection || typeof collection.aggregate !== 'function' || typeof collection.bulkWrite !== 'function') {
      throw new Error('MongoDBAtlasVectorStore needs { collection }: a MongoDB driver Collection.');
    }
    this.collection = collection;
    this.indexName = options.indexName || 'vector_index';
    this.path = options.path || 'embedding';
    this.textKey = options.textKey || 'text';
    this.similarity = options.similarity || 'cosine';
    this.numCandidatesMultiplier = options.numCandidatesMultiplier || 20;
    this.batchSize = options.batchSize || 1000;
  }

  /**
   * Create the Atlas Vector Search index (it builds in the background, so queries return nothing until it is ready).
   * @param {{dimension: number, filterFields?: string[]}} settings - filterFields are metadata keys to filter on.
   */
  async createIndex({ dimension, filterFields = [] } = {}) {
    if (!dimension) throw new Error('createIndex needs the vector dimension.');
    const fields = [{ type: 'vector', path: this.path, numDimensions: dimension, similarity: this.similarity }];
    for (const key of filterFields) fields.push({ type: 'filter', path: `metadata.${key}` });
    try {
      return await this.collection.createSearchIndex({ name: this.indexName, type: 'vectorSearch', definition: { fields } });
    } catch (error) {
      throw mongoError(error);
    }
  }

  async upsert(records) {
    const items = toItems(records);
    for (let start = 0; start < items.length; start += this.batchSize) {
      const operations = items.slice(start, start + this.batchSize).map((item) => ({
        replaceOne: { filter: { _id: item.id }, replacement: toDocument(item, this.textKey, this.path), upsert: true },
      }));
      try {
        await this.collection.bulkWrite(operations, { ordered: true });
      } catch (error) {
        throw mongoError(error);
      }
    }
    return items.map((item) => item.id);
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const limit = Math.floor(params.topK || 5);
    const stage = {
      index: this.indexName,
      path: this.path,
      queryVector: vector,
      numCandidates: Math.min(10000, Math.max(limit, limit * this.numCandidatesMultiplier)),
      limit,
    };
    const filter = params.nativeFilter || toAtlasFilter(params.filter);
    if (filter) stage.filter = filter;
    const pipeline = [
      { $vectorSearch: stage },
      { $project: { _id: 1, [this.textKey]: 1, metadata: 1, score: { $meta: 'vectorSearchScore' } } },
    ];
    let rows;
    try {
      rows = await this.collection.aggregate(pipeline).toArray();
    } catch (error) {
      throw mongoError(error);
    }
    return (rows || []).map((row) => ({
      id: String(row._id),
      score: this.similarity === 'euclidean' ? row.score : 2 * row.score - 1,
      text: row[this.textKey] ?? null,
      metadata: row.metadata || {},
    })).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const list = (ids || []).map(String);
    if (list.length === 0) return;
    try {
      await this.collection.deleteMany({ _id: { $in: list } });
    } catch (error) {
      throw mongoError(error);
    }
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

module.exports = { MongoDBAtlasVectorStore };
