const FileHelper = require('./FileHelper')
const { Chatbot, SupportedChatModels } = require("../function/Chatbot");
const { ChatGPTInput, ChatGPTMessage } = require("../model/input/ChatModelInput");
const SystemHelper = require("../utils/SystemHelper");
const config = require('../config.json');
const { isReasoningModel } = require('./ModelHelper');

class Prompt {
  constructor(template) {
    this.template = template;
  }

  getInput() {
    return this.template;
  }

  format(data) {
    const regex = /\$\{([^}]+)\}/g;
    let result = this.template;
    let match;

    while ((match = regex.exec(this.template)) !== null) {
      const key = match[1];
      const value = data.hasOwnProperty(key) ? data[key] : '';

      result = result.replace(match[0], value);
    }

    return result;
  }

  static fromText(template) {
    return new Prompt(template);
  }

  static fromFile(filePath) {
    const template = FileHelper.readData(filePath, 'utf-8');
    return new Prompt(template);
  }

  static async fromChatGPT(promptTopic, apiKey, customProxyHelper=null, model=config.url.openai.models.chat) {

    const chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);

    const promptExample = new SystemHelper().loadPrompt("prompt_example");

    // reasoning models (gpt-5+) spend output tokens on thinking, so only cap older models
    const options = isReasoningModel(model) ? { model: model } : { maxTokens: 800, model: model, temperature: 0.7 };
    const input = new ChatGPTInput("generate a prompt text, following prompt engineering best practices", options);
    input.addUserMessage(promptExample);
    input.addUserMessage(`Create a prompt: ${promptTopic}`);
    
    const responses = await chatbot.chat(input);

    return new Prompt(responses[0].trim());
  }
}

module.exports = Prompt;
