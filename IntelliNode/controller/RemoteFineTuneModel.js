/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const OpenAIWrapper = require('../wrappers/OpenAIWrapper');
const FineTuneInput = require('../model/input/FineTuneInput');

const SupportedFineTuneModels = {
    OPENAI: 'openAi',
};

class RemoteFineTuneModel {
    constructor(keyValue, provider) {
        if (!provider) {
            provider = SupportedFineTuneModels.OPENAI;
        }

        const supportedModels = this.getSupportedModels();

        if (supportedModels.includes(provider)) {
            this.initiate(keyValue, provider);
        } else {
            const models = supportedModels.join(' - ');
            throw new Error(`The received keyValue is not supported. Send any model from: ${models}`);
        }
    }

    initiate(keyValue, keyType) {
        this.keyType = keyType;

        if (keyType === SupportedFineTuneModels.OPENAI) {
            this.openAIWrapper = new OpenAIWrapper(keyValue);
        } else {
            throw new Error('Invalid provider name');
        }
    }

    getSupportedModels() {
        return Object.values(SupportedFineTuneModels);
    }

    async generateFineTune(input) {
        if (this.keyType === SupportedFineTuneModels.OPENAI) {
            let params;
            if (input instanceof FineTuneInput) {
                params = input.getOpenAIInput();
            } else if (typeof input === 'object') {
                params = input;
            } else {
                throw new Error('Invalid input: Must be an instance of FineTuneInput or a dictionary');
            }

            const response = await this.openAIWrapper.storeFineTuningData(params);
            return response;
        } else {
            throw new Error('The keyType is not supported');
        }
    }

    async listFineTune(input) {
        if (this.keyType === SupportedFineTuneModels.OPENAI) {
            const response = await this.openAIWrapper.listFineTuningData(input);
            return response;
        } else {
            throw new Error('The keyType is not supported');
        }
    }

    async uploadFile(filePayload) {
        if (this.keyType === SupportedFineTuneModels.OPENAI) {
            return await this.openAIWrapper.uploadFile(filePayload);
        } else {
            throw new Error('The keyType is not supported');
        }
    }
}

module.exports = {
    RemoteFineTuneModel,
    SupportedFineTuneModels,
};
