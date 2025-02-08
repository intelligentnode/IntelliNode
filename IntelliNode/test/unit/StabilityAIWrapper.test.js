const assert = require('assert');
const StabilityAIWrapper = require('../../wrappers/StabilityAIWrapper');
const config = require('../../config.json');

function testStabilityAIWrapper() {
  const apiKey = 'your-api-key';
  const stabilityAIWrapper = new StabilityAIWrapper(apiKey);

  assert.strictEqual(
    stabilityAIWrapper.API_KEY,
    apiKey,
    'API key should be set'
  );
  assert.ok(
    stabilityAIWrapper.client,
    'httpClient should be created'
  );

  // Test httpClient configuration
  const expectedBaseURL = config.url.stability.base;
  const expectedAuthHeader = `Bearer ${apiKey}`;

  assert.strictEqual(
    stabilityAIWrapper.client.baseURL,
    expectedBaseURL,
    'httpClient baseURL should be set correctly'
  );
  assert.strictEqual(
    stabilityAIWrapper.client.defaultHeaders['Authorization'],
    expectedAuthHeader,
    'httpClient Authorization header should be set correctly'
  );
}

module.exports = testStabilityAIWrapper;
