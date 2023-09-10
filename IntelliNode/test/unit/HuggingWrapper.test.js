const assert = require('assert');
const HuggingWrapper = require('../../wrappers/HuggingWrapper');
const config = require('../../config.json');

function testHuggingWrapper() {
  const apiKey = 'your-api-key';
  const huggingWrapper = new HuggingWrapper(apiKey);

  assert.strictEqual(
    huggingWrapper.API_KEY,
    apiKey,
    'API key should be set'
  );
  assert.ok(
    huggingWrapper.httpClient,
    'httpClient should be created'
  );

  // Test httpClient configuration
  const expectedBaseURL = config.url.huggingface.base;
  const expectedContentType = 'application/json';
  const expectedAuthHeader = `Bearer ${apiKey}`;

  assert.strictEqual(
    huggingWrapper.httpClient.defaults.baseURL,
    expectedBaseURL,
    'httpClient baseURL should be set correctly'
  );
  assert.strictEqual(
    huggingWrapper.httpClient.defaults.headers['Content-Type'],
    expectedContentType,
    'httpClient Content-Type header should be set correctly'
  );
  assert.strictEqual(
    huggingWrapper.httpClient.defaults.headers['Authorization'],
    expectedAuthHeader,
    'httpClient Authorization header should be set correctly'
  );
}

module.exports = testHuggingWrapper;
