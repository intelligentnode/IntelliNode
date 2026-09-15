const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { CodingAgent } = require('../../function/CodingAgent');
const WorkspaceToolkit = require('../../utils/WorkspaceToolkit');

// A chatFn that plays back canned replies in order (the last one repeats).
function scriptedChat(replies) {
  let index = 0;
  return async () => {
    const reply = replies[Math.min(index, replies.length - 1)];
    index += 1;
    return reply;
  };
}

function makeWorkspace() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'intellinode-coder-'));
  fs.writeFileSync(path.join(dir, 'calc.js'), "function add(a, b) {\n  return a - b;\n}\nmodule.exports = { add };\n");
  fs.writeFileSync(path.join(dir, 'test_calc.js'), "const assert = require('assert');\nconst { add } = require('./calc');\nassert.strictEqual(add(2, 3), 5);\nconsole.log('ok');\n");
  return dir;
}

const TEST_COMMAND = 'node test_calc.js';

async function testWorkspaceToolkit() {
  const dir = makeWorkspace();
  try {
    const tools = new WorkspaceToolkit(dir);
    assert.deepStrictEqual(tools.listFiles().split('\n'), ['calc.js', 'test_calc.js']);
    assert.match(tools.readFile('calc.js'), /return a - b/);
    assert.strictEqual(tools.editFile('calc.js', 'return a - b', 'return a + b'), 'Edited calc.js');
    assert.match(tools.editFile('calc.js', 'not there', 'x'), /not found/);
    assert.match(tools.writeFile('lib/util.js', 'x\nx\n'), /Wrote 4 chars/);
    assert.match(tools.editFile('lib/util.js', 'x', 'y'), /appears 2 times/);
    assert.strictEqual(tools.search('add\\('), 'calc.js:1: function add(a, b) {\ntest_calc.js:3: assert.strictEqual(add(2, 3), 5);');
    assert.match(tools.search('['), /invalid regex/);
    assert.match(tools.runBash(TEST_COMMAND), /^\[exit code 0\]\nok/);
    assert.match(tools.runBash('node -e "process.exit(3)"'), /^\[exit code 3\]/);
    // the toolkit never leaves the workspace
    assert.match(tools.execute('read_file', { path: '../../etc/passwd' }), /escapes the workspace/);
    assert.match(tools.execute('write_file', { path: '/tmp/outside.txt', content: 'x' }), /escapes the workspace/);
    assert.match(tools.execute('read_file', {}), /missing required argument 'path'/);
    assert.match(tools.execute('nope', {}), /unknown tool/);
    assert.strictEqual(new WorkspaceToolkit(dir, { allowBash: false }).runBash('ls'), 'Error: bash execution is disabled for this agent');
    assert.match(new WorkspaceToolkit(dir, { bashTimeout: 200 }).runBash('sleep 5'), /timed out/);
    assert.throws(() => new WorkspaceToolkit(path.join(dir, 'missing')), /does not exist/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function testLoopEditsUntilTestsGreen() {
  const dir = makeWorkspace();
  try {
    const actions = [];
    const agent = new CodingAgent({
      workspace: dir,
      chatFn: scriptedChat([
        '{"thought": "inspect", "tool": "read_file", "args": {"path": "calc.js"}}',
        '{"thought": "fix", "tool": "edit_file", "args": {"path": "calc.js", "old_text": "return a - b", "new_text": "return a + b"}}',
        '{"thought": "done", "tool": "finish", "args": {"summary": "fixed"}}',
      ]),
      onAction: (action) => actions.push(action.tool),
    });
    const result = await agent.run('fix add', { testCommand: TEST_COMMAND });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.iterations, 3);
    assert.strictEqual(result.summary, 'fixed');
    assert.match(result.testOutput, /\[exit code 0\]/);
    assert.deepStrictEqual(actions, ['read_file', 'edit_file', 'finish']);
    assert.match(fs.readFileSync(path.join(dir, 'calc.js'), 'utf8'), /a \+ b/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function testFinishRejectedWhileTestsFail() {
  const dir = makeWorkspace();
  try {
    const seen = [];
    const replies = [
      '{"tool": "finish", "args": {"summary": "premature"}}',
      '{"tool": "edit_file", "args": {"path": "calc.js", "old_text": "return a - b", "new_text": "return a + b"}}',
      '{"tool": "finish", "args": {"summary": "actually fixed"}}',
    ];
    const scripted = scriptedChat(replies);
    const agent = new CodingAgent({ workspace: dir, chatFn: async (system, history) => { seen.push(history[history.length - 1].content); return scripted(); } });
    const result = await agent.run('fix add', { testCommand: TEST_COMMAND });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.summary, 'actually fixed');
    assert.match(seen[1], /Tests are still failing/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function testInvalidJsonGetsCorrectiveMessage() {
  const dir = makeWorkspace();
  try {
    const agent = new CodingAgent({ workspace: dir, chatFn: scriptedChat(['I will now fix the bug (no json)', '{"tool": "finish", "args": {"summary": "ok"}}']) });
    const result = await agent.run('say done');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.iterations, 2);
    assert.strictEqual(result.testOutput, null);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function testMaxIterationsCap() {
  const dir = makeWorkspace();
  try {
    const agent = new CodingAgent({ workspace: dir, chatFn: scriptedChat(['{"tool": "list_files", "args": {}}']), maxIterations: 3 });
    const result = await agent.run('loop forever', { testCommand: TEST_COMMAND });
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.iterations, 3);
    assert.match(result.testOutput, /\[exit code 1\]/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function testActionExtraction() {
  const extract = CodingAgent.extractAction;
  assert.strictEqual(extract('{"tool": "bash", "args": {}}').tool, 'bash');
  assert.strictEqual(extract('prose ```json\n{"tool": "search", "args": {"pattern": "x"}}\n``` more').tool, 'search');
  // several objects: the tool-bearing one wins
  assert.strictEqual(extract('{"note": 1} and {"tool": "read_file", "args": {"path": "a"}}').tool, 'read_file');
  // literal newlines inside strings must not break parsing
  assert.strictEqual(extract('{"tool": "write_file", "args": {"path": "a.py", "content": "l1\nl2"}}').args.content, 'l1\nl2');
  // unbalanced braces inside file content must not corrupt extraction
  assert.strictEqual(extract('{"tool": "write_file", "args": {"path": "a.js", "content": "function f() {\n"}}').args.content, 'function f() {\n');
  assert.strictEqual(extract('{"tool": "write_file", "args": {"path": "a.js", "content": "}"}}').args.content, '}');
  // a prose example before the real action: the last tool object wins
  assert.strictEqual(extract('Example: {"tool": "bash", "args": {"command": "ls"}}. Now: {"tool": "read_file", "args": {"path": "x"}}').tool, 'read_file');
  assert.strictEqual(extract('no json at all'), null);
  assert.strictEqual(extract(''), null);
}

async function testDefaultChatFnUsesTheChatbot() {
  // the default chat function builds a provider input from the history and reads the first reply
  const FetchClient = require('../../utils/FetchClient');
  const original = FetchClient.prototype.post;
  const bodies = [];
  FetchClient.prototype.post = async function (endpoint, data) {
    bodies.push(data);
    return { content: [{ type: 'text', text: '{"tool": "finish", "args": {"summary": "nothing to do"}}' }], stop_reason: 'end_turn' };
  };
  const dir = makeWorkspace();
  try {
    const agent = new CodingAgent({ apiKey: 'k', provider: 'anthropic', model: 'claude-sonnet-5', workspace: dir, allowBash: false });
    const result = await agent.run('review the code');
    assert.strictEqual(result.summary, 'nothing to do');
    assert.strictEqual(bodies[0].model, 'claude-sonnet-5');
    assert.match(bodies[0].system, /autonomous coding agent/);
    assert.match(bodies[0].messages[0].content, /Task: review the code[\s\S]*calc\.js/);
  } finally {
    FetchClient.prototype.post = original;
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

module.exports = async function testCodingAgent() {
  await testWorkspaceToolkit();
  await testLoopEditsUntilTestsGreen();
  await testFinishRejectedWhileTestsFail();
  await testInvalidJsonGetsCorrectiveMessage();
  await testMaxIterationsCap();
  testActionExtraction();
  await testDefaultChatFnUsesTheChatbot();
  console.log('CodingAgent tests passed.');
};

if (require.main === module) {
  module.exports().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
