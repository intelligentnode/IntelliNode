/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const axios = require('axios');
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');

class GoogleAIWrapper {
  constructor(apiKey) {
    this.API_SPEECH_URL = config.url.google.base.replace(
      '{1}',
      config.url.google.speech.prefix
    );
    this.API_KEY = apiKey;
    this.httpClient = axios.create({
      baseURL: this.API_SPEECH_URL,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Goog-Api-Key': this.API_KEY,
      },
    });
  }

  async generateSpeech(params) {
    const url =
      this.API_SPEECH_URL +
      config.url.google.speech.synthesize.postfix;

    const json = this.getSynthesizeInput(params);

    try {
      const response = await this.httpClient.post(url, json);
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  getSynthesizeInput(params) {
    const text = params.text;
    const languageCode = params.languageCode;
    const name = params.name;
    const ssmlGender = params.ssmlGender;

    const modelInput = {
      input: {
        text: text,
      },
      voice: {
        languageCode: languageCode,
        name: name,
        ssmlGender: ssmlGender,
      },
      audioConfig: {
        audioEncoding: 'MP3',
      },
    };

    return JSON.stringify(modelInput);
  }
}
module.exports = GoogleAIWrapper;
