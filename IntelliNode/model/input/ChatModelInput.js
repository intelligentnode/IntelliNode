/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const config = require('../../config.json');
const {
  isReasoningModel,
  isReasoningChatModel,
  stripRouteOverride,
  defaultReasoningEffort,
  claudeRejectsSamplingParams,
  toChatTools,
  toResponsesTools,
  toAnthropicTools,
  toChatToolChoice,
  toResponsesToolChoice,
  toAnthropicToolChoice,
} = require('../../utils/ModelHelper');

let cohereWebWarningShown = false;

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

// Convert chat-completions content parts into the Responses API part types.
function toResponsesContent(content, role) {
  if (!Array.isArray(content)) return content;
  const textType = role === 'assistant' ? 'output_text' : 'input_text';
  return content.map((part) => {
    if (!part || typeof part !== 'object') return part;
    if (part.type === 'text') return { type: textType, text: part.text };
    if (part.type === 'image_url') {
      const image = part.image_url;
      const url = typeof image === 'string' ? image : image && image.url;
      return { type: 'input_image', image_url: url, ...(image && image.detail && { detail: image.detail }) };
    }
    return part;
  });
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
    this.model = options.model || config.url.openai.models.chat;
    this.temperature = options.temperature ?? 1;
    this.maxTokens = options.maxTokens || null;
    this.numberOfOutputs = 1;
    // gpt-5+ reasoning effort: none, low, medium, high, xhigh (the original gpt-5 also accepts minimal).
    // Defaults to low, or medium for the *-pro models that reject low.
    this.effort = options.effort || options.reasoningEffort || defaultReasoningEffort(this.model);
    // gpt-5+ answer length: low, medium, high.
    this.verbosity = options.verbosity || null;
    // Function tools in chat-completions or Responses format; converted for the target endpoint.
    this.tools = options.tools || null;
    this.toolChoice = options.toolChoice ?? null;
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
    // gpt-5 and newer use the Responses API (a ":chat" model suffix keeps chat completions).
    if (isReasoningModel(this.model)) {
      return this.getResponsesInput();
    }

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

    // o-series and gpt-5+ on chat completions reject max_tokens and custom temperature.
    const reasoningChat = isReasoningChatModel(this.model);

    return {
      model: stripRouteOverride(this.model),
      messages: messages,
      ...(!reasoningChat && this.temperature != null && { temperature: this.temperature }),
      ...(this.numberOfOutputs && { n: this.numberOfOutputs }),
      ...(this.maxTokens && (reasoningChat ? { max_completion_tokens: this.maxTokens } : { max_tokens: this.maxTokens })),
      ...(this.tools && { tools: toChatTools(this.tools) }),
      ...(this.toolChoice != null && { tool_choice: toChatToolChoice(this.toolChoice) }),
    };
  }

  // Request body for the Responses API (/v1/responses).
  getResponsesInput() {
    // Responses input messages accept role and content only (no name field).
    const input = this.messages.map((message) => ({
      role: message.role,
      content: toResponsesContent(message.content, message.role),
    }));

    return {
      model: stripRouteOverride(this.model),
      input: input,
      reasoning: { effort: this.effort || defaultReasoningEffort(this.model) },
      ...(this.maxTokens && { max_output_tokens: this.maxTokens }),
      ...(this.verbosity && { text: { verbosity: this.verbosity } }),
      ...(this.tools && { tools: toResponsesTools(this.tools) }),
      ...(this.toolChoice != null && { tool_choice: toResponsesToolChoice(this.toolChoice) }),
    };
  }
}

class CohereInput extends ChatGPTInput {
  constructor(systemMessage, options = {}) {
    super(systemMessage, options);
    this.web = options.web || false;
    this.model = options.model || config.url.cohere.models.chat;
    this.temperature = options.temperature ?? null;
  }

  addUserMessage(prompt) {
    this.messages.push(new ChatGPTMessage(prompt, 'User'));
  }

  addAssistantMessage(prompt) {
    this.messages.push(new ChatGPTMessage(prompt, 'Chatbot'));
  }

  addSystemMessage(prompt) {
    this.messages.push(new ChatGPTMessage(prompt, 'System'));
  }

  getChatInput() {
    if (this.messages.length < 1) {
        throw new Error("At least one message is required for Cohere API");
    }

    if (this.web && !cohereWebWarningShown) {
        cohereWebWarningShown = true;
        console.warn("CohereInput: the 'web' option is ignored because Cohere removed connectors from the Chat API.");
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
        ...(this.temperature != null && { 'temperature': this.temperature }),
        ...(this.maxTokens && { 'max_tokens': this.maxTokens }),
    };

    return params;
  }

}

class MistralInput extends ChatGPTInput {
  constructor(systemMessage, options = {}) {
    super(systemMessage, options);
    
    this.model = options.model || config.url.mistral.models.chat;
    this.temperature = options.temperature ?? null;
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
      ...(this.temperature != null && { temperature: this.temperature }),
      ...(this.maxTokens && { max_tokens: this.maxTokens }),
      ...(this.tools && { tools: toChatTools(this.tools) }),
      ...(this.toolChoice != null && { tool_choice: toChatToolChoice(this.toolChoice) }),
    };

    return params;
  }
}

class GeminiInput extends ChatModelInput {
  constructor(systemMessage, options = {}) {
    super(options);
    this.messages = [];
    // the bare 'gemini' placeholder from older examples maps to the default model
    this.model = options.model && options.model !== 'gemini' ? options.model : config.url.gemini.models.chat;
    this.maxOutputTokens = options.maxTokens
    this.temperature = options.temperature
    this.tools = options.tools || null;

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

  // The model is part of the endpoint URL, so it is not included in the body.
  getChatInput() {
    return {
      contents: this.messages,
      generationConfig: { 
        ...(this.temperature != null && { temperature: this.temperature }),
        ...(this.maxOutputTokens && { maxOutputTokens: this.maxOutputTokens }),
      },
      ...(this.tools && { tools: this.tools }),
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
      this.model = options.model || config.url.anthropic.models.chat;
      // Claude 5 models think adaptively and thinking counts toward max_tokens.
      this.maxTokens = options.maxTokens || 2048;
      // Sent only when set; Opus 4.7+ and Claude 5 models reject sampling parameters.
      this.temperature = options.temperature ?? null;
      // Tools in Anthropic format or OpenAI function format.
      this.tools = options.tools || null;
      // 'auto' | 'any' | 'required' | 'none', or an Anthropic tool_choice object.
      this.toolChoice = options.toolChoice ?? null;
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

  cleanMessages() {
      this.messages = [];
  }

  deleteLastMessage(message) {
      for (let i = this.messages.length - 1; i >= 0; i--) {
          if (this.messages[i].role === message.role && this.messages[i].content === message.content) {
              this.messages.splice(i, 1);
              return true;
          }
      }
      return false;
  }

  getChatInput() {
      return {
          ...(this.system && { system: this.system }),
          model: this.model,
          messages: this.messages,
          max_tokens: this.maxTokens,
          ...(this.temperature != null && !claudeRejectsSamplingParams(this.model) && { temperature: this.temperature }),
          ...(this.tools && { tools: toAnthropicTools(this.tools) }),
          ...(this.toolChoice != null && { tool_choice: toAnthropicToolChoice(this.toolChoice) }),
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

class NvidiaInput extends ChatModelInput {
  constructor(systemMessage, options = {}) {
    super(options);
    if (typeof systemMessage === 'string') {
      this.messages = [{ role: 'system', content: systemMessage }];
    } else {
      this.messages = [];
    }
    this.model = options.model || config.nvidia.models.chat;
    this.temperature = options.temperature ?? 0.7;
    this.maxTokens = options.maxTokens || 1024;
    this.topP = options.topP ?? 1.0;
    this.presencePenalty = options.presencePenalty ?? 0;
    this.frequencyPenalty = options.frequencyPenalty ?? 0;
    this.stream = options.stream || false;
  }

  addUserMessage(text) {
    this.messages.push({ role: 'user', content: text });
  }

  addAssistantMessage(text) {
    this.messages.push({ role: 'assistant', content: text });
  }

  deleteLastMessage(message) {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (
        this.messages[i].role === message.role &&
        this.messages[i].content === message.content
      ) {
        this.messages.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  getChatInput() {
    return {
      model: this.model,
      messages: this.messages,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      top_p: this.topP,
      presence_penalty: this.presencePenalty,
      frequency_penalty: this.frequencyPenalty,
      stream: this.stream
    };
  }
}

class VLLMInput extends ChatGPTInput {
  constructor(systemMessage, options = {}) {
    super(systemMessage, options);
    this.model = options.model || 'Qwen/Qwen2.5-1.5B-Instruct';
    this.maxTokens = options.maxTokens || 1024;
    this.temperature = options.temperature ?? 0.7;
    this.top_p = options.top_p ?? 1.0;
  }

  getChatInput() {
    const messages = this.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    return {
      model: this.model,
      messages: messages,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      top_p: this.top_p,
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
  AnthropicInput,
  NvidiaInput,
  VLLMInput
};
