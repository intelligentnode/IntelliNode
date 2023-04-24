const OpenAIWrapper = require("../wrappers/OpenAIWrapper");
const { ChatGPTInput, ChatGPTMessage } = require("../model/input/ChatModelInput");

const SupportedChatModels = {
  OPENAI: "openai",
};

class Chatbot {
  constructor(keyValue, provider = SupportedChatModels.OPENAI) {
    const supportedModels = this.getSupportedModels();

    if (supportedModels.includes(provider)) {
      this.initiate(keyValue, provider);
    } else {
      const models = supportedModels.join(" - ");
      throw new Error(
        `The received keyValue is not supported. Send any model from: ${models}`
      );
    }
  }

  initiate(keyValue, provider) {
    this.provider = provider;

    if (provider === SupportedChatModels.OPENAI) {
      this.openaiWrapper = new OpenAIWrapper(keyValue);
    } else {
      throw new Error("Invalid provider name");
    }
  }

  getSupportedModels() {
    return Object.values(SupportedChatModels);
  }

  async chat(modelInput) {
    if (this.provider === SupportedChatModels.OPENAI) {
      return this._chatGPT(modelInput);
    } else {
      throw new Error("The provider is not supported");
    }
  }

  async _chatGPT(modelInput) {
    let params;

    if (modelInput instanceof ChatGPTInput) {
      params = modelInput.getChatGPTInput();
    } else if (typeof modelInput === "object") {
      params = modelInput;
    } else {
      throw new Error("Invalid input: Must be an instance of ChatGPTInput or a dictionary");
    }

    const results = await this.openaiWrapper.generateChatText(params);
    return results.choices.map((choice) => choice.message.content);
  }
}

module.exports = {
  Chatbot,
  SupportedChatModels,
};