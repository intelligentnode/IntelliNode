require('dotenv').config();
const assert = require('assert');
const VLLMWrapper = require('../../wrappers/VLLMWrapper');
const { VLLMStreamParser } = require('../../utils/StreamParser');

const vllmEmbedUrl = process.env.VLLM_EMBED_URL;
const deepseekUrl = process.env.DEEPSEEK_VLLM_URL;
const gemmaUrl = process.env.GEMMA_VLLM_URL;
const llamaUrl = process.env.LLAMA_VLLM_URL;
const mistralUrl = process.env.MISTRAL_VLLM_URL;

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

async function testMistralCompletion() {
  const mixtralWrapper = new VLLMWrapper(mistralUrl);
  const response = await mixtralWrapper.generateText({
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    prompt: "What is machine learning?",
    max_tokens: 100,
    temperature: 0.7
  });
  console.log('Mixtral Completion:', response);
  assert(response.choices[0].text.length > 0);
}

async function testVLLMWrapperStreaming() {
  console.log('\nTesting direct VLLM wrapper streaming:');

  const vllmUrl = process.env.MIXTRAL_VLLM_URL || 'http://34.166.138.174:8000';
  const wrapper = new VLLMWrapper(vllmUrl);

  const params = {
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
    prompt: 'What is machine learning?',
    max_tokens: 100,
    temperature: 0.7,
    stream: true
  };

  try {
    const stream = await wrapper.generateText(params);
    const streamParser = new VLLMStreamParser();

    let fullText = '';
    for await (const chunk of stream) {
      const chunkText = chunk.toString('utf8');
      for await (const contentText of streamParser.feed(chunkText)) {
        fullText += contentText;
        console.log('Chunk:', contentText);
      }
    }

    console.log('Complete text:', fullText);
    assert(fullText.length > 0, "VLLM streaming response should not be empty");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

(async () => {
  await testVLLMEmbedding();
  await testDeepseekCompletion();
  await testGemmaCompletion();
  await testLlamaCompletion();
  await testMistralCompletion();
  await testVLLMWrapperStreaming();
})();
