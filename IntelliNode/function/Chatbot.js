/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const OpenAIWrapper = require("../wrappers/OpenAIWrapper");
const ReplicateWrapper = require('../wrappers/ReplicateWrapper');
const AWSEndpointWrapper = require('../wrappers/AWSEndpointWrapper');
const { GPTStreamParser, CohereStreamParser, VLLMStreamParser } = require('../utils/StreamParser');
const CohereAIWrapper = require('../wrappers/CohereAIWrapper');
const IntellicloudWrapper = require("../wrappers/IntellicloudWrapper");
const MistralAIWrapper = require('../wrappers/MistralAIWrapper');
const GeminiAIWrapper = require('../wrappers/GeminiAIWrapper');
const AnthropicWrapper = require('../wrappers/AnthropicWrapper');
const SystemHelper = require("../utils/SystemHelper");
const NvidiaWrapper = require("../wrappers/NvidiaWrapper");
const VLLMWrapper = require('../wrappers/VLLMWrapper');

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
        } else if (this.provider === SupportedChatModels.COHERE) {
            yield* this._streamCohere(modelInput)
        } else if (this.provider === SupportedChatModels.NVIDIA) {
            yield* this._streamNvidia(modelInput);
        } else if (this.provider === SupportedChatModels.VLLM) {
            yield* this._streamVLLM(modelInput);
        } else {
            throw new Error("The stream function support only chatGPT, for other providers use chat function.");
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
      for await (const chunk of stream) {
        const chunkText = chunk.toString('utf8');
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

    async *_chatGPTStream(modelInput) {
        let params;

        if (modelInput instanceof ChatModelInput) {
            params = modelInput.getChatInput();
            params.stream = true;
        } else if (typeof modelInput === "object") {
            params = modelInput;
            params.stream = true;
        } else {
            throw new Error("Invalid input: Must be an instance of ChatGPTInput or a dictionary");
        }

        const streamParser = new GPTStreamParser();

        const stream = await this.openaiWrapper.generateChatText(params);

        // Collect data from the stream
        for await (const chunk of stream) {
            const chunkText = chunk.toString('utf8');
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

        const results = await this.openaiWrapper.generateChatText(params, functions, function_call);
        return results.choices.map((choice) => {
            if (choice.finish_reason === 'function_call' && choice.message.function_call) {
                return {
                    content: choice.message.content,
                    function_call: choice.message.function_call
                };
            } else {
                return choice.message.content;
            }
        });
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
            params.stream = true;
        } else if (typeof modelInput === "object") {
            params = modelInput;
            params.stream = true;
        } else {
            throw new Error("Invalid input: Must be an instance of ChatGPTInput or a dictionary");
        }

        const streamParser = new CohereStreamParser();

        const stream = await this.cohereWrapper.generateChatText(params);

        // Collect data from the stream
        for await (const chunk of stream) {
            const chunkText = chunk.toString('utf8');
            yield* streamParser.feed(chunkText);
        }
    }

    async _chatMistral(modelInput) {
        let params;

        if (modelInput instanceof MistralInput) {
            params = modelInput.getChatInput();
        } if (modelInput instanceof ChatGPTInput) {
            params = modelInput.getChatInput();
        } else if (typeof modelInput === "object") {
            params = modelInput;
        } else {
            throw new Error("Invalid input: Must be an instance of MistralInput or an object");
        }

        const results = await this.mistralWrapper.generateText(params);

        return results.choices.map(choice => choice.message.content);
    }

    async _chatGemini(modelInput) {
        let params;

        if (modelInput instanceof GeminiInput) {
            params = modelInput.getChatInput();
        } else if (typeof modelInput === "object") {
            params = modelInput;
        } else {
            throw new Error("Invalid input: Must be an instance of GeminiInput");
        }

        // call Gemini
        const result = await this.geminiWrapper.generateContent(params);

        if (!Array.isArray(result.candidates) || result.candidates.length === 0) {
            throw new Error("Invalid response from Gemini API: Expected 'candidates' array with content");
        }

        // iterate over all the candidates
        const responses = result.candidates.map(candidate => {
            // combine text from all parts
            return candidate.content.parts
                .map(part => part.text)
                .join(' ');
        });

        return responses;
    }

    async _chatAnthropic(modelInput) {
        let params;
    
        if (modelInput instanceof AnthropicInput) {
            params = modelInput.getChatInput();
        } else {
            throw new Error("Invalid input: Must be an instance of AnthropicInput");
        }
    
        const results = await this.anthropicWrapper.generateText(params);
        
        return results.content.map(choice => choice.text);
    }

    async _chatNvidia(modelInput) {
        let params = modelInput instanceof NvidiaInput ? modelInput.getChatInput() : modelInput;
        if (params.stream) throw new Error("Use stream() for NVIDIA streaming.");
        let resp = await this.nvidiaWrapper.generateText(params);
        return resp.choices.map(c => c.message.content);
    }

    async *_streamNvidia(modelInput) {
        let params = modelInput instanceof NvidiaInput ? modelInput.getChatInput() : modelInput;
        params.stream = true;
        const stream = await this.nvidiaWrapper.generateTextStream(params);
        let buffer = '';
        for await (const chunk of stream) {
          const lines = chunk.toString('utf8').split('\n');
          for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            if (line.startsWith('data: [DONE]')) {
              yield buffer;
              return;
            }
            if (line.startsWith('data: ')) {
              try {
                let parsed = JSON.parse(line.replace('data: ', ''));
                let content = parsed.choices?.[0]?.delta?.content || '';
                buffer += content;
                yield content;
              } catch(e) {}
            }
          }
        }
    }

} /*chatbot class*/

module.exports = {
    Chatbot,
    SupportedChatModels,
};