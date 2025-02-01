const config = require('../config.json');
const axios = require('axios');
const connHelper = require('../utils/ConnHelper');

class NvidiaWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.nvidia.base;
    this.ENDPOINT_CHAT = config.nvidia.chat;
    this.VERSION = config.nvidia.version;
    this.httpClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  async generateText(params) {
    if (params.stream === undefined) params.stream = false;
    try {
      const url = this.ENDPOINT_CHAT;
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateTextStream(params) {
    params.stream = true;
    try {
      const url = this.ENDPOINT_CHAT;
      const response = await this.httpClient.post(url, params, {
        responseType: 'stream',
      });
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = NvidiaWrapper;
