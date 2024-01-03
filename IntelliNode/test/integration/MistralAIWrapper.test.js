require('dotenv').config();
const assert = require('assert');
const MistralAIWrapper = require('../../wrappers/MistralAIWrapper');
const mistral = new MistralAIWrapper(process.env.MISTRAL_API_KEY);

async function testMistralGenerateModel() {
  try {
    const params = {
      model: 'mistral-tiny',
      messages: [{"role": "user", "content": "Who is the most renowned French painter?"}]
    };

    const result = await mistral.generateText(params);
    
    console.log('Mistral Language Model Message:', result.choices[0]['message']['content']);

  } catch (error) {
    console.error('Mistral Language Model Error:', error);
  }
}

async function testMistralEmbeddings() {
  try {
    const params = {
      model: 'mistral-embed',
      input: ["Embed this sentence.", "As well as this one."]
    };

    const result = await mistral.getEmbeddings(params);

    console.log('result: ', result);

    const embeddings = result.data;

    console.log(
      'Mistral Embeddings Result Sample:',
      embeddings[0]['embedding']
    );

    assert(
      embeddings.length > 0,
      'testMistralEmbeddings response length should be greater than 0'
    );

  } catch (error) {
    console.error('Mistral Embeddings Error:', error);
  }
}

(async () => {
  await testMistralGenerateModel();
  await testMistralEmbeddings();
})();