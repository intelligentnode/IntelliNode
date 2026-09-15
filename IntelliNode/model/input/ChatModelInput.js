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

// Tool-call arguments arrive as a JSON string; the Anthropic and Gemini bodies need the object.
function parseArguments(call) {
  const args = call.function ? call.function.arguments : call.arguments;
  if (args && typeof args === 'object') return args;
  try {
    return args ? JSON.parse(args) : {};
  } catch (error) {
    return {};
  }
}

function callName(call) {
  return call.function ? call.function.name : call.name;
}

function resultText(result) {
  const content = result.content !== undefined ? result.content : result.result;
  if (content === undefined || content === null) return '';
  return typeof content === 'string' ? content : JSON.stringify(content);
}

// Schema helpers for the structured-output options shared by every input class.
function schemaName(schema, fallback = 'response') {
  const raw = (schema && (schema.title || schema.name)) || fallback;
  return String(raw).replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 64) || fallback;
}

// JSON Schema keywords whose values are schemas, so a walk never mistakes a property name for a keyword.
const SCHEMA_MAPS = new Set(['properties', 'patternProperties', '$defs', 'definitions']);
const SCHEMA_LISTS = new Set(['anyOf', 'oneOf', 'allOf', 'prefixItems']);
const SCHEMA_VALUES = new Set(['items', 'additionalItems', 'contains', 'not', 'if', 'then', 'else']);

// Copy a schema, applying visit(node) to every schema node from the leaves up.
function mapSchema(schema, visit) {
  if (Array.isArray(schema)) return schema.map((item) => mapSchema(item, visit));
  if (!schema || typeof schema !== 'object') return schema;
  const copy = {};
  for (const [key, value] of Object.entries(schema)) {
    if (SCHEMA_MAPS.has(key) && value && typeof value === 'object' && !Array.isArray(value)) {
      copy[key] = Object.fromEntries(Object.entries(value).map(([name, sub]) => [name, mapSchema(sub, visit)]));
    } else if ((SCHEMA_LISTS.has(key) && Array.isArray(value)) || SCHEMA_VALUES.has(key)) {
      copy[key] = mapSchema(value, visit);
    } else {
      copy[key] = value;
    }
  }
  return visit(copy);
}

function isObjectSchema(node) {
  return node.type === 'object' || (Array.isArray(node.type) && node.type.includes('object'));
}

function nullableSchema(schema) {
  if (!schema || typeof schema !== 'object') return schema;
  const withNull = Array.isArray(schema.enum) && !schema.enum.includes(null) ? { enum: [...schema.enum, null] } : {};
  if (typeof schema.type === 'string') return schema.type === 'null' ? schema : { ...schema, ...withNull, type: [schema.type, 'null'] };
  if (Array.isArray(schema.type)) return schema.type.includes('null') ? schema : { ...schema, ...withNull, type: [...schema.type, 'null'] };
  return { anyOf: [schema, { type: 'null' }] };
}

// Structured output (Anthropic, OpenAI strict mode) needs additionalProperties: false on every object. OpenAI strict
// mode also needs every property in required, so optional properties become required and nullable.
function closedObjectSchema(schema, { requireAll = false } = {}) {
  return mapSchema(schema, (node) => {
    if (!isObjectSchema(node)) return node;
    if (node.additionalProperties === undefined) node.additionalProperties = false;
    if (requireAll && node.properties && typeof node.properties === 'object') {
      const required = new Set(Array.isArray(node.required) ? node.required : []);
      for (const name of Object.keys(node.properties)) {
        if (!required.has(name)) node.properties[name] = nullableSchema(node.properties[name]);
      }
      node.required = Object.keys(node.properties);
    }
    return node;
  });
}

// OpenAI-style structured output: json_schema when a schema is given, json_object otherwise.
// The Responses API defaults strict to true, so strict is always sent explicitly there.
function openAIResponseFormat(input, { nested = true } = {}) {
  if (input.responseSchema) {
    const strict = Boolean(input.strictSchema);
    const definition = {
      name: schemaName(input.responseSchema),
      schema: strict ? closedObjectSchema(input.responseSchema, { requireAll: true }) : input.responseSchema,
      ...((strict || !nested) && { strict }),
    };
    return nested ? { type: 'json_schema', json_schema: definition } : { type: 'json_schema', ...definition };
  }
  if (input.responseFormat === 'json') return { type: 'json_object' };
  return null;
}

function jsonModeInstruction(input) {
  return input.responseFormat === 'json' && !input.responseSchema ? 'Respond with valid JSON only, without markdown fences.' : null;
}

class ChatModelInput {
  constructor(options = {}) {
    this.searchK = options.searchK || 3;
    this.attachReference = options.attachReference || false;
    // structured output: a JSON Schema for the reply, or 'json' for free-form JSON
    this.responseSchema = options.responseSchema || null;
    this.responseFormat = options.responseFormat || (options.responseSchema ? 'json' : null);
    // OpenAI strict mode: every object gets additionalProperties: false and the model cannot deviate from the schema
    this.strictSchema = options.strictSchema || false;
  }

  getChatInput() {
    return null;
  }

  // Tool round trips are implemented per provider; inputs without them cannot run Chatbot.runTools.
  addToolCalls() {
    throw new Error(`${this.constructor.name} does not support tool calls.`);
  }

  addToolResults() {
    throw new Error(`${this.constructor.name} does not support tool results.`);
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

  /** Record the assistant turn that requested tools (tool_calls in chat-completions format). */
  addToolCalls(toolCalls, content = null) {
    const message = new ChatGPTMessage(content, 'assistant');
    message.toolCalls = toolCalls.map((call) => ({
      id: call.id,
      type: 'function',
      function: { name: callName(call), arguments: typeof call.function?.arguments === 'string' ? call.function.arguments : JSON.stringify(parseArguments(call)) },
    }));
    this.messages.push(message);
  }

  /** Record tool results: [{ id, name, content, isError }]. */
  addToolResults(results) {
    for (const result of results) {
      const message = new ChatGPTMessage(resultText(result), 'tool');
      message.toolCallId = result.id;
      message.toolName = result.name;
      this.messages.push(message);
    }
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

  // Messages in chat-completions format, including tool calls and tool results.
  getChatMessages({ toolResultName = false } = {}) {
    return this.messages.map((message) => {
      if (message.toolCalls) {
        return { role: 'assistant', content: message.content ?? null, tool_calls: message.toolCalls };
      }
      if (message.role === 'tool') {
        return {
          role: 'tool',
          tool_call_id: message.toolCallId,
          ...(toolResultName && message.toolName && { name: message.toolName }),
          content: message.content,
        };
      }
      return {
        role: message.role,
        ...(message.name && { name: message.name }),
        content: message.content,
      };
    });
  }

  getChatInput() {
    // gpt-5 and newer use the Responses API (a ":chat" model suffix keeps chat completions).
    if (isReasoningModel(this.model)) {
      return this.getResponsesInput();
    }

    // o-series and gpt-5+ on chat completions reject max_tokens and custom temperature.
    const reasoningChat = isReasoningChatModel(this.model);
    const responseFormat = openAIResponseFormat(this);

    return {
      model: stripRouteOverride(this.model),
      messages: this.getChatMessages(),
      ...(!reasoningChat && this.temperature != null && { temperature: this.temperature }),
      ...(this.numberOfOutputs && { n: this.numberOfOutputs }),
      ...(this.maxTokens && (reasoningChat ? { max_completion_tokens: this.maxTokens } : { max_tokens: this.maxTokens })),
      ...(this.tools && { tools: toChatTools(this.tools) }),
      ...(this.toolChoice != null && { tool_choice: toChatToolChoice(this.toolChoice) }),
      ...(responseFormat && { response_format: responseFormat }),
    };
  }

  // Request body for the Responses API (/v1/responses).
  getResponsesInput() {
    // Responses input messages accept role and content only (no name field); tool turns become items.
    const input = [];
    for (const message of this.messages) {
      if (message.toolCalls) {
        if (message.content) input.push({ role: 'assistant', content: toResponsesContent(message.content, 'assistant') });
        for (const call of message.toolCalls) {
          input.push({ type: 'function_call', call_id: call.id, name: call.function.name, arguments: call.function.arguments });
        }
      } else if (message.role === 'tool') {
        input.push({ type: 'function_call_output', call_id: message.toolCallId, output: message.content });
      } else {
        input.push({ role: message.role, content: toResponsesContent(message.content, message.role) });
      }
    }

    const format = openAIResponseFormat(this, { nested: false });
    const text = { ...(this.verbosity && { verbosity: this.verbosity }), ...(format && { format }) };

    return {
      model: stripRouteOverride(this.model),
      input: input,
      reasoning: { effort: this.effort || defaultReasoningEffort(this.model) },
      ...(this.maxTokens && { max_output_tokens: this.maxTokens }),
      ...(Object.keys(text).length > 0 && { text }),
      ...(this.tools && { tools: toResponsesTools(this.tools) }),
      ...(this.toolChoice != null && { tool_choice: toResponsesToolChoice(this.toolChoice) }),
    };
  }
}

/**
 * Chat-completions input for OpenAI-compatible services (OpenRouter, Groq, DeepSeek, xAI, Together, Ollama,
 * LM Studio, ...). The model defaults to the provider preset when omitted.
 */
class OpenAICompatibleInput extends ChatGPTInput {
  constructor(systemMessage, options = {}) {
    super(systemMessage, options);
    this.model = options.model || null;
    this.temperature = options.temperature ?? null;
  }

  getChatInput() {
    const responseFormat = openAIResponseFormat(this);
    return {
      ...(this.model && { model: this.model }),
      messages: this.getChatMessages(),
      ...(this.temperature != null && { temperature: this.temperature }),
      ...(this.maxTokens && { max_tokens: this.maxTokens }),
      ...(this.tools && { tools: toChatTools(this.tools) }),
      ...(this.toolChoice != null && { tool_choice: toChatToolChoice(this.toolChoice) }),
      ...(responseFormat && { response_format: responseFormat }),
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

  addToolCalls() {
    throw new Error('CohereInput does not support tool calls; use openai, anthropic, gemini, mistral, nvidia or an OpenAI-compatible provider for Chatbot.runTools.');
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
        ...(this.responseSchema && { 'response_format': { type: 'json_object', schema: this.responseSchema } }),
        ...(!this.responseSchema && this.responseFormat === 'json' && { 'response_format': { type: 'json_object' } }),
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
    const responseFormat = openAIResponseFormat(this);

    // Construct Mistral input parameters (tool messages carry the tool name)
    const params = {
      model: this.model,
      messages: this.getChatMessages({ toolResultName: true }),
      ...(this.temperature != null && { temperature: this.temperature }),
      ...(this.maxTokens && { max_tokens: this.maxTokens }),
      ...(this.tools && { tools: toChatTools(this.tools) }),
      ...(this.toolChoice != null && { tool_choice: toChatToolChoice(this.toolChoice) }),
      ...(responseFormat && { response_format: responseFormat }),
    };

    return params;
  }
}

// Gemini's schema dialect rejects $schema and additionalProperties; they are removed from schema nodes only,
// so a property that happens to be called "title" or "additionalProperties" is kept.
function toGeminiSchema(schema) {
  return mapSchema(schema, (node) => {
    delete node.$schema;
    delete node.additionalProperties;
    return node;
  });
}

// Function tools in any supported format become one functionDeclarations entry; Gemini-native tools
// (googleSearch, codeExecution, urlContext, functionDeclarations) pass through unchanged.
function toGeminiTools(tools) {
  if (!Array.isArray(tools)) return tools;
  const declarations = [];
  const native = [];
  for (const tool of tools) {
    const fn = tool && typeof tool === 'object' && (tool.function || ((tool.type === 'function' || (!tool.type && tool.name)) ? tool : null));
    if (!fn || !fn.name) {
      native.push(tool);
      continue;
    }
    const parameters = fn.parameters || fn.input_schema;
    declarations.push({
      name: fn.name,
      ...(fn.description && { description: fn.description }),
      ...(parameters && { parameters: toGeminiSchema(parameters) }),
    });
  }
  return [...(declarations.length ? [{ functionDeclarations: declarations }] : []), ...native];
}

function toGeminiToolConfig(choice) {
  if (choice === 'auto') return { functionCallingConfig: { mode: 'AUTO' } };
  if (choice === 'required' || choice === 'any') return { functionCallingConfig: { mode: 'ANY' } };
  if (choice === 'none') return { functionCallingConfig: { mode: 'NONE' } };
  if (choice && typeof choice === 'object') {
    if (choice.functionCallingConfig) return choice;
    const name = choice.function ? choice.function.name : choice.name;
    if (name) return { functionCallingConfig: { mode: 'ANY', allowedFunctionNames: [name] } };
  }
  return null;
}

class GeminiInput extends ChatModelInput {
  constructor(systemMessage, options = {}) {
    super(options);
    this.messages = [];
    // the bare 'gemini' placeholder from older examples maps to the default model
    this.model = options.model && options.model !== 'gemini' ? options.model : config.url.gemini.models.chat;
    this.maxOutputTokens = options.maxTokens
    this.temperature = options.temperature
    // tools in Gemini (functionDeclarations) or OpenAI function format
    this.tools = options.tools || null;
    this.toolChoice = options.toolChoice ?? null;

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

  addToolCalls(toolCalls, content = null) {
    // Gemini 3 rejects a function call turn whose thought signature was dropped
    const parts = toolCalls.map((call) => ({
      functionCall: { name: callName(call), args: parseArguments(call) },
      ...(call.thoughtSignature && { thoughtSignature: call.thoughtSignature }),
    }));
    if (content) parts.unshift({ text: content });
    this.messages.push({ role: 'model', parts });
  }

  addToolResults(results) {
    // functionResponse.response must be an object
    const parts = results.map((result) => {
      const content = result.content !== undefined ? result.content : result.result;
      const response = content && typeof content === 'object' && !Array.isArray(content) ? content : { result: resultText(result) };
      return { functionResponse: { name: result.name, response: result.isError ? { error: resultText(result) } : response } };
    });
    this.messages.push({ role: 'user', parts });
  }

  // The model is part of the endpoint URL, so it is not included in the body.
  getChatInput() {
    const toolConfig = this.toolChoice != null ? toGeminiToolConfig(this.toolChoice) : null;
    return {
      contents: this.messages,
      generationConfig: {
        ...(this.temperature != null && { temperature: this.temperature }),
        ...(this.maxOutputTokens && { maxOutputTokens: this.maxOutputTokens }),
        ...(this.responseFormat === 'json' && { responseMimeType: 'application/json' }),
        ...(this.responseSchema && { responseSchema: toGeminiSchema(this.responseSchema) }),
      },
      ...(this.tools && { tools: toGeminiTools(this.tools) }),
      ...(toolConfig && { toolConfig }),
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

  addToolCalls(toolCalls, content = null) {
      const blocks = toolCalls.map((call) => ({ type: 'tool_use', id: call.id, name: callName(call), input: parseArguments(call) }));
      if (content) blocks.unshift({ type: 'text', text: content });
      this.messages.push({ role: 'assistant', content: blocks });
  }

  addToolResults(results) {
      this.messages.push({
          role: 'user',
          content: results.map((result) => ({
              type: 'tool_result',
              tool_use_id: result.id,
              content: resultText(result),
              ...(result.isError && { is_error: true }),
          })),
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
      // Claude has no free-form JSON mode, so plain JSON requests become a system instruction
      const jsonInstruction = jsonModeInstruction(this);
      let system = this.system;
      if (jsonInstruction) {
          // a content-block system prompt (e.g. with cache_control) keeps its blocks
          system = Array.isArray(this.system)
              ? [...this.system, { type: 'text', text: jsonInstruction }]
              : [this.system, jsonInstruction].filter(Boolean).join('\n');
      }
      return {
          ...(system && { system }),
          model: this.model,
          messages: this.messages,
          max_tokens: this.maxTokens,
          ...(this.temperature != null && !claudeRejectsSamplingParams(this.model) && { temperature: this.temperature }),
          ...(this.tools && { tools: toAnthropicTools(this.tools) }),
          ...(this.toolChoice != null && { tool_choice: toAnthropicToolChoice(this.toolChoice) }),
          ...(this.responseSchema && { output_config: { format: { type: 'json_schema', schema: closedObjectSchema(this.responseSchema) } } }),
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
    this.tools = options.tools || null;
    this.toolChoice = options.toolChoice ?? null;
  }

  addUserMessage(text) {
    this.messages.push({ role: 'user', content: text });
  }

  addAssistantMessage(text) {
    this.messages.push({ role: 'assistant', content: text });
  }

  addToolCalls(toolCalls, content = null) {
    this.messages.push({
      role: 'assistant',
      content: content ?? null,
      tool_calls: toolCalls.map((call) => ({
        id: call.id,
        type: 'function',
        function: { name: callName(call), arguments: typeof call.function?.arguments === 'string' ? call.function.arguments : JSON.stringify(parseArguments(call)) },
      })),
    });
  }

  addToolResults(results) {
    for (const result of results) {
      this.messages.push({ role: 'tool', tool_call_id: result.id, content: resultText(result) });
    }
  }

  cleanMessages() {
    // keep the system message
    this.messages = this.messages.filter((message, index) => index === 0 && message.role === 'system');
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
    const responseFormat = openAIResponseFormat(this);
    return {
      model: this.model,
      messages: this.messages,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      top_p: this.topP,
      presence_penalty: this.presencePenalty,
      frequency_penalty: this.frequencyPenalty,
      stream: this.stream,
      ...(this.tools && { tools: toChatTools(this.tools) }),
      ...(this.toolChoice != null && { tool_choice: toChatToolChoice(this.toolChoice) }),
      ...(responseFormat && { response_format: responseFormat }),
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
    const responseFormat = openAIResponseFormat(this);
    return {
      model: this.model,
      messages: this.getChatMessages(),
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      top_p: this.top_p,
      ...(this.tools && { tools: toChatTools(this.tools) }),
      ...(this.toolChoice != null && { tool_choice: toChatToolChoice(this.toolChoice) }),
      ...(responseFormat && { response_format: responseFormat }),
    };
  }
}


module.exports = {
  ChatGPTInput,
  OpenAICompatibleInput,
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
