require('dotenv').config();
const assert = require('assert');
const CohereAIWrapper = require('../wrappers/CohereAIWrapper');

const cohere = new CohereAIWrapper(process.env.COHERE_API_KEY);


async function testCohereGenerateModel() {
  try {
    const params = {
      model: 'command',
      prompt: 'Write a blog outline for a blog titled "The Art of Effective Communication"',
      temperature: 0.7,
      max_tokens: 200
    };

    const result = await cohere.generateText(params);
    console.log('Cohere Language Model Result:', result['generations'][0]['text']);
  } catch (error) {
    console.error('Cohere Language Model Error:', error);
  }
}


(async () => {
  await testCohereGenerateModel();
})();