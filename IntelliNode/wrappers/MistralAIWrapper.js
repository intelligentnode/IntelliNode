/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const axios = require('axios');
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');

class MistralAIWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.mistral.base;
    
    this.httpClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
    });
  }

  async generateText(params) {
    const url = config.url.mistral.completions;
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getEmbeddings(params) {
    const url = config.url.mistral.embed;
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = MistralAIWrapper;