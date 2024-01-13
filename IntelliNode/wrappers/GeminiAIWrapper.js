const axios = require('axios');
const config = require('../config.json');
const { readFileSync } = require('fs');
const connHelper = require('../utils/ConnHelper');

class GeminiAIWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.gemini.base;
    this.API_KEY = apiKey;
    this.httpClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        key: this.API_KEY
      }
    });
  }

  async generateContent(params, vision=false) {
    const endpoint = vision ? config.url.gemini.visionEndpoint : config.url.gemini.contentEndpoint;
    const url = endpoint;

    try {
      const response = await this.httpClient.post(url, params);
      return response.data;
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
    const url = config.url.gemini.embeddingEndpoint;

    try {
      const response = await this.httpClient.post(url, params);
      return response.data.embedding;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getBatchEmbeddings(params) {
    const url = config.url.gemini.batchEmbeddingEndpoint;

    try {
      const response = await this.httpClient.post(url, params);
      return response.data.embeddings;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = GeminiAIWrapper;
