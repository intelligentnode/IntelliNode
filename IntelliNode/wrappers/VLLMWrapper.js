const FetchClient = require('../utils/FetchClient');
const connHelper = require('../utils/ConnHelper');

class VLLMWrapper {
  constructor(apiBaseUrl) {
    this.client = new FetchClient({
      baseURL: apiBaseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async generateText(params) {
    const endpoint = '/v1/completions';
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateChatText(params) {
    const endpoint = '/v1/chat/completions';
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getEmbeddings(texts) {
    const endpoint = '/embed';
    try {
      return await this.client.post(endpoint, { texts });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = VLLMWrapper;
