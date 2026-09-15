// Give the chatbot the tools of any MCP server, and serve IntelliNode's own tools to coding assistants.
const { Chatbot, ChatGPTInput, MCPClient, MCPServer } = require('intellinode');

const dotenv = require('dotenv');
dotenv.config();

async function chatWithMcpTools() {
  // a stdio MCP server (here the reference filesystem server scoped to this folder)
  const files = new MCPClient({ command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem', __dirname] });
  const info = await files.connect();
  console.log('connected to', info.serverInfo, 'protocol', info.protocolVersion);
  console.log('tools:', files.listTools().map((tool) => tool.name).join(', ')); // connect() filled the cache

  const bot = new Chatbot(process.env.OPENAI_API_KEY, 'openai');
  const input = new ChatGPTInput('You are a helpful assistant with file tools.');
  input.addUserMessage('List the JavaScript files in the allowed directory and tell me which one looks like an e-commerce sample.');

  const { text, steps } = await bot.runTools(input, files, { maxSteps: 6 });
  console.log('\nanswer:', text);
  console.log('tool calls:', steps.map((step) => step.name).join(' -> '));
  await files.close();
}

async function serveYourOwnTools() {
  // an MCP server with a custom tool, reachable over Streamable HTTP by any MCP client
  const server = new MCPServer({
    name: 'my-tools',
    tools: [{
      name: 'add',
      description: 'Add two numbers',
      inputSchema: { type: 'object', properties: { a: { type: 'number' }, b: { type: 'number' } }, required: ['a', 'b'] },
      handler: async ({ a, b }) => ({ sum: a + b }),
    }],
  });
  const { url } = await server.startHttp({ port: 0 });
  console.log('\nMCP server at', url);

  const client = new MCPClient({ url });
  console.log('add(2, 3) ->', (await client.callTool('add', { a: 2, b: 3 })).structuredContent);
  await client.close();
  await server.stop();
}

(async () => {
  await serveYourOwnTools();
  await chatWithMcpTools();
})();
