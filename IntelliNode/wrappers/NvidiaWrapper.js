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

  /**
   * Generates embeddings using NVIDIA's embedding endpoint.
   * Expects the user to pass a `model` field inside params so that the endpoint
   * is constructed as:
   *   {config.nvidia.embedding}/{model}/embeddings
   *
   * @param {object} params - Must include `model` and other required fields.
   */
  async generateRetrieval(params) {
    if (!params.model) {
      throw new Error("Missing 'model' parameter for embeddings");
    }
    // use the embedding base endpoint from config and append the user-specified model name.
    const baseEmbedding = config.nvidia.retrieval;
    // model name example snowflake/arctic-embed
    const embeddingEndpoint = `${baseEmbedding}/${params.model}/embeddings`;
    try {
      return await this.client.post(embeddingEndpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = NvidiaWrapper;
