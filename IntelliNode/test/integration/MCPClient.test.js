require('dotenv').config({ quiet: true });
const assert = require('assert');
const { spawnSync } = require('child_process');
const MCPClient = require('../../utils/MCPClient');
const { MCPServer } = require('../../mcp/server');
const { createTools } = require('../../mcp/tools');

/**
 * MCP integration tests
 *
 * 1. A third-party legacy (2025-era) server over stdio: npx -y @modelcontextprotocol/server-filesystem /tmp
 *    (skipped with a message when npx is unavailable or the package cannot be downloaded).
 * 2. The IntelliNode server over Streamable HTTP with the client in modern mode.
 * 3. One live ask_model call when OPENAI_API_KEY is set.
 *
 * Run: node test/integration/MCPClient.test.js
 */

async function testFilesystemServer() {
  console.log('\n=== Test 1: stdio - @modelcontextprotocol/server-filesystem (legacy era) ===');
  const npx = spawnSync('npx', ['--version'], { encoding: 'utf8' });
  if (npx.error || npx.status !== 0) {
    console.log('skipped: npx is not available');
    return;
  }
  const client = new MCPClient({
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
    timeout: 180000, // the first run downloads the package
  });
  let info;
  try {
    info = await client.connect();
  } catch (error) {
    console.log(`skipped: could not start the filesystem server (${error.message})`);
    await client.close();
    return;
  }
  try {
    console.log(`connected: era=${client.era} protocol=${info.protocolVersion} server=${info.serverInfo && info.serverInfo.name}`);
    assert.strictEqual(client.era, 'legacy', 'the filesystem server uses the initialize handshake');
    assert.ok(info.serverInfo && info.serverInfo.name, 'serverInfo comes from the initialize result');

    const tools = await client.listTools();
    console.log(`tools (${tools.length}): ${client.getToolNames().join(', ')}`);
    assert.ok(client.hasTool('list_directory') && client.hasTool('list_allowed_directories'));
    assert.ok(client.toChatTools().every((tool) => tool.type === 'function' && tool.function.parameters));

    const allowed = await client.callTool('list_allowed_directories');
    console.log(`list_allowed_directories: ${allowed.text.split('\n').join(' | ')}`);
    assert.strictEqual(allowed.isError, false);
    assert.ok(allowed.text.includes('tmp'));

    const listing = await client.callTool('list_directory', { path: '/tmp' });
    console.log(`list_directory: ${listing.text.split('\n').length} entries`);
    assert.strictEqual(listing.isError, false);
    assert.ok(listing.content.length > 0);
    console.log('Test 1 PASSED');
  } finally {
    await client.close();
  }
}

async function testIntelliNodeHttpServer() {
  console.log('\n=== Test 2: Streamable HTTP - IntelliNode server (modern era) ===');
  const server = new MCPServer({ name: 'intellinode', tools: createTools(process.env) });
  const httpServer = await server.startHttp({ port: 0 });
  const url = `http://127.0.0.1:${httpServer.address().port}/mcp`;
  const client = new MCPClient(url);
  try {
    const info = await client.connect();
    console.log(`connected: era=${client.era} protocol=${info.protocolVersion} server=${info.serverInfo.name}`);
    assert.strictEqual(client.era, 'modern');
    assert.strictEqual(info.protocolVersion, '2026-07-28');

    const tools = await client.listTools();
    console.log(`tools (${tools.length}): ${client.getToolNames().join(', ')}`);
    assert.ok(tools.length >= 15);

    const providers = await client.callTool('list_providers');
    console.log(`list_providers: ${providers.text}`);
    assert.strictEqual(providers.isError, false);
    assert.ok(Array.isArray(providers.structuredContent.configured));

    if (process.env.OPENAI_API_KEY) {
      console.log('\n=== Test 3: live ask_model on openai ===');
      const answer = await client.callTool('ask_model', {
        prompt: 'Reply with the single word OK.',
        provider: 'openai',
      }, { timeout: 120000 });
      console.log(`ask_model: ${answer.text.slice(0, 80)}`);
      assert.strictEqual(answer.isError, false, answer.text);
      assert.ok(answer.text.trim().length > 0);
      console.log('Test 3 PASSED');
    } else {
      console.log('\nTest 3 skipped: OPENAI_API_KEY is not set');
    }
    console.log('Test 2 PASSED');
  } finally {
    await client.close();
    await server.stop();
  }
}

(async () => {
  console.log('========================================');
  console.log('   MCP Client Integration Tests');
  console.log('========================================');
  try {
    await testFilesystemServer();
    await testIntelliNodeHttpServer();
    console.log('\nAll MCP integration tests completed.');
  } catch (error) {
    console.error('\nMCP integration tests failed:', error);
    process.exit(1);
  }
})();
