/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const axios = require('axios');
const ProxyHelper = require('../utils/ProxyHelper');
const connHelper = require('../utils/ConnHelper');

class OpenAIWrapper {

  constructor(apiKey, customProxyHelper = null) {
    
    this.proxyHelper = customProxyHelper || ProxyHelper.getInstance();

    let axios_config;

    if (this.proxyHelper.getOpenaiType() == 'azure') {
      console.log('set Openai azure settings');

      if (this.proxyHelper.getOpenaiResource() === '') {
        throw new Error('Set your azure resource name');
      }

      this.API_BASE_URL = this.proxyHelper.getOpenaiURL();
      this.API_KEY = apiKey;
      axios_config = {
        baseURL: this.API_BASE_URL,
        headers: {
          'Content-Type': 'application/json',
          'api-key': `${this.API_KEY}`,
        },
      };
    } else {
      this.API_BASE_URL = this.proxyHelper.getOpenaiURL();
      this.API_KEY = apiKey;
      axios_config = {
        baseURL: this.API_BASE_URL,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.API_KEY}`,
        },
      };
      // Check if Organization ID exists
      let orgId = this.proxyHelper.getOpenaiOrg();
      if (orgId) {
        axios_config.headers['OpenAI-Organization'] = orgId;
      }
    } /*validate openai or azure connection*/

    this.httpClient = axios.create(axios_config);
  }

  async generateText(params) {
    const url = this.proxyHelper.getOpenaiCompletion(params.model);
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  /**
   * Generate a text using OpenAI ChatGPT API.
   *
   * @param {Object} params - Parameters for the chat model such as model id, tokens, temperature etc.
   *
   * @param {Array} [functions=null] - Optional array of FunctionModelInput defined models that the chat can call.
   * Each function is provided as an instance of FunctionModelInput.
   *
   * @param {String|Object|Null} [function_call=null] - Optional control whether the model should call a function with "auto" default value.
   * Can be "auto", "none" or { "name": "my_function" }.
   *
   * @returns {Object} The model data response.
   *
   * @throws {Error} Throws an error if the request fails.
   */
  async generateChatText(
    params,
    functions = null,
    function_call = null
  ) {
    const url = this.proxyHelper.getOpenaiChat(params.model);
    try {
      let payload = {
        ...params,
      };
      if (functions) {
        payload.functions = functions;
      }
      if (function_call) {
        payload.function_call = function_call;
      }
      const response = await this.httpClient.post(url, payload, {
        responseType: params.stream ? 'stream' : 'json',
      });
      if (params.stream) {
        // ReadableStream
        return response.data;
      } else {
        return response.data; // This is your normal response
      }
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateImages(params) {
    const url = this.proxyHelper.getOpenaiImage();
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async uploadFile(params) {
    const url = this.proxyHelper.getOpenaiFiles();
    let headers = {}
    if (params.getHeaders) {
      headers = { ...params.getHeaders() }
    }
    try {
      const config = {
        url,
        method: 'post',
        headers,
        data: params
      }
      const response = await this.httpClient(config);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async storeFineTuningData(params) {
    const url = this.proxyHelper.getOpenaiFineTuningJob();
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async listFineTuningData(params) {
    const url = this.proxyHelper.getOpenaiFineTuningJob();
    try {
      const response = await this.httpClient.get(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getEmbeddings(params) {
    const url = this.proxyHelper.getOpenaiEmbed(params.model);
    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async speechToText(params, headers) {
    const url = this.proxyHelper.getOpenaiAudioTranscriptions();
    try {
      const config = {
        method: 'post',
        url,
        headers,
        data: params,
      };
      const response = await this.httpClient.request(config);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async textToSpeech(params, headers) {
    const url = this.proxyHelper.getOpenaiAudioSpeech();
    try {
      const config = {
        method: 'post',
        url,
        headers,
        data: params,
        responseType: params.stream ? 'stream' : 'json'
      };
      const response = await this.httpClient.request(config);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async imageToText(params, headers) {
    const url = this.proxyHelper.getOpenaiChat();
    try {
      const config = {
        method: 'post',
        url,
        headers,
        data: params,
      };
      const response = await this.httpClient.request(config);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = OpenAIWrapper;
