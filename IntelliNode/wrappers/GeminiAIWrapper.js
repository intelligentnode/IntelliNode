const config = require('../config.json');
const { readFileSync } = require('fs');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class GeminiAIWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.gemini.base;
    this.API_KEY = apiKey;

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      }
    });
  }

  // Accepts both 'gemini-3.6-flash' and 'models/gemini-3.6-flash'.
  static getModelId(model) {
    return String(model).replace(/^models\//, '');
  }

  /**
   * @param {object} params - generateContent body; an optional `model` key selects the model and is not sent.
   * @param {boolean} vision - use the configured vision model when no model is given.
   * @param {string} modelOverride - model id that takes precedence over params.model.
   */
  async generateContent(params, vision = false, modelOverride = null) {
    const { model: paramsModel, ...body } = params || {};
    const defaultModel = vision ? config.url.gemini.models.vision : config.url.gemini.models.chat;
    const model = GeminiAIWrapper.getModelId(modelOverride || paramsModel || defaultModel);
    const endpoint = `${model}${config.url.gemini.generateContent}`;

    try {
      return await this.client.post(endpoint, body);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async imageToText(userInput, filePath, extension, modelOverride = null) {
    const imageData = readFileSync(filePath, { encoding: 'base64' });
    const params = {
      contents: [
        {
          parts: [
            { text: `${userInput}` },
            {
              inline_data: {
                mime_type: `image/${extension}`,
                data: imageData
              }
            }
          ]
        }
      ]
    };
    return this.generateContent(params, true, modelOverride);
  }

  async getEmbeddings(params) {
    const model = GeminiAIWrapper.getModelId(params.model || config.url.gemini.models.embed);
    const endpoint = `${model}${config.url.gemini.embedContent}`;
    try {
      const response = await this.client.post(endpoint, { ...params, model: `models/${model}` });
      return response.embedding;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getBatchEmbeddings(params) {
    const requests = params.requests || [];
    const requestedModel = requests.length > 0 ? requests[0].model : null;
    const model = GeminiAIWrapper.getModelId(requestedModel || config.url.gemini.models.embed);
    const endpoint = `${model}${config.url.gemini.batchEmbedContents}`;
    try {
      const response = await this.client.post(endpoint, {
        ...params,
        requests: requests.map((request) => ({ ...request, model: `models/${model}` }))
      });
      return response.embeddings;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = GeminiAIWrapper;
