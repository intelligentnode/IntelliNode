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
        'Content-Type': 'application/json'
      }
    });
  }

  async generateContent(params, vision = false) {
    const endpoint = vision
      ? config.url.gemini.visionEndpoint
      : config.url.gemini.contentEndpoint;

    try {
      return await this.client.post(endpoint, params, {
        // If needed, you can specify { responseType: 'stream' } or 'arraybuffer'
      });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async imageToText(userInput, filePath, extension) {
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
    return this.generateContent(params, true);
  }

  async getEmbeddings(params) {
    const endpoint = config.url.gemini.embeddingEndpoint;
    try {
      const response = await this.client.post(endpoint, params);
      return response.embedding;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getBatchEmbeddings(params) {
    const endpoint = config.url.gemini.batchEmbeddingEndpoint;
    try {
      const response = await this.client.post(endpoint, params);
      return response.embeddings;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = GeminiAIWrapper;
