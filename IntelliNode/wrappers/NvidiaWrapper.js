const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class NvidiaWrapper {
  /**
   * @param {string} apiKey - API key (if required for cloud usage)
   * @param {object} [options] - Optional settings.
   *        options.baseUrl: Override the default base URL.
   */
  constructor(apiKey, options = {}) {
    // use the provided baseUrl (e.g. local NIM) or the default cloud URL
    this.API_BASE_URL = options.baseUrl || config.nvidia.base;
    this.ENDPOINT_CHAT = config.nvidia.chat;
    this.VERSION = config.nvidia.version;

    // build headers
    let headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }
    
    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: headers
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
      throw connHelper.wrapError(error);
    }
  }

  async generateTextStream(params) {
    params.stream = true;
    try {
      return await this.client.post(this.ENDPOINT_CHAT, params, {
        responseType: 'stream'
      });
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  /**
   * Generates embeddings using NVIDIA's OpenAI-compatible /v1/embeddings endpoint
   * (the older /v1/retrieval/{model}/embeddings route no longer exists).
   *
   * @param {object} params - Must include `model`, e.g. nvidia/llama-3.2-nv-embedqa-1b-v1.
   */
  async generateRetrieval(params) {
    if (!params.model) {
      throw new Error("Missing 'model' parameter for embeddings");
    }
    try {
      return await this.client.post(config.nvidia.embeddings, params);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  async getEmbeddings(params) {
    return this.generateRetrieval(params);
  }
}

module.exports = NvidiaWrapper;
