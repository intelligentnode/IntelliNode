require('dotenv').config();
const assert = require('assert');
const { Chatbot, SupportedChatModels } = require('../../function/Chatbot');
const { NvidiaInput } = require('../../model/input/ChatModelInput');

async function testNvidiaGenerateText() {
  const bot = new Chatbot(process.env.NVIDIA_API_KEY, SupportedChatModels.NVIDIA);
  const input = new NvidiaInput('You are a helpful GPU-savvy assistant.', {
    model: 'deepseek-ai/deepseek-r1',
    maxTokens: 512,
    temperature: 0.6
  });
  input.addUserMessage('Which number is larger, 9.11 or 9.8?');
  const responses = await bot.chat(input);
  console.log('\n--- NVIDIA Generate Text ---\n');
  console.log(JSON.stringify(responses, null, 2));
  assert(responses.length > 0, 'No response from NVIDIA generate text');
}

async function testNvidiaStream() {
  const bot = new Chatbot(process.env.NVIDIA_API_KEY, SupportedChatModels.NVIDIA);
  const input = new NvidiaInput('You are a poetic assistant.', {
    model: 'meta/llama-3.3-70b-instruct',
    maxTokens: 512,
    temperature: 0.2,
    stream: true
  });
  input.addUserMessage('Write a limerick about GPU computing performance.');
  console.log('\n--- NVIDIA Streaming ---\n');
  const stream = bot.stream(input);
  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }
  console.log('\n--- End of NVIDIA Streaming ---');
}

async function testNvidiaDeepSeekStreaming() {
  const bot = new Chatbot(process.env.NVIDIA_API_KEY, SupportedChatModels.NVIDIA);
  const input = new NvidiaInput('You are a helpful GPU-savvy assistant.', {
    model: 'deepseek-ai/deepseek-r1',
    maxTokens: 512,
    temperature: 0.6,
    stream: true
  });
  input.addUserMessage('Explain the benefits of GPU speed and performance.');
  console.log('\n--- NVIDIA Deep Seek Streaming ---\n');
  let streamedOutput = '';
  for await (const chunk of bot.stream(input)) {
    process.stdout.write(chunk);
    streamedOutput += chunk;
  }
  console.log('\n--- End of Deep Seek Streaming ---');
  assert(streamedOutput.length > 0, 'No content received from deepseek streaming.');
}

(async () => {
  //await testNvidiaGenerateText();
  //await testNvidiaStream();
  await testNvidiaDeepSeekStreaming();
})();
