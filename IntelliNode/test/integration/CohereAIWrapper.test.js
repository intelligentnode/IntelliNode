require('dotenv').config();
const assert = require('assert');
const CohereAIWrapper = require('../../wrappers/CohereAIWrapper');

const cohere = new CohereAIWrapper(process.env.COHERE_API_KEY);

async function testCohereGenerateModel() {
  try {
    const params = {
      model: 'command',
      prompt:
        'Write a blog outline for a blog titled "The Art of Effective Communication"',
      temperature: 0.7,
      max_tokens: 200,
    };

    const result = await cohere.generateText(params);
    console.log(
      'Cohere Language Model Result:',
      result.generations[0].text
    );
  } catch (error) {
    console.error('Cohere Language Model Error:', error);
  }
}

async function testCohereWebChat() {
  try {
    const params = {
      model: 'command-nightly',
      message: 'what is the command to install intellinode npm module ?',
      temperature: 0.3,
      chat_history: [],
      prompt_truncation: 'auto',
      stream: false,
      citation_quality: 'accurate',
      connectors: [{'id': 'web-search'}],
    };
    const result = await cohere.generateChatText(params);

    console.log('Cohere Chat Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Cohere Chat Error:', error);
  }
}

async function testCohereEmbeddings() {
  try {
    const params = {
      texts: [
        'Hello from Cohere!',
        'Hallo von Cohere!',
        '您好，来自 Cohere！',
      ],
      model: 'embed-multilingual-v2.0',
      truncate: 'END',
    };

    const result = await cohere.getEmbeddings(params);
    const embeddings = result.embeddings;
    console.log(
      'Cohere Embeddings Result Sample:',
      embeddings[0].slice(0, 50)
    );
    assert(
      embeddings.length > 0,
      'testCohereEmbeddings response length should be greater than 0'
    );
  } catch (error) {
    console.error('Cohere Embeddings Error:', error);
  }
}

(async () => {
  await testCohereGenerateModel();

  await testCohereWebChat();

  await testCohereEmbeddings();
})();
