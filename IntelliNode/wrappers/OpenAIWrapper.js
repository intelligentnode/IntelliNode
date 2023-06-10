/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const axios = require('axios');
const config = require('../utils/Config2').getInstance();
const proxyHelper = require('../utils/ProxyHelper').getInstance();
const connHelper = require('../utils/ConnHelper');

class OpenAIWrapper {

  constructor(apiKey, type='openai', resourceName='') {

    if (type == 'azure') {
        proxyHelper.setAzureOpenai(resourceName);
        this.API_BASE_URL = proxyHelper.getOpenaiURL();
        this.API_KEY = apiKey;
        this.httpClient = axios.create({
          baseURL: this.API_BASE_URL,
          headers: {
            'Content-Type': 'application/json',
            'api-key': `${this.API_KEY}`,
          },
        });
    } else {
        this.API_BASE_URL = proxyHelper.getOpenaiURL();
        this.API_KEY = apiKey;
        this.httpClient = axios.create({
          baseURL: this.API_BASE_URL,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.API_KEY}`,
          },
        });
    } /*validate openai or azure connection*/

  }

  async generateText(params) {
    const url = proxyHelper.getOpenaiCompletion(params.model);
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateChatText(params) {
    const url = proxyHelper.getOpenaiChat(params.model);
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateImages(params) {
    const url = proxyHelper.getOpenaiImage();
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

   async getEmbeddings(params) {
    const url = proxyHelper.getOpenaiEmbed(params.model);
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = OpenAIWrapper;
