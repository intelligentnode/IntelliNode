/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const axios = require('axios');
const config = require('../utils/Config2').getInstance();
const connHelper = require('../utils/ConnHelper');
const modelHelper = require('../utils/ModelHelper');

class GoogleAIWrapper {
  constructor(apiKey) {
    this.API_SPEECH_URL = config
      .getProperty('url.google.base')
      .replace('{1}', config.getProperty('url.google.speech.prefix'));
     this.API_PALM_URL = config
      .getProperty('url.google.basev2')
      .replace('{1}', config.getProperty('url.google.palm.prefix'));
    this.API_KEY = apiKey;
    this.httpClient = axios.create({
      baseURL: this.API_SPEECH_URL,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Goog-Api-Key': this.API_KEY,
      },
    });
  }

  /**
  enable Cloud Text-to-Speech API from google console
  */
  async generateSpeech(params) {
    const url = this.API_SPEECH_URL + config.getProperty('url.google.speech.synthesize.postfix');
    
    const json = modelHelper.getGoogleSynthesizeInput(params);

    try {
      const response = await this.httpClient.post(url, json);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  /**
  enable Generative AI from google console
  */
  async generateText(params) {
    const url = this.API_PALM_URL + config.getProperty('url.google.palm.generateText.postfix').
                     replace('MODEL_ID', 'text-bison-001'); ;
    const json = modelHelper.getGoogleTextModelInput(params);

    try {
      const response = await this.httpClient.post(url, json);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  /**
  enable Generative AI from google console
  */
  async getEmbeddings(params) {
    const url = this.API_PALM_URL + config.getProperty('url.google.palm.embedding.postfix').
                        replace('MODEL_ID', 'embedding-gecko-001');;
    const json = { instances: [{ content: params.content }] };

    try {
      const response = await this.httpClient.post(url, json);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }


}
module.exports = GoogleAIWrapper;