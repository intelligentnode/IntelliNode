/*Apache License
Copyright 2023 Github.com/Barqawiz/IntelliNode*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class ReplicateWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.replicate.base;
    this.API_KEY = apiKey;

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${this.API_KEY}`
      }
    });
  }

  async predict(modelTag, inputData) {
    const endpoint = config.url.replicate.predictions;
    try {
      return await this.client.post(endpoint, inputData);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getPredictionStatus(predictionId) {
    const endpoint = `/v1/predictions/${predictionId}`;
    try {
      // GET request
      return await this.client.get(endpoint);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = ReplicateWrapper;
