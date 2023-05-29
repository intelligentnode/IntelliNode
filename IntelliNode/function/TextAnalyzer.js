/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0
*/
const { RemoteLanguageModel, SupportedLangModels } = require("../controller/RemoteLanguageModel");
const LanguageModelInput = require("../model/input/LanguageModelInput");
const SystemHelper = require("../utils/SystemHelper");

class TextAnalyzer {
  constructor(keyValue, provider = SupportedLangModels.OPENAI) {
    if (!Object.values(SupportedLangModels).includes(provider)) {
      throw new Error(`The specified provider '${provider}' is not supported. Supported providers are: ${Object.values(SupportedLangModels).join(", ")}`);
    }
    this.provider = provider;
    this.remoteLanguageModel = new RemoteLanguageModel(keyValue, provider);
    this.systemHelper = new SystemHelper();
  }

  async summarize(text, options = {}) {
    const summaryPromptTemplate = this.systemHelper.loadPrompt("summary");
    const prompt = summaryPromptTemplate.replace("${text}", text);
    const modelInput = new LanguageModelInput({
      prompt,
      maxTokens: options.maxTokens || null,
      temperature: options.temperature || 0.5,
    });
    modelInput.setDefaultModels(this.provider);
    const [summary] = await this.remoteLanguageModel.generateText(modelInput);
    return summary.trim();
  }

  async sentimentAnalysis(text, options = {}) {
    const mode = this.systemHelper.loadPrompt("sentiment");
    const prompt = `${mode}\n\nAnalyze the sentiment of the following text: ${text}\n\nSentiment: `;

    const modelInput = new LanguageModelInput({
      prompt,
      maxTokens: options.maxTokens || 60,
      temperature: options.temperature || 0,
    });
    modelInput.setDefaultModels(this.provider);
    const [sentiment] = await this.remoteLanguageModel.generateText(modelInput);

    const sentiment_output = JSON.parse(sentiment.trim());
    return sentiment_output;
  }
}

module.exports = { TextAnalyzer };