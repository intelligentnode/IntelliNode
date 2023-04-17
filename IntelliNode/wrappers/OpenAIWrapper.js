const axios = require('axios');
const config = require('../utils/Config2');
const connHelper = require('../utils/ConnHelper');

class OpenAIWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.getProperty('url.openai.base');
    this.API_KEY = apiKey;
    this.httpClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.API_KEY}`,
      },
    });
  }

  async generateText(params) {
    const url = config.getProperty('url.openai.completions');
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateChatText(params) {
    const url = config.getProperty('url.openai.chatgpt');
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateImages(params) {
    const url = config.getProperty('url.openai.imagegenerate');
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = OpenAIWrapper;
