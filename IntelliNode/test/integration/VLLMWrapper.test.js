require('dotenv').config();
const assert = require('assert');
const VLLMWrapper = require('../../wrappers/VLLMWrapper');

const vllmEmbedUrl = process.env.VLLM_EMBED_URL;
const deepseekUrl = process.env.DEEPSEEK_VLLM_URL;
const gemmaUrl = process.env.GEMMA_VLLM_URL;
const llamaUrl = process.env.LLAMA_VLLM_URL;
const mixtralUrl = process.env.MIXTRAL_VLLM_URL;

async function testVLLMEmbedding() {
  const embedWrapper = new VLLMWrapper(vllmEmbedUrl);
  const response = await embedWrapper.getEmbeddings(["hello world"]);
  console.log('VLLM Embeddings:', response);
  assert(response.embeddings[0].length > 0);
}

async function testDeepseekCompletion() {
  const deepseekWrapper = new VLLMWrapper(deepseekUrl);
  const response = await deepseekWrapper.generateText({
    model: "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
    prompt: "What is machine learning?",
    max_tokens: 100,
    temperature: 0.7
  });
  console.log('Deepseek Completion:', response);
  assert(response.choices[0].text.length > 0);
}

async function testGemmaCompletion() {
  const gemmaWrapper = new VLLMWrapper(gemmaUrl);
  const response = await gemmaWrapper.generateText({
    model: "google/gemma-2-2b-it",
    prompt: "What is machine learning?",
    max_tokens: 100,
    temperature: 0.7
  });
  console.log('Gemma Completion:', response);
  assert(response.choices[0].text.length > 0);
}

async function testLlamaCompletion() {
  const llamaWrapper = new VLLMWrapper(llamaUrl);
  const response = await llamaWrapper.generateText({
    model: "meta-llama/Llama-3.1-8B-Instruct",
    prompt: "What is machine learning?",
    max_tokens: 100,
    temperature: 0.7
  });
  console.log('Llama Completion:', response);
  assert(response.choices[0].text.length > 0);
}

async function testMixtralCompletion() {
  const mixtralWrapper = new VLLMWrapper(mixtralUrl);
  const response = await mixtralWrapper.generateText({
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    prompt: "What is machine learning?",
    max_tokens: 100,
    temperature: 0.7
  });
  console.log('Mixtral Completion:', response);
  assert(response.choices[0].text.length > 0);
}

(async () => {
  await testVLLMEmbedding();
  await testDeepseekCompletion();
  await testGemmaCompletion();
  await testLlamaCompletion();
  await testMixtralCompletion();
})();
