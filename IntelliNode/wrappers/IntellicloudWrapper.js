/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0
*/
const axios = require('axios');
const FormData = require('form-data');
const config = require('../config.json');

class IntellicloudWrapper {
  constructor(apiKey, apiBase = config.semantic_search_api) {
    this.ONE_KEY = apiKey;
    this.API_BASE_URL = apiBase;
  }

  async semanticSearch(query, k = 3) {
    const form = new FormData();
    form.append('one_key', this.ONE_KEY);
    form.append('query_text', query);
    form.append('k', k.toString());

    try {
      const response = await axios.post(this.API_BASE_URL + 'semantic_search/', form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error) {
      // Handle error appropriately, perhaps by throwing a custom error or returning null
      console.error('Semantic Search API Error:', error);
      throw error;
    }
  }
}

module.exports = IntellicloudWrapper;