// The coding agent fixes a bug in a small workspace until its test passes (any provider).
const { CodingAgent } = require('intellinode');
const fs = require('fs');
const os = require('os');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

(async () => {
  // a throwaway repository with a failing test
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'coder-sample-'));
  fs.writeFileSync(path.join(workspace, 'calc.js'), "function add(a, b) {\n  return a - b;\n}\nmodule.exports = { add };\n");
  fs.writeFileSync(path.join(workspace, 'test_calc.js'), "const assert = require('assert');\nconst { add } = require('./calc');\nassert.strictEqual(add(2, 3), 5);\nconsole.log('ok');\n");

  const agent = new CodingAgent({
    apiKey: process.env.OPENAI_API_KEY,
    provider: 'openai',                      // or 'anthropic', 'gemini', 'mistral', 'ollama' (with model), ...
    workspace,
    maxIterations: 12,
    onAction: ({ iteration, tool, args }) => console.log(`#${iteration} ${tool}`, tool === 'write_file' ? args.path : JSON.stringify(args)),
  });

  const result = await agent.run('The test in test_calc.js fails. Find and fix the bug in calc.js.', { testCommand: 'node test_calc.js' });
  console.log('\nsuccess:', result.success, '| iterations:', result.iterations);
  console.log('summary:', result.summary);
  console.log('fixed file:\n' + fs.readFileSync(path.join(workspace, 'calc.js'), 'utf8'));
  fs.rmSync(workspace, { recursive: true, force: true });
})();
