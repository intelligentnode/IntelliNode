/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class ChatGPTMessage {
  constructor(content, role) {
    this.content = content;
    this.role = role;
  }

  isSystemRole() {
    return this.role === "system";
  }
}

class ChatModelInput {}

class ChatGPTInput extends ChatModelInput {
  constructor(systemMessage, options = {}) {
    super();
    if (systemMessage instanceof ChatGPTMessage && systemMessage.isSystemRole()) {
      this.messages = [systemMessage];
    } else if (typeof systemMessage === "string") {
      this.messages = [new ChatGPTMessage(systemMessage, "system")];
    } else {
      throw new Error(
        "The input type should be system to define the chatbot theme or instructions."
      );
    }
    this.model = options.model || "gpt-3.5-turbo";
    this.temperature = options.temperature || 1;
    this.maxTokens = options.maxTokens || null;
    this.numberOfOutputs = 1;
  }

  addMessage(message) {
    this.messages.push(message);
  }

  addUserMessage(prompt) {
    this.messages.push(new ChatGPTMessage(prompt, "user"));
  }

  cleanMessages() {
    if (this.messages.length > 1) {
      const firstMessage = this.messages[0];
      this.messages = [firstMessage];
    }
  }

  deleteLastMessage(message) {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const currentMessage = this.messages[i];
      if (
        currentMessage.content === message.content &&
        currentMessage.role === message.role
      ) {
        this.messages.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  getChatGPTInput() {
    const messages = this.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const params = {
      model: this.model,
      messages: messages,
      ...this.temperature && { temperature: this.temperature },
      ...this.numberOfOutputs && { n: this.numberOfOutputs },
      ...this.maxTokens && { max_tokens: this.maxTokens },
    };

    return params;
  }
}

module.exports = {
  ChatGPTInput,
  ChatModelInput,
  ChatGPTMessage,
};