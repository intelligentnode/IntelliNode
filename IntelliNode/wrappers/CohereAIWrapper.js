/*
Apache License
Copyright 2023 Github.com/Barqawiz/IntelliNode*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class CohereAIWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.cohere.base;
    this.COHERE_VERSION = config.url.cohere.version;
    this.API_KEY = apiKey;

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.API_KEY}`,
        'Cohere-Version': this.COHERE_VERSION
      }
    });
  }

  async generateText(params) {
    const endpoint = config.url.cohere.completions;
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateChatText(params) {
    const endpoint = '/chat';
    try {
      // If stream is true, set responseType='stream'
      const extraConfig = params.stream ? { responseType: 'stream' } : {};
      return await this.client.post(endpoint, params, extraConfig);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getEmbeddings(params) {
    const endpoint = config.url.cohere.embed;
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = CohereAIWrapper;

