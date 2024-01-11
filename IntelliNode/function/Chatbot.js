/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const OpenAIWrapper = require("../wrappers/OpenAIWrapper");
const ReplicateWrapper = require('../wrappers/ReplicateWrapper');
const AWSEndpointWrapper = require('../wrappers/AWSEndpointWrapper');
const { GPTStreamParser } = require('../utils/StreamParser');
const { CohereStreamParser } = require('../utils/StreamParser');
const CohereAIWrapper = require('../wrappers/CohereAIWrapper');
const IntellicloudWrapper = require("../wrappers/IntellicloudWrapper");
const MistralAIWrapper = require('../wrappers/MistralAIWrapper');
const GeminiAIWrapper = require('../wrappers/GeminiAIWrapper');
const SystemHelper = require("../utils/SystemHelper");

const {
    ChatGPTInput,
    ChatModelInput,
    ChatGPTMessage,
    ChatLLamaInput,
    LLamaReplicateInput,
    CohereInput,
    LLamaSageInput,
    MistralInput,
    GeminiInput
} = require("../model/input/ChatModelInput");

const SupportedChatModels = {
    OPENAI: "openai",
    REPLICATE: "replicate",
    SAGEMAKER: "sagemaker",
    COHERE: "cohere",
    MISTRAL: "mistral",
    GEMINI: "gemini",
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

        await this.getSemanticSearchContext(modelInput);

        if (this.provider === SupportedChatModels.OPENAI) {
            return this._chatGPT(modelInput, functions, function_call);
        } else if (this.provider === SupportedChatModels.REPLICATE) {
            // functions not supported for REPLICATE models
            if (functions != null || function_call != null) {
                throw new Error('The functions and function_call are supported for chatGPT models only. They should be null for LLama model.');
            }

            return this._chatReplicateLLama(modelInput, debugMode);
        } else if (this.provider === SupportedChatModels.SAGEMAKER) {

            // functions not supported for REPLICATE models
            if (functions != null || function_call != null) {
                throw new Error('The functions and function_call are supported for chatGPT models only. They should be null for LLama model.');
            }

            return this._chatSageMaker(modelInput);
        } else if (this.provider === SupportedChatModels.COHERE) { 
            return this._chatCohere(modelInput);
        } else if (this.provider === SupportedChatModels.MISTRAL) {
            return this._chatMistral(modelInput);
        } else if (this.provider === SupportedChatModels.GEMINI) {
            return this._chatGemini(modelInput);
        } else {
            throw new Error("The provider is not supported");
        }
    }

    async *stream(modelInput) {

        await this.getSemanticSearchContext(modelInput);

        if (this.provider === SupportedChatModels.OPENAI) {
            yield* this._chatGPTStream(modelInput);
        } else  if (this.provider === SupportedChatModels.COHERE) {
            yield* this._streamCohere(modelInput)
        } else {
            throw new Error("The stream function support only chatGPT, for other providers use chat function.");
        }
    }

    async getSemanticSearchContext(modelInput) {
        if (!this.extendedController) {
            return;
        }
        
        // Initialize variables for messages or prompt
        let messages, lastMessage;

        if (modelInput instanceof ChatLLamaInput && typeof modelInput.prompt === "string") {
            messages = modelInput.prompt.split('\n').map(line => {
                const role = line.startsWith('User:') ? 'user' : 'assistant';
                const content = line.replace(/^(User|Assistant): /, '');
                return { role, content };
            });
        } else if (Array.isArray(modelInput.messages)) {
            messages = modelInput.messages;
        } else {
            console.log('The input format does not support augmented search.');
            return;
        }
        
        lastMessage = messages[messages.length - 1];
    
        if (lastMessage && lastMessage.role === "user") {

            const semanticResult = await this.extendedController.semanticSearch(lastMessage.content, modelInput.searchK);

            if (semanticResult && semanticResult.length > 0) {

                let contextData = semanticResult.map(doc => doc.data.map(dataItem => dataItem.text).join('\n')).join('\n').trim();
                const templateWrapper = new SystemHelper().loadStaticPrompt("augmented_chatbot");
                const augmentedMessage = templateWrapper.replace('${semantic_search}', contextData).replace('${user_query}', lastMessage.content);
    
                if (modelInput instanceof ChatLLamaInput && modelInput.prompt) {
                    const promptLines = modelInput.prompt.trim().split('\n');
                    promptLines.pop();
                    promptLines.push(`User: ${augmentedMessage}`); 
                    modelInput.prompt = promptLines.join('\n');

                    // console.log('----> prompt after update: ', modelInput.prompt);
                } else if (modelInput instanceof ChatModelInput) {
                    modelInput.deleteLastMessage(lastMessage);
                    modelInput.addUserMessage(augmentedMessage);

                    // console.log('----> modelInput after update: ', modelInput);
                } else if (typeof modelInput === "object" && Array.isArray(modelInput.messages) && messages.length > 0) {
                    // replace the user message directly in the array
                    if (lastMessage.content) {
                        lastMessage.content = augmentedMessage;
                    }
                    // console.log('----> messages after update: ', messages[messages.length - 1]);
                }
            }
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

} /*chatbot class*/

module.exports = {
    Chatbot,
    SupportedChatModels,
};