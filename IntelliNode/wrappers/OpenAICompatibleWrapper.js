/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

const compatible = config.url.openai_compatible;

/**
 * One wrapper for every service that speaks the OpenAI chat-completions API: OpenRouter, Groq, DeepSeek, xAI,
 * Together, Ollama, LM Studio, vLLM servers and any other base URL.
 *
 * new OpenAICompatibleWrapper(apiKey, { preset: 'openrouter' })
 * new OpenAICompatibleWrapper(apiKey, { baseUrl: 'https://host/v1', headers: { 'X-Title': 'My app' } })
 */
class OpenAICompatibleWrapper {
  constructor(apiKey, options = {}) {
    const preset = options.preset ? OpenAICompatibleWrapper.getPreset(options.preset) : null;
    const baseUrl = options.baseUrl || (preset && preset.base);
    if (!baseUrl) {
      throw new Error(`OpenAICompatibleWrapper needs a baseUrl or one of the presets: ${Object.keys(compatible.presets).join(', ')}`);
    }
    this.preset = options.preset || null;
    this.API_BASE_URL = String(baseUrl).replace(/\/+$/, '');
    this.API_KEY = apiKey;
    this.defaultModel = options.model || (preset && preset.chat_model) || null;
    this.defaultEmbedModel = (preset && preset.embed_model) || null;

    const headers = { 'Content-Type': 'application/json', Accept: 'application/json', ...(options.headers || {}) };
    // local runtimes ignore the key; a placeholder keeps proxies that require the header happy
    const key = apiKey || (preset && preset.local ? 'not-needed' : null);
    if (key) headers.Authorization = `Bearer ${key}`;

    this.client = new FetchClient({ baseURL: this.API_BASE_URL, headers });
  }

  static getPreset(name) {
    const preset = compatible.presets[name];
    if (!preset) {
      throw new Error(`Unknown OpenAI-compatible preset '${name}'. Use one of: ${Object.keys(compatible.presets).join(', ')}`);
    }
    return preset;
  }

  static presets() {
    return Object.keys(compatible.presets);
  }

  // Fill in the preset's default model; a preset without one needs the model in the request.
  withModel(params) {
    if (params.model) return params;
    if (!this.defaultModel) {
      const hint = this.preset ? `Call listModels() to see the models available on ${this.preset}.` : 'Call listModels() to see the available models.';
      throw new Error(`No model set for the OpenAI-compatible request. Pass a model name. ${hint}`);
    }
    return { ...params, model: this.defaultModel };
  }

  async generateChatText(params) {
    try {
      const payload = this.withModel(params);
      const extraConfig = payload.stream ? { responseType: 'stream' } : {};
      return await this.client.post(compatible.chat, payload, extraConfig);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getEmbeddings(params) {
    try {
      const payload = params.model || !this.defaultEmbedModel ? params : { ...params, model: this.defaultEmbedModel };
      if (!payload.model) throw new Error('No embedding model set. Pass a model name in the request.');
      return await this.client.post(compatible.embeddings, payload);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  /** The model ids served by the endpoint (GET /models). */
  async listModels() {
    try {
      const response = await this.client.get(compatible.models);
      return (response.data || []).map((model) => model.id);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = OpenAICompatibleWrapper;
