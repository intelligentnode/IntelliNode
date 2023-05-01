# Intelligent Node (IntelliNode)
IntelliNode is the ultimate tool to integrate with the latest language models and deep learning frameworks using **javascript**. The library provides intuitive functions for sending input to models like ChatGPT, WaveNet and Stable diffusion, and receiving generated text, speech, or images. With just a few lines of code, you can easily access the power of cutting-edge AI models to enhance your projects.

# Pillars
- **The wrapper layer** provides low-level access to the latest AI models
- **The controller layer** offers a unified input to any AI model by handling the differences. So you can switch between models like Openai and Cohere without changing the code.
- **The function layer** provides abstract functionality that extends based on the app's use cases. For example, an easy-to-use chatbot or marketing content generation utilities.

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
### Semantic Search
1. imports:
```js
const { SemanticSearch } = require('intellinode');
```
2. call:
```js
const search = new SemanticSearch(apiKey);
// pivotItem: item to search.
// searchArray: array of strings to search through.
const results = await search.getTopMatches(pivotItem, searchArray, numberOfMatches);
const filteredArray = search.filterTopMatches(results, searchArray)
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
The available functions in this version: `generateText, generateImage, processImage`. 

Check the [samples](https://github.com/Barqawiz/IntelliNode/tree/main/samples/command_sample) for more code details.

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
