require('dotenv').config();
const assert = require('assert');
const { RemoteEmbedModel, SupportedEmbedModels } = require('../../controller/RemoteEmbedModel');
const EmbedInput = require('../../model/input/EmbedInput');

const embedUrl = process.env.VLLM_EMBED_URL;
const embedModel = new RemoteEmbedModel(null, SupportedEmbedModels.VLLM, { baseUrl: embedUrl });

async function testVLLMEmbed() {
  const input = new EmbedInput({ texts: ["Hello world"] });
  const result = await embedModel.getEmbeddings(input);

  console.log('Embedding result:', result);

  assert.strictEqual(result.length, 1, 'Should return exactly one embedding.');
  assert(result[0].embedding.length > 0, 'Embedding should not be empty.');
  console.log('Embedding length:', result[0].embedding.length);
}

(async () => {
  await testVLLMEmbed();
})();
