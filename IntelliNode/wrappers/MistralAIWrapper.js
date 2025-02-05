/*Apache License
Copyright 2023 Github.com/Barqawiz/IntelliNode*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class MistralAIWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.mistral.base;

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    });
  }

  async generateText(params) {
    const endpoint = config.url.mistral.completions;
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getEmbeddings(params) {
    const endpoint = config.url.mistral.embed;
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = MistralAIWrapper;
