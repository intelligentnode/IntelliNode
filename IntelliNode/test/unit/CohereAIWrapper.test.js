const assert = require('assert');
const CohereAIWrapper = require('../../wrappers/CohereAIWrapper');
const config = require('../../config.json');

function testCohereAIWrapper() {
  const apiKey = 'your-api-key';
  const cohereAIWrapper = new CohereAIWrapper(apiKey);

  assert.strictEqual(
    cohereAIWrapper.API_KEY,
    apiKey,
    'API key should be set'
  );
  assert.ok(
    cohereAIWrapper.httpClient,
    'httpClient should be created'
  );

  // Test httpClient configuration
  const expectedBaseURL = config.url.cohere.base;
  const expectedCohereVersion = config.url.cohere.version;
  const expectedContentType = 'application/json';
  const expectedAuthHeader = `Bearer ${apiKey}`;

  assert.strictEqual(
    cohereAIWrapper.httpClient.defaults.baseURL,
    expectedBaseURL,
    'httpClient baseURL should be set correctly'
  );
  assert.strictEqual(
    cohereAIWrapper.httpClient.defaults.headers['Content-Type'],
    expectedContentType,
    'httpClient Content-Type header should be set correctly'
  );
  assert.strictEqual(
    cohereAIWrapper.httpClient.defaults.headers['Authorization'],
    expectedAuthHeader,
    'httpClient Authorization header should be set correctly'
  );
  assert.strictEqual(
    cohereAIWrapper.httpClient.defaults.headers['Cohere-Version'],
    expectedCohereVersion,
    'httpClient Cohere-Version header should be set correctly'
  );
}

module.exports = testCohereAIWrapper;
