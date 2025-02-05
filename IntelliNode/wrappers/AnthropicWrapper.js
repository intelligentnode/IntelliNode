/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class AnthropicWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.anthropic.base;
    this.API_VERSION = config.url.anthropic.version;

    // Create our FetchClient instance
    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': this.API_VERSION,
      },
    });
  }

  async generateText(params) {
    const endpoint = config.url.anthropic.messages;

    try {
      // Use the client’s post method
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = AnthropicWrapper;
