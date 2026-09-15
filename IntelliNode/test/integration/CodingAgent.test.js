// Live end-to-end run: the agent fixes a real bug until the tests pass.
// CODING_AGENT_PROVIDER / CODING_AGENT_MODEL pick the provider (default openai); `node test/integration/CodingAgent.test.js anthropic`.
require('dotenv').config();
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { CodingAgent } = require('../../function/CodingAgent');

const provider = process.argv[2] || process.env.CODING_AGENT_PROVIDER || 'openai';
const model = process.argv[3] || process.env.CODING_AGENT_MODEL || null;
const keys = { openai: 'OPENAI_API_KEY', anthropic: 'ANTHROPIC_API_KEY', gemini: 'GEMINI_API_KEY', mistral: 'MISTRAL_API_KEY', cohere: 'COHERE_API_KEY', nvidia: 'NVIDIA_API_KEY' };
const apiKey = keys[provider] ? process.env[keys[provider]] : null;

(async () => {
  if (keys[provider] && !apiKey) {
    console.log(`No API key for provider ${provider}; skipping.`);
    return;
  }
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'intellinode-coder-live-'));
  fs.writeFileSync(path.join(workspace, 'calc.js'), "function add(a, b) {\n  return a - b;\n}\nmodule.exports = { add };\n");
  fs.writeFileSync(path.join(workspace, 'test_calc.js'), "const assert = require('assert');\nconst { add } = require('./calc');\nassert.strictEqual(add(2, 3), 5);\nconsole.log('ok');\n");
  try {
    console.log(`---- live coding agent (${provider}${model ? ` ${model}` : ''}) ----`);
    const agent = new CodingAgent({ apiKey, provider, model, workspace, maxIterations: 12, log: true });
    const result = await agent.run('The test in test_calc.js fails. Find and fix the bug in calc.js.', { testCommand: 'node test_calc.js' });
    console.log('result:', result.success, '| iterations:', result.iterations, '| summary:', result.summary);
    assert.strictEqual(result.success, true, `Agent did not get the tests green: ${JSON.stringify(result)}`);
    assert.match(fs.readFileSync(path.join(workspace, 'calc.js'), 'utf8'), /a \+ b/);
    console.log('CodingAgent live test passed.');
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
