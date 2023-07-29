const fs = require('fs');
const { Chatbot, SupportedChatModels } = require("../function/Chatbot");
const { ChatGPTInput, ChatGPTMessage } = require("../model/input/ChatModelInput");

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
    const template = fs.readFileSync(filePath, 'utf-8');
    return new Prompt(template);
  }

  static async fromChatGPT(promptTopic, apiKey, customProxyHelper=null, model='gpt-4') {

    const chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);

    const input = new ChatGPTInput("generate a prompt text for AI models input, following prompt engineering best practices.", 
                              { maxTokens: 800, model: model, temperature: 0.7 });
    input.addUserMessage(`Create a prompt about the following topic as input for the model: ${promptTopic}`);
    
    const responses = await chatbot.chat(input);

    return new Prompt(responses[0].trim());
  }
}

module.exports = Prompt;