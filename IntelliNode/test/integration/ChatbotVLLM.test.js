require('dotenv').config();
const assert = require('assert');
const { Chatbot, SupportedChatModels } = require('../../function/Chatbot');
const { VLLMInput } = require('../../model/input/ChatModelInput');

// URLs from environment
const urls = {
  deepseek: process.env.DEEPSEEK_VLLM_URL,
  gemma: process.env.GEMMA_VLLM_URL,
  llama: process.env.LLAMA_VLLM_URL,
  mistral: process.env.MISTRAL_VLLM_URL,
  embed: process.env.EMBED_VLLM_URL,
};

async function testModel(name, url, model, prompt, isChatSupported = true) {
  try {
    const bot = new Chatbot(null, SupportedChatModels.VLLM, null, { baseUrl: url });

    const input = new VLLMInput("You are a helpful assistant.", {
      model,
      maxTokens: 100,
      temperature: 0.7,
    });

    input.addUserMessage(prompt);

    const response = await bot.chat(input);
    console.log(`${name} response:`, response);
    assert(response[0].length > 0);
  } catch (error) {
    console.error(`${name} error:`, error.message);
  }
}

async function testVLLMStreaming() {
  try {
    console.log('\nTesting VLLM streaming with Mistral:');
    const bot = new Chatbot(null, SupportedChatModels.VLLM, null, { baseUrl: urls.mistral });

    const input = new VLLMInput("You are a helpful assistant.", {
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      maxTokens: 100,
      temperature: 0.7
    });

    console.log('vllm input: ', input)

    input.addUserMessage("What is machine learning?");

    let fullText = '';
    for await (const contentText of bot.stream(input)) {
      fullText += contentText;
      console.log('Received chunk:', contentText);
    }

    console.log('Full stream text: ', fullText);
    assert(fullText.length > 0);
  } catch (error) {
    console.error('VLLM streaming error:', error.message);
  }
}

(async () => {
  await testModel(
    'Deepseek',
    urls.deepseek,
    'deepseek-ai/DeepSeek-R1-Distill-Llama-8B',
    'What is machine learning?'
  );

  await testModel(
    'Gemma',
    urls.gemma,
    'google/gemma-2-2b-it',
    'What is machine learning?',
    false // Gemma does NOT support chat endpoint
  );

  await testModel(
    'LLama',
    urls.llama,
    'meta-llama/Llama-3.1-8B-Instruct',
    'What is machine learning?'
  );

  await testModel(
    'Mistral',
    urls.mistral,
    'mistralai/Mistral-7B-Instruct-v0.2',
    'What is machine learning?'
  );
  await testVLLMStreaming();
})();