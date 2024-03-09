/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const config = require('../../config.json');

class ChatGPTMessage {
  constructor(content, role, name = null) {
    this.content = content;
    this.role = role;
    this.name = name;
  }

  isSystemRole() {
    return this.role === 'system';
  }
}

class ChatModelInput {
  constructor(options = {}) { 
    this.searchK = options.searchK || 3;
    this.attachReference = options.attachReference || false;
  }
  
  getChatInput() {
    return null;
  }
}

class ChatGPTInput extends ChatModelInput {
  constructor(systemMessage, options = {}) {
    super(options);
    if (
      systemMessage instanceof ChatGPTMessage &&
      systemMessage.isSystemRole()
    ) {
      this.messages = [systemMessage];
    } else if (typeof systemMessage === 'string') {
      this.messages = [new ChatGPTMessage(systemMessage, 'system')];
    } else {
      throw new Error(
        'The input type should be system to define the chatbot theme or instructions.'
      );
    }
    this.model = options.model || 'gpt-3.5-turbo';
    this.temperature = options.temperature || 1;
    this.maxTokens = options.maxTokens || null;
    this.numberOfOutputs = 1;
  }

  addMessage(message) {
    this.messages.push(message);
  }

  addUserMessage(prompt) {
    this.messages.push(new ChatGPTMessage(prompt, 'user'));
  }

  addAssistantMessage(prompt) {
    this.messages.push(new ChatGPTMessage(prompt, 'assistant'));
  }

  addSystemMessage(prompt) {
    this.messages.push(new ChatGPTMessage(prompt, 'system'));
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

  getChatInput() {
    const messages = this.messages.map((message) => {
      if (message.name) {
        return {
          role: message.role,
          name: message.name,
          content: message.content,
        };
      } else {
        return {
          role: message.role,
          content: message.content,
        };
      }
    });

    const params = {
      model: this.model,
      messages: messages,
      ...(this.temperature && { temperature: this.temperature }),
      ...(this.numberOfOutputs && { n: this.numberOfOutputs }),
      ...(this.maxTokens && { max_tokens: this.maxTokens }),
    };

    return params;
  }
}

class CohereInput extends ChatGPTInput {
  constructor(systemMessage, options = {}) {
    super(systemMessage, options);
    this.web = options.web || false;
    this.model = options.model || 'command';
  }

  getChatInput() {
    if (this.messages.length < 1) {
        throw new Error("At least one message is required for Cohere API");
    }

    const chatHistory = [];
    const latestMessage = this.messages[this.messages.length - 1];

    for (let i = 0; i < this.messages.length - 1; i++) {
        const message = this.messages[i];
        chatHistory.push({
            'id': i,
            'role': message.role,
            'message': message.content
        });
    }

    const params = {
        'model': this.model,
        'message': latestMessage.content,
        'chat_history': chatHistory,
        ...(this.web && {'connectors': [{id: 'web-search'}]}),
    };

    return params;
  }

}

class MistralInput extends ChatGPTInput {
  constructor(systemMessage, options = {}) {
    super(systemMessage, options);
    
    this.model = options.model || 'mistral-medium'; 

  }

  getChatInput() {
    // Prepare the messages in the expected format
    const messages = this.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    // Construct Mistral input parameters
    const params = {
      model: this.model,
      messages: messages,
    };

    return params;
  }
}

class GeminiInput extends ChatModelInput {
  constructor(systemMessage, options = {}) {
    super(options);
    this.messages = [];
    this.maxOutputTokens = options.maxTokens
    this.temperature = options.temperature

    if (systemMessage && typeof systemMessage === 'string') {
      this.addUserMessage(systemMessage);
      this.addModelMessage('I will response based on the provided instructions.');
    }
  }

  addUserMessage(text) {
    this.messages.push({
      role: "user",
      parts: [{ text }]
    });
  }

  addModelMessage(text) {
    this.messages.push({
      role: "model",
      parts: [{ text }]
    });
  }

  addAssistantMessage(text) {
    this.addModelMessage(text);
  }

  getChatInput() {
    return {
      contents: this.messages,
      generationConfig: { 
        ...(this.temperature && { temperature: this.temperature }),
        ...(this.maxOutputTokens && { maxOutputTokens: this.maxOutputTokens }),
      }
    };
  }

  cleanMessages() {
    this.messages = [];
  }

  deleteLastMessage(message) {
    if (this.messages.length > 0) {
      this.messages.splice(-1, 1);
      return true;
    }
    return false;
  }

}

class AnthropicInput extends ChatModelInput {

  constructor(system, options = {}) {
      super(options);
      this.system = system;
      this.model = options.model || 'claude-3-sonnet-20240229'; 
      this.maxTokens = options.maxTokens  || 800;
      this.temperature = options.temperature || 1.0;
      this.messages = [];
  }

  addUserMessage(text) {
      this.messages.push({
          role: "user",
          content: text
      });
  }

  addAssistantMessage(text) {
      this.messages.push({
          role: "assistant",
          content: text
      });
  }

  getChatInput() {
      return {
          system: this.system,
          model: this.model,
          messages: this.messages,
          max_tokens: this.maxTokens,
          temperature: this.temperature,
      };
  }
}

class ChatLLamaInput extends ChatModelInput {
  constructor(systemMessage, options = {}) {
    super(options);
    if (
      systemMessage instanceof ChatGPTMessage &&
      systemMessage.isSystemRole()
    ) {
      this.system_prompt = systemMessage.content;
    } else if (typeof systemMessage === 'string') {
      this.system_prompt = systemMessage;
    } else {
      throw new Error(
        'The input type should be system to define the bot theme or instructions.'
      );
    }

    if (!options.model) {
      console.log(
        'warning: send the model name or use the tuned llama inputs (LLamaReplicateInput, LLamaAWSInput)'
      );
    }

    this.model = options.model || '';
    this.version = options.version || '';
    this.temperature = options.temperature || 0.5;
    this.max_new_tokens = options.maxTokens || 500;
    this.top_p = options.top_p || 1;
    this.prompt = options.prompt || '';
    this.repetition_penalty = options.repetition_penalty || 1;
    this.debug = options.debug || false;
  }

  addUserMessage(prompt) {
    if (this.prompt) {
      this.prompt += `\nUser: ${prompt}`;
    } else {
      this.prompt = `User: ${prompt}`;
    }
  }

  addAssistantMessage(prompt) {
    if (this.prompt) {
      this.prompt += `\nAssistant: ${prompt}`;
    } else {
      this.prompt = `Assistant: ${prompt}`;
    }
  }

  cleanMessages() {
    this.prompt = '';
  }

  getChatInput() {
    return {
      model: this.model,
      inputData: {
        input: {
          prompt: this.prompt,
          system_prompt: this.system_prompt,
          max_new_tokens: this.max_new_tokens,
          temperature: this.temperature,
          top_p: this.top_p,
          repetition_penalty: this.repetition_penalty,
          debug: this.debug,
        },
      },
    };
  }
}

class LLamaReplicateInput extends ChatLLamaInput {
  constructor(systemMessage, options = {}) {
    options.model =
      options.model || config.models.replicate.llama['13b'];
    options.version = options.version;
    super(systemMessage, options);
    this.top_k = options.top_k || null;
    this.top_p = options.top_p || null;
    this.min_new_tokens = options.min_new_tokens || null;
    this.system_prompt = options.system_prompt || null;
    this.repetition_penalty = options.repetition_penalty || null;
  }

  getChatInput() {
    if (this.version == null || this.version == '') {
      this.version =
        config.models.replicate.llama[`${this.model}-version`];
    }

    var myData = {
      model: this.model,
      inputData: {
        version: this.version,
        input: {
          prompt: this.prompt,
          max_new_tokens: this.max_new_tokens,
          temperature: this.temperature,
          debug: this.debug,
        },
      },
    };

    if (this.top_k) myData.inputData.input.top_k = this.top_k;
    if (this.top_p) myData.inputData.input.top_p = this.top_p;
    if (this.system_prompt)
      myData.inputData.input.system_prompt = this.system_prompt;
    if (this.min_new_tokens)
      myData.inputData.input.min_new_tokens = this.min_new_tokens;
    if (this.repetition_penalty)
      myData.inputData.input.repetition_penalty =
        this.repetition_penalty;

    return myData;
  }
}

class LLamaSageInput extends ChatModelInput {
  constructor(systemMessage, parameters = {}, options = {}) {
    super(options);
    if (
      systemMessage instanceof ChatGPTMessage &&
      systemMessage.isSystemRole()
    ) {
      this.messages = [systemMessage];
    } else if (typeof systemMessage === 'string') {
      this.messages = [new ChatGPTMessage(systemMessage, 'system')];
    } else {
      throw new Error(
        'The input type should be system to define the chatbot theme or instructions.'
      );
    }

    this.parameters = parameters;
  }

  addMessage(message) {
    this.messages.push(message);
  }

  addUserMessage(prompt) {
    this.messages.push(new ChatGPTMessage(prompt, 'user'));
  }

  addAssistantMessage(prompt) {
    this.messages.push(new ChatGPTMessage(prompt, 'assistant'));
  }

  addSystemMessage(prompt) {
    this.messages.push(new ChatGPTMessage(prompt, 'system'));
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

  getChatInput() {
    return {
      parameters: this.parameters,
      inputs: [
        this.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
    };
  }
}

module.exports = {
  ChatGPTInput,
  ChatModelInput,
  ChatGPTMessage,
  ChatLLamaInput,
  LLamaSageInput,
  LLamaReplicateInput,
  CohereInput,
  MistralInput,
  GeminiInput,
  AnthropicInput
};
