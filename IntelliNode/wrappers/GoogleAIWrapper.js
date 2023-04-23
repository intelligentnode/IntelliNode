const axios = require('axios');
const config = require('../utils/Config2').getInstance();
const connHelper = require('../utils/ConnHelper');

class GoogleAIWrapper {
  constructor(apiKey) {
    this.API_SPEECH_URL = config
      .getProperty('url.google.base')
      .replace('{1}', config.getProperty('url.google.speech.prefix'));
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
    const url = this.API_SPEECH_URL + config.getProperty('url.google.speech.synthesize.postfix');
    console.log('the full url: ' + url);
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