
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

Integrate your data with the latest language models and deep learning frameworks using intellinode **javascript**. The library provides intuitive functions for sending input to models like ChatGPT, WaveNet and Stable diffusion, and receiving generated text, speech, or images. With just a few lines of code, you can easily access the power of cutting-edge AI models to enhance your projects.

# Latest Updates
- Update the default models: GPT-5.5, Claude Sonnet 5, Gemini 3.6 Flash, Mistral Medium, Command A and gpt-image-2. 🚀
- Add streaming for GPT-5+, Anthropic and Mistral, plus tool calling for OpenAI, Anthropic and Mistral.
- Fix the frontend bundle: Anthropic browser access, streaming in browsers and Gen templates.
- Add support for OpenAI GPT-5 with reasoning effort control. 🧠
- Add support for self-hosted vLLM models.
- Generate frontend version from intellinode.
- Integrated Nvidia-hosted models (DeepSeek and Llama3 🦙).
- Add Anthropic claude 3.7 chat.
- Add Google Gemini chat and vision.
- Update stable diffusion to use the XL model engine. 🎨
- Add support for hugging face inference. 🤗
- Support in-memory semantic search. 🔍

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

### Anthropic Claude Chatbot
1. imports:
```js
const { Chatbot, AnthropicInput, SupportedChatModels } = require('intellinode');
```
2. call (Claude Sonnet 5 is default, use `claude-opus-5` for Opus):
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
1. imports:
```js
const { Gen } = require('intellinode');
```
2. call:
```js
// one line to generate blog post
const blogPost = await Gen.get_blog_post(prompt, openaiApiKey);
```
```js
// or generate html page code
text = 'a registration page with flat modern theme.'
await Gen.save_html_page(text, folder, file_name, openaiKey);
```
```js
// or convert csv data to charts
const csv_str_data = '<your csv as string>'
const topic = "<the csv topic>";

const htmlCode = await Gen.generate_dashboard(csv_str_data, topic, openaiKey, num_graphs=2);
```

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
Connect to external tools and data sources via MCP servers (good to have, not core):
```js
const { MCPClient } = require('intellinode');

// Initialize MCP client pointing to your MCP server
const mcpClient = new MCPClient('http://localhost:3000');

// Fetch available tools from MCP server
const tools = await mcpClient.initialize();
console.log('Available tools:', mcpClient.getToolNames());

// Call a tool
const result = await mcpClient.callTool('get_weather', { 
  location: 'New York',
  units: 'celsius' 
});

// Use tools with your chatbot prompts
const toolsList = mcpClient.listTools();
console.log('Tools:', toolsList);
```

Supported MCP servers include: Filesystem, GitHub, Slack, Google Drive, and more. See [MCP Documentation](https://modelcontextprotocol.io) for available servers.

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