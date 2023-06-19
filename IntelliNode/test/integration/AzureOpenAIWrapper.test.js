require('dotenv').config();
const assert = require('assert');
const OpenAIWrapper = require('../../wrappers/OpenAIWrapper');
const proxyHelper = require('../../utils/ProxyHelper').getInstance();
let openAI = null;

async function testLanguageModel() {
  try {
    const params = {
      model: 'davinci_003',
      prompt: 'Summarize the plot of the Inception movie in two sentences',
      max_tokens: 50,
      n: 1,
      stop: '<stop>',
      temperature: 0.7
    };

    const result = await openAI.generateText(params);
    const responseText = result['choices'][0]['text'].trim();
    console.log('Language Model Result:\n', responseText, '\n');
    assert(responseText.length > 0, 'testLanguageModel response length should be greater than 0');
  } catch (error) {
    console.error('Language Model Error:', error);
  }
}

async function testChatGPT() {
  try {
    const params = {
      model: 'gpt_basic',
      messages: [
        {role: 'system', content: 'You are a helpful assistant.'},
        {role: 'user', content: 'Generate a product description for black and white standing desk.'}
      ],
      max_tokens: 100,
      temperature: 0.8
    };

    const result = await openAI.generateChatText(params);
    const responseText = result['choices'][0]['message']['content'].trim();
    console.log('ChatGPT Result: \n', responseText, '\n');
    assert(responseText.length > 0, 'testChatGPT response length should be greater than 0');
  } catch (error) {
    console.error('ChatGPT Error:', error);
  }
}

async function testEmbeddings() {
  try {
    const params = {
      input: 'IntelliNode provide lightning-fast access to the latest deep learning models',
      model: 'embed_latest',
    };

    const result = await openAI.getEmbeddings(params);
    const embeddings = result['data'];
    console.log('Embeddings Result:\n', embeddings[0]['embedding'].slice(0, 50), '\n');
    assert(embeddings.length > 0, 'testEmbeddings response length should be greater than 0');
  } catch (error) {
    console.error('Embeddings Error:', error);
  }
}

(async () => {
  const args = process.argv.slice(2);
  const resourceName = args[0];
  // set azure openai parameters
  proxyHelper.setAzureOpenai(resourceName);
  openAI = new OpenAIWrapper(process.env.AZURE_OPENAI_API_KEY);

  await testLanguageModel();
  await testChatGPT();
  await testEmbeddings();
})();
