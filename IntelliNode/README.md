
# Intelligent Node (IntelliNode)
### Unified prompt, evaluation, and production integration to any AI model


<p>

<a href="https://github.com/Barqawiz/IntelliNode/blob/main/LICENSE" alt="licenses tag" target="_blank">
    <img src="https://img.shields.io/github/license/Barqawiz/IntelliJava?style=flat-square" />
</a>


<a href="https://discord.gg/VYgCh2p3Ww" alt="discord invite" target="_blank">
    <img src="https://img.shields.io/badge/Discord-Community-light?style=flat-square" />
</a>

</p>

IntelliNode is the ultimate tool to integrate with the latest language models and deep learning frameworks using **javascript**. The library provides intuitive functions for sending input to models like ChatGPT, WaveNet and Stable diffusion, and receiving generated text, speech, or images. With just a few lines of code, you can easily access the power of cutting-edge AI models to enhance your projects.

# Latest Updates
- Upgrade Llama v2 to the latest version and support chat and code. 🦙
- Add Gen function, the fastest way to generate text, speech, code, or images. :bullettrain_side:
- Update stable diffusion to use the XL model engine. 🎨
- Add support for hugging face inference. 🤗
- Generate tuned prompts using LLM.
- Add support for huge data semantic search. 🔍
- Update the module to support next integration.
- Update chatGPT to support function calls (empowering automation). 🤖

Join the [discord server](https://discord.gg/VYgCh2p3Ww) for the latest updates and community support.

# Examples
## Functions

### Chatbot
1. imports:
```js
const { Chatbot, ChatGPTInput, ChatGPTMessage } = require('intellinode');
```
2. call:
```js
// set the system mode and the user message.
const input = new ChatGPTInput('You are a helpful assistant.');
input.addUserMessage('What is the distance between the Earth and the Moon?');

// get the responses from the chatbot
const bot = new Chatbot(apiKey);
const responses = await bot.chat(input);
```
The documentation on how to switch the chatbot between ChatGPT and LLama can be found in the [IntelliNode Wiki](https://github.com/Barqawiz/IntelliNode/wiki/ChatBot).
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
model_name = 'text-davinci-003'

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
Check the code to access the chatbot through a proxy: [proxy chatbot](https://github.com/Barqawiz/IntelliNode/blob/main/samples/command_sample/test_chatbot_proxy.js)

# :closed_book: Documentation
- [IntelliNode Wiki](https://github.com/Barqawiz/IntelliNode/wiki): Check the wiki page for indepth instructions and practical use cases.
- [Showcase](https://show.intellinode.ai/): Experience the potential of Intellinode in action, and use your keys to generate content and html pages.
- [Samples](https://github.com/Barqawiz/IntelliNode/tree/main/samples/command_sample): Explore a code sample with detailed setup documentation to get started with Intellinode.
- [Model Evaluation](https://github.com/Barqawiz/IntelliNode/wiki/Model-Evaluation): Demonstrate a swift approach to compare the performance of multiple models against designated target answers.
- [Articles](https://www.intellinode.ai/articles): Tutorials about intelliNode and data science topics.
- [LLM as Microservice](https://www.kdnuggets.com/building-microservice-for-multichat-backends-using-llama-and-chatgpt): For scalable production.

# Pillars
- **The wrapper layer** provides low-level access to the latest AI models
- **The controller layer** offers a unified input to any AI model by handling the differences. So you can switch between models like Openai and Cohere without changing the code.
- **The function layer** provides abstract functionality that extends based on the app's use cases. For example, an easy-to-use chatbot or marketing content generation utilities.

# License
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
