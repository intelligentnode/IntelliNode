/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const OpenAIWrapper = require("../wrappers/OpenAIWrapper");
const ReplicateWrapper = require('../wrappers/ReplicateWrapper');
const AWSEndpointWrapper = require('../wrappers/AWSEndpointWrapper');
const {
    GPTStreamParser,
    CohereStreamParser,
    VLLMStreamParser,
    AnthropicStreamParser,
    readStreamChunks
} = require('../utils/StreamParser');
const CohereAIWrapper = require('../wrappers/CohereAIWrapper');
const IntellicloudWrapper = require("../wrappers/IntellicloudWrapper");
const MistralAIWrapper = require('../wrappers/MistralAIWrapper');
const GeminiAIWrapper = require('../wrappers/GeminiAIWrapper');
const AnthropicWrapper = require('../wrappers/AnthropicWrapper');
const SystemHelper = require("../utils/SystemHelper");
const NvidiaWrapper = require("../wrappers/NvidiaWrapper");
const VLLMWrapper = require('../wrappers/VLLMWrapper');
const OpenAICompatibleWrapper = require('../wrappers/OpenAICompatibleWrapper');
const FetchClient = require('../utils/FetchClient');
const { parseJson } = require('../utils/OutputParser');
const {
    isReasoningModel,
    stripRouteOverride,
    functionsToTools,
    functionCallToToolChoice,
    toResponsesTools,
    toResponsesToolChoice,
    toChatTools
} = require('../utils/ModelHelper');

const {
    ChatGPTInput,
    ChatModelInput,
    ChatGPTMessage,
    ChatLLamaInput,
    LLamaReplicateInput,
    CohereInput,
    LLamaSageInput,
    MistralInput,
    GeminiInput,
    AnthropicInput,
    NvidiaInput,
    VLLMInput,
    OpenAICompatibleInput
} = require("../model/input/ChatModelInput");

const SupportedChatModels = {
    OPENAI: "openai",
    REPLICATE: "replicate",
    SAGEMAKER: "sagemaker",
    COHERE: "cohere",
    MISTRAL: "mistral",
    GEMINI: "gemini",
    ANTHROPIC: "anthropic",
    NVIDIA: "nvidia",
    VLLM: "vllm",
    // any service with an OpenAI chat-completions API (needs options.baseUrl)
    OPENAI_COMPATIBLE: "openai_compatible",
    OPENROUTER: "openrouter",
    GROQ: "groq",
    DEEPSEEK: "deepseek",
    XAI: "xai",
    TOGETHER: "together",
    OLLAMA: "ollama",
    LMSTUDIO: "lmstudio"
};

// Providers served by OpenAICompatibleWrapper, keyed by the config preset name.
const COMPATIBLE_PROVIDERS = new Set([
    SupportedChatModels.OPENAI_COMPATIBLE, SupportedChatModels.OPENROUTER, SupportedChatModels.GROQ,
    SupportedChatModels.DEEPSEEK, SupportedChatModels.XAI, SupportedChatModels.TOGETHER,
    SupportedChatModels.OLLAMA, SupportedChatModels.LMSTUDIO
]);

// The input class of every provider that takes a system message and plain text turns.
const CHAT_INPUTS = {
    [SupportedChatModels.OPENAI]: ChatGPTInput,
    [SupportedChatModels.ANTHROPIC]: AnthropicInput,
    [SupportedChatModels.GEMINI]: GeminiInput,
    [SupportedChatModels.MISTRAL]: MistralInput,
    [SupportedChatModels.COHERE]: CohereInput,
    [SupportedChatModels.NVIDIA]: NvidiaInput,
    [SupportedChatModels.VLLM]: VLLMInput,
    ...Object.fromEntries([...COMPATIBLE_PROVIDERS].map((provider) => [provider, OpenAICompatibleInput])),
};

class Chatbot {
    /**
     * @param {string} keyValue - provider API key.
     * @param {string} provider - one of SupportedChatModels.
     * @param {object} customProxyHelper - OpenAI proxy/Azure helper, or { url } for SageMaker.
     * @param {object} options - { oneKey, intelliBase, baseUrl, headers, timeout, retries, retryDelay, signal }.
     */
    constructor(keyValue, provider = SupportedChatModels.OPENAI, customProxyHelper = null, options = {}) {

        const supportedModels = this.getSupportedModels();

        if (supportedModels.includes(provider)) {
            this.initiate(keyValue, provider, customProxyHelper, options);
        } else {
            const models = supportedModels.join(" - ");
            throw new Error(
                `The received keyValue is not supported. Send any model from: ${models}`
            );
        }

    }

    initiate(keyValue, provider, customProxyHelper = null, options = {}) {
        this.provider = provider;
        options = options || {};

        if (provider === SupportedChatModels.OPENAI) {
            this.openaiWrapper = new OpenAIWrapper(keyValue, customProxyHelper);
        } else if (provider === SupportedChatModels.REPLICATE) {
            this.replicateWrapper = new ReplicateWrapper(keyValue);
        } else if (provider === SupportedChatModels.SAGEMAKER) {
            this.sagemakerWrapper = new AWSEndpointWrapper(customProxyHelper.url, keyValue);
        } else if (provider === SupportedChatModels.COHERE) {
            this.cohereWrapper = new CohereAIWrapper(keyValue);
        } else if (provider === SupportedChatModels.MISTRAL) {
            this.mistralWrapper = new MistralAIWrapper(keyValue);
        } else if (provider === SupportedChatModels.GEMINI) {
            this.geminiWrapper = new GeminiAIWrapper(keyValue);
        } else if (provider === SupportedChatModels.ANTHROPIC) {
            this.anthropicWrapper = new AnthropicWrapper(keyValue);
        } else if (provider === SupportedChatModels.NVIDIA) {
            const baseUrl = (options.nvidiaOptions && options.nvidiaOptions.baseUrl) || options.baseUrl;
            if (baseUrl) {
                this.nvidiaWrapper = new NvidiaWrapper(keyValue, { baseUrl: baseUrl });
            } else {
                this.nvidiaWrapper = new NvidiaWrapper(keyValue);
            }
        } else if (provider === SupportedChatModels.VLLM) {
            const baseUrl = options.baseUrl;
            if (!baseUrl) throw new Error("VLLM requires 'baseUrl' in options.");
            this.vllmWrapper = new VLLMWrapper(baseUrl);
        } else if (COMPATIBLE_PROVIDERS.has(provider)) {
            // the settings can also come in the third argument, as RemoteEmbedModel accepts them
            const helper = customProxyHelper && typeof customProxyHelper === 'object' ? customProxyHelper : {};
            const baseUrl = options.baseUrl || helper.baseUrl;
            if (provider === SupportedChatModels.OPENAI_COMPATIBLE && !baseUrl) {
                throw new Error("The openai_compatible provider requires 'baseUrl' in options.");
            }
            this.compatibleWrapper = new OpenAICompatibleWrapper(keyValue, {
                preset: provider === SupportedChatModels.OPENAI_COMPATIBLE ? null : provider,
                baseUrl,
                headers: options.headers || helper.headers,
                model: options.model || helper.model,
            });
        } else {
            throw new Error("Invalid provider name");
        }

        this.setRequestOptions(options);

        // initiate the optional search feature
        if (options.oneKey) {
            const apiBase = options.intelliBase ? options.intelliBase : null;
            this.extendedController = options.oneKey.startsWith("in") ? new IntellicloudWrapper(options.oneKey, apiBase) : null;
        }

    }

    /** Apply timeout (ms), retries, retryDelay (ms) or an AbortSignal to every request of this chatbot. */
    setRequestOptions({ timeout, retries, retryDelay, signal } = {}) {
        const requestOptions = { timeout, retries, retryDelay, signal };
        for (const value of Object.values(this)) {
            if (value && value.client instanceof FetchClient) {
                value.client.setRequestOptions(requestOptions);
            }
        }
        return this;
    }

    getSupportedModels() {
        return Object.values(SupportedChatModels);
    }

    /**
     * The chat input class of a provider, created with a system message: ChatGPTInput for openai, AnthropicInput
     * for anthropic, ..., OpenAICompatibleInput for the OpenAI-compatible services.
     */
    static createInput(provider, systemMessage, options = {}) {
        const InputClass = CHAT_INPUTS[provider];
        if (!InputClass) {
            throw new Error(`No chat input for provider '${provider}'. Use one of: ${Object.keys(CHAT_INPUTS).join(', ')}`);
        }
        return new InputClass(systemMessage, options);
    }

    async chat(modelInput, functions = null, function_call = null, debugMode = true) {

        // call semantic search
        let references = await this.getSemanticSearchContext(modelInput);

        // verify the extra params
        if (this.provider != SupportedChatModels.OPENAI && (functions != null || function_call != null)) {
            throw new Error('The functions and function_call are supported for chatGPT models only.');
        }

        // call the chatbot
        if (this.provider === SupportedChatModels.OPENAI) {
            const result = await this._chatGPT(modelInput, functions, function_call);
            return modelInput.attachReference ? { result, references } : result;
        } else if (this.provider === SupportedChatModels.REPLICATE) {
            const result = await this._chatReplicateLLama(modelInput, debugMode);
            return modelInput.attachReference ? { result, references } : result;
        } else if (this.provider === SupportedChatModels.SAGEMAKER) {
            const result = await this._chatSageMaker(modelInput);
            return modelInput.attachReference ? { result, references } : result;
        } else if (this.provider === SupportedChatModels.COHERE) {
            const result = await this._chatCohere(modelInput);
            return modelInput.attachReference ? { result, references } : result;
        } else if (this.provider === SupportedChatModels.MISTRAL) {
            const result = await this._chatMistral(modelInput);
            return modelInput.attachReference ? { result, references } : result;
        } else if (this.provider === SupportedChatModels.GEMINI) {
            const result = await this._chatGemini(modelInput);
            return modelInput.attachReference ? { result, references } : result;
        } else if (this.provider === SupportedChatModels.ANTHROPIC) {
            const result = await this._chatAnthropic(modelInput);
            return modelInput.attachReference ? { result, references } : result;
        } else if (this.provider === SupportedChatModels.NVIDIA) {
            let result = await this._chatNvidia(modelInput);
            return modelInput.attachReference ? { result: result, references } : result;
        } else if (this.provider === SupportedChatModels.VLLM) {
            let result = await this._chatVLLM(modelInput);
            return modelInput.attachReference ? { result: result, references } : result;
        } else if (COMPATIBLE_PROVIDERS.has(this.provider)) {
            const result = await this._chatCompatible(modelInput);
            return modelInput.attachReference ? { result, references } : result;
        } else {
            throw new Error("The provider is not supported");
        }
    }

    /**
     * Chat and parse the first reply as JSON. Set `responseSchema` (a JSON Schema) or `responseFormat: 'json'`
     * on the input so the model is asked for JSON; the reply is parsed even when it is wrapped in prose or fences.
     */
    async chatJson(modelInput) {
        const response = await this.chat(modelInput);
        const replies = Array.isArray(response) ? response : response.result;
        const first = replies[0];
        const text = typeof first === 'string' ? first : (first && first.content) || '';
        const schema = modelInput instanceof ChatModelInput ? modelInput.responseSchema : null;
        const kind = schema && (schema.type === 'array' ? 'array' : schema.type === 'object' ? 'object' : null);
        return parseJson(text, kind);
    }

    /**
     * Run a tool-calling loop: call the model, execute every requested tool, feed the results back and repeat
     * until the model answers with text or `maxSteps` rounds have run.
     *
     * @param {ChatModelInput} modelInput - an input with `tools` set, or tools are taken from `tools`.
     * @param {object|Array|MCPClient} tools - { name: async (args) => result }, [{ name, description, parameters, handler }],
     *   or an MCP client (anything with callTool and toChatTools).
     * @param {object} options - { maxSteps = 5, onToolCall(name, args), onToolResult(name, result) }.
     * @returns {Promise<{ text: string, steps: Array<{ name, arguments, result, isError }>, toolCalls: number }>}
     */
    async runTools(modelInput, tools = {}, options = {}) {
        if (!(modelInput instanceof ChatModelInput)) {
            throw new Error('runTools needs a chat input instance (ChatGPTInput, AnthropicInput, GeminiInput, ...).');
        }
        const maxSteps = options.maxSteps || 5;
        // an MCP client that has not listed its tools yet
        if (tools && typeof tools.fetchTools === 'function' && (!Array.isArray(tools.tools) || tools.tools.length === 0)) {
            await tools.fetchTools();
        }
        const registry = Chatbot._toolRegistry(tools);
        if (!modelInput.tools && registry.definitions.length > 0) {
            modelInput.tools = registry.definitions;
        }
        if (!modelInput.tools || modelInput.tools.length === 0) {
            throw new Error('runTools needs tool definitions: pass tools with descriptions and parameters, or an MCP client.');
        }

        const steps = [];
        // maxSteps tool rounds, then one more model call for the answer
        for (let step = 0; ; step++) {
            const response = await this.chat(modelInput);
            const replies = Array.isArray(response) ? response : response.result;
            const first = replies[0];
            if (!first || typeof first === 'string' || !Array.isArray(first.tool_calls) || first.tool_calls.length === 0) {
                const text = typeof first === 'string' ? first : (first && first.content) || '';
                return { text, steps, toolCalls: steps.length };
            }
            if (step >= maxSteps) break;

            const results = [];
            for (const call of first.tool_calls) {
                const name = call.function ? call.function.name : call.name;
                const { args, invalid } = Chatbot._readArguments(call);
                let content;
                let isError = false;
                if (invalid !== undefined) {
                    // never run a tool with arguments the model did not actually send; let it retry
                    content = `Error: the arguments are not valid JSON: ${invalid}`;
                    isError = true;
                } else {
                    if (options.onToolCall) await options.onToolCall(name, args);
                    try {
                        const handler = registry.handlers[name];
                        if (!handler) throw new Error(`Unknown tool '${name}'.`);
                        content = await handler(args, call);
                    } catch (error) {
                        content = `Error: ${error && error.message !== undefined ? error.message : String(error)}`;
                        isError = true;
                    }
                }
                if (options.onToolResult) await options.onToolResult(name, content, isError);
                steps.push({ name, arguments: args, result: content, isError });
                results.push({ id: call.id, name, content, isError });
            }
            modelInput.addToolCalls(first.tool_calls, first.content);
            modelInput.addToolResults(results);
        }
        throw new Error(`runTools stopped after ${maxSteps} tool rounds without a final answer; raise options.maxSteps.`);
    }

    static _parseArguments(call) {
        return Chatbot._readArguments(call).args;
    }

    // { args } for valid (or empty) arguments, { args: {}, invalid: raw } when the JSON cannot be parsed.
    static _readArguments(call) {
        const raw = call.function ? call.function.arguments : call.arguments;
        if (raw && typeof raw === 'object') return { args: raw };
        if (raw === undefined || raw === null || String(raw).trim() === '') return { args: {} };
        try {
            const args = JSON.parse(raw);
            return args && typeof args === 'object' && !Array.isArray(args) ? { args } : { args: {}, invalid: String(raw) };
        } catch (error) {
            return { args: {}, invalid: String(raw) };
        }
    }

    // A short text stand-in for MCP content without text (images, audio, resources), so no payload reaches the model.
    static _describeContent(content) {
        return content.map((block) => {
            if (!block || typeof block !== 'object') return String(block);
            const uri = (block.resource && block.resource.uri) || block.uri;
            return `[${block.type || 'content'}${block.mimeType ? ` ${block.mimeType}` : ''}${uri ? ` ${uri}` : ''}]`;
        }).join('\n');
    }

    // Normalise the accepted tool shapes into { definitions, handlers }.
    static _toolRegistry(tools) {
        const handlers = {};
        const definitions = [];
        if (tools && typeof tools.callTool === 'function' && typeof tools.toChatTools === 'function') {
            for (const definition of tools.toChatTools()) {
                definitions.push(definition);
                handlers[definition.function.name] = async (args) => {
                    const result = await tools.callTool(definition.function.name, args);
                    if (result && result.isError) throw new Error(result.text || 'The tool reported an error.');
                    if (result && result.text) return result.text;
                    if (result && result.structuredContent !== undefined) return result.structuredContent;
                    if (result && Array.isArray(result.content)) return Chatbot._describeContent(result.content);
                    return result;
                };
            }
        } else if (Array.isArray(tools)) {
            for (const tool of tools) {
                const spec = tool.function || tool;
                if (typeof (tool.handler || spec.handler) === 'function') handlers[spec.name] = tool.handler || spec.handler;
                definitions.push({
                    type: 'function',
                    function: {
                        name: spec.name,
                        ...(spec.description && { description: spec.description }),
                        parameters: spec.parameters || spec.input_schema || { type: 'object', properties: {} },
                    },
                });
            }
        } else if (tools && typeof tools === 'object') {
            for (const [name, handler] of Object.entries(tools)) {
                if (typeof handler === 'function') handlers[name] = handler;
            }
        }
        return { definitions, handlers };
    }

    async *stream(modelInput) {

        await this.getSemanticSearchContext(modelInput);

        if (this.provider === SupportedChatModels.OPENAI) {
            yield* this._chatGPTStream(modelInput);
        } else if (this.provider === SupportedChatModels.ANTHROPIC) {
            yield* this._streamAnthropic(modelInput);
        } else if (this.provider === SupportedChatModels.MISTRAL) {
            yield* this._streamMistral(modelInput);
        } else if (this.provider === SupportedChatModels.COHERE) {
            yield* this._streamCohere(modelInput)
        } else if (this.provider === SupportedChatModels.NVIDIA) {
            yield* this._streamNvidia(modelInput);
        } else if (this.provider === SupportedChatModels.VLLM) {
            yield* this._streamVLLM(modelInput);
        } else if (COMPATIBLE_PROVIDERS.has(this.provider)) {
            yield* this._streamCompatible(modelInput);
        } else {
            throw new Error("The stream function supports openai, anthropic, mistral, cohere, nvidia, vllm and the OpenAI-compatible providers; for other providers use the chat function.");
        }
    }

    _getCompatibleParams(modelInput) {
        if (modelInput instanceof ChatGPTInput && !(modelInput instanceof CohereInput)) {
            // ChatGPTInput would build a Responses API body for gpt-5+ model names
            const params = OpenAICompatibleInput.prototype.getChatInput.call(modelInput);
            return params.model ? { ...params, model: stripRouteOverride(params.model) } : params;
        } else if (modelInput instanceof ChatModelInput) {
            return modelInput.getChatInput();
        } else if (modelInput && typeof modelInput === "object") {
            return { ...modelInput };
        }
        throw new Error("Invalid input: Must be an instance of OpenAICompatibleInput or a chat-completions object");
    }

    async _chatCompatible(modelInput) {
        const params = this._getCompatibleParams(modelInput);
        const results = await this.compatibleWrapper.generateChatText(params);
        return this._parseChatChoices(results);
    }

    async *_streamCompatible(modelInput) {
        const params = this._getCompatibleParams(modelInput);
        params.stream = true;
        const stream = await this.compatibleWrapper.generateChatText(params);
        const streamParser = new GPTStreamParser();
        for await (const chunkText of readStreamChunks(stream)) {
            yield* streamParser.feed(chunkText);
        }
    }

    /** Model ids served by an OpenAI-compatible provider (openrouter, ollama, ...). */
    async listModels() {
        if (!this.compatibleWrapper) {
            throw new Error('listModels is available for the OpenAI-compatible providers only.');
        }
        return this.compatibleWrapper.listModels();
    }

    async *_streamVLLM(modelInput) {
      let params = modelInput instanceof VLLMInput ? modelInput.getChatInput() : modelInput;
      params.stream = true;

      // Check for completion-only models
      const completionOnlyModels = ["google/gemma-2-2b-it"];
      const isCompletionOnly = completionOnlyModels.includes(params.model);

      let stream;
      if (isCompletionOnly) {
        // Convert messages to prompt string
        const promptMessages = params.messages
          .map(msg => `${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}: ${msg.content}`)
          .join("\n") + "\nAssistant:";

        const completionParams = {
          model: params.model,
          prompt: promptMessages,
          max_tokens: params.max_tokens || 100,
          temperature: params.temperature || 0.7,
          stream: true
        };

        stream = await this.vllmWrapper.generateText(completionParams);
      } else {
        stream = await this.vllmWrapper.generateChatText(params);
      }

      const streamParser = new VLLMStreamParser();

      // Process the streaming response
      for await (const chunkText of readStreamChunks(stream)) {
        yield* streamParser.feed(chunkText);
      }
    }

    async getSemanticSearchContext(modelInput) {

        let references = {};

        if (!this.extendedController) {
            return references;
        }

        // Initialize variables for messages or prompt
        let messages, lastMessage;

        if (modelInput instanceof ChatLLamaInput && typeof modelInput.prompt === "string") {
            messages = modelInput.prompt.split('\n').map(line => {
                const role = line.startsWith('User:') ? 'user' : 'assistant';
                const content = line.replace(/^(User|Assistant): /, '');
                return { role, content };
            });
        } else if (modelInput instanceof GeminiInput) {
            messages = modelInput.messages.map(message => {
                const role = message.role;
                const parts = message.parts || [];
                // a function response turn is not a question
                const content = parts.some(part => part.functionResponse) ? null : parts.map(part => part.text).join(" ");
                return { role, content };
            });
        } else if (Array.isArray(modelInput.messages)) {
            messages = modelInput.messages;
        } else {
            console.log('The input format does not support augmented search.');
            return references;
        }

        lastMessage = messages[messages.length - 1];

        // tool results (Anthropic content blocks, Gemini function responses) and multimodal parts are not queries
        if (lastMessage && lastMessage.role === "user" && typeof lastMessage.content === "string" && lastMessage.content.trim()) {

            const semanticResult = await this.extendedController.semanticSearch(lastMessage.content, modelInput.searchK);

            if (semanticResult && semanticResult.length > 0) {

                references = semanticResult.reduce((acc, doc) => {
                    // check if the document_name exists in the accumulator
                    if (!acc[doc.document_name]) {
                      acc[doc.document_name] = { pages: [] };
                    }
                    return acc;
                  }, {});

                let contextData = semanticResult.map(doc => doc.data.map(dataItem => dataItem.text).join('\n')).join('\n').trim();
                const templateWrapper = new SystemHelper().loadStaticPrompt("augmented_chatbot");
                const augmentedMessage = templateWrapper.replace('${semantic_search}', contextData).replace('${user_query}', lastMessage.content);

                if (modelInput instanceof ChatLLamaInput && modelInput.prompt) {
                    const promptLines = modelInput.prompt.trim().split('\n');
                    promptLines.pop();
                    promptLines.push(`User: ${augmentedMessage}`);
                    modelInput.prompt = promptLines.join('\n');
                } else if (modelInput instanceof ChatModelInput) {
                    modelInput.deleteLastMessage(lastMessage);
                    modelInput.addUserMessage(augmentedMessage);
                } else if (typeof modelInput === "object" && Array.isArray(modelInput.messages) && messages.length > 0) {
                    // replace the user message directly in the array
                    if (lastMessage.content) {
                        lastMessage.content = augmentedMessage;
                    }
                }
            }
        }

        return references;
    }

    async _chatVLLM(modelInput) {
      let params = modelInput instanceof ChatModelInput ? modelInput.getChatInput() : modelInput;

      // Explicit for Gemma (completion-only model)
      const completionOnlyModels = ["google/gemma-2-2b-it",];

      const isCompletionOnly = completionOnlyModels.includes(params.model);

      if (isCompletionOnly) {
        // Convert messages to prompt string
        const promptMessages = params.messages
          .map(msg => `${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}: ${msg.content}`)
          .join("\n") + "\nAssistant:";

        const completionParams = {
          model: params.model,
          prompt: promptMessages,
          max_tokens: params.max_tokens || 100,
          temperature: params.temperature || 0.7,
        };

        const result = await this.vllmWrapper.generateText(completionParams);
        return result.choices.map(c => c.text.trim());
      } else {
        const result = await this.vllmWrapper.generateChatText(params);
        return this._parseChatChoices(result);
      }
    }

    // gpt-5+ inputs go to the Responses API; plain request objects are routed by their shape.
    _isResponsesRequest(modelInput, params) {
        if (modelInput instanceof ChatModelInput) {
            return isReasoningModel(modelInput.model);
        }
        return params.input !== undefined && params.messages === undefined;
    }

    async *_chatGPTStream(modelInput) {
        let params;

        if (modelInput instanceof ChatModelInput) {
            params = modelInput.getChatInput();
        } else if (typeof modelInput === "object") {
            params = { ...modelInput };
        } else {
            throw new Error("Invalid input: Must be an instance of ChatGPTInput or a dictionary");
        }
        params.stream = true;

        const stream = this._isResponsesRequest(modelInput, params)
            ? await this.openaiWrapper.generateGPT5Response(params)
            : await this.openaiWrapper.generateChatText(params);

        // the parser understands both chat completions and Responses API events
        const streamParser = new GPTStreamParser();
        for await (const chunkText of readStreamChunks(stream)) {
            yield* streamParser.feed(chunkText);
        }
    }

    async _chatGPT(modelInput, functions = null, function_call = null) {
        let params;

        if (modelInput instanceof ChatModelInput) {
            params = modelInput.getChatInput();

        } else if (typeof modelInput === "object") {
            params = modelInput;
        } else {
            throw new Error("Invalid input: Must be an instance of ChatGPTInput or a dictionary");
        }

        if (this._isResponsesRequest(modelInput, params)) {
            const legacyFunctions = functions != null;
            if (legacyFunctions) {
                // the Responses API has no `functions` field, so send them as tools
                params = {
                    ...params,
                    tools: [...(params.tools || []), ...toResponsesTools(functionsToTools(functions))],
                    ...(function_call != null && { tool_choice: toResponsesToolChoice(functionCallToToolChoice(function_call)) }),
                };
            }
            const results = await this.openaiWrapper.generateGPT5Response(params);
            return this._parseResponsesOutput(results, legacyFunctions);
        }

        const results = await this.openaiWrapper.generateChatText(params, functions, function_call);
        return this._parseChatChoices(results);
    }

    // Chat-completions choices: text, or { content, function_call } / { content, tool_calls }.
    _parseChatChoices(results) {
        return (results.choices || []).map((choice) => {
            const message = choice.message || {};
            if (message.function_call) {
                return {
                    content: message.content,
                    function_call: message.function_call
                };
            }
            if (Array.isArray(message.tool_calls) && message.tool_calls.length > 0) {
                return {
                    content: message.content,
                    tool_calls: message.tool_calls
                };
            }
            return message.content;
        });
    }

    // Responses API output: { output: [ {type: 'reasoning'}, {type: 'message', content: [...]}, {type: 'function_call'} ] }
    _parseResponsesOutput(results, legacyFunctions = false) {
        if (!Array.isArray(results.output)) {
            if (results.choices && results.choices.length > 0) {
                return results.choices.map(choice => choice.output || choice.text || choice.message?.content);
            }
            return [''];
        }

        const texts = [];
        const toolCalls = [];
        for (const item of results.output) {
            if (item.type === 'message') {
                const content = Array.isArray(item.content)
                    ? item.content.map((part) => part.text ?? part.refusal ?? '').join('')
                    : (item.content || '');
                texts.push(content);
            } else if (item.type === 'function_call') {
                toolCalls.push({
                    id: item.call_id || item.id,
                    type: 'function',
                    function: { name: item.name, arguments: item.arguments }
                });
            }
        }

        if (toolCalls.length > 0) {
            const content = texts.join('') || null;
            if (legacyFunctions) {
                return toolCalls.map((call) => ({ content, function_call: call.function }));
            }
            return [{ content, tool_calls: toolCalls }];
        }

        // an incomplete response (e.g. max_output_tokens spent on reasoning) keeps returning ['']
        return texts.length > 0 ? texts : [''];
    }

    async _chatReplicateLLama(modelInput, debugMode) {
        let params;
        const waitTime = 2500,
            maxIterate = 200;
        let iteration = 0;

        if (modelInput instanceof ChatModelInput) {
            params = modelInput.getChatInput();
        } else if (typeof modelInput === "object") {
            params = modelInput;
        } else {
            throw new Error("Invalid input: Must be an instance of ChatLLamaInput or a dictionary");
        }

        try {
            const modelName = params.model;
            const inputData = params.inputData;

            const prediction = await this.replicateWrapper.predict(modelName, inputData);

            return new Promise((resolve, reject) => {
                const poll = setInterval(async () => {
                    const status = await this.replicateWrapper.getPredictionStatus(prediction.id);
                    if (debugMode) {
                        console.log('The current status:', status.status);
                    }

                    if (status.status === 'succeeded' || status.status === 'failed') {
                        // stop the loop if prediction has completed or failed
                        clearInterval(poll);

                        if (status.status === 'succeeded') {
                            resolve([status.output.join('')]);
                        } else {
                            console.error('LLama prediction failed:', status.error);
                            reject(new Error('LLama prediction failed.'));
                        }
                    }
                    if (iteration > maxIterate) {
                        reject(new Error('Replicate taking too long to process the input, try again later!'));
                    }
                    iteration += 1
                }, waitTime);
            });
        } catch (error) {
            console.error('LLama Error:', error);
            throw error;
        }
    }

    async _chatSageMaker(modelInput) {

        let params;

        if (modelInput instanceof LLamaSageInput) {
            params = modelInput.getChatInput();
        } else if (typeof modelInput === "object") {
            params = modelInput;
        } else {
            throw new Error("Invalid input: Must be an instance of LLamaSageInput or a dictionary");
        }

        const results = await this.sagemakerWrapper.predict(params);

        return results.map(result => result.generation ? result.generation.content : result);
    }

    async _chatCohere(modelInput) {
        let params;

        if (modelInput instanceof CohereInput) {
            params = modelInput.getChatInput();

        } else if (typeof modelInput === "object") {
            params = modelInput;
        } else {
            throw new Error("Invalid input: Must be an instance of ChatGPTInput or an object");
        }

        const results = await this.cohereWrapper.generateChatText(params);

        const responseText = results.text;
        return [responseText];
    }

    async *_streamCohere(modelInput) {

        let params;

        if (modelInput instanceof CohereInput) {
            params = modelInput.getChatInput();
        } else if (typeof modelInput === "object") {
            params = { ...modelInput };
        } else {
            throw new Error("Invalid input: Must be an instance of ChatGPTInput or a dictionary");
        }
        params.stream = true;

        const streamParser = new CohereStreamParser();

        const stream = await this.cohereWrapper.generateChatText(params);

        for await (const chunkText of readStreamChunks(stream)) {
            yield* streamParser.feed(chunkText);
        }
    }

    _getMistralParams(modelInput) {
        if (modelInput instanceof MistralInput || modelInput instanceof ChatGPTInput) {
            return modelInput.getChatInput();
        } else if (typeof modelInput === "object") {
            return { ...modelInput };
        }
        throw new Error("Invalid input: Must be an instance of MistralInput or an object");
    }

    async _chatMistral(modelInput) {
        const params = this._getMistralParams(modelInput);

        const results = await this.mistralWrapper.generateText(params);

        return this._parseChatChoices(results);
    }

    async *_streamMistral(modelInput) {
        const params = this._getMistralParams(modelInput);
        params.stream = true;

        const streamParser = new GPTStreamParser();
        const stream = await this.mistralWrapper.generateText(params);

        for await (const chunkText of readStreamChunks(stream)) {
            yield* streamParser.feed(chunkText);
        }
    }

    async _chatGemini(modelInput) {
        let params;
        let model = null;

        if (modelInput instanceof GeminiInput) {
            params = modelInput.getChatInput();
            model = modelInput.model;
        } else if (typeof modelInput === "object") {
            // an optional `model` key selects the model; the wrapper removes it from the body
            params = modelInput;
        } else {
            throw new Error("Invalid input: Must be an instance of GeminiInput");
        }

        // call Gemini
        const result = await this.geminiWrapper.generateContent(params, false, model);

        if (!Array.isArray(result.candidates) || result.candidates.length === 0) {
            const feedback = result.promptFeedback ? ` Prompt feedback: ${JSON.stringify(result.promptFeedback)}` : '';
            throw new Error(`Invalid response from Gemini API: Expected 'candidates' array with content.${feedback}`);
        }

        // a candidate can have no parts, e.g. when thinking used the whole output budget
        return result.candidates.map((candidate, index) => {
            const parts = (candidate.content && candidate.content.parts) || [];
            const text = parts
                .filter(part => typeof part.text === 'string' && !part.thought)
                .map(part => part.text)
                .join('');
            // Gemini has no call ids, so function calls get local ones for the tool loop
            const toolCalls = parts
                .filter(part => part.functionCall)
                .map((part, callIndex) => ({
                    id: part.functionCall.id || `call_${index}_${callIndex}`,
                    type: 'function',
                    function: { name: part.functionCall.name, arguments: JSON.stringify(part.functionCall.args || {}) },
                    // Gemini 3 needs the signature echoed back with the call
                    ...(part.thoughtSignature && { thoughtSignature: part.thoughtSignature })
                }));
            return toolCalls.length > 0 ? { content: text || null, tool_calls: toolCalls } : text;
        });
    }

    _getAnthropicParams(modelInput) {
        if (modelInput instanceof AnthropicInput) {
            return modelInput.getChatInput();
        } else if (modelInput && typeof modelInput === "object" && !(modelInput instanceof ChatModelInput)) {
            return { ...modelInput };
        }
        throw new Error("Invalid input: Must be an instance of AnthropicInput or a Messages API object");
    }

    async _chatAnthropic(modelInput) {
        const params = this._getAnthropicParams(modelInput);

        const results = await this.anthropicWrapper.generateText(params);

        // Claude 5 models can return thinking blocks before the answer; keep the text blocks only
        const blocks = Array.isArray(results.content) ? results.content : [];
        const texts = blocks.filter(block => block.type === 'text').map(block => block.text);
        const toolUses = blocks.filter(block => block.type === 'tool_use');

        if (toolUses.length > 0) {
            return [{
                content: texts.join('') || null,
                tool_calls: toolUses.map(block => ({
                    id: block.id,
                    type: 'function',
                    function: { name: block.name, arguments: JSON.stringify(block.input || {}) }
                }))
            }];
        }

        // e.g. max_tokens spent on thinking: keep the string array shape
        return texts.length > 0 ? texts : [''];
    }

    async *_streamAnthropic(modelInput) {
        const params = this._getAnthropicParams(modelInput);

        const streamParser = new AnthropicStreamParser();
        const stream = await this.anthropicWrapper.streamText(params);

        for await (const chunkText of readStreamChunks(stream)) {
            yield* streamParser.feed(chunkText);
        }
    }

    async _chatNvidia(modelInput) {
        let params = modelInput instanceof NvidiaInput ? modelInput.getChatInput() : modelInput;
        if (params.stream) throw new Error("Use stream() for NVIDIA streaming.");
        let resp = await this.nvidiaWrapper.generateText(params);
        return this._parseChatChoices(resp);
    }

    async *_streamNvidia(modelInput) {
        let params = modelInput instanceof NvidiaInput ? modelInput.getChatInput() : { ...modelInput };
        params.stream = true;
        const stream = await this.nvidiaWrapper.generateTextStream(params);

        const streamParser = new GPTStreamParser();
        for await (const chunkText of readStreamChunks(stream)) {
            yield* streamParser.feed(chunkText);
        }
    }

} /*chatbot class*/

module.exports = {
    Chatbot,
    SupportedChatModels,
};
