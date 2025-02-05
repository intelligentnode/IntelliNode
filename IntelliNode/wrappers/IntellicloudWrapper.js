/*Apache License
Copyright 2023 Github.com/Barqawiz/IntelliNode*/
const FormData = require('form-data');
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class IntellicloudWrapper {
  constructor(apiKey, apiBase = null) {
    this.ONE_KEY = apiKey;
    if (apiBase) {
      this.API_BASE_URL = apiBase;
    } else {
      this.API_BASE_URL = config.url.intellicloud.base;
    }

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL
      // We'll add headers at runtime if needed
    });
  }

  async semanticSearch(queryText, k = 3, filters = {}) {
    if (!k || k === undefined) {
      k = 3;
    }
    const endpoint = config.url.intellicloud.semantic_search;

    const form = new FormData();
    form.append('one_key', this.ONE_KEY);
    form.append('query_text', queryText);
    form.append('k', k);

    if (filters && filters.document_name) {
      form.append('document_name', filters.document_name);
    }

    try {
      // Pass the FormData directly
      const response = await this.client.post(endpoint, form);
      return response.data; // The API returns { data: ... }
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = IntellicloudWrapper;
