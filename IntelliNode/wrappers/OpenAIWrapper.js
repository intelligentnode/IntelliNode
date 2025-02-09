/*Apache License
Copyright 2023 Github.com/Barqawiz/IntelliNode*/
const ProxyHelper = require('../utils/ProxyHelper');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class OpenAIWrapper {
  constructor(apiKey, customProxyHelper = null) {
    this.proxyHelper = customProxyHelper || ProxyHelper.getInstance();

    if (this.proxyHelper.getOpenaiType() === 'azure') {
      if (this.proxyHelper.getOpenaiResource() === '') {
        throw new Error('Set your azure resource name');
      }
      this.API_BASE_URL = this.proxyHelper.getOpenaiURL();
      this.API_KEY = apiKey;
      this.client = new FetchClient({
        baseURL: this.API_BASE_URL,
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.API_KEY
        }
      });
    } else {
      this.API_BASE_URL = this.proxyHelper.getOpenaiURL();
      this.API_KEY = apiKey;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.API_KEY}`
      };
      // Check if Organization ID exists
      const orgId = this.proxyHelper.getOpenaiOrg();
      if (orgId) {
        headers['OpenAI-Organization'] = orgId;
      }
      this.client = new FetchClient({
        baseURL: this.API_BASE_URL,
        headers
      });
    }
  }

  async generateText(params) {
    /*deprecated*/
    const endpoint = this.proxyHelper.getOpenaiCompletion(params.model);
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateChatText(params, functions = null, function_call = null) {
    const endpoint = this.proxyHelper.getOpenaiChat(params.model);
    try {
      const payload = { ...params };
      if (functions) payload.functions = functions;
      if (function_call) payload.function_call = function_call;

      const extraConfig = params.stream ? { responseType: 'stream' } : {};
      return await this.client.post(endpoint, payload, extraConfig);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateImages(params) {
    const endpoint = this.proxyHelper.getOpenaiImage();
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async uploadFile(params) {
    const endpoint = this.proxyHelper.getOpenaiFiles();
    try {
      // If params is FormData, fetch client will handle it
      return await this.client.post(endpoint, params, {
        headers: params.getHeaders ? params.getHeaders() : {}
      });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async storeFineTuningData(params) {
    const endpoint = this.proxyHelper.getOpenaiFineTuningJob();
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async listFineTuningData(params) {
    const endpoint = this.proxyHelper.getOpenaiFineTuningJob();
    try {
      // .get is an example usage; if you pass params as query, you might need
      // querystring appending or some logic. If you used axios.get with config,
      // you can do a .get with extra headers in the fetch client
      // or just do .post if that was your actual usage.
      return await this.client.get(endpoint, {
        headers: {
          // any custom headers
        }
      });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getEmbeddings(params) {
    const endpoint = this.proxyHelper.getOpenaiEmbed(params.model);
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async speechToText(params, headers) {
    const endpoint = this.proxyHelper.getOpenaiAudioTranscriptions();
    try {
      return await this.client.post(endpoint, params, { headers });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async textToSpeech(params, headers) {
    const endpoint = this.proxyHelper.getOpenaiAudioSpeech();
    try {
      const extraConfig = { headers };
      if (params.stream) {
        extraConfig.responseType = 'stream';
      }
      return await this.client.post(endpoint, params, extraConfig);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async imageToText(params, headers) {
    const endpoint = this.proxyHelper.getOpenaiChat();
    try {
      return await this.client.post(endpoint, params, { headers });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateChatAudio(params) {
    
    const endpoint = this.proxyHelper.getOpenaiChat(params.model);
  
    try {
      // "params" should include { model, modalities, audio, messages, etc. }
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = OpenAIWrapper;
