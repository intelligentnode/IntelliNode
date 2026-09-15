/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

// Anthropic rejects browser (CORS) requests unless this opt-in header is present.
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

class AnthropicWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.anthropic.base;
    this.API_VERSION = config.url.anthropic.version;

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': this.API_VERSION,
    };
    if (isBrowser) {
      headers['anthropic-dangerous-direct-browser-access'] = 'true';
    }

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers,
    });
  }

  /**
   * Call the Messages API.
   * @param {object} params - Messages API request body.
   * @param {object} [extraHeaders] - Optional per-request headers, e.g. { 'anthropic-beta': '<feature>' }.
   */
  async generateText(params, extraHeaders = null) {
    const endpoint = config.url.anthropic.messages;

    try {
      return await this.client.post(endpoint, params, extraHeaders ? { headers: extraHeaders } : {});
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  /** Stream the Messages API; returns the raw server-sent events body. */
  async streamText(params, extraHeaders = null) {
    const endpoint = config.url.anthropic.messages;

    try {
      return await this.client.post(endpoint, { ...params, stream: true }, {
        responseType: 'stream',
        headers: { Accept: 'text/event-stream', ...(extraHeaders || {}) },
      });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = AnthropicWrapper;
