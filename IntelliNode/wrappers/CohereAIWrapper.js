const axios = require('axios');
const config = require('../utils/Config2').getInstance();
const connHelper = require('../utils/ConnHelper');

class CohereAIWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.getProperty('url.cohere.base');
    this.COHERE_VERSION = config.getProperty('url.cohere.version');
    this.API_KEY = apiKey;
    this.httpClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.API_KEY}`,
        'Cohere-Version': this.COHERE_VERSION,
      },
    });
  }

  async generateText(params) {
    const url = config.getProperty('url.cohere.completions');
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = CohereAIWrapper;