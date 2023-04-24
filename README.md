
<p align="center">
<img src="images/intelligent_node_header.png" width="500em">
</p>

<p align="center">

<a href="https://opensource.org/licenses/Apache-2.0" alt="licenses tag">
    <img src="https://img.shields.io/github/license/Barqawiz/IntelliJava?style=flat-square" />
</a>

<img src="https://img.shields.io/badge/builder-intelliCode-green?style=flat-square" />

</p>

# Intelligent Node (IntelliNode)
IntelliNode is the ultimate tool to integrate with the latest language models and deep learning frameworks using **javascript**. The library provides intuitive functions for sending input to models like ChatGPT, WaveNet and Stable diffusion, and receiving generated text, speech, or images. With just a few lines of code, you can easily access the power of cutting-edge AI models to enhance your projects.

# Access the module
`npm i intellinode`

# Examples
## Language models
1. imports:
```js
const { RemoteLanguageModel, LanguageModelInput } = require('intellinode');
```
2. call openai model:
```js
const langModel = new RemoteLanguageModel('openai-key', 'openai');
model_name = 'text-davinci-003'

const results = await langModel.generateText(new LanguageModelInput({
  prompt: 'Write a product description for any device input adapter.',
  model: model_name,
  temperature: 0.7
}));

console.log('Generated text:', results[0]);
```
3. change to call cohere models:

```js
const langModel = new RemoteLanguageModel('cohere-key', 'cohere');
model_name = 'command-xlarge-20221108'
// ... same code
```

## Image models

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

# The code repository setup
## First setup
1. Initiate the project:
```
cd IntelliNode
npm install
```

2. Create a .env file with the access keys:<br>
```
OPENAI_API_KEY=<key_value>
COHERE_API_KEY=<key_value>
GOOGLE_API_KEY=<key_value>
STABILITY_API_KEY=<key_value>
```

## Test cases

1. run the remote language models test cases:
`node test/RemoteLanguageModel.test.js`


2. run the remote image models test cases:
`node test/RemoteImageModel.test.js`


3. run the remote speech models test cases:
`node test/RemoteSpeechModel.test.js`


4. run the chatBot test cases:
`node test/Chatbot.test.js`

# Pillars
- **The wrapper layer** provides low-level access to the latest AI models
- **The controller layer** offers a unified input to any AI model by handling the differences. So you can switch between models like Openai and Cohere without changing the code.
- **The function layer** provides abstract functionality that extends based on the app's use cases. For example, an easy-to-use chatbot or marketing content generation utilities.

# Roadmap
Call for contributors:
- [x] Add support to OpenAI Completion.
- [x] Add support to OpenAI DALL·E 2.
- [ ] Add support to other OpenAI functions.
- [x] Add support to cohere generate API.
- [ ] Add support to Google language models.
- [x] Add support to Google speech models.
- [ ] Add support to Amazon language models.
- [ ] Add support to Midjourney image generation.
- [x] Add support to Stable diffusion.
- [ ] Add support to WuDao 2.0 model.

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
