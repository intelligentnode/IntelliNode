// Runs the built browser bundle (front/intellinode.min.js) with browser-like globals and native fetch,
// which exercises the same web ReadableStream code path as the browser. Run `npm run build` first.
require('dotenv').config();
const assert = require('assert');
const path = require('path');

global.self = globalThis;
global.window = globalThis;
globalThis.document = {};

// Safari's ReadableStream has no Symbol.asyncIterator. Wrapping fetch (before the bundle captures it)
// lets a test hand the library bodies that only expose getReader(), without breaking Node's own fetch.
const nativeFetch = globalThis.fetch;
let safariBodies = false;
globalThis.fetch = async (...args) => {
  const response = await nativeFetch(...args);
  if (safariBodies && response.body) {
    const body = response.body;
    Object.defineProperty(response, 'body', { value: { getReader: () => body.getReader() } });
  }
  return response;
};

const IntelliNode = require(path.join(__dirname, '..', '..', 'front', 'intellinode.min.js'));

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

async function collect(stream) {
  let text = '';
  for await (const chunk of stream) {
    text += chunk;
  }
  return text;
}

async function testExportsAndTemplates() {
  for (const name of ['Chatbot', 'ChatGPTInput', 'AnthropicInput', 'MistralInput', 'GeminiInput', 'Gen', 'ModelHelper', 'AnthropicStreamParser',
    'OpenAICompatibleInput', 'OpenAICompatibleWrapper', 'FetchClient', 'OutputParser', 'MCPClient']) {
    assert.ok(IntelliNode[name], `missing export ${name}`);
  }
  // the MCP server is Node only and must not drag the http polyfill into the bundle
  assert.strictEqual(IntelliNode.MCPServer, undefined);
  const compatible = new IntelliNode.Chatbot(null, 'ollama', null, { model: 'qwen3' });
  assert.strictEqual(compatible.compatibleWrapper.API_BASE_URL, 'http://localhost:11434/v1');
  // Gen prompt templates must load without a file system
  const template = new IntelliNode.Prompt('${text}').format({ text: 'ok' });
  assert.strictEqual(template, 'ok');
  const anthropic = new IntelliNode.AnthropicWrapper('key');
  assert.strictEqual(anthropic.client.defaultHeaders['anthropic-dangerous-direct-browser-access'], 'true');
}

async function testOpenAIChatAndStream() {
  const bot = new IntelliNode.Chatbot(process.env.OPENAI_API_KEY, 'openai');
  const input = new IntelliNode.ChatGPTInput('You are concise.');
  input.addUserMessage('Count from 1 to 5 separated by commas.');
  const responses = await bot.chat(input);
  assert.match(responses[0], /1[\s\S]*5/);
  const streamed = await collect(bot.stream(input));
  console.log('  openai streamed:', JSON.stringify(streamed));
  assert.match(streamed, /1[\s\S]*2[\s\S]*3[\s\S]*4[\s\S]*5/);
}

async function testAnthropicChatAndStreamWithBrowserHeader() {
  const bot = new IntelliNode.Chatbot(process.env.ANTHROPIC_API_KEY, 'anthropic');
  const input = new IntelliNode.AnthropicInput('You are concise.', { model: 'claude-haiku-4-5', maxTokens: 100 });
  input.addUserMessage('Count from 1 to 5 separated by commas.');
  const responses = await bot.chat(input);
  assert.match(responses[0], /1[\s\S]*5/);
  const streamed = await collect(bot.stream(input));
  console.log('  anthropic streamed:', JSON.stringify(streamed));
  assert.match(streamed, /1[\s\S]*2[\s\S]*3[\s\S]*4[\s\S]*5/);
}

async function testCohereChat() {
  const bot = new IntelliNode.Chatbot(process.env.COHERE_API_KEY, 'cohere');
  const input = new IntelliNode.CohereInput('You are concise.', { maxTokens: 30 });
  input.addUserMessage('What is the capital of Italy? Answer in one word.');
  const responses = await bot.chat(input);
  assert.match(responses[0], /rome/i);
}

async function testStreamWithoutAsyncIteratorSupport() {
  safariBodies = true;
  try {
    const bot = new IntelliNode.Chatbot(process.env.ANTHROPIC_API_KEY, 'anthropic');
    const input = new IntelliNode.AnthropicInput('You are concise.', { model: 'claude-haiku-4-5', maxTokens: 60 });
    input.addUserMessage('Reply with the word OK.');
    const streamed = await collect(bot.stream(input));
    assert.match(streamed, /ok/i);
  } finally {
    safariBodies = false;
  }
}

(async () => {
  await run('exports, templates and browser header', testExportsAndTemplates);
  await run('OpenAI chat and stream', testOpenAIChatAndStream);
  await run('Anthropic chat and stream', testAnthropicChatAndStreamWithBrowserHeader);
  await run('Cohere chat', testCohereChat);
  await run('stream without ReadableStream async iterator (Safari)', testStreamWithoutAsyncIteratorSupport);

  const failed = results.filter((result) => !result.ok);
  console.log(`\nFront bundle: ${results.length - failed.length}/${results.length} passed`);
  if (failed.length > 0) process.exitCode = 1;
})();
