class EmbedInput {
  constructor({
    texts,
    model = null,
  }) {
    this.texts = texts;
    this.model = model;
  }

  getCohereInputs() {
    const inputs = {
      texts: this.texts,
      ...this.model && { model: this.model },
    };

    return inputs;
  }

  getOpenAIInputs() {
    const inputs = {
      input: this.texts,
      ...this.model && { model: this.model },
    };

    return inputs;
  }

  setDefaultValues(provider) {
    if (provider === "openai") {
      this.model = "text-embedding-ada-002";
    } else if (provider === "cohere") {
      this.model = "embed-multilingual-v2.0";
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = EmbedInput;