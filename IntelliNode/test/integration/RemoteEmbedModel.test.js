require('dotenv').config();
const assert = require('assert');
const config = require('../../config.json');
const { RemoteEmbedModel, SupportedEmbedModels } = require('../../controller/RemoteEmbedModel');
const EmbedInput = require('../../model/input/EmbedInput');

const openaiApiKey = process.env.OPENAI_API_KEY;
const cohereApiKey = process.env.COHERE_API_KEY;
const replicateApiKey = process.env.REPLICATE_API_KEY

const openaiEmbedModel = new RemoteEmbedModel(openaiApiKey, SupportedEmbedModels.OPENAI);
const cohereEmbedModel = new RemoteEmbedModel(cohereApiKey, SupportedEmbedModels.COHERE);
const replicateEmbedModel = new RemoteEmbedModel(replicateApiKey, SupportedEmbedModels.REPLICATE);

async function testOpenAIEmbeddings() {
  console.log('start testOpenAIEmbeddings');

  const embedInput = new EmbedInput({
    texts: ['Hello from OpenAI!', '您好，来自 OpenAI！'],
    model: 'text-embedding-ada-002',
  });

  const results = await openaiEmbedModel.getEmbeddings(embedInput);
  console.log('OpenAI Embeddings:', results);
  assert(results.length > 0, 'Test passed');
}

async function testCohereEmbeddings() {
  console.log('start testCohereEmbeddings');

  const embedInput = new EmbedInput({
    texts: ['Hello from Cohere!', '您好，来自 Cohere！'],
    model: 'embed-multilingual-v2.0',
  });

  const results = await cohereEmbedModel.getEmbeddings(embedInput);
  console.log('Cohere Embeddings:', results);
  assert(results.length > 0, 'Test passed');
}

async function testReplicateEmbeddings() {
  console.log('Start testReplicateEmbeddings');

  const embedInput = new EmbedInput({
    texts: ['Hello from Replicate!', 'Hola desde Replicate!'],
    model: config.models.replicate.llama['llama-2-13b-embeddings-version'],
  });

  const results = await replicateEmbedModel.getEmbeddings(embedInput);
  console.log('Replicate Embeddings:', results);
  
  assert(results.length === embedInput.texts.length && results.every(embedding => embedding.length > 0), 'Test passed');
}

(async () => {
  // await testOpenAIEmbeddings();
  // await testCohereEmbeddings();
  await testReplicateEmbeddings();
})();