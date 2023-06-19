const testCohereAIWrapper = require('./CohereAIWrapper.test');
const testGoogleAIWrapper = require('./GoogleAIWrapper.test');
const testGoogleAIWrapper = require('./HuggingWrapper.test');
const testGoogleAIWrapper = require('./OpenAIWrapper.test');
const testGoogleAIWrapper = require('./StabilityAIWrapper.test');

console.log('Running CohereAIWrapper tests...');
testCohereAIWrapper();

console.log('Running GoogleAIWrapper tests...');
testGoogleAIWrapper();