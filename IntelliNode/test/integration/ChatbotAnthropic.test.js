require('dotenv').config();
const assert = require('assert');
const config = require('../../config.json');
const { Chatbot, SupportedChatModels } = require('../../function/Chatbot');
const { AnthropicInput } = require('../../model/input/ChatModelInput');

const bot = new Chatbot(process.env.ANTHROPIC_API_KEY, SupportedChatModels.ANTHROPIC);

const weatherTool = {
  type: 'function',
  function: {
    name: 'get_weather',
    description: 'Get the current weather for a city',
    parameters: { type: 'object', properties: { city: { type: 'string' } }, required: ['city'] }
  }
};

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

async function testDefaultModelChat() {
  const input = new AnthropicInput('You are a concise assistant.');
  input.addUserMessage('What is the capital of France? Answer in one word.');
  const responses = await bot.chat(input);
  console.log(`  ${config.url.anthropic.models.chat}:`, responses);
  assert.strictEqual(typeof responses[0], 'string');
  assert.match(responses[0], /paris/i);
}

async function testTemperatureDroppedForClaude5() {
  // Claude 5 returns HTTP 400 for temperature, so the input must omit it
  const input = new AnthropicInput('You are a concise assistant.', { model: 'claude-sonnet-5', temperature: 0.2 });
  input.addUserMessage('Reply with the word OK.');
  const responses = await bot.chat(input);
  assert.match(responses[0], /ok/i);
}

async function testTemperatureKeptForHaiku() {
  const input = new AnthropicInput('You are a concise assistant.', { model: config.url.anthropic.models.haiku, temperature: 0.2, maxTokens: 64 });
  input.addUserMessage('Reply with the word OK.');
  assert.strictEqual(input.getChatInput().temperature, 0.2);
  const responses = await bot.chat(input);
  assert.match(responses[0], /ok/i);
}

async function testOpusThinkingReturnsOnlyText() {
  const input = new AnthropicInput('You are a careful assistant.', { model: config.url.anthropic.models.opus });
  input.addUserMessage('How many letter r are in the word strawberry? Answer with just the number.');
  const responses = await bot.chat(input);
  console.log(`  ${config.url.anthropic.models.opus}:`, responses);
  assert.ok(responses.length > 0 && responses.every((response) => typeof response === 'string'));
  assert.match(responses.join(''), /3/);
}

async function testStream() {
  const input = new AnthropicInput('You are a concise assistant.');
  input.addUserMessage('Count from 1 to 5 separated by commas.');
  let text = '';
  let chunks = 0;
  for await (const chunk of bot.stream(input)) {
    text += chunk;
    chunks += 1;
  }
  console.log(`  streamed ${chunks} chunks:`, JSON.stringify(text));
  assert.match(text, /1[\s\S]*2[\s\S]*3[\s\S]*4[\s\S]*5/);
}

async function testToolsWithOpenAIFormat() {
  const input = new AnthropicInput('Use tools when helpful.', { tools: [weatherTool], toolChoice: 'required' });
  input.addUserMessage('What is the weather in Paris?');
  const responses = await bot.chat(input);
  const call = responses[0].tool_calls[0];
  console.log('  tool call:', JSON.stringify(call));
  assert.strictEqual(call.function.name, 'get_weather');
  assert.match(JSON.parse(call.function.arguments).city, /paris/i);
}

async function testPlainObjectInput() {
  const responses = await bot.chat({
    model: config.url.anthropic.models.haiku,
    max_tokens: 64,
    messages: [{ role: 'user', content: 'Reply with the word OK.' }]
  });
  assert.match(responses[0], /ok/i);
}

(async () => {
  await run('default model chat', testDefaultModelChat);
  await run('temperature dropped for Claude 5', testTemperatureDroppedForClaude5);
  await run('temperature kept for Haiku 4.5', testTemperatureKeptForHaiku);
  await run('Opus thinking returns only text', testOpusThinkingReturnsOnlyText);
  await run('stream', testStream);
  await run('tools in OpenAI format', testToolsWithOpenAIFormat);
  await run('plain object input', testPlainObjectInput);

  const failed = results.filter((result) => !result.ok);
  console.log(`\nAnthropic: ${results.length - failed.length}/${results.length} passed`);
  if (failed.length > 0) process.exitCode = 1;
})();
