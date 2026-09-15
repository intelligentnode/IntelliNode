# Model Context Protocol (MCP) in IntelliNode

IntelliNode ships both sides of MCP with no extra dependencies:

- **`MCPClient`** connects to any MCP server over **Streamable HTTP** or **stdio** and exposes its tools
  to the IntelliNode chatbot (`toChatTools()`), so an agent built with IntelliNode can use filesystem,
  GitHub, database or SaaS servers.
- **`MCPServer` + `intellinode mcp`** publish the IntelliNode `Gen` tools (ask any provider, consensus,
  code review, fixes, tests, components, SQL, OpenAPI, design tokens, regex, mock data, SEO meta, images)
  to coding assistants such as Claude Code, Cursor and VS Code, on every provider you have a key for.

Both speak the **modern protocol revision `2026-07-28`** (per-request `_meta`, `server/discover`, no
sessions) and fall back to the **legacy `2025-11-25` handshake** (`initialize`, `Mcp-Session-Id`), so
they work with servers and clients from either era.

## Files

| File | Purpose |
| --- | --- |
| `mcp/jsonrpc.js` | JSON-RPC 2.0 builders/validators, MCP error codes, newline-delimited JSON reader, SSE parser, `Mcp-Name` header encoding |
| `utils/MCPClient.js` | Dual-era client (Streamable HTTP + stdio) |
| `mcp/server.js` | Dual-era server (`handle`, `startStdio`, `startHttp`) |
| `mcp/tools.js` | The IntelliNode tool set (definitions + handlers) |
| `bin/intellinode.js` | CLI: `intellinode mcp [--http]` |
| `server.json` | Manifest for the official MCP Registry |
| `test/unit/MCP.test.js` | Offline tests (part of `npm test`) |
| `test/integration/MCPClient.test.js` | Third-party stdio server, own HTTP server, one live call |

## Client

```js
const { MCPClient } = require('intellinode');

// Streamable HTTP
const remote = new MCPClient('https://host/mcp');
// ... with auth headers, timeout (ms per request, default 60s) and debug logs on stderr
const secured = new MCPClient({ url: 'https://host/mcp', headers: { Authorization: 'Bearer ...' }, timeout: 30000, debug: true });
// stdio subprocess
const files = new MCPClient({ command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'], env: {}, cwd: process.cwd() });

const info = await files.connect();     // { protocolVersion, serverInfo, capabilities, instructions }
                                        // the handshake also fetches every tools/list page into files.tools
const tools = files.listTools();        // the cached list (synchronous)
const fresh = await files.fetchTools(); // fetch every page again and refresh the cache
const result = await files.callTool('list_directory', { path: '/tmp' }, { timeout: 20000 });
// result = { content, structuredContent, isError, text }  (text joins the text blocks)
await files.close();                    // closes stdin, waits, then SIGTERM / SIGKILL; DELETEs a legacy HTTP session
```

Tool methods (unchanged since intellinode 2.x): `listTools()` is synchronous and returns the cached list,
`getTools()` and `fetchTools()` are async and fetch it, `initialize()` connects when needed and returns the
tools. Sync helpers on the cache: `getToolNames()`, `getTool(name)`, `hasTool(name)`, `toChatTools()`.
`callTool()` and `fetchTools()` connect on their own, and concurrent first calls share one handshake.
The stdio transport (`{ command }`) needs Node.js; in the browser bundle use `{ url }` (Streamable HTTP).

Several servers from a Claude Desktop / Cursor style config:

```js
const clients = MCPClient.fromConfig({
  mcpServers: {
    files: { command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'] },
    intellinode: { url: 'http://127.0.0.1:3210/mcp' },
  },
});
await clients.files.connect();
```

### Using MCP tools with the chatbot

`toChatTools()` returns chat-completions style tools (`{ type: 'function', function: { name, description, parameters } }`);
`ModelHelper` converts that format for OpenAI, Anthropic and Mistral.

```js
const { Chatbot, ChatGPTInput, MCPClient } = require('intellinode');

const mcp = new MCPClient({ command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'] });
await mcp.connect(); // fills mcp.tools, so `await bot.runTools(input, mcp)` works right away

const input = new ChatGPTInput('You can use tools to answer.', { tools: mcp.toChatTools() });
input.addUserMessage('What files are in /tmp?');
const bot = new Chatbot(process.env.OPENAI_API_KEY, 'openai');
const [reply] = await bot.chat(input);
// when the model returns a tool call, run it and feed the result back:
// const { text } = await mcp.callTool(call.name, JSON.parse(call.arguments));
```

### How the era is detected

- **stdio**: the client sends `server/discover` first. A `DiscoverResult` means modern; a `-32022`
  UnsupportedProtocolVersion error means modern (the client retries with a version from `supported`);
  any other error or no answer within `probeTimeout` (5 s) means legacy, and the client sends `initialize`.
- **HTTP**: the client sends the modern `server/discover` request. A result, or a `4xx` whose body is a
  recognised modern error (`-32020`, `-32021`, `-32022`, or `-32601` with a JSON-RPC body) means modern;
  anything else means legacy: `initialize`, echo `Mcp-Session-Id`, send `MCP-Protocol-Version`, re-initialize
  on `404`, `DELETE` on close. SSE (`text/event-stream`) responses are handled in both eras.
- The era is cached per client instance; after the handshake `connect()` fetches `tools/list` (a server that
  answers `-32601` leaves the cache empty).

Errors: a JSON-RPC error rejects with a `JsonRpcError` (`code`, `data`); a request that exceeds its timeout
rejects with `MCPTimeoutError` (and sends `notifications/cancelled` on stdio); a stdio server that dies rejects
every pending call with `MCP server process '<command>' exited (code N)`.

## Server

### CLI (recommended for coding assistants)

```bash
npx -y intellinode mcp                         # stdio, reads .env from the current directory
npx -y intellinode mcp --http --port 3210      # Streamable HTTP at http://127.0.0.1:3210/mcp
npx -y intellinode mcp --http --host 0.0.0.0 --path /mcp --origin https://app.example.com
npx -y intellinode --version
npx -y intellinode help
```

Keys come from the environment or a `.env` file in the current directory: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`,
`GEMINI_API_KEY`, `MISTRAL_API_KEY`, `COHERE_API_KEY`, `NVIDIA_API_KEY`, `OPENROUTER_API_KEY`, `DEEPSEEK_API_KEY`,
`GROQ_API_KEY`, `XAI_API_KEY`, `TOGETHER_API_KEY`, and `STABILITY_API_KEY` for images. Groq, xAI and Together also need
the model name in `GROQ_MODEL`, `XAI_MODEL` or `TOGETHER_MODEL` (OpenRouter and DeepSeek default to `openai/gpt-5.5` and
`deepseek-chat`; `OPENROUTER_MODEL` / `DEEPSEEK_MODEL` override them). A local Ollama needs no key: set `OLLAMA_MODEL=qwen3`
and the tools run on that model. The default provider is the first configured one in that order; every tool accepts
`provider` to pick another.
In stdio mode nothing but MCP messages is written to stdout; logs go to stderr.
`INTELLINODE_MCP_PAGE_SIZE=n` paginates `tools/list` (unpaginated by default).

#### Claude Code

```bash
claude mcp add intellinode -- npx -y intellinode mcp
# with keys passed explicitly instead of a .env file
claude mcp add intellinode -e OPENAI_API_KEY=sk-... -e ANTHROPIC_API_KEY=sk-ant-... -- npx -y intellinode mcp
```

or a project `.mcp.json`:

```json
{
  "mcpServers": {
    "intellinode": {
      "command": "npx",
      "args": ["-y", "intellinode", "mcp"],
      "env": { "OPENAI_API_KEY": "sk-...", "ANTHROPIC_API_KEY": "sk-ant-..." }
    }
  }
}
```

#### Cursor (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "intellinode": {
      "command": "npx",
      "args": ["-y", "intellinode", "mcp"],
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```

#### VS Code (`.vscode/mcp.json`)

```json
{
  "servers": {
    "intellinode": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "intellinode", "mcp"],
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```

For the HTTP transport start `npx -y intellinode mcp --http` and register `{ "type": "http", "url": "http://127.0.0.1:3210/mcp" }`.

### Tools

| Tool | Arguments | Returns |
| --- | --- | --- |
| `ask_model` | `prompt`, `provider?`, `model?`, `system?` | text |
| `consensus` | `prompt`, `providers?` | text per provider + `structuredContent.answers` |
| `review_code` | `code`, `language?`, `provider?` | `{ summary, score, issues }` |
| `generate_component` | `description`, `framework?`, `language?`, `styling?`, `provider?` | code |
| `generate_form` | `description`, `framework?`, `action?`, `provider?` | code |
| `generate_sql` | `description`, `dialect?`, `schema?`, `provider?` | SQL |
| `generate_openapi_spec` | `input`, `title?`, `basePath?`, `provider?` | OpenAPI document |
| `generate_design_tokens` | `brand`, `brandColor?`, `provider?` | tokens, CSS variables, Tailwind theme |
| `generate_regex` | `description`, `language?`, `provider?` | `{ pattern, flags, explanation, matches, nonMatches, verified }` |
| `generate_mock_data` | `schema`, `count?`, `provider?` | `{ records, count }` |
| `generate_seo_meta` | `page`, `url?`, `siteName?`, `provider?` | meta fields + rendered HTML |
| `generate_unit_tests` | `code`, `framework?`, `modulePath?`, `provider?` | test file |
| `fix_code` | `code`, `problem?`, `language?`, `provider?` | `{ code, explanation, changes }` |
| `generate_image` | `prompt`, `provider?` (`openai`/`stability`), `size?` | `image` content block (PNG, base64) |
| `list_providers` | – | configured providers, default, models and the still unset variables per provider |

A missing key returns `isError: true` with the variable to set, so the assistant can tell the user what to configure.

### Library use

```js
const { MCPServer } = require('intellinode');

const server = new MCPServer({
  name: 'my-tools',
  version: '1.0.0',
  instructions: 'Optional guidance for the model.',
  tools: [{
    name: 'greet',
    description: 'Greet someone',
    inputSchema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] },
    handler: async ({ name }) => `Hello ${name}`,
  }],
});

server.startStdio();                                   // or
const httpServer = await server.startHttp({ host: '127.0.0.1', port: 3210, path: '/mcp', allowedOrigins: [] });
await server.stop();
```

A handler may return a string (one text block), an object (`structuredContent` plus a JSON text block), a content
block or an array of blocks, a full `{ content, structuredContent, isError }` result, or throw (`isError: true`
with the message). `handle(message, { transport, headers })` runs one JSON-RPC message without a transport
(returns the response, or `null` for notifications; `context.sessionId` is set when a legacy HTTP `initialize`
mints a session).

Protocol behaviour of the server:

- Modern requests (`_meta` with `io.modelcontextprotocol/protocolVersion`) are served statelessly with
  `resultType: "complete"`; `server/discover`, `tools/list` (cursor pagination), `tools/call`, `ping`.
- Over HTTP the mirrored headers are validated: `MCP-Protocol-Version` and `Mcp-Method` must match the body,
  `Mcp-Name` must match `params.name` for `tools/call` (Base64 sentinel decoded). Mismatch → `400` + `-32020`;
  unsupported version → `400` + `-32022` with `supported`; unknown method → `404` + `-32601` for modern requests
  and `200` + `-32601` for legacy ones (a legacy `404` means the session is gone); a request id of `null` →
  `400` + `-32600`; notifications → `202`; `GET` → `405`; a body over `maxBodyBytes` → `413` with
  `Connection: close`; a foreign `Origin` → `403` (localhost origins and `allowedOrigins` are accepted, and get
  `Access-Control-Allow-Origin`, `Access-Control-Expose-Headers: Mcp-Session-Id` plus a `204` answer to the
  `OPTIONS` preflight); binds `127.0.0.1` by default.
- Legacy clients get the `initialize` handshake (their version when it is 2025-11-25, 2025-06-18 or 2025-03-26,
  otherwise 2025-11-25), a `Mcp-Session-Id` over HTTP (`404` once it is gone, `DELETE` ends it) and results
  without `resultType`.
- Unknown tool → JSON-RPC `-32602`; handler failures and invalid arguments → `isError: true`; a result JSON
  cannot represent (BigInt, circular structure) → `-32603` for that request, on both transports.
- On stdio the server waits for its responses to reach the OS before it exits on stdin EOF, so a reply larger
  than a pipe buffer (`tools/list` is ~17 KB) is never truncated.

## Publishing to the MCP Registry

`server.json` describes the npm package for the [official registry](https://registry.modelcontextprotocol.io).
The npm package must carry the matching name in `package.json` (`"mcpName": "io.github.intelligentnode/intellinode"`)
and the `bin` entry for `intellinode`.

```bash
# 1. publish the npm package (bin/intellinode.js, mcp/, server.json included)
npm publish

# 2. install the publisher CLI
brew install mcp-publisher            # or: curl -L "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_$(uname -s | tr '[:upper:]' '[:lower:]')_$(uname -m | sed 's/x86_64/amd64/').tar.gz" | tar xz mcp-publisher

# 3. authenticate with GitHub (the io.github.intelligentnode/* namespace is tied to the org)
mcp-publisher login github

# 4. validate and publish server.json from the package root
mcp-publisher publish
```

Bump `version` in `server.json` together with `package.json` on every release.

## Tests

```bash
npm test                                      # includes test/unit/MCP.test.js (offline)
node test/integration/MCPClient.test.js       # filesystem server over stdio, own HTTP server, live ask_model when OPENAI_API_KEY is set
```

The unit tests spawn `bin/intellinode.js mcp` over stdio, drive `MCPServer.handle` with a legacy handshake,
start the HTTP transport on an ephemeral port to check header validation and status codes, run the client's
legacy fallback against a tiny fake 2025-era server (SSE responses, session id, re-initialize on 404, DELETE on
close), and exercise the SSE parser with split chunks and CRLF.

## References

- [MCP specification 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28)
- [Legacy lifecycle 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle)
- [MCP Registry publishing guide](https://github.com/modelcontextprotocol/registry/blob/main/docs/guides/publishing/publish-server.md)
