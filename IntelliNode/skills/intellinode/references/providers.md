# Providers, keys and the MCP server

## Chat providers

| Provider id | Key variable | Input class | Default model | Notes |
| --- | --- | --- | --- | --- |
| `openai` | `OPENAI_API_KEY` | `ChatGPTInput` | gpt-5.5 | gpt-5+ goes to the Responses API; `effort` sets reasoning |
| `anthropic` | `ANTHROPIC_API_KEY` | `AnthropicInput` | claude-sonnet-5 | also claude-opus-5, claude-haiku-4-5 |
| `gemini` | `GEMINI_API_KEY` | `GeminiInput` | gemini-3.6-flash | Gemini Developer API (AI Studio key) |
| `vertex` | `VERTEX_API_KEY` | `GeminiInput` | gemini-3.8-flash | Vertex AI; options `{ projectId, location }` or OAuth |
| `mistral` | `MISTRAL_API_KEY` | `MistralInput` | mistral-medium-latest | |
| `cohere` | `COHERE_API_KEY` | `CohereInput` | command-a-03-2025 | no tool calls |
| `nvidia` | `NVIDIA_API_KEY` | `NvidiaInput` | NVIDIA NIM models | `options.baseUrl` for self-hosted NIM |
| `openrouter`, `groq`, `deepseek`, `xai`, `together` | `<NAME>_API_KEY` | `OpenAICompatibleInput` | preset | groq, xai and together need a model |
| `ollama`, `lmstudio` | none | `OpenAICompatibleInput` | pass `model` | local servers on 11434 / 1234 |
| `openai_compatible` | any | `OpenAICompatibleInput` | pass `model` | `options.baseUrl` |
| `vllm` | none | `VLLMInput` | the served model | `options.baseUrl` |

```js
const { Chatbot } = require('intellinode');
const bot = new Chatbot(process.env.ANTHROPIC_API_KEY, 'anthropic', null, { timeout: 60000, retries: 2 });
const input = Chatbot.createInput('anthropic', 'You are concise.', { maxTokens: 4000 });
input.addUserMessage('Hi');
const [reply] = await bot.chat(input);
const result = await bot.runTools(input, [{ name: 'add', description: 'Add numbers',
  parameters: { type: 'object', properties: { a: { type: 'number' }, b: { type: 'number' } } }, handler: ({ a, b }) => a + b }]);
const data = await bot.chatJson(Chatbot.createInput('openai', 'Extract fields.', { responseSchema: mySchema }));
```

Provider limits worth knowing:

- Claude 5 models think adaptively and the thinking counts toward `maxTokens`; use 16000 or more for long outputs
  (the default 2048 can cut an answer short).
- gpt-5+ models reject `temperature`; set `effort` (none, low, medium, high, xhigh) instead.
- Cohere has no tool calls; use another provider for `runTools`.
- Gemini 3 thinks before answering; see the thinking rule in SKILL.md.

`Gen` takes the same provider ids: `Gen.generate_text(prompt, key, provider, { model, system })`,
`Gen.generate_json(prompt, schema, key, provider)`, `Gen.generate_html_page(...)`, `Gen.review_code(...)`.

## Images, speech and embeddings

| Controller | Providers |
| --- | --- |
| `RemoteImageModel(key, provider, options)` | `openai` (gpt-image-2), `stability`, `gemini`, `vertex` |
| `RemoteSpeechModel(key, provider, options)` | `openAi`, `google` (Cloud TTS, MP3), `gemini`, `vertex` (WAV) |
| `RemoteEmbedModel(key, provider, options)` | `openai`, `cohere`, `gemini`, `vertex`, `nvidia`, `vllm`, `ollama`, `openrouter`, `together`, `lmstudio`, `openai_compatible` |

## MCP server for code editors

The `intellinode` binary runs an MCP server (stdio by default, Streamable HTTP with `--http`). It gives the editor's
agent tools that run on whichever provider has a key:

- `ask_model`, `consensus` (the same prompt to several providers), `list_providers`
- `search_web` (Gemini with Google Search, returns sources), `generate_image`, `generate_speech`
- `generate_component`, `generate_form`, `generate_sql`, `generate_openapi_spec`, `generate_design_tokens`,
  `generate_regex`, `generate_mock_data`, `generate_seo_meta`, `generate_unit_tests`, `review_code`, `fix_code`

```bash
claude mcp add intellinode -e GEMINI_API_KEY=$GEMINI_API_KEY -- npx -y intellinode mcp     # Claude Code
codex mcp add intellinode --env GEMINI_API_KEY=$GEMINI_API_KEY -- npx -y intellinode mcp   # OpenAI Codex
npx intellinode mcp --http --port 3210                                                     # any client over HTTP
```

Codex `~/.codex/config.toml`:

```toml
[mcp_servers.intellinode]
command = "npx"
args = ["-y", "intellinode", "mcp"]
env_vars = ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "GEMINI_API_KEY", "VERTEX_API_KEY"]
```

Cursor and VS Code use the same command in their MCP settings (`.cursor/mcp.json`, `.vscode/mcp.json`).
