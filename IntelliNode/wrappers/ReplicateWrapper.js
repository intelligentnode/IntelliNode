/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0
*/
const axios = require('axios');
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');

class ReplicateWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.replicate.base;
    this.API_KEY = apiKey;

    this.httpClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${this.API_KEY}`,
      },
    });
  }

  async predict(modelTag, inputData) {
    const url = config.url.replicate.predictions;
    const data = inputData;

    try {
      const response = await this.httpClient.post(url, data);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getPredictionStatus(predictionId) {
    const url = `/v1/predictions/${predictionId}`;
    try {
      const response = await this.httpClient.get(url);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = ReplicateWrapper;
