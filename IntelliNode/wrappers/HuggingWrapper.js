const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class HuggingWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.huggingface.base;
    this.API_KEY = apiKey;

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.API_KEY}`
      }
    });
  }

  async generateText(modelId, data) {
    const endpoint = `/${modelId}`;
    try {
      return await this.client.post(endpoint, data);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateImage(modelId, data) {
    const endpoint = `/${modelId}`;
    try {
      // We need arraybuffer to get raw image data
      return await this.client.post(endpoint, data, { responseType: 'arraybuffer' });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async processImage(modelId, data) {
    const endpoint = `/${modelId}`;
    try {
      const arrayBuf = await this.client.post(endpoint, data, { responseType: 'arraybuffer' });
      return JSON.parse(Buffer.from(arrayBuf).toString());
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = HuggingWrapper;
