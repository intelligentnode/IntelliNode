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
      this.model = "command-xlarge-20221108";
      this.temperature = 0.75;
      this.maxTokens = 20;
      this.numberOfOutputs = 1;
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = LanguageModelInput;