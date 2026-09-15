require('dotenv').config();
const assert = require('assert');
const config = require('../../config.json');
const { Chatbot, SupportedChatModels } = require('../../function/Chatbot');
const { MistralInput } = require('../../model/input/ChatModelInput');

const bot = new Chatbot(process.env.MISTRAL_API_KEY, SupportedChatModels.MISTRAL);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const results = [];
async function run(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    results.push({ name, ok: true });
  } catch (error) {
    console.error(`✗ ${name}: ${error.message}`);
    results.push({ name, ok: false });
  }
}

// Mistral free tiers rate limit aggressively; retry 429 responses a few times.
async function withRetry(fn) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= 4 || !/HTTP error 429/.test(error.message)) throw error;
      await sleep(20000 * attempt);
    }
  }
}

async function testDefaultModelChat() {
  const input = new MistralInput('You are a concise art assistant.', { maxTokens: 60, temperature: 0.2 });
  input.addUserMessage('Who painted the Mona Lisa? Answer with the name only.');
  const responses = await withRetry(() => bot.chat(input));
  console.log(`  ${config.url.mistral.models.chat}:`, responses);
  assert.match(responses[0], /leonardo|vinci/i);
}

async function testStream() {
  const input = new MistralInput('You are concise.', { maxTokens: 60 });
  input.addUserMessage('Count from 1 to 5 separated by commas.');
  const text = await withRetry(async () => {
    let streamed = '';
    for await (const chunk of bot.stream(input)) {
      streamed += chunk;
    }
    return streamed;
  });
  console.log('  streamed:', JSON.stringify(text));
  assert.match(text, /1[\s\S]*2[\s\S]*3[\s\S]*4[\s\S]*5/);
}

async function testTools() {
  const input = new MistralInput('Use tools when helpful.', {
    tools: [{ type: 'function', name: 'get_weather', description: 'Get weather', parameters: { type: 'object', properties: { city: { type: 'string' } }, required: ['city'] } }],
    toolChoice: 'any'
  });
  input.addUserMessage('What is the weather in Paris?');
  const responses = await withRetry(() => bot.chat(input));
  assert.strictEqual(responses[0].tool_calls[0].function.name, 'get_weather');
}

(async () => {
  await run('default model chat', testDefaultModelChat);
  await sleep(5000);
  await run('stream', testStream);
  await sleep(5000);
  await run('tools', testTools);

  const failed = results.filter((result) => !result.ok);
  console.log(`\nMistral: ${results.length - failed.length}/${results.length} passed`);
  if (failed.length > 0) process.exitCode = 1;
})();
