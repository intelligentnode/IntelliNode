/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
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

  setDefaultValues(provider, tokenCount) {

    this.setDefaultModels(provider)
    if (provider === "openai") {
      this.temperature = 0.7;
      this.maxTokens = tokenCount;
      this.numberOfOutputs = 1;
    } else if (provider === "cohere") {
      this.temperature = 0.75;
      this.maxTokens = tokenCount;
      this.numberOfOutputs = 1;
    } else {
      throw new Error("Invalid provider name");
    }
  }

  setDefaultModels(provider) {
    if (provider === "openai") {
      this.model = "gpt-3.5-turbo-instruct";
    } else if (provider === "cohere") {
      this.model = "command";
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = LanguageModelInput;