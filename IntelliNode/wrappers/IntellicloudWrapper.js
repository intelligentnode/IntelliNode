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
const connHelper = require('../utils/ConnHelper');

class IntellicloudWrapper {
  constructor(apiKey, apiBase = null) {
    
    this.ONE_KEY = apiKey;
    if (apiBase) {
        this.API_BASE_URL = apiBase;
    } else {
        this.API_BASE_URL = config.url.intellicloud.base;
    }
    
    this.httpClient = axios.create({
      baseURL: this.API_BASE_URL
    });
  }

  async semanticSearch(queryText, k = 3, filters = {}) {
    // validate k value
    if (!k || k == undefined) {
      k = 3;
    }

    const url = config.url.intellicloud.semantic_search;
    const form = new FormData();
    form.append('one_key', this.ONE_KEY);
    form.append('query_text', queryText);
    form.append('k', k);
    if (filters && filters.document_name) {
      form.append('document_name', filters.document_name);
    }
    
    try {
      const response = await this.httpClient.post(url, form);
      
      return response.data.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = IntellicloudWrapper;