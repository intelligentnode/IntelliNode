/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { VectorStore, matchesFilter, cosineSimilarity } = require('./VectorStore');

/**
 * An in-process vector store (exact cosine search). Good for local apps, tests and a few thousand records.
 * With { path } (Node only) the records are kept in a JSON file and loaded on first use.
 *
 *   const store = new MemoryVectorStore({ embedder: { provider: 'openai', apiKey } });
 *   await store.addDocuments([{ text: 'IntelliNode supports Gemini.' }]);
 *   const hits = await store.search('Which models are supported?', 3);
 */
class MemoryVectorStore extends VectorStore {
  constructor(options = {}) {
    super(options);
    this.path = options.path || null;
    this.records = new Map();
    this._loaded = !this.path;
  }

  async upsert(records) {
    await this._load();
    for (const record of records || []) {
      if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
      const id = String(record.id);
      this.records.set(id, { id, vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} });
    }
    await this._save();
    return (records || []).map((record) => String(record.id));
  }

  async query(params = {}) {
    await this._load();
    const vector = await this._queryVector(params);
    const topK = params.topK || 5;
    const filter = params.nativeFilter || params.filter;
    const matches = [];
    for (const record of this.records.values()) {
      const passes = typeof filter === 'function' ? filter(record.metadata, record) : matchesFilter(record.metadata, filter);
      if (!passes) continue;
      matches.push({ id: record.id, score: cosineSimilarity(vector, record.vector), text: record.text, metadata: record.metadata });
    }
    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, topK);
  }

  async get(ids) {
    await this._load();
    return ids.map((id) => this.records.get(String(id))).filter(Boolean);
  }

  async delete(ids) {
    await this._load();
    for (const id of ids || []) this.records.delete(String(id));
    await this._save();
  }

  /** Delete every record (or only those whose metadata matches filter). */
  async clear(filter = null) {
    await this._load();
    if (!filter) {
      this.records.clear();
    } else {
      for (const [id, record] of this.records) {
        if (matchesFilter(record.metadata, filter)) this.records.delete(id);
      }
    }
    await this._save();
  }

  async count() {
    await this._load();
    return this.records.size;
  }

  async _load() {
    if (this._loaded) return;
    this._loaded = true;
    const fs = require('fs');
    if (!fs.promises || !this.path) return;
    try {
      const data = JSON.parse(await fs.promises.readFile(this.path, 'utf8'));
      for (const record of data.records || []) this.records.set(String(record.id), record);
    } catch (error) {
      if (error.code !== 'ENOENT') throw new Error(`Could not read the vector store file ${this.path}: ${error.message}`);
    }
  }

  async _save() {
    if (!this.path) return;
    const fs = require('fs');
    const path = require('path');
    await fs.promises.mkdir(path.dirname(this.path), { recursive: true });
    // write a temporary file first so a crash never leaves a half-written store
    const temporary = `${this.path}.tmp`;
    await fs.promises.writeFile(temporary, JSON.stringify({ version: 1, records: [...this.records.values()] }));
    await fs.promises.rename(temporary, this.path);
  }
}

module.exports = { MemoryVectorStore };
