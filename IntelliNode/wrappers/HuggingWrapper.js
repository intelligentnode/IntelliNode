const axios = require('axios');
const config = require('../utils/Config2').getInstance();
const connHelper = require('../utils/ConnHelper');

class HuggingWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = 'https://api-inference.huggingface.co/models';
    this.API_KEY = apiKey;
    this.httpClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.API_KEY}`,
      },
    });
  }

  async generateText(modelId, data) {
    const url = `/${modelId}`;
    try {
      const response = await this.httpClient.post(url, data);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateImage(modelId, data) {
    const url = `/${modelId}`;
    try {
      const response = await this.httpClient.post(url, data, { responseType: 'arraybuffer' });
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async processImage(modelId, data) {
    const url = `/${modelId}`;
    try {
      const response = await this.httpClient.post(url, data, { responseType: 'arraybuffer' });
      return JSON.parse(response.data.toString());
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = HuggingWrapper;