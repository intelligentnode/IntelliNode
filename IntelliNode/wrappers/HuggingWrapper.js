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

class HuggingWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.huggingface.base;
    this.API_KEY = apiKey;
    this.httpClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.API_KEY}`,
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
      const response = await this.httpClient.post(url, data, {
        responseType: 'arraybuffer',
      });
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async processImage(modelId, data) {
    const url = `/${modelId}`;
    try {
      const response = await this.httpClient.post(url, data, {
        responseType: 'arraybuffer',
      });
      return JSON.parse(response.data.toString());
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = HuggingWrapper;
