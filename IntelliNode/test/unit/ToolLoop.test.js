const assert = require('assert');
const config = require('../../config.json');
const FetchClient = require('../../utils/FetchClient');
const { Chatbot, SupportedChatModels } = require('../../function/Chatbot');
const { Gen } = require('../../function/Gen');
const {
  ChatGPTInput,
  OpenAICompatibleInput,
  AnthropicInput,
  GeminiInput,
  MistralInput,
  CohereInput,
  NvidiaInput,
} = require('../../model/input/ChatModelInput');

const weatherTool = {
  name: 'get_weather',
  description: 'Weather for a city',
  parameters: { type: 'object', properties: { city: { type: 'string' } }, required: ['city'] },
  handler: async ({ city }) => ({ city, tempC: 22 }),
};
const citySchema = { type: 'object', properties: { city: { type: 'string' }, country: { type: 'string' } }, required: ['city', 'country'] };
const call = { id: 'call_1', type: 'function', function: { name: 'get_weather', arguments: '{"city":"Paris"}' } };
const result = { id: 'call_1', name: 'get_weather', content: { tempC: 22 } };

// Replies scripted per call; every request body is recorded for assertions.
async function withMockedProviders(replies, run) {
  const calls = [];
  const originalPost = FetchClient.prototype.post;
  const originalGet = FetchClient.prototype.get;
  FetchClient.prototype.post = async function (endpoint, data) {
    calls.push({ url: endpoint.startsWith('http') ? endpoint : this.baseURL + endpoint, body: data, headers: this.defaultHeaders });
    const reply = replies[calls.length - 1];
    if (!reply) throw new Error(`unexpected request #${calls.length} to ${endpoint}`);
    return typeof reply === 'function' ? reply(data) : reply;
  };
  FetchClient.prototype.get = async function (endpoint) {
    calls.push({ url: this.baseURL + endpoint, method: 'GET', headers: this.defaultHeaders });
    return { data: [{ id: 'model-a' }, { id: 'model-b' }] };
  };
  try {
    return await run(calls);
  } finally {
    FetchClient.prototype.post = originalPost;
    FetchClient.prototype.get = originalGet;
  }
}

const chatToolCall = { choices: [{ message: { role: 'assistant', content: null, tool_calls: [call] } }] };
const chatText = (text) => ({ choices: [{ message: { role: 'assistant', content: text } }] });

// ---------------------------------------------------------------------
// Input shapes
// ---------------------------------------------------------------------

function testToolMessagesPerProvider() {
  // chat completions: assistant tool_calls turn then a tool message
  let input = new ChatGPTInput('sys', { model: 'gpt-4.1' });
  input.addUserMessage('hi');
  input.addToolCalls([call], 'thinking');
  input.addToolResults([result]);
  let messages = input.getChatInput().messages;
  assert.deepStrictEqual(messages[2], { role: 'assistant', content: 'thinking', tool_calls: [call] });
  assert.deepStrictEqual(messages[3], { role: 'tool', tool_call_id: 'call_1', content: '{"tempC":22}' });

  // Responses API: function_call and function_call_output items keyed by call_id
  input = new ChatGPTInput('sys');
  input.addUserMessage('hi');
  input.addToolCalls([call]);
  input.addToolResults([result]);
  const items = input.getChatInput().input;
  assert.deepStrictEqual(items[2], { type: 'function_call', call_id: 'call_1', name: 'get_weather', arguments: '{"city":"Paris"}' });
  assert.deepStrictEqual(items[3], { type: 'function_call_output', call_id: 'call_1', output: '{"tempC":22}' });

  // Mistral tool messages carry the tool name
  input = new MistralInput('sys');
  input.addUserMessage('hi');
  input.addToolCalls([call]);
  input.addToolResults([result]);
  assert.deepStrictEqual(input.getChatInput().messages[3], { role: 'tool', tool_call_id: 'call_1', name: 'get_weather', content: '{"tempC":22}' });

  // Anthropic: tool_use block with parsed input, tool_result in a user turn, is_error flag
  input = new AnthropicInput('sys');
  input.addUserMessage('hi');
  input.addToolCalls([call], 'Let me check.');
  input.addToolResults([{ ...result, isError: true }]);
  messages = input.getChatInput().messages;
  assert.deepStrictEqual(messages[1], { role: 'assistant', content: [{ type: 'text', text: 'Let me check.' }, { type: 'tool_use', id: 'call_1', name: 'get_weather', input: { city: 'Paris' } }] });
  assert.deepStrictEqual(messages[2], { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'call_1', content: '{"tempC":22}', is_error: true }] });

  // Gemini: functionCall / functionResponse parts, OpenAI tools converted to functionDeclarations
  input = new GeminiInput(null, { tools: [{ type: 'function', function: { name: 'get_weather', parameters: { ...weatherTool.parameters, additionalProperties: false } } }], toolChoice: 'required' });
  input.addUserMessage('hi');
  input.addToolCalls([call]);
  input.addToolResults([result]);
  const body = input.getChatInput();
  assert.deepStrictEqual(body.contents[1], { role: 'model', parts: [{ functionCall: { name: 'get_weather', args: { city: 'Paris' } } }] });
  assert.deepStrictEqual(body.contents[2], { role: 'user', parts: [{ functionResponse: { name: 'get_weather', response: { tempC: 22 } } }] });
  assert.deepStrictEqual(body.tools, [{ functionDeclarations: [{ name: 'get_weather', parameters: weatherTool.parameters }] }], 'additionalProperties must be stripped for Gemini');
  assert.deepStrictEqual(body.toolConfig, { functionCallingConfig: { mode: 'ANY' } });

  // NVIDIA: chat-completions shape
  input = new NvidiaInput('sys', { tools: [weatherTool] });
  input.addUserMessage('hi');
  input.addToolCalls([call]);
  input.addToolResults([result]);
  const nvidia = input.getChatInput();
  assert.strictEqual(nvidia.messages[3].role, 'tool');
  assert.strictEqual(nvidia.tools[0].function.name, 'get_weather');

  // Cohere has no tool round trip in this library
  assert.throws(() => new CohereInput('sys').addToolCalls([call]), /does not support tool calls/);
}

function testStructuredOutputPerProvider() {
  // Responses API defaults strict to true, so strict is sent explicitly
  let format = new ChatGPTInput('s', { responseSchema: citySchema }).getChatInput().text.format;
  assert.deepStrictEqual(format, { type: 'json_schema', name: 'response', schema: citySchema, strict: false });
  // chat completions: nested json_schema, no strict unless asked
  format = new ChatGPTInput('s', { model: 'gpt-4.1', responseSchema: citySchema }).getChatInput().response_format;
  assert.deepStrictEqual(format, { type: 'json_schema', json_schema: { name: 'response', schema: citySchema } });
  // strict mode closes every object
  format = new ChatGPTInput('s', { model: 'gpt-4.1', responseSchema: citySchema, strictSchema: true }).getChatInput().response_format;
  assert.strictEqual(format.json_schema.strict, true);
  assert.strictEqual(format.json_schema.schema.additionalProperties, false);
  // free-form JSON mode
  assert.deepStrictEqual(new ChatGPTInput('s', { model: 'gpt-4.1', responseFormat: 'json' }).getChatInput().response_format, { type: 'json_object' });
  // schema title becomes the format name
  format = new ChatGPTInput('s', { model: 'gpt-4.1', responseSchema: { ...citySchema, title: 'City Info' } }).getChatInput().response_format;
  assert.strictEqual(format.json_schema.name, 'City_Info');

  // Anthropic: output_config.format with closed objects; JSON mode becomes a system instruction
  let body = new AnthropicInput('sys', { responseSchema: citySchema }).getChatInput();
  assert.deepStrictEqual(body.output_config, { format: { type: 'json_schema', schema: { ...citySchema, additionalProperties: false } } });
  body = new AnthropicInput('sys', { responseFormat: 'json' }).getChatInput();
  assert.strictEqual(body.output_config, undefined);
  assert.match(body.system, /valid JSON/);

  // Gemini: mime type + schema without $schema / additionalProperties
  body = new GeminiInput(null, { responseSchema: { $schema: 'x', ...citySchema, additionalProperties: false } }).getChatInput();
  assert.deepStrictEqual(body.generationConfig, { responseMimeType: 'application/json', responseSchema: citySchema });

  // Mistral and compatible services use the chat-completions format
  assert.strictEqual(new MistralInput('s', { responseSchema: citySchema }).getChatInput().response_format.type, 'json_schema');
  assert.strictEqual(new OpenAICompatibleInput('s', { responseFormat: 'json' }).getChatInput().response_format.type, 'json_object');

  // Cohere v1 chat
  assert.deepStrictEqual(new CohereInput('s', { responseSchema: citySchema }).getChatInput().response_format, { type: 'json_object', schema: citySchema });
}

function testOpenAICompatibleInput() {
  const input = new OpenAICompatibleInput('sys', { tools: [weatherTool] });
  input.addUserMessage('hi');
  const body = input.getChatInput();
  assert.strictEqual(body.model, undefined, 'the preset default model is applied by the wrapper');
  assert.strictEqual(body.temperature, undefined);
  assert.strictEqual(body.max_tokens, undefined);
  assert.deepStrictEqual(body.messages, [{ role: 'system', content: 'sys' }, { role: 'user', content: 'hi' }]);
  assert.strictEqual(body.tools[0].function.name, 'get_weather');

  const tuned = new OpenAICompatibleInput('sys', { model: 'llama3', temperature: 0.2, maxTokens: 40 }).getChatInput();
  assert.deepStrictEqual({ model: tuned.model, temperature: tuned.temperature, max_tokens: tuned.max_tokens }, { model: 'llama3', temperature: 0.2, max_tokens: 40 });
}

// ---------------------------------------------------------------------
// Chatbot
// ---------------------------------------------------------------------

async function testRunToolsOpenAIChat() {
  await withMockedProviders([chatToolCall, chatText('It is 22C in Paris.')], async (calls) => {
    const bot = new Chatbot('key', SupportedChatModels.OPENAI);
    const input = new ChatGPTInput('sys', { model: 'gpt-4.1' });
    input.addUserMessage('Weather in Paris?');
    const events = [];
    const out = await bot.runTools(input, [weatherTool], { onToolCall: (name, args) => events.push([name, args]) });

    assert.strictEqual(out.text, 'It is 22C in Paris.');
    assert.strictEqual(out.toolCalls, 1);
    assert.deepStrictEqual(out.steps, [{ name: 'get_weather', arguments: { city: 'Paris' }, result: { city: 'Paris', tempC: 22 }, isError: false }]);
    assert.deepStrictEqual(events, [['get_weather', { city: 'Paris' }]]);
    assert.strictEqual(calls.length, 2);
    // the tool definitions were attached to the input and sent with both requests
    assert.strictEqual(calls[0].body.tools[0].function.name, 'get_weather');
    const second = calls[1].body.messages;
    assert.deepStrictEqual(second[2], { role: 'assistant', content: null, tool_calls: [call] });
    assert.deepStrictEqual(second[3], { role: 'tool', tool_call_id: 'call_1', content: '{"city":"Paris","tempC":22}' });
  });
}

async function testRunToolsOpenAIResponses() {
  const responsesToolCall = { output: [{ type: 'function_call', call_id: 'call_9', name: 'get_weather', arguments: '{"city":"Rome"}' }] };
  const responsesText = { output: [{ type: 'message', content: [{ type: 'output_text', text: 'Sunny in Rome.' }] }] };
  await withMockedProviders([responsesToolCall, responsesText], async (calls) => {
    const bot = new Chatbot('key', SupportedChatModels.OPENAI);
    const input = new ChatGPTInput('sys');
    input.addUserMessage('Weather in Rome?');
    const out = await bot.runTools(input, { get_weather: async ({ city }) => `${city}: sunny` });
    // a handler map needs definitions from the input
    assert.strictEqual(out.text, 'Sunny in Rome.');
  }).catch((error) => {
    assert.match(error.message, /needs tool definitions/);
  });

  await withMockedProviders([responsesToolCall, responsesText], async (calls) => {
    const bot = new Chatbot('key', SupportedChatModels.OPENAI);
    const input = new ChatGPTInput('sys', { tools: [{ type: 'function', function: { name: 'get_weather', parameters: weatherTool.parameters } }] });
    input.addUserMessage('Weather in Rome?');
    const out = await bot.runTools(input, { get_weather: async ({ city }) => `${city}: sunny` });
    assert.strictEqual(out.text, 'Sunny in Rome.');
    assert.strictEqual(out.steps[0].result, 'Rome: sunny');
    assert.ok(calls[0].url.endsWith('/responses'));
    const items = calls[1].body.input;
    assert.deepStrictEqual(items[2], { type: 'function_call', call_id: 'call_9', name: 'get_weather', arguments: '{"city":"Rome"}' });
    assert.deepStrictEqual(items[3], { type: 'function_call_output', call_id: 'call_9', output: 'Rome: sunny' });
  });
}

async function testRunToolsAnthropicAndGemini() {
  const anthropicToolUse = { content: [{ type: 'thinking', thinking: '...' }, { type: 'tool_use', id: 'toolu_1', name: 'get_weather', input: { city: 'Paris' } }], stop_reason: 'tool_use' };
  const anthropicText = { content: [{ type: 'text', text: 'Paris: 22C.' }], stop_reason: 'end_turn' };
  await withMockedProviders([anthropicToolUse, anthropicText], async (calls) => {
    const bot = new Chatbot('key', SupportedChatModels.ANTHROPIC);
    const input = new AnthropicInput('sys');
    input.addUserMessage('Weather in Paris?');
    const out = await bot.runTools(input, [weatherTool]);
    assert.strictEqual(out.text, 'Paris: 22C.');
    assert.deepStrictEqual(calls[0].body.tools, [{ name: 'get_weather', description: 'Weather for a city', input_schema: weatherTool.parameters }]);
    const messages = calls[1].body.messages;
    assert.deepStrictEqual(messages[1].content, [{ type: 'tool_use', id: 'toolu_1', name: 'get_weather', input: { city: 'Paris' } }]);
    assert.deepStrictEqual(messages[2].content, [{ type: 'tool_result', tool_use_id: 'toolu_1', content: '{"city":"Paris","tempC":22}' }]);
  });

  const geminiCall = { candidates: [{ content: { parts: [{ functionCall: { name: 'get_weather', args: { city: 'Paris' } } }] } }] };
  const geminiText = { candidates: [{ content: { parts: [{ text: 'Paris is at 22C.' }] } }] };
  await withMockedProviders([geminiCall, geminiText], async (calls) => {
    const bot = new Chatbot('key', SupportedChatModels.GEMINI);
    const input = new GeminiInput(null);
    input.addUserMessage('Weather in Paris?');
    const out = await bot.runTools(input, [weatherTool]);
    assert.strictEqual(out.text, 'Paris is at 22C.');
    assert.strictEqual(calls[0].body.tools[0].functionDeclarations[0].name, 'get_weather');
    const contents = calls[1].body.contents;
    assert.deepStrictEqual(contents[1].parts, [{ functionCall: { name: 'get_weather', args: { city: 'Paris' } } }]);
    assert.deepStrictEqual(contents[2].parts, [{ functionResponse: { name: 'get_weather', response: { city: 'Paris', tempC: 22 } } }]);
  });
}

async function testRunToolsErrorsAndMcp() {
  // a failing handler is reported to the model instead of aborting the loop
  await withMockedProviders([chatToolCall, chatText('Sorry, no data.')], async (calls) => {
    const bot = new Chatbot('key', SupportedChatModels.OPENAI);
    const input = new ChatGPTInput('sys', { model: 'gpt-4.1' });
    input.addUserMessage('Weather?');
    const out = await bot.runTools(input, [{ ...weatherTool, handler: async () => { throw new Error('service down'); } }]);
    assert.deepStrictEqual(out.steps[0], { name: 'get_weather', arguments: { city: 'Paris' }, result: 'Error: service down', isError: true });
    assert.strictEqual(calls[1].body.messages[3].content, 'Error: service down');
  });

  // unknown tool name
  await withMockedProviders([chatToolCall, chatText('ok')], async () => {
    const bot = new Chatbot('key', SupportedChatModels.OPENAI);
    const input = new ChatGPTInput('sys', { model: 'gpt-4.1', tools: [{ type: 'function', function: { name: 'get_weather', parameters: {} }}] });
    input.addUserMessage('Weather?');
    const out = await bot.runTools(input, { other_tool: async () => 'x' });
    assert.strictEqual(out.steps[0].isError, true);
    assert.match(out.steps[0].result, /Unknown tool 'get_weather'/);
  });

  // maxSteps guard
  await withMockedProviders([chatToolCall, chatToolCall, chatToolCall], async () => {
    const bot = new Chatbot('key', SupportedChatModels.OPENAI);
    const input = new ChatGPTInput('sys', { model: 'gpt-4.1' });
    input.addUserMessage('Weather?');
    await assert.rejects(bot.runTools(input, [weatherTool], { maxSteps: 2 }), /stopped after 2 tool rounds/);
  });

  // an MCP-style client supplies both the definitions and the handlers
  const mcp = {
    toChatTools: () => [{ type: 'function', function: { name: 'get_weather', description: 'via mcp', parameters: weatherTool.parameters } }],
    calls: [],
    callTool: async (name, args) => { mcp.calls.push([name, args]); return { content: [{ type: 'text', text: '22C' }], text: '22C', isError: false }; },
  };
  await withMockedProviders([chatToolCall, chatText('22C in Paris.')], async (calls) => {
    const bot = new Chatbot('key', SupportedChatModels.OPENAI);
    const input = new ChatGPTInput('sys', { model: 'gpt-4.1' });
    input.addUserMessage('Weather?');
    const out = await bot.runTools(input, mcp);
    assert.strictEqual(out.text, '22C in Paris.');
    assert.deepStrictEqual(mcp.calls, [['get_weather', { city: 'Paris' }]]);
    assert.strictEqual(calls[0].body.tools[0].function.description, 'via mcp');
    assert.strictEqual(calls[1].body.messages[3].content, '22C');
  });
}

async function testChatJson() {
  await withMockedProviders([chatText('Here you go:\n```json\n{"city": "Paris", "country": "France"}\n```')], async (calls) => {
    const bot = new Chatbot('key', SupportedChatModels.OPENAI);
    const input = new ChatGPTInput('sys', { model: 'gpt-4.1', responseSchema: citySchema });
    input.addUserMessage('Where is the Eiffel Tower?');
    assert.deepStrictEqual(await bot.chatJson(input), { city: 'Paris', country: 'France' });
    assert.strictEqual(calls[0].body.response_format.type, 'json_schema');
  });
  await withMockedProviders([chatText('[1, 2]')], async () => {
    const bot = new Chatbot('key', SupportedChatModels.OPENAI);
    const input = new ChatGPTInput('sys', { model: 'gpt-4.1', responseSchema: { type: 'object' } });
    input.addUserMessage('x');
    await assert.rejects(bot.chatJson(input), /object/);
  });
}

async function testCompatibleProviders() {
  await withMockedProviders([chatText('hello'), chatText('hi')], async (calls) => {
    // preset: base URL, key header and default model
    const bot = new Chatbot('or-key', SupportedChatModels.OPENROUTER, null, { timeout: 1234, retries: 0 });
    const input = new OpenAICompatibleInput('sys');
    input.addUserMessage('hi');
    assert.deepStrictEqual(await bot.chat(input), ['hello']);
    assert.strictEqual(calls[0].url, 'https://openrouter.ai/api/v1/chat/completions');
    assert.strictEqual(calls[0].headers.Authorization, 'Bearer or-key');
    assert.strictEqual(calls[0].body.model, config.url.openai_compatible.presets.openrouter.chat_model);
    assert.deepStrictEqual(bot.compatibleWrapper.client.requestOptions, { timeout: 1234, retries: 0 });

    // local preset without a key gets a placeholder header; explicit model wins
    const local = new Chatbot(null, SupportedChatModels.OLLAMA, null, { model: 'qwen3' });
    assert.deepStrictEqual(await local.chat(input), ['hi']);
    assert.strictEqual(calls[1].url, 'http://localhost:11434/v1/chat/completions');
    assert.strictEqual(calls[1].headers.Authorization, 'Bearer not-needed');
    assert.strictEqual(calls[1].body.model, 'qwen3');

    // model listing
    assert.deepStrictEqual(await local.listModels(), ['model-a', 'model-b']);
    assert.strictEqual(calls[2].url, 'http://localhost:11434/v1/models');
  });

  // presets without a default model must say so
  await withMockedProviders([], async () => {
    const groq = new Chatbot('g', SupportedChatModels.GROQ);
    const input = new OpenAICompatibleInput('sys');
    input.addUserMessage('hi');
    await assert.rejects(groq.chat(input), /listModels/);
  });
  assert.throws(() => new Chatbot('k', SupportedChatModels.OPENAI_COMPATIBLE), /baseUrl/);
  assert.strictEqual(new Chatbot('k', SupportedChatModels.OPENAI_COMPATIBLE, null, { baseUrl: 'https://h/v1/' }).compatibleWrapper.API_BASE_URL, 'https://h/v1');
}

async function testGenWithCompatibleAndJson() {
  await withMockedProviders([chatText('<think>hmm</think>Hello!'), chatText('{"city":"Rome","country":"Italy"}')], async (calls) => {
    const text = await Gen.generate_text('Say hi', null, 'ollama', { model: 'qwen3', timeout: 5000 });
    assert.strictEqual(text, 'Hello!');
    assert.strictEqual(calls[0].url, 'http://localhost:11434/v1/chat/completions');
    const data = await Gen.generate_json('Where is the Colosseum?', citySchema, 'key', 'openai', { model: 'gpt-4.1' });
    assert.deepStrictEqual(data, { city: 'Rome', country: 'Italy' });
    assert.strictEqual(calls[1].body.response_format.json_schema.schema, citySchema);
  });
  await assert.rejects(Gen.generate_text('x', 'k', 'openai_compatible'), /baseUrl/);
}

module.exports = async function testToolLoop() {
  testToolMessagesPerProvider();
  testStructuredOutputPerProvider();
  testOpenAICompatibleInput();
  await testRunToolsOpenAIChat();
  await testRunToolsOpenAIResponses();
  await testRunToolsAnthropicAndGemini();
  await testRunToolsErrorsAndMcp();
  await testChatJson();
  await testCompatibleProviders();
  await testGenWithCompatibleAndJson();
  console.log('Tool loop, structured output and OpenAI-compatible tests passed.');
};

if (require.main === module) {
  module.exports().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
