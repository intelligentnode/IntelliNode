/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const OpenAIWrapper = require('../wrappers/OpenAIWrapper');
const CohereAIWrapper = require('../wrappers/CohereAIWrapper');
const LanguageModelInput = require('../model/input/LanguageModelInput');
const config = require('../config.json');

const SupportedLangModels = {
  OPENAI: 'openai',
  COHERE: 'cohere',
};

class RemoteLanguageModel {
  constructor(keyValue, provider) {
    if (!provider) {
      provider = SupportedLangModels.OPENAI;
    }

    const supportedModels = RemoteLanguageModel.getSupportedModels();

    if (supportedModels.includes(provider)) {
      this.initiate(keyValue, provider);
    } else {
      const models = supportedModels.join(' - ');
      throw new Error(`The received keyValue is not supported. Send any model from: ${models}`);
    }
  }

  initiate(keyValue, keyType) {
    this.keyType = keyType;

    if (keyType === SupportedLangModels.OPENAI) {
      this.openaiWrapper = new OpenAIWrapper(keyValue);
    } else if (keyType === SupportedLangModels.COHERE) {
      this.cohereWrapper = new CohereAIWrapper(keyValue);
    } else {
      throw new Error('Invalid provider name');
    }
  }

  static getSupportedModels() {
    return Object.values(SupportedLangModels);
  }

  async generateText(langInput) {

    let inputs;

    if (langInput instanceof LanguageModelInput) {
      if (this.keyType === SupportedLangModels.OPENAI) {
        inputs = langInput.getOpenAIInputs();
      } else if (this.keyType === SupportedLangModels.COHERE) {
        inputs = langInput.getCohereInputs();
      } else {
        throw new Error('The keyType is not supported');
      }
    } else if (typeof langInput === 'object') {
      inputs = langInput;
    } else {
      throw new Error('Invalid input: Must be an instance of LanguageModelInput or a dictionary');
    }

    if (this.keyType === SupportedLangModels.OPENAI) {
      const results = await this.openaiWrapper.generateText(inputs);
      return results.choices.map((choice) => choice.text);
    } else if (this.keyType === SupportedLangModels.COHERE) {
      // Cohere removed the Generate API, so completions are served through the Chat API.
      const chatParams = {
        model: inputs.model || config.url.cohere.models.chat,
        message: inputs.prompt,
        ...(inputs.temperature != null && { temperature: inputs.temperature }),
        ...(inputs.max_tokens != null && { max_tokens: inputs.max_tokens }),
      };
      const results = [];
      const generations = Math.max(1, inputs.num_generations || 1);
      for (let i = 0; i < generations; i++) {
        const response = await this.cohereWrapper.generateChatText(chatParams);
        results.push(response.text);
      }
      return results;
    } else {
      throw new Error('The keyType is not supported');
    }
  }
}

module.exports = {
  RemoteLanguageModel,
  SupportedLangModels,
};