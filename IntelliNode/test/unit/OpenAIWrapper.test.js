const assert = require('assert');
const OpenAIWrapper = require('../../wrappers/OpenAIWrapper');
const ProxyHelper = require('../../utils/ProxyHelper');

function testOpenAIWrapper() {
  const apiKey = 'your-api-key';
  const proxyHelper = ProxyHelper.getInstance();
  const openAIWrapper = new OpenAIWrapper(apiKey);

  assert.strictEqual(
    openAIWrapper.API_KEY,
    apiKey,
    'API key should be set'
  );
  assert.ok(openAIWrapper.httpClient, 'httpClient should be created');

  // Test httpClient configuration
  const expectedBaseURL = proxyHelper.getOpenaiURL();
  const expectedContentType = 'application/json';
  const expectedAuthHeader = `Bearer ${apiKey}`;

  assert.strictEqual(
    openAIWrapper.httpClient.defaults.baseURL,
    expectedBaseURL,
    'httpClient baseURL should be set correctly'
  );
  assert.strictEqual(
    openAIWrapper.httpClient.defaults.headers['Content-Type'],
    expectedContentType,
    'httpClient Content-Type header should be set correctly'
  );
  assert.strictEqual(
    openAIWrapper.httpClient.defaults.headers['Authorization'],
    expectedAuthHeader,
    'httpClient Authorization header should be set correctly'
  );
}

function testOpenAIOrganization() {
  const proxyHelper = ProxyHelper.getInstance();

  // test null organization
  let organization = proxyHelper.getOpenaiOrg();

  assert.strictEqual(
    organization,
    null,
    'openai organization should be null'
  );

  // test organization with value
  proxyHelper.setOpenaiOrg('test');
  organization = proxyHelper.getOpenaiOrg();
  assert.strictEqual(
    organization,
    'test',
    'openai organization value not correct'
  );
}

module.exports = { testOpenAIWrapper, testOpenAIOrganization };
