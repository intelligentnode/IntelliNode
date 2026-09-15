const testCohereAIWrapper = require('./CohereAIWrapper.test');
const testGoogleAIWrapper = require('./GoogleAIWrapper.test');
const testHuggingWrapper = require('./HuggingWrapper.test');
const {testOpenAIWrapper, testOpenAIOrganization} = require('./OpenAIWrapper.test');
const testStabilityAIWrapper = require('./StabilityAIWrapper.test');
const testPrompt = require('./Prompt.test');
const testModelHelper = require('./ModelHelper.test');
const testChatModelInput = require('./ChatModelInput.test');
const testStreamParser = require('./StreamParser.test');
const testInputDefaults = require('./InputDefaults.test');
const testGen = require('./Gen.test');
const IntelliNode = require('../../index');

(async () => {
  console.log('Sanity Check...');
  console.log(Object.keys(IntelliNode));

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

  console.log('Running ModelHelper unit tests...');
  testModelHelper();

  console.log('Running ChatModelInput unit tests...');
  testChatModelInput();

  console.log('Running StreamParser unit tests...');
  await testStreamParser();

  console.log('Running input defaults unit tests...');
  testInputDefaults();

  console.log('Running Gen unit tests...');
  await testGen();

  console.log('All unit tests passed.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
