const assert = require('assert');
const http = require('http');
const Module = require('module');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { PassThrough, Readable } = require('stream');
const MCPClient = require('../../utils/MCPClient');
const { MCPServer, normalizeToolResult } = require('../../mcp/server');
const rpc = require('../../mcp/jsonrpc');
const { createTools, resolveProvider, PROVIDERS, IMAGE_PROVIDERS } = require('../../mcp/tools');

const BIN = path.join(__dirname, '..', '..', 'bin', 'intellinode.js');
const MODERN = '2026-07-28';
const META = {
  'io.modelcontextprotocol/protocolVersion': MODERN,
  'io.modelcontextprotocol/clientInfo': { name: 'unit-test', version: '0.0.0' },
  'io.modelcontextprotocol/clientCapabilities': {},
};

// Every provider variable the tools read, blanked: keys and models from the developer's shell must not change
// what the tests see (the stdio server inherits this environment).
function blankProviderEnv(overrides = {}) {
  const env = {};
  for (const provider of [...PROVIDERS, ...IMAGE_PROVIDERS]) {
    if (provider.key) env[provider.key] = '';
    if (provider.modelEnv) env[provider.modelEnv] = '';
  }
  return { ...env, ...overrides };
}

// one fake key so the provider tools resolve offline
const KEYS = blankProviderEnv({ OPENAI_API_KEY: 'sk-test' });
const TOOL_COUNT = createTools(KEYS).length;

// a stdio server that answers every handshake with an error, to check the client cleans up after a failed connect
const FAILING_SERVER = `
require('readline').createInterface({ input: process.stdin, terminal: false }).on('line', (line) => {
  const message = JSON.parse(line);
  if (message.id === undefined) return;
  const error = message.method === 'server/discover'
    ? { code: -32601, message: 'Method not found' }
    : { code: -32603, message: 'init boom' };
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: message.id, error }) + '\\n');
});`;

function modernHeaders(method, name) {
  return {
    Accept: 'application/json, text/event-stream',
    'Content-Type': 'application/json',
    'MCP-Protocol-Version': MODERN,
    'Mcp-Method': method,
    ...(name !== undefined && { 'Mcp-Name': name }),
  };
}

function modernRequest(id, method, params = {}) {
  return { jsonrpc: '2.0', id, method, params: { ...params, _meta: META } };
}

async function waitFor(check, timeout = 3000) {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeout) return false;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  return true;
}

// Raw HTTP helper so the server tests do not depend on the client under test.
// chunked sends the body in two writes without a Content-Length, as a streaming upload.
function send(url, { method = 'POST', headers = {}, body, chunked = false } = {}) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const payload = body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body));
    const request = http.request({
      host: target.hostname, port: target.port, path: target.pathname, method,
      headers: { ...headers, ...(payload !== undefined && !chunked && { 'Content-Length': Buffer.byteLength(payload) }) },
    }, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        let json = null;
        try {
          json = text ? JSON.parse(text) : null;
        } catch (error) {
          json = null;
        }
        resolve({ status: response.statusCode, headers: response.headers, text, json });
      });
    });
    request.on('error', reject);
    if (payload !== undefined) {
      if (chunked) {
        const half = Math.floor(payload.length / 2);
        request.write(payload.slice(0, half));
        request.write(payload.slice(half));
      } else {
        request.write(payload);
      }
    }
    request.end();
  });
}

// (a) the CLI over stdio through the client: modern era, pagination, tools/call
async function testStdioCli() {
  const client = new MCPClient({
    command: process.execPath,
    args: [BIN, 'mcp'],
    cwd: os.tmpdir(),
    env: { ...KEYS, INTELLINODE_MCP_PAGE_SIZE: '6' },
  });
  const info = await client.connect();
  assert.strictEqual(client.era, 'modern');
  assert.strictEqual(info.protocolVersion, MODERN);
  assert.strictEqual(info.serverInfo.name, 'intellinode');
  assert.deepStrictEqual(info.capabilities, { tools: {} });
  assert.ok(info.instructions.includes('list_providers'));

  // connect() fetches the tool list, following every cursor; listTools() is the sync cached list (2.x contract)
  const cached = client.listTools();
  assert.ok(Array.isArray(cached), 'listTools() is synchronous');
  assert.strictEqual(cached.length, TOOL_COUNT, 'connect() follows every cursor');
  assert.strictEqual(new Set(cached.map((tool) => tool.name)).size, TOOL_COUNT);

  const firstPage = await client._request('tools/list', {});
  assert.strictEqual(firstPage.resultType, 'complete');
  assert.strictEqual(firstPage.tools.length, 6);
  assert.ok(firstPage.nextCursor, 'the page size env var makes the server paginate');

  const tools = await client.fetchTools();
  assert.strictEqual(tools.length, TOOL_COUNT, 'fetchTools follows every cursor');
  assert.strictEqual(client.tools, tools, 'and refreshes the cache');
  assert.strictEqual((await client.getTools()).length, TOOL_COUNT, 'getTools() fetches, as in 2.x');
  assert.ok(client.hasTool('ask_model') && client.hasTool('list_providers') && client.hasTool('generate_image'));
  for (const tool of tools) {
    assert.ok(tool.description.length > 40, `${tool.name} has a description`);
    assert.strictEqual(tool.inputSchema.type, 'object');
  }

  const chatTools = client.toChatTools();
  assert.strictEqual(chatTools.length, TOOL_COUNT);
  assert.strictEqual(chatTools[0].type, 'function');
  assert.deepStrictEqual(chatTools[0].function.parameters, client.getTool('ask_model').inputSchema);

  const providers = await client.callTool('list_providers');
  assert.strictEqual(providers.isError, false);
  assert.strictEqual(providers.structuredContent.default, 'openai');
  assert.deepStrictEqual(providers.structuredContent.configured.map((entry) => entry.provider), ['openai']);
  assert.ok(providers.text.includes('openai'));

  // a missing key is a tool execution error the model can act on, not a protocol error
  const missing = await client.callTool('ask_model', { prompt: 'hi', provider: 'gemini' });
  assert.strictEqual(missing.isError, true);
  assert.ok(missing.text.includes('GEMINI_API_KEY'));
  const invalid = await client.callTool('ask_model', { provider: 'openai' });
  assert.strictEqual(invalid.isError, true);
  assert.ok(invalid.text.includes("'prompt'"));
  await assert.rejects(client.callTool('no_such_tool', {}), (error) => error.code === rpc.ERROR_CODES.INVALID_PARAMS);

  await client.close();
  assert.strictEqual(client.process, null);
  assert.strictEqual(client.era, null);

  // a command that cannot start fails fast with a clear error instead of hanging
  const broken = new MCPClient({ command: path.join(os.tmpdir(), 'intellinode-no-such-binary'), args: [] });
  await assert.rejects(broken.connect(), /Failed to start|exited/);
  assert.strictEqual(broken.process, null);
  await broken.close();

  // a handshake that fails leaves no running process behind (it would keep the parent event loop alive)
  const failing = new MCPClient({ command: process.execPath, args: ['-e', FAILING_SERVER] });
  const connecting = failing.connect();
  const child = failing.process;
  assert.ok(child, 'the process is spawned synchronously');
  await assert.rejects(connecting, /init boom/);
  assert.strictEqual(failing.process, null, 'the failed connect stopped the process');
  assert.ok(child.exitCode !== null || child.signalCode !== null, 'the server process has exited');
  await failing.close();
}

// (a2) stdin EOF must not cut a response short: tools/list is far larger than a pipe buffer
async function testStdioEofFlush() {
  const child = spawn(process.execPath, [BIN, 'mcp'], {
    cwd: os.tmpdir(),
    env: { ...process.env, ...KEYS },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const chunks = [];
  child.stdout.pause(); // a busy client that only starts reading after it closed stdin
  const exited = new Promise((resolve) => child.on('close', resolve));
  child.stdin.end(`${[1, 2, 3].map((id) => JSON.stringify(modernRequest(id, 'tools/list'))).join('\n')}\n`);
  setTimeout(() => {
    child.stdout.on('data', (chunk) => chunks.push(chunk));
    child.stdout.resume();
  }, 300);

  const code = await exited;
  const lines = Buffer.concat(chunks).toString('utf8').split('\n').filter(Boolean);
  assert.strictEqual(code, 0, 'the CLI exits 0 on stdin EOF');
  assert.strictEqual(lines.length, 3, 'every queued response was written');
  for (const line of lines) {
    assert.strictEqual(JSON.parse(line).result.tools.length, TOOL_COUNT, 'and none of them was truncated');
  }
}

// (b) the server class driven directly with the legacy handshake
async function testLegacyServer() {
  const server = new MCPServer({
    name: 'unit',
    version: '9.9.9',
    tools: [
      { name: 'echo', description: 'echo text', inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] }, handler: async ({ text }) => text },
      { name: 'data', description: 'object result', inputSchema: { type: 'object' }, handler: async () => ({ answer: 42 }) },
      { name: 'blocks', description: 'block array', inputSchema: { type: 'object' }, handler: async () => [{ type: 'text', text: 'a' }, { type: 'image', data: 'AA==', mimeType: 'image/png' }] },
      { name: 'boom', description: 'throws', inputSchema: { type: 'object' }, handler: async () => { throw new Error('kaboom'); } },
    ],
  });

  const context = { transport: 'http', headers: {} };
  const init = await server.handle({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'x', version: '1' } } }, context);
  assert.strictEqual(init.result.protocolVersion, '2025-06-18', 'a supported legacy version is echoed');
  assert.deepStrictEqual(init.result.capabilities, { tools: { listChanged: false } });
  assert.deepStrictEqual(init.result.serverInfo, { name: 'unit', version: '9.9.9' });
  assert.strictEqual(init.result.resultType, undefined, 'legacy results carry no resultType');
  assert.match(context.sessionId, /^[0-9a-f]{32}$/, 'a session is minted for legacy HTTP');
  assert.strictEqual(context.era, 'legacy');

  const headers = { 'Mcp-Session-Id': context.sessionId, 'MCP-Protocol-Version': '2025-06-18' };
  assert.strictEqual(await server.handle({ jsonrpc: '2.0', method: 'notifications/initialized' }, { transport: 'http', headers }), null);
  assert.strictEqual(server.sessions.get(context.sessionId).initialized, true);

  const list = await server.handle({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }, { transport: 'http', headers });
  assert.deepStrictEqual(list.result.tools.map((tool) => tool.name), ['echo', 'data', 'blocks', 'boom']);
  assert.ok(list.result.tools.every((tool) => tool.handler === undefined), 'handlers are not serialised');
  assert.strictEqual(list.result.resultType, undefined);

  const call = await server.handle({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'echo', arguments: { text: 'hi' } } }, { transport: 'http', headers });
  assert.deepStrictEqual(call.result, { content: [{ type: 'text', text: 'hi' }] });
  const data = await server.handle({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'data', arguments: {} } }, { transport: 'http', headers });
  assert.deepStrictEqual(data.result.structuredContent, { answer: 42 });
  assert.deepStrictEqual(JSON.parse(data.result.content[0].text), { answer: 42 });
  const blocks = await server.handle({ jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'blocks', arguments: {} } }, { transport: 'http', headers });
  assert.strictEqual(blocks.result.content.length, 2);
  assert.strictEqual(blocks.result.content[1].type, 'image');
  const boom = await server.handle({ jsonrpc: '2.0', id: 6, method: 'tools/call', params: { name: 'boom', arguments: {} } }, { transport: 'http', headers });
  assert.deepStrictEqual(boom.result, { content: [{ type: 'text', text: 'kaboom' }], isError: true });
  const wrongType = await server.handle({ jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'echo', arguments: { text: 5 } } }, { transport: 'http', headers });
  assert.strictEqual(wrongType.result.isError, true);
  const unknown = await server.handle({ jsonrpc: '2.0', id: 8, method: 'tools/call', params: { name: 'nope' } }, { transport: 'http', headers });
  assert.strictEqual(unknown.error.code, rpc.ERROR_CODES.INVALID_PARAMS);
  const ping = await server.handle({ jsonrpc: '2.0', id: 9, method: 'ping' }, { transport: 'http', headers });
  assert.deepStrictEqual(ping.result, {});
  const lost = await server.handle({ jsonrpc: '2.0', id: 10, method: 'tools/list', params: {} }, { transport: 'http', headers: { 'mcp-session-id': 'expired' } });
  assert.strictEqual(lost.error.code, rpc.ERROR_CODES.SESSION_NOT_FOUND);

  // legacy versions the server does not know are answered with its latest legacy version
  const old = await server.handle({ jsonrpc: '2.0', id: 11, method: 'initialize', params: { protocolVersion: '2024-11-05' } }, { transport: 'stdio' });
  assert.strictEqual(old.result.protocolVersion, '2025-11-25');
  assert.strictEqual(server.stdioSession.protocolVersion, '2025-11-25');

  // the same process still serves modern requests statelessly
  const discover = await server.handle(modernRequest(12, 'server/discover'), { transport: 'stdio' });
  assert.strictEqual(discover.result.resultType, 'complete');
  assert.deepStrictEqual(discover.result.supportedVersions, [MODERN]);
  assert.deepStrictEqual(discover.result._meta['io.modelcontextprotocol/serverInfo'], { name: 'unit', version: '9.9.9' });
  const unsupported = await server.handle({ jsonrpc: '2.0', id: 13, method: 'tools/list', params: { _meta: { ...META, 'io.modelcontextprotocol/protocolVersion': '2030-01-01' } } }, { transport: 'stdio' });
  assert.strictEqual(unsupported.error.code, rpc.ERROR_CODES.UNSUPPORTED_PROTOCOL_VERSION);
  assert.deepStrictEqual(unsupported.error.data, { supported: [MODERN], requested: '2030-01-01' });
  const missingMethod = await server.handle(modernRequest(14, 'resources/list'), { transport: 'stdio' });
  assert.strictEqual(missingMethod.error.code, rpc.ERROR_CODES.METHOD_NOT_FOUND);
  assert.strictEqual(await server.handle({ jsonrpc: '2.0', method: 'notifications/cancelled', params: { requestId: 1 } }, { transport: 'stdio' }), null);
  const invalid = await server.handle({ hello: 'world' }, { transport: 'stdio' });
  assert.strictEqual(invalid.error.code, rpc.ERROR_CODES.INVALID_REQUEST);

  // MCP forbids null request ids: a method with id null is an invalid request, never a notification
  const nullId = await server.handle({ jsonrpc: '2.0', id: null, method: 'ping', params: { _meta: META } }, { transport: 'stdio' });
  assert.strictEqual(nullId.error.code, rpc.ERROR_CODES.INVALID_REQUEST);
  assert.strictEqual(nullId.id, null);

  assert.deepStrictEqual(normalizeToolResult('x'), { content: [{ type: 'text', text: 'x' }] });
  assert.deepStrictEqual(normalizeToolResult({ type: 'image', data: 'AA==', mimeType: 'image/png' }), { content: [{ type: 'image', data: 'AA==', mimeType: 'image/png' }] });
  assert.deepStrictEqual(normalizeToolResult({ content: [{ type: 'text', text: 'a' }], structuredContent: { b: 1 }, isError: true }), { content: [{ type: 'text', text: 'a' }], structuredContent: { b: 1 }, isError: true });
}

// (b2) a result JSON cannot represent must not kill the stdio process
async function testStdioServerRobustness() {
  const server = new MCPServer({
    name: 'unit',
    version: '1.0.0',
    tools: [
      { name: 'bigint', description: 'BigInt result', handler: async () => ({ content: [{ type: 'text', text: 'ok' }], structuredContent: { total: 10n } }) },
      { name: 'circular', description: 'circular result', handler: async () => { const result = { content: [{ type: 'text', text: 'ok' }] }; result.structuredContent = result; return result; } },
    ],
  });
  const input = new PassThrough();
  const output = new PassThrough();
  let text = '';
  output.on('data', (chunk) => { text += chunk; });
  server.startStdio({ input, output, exitOnClose: false });

  const messages = [
    modernRequest(1, 'tools/call', { name: 'bigint', arguments: {} }),
    modernRequest(2, 'tools/call', { name: 'circular', arguments: {} }),
    { jsonrpc: '2.0', id: null, method: 'ping', params: { _meta: META } },
    modernRequest(3, 'ping'),
  ];
  input.write(`${messages.map((message) => JSON.stringify(message)).join('\n')}\n`);
  assert.ok(await waitFor(() => text.split('\n').filter(Boolean).length === 4), `four responses on stdout, got: ${text}`);

  const responses = text.split('\n').filter(Boolean).map((line) => JSON.parse(line));
  const byId = (id) => responses.find((response) => response.id === id);
  assert.strictEqual(byId(1).error.code, rpc.ERROR_CODES.INTERNAL_ERROR, 'a BigInt result becomes an internal error');
  assert.ok(byId(1).error.message.includes('BigInt'));
  assert.strictEqual(byId(2).error.code, rpc.ERROR_CODES.INTERNAL_ERROR, 'and so does a circular structure');
  assert.strictEqual(byId(null).error.code, rpc.ERROR_CODES.INVALID_REQUEST, 'id null is answered, not swallowed');
  assert.deepStrictEqual(byId(3).result, { resultType: 'complete' }, 'later requests are still served');
  await server.stop();
}

// (c) the Streamable HTTP transport: header validation, status codes, the client, and legacy fallback
async function testHttpServer() {
  const server = new MCPServer({ name: 'intellinode', version: '3.0.0', tools: createTools(KEYS), pageSize: 4 });
  const httpServer = await server.startHttp({ port: 0 });
  const url = `http://127.0.0.1:${httpServer.address().port}/mcp`;

  try {
    const discover = await send(url, { headers: modernHeaders('server/discover'), body: modernRequest(1, 'server/discover') });
    assert.strictEqual(discover.status, 200);
    assert.ok(discover.headers['content-type'].includes('application/json'));
    assert.strictEqual(discover.json.result.resultType, 'complete');
    assert.deepStrictEqual(discover.json.result.supportedVersions, [MODERN]);
    assert.strictEqual(discover.headers['mcp-session-id'], undefined, 'modern requests never mint sessions');

    const call = { method: 'tools/call', params: { name: 'list_providers', arguments: {} } };
    const good = await send(url, { headers: modernHeaders('tools/call', 'list_providers'), body: modernRequest(2, call.method, call.params) });
    assert.strictEqual(good.status, 200);
    assert.strictEqual(good.json.result.resultType, 'complete');
    assert.strictEqual(good.json.result.structuredContent.default, 'openai');

    const encoded = await send(url, { headers: modernHeaders('tools/call', rpc.encodeHeaderValue(' list_providers')), body: modernRequest(3, call.method, { ...call.params, name: ' list_providers' }) });
    assert.strictEqual(encoded.status, 200, 'a Base64 sentinel Mcp-Name is decoded before comparison');
    assert.strictEqual(encoded.json.error.code, rpc.ERROR_CODES.INVALID_PARAMS, 'and then fails only because the tool does not exist');

    const noName = await send(url, { headers: modernHeaders('tools/call'), body: modernRequest(4, call.method, call.params) });
    assert.strictEqual(noName.status, 400);
    assert.strictEqual(noName.json.error.code, rpc.ERROR_CODES.HEADER_MISMATCH);
    const wrongName = await send(url, { headers: modernHeaders('tools/call', 'ask_model'), body: modernRequest(5, call.method, call.params) });
    assert.strictEqual(wrongName.status, 400);
    assert.strictEqual(wrongName.json.error.code, rpc.ERROR_CODES.HEADER_MISMATCH);
    assert.strictEqual(wrongName.json.id, 5);
    const wrongMethod = await send(url, { headers: modernHeaders('tools/list'), body: modernRequest(6, 'server/discover') });
    assert.strictEqual(wrongMethod.status, 400);
    assert.strictEqual(wrongMethod.json.error.code, rpc.ERROR_CODES.HEADER_MISMATCH);
    const { 'MCP-Protocol-Version': dropped, ...noVersion } = modernHeaders('server/discover');
    const missingVersion = await send(url, { headers: noVersion, body: modernRequest(7, 'server/discover') });
    assert.strictEqual(missingVersion.status, 400);
    assert.strictEqual(missingVersion.json.error.code, rpc.ERROR_CODES.HEADER_MISMATCH);

    const future = await send(url, {
      headers: { ...modernHeaders('server/discover'), 'MCP-Protocol-Version': '2030-01-01' },
      body: { jsonrpc: '2.0', id: 8, method: 'server/discover', params: { _meta: { ...META, 'io.modelcontextprotocol/protocolVersion': '2030-01-01' } } },
    });
    assert.strictEqual(future.status, 400);
    assert.strictEqual(future.json.error.code, rpc.ERROR_CODES.UNSUPPORTED_PROTOCOL_VERSION);
    assert.deepStrictEqual(future.json.error.data.supported, [MODERN]);
    assert.strictEqual(future.json.error.data.requested, '2030-01-01');

    const notification = await send(url, { headers: modernHeaders('notifications/cancelled'), body: { jsonrpc: '2.0', method: 'notifications/cancelled', params: { requestId: 1, _meta: META } } });
    assert.strictEqual(notification.status, 202);
    assert.strictEqual(notification.text, '');

    const get = await send(url, { method: 'GET', headers: { Accept: 'text/event-stream' } });
    assert.strictEqual(get.status, 405);
    const del = await send(url, { method: 'DELETE', headers: { 'Mcp-Session-Id': 'nope' } });
    assert.strictEqual(del.status, 405);
    const evil = await send(url, { headers: { ...modernHeaders('server/discover'), Origin: 'https://evil.example' }, body: modernRequest(9, 'server/discover') });
    assert.strictEqual(evil.status, 403);
    assert.strictEqual(evil.json.id, undefined, 'the 403 error carries no id');
    const local = await send(url, { headers: { ...modernHeaders('server/discover'), Origin: 'http://localhost:5173' }, body: modernRequest(10, 'server/discover') });
    assert.strictEqual(local.status, 200);
    assert.strictEqual(local.headers['access-control-allow-origin'], 'http://localhost:5173', 'localhost origins get CORS headers');
    const unknown = await send(url, { headers: modernHeaders('foo/bar'), body: modernRequest(11, 'foo/bar') });
    assert.strictEqual(unknown.status, 404);
    assert.strictEqual(unknown.json.error.code, rpc.ERROR_CODES.METHOD_NOT_FOUND);
    const badJson = await send(url, { headers: modernHeaders('server/discover'), body: '{not json' });
    assert.strictEqual(badJson.status, 400);
    assert.strictEqual(badJson.json.error.code, rpc.ERROR_CODES.PARSE_ERROR);
    const wrongPath = await send(url.replace('/mcp', '/other'), { headers: modernHeaders('server/discover'), body: modernRequest(12, 'server/discover') });
    assert.strictEqual(wrongPath.status, 404);
    assert.strictEqual(wrongPath.json.jsonrpc, undefined, 'a wrong path is not mistaken for a modern method-not-found');

    // legacy client over HTTP against the dual-era server
    const init = await send(url, { headers: { Accept: 'application/json, text/event-stream', 'Content-Type': 'application/json' }, body: { jsonrpc: '2.0', id: 13, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'legacy', version: '1' } } } });
    assert.strictEqual(init.status, 200);
    assert.strictEqual(init.json.result.protocolVersion, '2025-11-25');
    assert.match(init.headers['mcp-session-id'], /^[0-9a-f]{32}$/);
    const legacyHeaders = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'Mcp-Session-Id': init.headers['mcp-session-id'], 'MCP-Protocol-Version': '2025-11-25' };
    assert.strictEqual((await send(url, { headers: legacyHeaders, body: { jsonrpc: '2.0', method: 'notifications/initialized' } })).status, 202);
    const legacyList = await send(url, { headers: legacyHeaders, body: { jsonrpc: '2.0', id: 14, method: 'tools/list', params: {} } });
    assert.strictEqual(legacyList.status, 200);
    assert.strictEqual(legacyList.json.result.resultType, undefined);
    assert.strictEqual(legacyList.json.result.tools.length, 4);
    assert.ok(legacyList.json.result.nextCursor);

    // a legacy method-not-found stays on HTTP 200: 404 would tell the client its session died
    const legacyUnknown = await send(url, { headers: legacyHeaders, body: { jsonrpc: '2.0', id: 15, method: 'prompts/list', params: {} } });
    assert.strictEqual(legacyUnknown.status, 200);
    assert.strictEqual(legacyUnknown.json.error.code, rpc.ERROR_CODES.METHOD_NOT_FOUND);
    const stillThere = await send(url, { headers: legacyHeaders, body: { jsonrpc: '2.0', id: 16, method: 'tools/list', params: {} } });
    assert.strictEqual(stillThere.status, 200, 'the session survived the unknown method');

    const expired = await send(url, { headers: { ...legacyHeaders, 'Mcp-Session-Id': 'gone' }, body: { jsonrpc: '2.0', id: 17, method: 'tools/list', params: {} } });
    assert.strictEqual(expired.status, 404, 'a missing session is still 404');
    const ended = await send(url, { method: 'DELETE', headers: { 'Mcp-Session-Id': init.headers['mcp-session-id'] } });
    assert.strictEqual(ended.status, 204);

    // the client over Streamable HTTP
    const client = new MCPClient({ url, headers: { 'X-Test': '1' } });
    const info = await client.connect();
    assert.strictEqual(client.era, 'modern');
    assert.strictEqual(info.protocolVersion, MODERN);
    assert.strictEqual(info.serverInfo.name, 'intellinode');
    assert.strictEqual(client.listTools().length, TOOL_COUNT, 'connect() merged four pages');
    const tools = await client.fetchTools();
    assert.strictEqual(tools.length, TOOL_COUNT);
    const result = await client.callTool('list_providers');
    assert.strictEqual(result.structuredContent.default, 'openai');
    const image = await client.callTool('generate_image', { prompt: 'x', provider: 'stability' });
    assert.strictEqual(image.isError, true);
    assert.ok(image.text.includes('STABILITY_API_KEY'));
    await client.close();
  } finally {
    await server.stop();
  }

  await testLegacyFallback();
}

// (c2) body limit, unserializable results and CORS on the HTTP transport
async function testHttpEdgeCases() {
  const server = new MCPServer({
    name: 'edge',
    version: '1.0.0',
    tools: [{ name: 'bigint', description: 'BigInt result', handler: async () => ({ content: [{ type: 'text', text: 'ok' }], structuredContent: { total: 10n } }) }],
  });
  const httpServer = await server.startHttp({ port: 0, allowedOrigins: ['https://app.example.com'], maxBodyBytes: 1024 });
  const url = httpServer.url;

  try {
    const bigint = await send(url, { headers: modernHeaders('tools/call', 'bigint'), body: modernRequest(1, 'tools/call', { name: 'bigint', arguments: {} }) });
    assert.strictEqual(bigint.status, 200);
    assert.strictEqual(bigint.json.id, 1);
    assert.strictEqual(bigint.json.error.code, rpc.ERROR_CODES.INTERNAL_ERROR, 'the HTTP transport survives it too');

    const nullId = await send(url, { headers: modernHeaders('ping'), body: { jsonrpc: '2.0', id: null, method: 'ping', params: { _meta: META } } });
    assert.strictEqual(nullId.status, 400);
    assert.strictEqual(nullId.json.id, null);
    assert.strictEqual(nullId.json.error.code, rpc.ERROR_CODES.INVALID_REQUEST);

    // an oversized body is answered with a readable 413 instead of a reset socket, declared or chunked
    const oversized = modernRequest(2, 'ping', { pad: 'x'.repeat(64 * 1024) });
    for (const chunked of [false, true]) {
      const tooLarge = await send(url, { headers: modernHeaders('ping'), body: oversized, chunked });
      assert.strictEqual(tooLarge.status, 413, `413 for a ${chunked ? 'chunked' : 'declared'} body`);
      assert.strictEqual(tooLarge.json.error.code, rpc.ERROR_CODES.INVALID_REQUEST);
      assert.strictEqual(tooLarge.headers.connection, 'close');
    }
    const small = await send(url, { headers: modernHeaders('ping'), body: modernRequest(3, 'ping') });
    assert.strictEqual(small.status, 200, 'normal requests still work afterwards');

    // CORS: a browser needs the preflight and the response headers, not only the allow check
    const preflight = await send(url, {
      method: 'OPTIONS',
      headers: { Origin: 'https://app.example.com', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type, mcp-method, mcp-protocol-version' },
    });
    assert.strictEqual(preflight.status, 204);
    assert.strictEqual(preflight.headers['access-control-allow-origin'], 'https://app.example.com');
    assert.strictEqual(preflight.headers['access-control-allow-methods'], 'POST, DELETE');
    const allowedHeaders = preflight.headers['access-control-allow-headers'].toLowerCase().split(/,\s*/);
    for (const header of ['content-type', 'accept', 'mcp-protocol-version', 'mcp-method', 'mcp-name', 'mcp-session-id']) {
      assert.ok(allowedHeaders.includes(header), `the preflight allows ${header}`);
    }
    assert.strictEqual(preflight.headers['access-control-expose-headers'], 'Mcp-Session-Id');
    assert.strictEqual(preflight.headers.vary, 'Origin');

    const allowed = await send(url, { headers: { ...modernHeaders('ping'), Origin: 'https://app.example.com' }, body: modernRequest(4, 'ping') });
    assert.strictEqual(allowed.status, 200);
    assert.strictEqual(allowed.headers['access-control-allow-origin'], 'https://app.example.com');
    assert.strictEqual(allowed.headers['access-control-expose-headers'], 'Mcp-Session-Id');

    const deniedPreflight = await send(url, { method: 'OPTIONS', headers: { Origin: 'https://evil.example', 'Access-Control-Request-Method': 'POST' } });
    assert.strictEqual(deniedPreflight.status, 403, 'a foreign origin is still refused');
    assert.strictEqual(deniedPreflight.headers['access-control-allow-origin'], undefined);
    const plain = await send(url, { headers: modernHeaders('ping'), body: modernRequest(5, 'ping') });
    assert.strictEqual(plain.headers['access-control-allow-origin'], undefined, 'no CORS headers without an Origin');
  } finally {
    await server.stop();
  }
}

// (c3) an SSE response that stays open must be released once the reply arrived
async function testSseTeardown() {
  const closed = [];
  const results = {
    'server/discover': { supportedVersions: [MODERN], capabilities: { tools: {} }, _meta: { 'io.modelcontextprotocol/serverInfo': { name: 'sse', version: '1' } } },
    'tools/list': { tools: [{ name: 'echo', description: 'echo', inputSchema: { type: 'object' } }] },
    'tools/call': { content: [{ type: 'text', text: 'ok' }] },
  };
  const server = http.createServer((req, res) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const message = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      res.writeHead(200, { 'Content-Type': 'text/event-stream' });
      res.write(`data: ${JSON.stringify({ jsonrpc: '2.0', id: message.id, result: results[message.method] || {} })}\n\n`);
      // the reply is followed by keep-alives: the stream never ends on its own
      const keepAlive = setInterval(() => res.write(': keep-alive\n\n'), 20);
      res.on('close', () => {
        clearInterval(keepAlive);
        closed.push(message.method);
      });
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  const client = new MCPClient({ url: `http://127.0.0.1:${server.address().port}/mcp`, timeout: 1000 });
  try {
    await client.connect();
    assert.deepStrictEqual(client.getToolNames(), ['echo']);
    const echo = await client.callTool('echo', {});
    assert.strictEqual(echo.text, 'ok', 'the reply is read although the stream stays open');
    assert.ok(await waitFor(() => closed.length === 3), `every SSE connection was released, got ${closed.length}`);
    await client.close();
  } finally {
    if (typeof server.closeAllConnections === 'function') server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}

// A minimal 2025-11-25 Streamable HTTP server: rejects the modern probe like the SDK does, mints a session on
// initialize, answers with SSE frames and expects the session id and version header on later requests.
async function testLegacyFallback() {
  const seen = [];
  let generation = 1;
  const legacy = http.createServer((req, res) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf8');
      const message = text ? JSON.parse(text) : null;
      seen.push({ method: req.method, headers: req.headers, message });
      const sessionId = req.headers['mcp-session-id'];
      const sse = (payloads) => {
        res.writeHead(200, { 'Content-Type': 'text/event-stream' });
        res.end(payloads.map((payload, index) => `event: message\r\nid: ${index + 1}\r\ndata: ${JSON.stringify(payload)}\r\n\r\n`).join(''));
      };
      if (req.method === 'DELETE') {
        res.writeHead(sessionId ? 200 : 405);
        res.end();
        return;
      }
      if (!message || message.method === 'server/discover') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: 'Bad Request: Server not initialized' }, id: null }));
        return;
      }
      if (message.method === 'initialize') {
        res.setHeader('Mcp-Session-Id', `legacy-${generation}`);
        sse([{ jsonrpc: '2.0', id: message.id, result: { protocolVersion: '2025-11-25', capabilities: { tools: {} }, serverInfo: { name: 'fake-legacy', version: '0.1' } } }]);
        return;
      }
      if (sessionId !== `legacy-${generation}`) {
        res.writeHead(404);
        res.end();
        return;
      }
      if (message.id === undefined) {
        res.writeHead(202);
        res.end();
        return;
      }
      if (message.method === 'tools/list') {
        sse([
          { jsonrpc: '2.0', method: 'notifications/message', params: { level: 'info', data: 'listing' } },
          { jsonrpc: '2.0', id: message.id, result: { tools: [{ name: 'echo', description: 'echo', inputSchema: { type: 'object' } }] } },
        ]);
        return;
      }
      if (message.method === 'tools/call') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ jsonrpc: '2.0', id: message.id, result: { content: [{ type: 'text', text: `echo:${message.params.arguments.text}` }] } }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jsonrpc: '2.0', id: message.id, error: { code: -32601, message: 'Method not found' } }));
    });
  });
  await new Promise((resolve) => legacy.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${legacy.address().port}/mcp`;

  try {
    const notifications = [];
    const client = new MCPClient({ url, headers: { Authorization: 'Bearer token' }, onNotification: (message) => notifications.push(message.method) });
    const info = await client.connect();
    assert.strictEqual(client.era, 'legacy');
    assert.strictEqual(client.protocolVersion, '2025-11-25');
    assert.strictEqual(client.sessionId, 'legacy-1');
    assert.strictEqual(info.serverInfo.name, 'fake-legacy');
    assert.deepStrictEqual(seen.map((entry) => entry.message && entry.message.method), ['server/discover', 'initialize', 'notifications/initialized', 'tools/list'], 'connect() ends with the tool list');
    assert.strictEqual(seen[0].headers['mcp-protocol-version'], MODERN, 'the probe is a modern request');
    assert.strictEqual(seen[1].headers['mcp-protocol-version'], undefined, 'no version header before negotiation');
    assert.strictEqual(seen[2].headers['mcp-session-id'], 'legacy-1');
    assert.strictEqual(seen[2].headers['mcp-protocol-version'], '2025-11-25');
    assert.ok(seen.every((entry) => entry.headers.authorization === 'Bearer token'));

    // connect() filled the cache, so a chatbot can run tools right away
    assert.deepStrictEqual(client.listTools().map((tool) => tool.name), ['echo']);
    assert.deepStrictEqual(notifications, ['notifications/message'], 'SSE notifications before the response are surfaced');
    assert.deepStrictEqual((await client.getTools()).map((tool) => tool.name), ['echo']);
    const echo = await client.callTool('echo', { text: 'hi' });
    assert.strictEqual(echo.text, 'echo:hi');

    // the server dropped the session: a 404 makes the client re-initialize and retry once
    generation = 2;
    const again = await client.callTool('echo', { text: 'again' });
    assert.strictEqual(again.text, 'echo:again');
    assert.strictEqual(client.sessionId, 'legacy-2');

    await client.close();
    const last = seen[seen.length - 1];
    assert.strictEqual(last.method, 'DELETE');
    assert.strictEqual(last.headers['mcp-session-id'], 'legacy-2');
    assert.strictEqual(client.sessionId, null);

    // concurrent first requests share one handshake instead of opening (and leaking) two sessions
    const start = seen.length;
    const concurrent = new MCPClient({ url });
    const [listed, echoed] = await Promise.all([concurrent.fetchTools(), concurrent.callTool('echo', { text: 'both' })]);
    assert.deepStrictEqual(listed.map((tool) => tool.name), ['echo']);
    assert.strictEqual(echoed.text, 'echo:both');
    const methods = seen.slice(start).map((entry) => entry.message && entry.message.method);
    assert.strictEqual(methods.filter((method) => method === 'initialize').length, 1, `one initialize only, got ${methods.join(', ')}`);
    assert.strictEqual(methods.filter((method) => method === 'server/discover').length, 1, 'and one probe');
    assert.deepStrictEqual((await concurrent.initialize()).map((tool) => tool.name), ['echo'], 'initialize() still returns the tools');
    await concurrent.close();
  } finally {
    await new Promise((resolve) => legacy.close(resolve));
  }
}

// (d) the SSE parser and the newline-delimited reader
async function testParsers() {
  const parser = new rpc.SSEParser();
  const events = [
    ...parser.feed('event: message\r\nid: 7\r\ndata: {"jsonrpc":"2.0","id":1,'),
    ...parser.feed('"result":{"ok":true}}\r'),
    ...parser.feed('\n\r\n: keep-alive comment\n\ndata: first line\ndata: second line\n\n'),
    ...parser.feed('data:no-space\n\ndata: unterminated'),
    ...parser.end(),
  ];
  assert.deepStrictEqual(events, [
    { event: 'message', data: '{"jsonrpc":"2.0","id":1,"result":{"ok":true}}', id: '7' },
    { event: 'message', data: 'first line\nsecond line', id: null },
    { event: 'message', data: 'no-space', id: null },
    { event: 'message', data: 'unterminated', id: null },
  ]);
  assert.deepStrictEqual(new rpc.SSEParser().feed('event: ping\n\n'), [], 'an event without data is not dispatched');

  const stream = Readable.from([
    'event: message\ndata: {"jsonrpc":"2.0","method":"notifications/progress","params":{}}\n\n',
    'data: not json\n\ndata: {"jsonrpc":"2.0","id":"a",', '"result":{"n":1}}\r\n\r\n',
  ]);
  const messages = [];
  for await (const message of rpc.readSSEMessages(stream)) messages.push(message);
  assert.deepStrictEqual(messages, [
    { jsonrpc: '2.0', method: 'notifications/progress', params: {} },
    { jsonrpc: '2.0', id: 'a', result: { n: 1 } },
  ]);

  const lines = [];
  for await (const value of rpc.readJsonLines(Readable.from(['{"a":1}\r\n{"b"', ':2}\n\nnot json\n{"c":3}']))) lines.push(value);
  assert.deepStrictEqual(lines, [{ a: 1 }, { b: 2 }, { c: 3 }]);

  assert.strictEqual(rpc.encodeHeaderValue('get_weather'), 'get_weather');
  assert.strictEqual(rpc.encodeHeaderValue('Hello, 世界'), '=?base64?SGVsbG8sIOS4lueVjA==?=');
  assert.strictEqual(rpc.encodeHeaderValue(' padded '), '=?base64?IHBhZGRlZCA=?=');
  assert.strictEqual(rpc.encodeHeaderValue('=?base64?literal?='), '=?base64?PT9iYXNlNjQ/bGl0ZXJhbD89?=');
  assert.strictEqual(rpc.decodeHeaderValue('=?base64?PT9iYXNlNjQ/bGl0ZXJhbD89?='), '=?base64?literal?=');
  assert.throws(() => rpc.decodeHeaderValue('=?base64?***?='), (error) => error.code === rpc.ERROR_CODES.HEADER_MISMATCH);

  // a method with id null is neither a request nor a notification
  const nullId = { jsonrpc: '2.0', id: null, method: 'ping' };
  assert.strictEqual(rpc.isNotification(nullId), false);
  assert.strictEqual(rpc.isRequest(nullId), false);
  assert.strictEqual(rpc.isNotification({ jsonrpc: '2.0', method: 'ping' }), true);
}

function testClientHelpers() {
  const clients = MCPClient.fromConfig({
    mcpServers: {
      local: { command: 'npx', args: ['-y', 'some-server'], env: { A: '1' } },
      remote: { url: 'https://example.com/mcp/', headers: { Authorization: 'Bearer x' } },
      off: { url: 'https://example.com/off', disabled: true },
    },
  });
  assert.deepStrictEqual(Object.keys(clients), ['local', 'remote']);
  assert.strictEqual(clients.local.transport, 'stdio');
  assert.deepStrictEqual(clients.local.args, ['-y', 'some-server']);
  assert.strictEqual(clients.remote.transport, 'http');
  assert.strictEqual(clients.remote.url, 'https://example.com/mcp');
  assert.throws(() => new MCPClient({}), /url.*command/);

  const client = new MCPClient('http://localhost:3210/mcp');
  client.tools = [{ name: 'get_weather', description: 'Weather', inputSchema: { type: 'object', properties: { city: { type: 'string' } } } }];
  assert.deepStrictEqual(client.getToolNames(), ['get_weather']);
  assert.strictEqual(client.getTool('get_weather').description, 'Weather');
  assert.strictEqual(client.getTool('nope'), null);
  assert.ok(client.hasTool('get_weather') && !client.hasTool('nope'));
  // the 2.x contract: listTools() is the synchronous cached list, getTools() / fetchTools() fetch
  assert.strictEqual(client.listTools(), client.tools);
  assert.strictEqual(typeof client.fetchTools, 'function');
  assert.strictEqual(typeof client.getTools, 'function');
  assert.deepStrictEqual(client.toChatTools(), [{ type: 'function', function: { name: 'get_weather', description: 'Weather', parameters: { type: 'object', properties: { city: { type: 'string' } } } } }]);
}

// (e) the stdio transport needs Node: in the browser bundle child_process is an empty module
async function testStdioNeedsNode() {
  const original = Module.prototype.require;
  Module.prototype.require = function patched(id) {
    return id === 'child_process' ? {} : original.apply(this, arguments);
  };
  try {
    const client = new MCPClient({ command: 'node', args: [] });
    await assert.rejects(client.connect(), /needs Node\.js.*\{ url \}/);
    assert.strictEqual(client.process, null);
  } finally {
    Module.prototype.require = original;
  }
}

// (f) list_providers reports only the variables that are still unset
async function testProviderReporting() {
  const listProviders = (env) => createTools(env).find((tool) => tool.name === 'list_providers').handler({});

  const partial = await listProviders(blankProviderEnv({ OPENAI_API_KEY: 'sk-test', GROQ_API_KEY: 'gsk-test' }));
  const groq = partial.structuredContent.unconfigured.find((entry) => entry.provider === 'groq');
  assert.deepStrictEqual(groq.missing, ['GROQ_MODEL'], 'a key that is set is not reported as missing');
  assert.ok(partial.content[0].text.includes('groq (set GROQ_MODEL)'), partial.content[0].text);
  assert.ok(!partial.content[0].text.includes('GROQ_API_KEY'), partial.content[0].text);
  assert.throws(
    () => resolveProvider('groq', blankProviderEnv({ GROQ_API_KEY: 'gsk-test' })),
    (error) => error.message.includes('Set GROQ_MODEL') && !error.message.includes('GROQ_API_KEY'),
  );

  // with nothing configured the text names the key variables plus OLLAMA_MODEL
  const none = await listProviders(blankProviderEnv());
  assert.strictEqual(none.structuredContent.default, null);
  const text = none.content[0].text;
  for (const provider of PROVIDERS.filter((entry) => entry.key)) assert.ok(text.includes(provider.key), `${provider.key} is named`);
  assert.ok(text.includes('OLLAMA_MODEL'), text);

  // a local Ollama model alone configures a provider
  const ollama = await listProviders(blankProviderEnv({ OLLAMA_MODEL: 'qwen2.5:0.5b' }));
  assert.strictEqual(ollama.structuredContent.default, 'ollama');
  assert.deepStrictEqual(ollama.structuredContent.configured[0], { provider: 'ollama', model: 'qwen2.5:0.5b', keyVariable: null });
}

async function testMCP() {
  testClientHelpers();
  await testProviderReporting();
  await testParsers();
  await testLegacyServer();
  await testStdioServerRobustness();
  await testHttpServer();
  await testHttpEdgeCases();
  await testSseTeardown();
  await testStdioNeedsNode();
  await testStdioCli();
  await testStdioEofFlush();
}

module.exports = testMCP;

if (require.main === module) {
  testMCP().then(() => console.log('MCP unit tests passed.'), (error) => {
    console.error(error);
    process.exit(1);
  });
}
