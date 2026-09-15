const assert = require('assert');
const config = require('../../config.json');
const {
  ChatGPTInput,
  ChatGPTMessage,
  AnthropicInput,
  MistralInput,
  CohereInput,
  GeminiInput,
  NvidiaInput,
} = require('../../model/input/ChatModelInput');

const weatherTool = { type: 'function', function: { name: 'get_weather', parameters: { type: 'object', properties: { city: { type: 'string' } } } } };

function testOpenAIResponsesInput() {
  const input = new ChatGPTInput('You are terse.', { maxTokens: 300, verbosity: 'low', tools: [weatherTool], toolChoice: { type: 'function', function: { name: 'get_weather' } } });
  input.addMessage(new ChatGPTMessage('Hi', 'user', 'bob'));
  input.addAssistantMessage('Hello');
  input.addUserMessage([{ type: 'text', text: 'Describe' }, { type: 'image_url', image_url: { url: 'data:image/png;base64,AAA' } }]);

  const params = input.getChatInput();
  assert.strictEqual(params.model, config.url.openai.models.chat);
  assert.deepStrictEqual(params.input[0], { role: 'system', content: 'You are terse.' });
  assert.deepStrictEqual(params.input[1], { role: 'user', content: 'Hi' }, 'Responses input must not carry a name field');
  assert.deepStrictEqual(params.input[3].content, [{ type: 'input_text', text: 'Describe' }, { type: 'input_image', image_url: 'data:image/png;base64,AAA' }]);
  assert.deepStrictEqual(params.reasoning, { effort: 'low' });
  assert.strictEqual(params.max_output_tokens, 300);
  assert.deepStrictEqual(params.text, { verbosity: 'low' });
  assert.deepStrictEqual(params.tools, [{ type: 'function', name: 'get_weather', parameters: weatherTool.function.parameters }]);
  assert.deepStrictEqual(params.tool_choice, { type: 'function', name: 'get_weather' });
  assert.strictEqual(params.temperature, undefined);
  assert.strictEqual(params.messages, undefined);

  assert.strictEqual(new ChatGPTInput('s', { model: 'gpt-5.5-pro' }).getChatInput().reasoning.effort, 'medium');
  assert.strictEqual(new ChatGPTInput('s', { effort: 'high' }).getChatInput().reasoning.effort, 'high');
}

function testOpenAIChatCompletionsInput() {
  const input = new ChatGPTInput('sys', { model: 'gpt-4o', temperature: 0, maxTokens: 50, tools: [{ type: 'function', name: 'get_weather', parameters: {} }], toolChoice: 'auto' });
  input.addMessage(new ChatGPTMessage('Hi', 'user', 'bob'));
  const params = input.getChatInput();
  assert.strictEqual(params.model, 'gpt-4o');
  assert.strictEqual(params.temperature, 0, 'temperature 0 must be preserved');
  assert.strictEqual(params.max_tokens, 50);
  assert.deepStrictEqual(params.messages[1], { role: 'user', name: 'bob', content: 'Hi' });
  assert.deepStrictEqual(params.tools, [{ type: 'function', function: { name: 'get_weather', parameters: {} } }]);
  assert.strictEqual(params.tool_choice, 'auto');

  const oSeries = new ChatGPTInput('sys', { model: 'o4-mini', temperature: 0.5, maxTokens: 500 }).getChatInput();
  assert.strictEqual(oSeries.max_completion_tokens, 500);
  assert.strictEqual(oSeries.max_tokens, undefined);
  assert.strictEqual(oSeries.temperature, undefined);

  const override = new ChatGPTInput('sys', { model: 'gpt-5.5:chat', maxTokens: 100 }).getChatInput();
  assert.strictEqual(override.model, 'gpt-5.5');
  assert.ok(Array.isArray(override.messages));
  assert.strictEqual(override.max_completion_tokens, 100);
}

function testAnthropicInput() {
  const input = new AnthropicInput('Be brief', { temperature: 0.3, tools: [weatherTool], toolChoice: 'required' });
  input.addUserMessage('Weather?');
  const params = input.getChatInput();
  assert.strictEqual(params.model, config.url.anthropic.models.chat);
  assert.strictEqual(params.system, 'Be brief');
  assert.strictEqual(params.max_tokens, 2048);
  assert.strictEqual(params.temperature, undefined, 'Claude 5 rejects temperature');
  assert.deepStrictEqual(params.tools, [{ name: 'get_weather', input_schema: weatherTool.function.parameters }]);
  assert.deepStrictEqual(params.tool_choice, { type: 'any' });

  const haiku = new AnthropicInput('s', { model: 'claude-haiku-4-5', temperature: 0.3 }).getChatInput();
  assert.strictEqual(haiku.temperature, 0.3);
  assert.strictEqual(new AnthropicInput('s', { model: 'claude-haiku-4-5' }).getChatInput().temperature, undefined);

  input.deleteLastMessage({ role: 'user', content: 'Weather?' });
  assert.strictEqual(input.messages.length, 0);
}

function testOtherProviderInputs() {
  const mistral = new MistralInput('sys', { maxTokens: 20 });
  mistral.addUserMessage('Hi');
  const mistralParams = mistral.getChatInput();
  assert.strictEqual(mistralParams.model, config.url.mistral.models.chat);
  assert.strictEqual(mistralParams.max_tokens, 20);
  assert.strictEqual(mistralParams.temperature, undefined);
  assert.strictEqual(new MistralInput('sys', { temperature: 0 }).getChatInput().temperature, 0);

  const cohere = new CohereInput('sys', { web: true, maxTokens: 30 });
  cohere.addUserMessage('Hi');
  const originalWarn = console.warn;
  console.warn = () => {};
  const cohereParams = cohere.getChatInput();
  console.warn = originalWarn;
  assert.strictEqual(cohereParams.model, config.url.cohere.models.chat);
  assert.strictEqual(cohereParams.connectors, undefined, 'Cohere removed connectors');
  assert.strictEqual(cohereParams.max_tokens, 30);
  assert.strictEqual(cohereParams.message, 'Hi');

  const gemini = new GeminiInput(null, { maxTokens: 100, temperature: 0 });
  gemini.addUserMessage('Hi');
  const geminiParams = gemini.getChatInput();
  assert.strictEqual(gemini.model, config.url.gemini.models.chat);
  assert.strictEqual(new GeminiInput(null, { model: 'gemini' }).model, config.url.gemini.models.chat);
  assert.strictEqual(new GeminiInput(null, { model: 'gemini-3.5-flash' }).model, 'gemini-3.5-flash');
  assert.strictEqual(geminiParams.model, undefined, 'the model belongs to the URL, not the body');
  assert.deepStrictEqual(geminiParams.generationConfig, { temperature: 0, maxOutputTokens: 100 });

  const nvidia = new NvidiaInput('sys', { temperature: 0 }).getChatInput();
  assert.strictEqual(nvidia.model, config.nvidia.models.chat);
  assert.strictEqual(nvidia.temperature, 0);
}

function testChatModelInput() {
  testOpenAIResponsesInput();
  testOpenAIChatCompletionsInput();
  testAnthropicInput();
  testOtherProviderInputs();
}

module.exports = testChatModelInput;
