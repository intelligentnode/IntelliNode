/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');

// table or schema.table: identifier characters only, since the name goes into the SQL text
const TABLE_NAME = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)?$/;
// pgvector indexes the vector type with HNSW up to 2,000 dimensions
const MAX_INDEXED_DIMENSIONS = 2000;

function toVectorLiteral(vector) {
  return `[${vector.map((value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) throw new Error(`pgvector cannot store the value ${value}.`);
    return number;
  }).join(',')}]`;
}

function pgError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `pgvector error: ${wrapped.message}`;
  return wrapped;
}

/**
 * PostgreSQL with the pgvector extension (also AlloyDB, Cloud SQL, Supabase, Neon), without a driver dependency:
 * pass any client with query(sql, params) -> { rows }, such as a `pg` Pool or Client.
 *
 *   const { Pool } = require('pg');
 *   const store = new PgVectorStore({ client: new Pool({ connectionString }), dimension: 1536, embedder });
 *
 * With createTable the first use runs CREATE EXTENSION IF NOT EXISTS vector and creates the table
 * (id text primary key, text, metadata jsonb, embedding vector(dimension)) plus an HNSW cosine index when the
 * dimension is at most 2,000. Scores are 1 - cosine distance. filter matches with metadata @> (arrays mean
 * one of); nativeFilter is a SQL condition string, or { sql, params } with its own $1.. placeholders.
 */
class PgVectorStore extends VectorStore {
  // API: https://github.com/pgvector/pgvector
  /**
   * @param {object} options - { client, table = 'intellinode_vectors' (or schema.table), dimension,
   *   createTable = true, createIndex = true, batchSize = 500, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.client || typeof options.client.query !== 'function') {
      throw new Error('PgVectorStore needs { client }: a pg Pool or Client, or any object with query(sql, params).');
    }
    this.client = options.client;
    this.table = options.table || 'intellinode_vectors';
    if (!TABLE_NAME.test(this.table)) throw new Error(`Invalid table name '${this.table}': use letters, digits and underscores.`);
    this.dimension = options.dimension || null;
    this.createTable = options.createTable !== false;
    this.createIndex = options.createIndex !== false;
    this.batchSize = options.batchSize || 500;
    this._ready = null;
  }

  /** Create the extension, the table and its index when missing. */
  async ensureTable(dimension = this.dimension) {
    const size = Number(dimension);
    if (!Number.isInteger(size) || size <= 0) throw new Error('PgVectorStore needs a dimension to create its table.');
    await this._query('CREATE EXTENSION IF NOT EXISTS vector');
    await this._query(`CREATE TABLE IF NOT EXISTS ${this.table} (
      id text PRIMARY KEY,
      text text,
      metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
      embedding vector(${size}) NOT NULL
    )`);
    if (this.createIndex && size <= MAX_INDEXED_DIMENSIONS) {
      const indexName = `${this.table.split('.').pop()}_embedding_idx`;
      await this._query(`CREATE INDEX IF NOT EXISTS ${indexName} ON ${this.table} USING hnsw (embedding vector_cosine_ops)`);
    }
  }

  async upsert(records) {
    // one INSERT cannot touch the same row twice: the last record of an id wins
    const items = [...new Map(toItems(records).map((item) => [item.id, item])).values()];
    if (items.length === 0) return [];
    await this._prepare(items[0].vector.length);
    for (let start = 0; start < items.length; start += this.batchSize) {
      const rows = [];
      const params = [];
      for (const item of items.slice(start, start + this.batchSize)) {
        const n = params.length;
        rows.push(`($${n + 1}, $${n + 2}, $${n + 3}::jsonb, $${n + 4}::vector)`);
        params.push(item.id, item.text, JSON.stringify(item.metadata), toVectorLiteral(item.vector));
      }
      await this._query(`INSERT INTO ${this.table} (id, text, metadata, embedding) VALUES ${rows.join(', ')}
        ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, metadata = EXCLUDED.metadata, embedding = EXCLUDED.embedding`, params);
    }
    return (records || []).map((record) => String(record.id));
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    if (this.dimension) await this._prepare(this.dimension);
    const values = [toVectorLiteral(vector)];
    const conditions = [];
    if (params.nativeFilter) {
      const native = typeof params.nativeFilter === 'string' ? { sql: params.nativeFilter, params: [] } : params.nativeFilter;
      const offset = values.length;
      conditions.push(`(${native.sql.replace(/\$(\d+)/g, (match, index) => `$${Number(index) + offset}`)})`);
      values.push(...(native.params || []));
    } else if (params.filter) {
      const equal = {};
      for (const [key, value] of Object.entries(params.filter)) {
        if (!Array.isArray(value)) {
          equal[key] = value;
          continue;
        }
        // a jsonb array contains a scalar member, so this reads "metadata.key is one of value"
        values.push(JSON.stringify(value), key);
        conditions.push(`$${values.length - 1}::jsonb @> (metadata -> $${values.length}::text)`);
      }
      if (Object.keys(equal).length > 0) {
        values.push(JSON.stringify(equal));
        conditions.push(`metadata @> $${values.length}::jsonb`);
      }
    }
    values.push(Math.floor(params.topK || 5));
    const where = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
    const result = await this._query(`SELECT id, text, metadata, 1 - (embedding <=> $1::vector) AS score
      FROM ${this.table}${where} ORDER BY embedding <=> $1::vector LIMIT $${values.length}`, values);
    return ((result && result.rows) || []).map((row) => ({
      id: String(row.id),
      score: Number(row.score),
      text: row.text ?? null,
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {}),
    })).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const list = (ids || []).map(String);
    if (list.length === 0) return;
    await this._query(`DELETE FROM ${this.table} WHERE id = ANY($1::text[])`, [list]);
  }

  _prepare(dimension) {
    if (!this.createTable) return Promise.resolve();
    if (!this._ready) {
      this._ready = this.ensureTable(this.dimension || dimension).catch((error) => {
        this._ready = null;
        throw error;
      });
    }
    return this._ready;
  }

  async _query(sql, params) {
    try {
      return await (params ? this.client.query(sql, params) : this.client.query(sql));
    } catch (error) {
      throw pgError(error);
    }
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

module.exports = { PgVectorStore };
