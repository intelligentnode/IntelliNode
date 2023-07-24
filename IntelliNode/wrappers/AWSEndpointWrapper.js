const axios = require('axios');

class AWSEndpointWrapper {
  constructor(apiUrl, apiKey = null) {
    this.API_BASE_URL = apiUrl;

    let headers = {
      'Content-Type': 'application/json'
    };
    // sdd the API kry if provided
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    // Configure axios
    this.httpClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers
    });
  }

  async predict(inputData) {
    try {
      const response = await this.httpClient.post('', inputData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AWSEndpointWrapper;