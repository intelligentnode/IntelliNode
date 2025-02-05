const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class NvidiaWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.nvidia.base;
    this.ENDPOINT_CHAT = config.nvidia.chat;
    this.VERSION = config.nvidia.version;

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
    if (params.stream === undefined) {
      params.stream = false;
    }
    try {
      const extraConfig = params.stream ? { responseType: 'stream' } : {};
      return await this.client.post(this.ENDPOINT_CHAT, params, extraConfig);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateTextStream(params) {
    params.stream = true;
    try {
      return await this.client.post(this.ENDPOINT_CHAT, params, {
        responseType: 'stream'
      });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = NvidiaWrapper;
