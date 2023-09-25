/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0
*/
const axios = require('axios');
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');

class CohereAIWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.cohere.base;
    this.COHERE_VERSION = config.url.cohere.version;
    this.API_KEY = apiKey;
    this.httpClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.API_KEY}`,
        'Cohere-Version': this.COHERE_VERSION,
      },
    });
  }

  async generateText(params) {
    const url = config.url.cohere.completions;
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateChatText(params) {
    const url = '/chat';
    try {
      const response = await this.httpClient.post(url, params, {
        responseType: params.stream ? 'stream' : 'json',
      });
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getEmbeddings(params) {
    const url = config.url.cohere.embed;
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = CohereAIWrapper;
