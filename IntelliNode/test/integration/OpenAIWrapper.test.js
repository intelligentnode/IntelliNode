require('dotenv').config();
const assert = require('assert');
const FormData = require("form-data");
const OpenAIWrapper = require('../../wrappers/OpenAIWrapper');
const { createReadStream } = require('fs');

const openAI = new OpenAIWrapper(process.env.OPENAI_API_KEY);

async function testLanguageModel() {
  try {
    const params = {
      model: 'text-davinci-003',
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
      model: 'gpt-3.5-turbo',
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

async function testImageModel() {
  try {
    const params = {
      prompt: 'teddy writing a blog in times square',
      n: 1,
      size: '256x256'
    };

    const result = await openAI.generateImages(params);
    const responseUrl = result['data'][0]['url'].trim();
    console.log('Image Model Result:\n', responseUrl, '\n');
    assert(responseUrl.length > 0, 'testImageModel response length should be greater than 0');
  } catch (error) {
    console.error('Image Model Error:', error);
  }
}

async function testSpeechToText() {
  try {
    const audioFilePath =  'samples/audios/audio-one.mp3'
    const form = new FormData();
    form.append('file', createReadStream(audioFilePath));
    form.append('model', 'whisper-1');

    const result = await openAI.speechToText(form);
    const responseUrl = result['data'][0]['url'].trim();
    console.log('Image Model Result:\n', responseUrl, '\n');
    assert(responseUrl.length > 0, 'testImageModel response length should be greater than 0');
  } catch (error) {
    console.error('Image Model Error:', error);
  }
}

async function testEmbeddings() {
  try {
    const params = {
      input: 'IntelliNode provide lightning-fast access to the latest deep learning models',
      model: 'text-embedding-ada-002',
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
  await testLanguageModel();
  await testChatGPT();
  await testImageModel();
  await testEmbeddings();
  await testSpeechToText();
})();
