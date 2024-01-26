const config = require('../../config.json');

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

  getLlamaReplicateInput() {
    return {
      version: this.model,
      input: {
        prompts: this.texts.join("\n\n"),
        prompt_separator: "\n\n",
      }
    };
  }

    getGeminiInputs() {
        return {
            model: this.model,
            content: {
                parts: this.texts.map(text => ({text}))
            }
        };
    }

  setDefaultValues(provider) {
    if (provider === "openai") {
      this.model = "text-embedding-3-small";
    } else if (provider === "cohere") {
      this.model = "embed-multilingual-v2.0";
    } else if (provider === "replicate") {
        this.model = config.models.replicate.llama['llama-2-13b-embeddings-version'];
    } else if (provider === "gemini") {
        this.model = "models/embedding-001";
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = EmbedInput;