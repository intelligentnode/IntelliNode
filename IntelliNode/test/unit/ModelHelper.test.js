const assert = require('assert');
const ModelHelper = require('../../utils/ModelHelper');

function testModelHelper() {
  // OpenAI routing
  assert.strictEqual(ModelHelper.isReasoningModel('gpt-5.5'), true);
  assert.strictEqual(ModelHelper.isReasoningModel('gpt-6-astra'), true);
  assert.strictEqual(ModelHelper.isReasoningModel('gpt-4.1'), false);
  // same routing as before for deployment names that contain gpt-5
  assert.strictEqual(ModelHelper.isReasoningModel('prod-gpt-5-deployment'), true);
  assert.strictEqual(ModelHelper.isReasoningModel('chatgpt-4o-latest'), false);
  assert.strictEqual(ModelHelper.isReasoningModel('gpt-5.5:chat'), false);
  assert.strictEqual(ModelHelper.isReasoningChatModel('o4-mini'), true);
  assert.strictEqual(ModelHelper.isReasoningChatModel('gpt-5.5:chat'), true);
  assert.strictEqual(ModelHelper.isReasoningChatModel('gpt-4o'), false);
  assert.strictEqual(ModelHelper.stripRouteOverride('gpt-5.5:chat'), 'gpt-5.5');
  assert.strictEqual(ModelHelper.stripRouteOverride('gpt-4o'), 'gpt-4o');
  assert.strictEqual(ModelHelper.defaultReasoningEffort('gpt-5.5-pro'), 'medium');
  assert.strictEqual(ModelHelper.defaultReasoningEffort('gpt-5.5'), 'low');

  // Claude sampling parameters (verified against the API)
  for (const model of ['claude-sonnet-5', 'claude-opus-5', 'claude-fable-5-1', 'claude-opus-4-8', 'claude-opus-4-7']) {
    assert.strictEqual(ModelHelper.claudeRejectsSamplingParams(model), true, model);
  }
  for (const model of ['claude-sonnet-4-6', 'claude-opus-4-6', 'claude-haiku-4-5-20251001', 'claude-opus-4-20250514', 'claude-3-7-sonnet-20250219']) {
    assert.strictEqual(ModelHelper.claudeRejectsSamplingParams(model), false, model);
  }

  // tool format conversion
  const chatTool = { type: 'function', function: { name: 'get_weather', description: 'Weather', parameters: { type: 'object' } } };
  const flatTool = { type: 'function', name: 'get_weather', description: 'Weather', parameters: { type: 'object' } };
  assert.deepStrictEqual(ModelHelper.toResponsesTools([chatTool]), [flatTool]);
  assert.deepStrictEqual(ModelHelper.toChatTools([flatTool]), [chatTool]);
  assert.deepStrictEqual(ModelHelper.toAnthropicTools([chatTool]), [{ name: 'get_weather', description: 'Weather', input_schema: { type: 'object' } }]);
  assert.deepStrictEqual(ModelHelper.toResponsesToolChoice({ type: 'function', function: { name: 'x' } }), { type: 'function', name: 'x' });
  assert.deepStrictEqual(ModelHelper.toChatToolChoice({ type: 'function', name: 'x' }), { type: 'function', function: { name: 'x' } });
  assert.deepStrictEqual(ModelHelper.toAnthropicToolChoice('required'), { type: 'any' });
  assert.deepStrictEqual(ModelHelper.toAnthropicToolChoice({ type: 'function', function: { name: 'x' } }), { type: 'tool', name: 'x' });
  assert.deepStrictEqual(ModelHelper.functionCallToToolChoice({ name: 'x' }), { type: 'function', function: { name: 'x' } });
}

module.exports = testModelHelper;
