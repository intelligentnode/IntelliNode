const testCohereAIWrapper = require('./CohereAIWrapper.test');
const testGoogleAIWrapper = require('./GoogleAIWrapper.test');
const testHuggingWrapper = require('./HuggingWrapper.test');
const {testOpenAIWrapper, testOpenAIOrganization} = require('./OpenAIWrapper.test');
const testStabilityAIWrapper = require('./StabilityAIWrapper.test');
const testPrompt = require('./Prompt.test');


console.log('Running Prompt unit tests...');
testPrompt();

console.log('Running CohereAIWrapper unit tests...');
testCohereAIWrapper();

console.log('Running GoogleAIWrapper unit tests...');
testGoogleAIWrapper();

console.log('Running HuggingWrapper unit tests...');
testHuggingWrapper();

console.log('Running OpenAIWrapper unit tests...');
testOpenAIWrapper();
testOpenAIOrganization();

console.log('Running Stability unit tests...');
testStabilityAIWrapper()