/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const axios = require('axios');
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');

class AnthropicWrapper {
    constructor(apiKey) {
        this.API_BASE_URL = config.url.anthropic.base;
        this.API_VERSION = config.url.anthropic.version;
        this.httpClient = axios.create({
            baseURL: this.API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': this.API_VERSION
            }
        });
    }

    async generateText(params) {
        const url = config.url.anthropic.messages;
        try {
            const response = await this.httpClient.post(url, params);
            return response.data;
        } catch (error) {
            throw new Error(connHelper.getErrorMessage(error));
        }
    }

}

module.exports = AnthropicWrapper;