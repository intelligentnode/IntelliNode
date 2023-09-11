require('dotenv').config();
const assert = require('assert');
const { RemoteEmbedModel, SupportedEmbedModels } = require('../../controller/RemoteEmbedModel');
const EmbedInput = require('../../model/input/EmbedInput');
const ProxyHelper = require('../../utils/ProxyHelper');

const openaiApiKey = process.env.AZURE_OPENAI_API_KEY;


async function testOpenAIEmbeddings(proxyHelper, modelName) {
  console.log('start testOpenAIEmbeddings');

  const openaiEmbedModel = new RemoteEmbedModel(openaiApiKey, SupportedEmbedModels.OPENAI, proxyHelper);

  const embedInput = new EmbedInput({
    texts: ['Hello from OpenAI!', '您好，来自 OpenAI！'],
    model: modelName,
  });

  const results = await openaiEmbedModel.getEmbeddings(embedInput);
  console.log('OpenAI Embeddings:', results);
  assert(results.length > 0, 'Test passed');
}

(async () => {

  const args = process.argv.slice(2);
  const resourceName = args[0];
  const modelName = args[1];

  // set azure openai parameters
  proxyHelper = new ProxyHelper()
  proxyHelper.setAzureOpenai(resourceName);

  await testOpenAIEmbeddings(proxyHelper, modelName);
})();