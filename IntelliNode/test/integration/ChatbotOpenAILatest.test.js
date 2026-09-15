require('dotenv').config();
const assert = require('assert');
const config = require('../../config.json');
const { Chatbot, SupportedChatModels } = require('../../function/Chatbot');
const { ChatGPTInput } = require('../../model/input/ChatModelInput');
const { RemoteImageModel, SupportedImageModels } = require('../../controller/RemoteImageModel');
const { RemoteSpeechModel, SupportedSpeechModels } = require('../../controller/RemoteSpeechModel');
const ImageModelInput = require('../../model/input/ImageModelInput');
const Text2SpeechInput = require('../../model/input/Text2SpeechInput');

const apiKey = process.env.OPENAI_API_KEY;
const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);

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

async function testDefaultModelKeepsRolesAndHistory() {
  const input = new ChatGPTInput('You always answer in French.');
  input.addUserMessage('Say hello.');
  input.addAssistantMessage('Bonjour !');
  input.addUserMessage('Now say thank you.');
  const responses = await bot.chat(input);
  console.log(`  ${config.url.openai.models.chat}:`, responses);
  assert.strictEqual(typeof responses[0], 'string');
  assert.match(responses[0], /merci/i);
}

async function testEffortAndVerbosity() {
  const input = new ChatGPTInput('You are concise.', { effort: 'none', verbosity: 'low', maxTokens: 200 });
  input.addUserMessage('What is 6 times 7? Answer with the number only.');
  const responses = await bot.chat(input);
  assert.match(responses[0], /42/);
}

async function testResponsesTools() {
  const input = new ChatGPTInput('Use tools when helpful.', { tools: [weatherTool], toolChoice: 'required' });
  input.addUserMessage('What is the weather in Paris?');
  const responses = await bot.chat(input);
  const call = responses[0].tool_calls[0];
  console.log('  tool call:', JSON.stringify(call));
  assert.strictEqual(call.function.name, 'get_weather');
  assert.ok(call.id);
}

async function testLegacyFunctionsOnDefaultModel() {
  const input = new ChatGPTInput('You are a helpful assistant.');
  input.addUserMessage('Please return the current date and time in Dublin.');
  const functions = [{
    name: 'get_current_datetime',
    description: 'Returns current datetime',
    parameters: { type: 'object', properties: { location: { type: 'string' } }, required: ['location'] }
  }];
  const responses = await bot.chat(input, functions, 'auto');
  const call = responses.find((response) => typeof response === 'object' && response.function_call);
  assert.ok(call, `expected a function_call, got ${JSON.stringify(responses)}`);
  assert.strictEqual(call.function_call.name, 'get_current_datetime');
}

async function testStreamDefaultModel() {
  const input = new ChatGPTInput('You are concise.');
  input.addUserMessage('Count from 1 to 5 separated by commas.');
  let text = '';
  for await (const chunk of bot.stream(input)) {
    text += chunk;
  }
  console.log('  streamed:', JSON.stringify(text));
  assert.match(text, /1[\s\S]*2[\s\S]*3[\s\S]*4[\s\S]*5/);
}

async function testOSeriesMaxTokens() {
  // o-series chat completions reject max_tokens and non-default temperature
  const input = new ChatGPTInput('You are concise.', { model: 'o4-mini', maxTokens: 1000, temperature: 0.3 });
  input.addUserMessage('Reply with the word OK.');
  const responses = await bot.chat(input);
  assert.match(responses[0], /ok/i);
}

async function testChatRouteOverride() {
  const input = new ChatGPTInput('You are concise.', { model: `${config.url.openai.models.chat}:chat`, maxTokens: 300 });
  input.addUserMessage('Reply with the word OK.');
  assert.ok(Array.isArray(input.getChatInput().messages));
  const responses = await bot.chat(input);
  assert.match(responses[0], /ok/i);
}

async function testChatCompletionsToolsWithFlatFormat() {
  const flatTool = { type: 'function', ...weatherTool.function };
  const input = new ChatGPTInput('Use tools when helpful.', { model: 'gpt-4.1', tools: [flatTool], toolChoice: 'required', temperature: 0 });
  input.addUserMessage('What is the weather in Paris?');
  const responses = await bot.chat(input);
  assert.strictEqual(responses[0].tool_calls[0].function.name, 'get_weather');
}

async function testImageDefaultModel() {
  const imageModel = new RemoteImageModel(apiKey, SupportedImageModels.OPENAI);
  // responseFormat is a dall-e parameter; it must be dropped for the gpt-image default
  const images = await imageModel.generateImages(new ImageModelInput({
    prompt: 'a small red circle on a white background',
    imageSize: '1024x1024',
    quality: 'low',
    responseFormat: 'b64_json'
  }));
  console.log(`  ${config.url.openai.models.image} base64 length:`, images[0].length);
  assert.ok(images[0].length > 1000);
}

async function testSpeechDefaultModel() {
  const speechModel = new RemoteSpeechModel(apiKey, SupportedSpeechModels.OPENAI);
  const stream = await speechModel.generateSpeech(new Text2SpeechInput({ text: 'Hello from IntelliNode.', voice: 'alloy' }));
  let bytes = 0;
  for await (const chunk of stream) {
    bytes += chunk.length;
  }
  console.log(`  ${config.url.openai.models.speech} audio bytes:`, bytes);
  assert.ok(bytes > 1000);
}

(async () => {
  await run('default model keeps roles and history', testDefaultModelKeepsRolesAndHistory);
  await run('effort and verbosity', testEffortAndVerbosity);
  await run('Responses API tools', testResponsesTools);
  await run('legacy functions on the default model', testLegacyFunctionsOnDefaultModel);
  await run('stream on the default model', testStreamDefaultModel);
  await run('o-series max tokens', testOSeriesMaxTokens);
  await run(':chat route override', testChatRouteOverride);
  await run('chat completions tools in flat format', testChatCompletionsToolsWithFlatFormat);
  await run('image default model', testImageDefaultModel);
  await run('speech default model', testSpeechDefaultModel);

  const failed = results.filter((result) => !result.ok);
  console.log(`\nOpenAI: ${results.length - failed.length}/${results.length} passed`);
  if (failed.length > 0) process.exitCode = 1;
})();
