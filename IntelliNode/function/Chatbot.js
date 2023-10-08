/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const OpenAIWrapper = require("../wrappers/OpenAIWrapper");
const ReplicateWrapper = require('../wrappers/ReplicateWrapper');
const AWSEndpointWrapper = require('../wrappers/AWSEndpointWrapper');
const { GPTStreamParser } = require('../utils/StreamParser');

const {
    ChatGPTInput,
    ChatModelInput,
    ChatGPTMessage,
    ChatLLamaInput,
    LLamaReplicateInput,
    LLamaSageInput
} = require("../model/input/ChatModelInput");

const SupportedChatModels = {
    OPENAI: "openai",
    REPLICATE: "replicate",
    SAGEMAKER: "sagemaker"
};

class Chatbot {
    constructor(keyValue, provider = SupportedChatModels.OPENAI, customProxyHelper = null) {
        const supportedModels = this.getSupportedModels();

        if (supportedModels.includes(provider)) {
            this.initiate(keyValue, provider, customProxyHelper);
        } else {
            const models = supportedModels.join(" - ");
            throw new Error(
                `The received keyValue is not supported. Send any model from: ${models}`
            );
        }
    }

    initiate(keyValue, provider, customProxyHelper = null) {
        this.provider = provider;

        if (provider === SupportedChatModels.OPENAI) {
            this.openaiWrapper = new OpenAIWrapper(keyValue, customProxyHelper);
        } else if (provider === SupportedChatModels.REPLICATE) {
            this.replicateWrapper = new ReplicateWrapper(keyValue);
        } else if (provider === SupportedChatModels.SAGEMAKER) {
            this.sagemakerWrapper = new AWSEndpointWrapper(customProxyHelper.url, keyValue);
        } else {
            throw new Error("Invalid provider name");
        }
    }

    getSupportedModels() {
        return Object.values(SupportedChatModels);
    }

    async chat(modelInput, functions = null, function_call = null, debugMode = true) {
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
        } else {
            throw new Error("The provider is not supported");
        }
    }

    async *stream(modelInput) {
        if (this.provider === SupportedChatModels.OPENAI) {
            yield* this._chatGPTStream(modelInput);
        } else {
            throw new Error("The stream function support only chatGPT, for other providers use chat function.");
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

} /*chatbot class*/

module.exports = {
    Chatbot,
    SupportedChatModels,
};