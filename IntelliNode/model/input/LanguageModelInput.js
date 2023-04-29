/*
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
*/
class LanguageModelInput {
  constructor({
    prompt,
    model = null,
    temperature = null,
    maxTokens = null,
    numberOfOutputs = 1,
  }) {
    this.prompt = prompt;
    this.model = model;
    this.temperature = temperature;
    this.maxTokens = maxTokens;
    this.numberOfOutputs = numberOfOutputs;
  }

  getCohereInputs() {
    const inputs = {
      prompt: this.prompt,
      ...this.model && { model: this.model },
      ...this.temperature && { temperature: this.temperature },
      ...this.maxTokens && { max_tokens: this.maxTokens },
      ...this.numberOfOutputs && { num_generations: this.numberOfOutputs },
    };

    return inputs;
  }

  getOpenAIInputs() {
    const inputs = {
      prompt: this.prompt,
      ...this.model && { model: this.model },
      ...this.temperature && { temperature: this.temperature },
      ...this.maxTokens && { max_tokens: this.maxTokens },
      ...this.numberOfOutputs && { n: this.numberOfOutputs },
    };

    return inputs;
  }

  setDefaultValues(provider) {
    if (provider === "openai") {
      this.model = "code-davinci-003";
      this.temperature = 0.7;
      this.maxTokens = 50;
      this.numberOfOutputs = 1;
    } else if (provider === "cohere") {
      this.model = "command";
      this.temperature = 0.75;
      this.maxTokens = 20;
      this.numberOfOutputs = 1;
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = LanguageModelInput;