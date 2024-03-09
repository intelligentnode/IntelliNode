
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
- Add Anthropic claude 3 chat.
- Add Google Gemini chat and vision.
- Add Mistral SMoE model as a chatbot provider (open source mixture of experts).
- Improve Llama v2 chat speed and support llama code models. 🦙
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
2. call:
```js
// set chatGPT system mode and the user message.
const input = new ChatGPTInput('You are a helpful assistant.');
input.addUserMessage('What is the distance between the Earth and the Moon?');

// get chatGPT responses.
const bot = new Chatbot(apiKey);
const responses = await bot.chat(input);
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
const responses = await geminiBot.chat(geminiInput);
```

The documentation on how to switch between ChatGPT, Mistral, Anthropic and LLama can be found in the [IntelliNode Wiki](https://docs.intellinode.ai/docs/npm/chatbot/get-started).

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

2. call DALL·E:
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

### Language models
1. imports:
```js
const { RemoteLanguageModel, LanguageModelInput } = require('intellinode');
```
2. call openai model:
```js
const langModel = new RemoteLanguageModel('openai-key', 'openai');
model_name = 'gpt-3.5-turbo-instruct'

const results = await langModel.generateText(new LanguageModelInput({
  prompt: 'Write a product description for smart plug that works with voice assistant.',
  model: model_name,
  temperature: 0.7
}));

console.log('Generated text:', results[0]);
```
3. change to call cohere models:

```js
const langModel = new RemoteLanguageModel('cohere-key', 'cohere');
model_name = 'command'
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

# :closed_book: Documentation
- [IntelliNode Docs](https://doc.intellinode.ai/docs/npm): Detailed documentation about IntelliNode.
- [Showcase](https://show.intellinode.ai/): Explore interactive demonstrations of IntelliNode's capabilities.
- [Samples](https://github.com/Barqawiz/IntelliNode/tree/main/samples/command_sample): Get started with IntelliNode using well-documented code samples.
- [Model Evaluation](https://doc.intellinode.ai/docs/npm/functions/llm-evaluation): A swift approach to compare the performance of multiple large langiage models like gpt4, gemini, llama and cohere.
- [LLM as Microservice](https://www.kdnuggets.com/building-microservice-for-multichat-backends-using-llama-and-chatgpt): For scalable production.
- [Fine-tuning Tutorial](https://doc.intellinode.ai/docs/npm/controllers/fine-tuning): Learn how to tune LLMs with yout data.
- [Chatbot With Your Docs](https://doc.intellinode.ai/docs/npm/chatbot/docs-chat): Tutorial to augment any LLM provider with your docs and images.

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