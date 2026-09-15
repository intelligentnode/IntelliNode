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
const {
    isReasoningModel,
    functionsToTools,
    functionCallToToolChoice,
    toResponsesTools,
    toResponsesToolChoice
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
    VLLMInput
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
    VLLM: "vllm"
};

class Chatbot {
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
            const my_options = options || {};
            const baseUrl = (my_options.nvidiaOptions && my_options.nvidiaOptions.baseUrl) || my_options.baseUrl;
            if (baseUrl) {
                this.nvidiaWrapper = new NvidiaWrapper(keyValue, { baseUrl: baseUrl });
            } else {
                this.nvidiaWrapper = new NvidiaWrapper(keyValue);
            }
        } else if (provider === SupportedChatModels.VLLM) {
            const baseUrl = options.baseUrl;
            if (!baseUrl) throw new Error("VLLM requires 'baseUrl' in options.");
            this.vllmWrapper = new VLLMWrapper(baseUrl);
        } else {
            throw new Error("Invalid provider name");
        }

        // initiate the optional search feature
        if (options && options.oneKey) {
            const apiBase = options.intelliBase ? options.intelliBase : null;
            this.extendedController = options.oneKey.startsWith("in") ? new IntellicloudWrapper(options.oneKey, apiBase) : null;
        }

    }

    getSupportedModels() {
        return Object.values(SupportedChatModels);
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
        } else {
            throw new Error("The provider is not supported");
        }
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
        } else {
            throw new Error("The stream function supports openai, anthropic, mistral, cohere, nvidia and vllm; for other providers use the chat function.");
        }
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
                const content = message.parts.map(part => part.text).join(" ");
                return { role, content };
            });
        } else if (Array.isArray(modelInput.messages)) {
            messages = modelInput.messages;
        } else {
            console.log('The input format does not support augmented search.');
            return references;
        }

        lastMessage = messages[messages.length - 1];

        if (lastMessage && lastMessage.role === "user") {

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
        return result.choices.map(c => c.message.content);
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
        return result.candidates.map(candidate => {
            const parts = (candidate.content && candidate.content.parts) || [];
            return parts
                .filter(part => typeof part.text === 'string' && !part.thought)
                .map(part => part.text)
                .join('');
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
        return resp.choices.map(c => c.message.content);
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
