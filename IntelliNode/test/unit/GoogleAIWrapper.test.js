const assert = require('assert');
const GoogleAIWrapper = require('../../wrappers/GoogleAIWrapper');
const config = require('../../config.json');

function testGoogleAIWrapper() {
  const apiKey = 'your-api-key';
  const googleAIWrapper = new GoogleAIWrapper(apiKey);

  assert.strictEqual(
    googleAIWrapper.API_KEY,
    apiKey,
    'API key should be set'
  );
  assert.ok(
    googleAIWrapper.httpClient,
    'httpClient should be created'
  );

  // Test httpClient configuration
  const expectedBaseURL = config.url.google.base.replace(
    '{1}',
    config.url.google.speech.prefix
  );
  const expectedContentType = 'application/json; charset=utf-8';

  assert.strictEqual(
    googleAIWrapper.httpClient.defaults.baseURL,
    expectedBaseURL,
    'httpClient baseURL should be set correctly'
  );
  assert.strictEqual(
    googleAIWrapper.httpClient.defaults.headers['Content-Type'],
    expectedContentType,
    'httpClient Content-Type header should be set correctly'
  );
  assert.strictEqual(
    googleAIWrapper.httpClient.defaults.headers['X-Goog-Api-Key'],
    apiKey,
    'httpClient X-Goog-Api-Key header should be set correctly'
  );

  // Test getSynthesizeInput() method
  const params = {
    text: 'Hello world',
    languageCode: 'en-US',
    name: 'en-US-Wavenet-A',
    ssmlGender: 'MALE',
  };
  const expectedModelInput = JSON.stringify({
    input: {
      text: params.text,
    },
    voice: {
      languageCode: params.languageCode,
      name: params.name,
      ssmlGender: params.ssmlGender,
    },
    audioConfig: {
      audioEncoding: 'MP3',
    },
  });

  assert.strictEqual(
    googleAIWrapper.getSynthesizeInput(params),
    expectedModelInput,
    'getSynthesizeInput() should return the correct model input as a JSON string'
  );
}

module.exports = testGoogleAIWrapper;
