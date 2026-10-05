/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
// API: https://cloud.google.com/vertex-ai/generative-ai/docs/rag-engine/rag-overview (REST v1: ragCorpora, ragFiles,
// media.upload, projects.locations.retrieveContexts)
const config = require('../config.json');
const { VectorStore } = require('./VectorStore');
const { GoogleCloudService } = require('./GoogleCloud');

/**
 * Vertex AI RAG Engine: a managed corpus that parses, chunks, embeds and indexes your files on Google Cloud.
 * Use it as a knowledge store (query by text), or ground Gemini directly with store.tool().
 *
 *   const corpus = await VertexRAGStore.createCorpus({ projectId, displayName: 'handbook' });
 *   const store = new VertexRAGStore({ projectId, corpus: corpus.name });
 *   await store.uploadFile('handbook.pdf');                     // or importFiles(['gs://bucket/docs/'])
 *   const hits = await store.query({ text: 'refund policy', topK: 5 });
 *
 * RAG Engine needs OAuth credentials (API keys are rejected) and a supported region; us-central1 needs an allowlist
 * for new projects, europe-west3 / europe-west4 are generally available.
 */
class VertexRAGStore extends VectorStore {
  /**
   * @param {object} options - { projectId, location = 'us-central1', corpus (full name or id), topK, vectorDistanceThreshold,
   *   accessToken, credentials }.
   */
  constructor(options = {}) {
    super({});
    this.service = new GoogleCloudService({ ...options, label: 'Vertex AI RAG Engine' });
    this.client = this.service.client;
    this.location = options.location || config.url.gemini.vertex.locations.rag;
    this.corpus = options.corpus || null;
    this.vectorDistanceThreshold = options.vectorDistanceThreshold ?? null;
  }

  _host() {
    return `https://${this.location}-aiplatform.googleapis.com`;
  }

  async _parent() {
    return `projects/${await this.service._project()}/locations/${this.location}`;
  }

  async corpusName() {
    if (!this.corpus) throw new Error('VertexRAGStore needs a corpus (name or id).');
    if (String(this.corpus).startsWith('projects/')) return this.corpus;
    return `${await this._parent()}/ragCorpora/${this.corpus}`;
  }

  /**
   * Create a corpus and wait for it. embeddingModel defaults to text-embedding-005 (the RAG Engine default).
   * Returns the corpus ({ name, displayName, ... }).
   */
  static async createCorpus({ displayName, description = null, embeddingModel = null, ...options }) {
    const store = new VertexRAGStore(options);
    const parent = await store._parent();
    const body = {
      displayName,
      ...(description && { description }),
      ...(embeddingModel && {
        vectorDbConfig: {
          ragManagedDb: { knn: {} },
          ragEmbeddingModelConfig: {
            vertexPredictionEndpoint: {
              endpoint: embeddingModel.startsWith('projects/') ? embeddingModel : `${parent}/publishers/google/models/${embeddingModel}`,
            },
          },
        },
      }),
    };
    const operation = await store.service._request('POST', `${store._host()}/v1/${parent}/ragCorpora`, body);
    return store.service.waitForOperation(operation, (name) => `${store._host()}/v1/${name}`);
  }

  async listCorpora({ pageSize = null, pageToken = null } = {}) {
    const query = [pageSize && `page_size=${pageSize}`, pageToken && `page_token=${encodeURIComponent(pageToken)}`].filter(Boolean).join('&');
    return this.service._request('GET', `${this._host()}/v1/${await this._parent()}/ragCorpora${query ? `?${query}` : ''}`);
  }

  async getCorpus() {
    return this.service._request('GET', `${this._host()}/v1/${await this.corpusName()}`);
  }

  /** Delete the corpus; force also deletes its files. */
  async deleteCorpus({ force = true } = {}) {
    return this.service._request('DELETE', `${this._host()}/v1/${await this.corpusName()}${force ? '?force=true' : ''}`);
  }

  /**
   * Upload one local file (a path, or bytes with { displayName, mimeType }) into the corpus; RAG Engine parses,
   * chunks and embeds it. Returns the RagFile.
   */
  async uploadFile(source, { displayName = null, description = null, mimeType = null, chunkSize = 512, chunkOverlap = 100 } = {}) {
    const FormData = require('form-data');
    let data = source;
    let name = displayName;
    if (typeof source === 'string') {
      data = require('fs').readFileSync(source);
      name = name || require('path').basename(source);
    }
    if (!name) throw new Error('displayName is required when uploading bytes.');
    const form = new FormData();
    form.append('metadata', JSON.stringify({
      ragFile: { displayName: name, ...(description && { description }) },
      uploadRagFileConfig: {
        ragFileTransformationConfig: { ragFileChunkingConfig: { fixedLengthChunking: { chunkSize, chunkOverlap } } },
      },
    }), { contentType: 'application/json' });
    form.append('file', Buffer.from(data), { filename: name, ...(mimeType && { contentType: mimeType }) });
    const url = `${this._host()}/upload/v1/${await this.corpusName()}/ragFiles:upload`;
    const result = await this.service._request('POST', url, form, { headers: { 'X-Goog-Upload-Protocol': 'multipart' } });
    if (result && result.error) throw new Error(`Vertex AI RAG Engine upload error: ${JSON.stringify(result.error)}`);
    return (result && result.ragFile) || result;
  }

  /**
   * Import files from Cloud Storage (gs://bucket/path) or Google Drive (folder / file links) and wait for the
   * import to finish. Returns the import result counts.
   */
  async importFiles(uris, { chunkSize = 512, chunkOverlap = 100, maxEmbeddingRequestsPerMin = 1000, wait = true } = {}) {
    const list = Array.isArray(uris) ? uris : [uris];
    const gcs = list.filter((uri) => uri.startsWith('gs://'));
    const drive = list.filter((uri) => !uri.startsWith('gs://'));
    const body = {
      importRagFilesConfig: {
        ...(gcs.length && { gcsSource: { uris: gcs } }),
        ...(drive.length && {
          googleDriveSource: {
            resourceIds: drive.map((uri) => {
              const id = (/\/folders\/([^/?#]+)/.exec(uri) || /\/d\/([^/?#]+)/.exec(uri) || [null, uri])[1];
              return { resourceType: /\/folders\//.test(uri) ? 'RESOURCE_TYPE_FOLDER' : 'RESOURCE_TYPE_FILE', resourceId: id };
            }),
          },
        }),
        ragFileTransformationConfig: { ragFileChunkingConfig: { fixedLengthChunking: { chunkSize, chunkOverlap } } },
        maxEmbeddingRequestsPerMin,
      },
    };
    const operation = await this.service._request('POST', `${this._host()}/v1/${await this.corpusName()}/ragFiles:import`, body);
    if (!wait) return operation;
    return this.service.waitForOperation(operation, (name) => `${this._host()}/v1/${name}`);
  }

  async listFiles({ pageSize = null, pageToken = null } = {}) {
    const query = [pageSize && `page_size=${pageSize}`, pageToken && `page_token=${encodeURIComponent(pageToken)}`].filter(Boolean).join('&');
    return this.service._request('GET', `${this._host()}/v1/${await this.corpusName()}/ragFiles${query ? `?${query}` : ''}`);
  }

  /** Add text documents: each one is uploaded as a text file named after its id (or metadata.source). */
  async addDocuments(documents, options = {}) {
    const names = [];
    for (const document of documents || []) {
      const item = typeof document === 'string' ? { text: document } : document;
      const base = String((item.metadata && item.metadata.source) || item.id || `document-${Date.now()}`);
      const displayName = /\.[a-z0-9]+$/i.test(base) ? base : `${base}.txt`;
      const file = await this.uploadFile(Buffer.from(String(item.text || ''), 'utf8'), { displayName, mimeType: 'text/plain', ...options });
      names.push(file.name || displayName);
    }
    return names;
  }

  async upsert() {
    throw new Error('VertexRAGStore embeds files itself: use addDocuments, uploadFile or importFiles.');
  }

  /**
   * Retrieve chunks for a text query: [{ id, score, text, metadata: { source, title, pages } }].
   * RAG Engine returns a cosine distance by default (0 = same); score is 1 - distance.
   */
  async query(params = {}) {
    if (params.text === undefined || params.text === null) throw new Error('VertexRAGStore queries by text: query({ text }).');
    const filter = params.nativeFilter || (this.vectorDistanceThreshold !== null ? { vectorDistanceThreshold: this.vectorDistanceThreshold } : null);
    const body = {
      vertexRagStore: { ragResources: [{ ragCorpus: await this.corpusName() }] },
      query: { text: String(params.text), ragRetrievalConfig: { topK: params.topK || 5, ...(filter && { filter }) } },
    };
    const result = await this.service._request('POST', `${this._host()}/v1/${await this._parent()}:retrieveContexts`, body);
    const contexts = (result.contexts && result.contexts.contexts) || [];
    return contexts.map((context, index) => {
      const chunk = context.chunk || {};
      const distance = typeof context.score === 'number' ? context.score : typeof context.distance === 'number' ? context.distance : null;
      return {
        id: chunk.chunkId || `${context.sourceUri || 'context'}#${index}`,
        score: distance === null ? null : 1 - distance,
        text: context.text || chunk.text || '',
        metadata: {
          source: context.sourceUri || null,
          title: context.sourceDisplayName || null,
          ...(chunk.pageSpan && { pages: chunk.pageSpan }),
        },
      };
    });
  }

  /** Delete RAG files by their resource names (from addDocuments / listFiles). */
  async delete(fileNames) {
    for (const name of fileNames || []) {
      const fullName = String(name).startsWith('projects/') ? name : `${await this.corpusName()}/ragFiles/${name}`;
      await this.service._request('DELETE', `${this._host()}/v1/${fullName}`);
    }
  }

  /** A Gemini grounding tool for this corpus (Vertex AI generateContent): tools: [await store.tool()]. */
  async tool({ topK = 5, vectorDistanceThreshold = null } = {}) {
    return {
      retrieval: {
        vertexRagStore: {
          ragResources: [{ ragCorpus: await this.corpusName() }],
          ragRetrievalConfig: { topK, ...(vectorDistanceThreshold !== null && { filter: { vectorDistanceThreshold } }) },
        },
      },
    };
  }
}

module.exports = { VertexRAGStore };
