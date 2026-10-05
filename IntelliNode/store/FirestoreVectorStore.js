/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
// API: https://cloud.google.com/firestore/native/docs/vector-search and the Firestore REST v1 reference
const { VectorStore } = require('./VectorStore');
const { GoogleCloudService, Firestore, FirestoreVector } = require('./GoogleCloud');

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';
// Firestore commits take at most 500 writes
const BATCH = 500;

/**
 * Vectors in Google Cloud Firestore (native vector search with findNearest), next to your app data.
 * Each record is a document { id, text, metadata, embedding }.
 *
 * Firestore needs a vector index on the embedding field before the first query, created once:
 *   gcloud firestore indexes composite create --collection-group=intellinode_vectors --query-scope=COLLECTION \
 *     --field-config field-path=embedding,vector-config='{"dimension":"768","flat":"{}"}' --database='(default)'
 * A metadata filter needs a composite index that also lists the metadata fields (metadata.<key>).
 * Credentials: OAuth (accessToken, a service account, or `gcloud auth application-default login`); API keys are not accepted.
 */
class FirestoreVectorStore extends VectorStore {
  /**
   * @param {object} options - { projectId, database = '(default)', collection = 'intellinode_vectors',
   *   vectorField = 'embedding', distanceMeasure = 'COSINE' (or 'EUCLIDEAN', 'DOT_PRODUCT'), accessToken,
   *   credentials, embedder }.
   */
  constructor(options = {}) {
    super(options);
    this.service = new GoogleCloudService({ ...options, label: 'Firestore' });
    this.client = this.service.client;
    this.database = options.database || '(default)';
    this.collection = options.collection || 'intellinode_vectors';
    this.vectorField = options.vectorField || 'embedding';
    this.distanceMeasure = options.distanceMeasure || 'COSINE';
  }

  async _root() {
    return `projects/${await this.service._project()}/databases/${this.database}/documents`;
  }

  async upsert(records) {
    const root = await this._root();
    const writes = (records || []).map((record) => {
      if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
      return {
        update: {
          name: `${root}/${this.collection}/${Firestore.docId(record.id)}`,
          fields: Firestore.toFields({
            id: String(record.id),
            text: record.text ?? null,
            metadata: record.metadata || {},
            [this.vectorField]: new FirestoreVector(record.vector),
          }),
        },
      };
    });
    await this._commit(writes);
    return (records || []).map((record) => String(record.id));
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const root = await this._root();
    const where = params.nativeFilter || Firestore.where(params.filter, 'metadata.');
    const body = {
      structuredQuery: {
        from: [{ collectionId: this.collection }],
        ...(where && { where }),
        findNearest: {
          vectorField: { fieldPath: this.vectorField },
          queryVector: Firestore.toValue(new FirestoreVector(vector)),
          distanceMeasure: this.distanceMeasure,
          limit: params.topK || 5,
          distanceResultField: '_distance',
        },
      },
    };
    const rows = await this.service._request('POST', `${FIRESTORE_BASE}/${root}:runQuery`, body);
    return (Array.isArray(rows) ? rows : [rows])
      .filter((row) => row && row.document)
      .map((row) => {
        const data = Firestore.fromFields(row.document.fields);
        return {
          id: data.id || decodeURIComponent(row.document.name.split('/').pop()),
          score: this._score(data._distance),
          text: data.text ?? null,
          metadata: data.metadata || {},
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  // Firestore returns distances: COSINE is 0..2 (0 = same), EUCLIDEAN grows with distance, DOT_PRODUCT grows with similarity.
  _score(distance) {
    if (typeof distance !== 'number') return 0;
    if (this.distanceMeasure === 'COSINE') return 1 - distance;
    if (this.distanceMeasure === 'EUCLIDEAN') return 1 / (1 + distance);
    return distance;
  }

  async delete(ids) {
    const root = await this._root();
    await this._commit((ids || []).map((id) => ({ delete: `${root}/${this.collection}/${Firestore.docId(id)}` })));
  }

  async _commit(writes) {
    if (!writes.length) return;
    const url = `${FIRESTORE_BASE}/projects/${await this.service._project()}/databases/${this.database}/documents:commit`;
    for (let start = 0; start < writes.length; start += BATCH) {
      await this.service._request('POST', url, { writes: writes.slice(start, start + BATCH) });
    }
  }

  /** The gcloud command that creates the vector index this store needs. */
  indexCommand(dimension) {
    return `gcloud firestore indexes composite create --collection-group=${this.collection} --query-scope=COLLECTION `
      + `--field-config field-path=${this.vectorField},vector-config='{"dimension":"${dimension}","flat":"{}"}' --database='${this.database}'`;
  }
}

module.exports = { FirestoreVectorStore };
