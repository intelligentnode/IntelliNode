const fetch = require('cross-fetch');
const FormData = require('form-data');

class FetchClient {
  constructor({ baseURL = '', headers = {} } = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = headers;
  }

  /**
   * Send a POST request using cross-fetch.
   * 
   * @param {string} endpoint - URL path or full URL if starts with http.
   * @param {object|FormData} data - Data to send in the request body.
   * @param {object} extraConfig - Optional config (e.g. { responseType: 'arraybuffer' | 'stream' }).
   * @returns {Promise<any|ReadableStream|ArrayBuffer>} - JSON by default, or stream/arrayBuffer if specified.
   */
  async post(endpoint, data, extraConfig = {}) {
    const url = endpoint.startsWith('http')
      ? endpoint
      : this.baseURL + endpoint;

    // Decide how to handle the request body
    let body;
    if (data instanceof FormData) {
      // Use FormData directly (e.g., file uploads)
      body = data;
    } else if (data !== undefined) {
      // Assume JSON
      body = JSON.stringify(data);
    }

    // Merge default and extra headers
    const headers = {
      ...this.defaultHeaders,
      ...(extraConfig.headers || {})
    };

    // If using FormData in Node, merge the form's headers
    if (data instanceof FormData && typeof data.getHeaders === 'function') {
      Object.assign(headers, data.getHeaders());
    }

    const config = {
      method: 'POST',
      headers,
      body
    };

    // Make the request
    const response = await fetch(url, config);

    // Check for HTTP error
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    // Handle custom response types
    if (extraConfig.responseType === 'arraybuffer') {
      return await response.arrayBuffer();
    } else if (extraConfig.responseType === 'stream') {
      // Return raw body stream (ReadableStream in browser / Node 18+)
      return response.body;
    } else {
      // Default: parse JSON
      return await response.json();
    }
  }

  /**
   * Send a GET request using cross-fetch.
   * 
   * @param {string} endpoint - URL path or full URL if starts with http.
   * @param {object} extraConfig - Optional config (e.g. { responseType: 'arraybuffer' }).
   * @returns {Promise<any|ReadableStream|ArrayBuffer>} - JSON by default, or stream/arrayBuffer if specified.
   */
  async get(endpoint, extraConfig = {}) {
    const url = endpoint.startsWith('http')
      ? endpoint
      : this.baseURL + endpoint;

    const headers = {
      ...this.defaultHeaders,
      ...(extraConfig.headers || {})
    };

    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    if (extraConfig.responseType === 'arraybuffer') {
      return await response.arrayBuffer();
    } else if (extraConfig.responseType === 'stream') {
      return response.body;
    } else {
      return await response.json();
    }
  }
}

module.exports = FetchClient;
