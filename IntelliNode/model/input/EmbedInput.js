const config = require('../../config.json');

class EmbedInput {
  constructor({
    texts,
    model = null,
    inputType = null,
  }) {
    this.texts = texts;
    this.model = model;
    // Cohere: search_document, search_query, classification or clustering. NVIDIA: query or passage.
    this.inputType = inputType;
  }

  getCohereInputs() {
    const inputs = {
      texts: this.texts,
      ...this.model && { model: this.model },
      // Cohere embed v3 and newer require an input type.
      input_type: this.inputType || 'search_document',
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

  getNvidiaInputs(input_type="query") {
    return {
      input: this.texts,
      model: this.model || config.nvidia.models.embed,
      input_type: this.inputType || input_type,
      encoding_format: "float",
      truncate: "NONE"
    };
  }

  getVLLMInputs() {
      return {
        texts: this.texts,
      };
  }

  setDefaultValues(provider) {
    if (provider === "openai") {
      this.model = config.url.openai.models.embed;
    } else if (provider === "cohere") {
      this.model = config.url.cohere.models.embed;
    } else if (provider === "replicate") {
        this.model = config.models.replicate.llama['llama-2-13b-embeddings-version'];
    } else if (provider === "gemini") {
        this.model = `models/${config.url.gemini.models.embed}`;
    } else if (provider === "nvidia") {
        this.model = config.nvidia.models.embed;
    } else if (provider === "vllm") {
        this.model = null;
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = EmbedInput;
