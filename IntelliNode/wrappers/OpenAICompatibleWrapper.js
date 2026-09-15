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
    // 'json_object' for services that reject json_schema response formats
    this.structuredOutput = options.structuredOutput || (preset && preset.structured_output) || 'json_schema';

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

  // Services without json_schema support get json_object, with the schema added to the system message.
  adaptResponseFormat(params) {
    const format = params.response_format;
    if (!format || format.type !== 'json_schema' || this.structuredOutput !== 'json_object') return params;
    const schema = format.json_schema ? format.json_schema.schema : format.schema;
    const instruction = `Respond with JSON only, matching this JSON Schema: ${JSON.stringify(schema)}`;
    const messages = Array.isArray(params.messages) ? params.messages.slice() : [];
    const systemIndex = messages.findIndex((message) => message.role === 'system' && typeof message.content === 'string');
    if (systemIndex >= 0) {
      messages[systemIndex] = { ...messages[systemIndex], content: `${messages[systemIndex].content}\n${instruction}` };
    } else {
      messages.unshift({ role: 'system', content: instruction });
    }
    return { ...params, messages, response_format: { type: 'json_object' } };
  }

  async generateChatText(params) {
    try {
      const payload = this.adaptResponseFormat(this.withModel(params));
      const extraConfig = payload.stream ? { responseType: 'stream' } : {};
      return await this.client.post(compatible.chat, payload, extraConfig);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  async getEmbeddings(params) {
    try {
      const payload = params.model || !this.defaultEmbedModel ? params : { ...params, model: this.defaultEmbedModel };
      if (!payload.model) throw new Error('No embedding model set. Pass a model name in the request.');
      return await this.client.post(compatible.embeddings, payload);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  /** The model ids served by the endpoint (GET /models). */
  async listModels() {
    try {
      const response = await this.client.get(compatible.models);
      return (response.data || []).map((model) => model.id);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }
}

module.exports = OpenAICompatibleWrapper;
