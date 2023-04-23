const assert = require('assert');
const { RemoteImageModel } = require('../controller/RemoteImageModel');
const ImageModelInput = require('../model/input/ImageModelInput');

require('dotenv').config();
const openaiKey = process.env.OPENAI_API_KEY;

async function testOpenaiImageRemoteModel() {
  const prompt = 'teddy writing a blog in times square';

  try {
    const wrapper = new RemoteImageModel(openaiKey, 'openai');

    if (openaiKey === '') return;

    const images = await wrapper.generateImages({prompt:prompt, n:3});

    for (const image of images) {
      console.log('- ', image, '\n');

    }

    assert(images.length > 0, 'testOpenaiImageRemoteModel response length should be greater than 0');
    
  } catch (error) {
    if (openaiKey === '') {
      console.log('testOpenaiImageRemoteModel: set the API key to run the test case.');
    } else {
      console.error('Test case failed with exception:', error);
    }
  }
}

(async () => {
  await testOpenaiImageRemoteModel();
})(); 