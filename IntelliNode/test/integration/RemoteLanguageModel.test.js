require('dotenv').config();
const assert = require('assert');
const { RemoteLanguageModel, SupportedLangModels } = require('../../controller/RemoteLanguageModel');
const LanguageModelInput = require('../../model/input/LanguageModelInput');

const openaiApiKey = process.env.OPENAI_API_KEY;
const cohereApiKey = process.env.COHERE_API_KEY;

const openaiLanguageModel = new RemoteLanguageModel(openaiApiKey, SupportedLangModels.OPENAI);
const cohereLanguageModel = new RemoteLanguageModel(cohereApiKey, SupportedLangModels.COHERE);

async function testOpenAIGenerateOneOutput() {
  const langInput = new LanguageModelInput({
    prompt: 'Write a product description for any device input adapter.',
    model: 'gpt-3.5-turbo-instruct',
    temperature: 0.7});

  //console.log('openAI inputs: ', langInput.getOpenAIInputs());

  const results = await openaiLanguageModel.generateText(langInput);
  console.log('OpenAI Generate One Output:', results[0]);
  assert(results.length > 0, 'Test passed');
}

async function testOpenAIGenerateMultipleOutputs() {
  const langInput = new LanguageModelInput({
          prompt:'Write a product description for any device input adapter.',
          model:'gpt-3.5-turbo-instruct',
          numberOfOutputs:3,
          temperature:0.7})

  //console.log('openAI inputs: ', langInput.getOpenAIInputs());

  
  const results = await openaiLanguageModel.generateText(langInput);
  console.log('\nOpenAI Generate Multiple Outputs:', results);
  assert(results.length > 0, 'Test passed');
}

async function testCohereGenerateOneOutput() {
  const langInput = new LanguageModelInput({prompt:'Write a product description for any device input adapter.'});
  langInput.setDefaultValues(SupportedLangModels.COHERE);

  // console.log('cohere inputs: ', langInput.getCohereInputs());

  const results = await cohereLanguageModel.generateText(langInput);
  console.log('\nCohere Generate One Output:', results[0]);
  assert(results.length > 0, 'Test passed');
}

(async () => {
  await testOpenAIGenerateOneOutput();
  await testOpenAIGenerateMultipleOutputs();
  await testCohereGenerateOneOutput();
})();