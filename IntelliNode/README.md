
# Intelligent Node (IntelliNode)
### Unified prompt, evaluation, and production integration to any AI model


<p>

<a href="https://github.com/Barqawiz/IntelliNode/blob/main/LICENSE" alt="licenses tag" target="_blank">
    <img src="https://img.shields.io/github/license/intelligentnode/IntelliNode?style=flat-square" />
</a>

<a href="https://discord.gg/VYgCh2p3Ww" alt="Join our Discord community">
    <img src="https://img.shields.io/badge/Discord-join%20us-5865F2?style=flat-square&logo=discord&logoColor=white" />
</a>

</p>

Integrate your data with the latest language models and deep learning frameworks using intellinode **javascript**. The library provides intuitive functions for sending input to models like GPT-5.5, Claude, Gemini, WaveNet and Stable diffusion, and receiving generated text, speech, or images. With just a few lines of code, you can easily access the power of cutting-edge AI models to enhance your projects.

# Latest Updates
- Add streaming for Anthropic, GPT-5+, and Mistral, plus tool calling for OpenAI, Anthropic and Mistral.
- Gen: 25+ new one-call functions for developers (components, forms, API endpoints, SQL, mock data, regex, tests, code review, SEO meta, UI translation and more) that work the same with every provider. 🧰
- OpenAI-compatible services (OpenRouter, Groq, DeepSeek, xAI, Together, local Ollama, LM Studio) join OpenAI, Anthropic, Gemini, Mistral, Cohere and NVIDIA, with TypeScript types, timeouts, retries and cancellation. 🔌
- IntelliNode MCP server: `npx intellinode mcp` gives Claude Code, Cursor and VS Code cross-provider tools. 🧩
- Coding agent: `new CodingAgent({ workspace })` edits a repository until its tests pass, with any provider. 🛠️
- Update the default models: GPT-5.5, Claude Sonnet 5, Gemini 3.6 Flash, Mistral Medium, Command A and gpt-image-2. 🚀
- Fix the frontend bundle: Anthropic browser access, streaming in browsers and Gen templates.
- Add support for self-hosted vLLM models.
- Integrated Nvidia-hosted models (DeepSeek and Llama3 🦙).
- Add Anthropic Claude Fable 5.1 chat.
- Add Google Gemini chat and vision.

Join the [discord server](https://discord.gg/VYgCh2p3Ww) for the latest updates and community support.

Chat with your docs via Intellinode one key at [app.intellinode.ai](https://app.intellinode.ai/).

# Examples
## Functions

### Chatbot
1. imports:
```js
const { Chatbot, ChatGPTInput } = require('intellinode');
```
2. call with GPT-5.5 (default):
```js
// GPT-5.5 is the default model (low reasoning effort unless set)
const input = new ChatGPTInput('You are a helpful assistant.');
input.addUserMessage('What is the distance between the Earth and the Moon?');

// get GPT-5.5 responses.
const bot = new Chatbot(openaiKey);
const responses = await bot.chat(input);
```
3. control the reasoning effort:
```js
// gpt-5.5 effort: none, low, medium, high, xhigh (gpt-5 also accepts minimal)
const input = new ChatGPTInput('You are a helpful assistant.', { 
  model: 'gpt-5.5',
  effort: 'high'
});
input.addUserMessage('Explain quantum computing');

const bot = new Chatbot(openaiKey);
const responses = await bot.chat(input);
```

4. stream the response (OpenAI, Anthropic, Mistral, Cohere, NVIDIA and vLLM):
```js
for await (const chunk of bot.stream(input)) {
  process.stdout.write(chunk);
}
```
5. call tools (the same `tools` option works with `AnthropicInput` and `MistralInput`):
```js
const input = new ChatGPTInput('You are a helpful assistant.', {
  tools: [{ type: 'function', function: { name: 'get_weather', parameters: { type: 'object', properties: { city: { type: 'string' } } } } }]
});
input.addUserMessage('What is the weather in Paris?');

const [response] = await bot.chat(input);
// response.tool_calls[0].function => { name: 'get_weather', arguments: '{"city":"Paris"}' }
```
6. let IntelliNode run the tool loop: the model calls your handlers until it has the answer (same call with `AnthropicInput`, `GeminiInput`, `MistralInput` and `NvidiaInput`):
```js
const tools = [{ name: 'get_weather', description: 'Weather for a city', parameters: { type: 'object', properties: { city: { type: 'string' } } }, handler: async ({ city }) => ({ city, tempC: 22 }) }];
const { text, steps } = await bot.runTools(input, tools, { maxSteps: 5 });
```
7. get JSON that matches a schema with `new ChatGPTInput('Answer as JSON.', { responseSchema })` and `await bot.chatJson(input)`.
8. request options for every provider: `new Chatbot(key, 'openai', null, { timeout: 30000, retries: 2, signal: controller.signal })`.

### OpenAI-compatible providers
OpenRouter, Groq, DeepSeek, xAI, Together, a local Ollama / LM Studio or any endpoint (`openai_compatible` + `baseUrl`) use the same chatbot:
```js
const bot = new Chatbot(process.env.OPENROUTER_API_KEY, 'openrouter');      // or new Chatbot(null, 'ollama', null, { model: 'qwen3' })
const input = new OpenAICompatibleInput('You are a helpful assistant.', { model: 'anthropic/claude-sonnet-5' });
input.addUserMessage('Who painted the Mona Lisa?');
const responses = await bot.chat(input);
```

### Anthropic Claude Chatbot
1. imports:
```js
const { Chatbot, AnthropicInput, SupportedChatModels } = require('intellinode');
```
2. call (Claude Sonnet 5 is default; use `claude-fable-5-1` for Fable or `claude-opus-5` for Opus):
```js
const input = new AnthropicInput('You are a helpful assistant.');
input.addUserMessage('Who painted the Mona Lisa?');

const claudeBot = new Chatbot(anthropicKey, SupportedChatModels.ANTHROPIC);
const responses = await claudeBot.chat(input);
```

### Google Gemini Chatbot
IntelliNode enable effortless swapping between AI models.
1. imports:
```js
const { Chatbot, GeminiInput, SupportedChatModels } = require('intellinode');
```
2. call:
```js
const input = new GeminiInput();
input.addUserMessage('Who painted the Mona Lisa?');

// get the api key from makersuite.google.com/app/apikey
const geminiBot = new Chatbot(geminiApiKey, SupportedChatModels.GEMINI);
const responses = await geminiBot.chat(input);
```

The documentation on how to switch between ChatGPT, Mistral, Anthropic, and LLama can be found in the [IntelliNode Wiki](https://docs.intellinode.ai/docs/npm/chatbot/get-started).

### Semantic Search
1. imports:
```js
const { SemanticSearch } = require('intellinode');
```
2. call:
```js
const search = new SemanticSearch(apiKey);
// pivotItem: item to search.
const results = await search.getTopMatches(pivotItem, searchArray, numberOfMatches);
const filteredArray = search.filterTopMatches(results, searchArray)
```
### Gen
One-call functions for the tasks web developers hand to AI every day. Every function takes the same
arguments `(input, apiKey, provider, options)` and works with `openai`, `anthropic`, `gemini`,
`mistral`, `cohere`, `nvidia` and the OpenAI-compatible providers (`openrouter`, `groq`, `deepseek`,
`xai`, `together`, `ollama`, `lmstudio`): change the provider name and the key, keep the code.

1. imports:
```js
const { Gen } = require('intellinode');
```
2. build UI:
```js
// React + TypeScript + Tailwind component source (framework: react | vue | svelte | angular | html)
const code = await Gen.generate_component('a pricing card with a plan name, price and a CTA button', openaiKey, 'openai',
  { framework: 'react', language: 'typescript', styling: 'tailwind' });

// an accessible form with client-side validation
const form = await Gen.generate_form('a contact form with name, email and message', anthropicKey, 'anthropic');

// a page section, a stylesheet, a responsive HTML email, an SVG icon or a color palette
const hero = await Gen.generate_page_section('a hero for a note-taking app', openaiKey, 'openai', { sectionType: 'hero' });
const css = await Gen.generate_css('a responsive three column card grid', openaiKey);
const email = await Gen.generate_email_template('a welcome email with a "Get started" button', openaiKey);
const icon = await Gen.generate_svg_icon('a shopping cart', openaiKey);
const palette = await Gen.generate_color_palette('a calm fintech dashboard', openaiKey, 'openai', { count: 5 });

// design tokens: 11-step color scales, light/dark roles, WCAG contrast, CSS variables and a Tailwind theme
const tokens = await Gen.generate_design_tokens('a calm fintech dashboard', openaiKey, 'openai', { brandColor: '#4F46E5' });
// tokens.css -> ':root { --color-primary-500: #4f46e5; ... }', tokens.tailwind.theme.extend.colors

// fix accessibility problems: { html, issues: [{ issue, fix, wcag }] }
const fixed = await Gen.improve_accessibility('<img src="hero.jpg"><a href="/x">click here</a>', openaiKey);

// full page or data dashboard as { html, message }
const page = await Gen.generate_html_page('a registration page with a flat modern theme', openaiKey);
const dashboard = await Gen.generate_dashboard(csvString, 'website growth', openaiKey, undefined, 2);
```
3. backend and developer workflow:
```js
const endpoint = await Gen.generate_api_endpoint('POST /api/todos that creates a todo', openaiKey, 'openai', { framework: 'express' });
const sql = await Gen.generate_sql('top 10 customers by order total', openaiKey, 'openai', { dialect: 'postgresql', schema });
const schema = await Gen.generate_json_schema('a blog post with title, slug, tags and author', openaiKey);
const openapi = await Gen.generate_openapi_spec(expressRouterCode, openaiKey, 'openai', { title: 'Users API' }); // OpenAPI 3.1 object
const rows = await Gen.generate_mock_data('a user with id, fullName, email and role', openaiKey, 'openai', { count: 20 });
const regex = await Gen.generate_regex('a US phone number', openaiKey);      // { pattern, flags, regex, matches, nonMatches }
const tests = await Gen.generate_unit_tests(code, openaiKey, 'openai', { framework: 'jest', modulePath: './math' });
const review = await Gen.review_code(code, openaiKey);                        // { summary, score, issues }
const fix = await Gen.fix_code(code, openaiKey, 'openai', { problem: 'average([1,2,3]) returns NaN' });
const explained = await Gen.explain_code(code, openaiKey, 'openai', { audience: 'junior developer' });
const ts = await Gen.convert_code(code, openaiKey, 'openai', { from: 'JavaScript', to: 'TypeScript' });
const commit = await Gen.generate_commit_message(gitDiff, openaiKey);        // conventional commit
const readme = await Gen.generate_readme('intellinode-cli: generates web components from a prompt', openaiKey);
const notes = await Gen.generate_release_notes(changes, openaiKey, 'openai', { version: '2.4.0' });
```
4. content and metadata:
```js
const meta = await Gen.generate_seo_meta('a product page for wireless headphones', openaiKey, 'openai', { url, siteName });
const spanish = await Gen.translate_ui_strings({ save: 'Save', greeting: 'Hello, {name}!' }, openaiKey, 'openai', { targetLanguage: 'Spanish' });
const faq = await Gen.generate_faq('a specialty coffee subscription', openaiKey, 'openai', { count: 5 });
const copy = await Gen.generate_landing_copy('an AI meeting assistant', openaiKey);
const blogPost = await Gen.get_blog_post(prompt, openaiKey);
const description = await Gen.get_marketing_desc('an ergonomic gaming chair', openaiKey);
const text = await Gen.generate_text('any prompt', anthropicKey, 'anthropic', { system: 'You are terse.' });
const data = await Gen.generate_json('Where is the Eiffel Tower?', { type: 'object', properties: { city: { type: 'string' } } }, openaiKey);
```
Code functions return the code as a string (no markdown fences); structured functions return parsed
objects. Pass `options.model` to pick a model, `options.maxTokens` or `options.temperature` to tune it, and
`options.timeout`, `options.retries` or `options.signal` to control the request.

## Models Access
### Image models

1. imports:
```js
const { RemoteImageModel, SupportedImageModels, ImageModelInput } = require('intellinode');
```

2. call OpenAI (gpt-image-2 is default):
```js
provider=SupportedImageModels.OPENAI;

const imgModel = new RemoteImageModel(apiKey, provider);
const images = await imgModel.generateImages(new ImageModelInput({
    prompt: 'teddy writing a blog in times square',
    numberOfImages: 1
}));
```

3. change to call Stable Diffusion:
```js
provider=SupportedImageModels.STABILITY;
// ... same code
```

### Speech Synthesis
1. imports:
```js
const { RemoteSpeechModel, Text2SpeechInput } = require('intellinode');
```
2. call google model:
```js
const speechModel = new RemoteSpeechModel('google-key', 'google');
const audioContent = await speechModel.generateSpeech(new Text2SpeechInput({
  text: text,
  language: 'en-gb'
}));
```
### Hugging Face Inference
1. imports:
```js
const { HuggingWrapper } =  require('intellinode');
```
2. call any model id
```js
const inference = new HuggingWrapper('HF-key');
const result = await huggingWrapper.generateText(
   modelId='facebook/bart-large-cnn',
   data={ inputs: 'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building...' });
```
The available hugging-face functions: `generateText`, `generateImage`, `processImage`.

Check the [samples](https://github.com/Barqawiz/IntelliNode/tree/main/samples/command_sample) for more code details including automating your daily tasks using AI.

## Utilities
### Prompt Engineering
Generate improved prompts using LLMs:
```js
const promptTemp = await Prompt.fromChatGPT("fantasy image with ninja jumping across buildings", openaiApiKey);
console.log(promptTemp.getInput());
```

### Azure Openai Access
To access Openai services from your Azure account, you have to call the following function at the beginning of your application:
```js
const { ProxyHelper } = require('intellinode');
ProxyHelper.getInstance().setAzureOpenai(resourceName);
```
### Custom proxy
Check the code to access the chatbot through a proxy: [proxy chatbot](https://github.com/Barqawiz/IntelliNode/blob/main/samples/command_sample/test_chatbot_proxy.js).

### Model Context Protocol (MCP)
Use every provider from Claude Code, Cursor or VS Code: the `intellinode` command starts an MCP server with cross-provider tools (ask a model, consensus, code review, fixes, tests, components, SQL, OpenAPI, mock data, images):
```bash
claude mcp add intellinode -e OPENAI_API_KEY=sk-... -e ANTHROPIC_API_KEY=sk-ant-... -- npx -y intellinode mcp
```
Or give your chatbot the tools of any MCP server (stdio or HTTP):
```js
const files = new MCPClient({ command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem', process.cwd()] });
const { text } = await new Chatbot(openaiKey).runTools(input, files);   // MCP tools run through the tool loop
```
The setup for Cursor and VS Code, the tool list, the HTTP mode and building your own `MCPServer` are in [MCP_IMPLEMENTATION.md](MCP_IMPLEMENTATION.md).
TypeScript users get full typings from the bundled `index.d.ts`.

### Coding Agent
Point the agent at a repository and give it a task: it reads, edits, searches and runs commands (all confined to the workspace) and keeps iterating until the test command passes, on any chat provider:
```js
const { CodingAgent } = require('intellinode');
const agent = new CodingAgent({ apiKey: anthropicKey, provider: 'anthropic', workspace: './my_repo' });
const result = await agent.run('Fix the failing tests in calc.js', { testCommand: 'npm test' });
console.log(result.success, result.summary);   // result.iterations, result.testOutput
```

# :closed_book: Documentation
- [IntelliNode Docs](https://doc.intellinode.ai/docs/npm): Detailed documentation about IntelliNode.
- [Showcase](https://show.intellinode.ai/): Explore interactive demonstrations of IntelliNode's capabilities.
- [Samples](https://github.com/Barqawiz/IntelliNode/tree/main/samples/command_sample): Get started with IntelliNode using well-documented code samples.
- [Model Evaluation](https://doc.intellinode.ai/docs/npm/functions/llm-evaluation): A swift approach to compare the performance of multiple large langiage models like gpt4, gemini, llama and cohere.
- [LLM as Microservice](https://www.kdnuggets.com/building-microservice-for-multichat-backends-using-llama-and-chatgpt): For scalable production.
- [Fine-tuning Tutorial](https://doc.intellinode.ai/docs/npm/controllers/fine-tuning): Learn how to tune LLMs with yout data.
- [Chatbot With Your Docs](https://doc.intellinode.ai/docs/npm/chatbot/docs-chat): Tutorial to augment any LLM provider with your docs and images.
- [Frontend connector](https://docs.intellinode.ai/docs/npm/frontend): Connect directly to models from your browser without the need for server-side integration.

# Pillars
- **The wrapper layer** provides low-level access to the latest AI models
- **The controller layer** offers a unified input to any AI model by handling the differences. So you can switch between models like Openai and Cohere without changing the code.
- **The function layer** provides abstract functionality that extends based on the app's use cases. For example, an easy-to-use chatbot or marketing content generation utilities.

Intellicode compatible with third party libraries integration like langchain and vector DBs.

# License
Apache License

Copyright 2023 IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.