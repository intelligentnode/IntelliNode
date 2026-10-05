/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const EmbedInput = require('../model/input/EmbedInput');

// Providers that embed documents and queries differently, and the value each one expects.
const KIND_INPUT_TYPES = {
  cohere: { document: 'search_document', query: 'search_query' },
  nvidia: { document: 'passage', query: 'query' },
};
const GEMINI_TASK_TYPES = { document: 'RETRIEVAL_DOCUMENT', query: 'RETRIEVAL_QUERY' };
const GOOGLE_PROVIDERS = new Set(['gemini', 'google', 'vertex']);

/**
 * Turns texts into vectors with any IntelliNode embedding provider, for the vector stores and the Assistant.
 *
 *   new Embedder({ provider: 'openai', apiKey })
 *   new Embedder({ provider: 'gemini', apiKey, options: { vertex: true } })      // Gemini Developer API or Vertex AI
 *   new Embedder({ provider: 'ollama', options: { baseUrl: 'http://localhost:11434/v1' }, model: 'nomic-embed-text' })
 *
 * Gemini and Cohere embed documents and search queries differently; embed(texts, { kind: 'query' }) selects that.
 */
class Embedder {
  /**
   * @param {object} settings - { provider = 'openai', apiKey, model, dimensions, batchSize, options }.
   *   options holds the provider settings: Google { vertex, projectId, location, accessToken, credentials },
   *   OpenAI-compatible / vLLM { baseUrl, headers }, or an OpenAI proxy helper as options.customProxyHelper.
   */
  constructor({ provider = 'openai', apiKey = null, model = null, dimensions = null, batchSize = null, options = {} } = {}) {
    this.provider = String(provider).toLowerCase();
    this.model = model;
    this.dimensions = dimensions;
    this.options = options || {};
    if (GOOGLE_PROVIDERS.has(this.provider)) {
      const GoogleAIWrapper = require('../wrappers/GoogleAIWrapper');
      const googleOptions = this.provider === 'vertex' ? { vertex: true, ...this.options } : this.options;
      this.google = GoogleAIWrapper.fromOptions(apiKey, googleOptions);
      this.batchSize = batchSize || 100;
    } else {
      const { RemoteEmbedModel } = require('../controller/RemoteEmbedModel');
      const helper = this.options.customProxyHelper
        || (this.options.baseUrl || this.options.headers ? { baseUrl: this.options.baseUrl, headers: this.options.headers } : null);
      this.remote = new RemoteEmbedModel(apiKey, this.provider, helper);
      // Cohere accepts at most 96 texts per call
      this.batchSize = batchSize || 96;
    }
  }

  /** Embed a list of texts. kind: 'document' (default) or 'query'. Returns number[][] in the same order. */
  async embed(texts, { kind = 'document' } = {}) {
    const list = (Array.isArray(texts) ? texts : [texts]).map((text) => String(text));
    const vectors = [];
    for (let start = 0; start < list.length; start += this.batchSize) {
      vectors.push(...await this._embedBatch(list.slice(start, start + this.batchSize), kind));
    }
    return vectors;
  }

  async _embedBatch(texts, kind) {
    if (this.google) {
      return this.google.embedTexts(texts, this.model, {
        taskType: GEMINI_TASK_TYPES[kind] || null,
        outputDimensionality: this.dimensions,
      });
    }
    const inputTypes = KIND_INPUT_TYPES[this.provider];
    const input = new EmbedInput({ texts, model: this.model, inputType: inputTypes ? inputTypes[kind] : null });
    if (!this.model) input.setDefaultValues(this.provider);
    const raw = this.provider === 'openai' && this.dimensions
      ? { ...input.getOpenAIInputs(), dimensions: this.dimensions }
      : input;
    const results = await this.remote.getEmbeddings(raw);
    const items = Array.isArray(results) ? results : (results && results.data) || [];
    // OpenAI-style results carry an index; keep the input order
    const ordered = items.every((item) => item && typeof item.index === 'number')
      ? [...items].sort((a, b) => a.index - b.index)
      : items;
    return ordered.map((item) => (Array.isArray(item) ? item : item.embedding || item.values));
  }
}

/** An Embedder from an Embedder, a function (texts, { kind }) => vectors, an object with embed(), or settings. */
function toEmbedder(value) {
  if (!value) return null;
  if (typeof value === 'function') return { embed: (texts, opts) => value(texts, opts || {}) };
  if (typeof value.embed === 'function') return value;
  if (typeof value === 'object' && value.provider) return new Embedder(value);
  throw new Error('embedder must be an Embedder, a function (texts) => vectors, or { provider, apiKey, model, options }.');
}

module.exports = { Embedder, toEmbedder };
