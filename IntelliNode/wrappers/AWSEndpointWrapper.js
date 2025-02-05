const FetchClient = require('../utils/FetchClient');

class AWSEndpointWrapper {
  constructor(apiUrl, apiKey = null) {
    this.API_BASE_URL = apiUrl;

    let headers = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Create our FetchClient with the base url + default headers
    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: headers,
    });
  }

  async predict(inputData) {
    try {
      return await this.client.post('', inputData);
    } catch (error) {
      throw error; // You can wrap this in a custom error message if you wish
    }
  }
}

module.exports = AWSEndpointWrapper;
