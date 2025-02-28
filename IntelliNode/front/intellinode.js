(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.IntelliNode = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports={
  "url": {
    "intellicloud": {
      "base": "https://ue8sdr9bij.execute-api.us-east-2.amazonaws.com/v1",
      "semantic_search": "/semantic_search/"
    },
    "openai": {
      "base": "https://api.openai.com",
      "completions": "/v1/completions",
      "chatgpt": "/v1/chat/completions",
      "imagegenerate": "/v1/images/generations",
      "embeddings": "/v1/embeddings",
      "audiotranscriptions": "/v1/audio/transcriptions",
      "audiospeech": "/v1/audio/speech",
      "files": "/v1/files",
      "finetuning": "/v1/fine_tuning/jobs",
      "organization": null
    },
    "azure_openai": {
      "base": "https://{resource-name}.openai.azure.com/openai",
      "completions": "/deployments/{deployment-id}/completions?api-version={api-version}",
      "chatgpt": "/deployments/{deployment-id}/chat/completions?api-version={api-version}",
      "imagegenerate": "/images/generations:submit?api-version={api-version}",
      "embeddings": "/deployments/{deployment-id}/embeddings?api-version={api-version}",
      "audiotranscriptions": "/deployments/{deployment-id}/audio/transcriptions?api-version={api-version}",
      "audiospeech": "/deployments/{deployment-id}/audio/speech?api-version={api-version}",
      "files": "/files?api-version={api-version}",
      "finetuning": "/fine_tuning/jobs?api-version={api-version}"
    },
    "cohere": {
      "base": "https://api.cohere.ai",
      "completions": "/generate",
      "embed": "/v1/embed",
      "version": "2022-12-06"
    },
    "google": {
      "base": "https://{1}.googleapis.com/v1/",
      "speech": {
        "prefix": "texttospeech",
        "synthesize": {
          "postfix": "text:synthesize"
        }
      }
    },
    "stability": {
      "base": "https://api.stability.ai",
      "text_to_image": "/v1/generation/{1}/text-to-image",
      "upscale": "/v1/generation/{1}/image-to-image/upscale",
      "image_to_image": "/v1/generation/{1}/image-to-image",
      "inpaint": "/v2beta/stable-image/edit/inpaint",
      "outpaint": "/v2beta/stable-image/edit/outpaint",
      "image_to_video": "/v2beta/image-to-video",
      "fetch_video": "/v2beta/image-to-video/result/",
      "control_sketch": "/v2beta/stable-image/control/sketch",
      "control_structure": "/v2beta/stable-image/control/structure",
      "control_style": "/v2beta/stable-image/control/style"
    },
    "huggingface": {
      "base": "https://api-inference.huggingface.co/models"
    },
    "replicate": {
      "base": "https://api.replicate.com",
      "predictions": "/v1/predictions"
    },
    "mistral": {
      "base": "https://api.mistral.ai",
      "completions": "/v1/chat/completions",
      "embed": "/v1/embeddings"
    },
    "gemini": {
      "base": "https://generativelanguage.googleapis.com/v1beta/models/",
      "contentEndpoint": "gemini-pro:generateContent",
      "visionEndpoint": "gemini-pro-vision:generateContent",
      "embeddingEndpoint": "embedding-001:embedContent",
      "batchEmbeddingEndpoint": "embedding-001:batchEmbedContents"
    },
    "anthropic": {
      "base": "https://api.anthropic.com",
      "messages": "/v1/messages",
      "version": "2023-06-01"
    }
  },
  "nvidia": {
    "base": "https://integrate.api.nvidia.com",
    "chat": "/v1/chat/completions",
    "retrieval": "/v1/retrieval",
    "version": "v1"
  },
  "models": {
    "replicate": {
      "llama": {
        "70b": "70b-chat",
        "13b": "13b-chat",
        "70b-chat": "70b-chat",
        "13b-chat": "13b-chat",
        "34b-code": "34b-code",
        "34b-python": "34b-python",
        "13b-code-instruct": "13b-code-instruct",
        "llama-2-13b-embeddings": "llama-2-13b-embeddings",
        "70b-chat-version": "02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
        "13b-chat-version": "f4e2de70d66816a838a89eeeb621910adffb0dd0baba3976c96980970978018d",
        "34b-code-version": "efbd2ef6feefb242f359030fa6fe08ce32bfced18f3868b2915db41d41251b46",
        "34b-python-version": "482ba325daab209d121f45a0030f2f3ed942df98b185d41635ab3f19165a3547",
        "13b-code-instruct-version": "ca8c51bf3c1aaf181f9df6f10f31768f065c9dddce4407438adc5975a59ce530",
        "llama-2-13b-embeddings-version": "7115a4c65b86815e31412e53de1211c520164c190945a84c425b59dccbc47148"
      }
    }
  }
}
},{}],2:[function(require,module,exports){
const OpenAIWrapper = require('../wrappers/OpenAIWrapper');
const CohereAIWrapper = require('../wrappers/CohereAIWrapper');
const ReplicateWrapper = require('../wrappers/ReplicateWrapper');
const GeminiAIWrapper = require('../wrappers/GeminiAIWrapper');
const EmbedInput = require('../model/input/EmbedInput');
const VLLMWrapper = require('../wrappers/VLLMWrapper');

const SupportedEmbedModels = {
  OPENAI: 'openai',
  COHERE: 'cohere',
  REPLICATE: 'replicate',
  GEMINI: 'gemini',
  NVIDIA: 'nvidia',
  VLLM: "vllm"
};

class RemoteEmbedModel {
  constructor(keyValue, provider, customProxyHelper = null) {
    if (!provider) {
      provider = SupportedEmbedModels.OPENAI;
    }

    const supportedModels = this.getSupportedModels();

    if (supportedModels.includes(provider)) {
      this.initiate(keyValue, provider, customProxyHelper);
    } else {
      const models = supportedModels.join(' - ');
      throw new Error(`The received keyValue is not supported. Send any model from: ${models}`);
    }
  }

  initiate(keyValue, keyType, customProxyHelper = null) {
    this.keyType = keyType;

    if (keyType === SupportedEmbedModels.OPENAI) {
      this.openaiWrapper = new OpenAIWrapper(keyValue, customProxyHelper);
    } else if (keyType === SupportedEmbedModels.COHERE) {
      this.cohereWrapper = new CohereAIWrapper(keyValue);
    } else if (keyType === SupportedEmbedModels.REPLICATE) {
      this.replicateWrapper = new ReplicateWrapper(keyValue);
    } else if (keyType === SupportedEmbedModels.GEMINI) {
        this.geminiWrapper = new GeminiAIWrapper(keyValue);
    } else if (keyType === SupportedEmbedModels.NVIDIA) {
      this.nvidiaWrapper = new NvidiaWrapper(keyValue, customProxyHelper);
    } else if (keyType === SupportedEmbedModels.VLLM) {
      const baseUrl = customProxyHelper.baseUrl;
      this.vllmWrapper = new VLLMWrapper(baseUrl);
    } else {
      throw new Error('Invalid provider name');
    }
  }

  getSupportedModels() {
    return Object.values(SupportedEmbedModels);
  }

  async getEmbeddings(embedInput) {
    let inputs;

    if (embedInput instanceof EmbedInput) {
      if (this.keyType === SupportedEmbedModels.OPENAI) {
        inputs = embedInput.getOpenAIInputs();
      } else if (this.keyType === SupportedEmbedModels.COHERE) {
        inputs = embedInput.getCohereInputs();
      } else if (this.keyType === SupportedEmbedModels.REPLICATE) {
        inputs = embedInput.getLlamaReplicateInput();
      } else if (this.keyType === SupportedEmbedModels.GEMINI) {
        inputs = embedInput.getGeminiInputs();
      } else if (this.keyType === SupportedEmbedModels.NVIDIA) {
        inputs = embedInput.getNvidiaInputs();
      } else if (this.keyType === SupportedEmbedModels.VLLM) {
        inputs = embedInput.getVLLMInputs();
     } else {
        throw new Error('The keyType is not supported');
      }
    } else if (typeof embedInput === 'object') {
      inputs = embedInput;
    } else {
      throw new Error('Invalid input: Must be an instance of EmbedInput or a dictionary');
    }

    if (this.keyType === SupportedEmbedModels.OPENAI) {
      const results = await this.openaiWrapper.getEmbeddings(inputs);
      return results.data;
    } else if (this.keyType === SupportedEmbedModels.COHERE) {
      const results = await this.cohereWrapper.getEmbeddings(inputs);
      
      let embeddings = results.embeddings;
      embeddings = embeddings.map((embedding, index) => ({
        object: "embedding",
        index: index,
        embedding: embedding
      }));

      return embeddings;

    } else if (this.keyType === SupportedEmbedModels.REPLICATE) {

      const prediction = await this.replicateWrapper.predict('replicate', inputs);
      
      // Return a Promise that resolves with unified embedding result
      return new Promise((resolve, reject) => {
        const poll = setInterval(async () => {
          try {
            const status = await this.replicateWrapper.getPredictionStatus(prediction.id);
            if (status.status === 'succeeded' || status.status === 'failed') {
              clearInterval(poll); // Stop polling
              if (status.status === 'succeeded') {

                let embeddings = status.output;
                embeddings = embeddings.map((embedding, index) => ({
                  object: "embedding",
                  index: index,
                  embedding: embedding
                }));
                
                resolve(embeddings);
              } else {
                reject(new Error('Replicate prediction failed: ' + status.error));
              }
            }
          } catch (error) {
            clearInterval(poll);
            reject(new Error('Error while polling for Replicate prediction status: ' + error.message));
          }
        }, 1000);
      });
    } else if (this.keyType === SupportedEmbedModels.GEMINI) {
      return await this.geminiWrapper.getEmbeddings(inputs);
    } else if (this.keyType === SupportedEmbedModels.NVIDIA) {
      const result = await this.nvidiaWrapper.generateRetrieval(inputs);
      return Array.isArray(result) ? result : [];
    } else if (this.keyType === SupportedEmbedModels.VLLM) {
      const results = await this.vllmWrapper.getEmbeddings(inputs.texts);
      return results.embeddings.map((embedding, index) => ({
        object: "embedding",
        index: index,
        embedding: embedding
      }));
    }else {
      throw new Error('The keyType is not supported');
    }
  }
}

module.exports = {
  RemoteEmbedModel,
  SupportedEmbedModels,
};
},{"../model/input/EmbedInput":14,"../wrappers/CohereAIWrapper":42,"../wrappers/GeminiAIWrapper":43,"../wrappers/OpenAIWrapper":49,"../wrappers/ReplicateWrapper":50,"../wrappers/VLLMWrapper":52}],3:[function(require,module,exports){
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

},{"../model/input/FineTuneInput":15,"../wrappers/OpenAIWrapper":49}],4:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode
*/
const SupportedImageModels = {
  OPENAI: "openai",
  STABILITY: "stability",
};

const OpenAIWrapper = require("../wrappers/OpenAIWrapper");
const StabilityAIWrapper = require("../wrappers/StabilityAIWrapper");
const ImageModelInput = require("../model/input/ImageModelInput");

class RemoteImageModel {
  constructor(keyValue, provider) {
    if (!provider) {
      provider = SupportedImageModels.OPENAI;
    }

    const supportedModels = RemoteImageModel.getSupportedModels();

    if (supportedModels.includes(provider)) {
      this.initiate(keyValue, provider);
    } else {
      const models = supportedModels.join(" - ");
      throw new Error(
        `The received keyValue is not supported. Send any model from: ${models}`
      );
    }
  }

  initiate(keyValue, keyType) {
    this.keyType = keyType;

    if (keyType === SupportedImageModels.OPENAI) {
      this.openaiWrapper = new OpenAIWrapper(keyValue);
    } else if (keyType === SupportedImageModels.STABILITY) {
      this.stabilityWrapper = new StabilityAIWrapper(keyValue);
    } else {
      throw new Error("Invalid provider name");
    }
  }

  static getSupportedModels() {
    return Object.values(SupportedImageModels);
  }

  async generateImages(imageInput) {
    let inputs;

    if (imageInput instanceof ImageModelInput) {
      if (this.keyType === SupportedImageModels.OPENAI) {
        inputs = imageInput.getOpenAIInputs();
      } else if (this.keyType === SupportedImageModels.STABILITY) {
        inputs = imageInput.getStabilityInputs();
      } else {
        throw new Error("The keyType is not supported");
      }
    } else if (typeof imageInput === "object") {
      inputs = imageInput;
    } else {
      throw new Error(
        "Invalid input: Must be an instance of ImageModelInput or a dictionary"
      );
    }

    if (this.keyType === SupportedImageModels.OPENAI) {
      const results = await this.openaiWrapper.generateImages(inputs);
      
      /*console.log('results: ', results)*/

      return results.data.map((data) => {
        if (data.url) {
          return data.url;
        } else if (data.b64_json) {
          return data.b64_json;
        } else {
          throw new Error('Unexpected image data format');
        }
      });

    } else if (this.keyType === SupportedImageModels.STABILITY) {
      
      const results = await this.stabilityWrapper.generateImageDispatcher(inputs);
      
      return results.artifacts.map((imageObj) => imageObj.base64);

    } else {
      throw new Error(`This version supports ${SupportedImageModels.OPENAI} keyType only`);
    }
  }
}

module.exports = {
  RemoteImageModel,
  SupportedImageModels,
};
},{"../model/input/ImageModelInput":17,"../wrappers/OpenAIWrapper":49,"../wrappers/StabilityAIWrapper":51}],5:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const OpenAIWrapper = require('../wrappers/OpenAIWrapper');
const CohereAIWrapper = require('../wrappers/CohereAIWrapper');
const LanguageModelInput = require('../model/input/LanguageModelInput');

const SupportedLangModels = {
  OPENAI: 'openai',
  COHERE: 'cohere',
};

class RemoteLanguageModel {
  constructor(keyValue, provider) {
    if (!provider) {
      provider = SupportedLangModels.OPENAI;
    }

    const supportedModels = RemoteLanguageModel.getSupportedModels();

    if (supportedModels.includes(provider)) {
      this.initiate(keyValue, provider);
    } else {
      const models = supportedModels.join(' - ');
      throw new Error(`The received keyValue is not supported. Send any model from: ${models}`);
    }
  }

  initiate(keyValue, keyType) {
    this.keyType = keyType;

    if (keyType === SupportedLangModels.OPENAI) {
      this.openaiWrapper = new OpenAIWrapper(keyValue);
    } else if (keyType === SupportedLangModels.COHERE) {
      this.cohereWrapper = new CohereAIWrapper(keyValue);
    } else {
      throw new Error('Invalid provider name');
    }
  }

  static getSupportedModels() {
    return Object.values(SupportedLangModels);
  }

  async generateText(langInput) {

    let inputs;

    if (langInput instanceof LanguageModelInput) {
      if (this.keyType === SupportedLangModels.OPENAI) {
        inputs = langInput.getOpenAIInputs();
      } else if (this.keyType === SupportedLangModels.COHERE) {
        inputs = langInput.getCohereInputs();
      } else {
        throw new Error('The keyType is not supported');
      }
    } else if (typeof langInput === 'object') {
      inputs = langInput;
    } else {
      throw new Error('Invalid input: Must be an instance of LanguageModelInput or a dictionary');
    }

    if (this.keyType === SupportedLangModels.OPENAI) {
      const results = await this.openaiWrapper.generateText(inputs);
      return results.choices.map((choice) => choice.text);
    } else if (this.keyType === SupportedLangModels.COHERE) {
      const results = await this.cohereWrapper.generateText(inputs);
      return results.generations.map((generation) => generation.text);
    } else {
      throw new Error('The keyType is not supported');
    }
  }
}

module.exports = {
  RemoteLanguageModel,
  SupportedLangModels,
};
},{"../model/input/LanguageModelInput":18,"../wrappers/CohereAIWrapper":42,"../wrappers/OpenAIWrapper":49}],6:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const GoogleAIWrapper = require('../wrappers/GoogleAIWrapper');
const OpenAIWrapper = require('../wrappers/OpenAIWrapper');
const Text2SpeechInput = require('../model/input/Text2SpeechInput');

const SupportedSpeechModels = {
  GOOGLE: 'google',
  OPENAI: 'openAi',
};

class RemoteSpeechModel {
  constructor(keyValue, provider) {
    if (!provider) {
      provider = SupportedSpeechModels.GOOGLE;
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

    if (keyType === SupportedSpeechModels.GOOGLE) {
      this.googleWrapper = new GoogleAIWrapper(keyValue);
    } else if (keyType === SupportedSpeechModels.OPENAI) {
      this.openAIWrapper = new OpenAIWrapper(keyValue);
    } else {
      throw new Error('Invalid provider name');
    }
  }

  getSupportedModels() {
    return Object.values(SupportedSpeechModels);
  }

  async generateSpeech(input) {
    if (this.keyType === SupportedSpeechModels.GOOGLE) {
      let params;

      if (input instanceof Text2SpeechInput) {
        params = input.getGoogleInput();
      } else if (typeof input === 'object') {
        params = input;
      } else {
        throw new Error('Invalid input: Must be an instance of Text2SpeechInput or a dictionary');
      }

      const response = await this.googleWrapper.generateSpeech(params);
      return response.audioContent;
    } else if (this.keyType === SupportedSpeechModels.OPENAI) {
      let params;

      if (input instanceof Text2SpeechInput) {
        params = input.getOpenAIInput();
      } else if (typeof input === 'object') {
        params = input;
      } else {
        throw new Error('Invalid input: Must be an instance of Text2SpeechInput or a dictionary');
      }

      const response = await this.openAIWrapper.textToSpeech(params);
      return response;
    }  else {
      throw new Error('The keyType is not supported');
    }
  }
}

module.exports = {
  RemoteSpeechModel,
  SupportedSpeechModels,
};

},{"../model/input/Text2SpeechInput":19,"../wrappers/GoogleAIWrapper":44,"../wrappers/OpenAIWrapper":49}],7:[function(require,module,exports){
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
    NvidiaInput
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
            return await this._chatVLLM(modelInput);
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
        } else {
            throw new Error("The stream function support only chatGPT, for other providers use chat function.");
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
},{"../model/input/ChatModelInput":13,"../utils/StreamParser":38,"../utils/SystemHelper":39,"../wrappers/AWSEndpointWrapper":40,"../wrappers/AnthropicWrapper":41,"../wrappers/CohereAIWrapper":42,"../wrappers/GeminiAIWrapper":43,"../wrappers/IntellicloudWrapper":46,"../wrappers/MistralAIWrapper":47,"../wrappers/NvidiaWrapper":48,"../wrappers/OpenAIWrapper":49,"../wrappers/ReplicateWrapper":50,"../wrappers/VLLMWrapper":52}],8:[function(require,module,exports){
(function (Buffer){(function (){
// Gen.js
const { RemoteLanguageModel } = require("../controller/RemoteLanguageModel");
const { RemoteImageModel, SupportedImageModels } = require("../controller/RemoteImageModel");
const { RemoteSpeechModel } = require("../controller/RemoteSpeechModel");
const LanguageModelInput = require("../model/input/LanguageModelInput");
const ImageModelInput = require("../model/input/ImageModelInput");
const Text2SpeechInput = require("../model/input/Text2SpeechInput");
const { Chatbot, SupportedChatModels } = require("../function/Chatbot");
const { ChatGPTInput, ChatGPTMessage, NvidiaInput } = require("../model/input/ChatModelInput");
const { SupportedLangModels } = require('../controller/RemoteLanguageModel');
const SystemHelper = require("../utils/SystemHelper");
const Prompt = require("../utils/Prompt");
const FileHelper = require("../utils/FileHelper");
const path = require('path');

function stripThinking(text) {
  /** emove any <think>...</think> block from NVIDIA responses. */
  return text.replace(/<think>[\s\S]*?<\/think>/, '').trim();
}

class Gen {
  // Marketing description generation
  static async get_marketing_desc(promptString, apiKey, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    if (provider === SupportedLangModels.OPENAI) {
      const chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);
      const input = new ChatGPTInput("generate marketing description", { maxTokens: 800 });
      input.addUserMessage(`Create a marketing description for the following: ${promptString}`);
      const responses = await chatbot.chat(input);
      return responses[0].trim();
    } else if (provider === SupportedLangModels.COHERE) {
      const langInput = new LanguageModelInput({ prompt: `Create a marketing description for the following: ${promptString}` });
      langInput.setDefaultValues(SupportedLangModels.COHERE, 400);
      const cohereLanguageModel = new RemoteLanguageModel(apiKey, provider);
      const responses = await cohereLanguageModel.generateText(langInput);
      return responses[0].trim();
    } else if (provider === SupportedChatModels.NVIDIA) {
      const chatbot = new Chatbot(apiKey, SupportedChatModels.NVIDIA, customProxyHelper);
      const input = new NvidiaInput("generate marketing description", { maxTokens: 800, model: 'deepseek-ai/deepseek-r1', temperature: 0.6 });
      input.addUserMessage(`Create a marketing description for the following: ${promptString}`);
      const responses = await chatbot.chat(input);
      let text = responses[0].trim();
      return stripThinking(text);
    } else {
      const supported = RemoteLanguageModel.getSupportedModels().join(' - ');
      throw new Error(`Unsupported provider. Use one of: ${supported}, ${SupportedChatModels.NVIDIA}`);
    }
  }

  // Blog post generation
  static async get_blog_post(promptString, apiKey, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    if (provider === SupportedLangModels.OPENAI) {
      const chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);
      const input = new ChatGPTInput("generate blog post", { maxTokens: 1200 });
      input.addUserMessage(`Write a blog post about ${promptString}`);
      const responses = await chatbot.chat(input);
      return responses[0].trim();
    } else if (provider === SupportedLangModels.COHERE) {
      const langInput = new LanguageModelInput({ prompt: `Write a blog post with section titles about ${promptString}` });
      langInput.setDefaultValues(SupportedLangModels.COHERE, 1200);
      const cohereLanguageModel = new RemoteLanguageModel(apiKey, provider);
      const responses = await cohereLanguageModel.generateText(langInput);
      return responses[0].trim();
    } else if (provider === SupportedChatModels.NVIDIA) {
      const chatbot = new Chatbot(apiKey, SupportedChatModels.NVIDIA, customProxyHelper);
      const input = new NvidiaInput("generate blog post", { maxTokens: 1200, model: 'deepseek-ai/deepseek-r1', temperature: 0.6 });
      input.addUserMessage(`Write a blog post about ${promptString}`);
      const responses = await chatbot.chat(input);
      let text = responses[0].trim();
      return stripThinking(text);
    } else {
      const supported = RemoteLanguageModel.getSupportedModels().join(' - ');
      throw new Error(`Unsupported provider. Use one of: ${supported}, ${SupportedChatModels.NVIDIA}`);
    }
  }

  // Image description (unchanged)
  static async getImageDescription(promptString, apiKey, customProxyHelper = null) {
    const chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);
    const input = new ChatGPTInput("Generate image description", {});
    input.addUserMessage(`Generate image description from the following text: ${promptString}`);
    const responses = await chatbot.chat(input);
    return responses[0].trim();
  }

  // Generate image from description (unchanged)
  static async generate_image_from_desc(promptString, openaiKey, imageApiKey, is_base64 = true, width = 1024,
                                          height = 1024, provider = SupportedImageModels.STABILITY, customProxyHelper = null) {
    const imageDescription = await Gen.getImageDescription(promptString, openaiKey, customProxyHelper);
    const imgModel = new RemoteImageModel(imageApiKey, provider);
    const images = await imgModel.generateImages(
      new ImageModelInput({
        prompt: imageDescription,
        numberOfImages: 1,
        width: width,
        height: height,
        responseFormat: 'b64_json'
      })
    );
    return is_base64 ? images[0] : Buffer.from(images[0], "base64");
  }

  // Speech synthesis (unchanged)
  static async generate_speech_synthesis(text, googleKey) {
    const speechModel = new RemoteSpeechModel(googleKey, "google");
    const input = new Text2SpeechInput({ text: text, language: "en-gb" });
    return await speechModel.generateSpeech(input);
  }

  // Generate HTML page
  static async generate_html_page(text, apiKey, model_name = 'gpt-4o', provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    const template = new SystemHelper().loadPrompt("html_page");
    const promptTemp = new Prompt(template);
    let tokenSize = 8000;
    if (model_name.includes('-16k')) {
      tokenSize = 8000;
    } else if (model_name.includes('gpt-4o')) {
      tokenSize = 12000;
    } else if (model_name.includes('gpt-4')) {
      tokenSize = 4000;
    } else if (model_name.includes('deepseek')) {
      tokenSize = 15000;
    }
    let chatbot, input;
    if (provider === SupportedLangModels.OPENAI) {
      chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);
      input = new ChatGPTInput('generate html, css and javascript. Follow this template: {"html": "<code>", "message":"<text>"}',
        { maxTokens: tokenSize, model: model_name, temperature: 0.8 });
    } else if (provider === SupportedChatModels.NVIDIA) {
      chatbot = new Chatbot(apiKey, SupportedChatModels.NVIDIA, customProxyHelper);
      input = new NvidiaInput('generate html, css and javascript. Follow this template: {"html": "<code>", "message":"<text>"}',
        { maxTokens: tokenSize, model: 'deepseek-ai/deepseek-r1', temperature: 0.8 });
    } else {
      throw new Error("Unsupported provider for generate_html_page.");
    }
    input.addUserMessage(promptTemp.format({ 'text': text }));
    const responses = await chatbot.chat(input);
    let cleaned = responses[0]
      .trim()
      .replace(/```json/g, '')
      .replace(/```/g, '');
    if (provider === SupportedChatModels.NVIDIA) {
      cleaned = stripThinking(cleaned);
    }
    return JSON.parse(cleaned);
  }

  // Save HTML page (calls generate_html_page)
  static async save_html_page(text, folder, file_name, apiKey, model_name = 'gpt-4o', provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    const htmlCode = await Gen.generate_html_page(text, apiKey, model_name, provider, customProxyHelper);
    const folderPath = path.join(folder, file_name + '.html');
    FileHelper.writeDataToFile(folderPath, htmlCode['html']);
    return true;
  }

  // Generate dashboard
  static async generate_dashboard(csvStrData, topic, apiKey, model_name = 'gpt-4o', num_graphs = 1, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    if (num_graphs < 1 || num_graphs > 4) {
      throw new Error('num_graphs must be between 1 and 4.');
    }
    const template = new SystemHelper().loadPrompt("graph_dashboard");
    const promptTemp = new Prompt(template);
    let tokenSize = 2100;
    if (model_name.includes('-16k')) {
      tokenSize = 8000;
    } else if (model_name.includes('gpt-4o')) {
      tokenSize = 12000;
    } else if (model_name.includes('gpt-4')) {
      tokenSize = 3900;
    } else if (model_name.includes('deepseek')) {
      tokenSize = 15000;
    }
    let chatbot, input;
    if (provider === SupportedLangModels.OPENAI) {
      chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);
      input = new ChatGPTInput('Generate HTML graphs from CSV data. Response must be valid JSON with full HTML code.',
        { maxTokens: tokenSize, model: model_name, temperature: 0.3 });
    } else if (provider === SupportedChatModels.NVIDIA) {
      chatbot = new Chatbot(apiKey, SupportedChatModels.NVIDIA, customProxyHelper);
      input = new NvidiaInput('Generate HTML graphs from CSV data. Response must be valid JSON with full HTML code.',
        { maxTokens: tokenSize, model: 'deepseek-ai/deepseek-r1', temperature: 0.3 });
    } else {
      throw new Error("Unsupported provider for generate_dashboard.");
    }
    input.addUserMessage(promptTemp.format({ 'count': num_graphs, 'topic': topic, 'text': csvStrData }));
    const responses = await chatbot.chat(input);
    let cleaned = responses[0]
      .trim()
      .replace(/```json/g, '')
      .replace(/```/g, '');
    if (provider === SupportedChatModels.NVIDIA) {
      cleaned = stripThinking(cleaned);
    }
    return JSON.parse(cleaned)[0];
  }

  // Instruct update
  static async instructUpdate(modelOutput, userInstruction, type = '', apiKey, model_name = 'gpt-4o', provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    const template = new SystemHelper().loadPrompt("instruct_update");
    const promptTemp = new Prompt(template);
    let tokenSize = 2000;
    if (model_name.includes('gpt-4')) {
      tokenSize = 3900;
    }
    let chatbot, input;
    if (provider === SupportedLangModels.OPENAI) {
      chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);
      input = new ChatGPTInput('Update the model message based on user feedback while maintaining format.',
        { maxTokens: tokenSize, model: model_name, temperature: 0.2 });
    } else if (provider === SupportedChatModels.NVIDIA) {
      chatbot = new Chatbot(apiKey, SupportedChatModels.NVIDIA, customProxyHelper);
      input = new NvidiaInput('Update the model message based on user feedback while maintaining format.',
        { maxTokens: tokenSize, model: 'deepseek-ai/deepseek-r1', temperature: 0.2 });
    } else {
      throw new Error("Unsupported provider for instructUpdate.");
    }
    input.addUserMessage(promptTemp.format({ 'model_output': modelOutput, 'user_instruction': userInstruction, 'type': type }));
    const responses = await chatbot.chat(input);
    let text = responses[0].trim();
    if (provider === SupportedChatModels.NVIDIA) {
      text = stripThinking(text);
    }
    return text;
  }
}

module.exports = { Gen };

}).call(this)}).call(this,require("buffer").Buffer)
},{"../controller/RemoteImageModel":4,"../controller/RemoteLanguageModel":5,"../controller/RemoteSpeechModel":6,"../function/Chatbot":7,"../model/input/ChatModelInput":13,"../model/input/ImageModelInput":17,"../model/input/LanguageModelInput":18,"../model/input/Text2SpeechInput":19,"../utils/FileHelper":32,"../utils/Prompt":36,"../utils/SystemHelper":39,"buffer":22,"path":26}],9:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { RemoteEmbedModel, SupportedEmbedModels } = require('../controller/RemoteEmbedModel');
const EmbedInput = require('../model/input/EmbedInput');
const MatchHelpers = require('../utils/MatchHelpers');

class SemanticSearch {
  constructor(keyValue, provider = SupportedEmbedModels.OPENAI, customProxyHelper = null) {
    this.keyValue = keyValue;
    this.provider = provider;

    this.remoteEmbedModel = new RemoteEmbedModel(keyValue, provider, customProxyHelper);
  }

  async getTopMatches(pivotItem, searchArray, numberOfMatches, modelName = null) {

      if (numberOfMatches > searchArray.length) {
        throw new Error('numberOfMatches should not be greater than the searchArray');
      }

      const embedInput = new EmbedInput({
        texts: [pivotItem, ...searchArray],
        model: modelName
      });

      if (modelName == null) {
        embedInput.setDefaultValues(this.provider);
      }

      const embeddingsResponse = await this.remoteEmbedModel.getEmbeddings(embedInput);

      // Extract embeddings based on the provider
      let embeddings;
      if (this.provider === SupportedEmbedModels.OPENAI) {
        embeddings = embeddingsResponse.map((item) => item.embedding);
      } else if (this.provider === SupportedEmbedModels.COHERE) {
        embeddings = embeddingsResponse.map((item) => item.embedding);
      } else {
        throw new Error('Invalid provider name');
      }

      const pivotEmbedding = embeddings[0];
      const searchEmbeddings = embeddings.slice(1);

      return this.getTopMatchesFromEmbeddings(pivotEmbedding, searchEmbeddings, numberOfMatches);
    }

  getTopVectorMatches(pivotEmbedding, searchEmbeddings, numberOfMatches) {
    if (numberOfMatches >= searchEmbeddings.length) {
      throw new Error('numberOfMatches should be less than the length of the searchEmbeddings');
    }

    return this.getTopMatchesFromEmbeddings(pivotEmbedding, searchEmbeddings, numberOfMatches);
  }

  getTopMatchesFromEmbeddings(pivotEmbedding, searchEmbeddings, numberOfMatches) {
    const similarities = searchEmbeddings.map((embedding) => MatchHelpers.cosineSimilarity(pivotEmbedding, embedding));
    const sortedIndices = this.argsort(similarities).reverse();
    const topMatchesIndices = sortedIndices.slice(0, numberOfMatches);

    return topMatchesIndices.map((index) => ({ index, similarity: similarities[index] }));
  }

  argsort(array) {
    const arrayObject = array.map((value, index) => ({ value, index }));
    arrayObject.sort((a, b) => a.value - b.value);
    return arrayObject.map((item) => item.index);
  }

  filterTopMatches(searchResults, originalArray) {
      return searchResults.map(result => (originalArray[result.index]));
  }
}

module.exports = { SemanticSearch };

},{"../controller/RemoteEmbedModel":2,"../model/input/EmbedInput":14,"../utils/MatchHelpers":34}],10:[function(require,module,exports){
const { SemanticSearch } = require('./SemanticSearch'); // assuming path

class SemanticSearchPaging extends SemanticSearch {
  constructor(keyValue, provider, pivotItem, numberOfMatches) {
    super(keyValue, provider);
    this.pivotItem = pivotItem;
    this.numberOfMatches = numberOfMatches;
    this.textAndMatches = []; // To store { text: '...', similarity: 0.9 } results
    this.topMatches = [];
  }

  async addNewData(newSearchItems) {
      // get the best matches for new items
      const newMatches = await super.getTopMatches(this.pivotItem, newSearchItems, newSearchItems.length);

      // map the matches format
      const newMatchesWithText = newMatches.map(match => ({
        text: newSearchItems[match.index],
        score: match.similarity,
      }));

      // combine with old top matches and sort
      this.topMatches = [...this.topMatches, ...newMatchesWithText]
        .sort((a, b) => b.score - a.score)
        .slice(0, this.numberOfMatches);
}

  getCurrentTopMatches() {
    return this.topMatches;
  }

  clean() {
    this.topMatches = [];
  }
}

module.exports = { SemanticSearchPaging };
},{"./SemanticSearch":9}],11:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0
*/
const { RemoteLanguageModel, SupportedLangModels } = require("../controller/RemoteLanguageModel");
const LanguageModelInput = require("../model/input/LanguageModelInput");
const SystemHelper = require("../utils/SystemHelper");

class TextAnalyzer {
  constructor(keyValue, provider = SupportedLangModels.OPENAI) {
    if (!Object.values(SupportedLangModels).includes(provider)) {
      throw new Error(`The specified provider '${provider}' is not supported. Supported providers are: ${Object.values(SupportedLangModels).join(", ")}`);
    }
    this.provider = provider;
    this.remoteLanguageModel = new RemoteLanguageModel(keyValue, provider);
    this.systemHelper = new SystemHelper();
  }

  async summarize(text, options = {}) {
    const summaryPromptTemplate = this.systemHelper.loadPrompt("summary");
    const prompt = summaryPromptTemplate.replace("${text}", text);
    const modelInput = new LanguageModelInput({
      prompt,
      maxTokens: options.maxTokens || null,
      temperature: options.temperature || 0.5,
    });
    modelInput.setDefaultModels(this.provider);
    const [summary] = await this.remoteLanguageModel.generateText(modelInput);
    return summary.trim();
  }

  async sentimentAnalysis(text, options = {}) {
    const mode = this.systemHelper.loadPrompt("sentiment");
    const prompt = `${mode}\n\nAnalyze the sentiment of the following text: ${text}\n\nSentiment: `;

    const modelInput = new LanguageModelInput({
      prompt,
      maxTokens: options.maxTokens || 60,
      temperature: options.temperature || 0,
    });
    modelInput.setDefaultModels(this.provider);
    const [sentiment] = await this.remoteLanguageModel.generateText(modelInput);

    const sentiment_output = JSON.parse(sentiment.trim());
    return sentiment_output;
  }
}

module.exports = { TextAnalyzer };
},{"../controller/RemoteLanguageModel":5,"../model/input/LanguageModelInput":18,"../utils/SystemHelper":39}],12:[function(require,module,exports){
// controllers
const {
  RemoteLanguageModel,
  SupportedLangModels,
} = require('./controller/RemoteLanguageModel');
const {
  RemoteImageModel,
  SupportedImageModels,
} = require('./controller/RemoteImageModel');
const {
  RemoteFineTuneModel,
  SupportedFineTuneModels,
} = require('./controller/RemoteFineTuneModel');
const {
  RemoteSpeechModel,
  SupportedSpeechModels,
} = require('./controller/RemoteSpeechModel');
const {
  RemoteEmbedModel,
  SupportedEmbedModels,
} = require('./controller/RemoteEmbedModel');
// functions
const {
  Chatbot,
  SupportedChatModels,
} = require('./function/Chatbot');
const { SemanticSearch } = require('./function/SemanticSearch');
const {
  SemanticSearchPaging,
} = require('./function/SemanticSearchPaging');
const { TextAnalyzer } = require('./function/TextAnalyzer');
const { Gen } = require('./function/Gen');

// inputs
const LanguageModelInput = require('./model/input/LanguageModelInput');
const ImageModelInput = require('./model/input/ImageModelInput');
const Text2SpeechInput = require('./model/input/Text2SpeechInput');
const {
  ChatGPTInput,
  ChatLLamaInput,
  LLamaReplicateInput,
  ChatGPTMessage,
  LLamaSageInput,
  CohereInput,
  MistralInput,
  GeminiInput,
  AnthropicInput,
  NvidiaInput,
  VLLMInput
} = require('./model/input/ChatModelInput');
const FunctionModelInput = require('./model/input/FunctionModelInput');
const EmbedInput = require('./model/input/EmbedInput');
const FineTuneInput = require('./model/input/FineTuneInput');
// wrappers
const CohereAIWrapper = require('./wrappers/CohereAIWrapper');
const GoogleAIWrapper = require('./wrappers/GoogleAIWrapper');
const OpenAIWrapper = require('./wrappers/OpenAIWrapper');
const StabilityAIWrapper = require('./wrappers/StabilityAIWrapper');
const HuggingWrapper = require('./wrappers/HuggingWrapper');
const ReplicateWrapper = require('./wrappers/ReplicateWrapper');
const AWSEndpointWrapper = require('./wrappers/AWSEndpointWrapper');
const IntellicloudWrapper = require('./wrappers/IntellicloudWrapper');
const MistralAIWrapper = require('./wrappers/MistralAIWrapper');
const GeminiAIWrapper = require('./wrappers/GeminiAIWrapper');
const AnthropicWrapper = require('./wrappers/AnthropicWrapper');
const NvidiaWrapper = require('./wrappers/NvidiaWrapper');
const VLLMWrapper = require('./wrappers/VLLMWrapper');
// utils
const { LLMEvaluation } = require('./utils/LLMEvaluation');
const AudioHelper = require('./utils/AudioHelper');
const ConnHelper = require('./utils/ConnHelper');
const MatchHelpers = require('./utils/MatchHelpers');
const SystemHelper = require('./utils/SystemHelper');
const Prompt = require('./utils/Prompt');
const ProxyHelper = require('./utils/ProxyHelper');
const { GPTStreamParser, CohereStreamParser} = require('./utils/StreamParser');
const ChatContext = require('./utils/ChatContext');

module.exports = {
  RemoteLanguageModel,
  SupportedLangModels,
  LanguageModelInput,
  RemoteImageModel,
  SupportedImageModels,
  ImageModelInput,
  RemoteSpeechModel,
  SupportedSpeechModels,
  Text2SpeechInput,
  CohereAIWrapper,
  GoogleAIWrapper,
  OpenAIWrapper,
  StabilityAIWrapper,
  AudioHelper,
  ConnHelper,
  Chatbot,
  SupportedChatModels,
  ChatGPTInput,
  ChatLLamaInput,
  LLamaReplicateInput,
  ChatGPTMessage,
  EmbedInput,
  MatchHelpers,
  RemoteEmbedModel,
  SupportedEmbedModels,
  SemanticSearch,
  SystemHelper,
  TextAnalyzer,
  HuggingWrapper,
  ReplicateWrapper,
  Gen,
  ProxyHelper,
  FunctionModelInput,
  AWSEndpointWrapper,
  Prompt,
  LLamaSageInput,
  LLMEvaluation,
  SemanticSearchPaging,
  GPTStreamParser,
  CohereStreamParser,
  ChatContext,
  CohereInput,
  IntellicloudWrapper, 
  MistralAIWrapper,
  MistralInput,
  RemoteFineTuneModel,
  SupportedFineTuneModels,
  FineTuneInput,
  GeminiInput,
  GeminiAIWrapper,
  AnthropicInput,
  AnthropicWrapper,
  NvidiaInput,
  NvidiaWrapper,
  VLLMWrapper,
  VLLMInput
};

},{"./controller/RemoteEmbedModel":2,"./controller/RemoteFineTuneModel":3,"./controller/RemoteImageModel":4,"./controller/RemoteLanguageModel":5,"./controller/RemoteSpeechModel":6,"./function/Chatbot":7,"./function/Gen":8,"./function/SemanticSearch":9,"./function/SemanticSearchPaging":10,"./function/TextAnalyzer":11,"./model/input/ChatModelInput":13,"./model/input/EmbedInput":14,"./model/input/FineTuneInput":15,"./model/input/FunctionModelInput":16,"./model/input/ImageModelInput":17,"./model/input/LanguageModelInput":18,"./model/input/Text2SpeechInput":19,"./utils/AudioHelper":28,"./utils/ChatContext":29,"./utils/ConnHelper":30,"./utils/LLMEvaluation":33,"./utils/MatchHelpers":34,"./utils/Prompt":36,"./utils/ProxyHelper":37,"./utils/StreamParser":38,"./utils/SystemHelper":39,"./wrappers/AWSEndpointWrapper":40,"./wrappers/AnthropicWrapper":41,"./wrappers/CohereAIWrapper":42,"./wrappers/GeminiAIWrapper":43,"./wrappers/GoogleAIWrapper":44,"./wrappers/HuggingWrapper":45,"./wrappers/IntellicloudWrapper":46,"./wrappers/MistralAIWrapper":47,"./wrappers/NvidiaWrapper":48,"./wrappers/OpenAIWrapper":49,"./wrappers/ReplicateWrapper":50,"./wrappers/StabilityAIWrapper":51,"./wrappers/VLLMWrapper":52}],13:[function(require,module,exports){
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
    this.model = options.model || 'gpt-4o';
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
    this.model = options.model || 'command-r';
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

class NvidiaInput extends ChatModelInput {
  constructor(systemMessage, options = {}) {
    super(options);
    if (typeof systemMessage === 'string') {
      this.messages = [{ role: 'system', content: systemMessage }];
    } else {
      this.messages = [];
    }
    this.model = options.model || 'deepseek-ai/deepseek-r1';
    this.temperature = options.temperature || 0.7;
    this.maxTokens = options.maxTokens || 1024;
    this.topP = options.topP || 1.0;
    this.presencePenalty = options.presencePenalty || 0;
    this.frequencyPenalty = options.frequencyPenalty || 0;
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
    this.temperature = options.temperature || 0.7;
    this.top_p = options.top_p || 1.0;
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

},{"../../config.json":1}],14:[function(require,module,exports){
const config = require('../../config.json');

class EmbedInput {
  constructor({
    texts,
    model = null,
  }) {
    this.texts = texts;
    this.model = model;
  }

  getCohereInputs() {
    const inputs = {
      texts: this.texts,
      ...this.model && { model: this.model },
    };

    return inputs;
  }

  getOpenAIInputs() {
    const inputs = {
      input: this.texts,
      ...this.model && { model: this.model },
    };

    return inputs;
  }

  getLlamaReplicateInput() {
    return {
      version: this.model,
      input: {
        prompts: this.texts.join("\n\n"),
        prompt_separator: "\n\n",
      }
    };
  }

  getGeminiInputs() {
      return {
          model: this.model,
          content: {
              parts: this.texts.map(text => ({text}))
          }
      };
  }

  getNvidiaInputs(input_type="query") {
    return {
      input: this.texts,
      model: this.model,
      input_type: input_type,
      encoding_format: "float",
      truncate: "NONE"
    };
  }

  getVLLMInputs() {
      return {
        texts: this.texts,
      };
  }

  setDefaultValues(provider) {
    if (provider === "openai") {
      this.model = "text-embedding-3-small";
    } else if (provider === "cohere") {
      this.model = "embed-multilingual-v2.0";
    } else if (provider === "replicate") {
        this.model = config.models.replicate.llama['llama-2-13b-embeddings-version'];
    } else if (provider === "gemini") {
        this.model = "models/embedding-001";
    } else if (provider === "vllm") {
        this.model = null;
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = EmbedInput;
},{"../../config.json":1}],15:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class FineTuneInput {
  constructor({ training_file, model }) {
    this.training_file = training_file
    this.model = model
  }

  getOpenAIInput() {
    const params = {
      training_file: this.training_file,
      model: this.model,
    };
    return params;
  }
}

module.exports = FineTuneInput;

},{}],16:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class FunctionModelInput {
  /**
  * Function input constructor.
  * @param {string} name - The name of the function.
  * @param {string} [description] - The description of the function. (Optional)
  * @param {object} [parameters] - The parameters of the function. (Optional)
  *   @param {string} [parameters.type] - The data type of the parameters.
  *   @param {object} [parameters.properties] - The properties or fields of the parameters.
  *   @param {string[]} [parameters.required] - The required properties. (Optional)
  */
  constructor(name, description, parameters) {
    this.name = name;
    this.description = description || '';
    this.parameters = parameters || {type: 'object', properties: {}};
  }

  getFunctionModelInput() {
    return {
      name: this.name,
      description: this.description,
      parameters: this.parameters,
    };
  }
}

module.exports = FunctionModelInput ;

},{}],17:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class ImageModelInput {
  constructor({
    prompt,
    numberOfImages = 1,
    imageSize = null,
    responseFormat = null,
    width = null,
    height = null,
    diffusion_cfgScale = null,
    diffusion_style_preset = null,
    engine = null,
    model = null,
  }) {
    this.prompt = prompt;
    this.numberOfImages = numberOfImages;
    this.imageSize = imageSize;
    this.responseFormat = responseFormat;
    this.width = width;
    this.height = height;
    this.diffusion_cfgScale = diffusion_cfgScale;
    this.diffusion_style_preset = diffusion_style_preset;
    this.engine = engine;
    this.model = model;
    if (width != null && height != null && imageSize == null) {
        this.imageSize = width+'x'+height;
    } else if (width == null && height == null && imageSize != null) {
        const sizesParts = imageSize.split('x').map(Number);
        this.width = sizesParts[0];
        this.height = sizesParts[1];
    }
  }

  getOpenAIInputs() {

    const inputs = {
      prompt: this.prompt,
      ...this.numberOfImages && { n: this.numberOfImages },
      ...this.imageSize && { size: this.imageSize },
      ...this.responseFormat && { response_format: this.responseFormat },
      ...this.model && { model: this.model }
    };

    return inputs;
  }

  getStabilityInputs() {
    const inputs = {
      text_prompts: [{ text: this.prompt }],
      ...this.numberOfImages && { samples: this.numberOfImages },
      ...this.height && { height: this.height },
      ...this.width && { width: this.width },
      ...this.diffusion_cfgScale && { cfg_scale: this.diffusion_cfgScale },
      ...this.diffusion_style_preset && {style_preset: this.diffusion_style_preset},
      ...this.engine && { engine: this.engine }
    };

    return inputs;
  }

  setDefaultValues(provider) {
    if (provider === "openai") {
      this.numberOfImages = 1;
      this.imageSize = '1024x1024';
    } else if (provider === "stability") {
      this.numberOfImages = 1;
      this.height = 512;
      this.width = 512;
      this.engine = 'stable-diffusion-xl-beta-v2-2-2';
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = ImageModelInput;
},{}],18:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class LanguageModelInput {
  constructor({
    prompt,
    model = null,
    temperature = null,
    maxTokens = null,
    numberOfOutputs = 1,
  }) {
    this.prompt = prompt;
    this.model = model;
    this.temperature = temperature;
    this.maxTokens = maxTokens;
    this.numberOfOutputs = numberOfOutputs;
  }

  getCohereInputs() {
    const inputs = {
      prompt: this.prompt,
      ...this.model && { model: this.model },
      ...this.temperature && { temperature: this.temperature },
      ...this.maxTokens && { max_tokens: this.maxTokens },
      ...this.numberOfOutputs && { num_generations: this.numberOfOutputs },
    };

    return inputs;
  }

  getOpenAIInputs() {
    const inputs = {
      prompt: this.prompt,
      ...this.model && { model: this.model },
      ...this.temperature && { temperature: this.temperature },
      ...this.maxTokens && { max_tokens: this.maxTokens },
      ...this.numberOfOutputs && { n: this.numberOfOutputs },
    };

    return inputs;
  }

  setDefaultValues(provider, tokenCount) {

    this.setDefaultModels(provider)
    if (provider === "openai") {
      this.temperature = 0.7;
      this.maxTokens = tokenCount;
      this.numberOfOutputs = 1;
    } else if (provider === "cohere") {
      this.temperature = 0.75;
      this.maxTokens = tokenCount;
      this.numberOfOutputs = 1;
    } else {
      throw new Error("Invalid provider name");
    }
  }

  setDefaultModels(provider) {
    if (provider === "openai") {
      this.model = "gpt-3.5-turbo-instruct";
    } else if (provider === "cohere") {
      this.model = "command";
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = LanguageModelInput;
},{}],19:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class Text2SpeechInput {
  constructor({ text, language = "en-gb", gender = "FEMALE", voice, model = 'tts-1', stream = true }) {
    this.text = text;
    this.language = language.toLowerCase();
    this.gender = gender;
    this.voice = voice;
    this.model = model;
    this.stream = stream;
  }

  getGoogleInput() {
    const params = {
      text: this.text,
      languageCode: this.language,
    };

    if (this.language === "en-gb" || this.language === "en") {
      params.name = this.gender === "FEMALE" ? "en-GB-Standard-A" : "en-GB-Standard-B";
      params.ssmlGender = this.gender;
    } else if (this.language === "tr-tr" || this.language === "tr") {
      params.name = this.gender === "FEMALE" ? "tr-TR-Standard-A" : "tr-TR-Standard-B";
      params.ssmlGender = this.gender;
    } else if (this.language === "cmn-cn" || this.language === "cn") {
      params.name = this.gender === "FEMALE" ? "cmn-CN-Standard-A" : "cmn-CN-Standard-B";
      params.ssmlGender = this.gender;
    } else if (this.language === "de-de" || this.language === "de") {
      params.name = this.gender === "FEMALE" ? "de-DE-Standard-A" : "de-DE-Standard-B";
      params.ssmlGender = this.gender;
    } else if (this.language === "ar-xa" || this.language === "ar") {
      params.name = this.gender === "FEMALE" ? "ar-XA-Wavenet-A" : "ar-XA-Standard-B";
      params.ssmlGender = this.gender;
    } else {
      throw new Error("Unsupported language code: " + this.language);
    }

    return params;
  }

  getOpenAIInput() {
    const params = {
      input: this.text,
      voice: this.voice,
      model: this.model,
      stream: this.stream
    };
    return params;
  }
}

Text2SpeechInput.Gender = {
  FEMALE: "FEMALE",
  MALE: "MALE",
};

module.exports = Text2SpeechInput;

},{}],20:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],21:[function(require,module,exports){

},{}],22:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":20,"buffer":22,"ieee754":25}],23:[function(require,module,exports){
(function (global){(function (){
// Save global object in a variable
var __global__ =
(typeof globalThis !== 'undefined' && globalThis) ||
(typeof self !== 'undefined' && self) ||
(typeof global !== 'undefined' && global);
// Create an object that extends from __global__ without the fetch function
var __globalThis__ = (function () {
function F() {
this.fetch = false;
this.DOMException = __global__.DOMException
}
F.prototype = __global__; // Needed for feature detection on whatwg-fetch's code
return new F();
})();
// Wraps whatwg-fetch with a function scope to hijack the global object
// "globalThis" that's going to be patched
(function(globalThis) {

var irrelevant = (function (exports) {

  /* eslint-disable no-prototype-builtins */
  var g =
    (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof self !== 'undefined' && self) ||
    // eslint-disable-next-line no-undef
    (typeof global !== 'undefined' && global) ||
    {};

  var support = {
    searchParams: 'URLSearchParams' in g,
    iterable: 'Symbol' in g && 'iterator' in Symbol,
    blob:
      'FileReader' in g &&
      'Blob' in g &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in g,
    arrayBuffer: 'ArrayBuffer' in g
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
      throw new TypeError('Invalid character in header field name: "' + name + '"')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        if (header.length != 2) {
          throw new TypeError('Headers constructor: expected name/value pair to be length 2, found' + header.length)
        }
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body._noBody) return
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    var match = /charset=([A-Za-z0-9_-]+)/.exec(blob.type);
    var encoding = match ? match[1] : 'utf-8';
    reader.readAsText(blob, encoding);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      /*
        fetch-mock wraps the Response object in an ES6 Proxy to
        provide useful test harness features such as flush. However, on
        ES5 browsers without fetch or Proxy support pollyfills must be used;
        the proxy-pollyfill is unable to proxy an attribute unless it exists
        on the object before the Proxy is created. This change ensures
        Response.bodyUsed exists on the instance, while maintaining the
        semantic of setting Request.bodyUsed in the constructor before
        _initBody is called.
      */
      // eslint-disable-next-line no-self-assign
      this.bodyUsed = this.bodyUsed;
      this._bodyInit = body;
      if (!body) {
        this._noBody = true;
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };
    }

    this.arrayBuffer = function() {
      if (this._bodyArrayBuffer) {
        var isConsumed = consumed(this);
        if (isConsumed) {
          return isConsumed
        } else if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
          return Promise.resolve(
            this._bodyArrayBuffer.buffer.slice(
              this._bodyArrayBuffer.byteOffset,
              this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
            )
          )
        } else {
          return Promise.resolve(this._bodyArrayBuffer)
        }
      } else if (support.blob) {
        return this.blob().then(readBlobAsArrayBuffer)
      } else {
        throw new Error('could not read as ArrayBuffer')
      }
    };

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    if (!(this instanceof Request)) {
      throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
    }

    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal || (function () {
      if ('AbortController' in g) {
        var ctrl = new AbortController();
        return ctrl.signal;
      }
    }());
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);

    if (this.method === 'GET' || this.method === 'HEAD') {
      if (options.cache === 'no-store' || options.cache === 'no-cache') {
        // Search for a '_' parameter in the query string
        var reParamSearch = /([?&])_=[^&]*/;
        if (reParamSearch.test(this.url)) {
          // If it already exists then set the value with the current time
          this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime());
        } else {
          // Otherwise add a new '_' parameter to the end with the current time
          var reQueryString = /\?/;
          this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime();
        }
      }
    }
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
    // https://github.com/github/fetch/issues/748
    // https://github.com/zloirock/core-js/issues/751
    preProcessedHeaders
      .split('\r')
      .map(function(header) {
        return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header
      })
      .forEach(function(line) {
        var parts = line.split(':');
        var key = parts.shift().trim();
        if (key) {
          var value = parts.join(':').trim();
          try {
            headers.append(key, value);
          } catch (error) {
            console.warn('Response ' + error.message);
          }
        }
      });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!(this instanceof Response)) {
      throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
    }
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    if (this.status < 200 || this.status > 599) {
      throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].")
    }
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = options.statusText === undefined ? '' : '' + options.statusText;
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 200, statusText: ''});
    response.ok = false;
    response.status = 0;
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = g.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        // This check if specifically for when a user fetches a file locally from the file system
        // Only if the status is out of a normal range
        if (request.url.indexOf('file://') === 0 && (xhr.status < 200 || xhr.status > 599)) {
          options.status = 200;
        } else {
          options.status = xhr.status;
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        setTimeout(function() {
          resolve(new Response(body, options));
        }, 0);
      };

      xhr.onerror = function() {
        setTimeout(function() {
          reject(new TypeError('Network request failed'));
        }, 0);
      };

      xhr.ontimeout = function() {
        setTimeout(function() {
          reject(new TypeError('Network request timed out'));
        }, 0);
      };

      xhr.onabort = function() {
        setTimeout(function() {
          reject(new exports.DOMException('Aborted', 'AbortError'));
        }, 0);
      };

      function fixUrl(url) {
        try {
          return url === '' && g.location.href ? g.location.href : url
        } catch (e) {
          return url
        }
      }

      xhr.open(request.method, fixUrl(request.url), true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr) {
        if (support.blob) {
          xhr.responseType = 'blob';
        } else if (
          support.arrayBuffer
        ) {
          xhr.responseType = 'arraybuffer';
        }
      }

      if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers || (g.Headers && init.headers instanceof g.Headers))) {
        var names = [];
        Object.getOwnPropertyNames(init.headers).forEach(function(name) {
          names.push(normalizeName(name));
          xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
        });
        request.headers.forEach(function(value, name) {
          if (names.indexOf(name) === -1) {
            xhr.setRequestHeader(name, value);
          }
        });
      } else {
        request.headers.forEach(function(value, name) {
          xhr.setRequestHeader(name, value);
        });
      }

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!g.fetch) {
    g.fetch = fetch;
    g.Headers = Headers;
    g.Request = Request;
    g.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  return exports;

})({});
})(__globalThis__);
// This is a ponyfill, so...
__globalThis__.fetch.ponyfill = true;
delete __globalThis__.fetch.polyfill;
// Choose between native implementation (__global__) or custom implementation (__globalThis__)
var ctx = __global__.fetch ? __global__ : __globalThis__;
exports = ctx.fetch // To enable: import fetch from 'cross-fetch'
exports.default = ctx.fetch // For TypeScript consumers without esModuleInterop.
exports.fetch = ctx.fetch // To enable: import {fetch} from 'cross-fetch'
exports.Headers = ctx.Headers
exports.Request = ctx.Request
exports.Response = ctx.Response
module.exports = exports

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(require,module,exports){
/* eslint-env browser */
module.exports = typeof self == 'object' ? self.FormData : window.FormData;

},{}],25:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],26:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":27}],27:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],28:[function(require,module,exports){
(function (Buffer){(function (){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FileHelper = require('./FileHelper')

class AudioHelper {
  constructor() {
    this.isLog = true;
  }

  decode(audioContent) {
    const buff = Buffer.from(audioContent, 'base64');
    return buff;
  }

  saveAudio(decodedAudio, directory, fileName) {
    if (!fileName.endsWith('.mp3') && !fileName.endsWith('.wav')) {
      if (this.isLog) console.error('Unsupported audio format: send mp3 or wav');
      return false;
    }

    try {
      const filePath = `${directory}/${fileName}`;
      FileHelper.writeDataToFile(filePath, decodedAudio);
      return true;
    } catch (error) {
      if (this.isLog) console.error(error);
      return false;
    }
  }
}

module.exports = AudioHelper;

}).call(this)}).call(this,require("buffer").Buffer)
},{"./FileHelper":32,"buffer":22}],29:[function(require,module,exports){
/* Apache License
Copyright 2023 Github.com/Barqawiz/IntelliNode */
const { SemanticSearch } = require('../function/SemanticSearch');
const { SupportedEmbedModels } = require('../controller/RemoteEmbedModel');

class ChatContext {

    /**
     * Constructs a new instance of the Chat Context.
     *
     * @param {string} - The apiKey the model Key.
     * @param {string} - The provider the provider of the embedding model.
     */
    constructor(apiKey, provider = SupportedEmbedModels.OPENAI, customProxyHelper = null) {
        this.semanticSearch = new SemanticSearch(apiKey, provider, customProxyHelper);
    }

    /**
     * Provides n context messages from the history, combining last 2 messages with relevant ones from the history.
     *
     * @param {string} userMessage - The user message to filter context.
     * @param {string[]} historyMessages - The array of previous messages.
     * @param {number} n - The number of messages to return.
     * @returns {string[]} - The most relevant n messages.
     */
    async getStringContext(userMessage, historyMessages, n, modelName = null) {
        let returnMessages;
        if (n >= historyMessages.length) {
            returnMessages = historyMessages.slice(-n);
        } else {
            const relevantMessages = historyMessages.slice(0, historyMessages.length - 2);

            if (relevantMessages.length > 0) {
                let semanticSearchResult =
                    await this.semanticSearch.getTopMatches(userMessage, relevantMessages, n - 2, modelName);

                const topMatches = this.semanticSearch.filterTopMatches(semanticSearchResult, relevantMessages);

                returnMessages = topMatches.concat(historyMessages.slice(-2));
            } else {
                returnMessages = historyMessages.slice(-2);
            }

        }

        return returnMessages;
    }

    /**
     * Provides n relevant context messages from the history,
     * where each history message includes a role and content.
     *
     * @param {string} userMessage - The user message to filter context.
     * @param {Array} historyMessages - Array of dictionary including 'role' and 'content' fields.
     * @param {number} n - The number of context messages to return.
     * @returns {Array} - The most relevant n message objects with 'role' and 'content' fields.
     */
    async getRoleContext(userMessage, historyMessages, n, modelName = null) {
        const historyMessageContents = historyMessages.map(msg => msg.content);
        let returnMessages;

        if (n >= historyMessages.length) {
            returnMessages = historyMessages.slice(-n);
        } else {
            const relevantMessages = historyMessageContents.slice(0, -2);

            if (relevantMessages.length > 0) {
                let semanticSearchResult =
                    await this.semanticSearch.getTopMatches(userMessage, relevantMessages, n - 2, modelName);

                const semanticSearchTopMatches = semanticSearchResult.map(result => result.index);
                const topMatches = historyMessages.filter((value, index) => semanticSearchTopMatches.includes(index));
                returnMessages = topMatches.concat(historyMessages.slice(-2));
            } else {
                returnMessages = historyMessages.slice(-2);
            }
        }

        return returnMessages;
    }
}

module.exports = ChatContext;
},{"../controller/RemoteEmbedModel":2,"../function/SemanticSearch":9}],30:[function(require,module,exports){
(function (Buffer){(function (){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class ConnHelper {
  constructor() {
  }

  static convertMapToJson(params) {
    return JSON.stringify(params);
  }

  static getErrorMessage(error) {
    if (error.response && error.response.data) {
      return `Unexpected HTTP response: ${error.response.status} Error details: ${JSON.stringify(error.response.data)}`;
    }
    return error.message;
  }

  static readStream(stream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', err => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }

  static async lambdaSagemakerInputPass(internal_endpoint,
                                    event,
                                    client,
                                    InvokeEndpointCommand,
                                    log=false) {
    if (!event.body) {
        return {
            statusCode: 400,
            body: "Invalid input: " + JSON.stringify(event.body)
        };
    }
    let jsonString = "";
    if (typeof event.body === 'object') {
        jsonString = JSON.stringify(event.body);
    } else {
        jsonString = event.body;
    }

    const command = new InvokeEndpointCommand({
        EndpointName: internal_endpoint,
        ContentType: 'application/json',
        Body: jsonString,
        CustomAttributes: "accept_eula=true",
    });

    const response = await client.send(command);

    // Convert buffer to string
    const bodyString = Buffer.from(response.Body).toString('utf8');
    if (log) {
        console.log("Converted Response.Body: ", bodyString);
    }


    try {
        return {
            statusCode: 200,
            body: JSON.stringify(JSON.parse(bodyString))
        };

    } catch (error) {
        console.error("Parsing Error: ", error);
        throw error;
    }
  }
}

module.exports = ConnHelper;

}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":22}],31:[function(require,module,exports){
const fetch = require('cross-fetch');
const FormData = require('form-data');

class FetchClient {
  constructor({ baseURL = '', headers = {} } = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = headers;
  }

  /**
   * Send a POST request using cross-fetch.
   * 
   * @param {string} endpoint - URL path or full URL if starts with http.
   * @param {object|FormData} data - Data to send in the request body.
   * @param {object} extraConfig - Optional config (e.g. { responseType: 'arraybuffer' | 'stream' }).
   * @returns {Promise<any|ReadableStream|ArrayBuffer>} - JSON by default, or stream/arrayBuffer if specified.
   */
  async post(endpoint, data, extraConfig = {}) {
    const url = endpoint.startsWith('http')
      ? endpoint
      : this.baseURL + endpoint;

    // Decide how to handle the request body
    let body;
    if (data instanceof FormData) {
      // Use FormData directly (e.g., file uploads)
      body = data;
    } else if (data !== undefined) {
      // Assume JSON
      body = JSON.stringify(data);
    }

    // Merge default and extra headers
    const headers = {
      ...this.defaultHeaders,
      ...(extraConfig.headers || {})
    };

    // If using FormData in Node, merge the form's headers
    if (data instanceof FormData && typeof data.getHeaders === 'function') {
      Object.assign(headers, data.getHeaders());
    }

    const config = {
      method: 'POST',
      headers,
      body
    };

    // Make the request
    const response = await fetch(url, config);

    // Check for HTTP error
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    // Handle custom response types
    if (extraConfig.responseType === 'arraybuffer') {
      return await response.arrayBuffer();
    } else if (extraConfig.responseType === 'stream') {
      // Return raw body stream (ReadableStream in browser / Node 18+)
      return response.body;
    } else {
      // Default: parse JSON
      return await response.json();
    }
  }

  /**
   * Send a GET request using cross-fetch.
   * 
   * @param {string} endpoint - URL path or full URL if starts with http.
   * @param {object} extraConfig - Optional config (e.g. { responseType: 'arraybuffer' }).
   * @returns {Promise<any|ReadableStream|ArrayBuffer>} - JSON by default, or stream/arrayBuffer if specified.
   */
  async get(endpoint, extraConfig = {}) {
    const url = endpoint.startsWith('http')
      ? endpoint
      : this.baseURL + endpoint;

    const headers = {
      ...this.defaultHeaders,
      ...(extraConfig.headers || {})
    };

    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    if (extraConfig.responseType === 'arraybuffer') {
      return await response.arrayBuffer();
    } else if (extraConfig.responseType === 'stream') {
      return response.body;
    } else {
      return await response.json();
    }
  }
}

module.exports = FetchClient;

},{"cross-fetch":23,"form-data":24}],32:[function(require,module,exports){
const fs = require('fs');


class FileHelper { 

    static writeDataToFile(filePath, data) {
        fs.writeFileSync(filePath, data);
    }

    static readData(filePath, fileFormat) {
        return fs.readFileSync(filePath, fileFormat)
    }

    static createReadStream(filePath) {
        return fs.createReadStream(filePath)
    }
    
}

module.exports = FileHelper

},{"fs":21}],33:[function(require,module,exports){
const { RemoteEmbedModel, SupportedEmbedModels } = require('../controller/RemoteEmbedModel');
const LanguageModelInput = require('../model/input/LanguageModelInput');
const { Chatbot, SupportedChatModels } = require("../function/Chatbot");
const { RemoteLanguageModel, SupportedLangModels } = require("../controller/RemoteLanguageModel");
const { ChatGPTInput, LLamaReplicateInput, LLamaSageInput, GeminiInput, CohereInput, MistralInput, AnthropicInput } = require("../model/input/ChatModelInput");
const MatchHelpers = require('../utils/MatchHelpers');
const EmbedInput = require('../model/input/EmbedInput');
const { ModelEvaluation } = require('./ModelEvaluation');

class LLMEvaluation extends ModelEvaluation {

  constructor(embedKeyValue, embedProvider) {
    super()
    this.embedProvider = embedProvider;
    this.embedModel = new RemoteEmbedModel(embedKeyValue, embedProvider);
  }

  async generateEmbedding(inputString) {
    const embedInput = new EmbedInput({ texts: [inputString] });
    embedInput.setDefaultValues(this.embedProvider);
    const embeddingsResponse = await this.embedModel.getEmbeddings(embedInput);

    const embeddings = embeddingsResponse.map((item) => item.embedding);

    return embeddings[0];
  }

  async generateText(apiKey, inputString, provider, modelName, type,
    maxTokens = 500, custom_url = null) {

    if (type == 'chat' && Object.values(SupportedChatModels).includes(provider.toLowerCase())) {

      const customProxy = (custom_url != undefined && custom_url != null && custom_url != '') ? { url: custom_url } : null;

      const chatbot = new Chatbot(apiKey, provider, customProxy);

      // define the chat input
      let input;
      if (SupportedChatModels.REPLICATE == provider.toLowerCase()) {
        input = new LLamaReplicateInput("provide direct answer", { model: modelName, maxTokens: maxTokens });
      } else if (SupportedChatModels.SAGEMAKER == provider.toLowerCase()) {
        input = new LLamaSageInput("provide direct answer", { maxTokens: maxTokens });
      } else if (SupportedChatModels.GEMINI == provider.toLowerCase()) {
        input = new GeminiInput("provide direct answer", { maxTokens: maxTokens });
      } else if (SupportedChatModels.COHERE == provider.toLowerCase()) {
        input = new CohereInput("provide direct answer", { maxTokens: maxTokens });
      } else if (SupportedChatModels.MISTRAL == provider.toLowerCase()) {
        input = new MistralInput("provide direct answer", { model: modelName, maxTokens: maxTokens });
      } else if (SupportedChatModels.ANTHROPIC == provider.toLowerCase()) {
        input = new AnthropicInput("provide direct answer", { model: modelName, maxTokens: maxTokens });
      } else {
        input = new ChatGPTInput("provide direct answer", { model: modelName, maxTokens: maxTokens });
      }

      input.addUserMessage(inputString);
      const responses = await chatbot.chat(input);

      return responses[0].trim();
    } else if (type == 'completion' && Object.values(SupportedLangModels).includes(provider.toLowerCase())) {

      const languageModel = new RemoteLanguageModel(apiKey, provider);
      const langInput = new LanguageModelInput({ prompt: inputString, model: modelName, maxTokens: maxTokens });
      langInput.setDefaultValues(provider, maxTokens);

      const responses = await languageModel.generateText(langInput);
      return responses[0].trim();
    } else {
      throw new Error('Provider not supported');
    }
  }
  /**
  * This function compares models based on their performance in predicting a given input string.
  *
  * @param {string} inputString - The input text string that needs to be predicted by the models.
  *
  * @param {array} targetAnswers - An array of target answers that the prediction by the models will be compared against.
  * Each answer in the array is a string. For example: ['targetAnswer1', 'targetAnswer2', 'targetAnswer3']
  *
  * @param {array} providerSets - An array of providers (language models or chatbots) along with their relevant API keys.
  * Each provider in the array is an object.
  * For example: [
  *    { apiKey:'keyForOpenAI', provider: 'openai', type: 'completion' },
  *    { apiKey:'keyForReplicate', provider: 'replicate', type: 'chat' }
  *   ]
  *
  * @returns {object} results - An object containing comparison results. Each key in the object corresponds to a Provider.
  * The value for each key is an Array of objects. Each object in the array contains the 'prediction',
  * 'score_cosine_similarity', and 'score_euclidean_distance'.
  *
  * If invalid 'apiKey' or 'provider' is supplied, it may result in runtime exception or error.
  */
  async compareModels(inputString, targetAnswers, providerSets, isJson = false) {
    let results = {};
    let targetEmbeddings = [];

    // Initiate Embedding for targets
    for (let target of targetAnswers) {
      const embedding = await this.generateEmbedding(target);
      targetEmbeddings.push(embedding);
    }

    for (let provider of providerSets) {
      console.log(`- start ${provider.model} evaluation`)

      let predictions = [];
      try {
        let prediction = await this.generateText(provider.apiKey, inputString, provider.provider,
          provider.model, provider.type,
          provider.maxTokens, provider.url);
        const predictionEmbedding = await this.generateEmbedding(prediction);

        let cosineSum = 0, euclideanSum = 0, manhattanSum = 0;
        for (let targetEmbedding of targetEmbeddings) {
          cosineSum += MatchHelpers.cosineSimilarity(predictionEmbedding, targetEmbedding);
          euclideanSum += MatchHelpers.euclideanDistance(predictionEmbedding, targetEmbedding);
          manhattanSum += MatchHelpers.manhattanDistance(predictionEmbedding, targetEmbedding);
        }

        const avgCosine = cosineSum / targetEmbeddings.length;
        const avgEuclidean = euclideanSum / targetEmbeddings.length;
        const avgManhattan = manhattanSum / targetEmbeddings.length;

        predictions.push({
          prediction: prediction,
          score_cosine_similarity: avgCosine,
          score_euclidean_distance: avgEuclidean,
          score_manhattan_distance: avgManhattan,
          stop_reason: "complete"
        });
      } catch (error) {
        console.error(error);
        predictions.push({
          stop_reason: "error"
        });
      }

      results[`${provider.provider}/${provider.model}`] = predictions;
    }

    results['lookup'] = {
      'cosine_similarity': 'a value closer to 1 indicates a higher degree of similarity between two vectors.',
      'euclidean_distance': 'the lower the value, the closer the two points.',
      'manhattan_distance': 'the lower the value, the closer the two vectors.'
    }

    if (isJson) {
      results = JSON.stringify(results);
    }

    return results;
  }
}

module.exports = {
  LLMEvaluation
};
},{"../controller/RemoteEmbedModel":2,"../controller/RemoteLanguageModel":5,"../function/Chatbot":7,"../model/input/ChatModelInput":13,"../model/input/EmbedInput":14,"../model/input/LanguageModelInput":18,"../utils/MatchHelpers":34,"./ModelEvaluation":35}],34:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class MatchHelpers {
  
  static cosineSimilarity(a, b) {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimensions');
    }
    const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));

    return dotProduct / (magnitudeA * magnitudeB);
  }

  static euclideanDistance(a, b) {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimensions');
    }

    const distance = Math.sqrt(
      a.reduce((sum, ai, i) => sum + (ai - b[i]) ** 2, 0)
    );

    return distance;
  }

  static manhattanDistance(a, b) {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimensions');
    }

    const distance = a.reduce((sum, ai, i) => sum + Math.abs(ai - b[i]), 0);

    return distance;
  }

}

module.exports = MatchHelpers;
},{}],35:[function(require,module,exports){
class ModelEvaluation {

  constructor() {}
}

module.exports = {
  ModelEvaluation
};
},{}],36:[function(require,module,exports){
const FileHelper = require('./FileHelper')
const { Chatbot, SupportedChatModels } = require("../function/Chatbot");
const { ChatGPTInput, ChatGPTMessage } = require("../model/input/ChatModelInput");
const SystemHelper = require("../utils/SystemHelper");

class Prompt {
  constructor(template) {
    this.template = template;
  }

  getInput() {
    return this.template;
  }

  format(data) {
    const regex = /\$\{([^}]+)\}/g;
    let result = this.template;
    let match;

    while ((match = regex.exec(this.template)) !== null) {
      const key = match[1];
      const value = data.hasOwnProperty(key) ? data[key] : '';

      result = result.replace(match[0], value);
    }

    return result;
  }

  static fromText(template) {
    return new Prompt(template);
  }

  static fromFile(filePath) {
    const template = FileHelper.readData(filePath, 'utf-8');
    return new Prompt(template);
  }

  static async fromChatGPT(promptTopic, apiKey, customProxyHelper=null, model='gpt-4') {

    const chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);

    const promptExample = new SystemHelper().loadPrompt("prompt_example");

    const input = new ChatGPTInput("generate a prompt text, following prompt engineering best practices", 
                              { maxTokens: 800, model: model, temperature: 0.7 });
    input.addUserMessage(promptExample);
    input.addUserMessage(`Create a prompt: ${promptTopic}`);
    
    const responses = await chatbot.chat(input);

    return new Prompt(responses[0].trim());
  }
}

module.exports = Prompt;
},{"../function/Chatbot":7,"../model/input/ChatModelInput":13,"../utils/SystemHelper":39,"./FileHelper":32}],37:[function(require,module,exports){
const config = require('../config.json');



class ProxyHelper {

  constructor() {
    this.setOriginOpenai();
  }

  static getInstance() {
    if (!ProxyHelper.instance) {
      ProxyHelper.instance = new ProxyHelper();
    }
    return ProxyHelper.instance;
  }

  getOpenaiURL() {
    return this._openaiURL;
  }

  getOpenaiCompletion(model = '') {
    if (this._openai_type == 'azure') {
      return this._openaiCompletion
        .replace('{deployment-id}', model)
        .replace('{api-version}', ProxyHelper.API_VERSION);
    } else {
      return this._openaiCompletion;
    }
  }

  getOpenaiChat(model = '') {
    if (this._openai_type == 'azure') {
      return this._openaiChatGPT
        .replace('{deployment-id}', model)
        .replace('{api-version}', ProxyHelper.API_VERSION);
    } else {
      return this._openaiChatGPT;
    }
  }

  getOpenaiImage() {
    if (this._openai_type == 'azure') {
      return this._openaiImage.replace(
        '{api-version}',
        '2023-06-01-preview'
      );
    } else {
      return this._openaiImage;
    }
  }

  getOpenaiAudioTranscriptions(model = '') {
    if (this._openai_type == 'azure') {
      return this._openaiAudioTranscriptions
        .replace('{deployment-id}', model)
        .replace('{api-version}', ProxyHelper.API_VERSION);
    } else {
      return this._openaiAudioTranscriptions;
    }
  }

  getOpenaiAudioSpeech(model = '') {
    if (this._openai_type == 'azure') {
      return this._openaiAudioToSpeech
        .replace('{deployment-id}', model)
        .replace('{api-version}', ProxyHelper.API_VERSION);
    } else {
      return this._openaiAudioToSpeech;
    }
  }

  getOpenaiFiles() {
    if (this._openai_type == 'azure') {
      return this._openaiFiles.replace(
        '{api-version}',
        ProxyHelper.API_VERSION
      );
    } else {
      return this._openaiFiles;
    }
  }

  getOpenaiFineTuningJob() {
    if (this._openai_type == 'azure') {
      return this._openaiFineTuningJob.replace(
        '{api-version}',
        '2023-10-01-preview'
      );
    } else {
      return this._openaiFineTuningJob;
    }
  }

  getOpenaiEmbed(model = '') {
    if (this._openai_type == 'azure') {
      return this._openaiEmbed
        .replace('{deployment-id}', model)
        .replace('{api-version}', ProxyHelper.API_VERSION);
    } else {
      return this._openaiEmbed;
    }
  }

  getOpenaiType() {
    return this._openai_type;
  }

  getOpenaiResource() {
    return this._resourceName;
  }

  setOpenaiURL(url) {
    this._openaiURL = url;
  }

  getOpenaiOrg() {
    return this._openaiOrg ? this._openaiOrg : null;
  }

  setOpenaiOrg(organization) {
    this._openaiOrg = organization;
  }

  setOpenaiProxyValues(proxySettings) {
    this._openaiURL = proxySettings.url || config.url.openai.base;
    this._openaiCompletion =
      proxySettings.completions || config.url.openai.completions;
    this._openaiChatGPT =
      proxySettings.chatgpt || config.url.openai.chatgpt;
    this._openaiImage =
      proxySettings.imagegenerate || config.url.openai.imagegenerate;
    this._openaiEmbed =
      proxySettings.embeddings || config.url.openai.embeddings;
    this._openaiOrg =
      proxySettings.organization || config.url.openai.organization;
    this._openaiAudioTranscriptions =
      proxySettings.audiotranscriptions ||
      config.url.openai.audiotranscriptions;
    this._openaiAudioToSpeech =
      proxySettings.audiospeech ||
      config.url.openai.audiospeech;
    this._openaiFineTuningJob =
      proxySettings.finetuning ||
      config.url.openai.finetuning;
    this._openaiFiles =
      proxySettings.files ||
      config.url.openai.files;
    this._openai_type = 'openai';
    this._resourceName = '';
  }

  setAzureOpenai(resourceName) {
    if (!resourceName) {
      throw new Error('Set your azure resource name');
    }

    this._openaiURL = config.url.azure_openai.base.replace(
      '{resource-name}',
      resourceName
    );
    this._openaiCompletion = config.url.azure_openai.completions;
    this._openaiChatGPT = config.url.azure_openai.chatgpt;
    this._openaiImage = config.url.azure_openai.imagegenerate;
    this._openaiEmbed = config.url.azure_openai.embeddings;
    this._openaiAudioTranscriptions = config.url.azure_openai.audiotranscriptions;
    this._openaiAudioToSpeech = config.url.azure_openai.audiospeech;
    this._openaiFineTuningJob = config.url.azure_openai.finetuning;
    this._openaiFiles = config.url.azure_openai.files;
    this._openai_type = 'azure';
    this._resourceName = resourceName;
  }

  setOriginOpenai() {
    this._openaiURL = config.url.openai.base;
    this._openaiCompletion = config.url.openai.completions;
    this._openaiChatGPT = config.url.openai.chatgpt;
    this._openaiImage = config.url.openai.imagegenerate;
    this._openaiEmbed = config.url.openai.embeddings;
    this._openaiOrg = config.url.openai.organization;
    this._openaiAudioTranscriptions = config.url.openai.audiotranscriptions;
    this._openaiFineTuningJob = config.url.openai.finetuning;
    this._openaiFiles = config.url.openai.files;
    this._openaiAudioToSpeech = config.url.openai.audiospeech;
    this._openai_type = 'openai';
    this._resourceName = '';
  }
}

ProxyHelper.API_VERSION = '2023-12-01-preview'

module.exports = ProxyHelper;

},{"../config.json":1}],38:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class GPTStreamParser {
  constructor(isLog = false) {
    this.buffer = '';
    this.isLog = isLog;
  }

  async *feed(data) {
    this.buffer += data;

    // check if the buffer contains events
    while (this.buffer.includes('\n\n')) {
      // find the end of the first complete event
      const eventEndIndex = this.buffer.indexOf('\n\n');
      let rawData = this.buffer.slice(0, eventEndIndex).trim();
      
      // remove the processed event
      this.buffer = this.buffer.slice(eventEndIndex + 2);

      // look for the stop signal
      if (rawData === "data: [DONE]") {
        if (this.isLog) {
          console.log("Parsing finished.");
        }
        // stop processing if the stream is done
        return; 
      }

      // skip lines without "data: "
      if (!rawData.startsWith("data: ")) {
        continue;
      }
      
      try {
        // parse the JSON
        const jsonData = JSON.parse(rawData.substring(6));
        const contentText = jsonData.choices?.[0]?.delta?.content;
        if (contentText) {
          yield contentText;
        }
      } catch (error) {
        console.error("Error parsing JSON in stream:", error);
      }
    }
  }
}
class CohereStreamParser {
    constructor(isLog = false) {
      this.buffer = '';
      this.isLog = false;
    }
  
    async *feed(data) {
      this.buffer += data;
  
      if (this.buffer.includes('\n')) {
        const eventEndIndex = this.buffer.indexOf('\n');
        const rawData = this.buffer.slice(0, eventEndIndex + 1).trim();
  
        // Convert the rawData into JSON format
        const jsonData = JSON.parse(rawData);
        const contentText = jsonData.text;
        if (contentText) {
          yield contentText;
        }
        this.buffer = this.buffer.slice(eventEndIndex + 1);
      }
    }
  }

module.exports = {GPTStreamParser, CohereStreamParser};
},{}],39:[function(require,module,exports){
(function (__dirname){(function (){
const FileHelper = require('./FileHelper')
const path = require("path");

class SystemHelper {
  constructor() {
    this.systemsPath = path.join(__dirname, "..", "resource", "templates");
  }

  getPromptPath(fileType) {
    let promptPath = '';
    if (fileType === "sentiment") {
      promptPath = path.join(this.systemsPath, "sentiment_prompt.in");
    } else if (fileType === "summary") {
      promptPath = path.join(this.systemsPath, "summary_prompt.in");
    } else if (fileType === "html_page") {
      promptPath = path.join(this.systemsPath, "html_page_prompt.in");
    } else if (fileType === "graph_dashboard") {
      promptPath = path.join(this.systemsPath, "graph_dashboard_prompt.in");
    } else if (fileType === "instruct_update") {
      promptPath = path.join(this.systemsPath, "instruct_update.in");
    } else if (fileType === "prompt_example") {
      promptPath = path.join(this.systemsPath, "prompt_example.in");
    } else if (fileType === "augmented_chatbot") {
      promptPath = path.join(this.systemsPath, "augmented_chatbot.in");
    } else {
      throw new Error(`File type '${file_type}' not supported`);
    }

    return promptPath;
  }

  loadPrompt(fileType) {
    let promptPath = this.getPromptPath(fileType)
    const promptTemplate = FileHelper.readData(promptPath, 'utf-8');

    return promptTemplate;

  }

  loadStaticPrompt(fileType) { 

    if (fileType === "augmented_chatbot") { 
      return "Using the provided context, craft a  cohesive response that directly addresses the user's query. " +
      "If the context lacks relevance or is absent, focus on generating a knowledgeable and accurate answer based on the user's question alone. " +
      "Aim for clarity and conciseness in your reply.\n" +
      "Context:\n" +
      "${semantic_search}" +
      "\n---------------------------------\n" +
      "User's Question:\n" +
      "${user_query}";
    }

  }
}

module.exports = SystemHelper;
}).call(this)}).call(this,"/utils")
},{"./FileHelper":32,"path":26}],40:[function(require,module,exports){
const FetchClient = require('../utils/FetchClient');

class AWSEndpointWrapper {
  constructor(apiUrl, apiKey = null) {
    this.API_BASE_URL = apiUrl;

    let headers = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Create our FetchClient with the base url + default headers
    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: headers,
    });
  }

  async predict(inputData) {
    try {
      return await this.client.post('', inputData);
    } catch (error) {
      throw error; // You can wrap this in a custom error message if you wish
    }
  }
}

module.exports = AWSEndpointWrapper;

},{"../utils/FetchClient":31}],41:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class AnthropicWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.anthropic.base;
    this.API_VERSION = config.url.anthropic.version;

    // Create our FetchClient instance
    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': this.API_VERSION,
      },
    });
  }

  async generateText(params) {
    const endpoint = config.url.anthropic.messages;

    try {
      // Use the client’s post method
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = AnthropicWrapper;

},{"../config.json":1,"../utils/ConnHelper":30,"../utils/FetchClient":31}],42:[function(require,module,exports){
/*
Apache License
Copyright 2023 Github.com/Barqawiz/IntelliNode*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class CohereAIWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.cohere.base;
    this.COHERE_VERSION = config.url.cohere.version;
    this.API_KEY = apiKey;

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.API_KEY}`,
        'Cohere-Version': this.COHERE_VERSION
      }
    });
  }

  async generateText(params) {
    const endpoint = config.url.cohere.completions;
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateChatText(params) {
    const endpoint = '/chat';
    try {
      // If stream is true, set responseType='stream'
      const extraConfig = params.stream ? { responseType: 'stream' } : {};
      return await this.client.post(endpoint, params, extraConfig);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getEmbeddings(params) {
    const endpoint = config.url.cohere.embed;
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = CohereAIWrapper;


},{"../config.json":1,"../utils/ConnHelper":30,"../utils/FetchClient":31}],43:[function(require,module,exports){
const config = require('../config.json');
const { readFileSync } = require('fs');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class GeminiAIWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.gemini.base;
    this.API_KEY = apiKey;

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async generateContent(params, vision = false) {
    const endpoint = vision
      ? config.url.gemini.visionEndpoint
      : config.url.gemini.contentEndpoint;

    try {
      return await this.client.post(endpoint, params, {
        // If needed, you can specify { responseType: 'stream' } or 'arraybuffer'
      });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async imageToText(userInput, filePath, extension) {
    const imageData = readFileSync(filePath, { encoding: 'base64' });
    const params = {
      contents: [
        {
          parts: [
            { text: `${userInput}` },
            {
              inline_data: {
                mime_type: `image/${extension}`,
                data: imageData
              }
            }
          ]
        }
      ]
    };
    return this.generateContent(params, true);
  }

  async getEmbeddings(params) {
    const endpoint = config.url.gemini.embeddingEndpoint;
    try {
      const response = await this.client.post(endpoint, params);
      return response.embedding;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getBatchEmbeddings(params) {
    const endpoint = config.url.gemini.batchEmbeddingEndpoint;
    try {
      const response = await this.client.post(endpoint, params);
      return response.embeddings;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = GeminiAIWrapper;

},{"../config.json":1,"../utils/ConnHelper":30,"../utils/FetchClient":31,"fs":21}],44:[function(require,module,exports){
/*
Apache License
*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class GoogleAIWrapper {
  constructor(apiKey) {
    this.API_SPEECH_URL = config.url.google.base.replace(
      '{1}',
      config.url.google.speech.prefix
    );
    this.API_KEY = apiKey;

    this.client = new FetchClient({
      baseURL: this.API_SPEECH_URL,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Goog-Api-Key': this.API_KEY
      }
    });
  }

  async generateSpeech(params) {
    const endpoint =
      config.url.google.speech.prefix +
      config.url.google.speech.synthesize.postfix;
    const url = this.API_SPEECH_URL + config.url.google.speech.synthesize.postfix;

    const json = this.getSynthesizeInput(params);
    try {
      return await this.client.post(url, JSON.parse(json));
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  getSynthesizeInput(params) {
    const text = params.text;
    const languageCode = params.languageCode;
    const name = params.name;
    const ssmlGender = params.ssmlGender;

    const modelInput = {
      input: {
        text: text
      },
      voice: {
        languageCode: languageCode,
        name: name,
        ssmlGender: ssmlGender
      },
      audioConfig: {
        audioEncoding: 'MP3'
      }
    };

    return JSON.stringify(modelInput);
  }
}

module.exports = GoogleAIWrapper;

},{"../config.json":1,"../utils/ConnHelper":30,"../utils/FetchClient":31}],45:[function(require,module,exports){
(function (Buffer){(function (){
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class HuggingWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.huggingface.base;
    this.API_KEY = apiKey;

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.API_KEY}`
      }
    });
  }

  async generateText(modelId, data) {
    const endpoint = `/${modelId}`;
    try {
      return await this.client.post(endpoint, data);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateImage(modelId, data) {
    const endpoint = `/${modelId}`;
    try {
      // We need arraybuffer to get raw image data
      return await this.client.post(endpoint, data, { responseType: 'arraybuffer' });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async processImage(modelId, data) {
    const endpoint = `/${modelId}`;
    try {
      const arrayBuf = await this.client.post(endpoint, data, { responseType: 'arraybuffer' });
      return JSON.parse(Buffer.from(arrayBuf).toString());
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = HuggingWrapper;

}).call(this)}).call(this,require("buffer").Buffer)
},{"../config.json":1,"../utils/ConnHelper":30,"../utils/FetchClient":31,"buffer":22}],46:[function(require,module,exports){
/*Apache License
Copyright 2023 Github.com/Barqawiz/IntelliNode*/
const FormData = require('form-data');
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class IntellicloudWrapper {
  constructor(apiKey, apiBase = null) {
    this.ONE_KEY = apiKey;
    if (apiBase) {
      this.API_BASE_URL = apiBase;
    } else {
      this.API_BASE_URL = config.url.intellicloud.base;
    }

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL
      // We'll add headers at runtime if needed
    });
  }

  async semanticSearch(queryText, k = 3, filters = {}) {
    if (!k || k === undefined) {
      k = 3;
    }
    const endpoint = config.url.intellicloud.semantic_search;

    const form = new FormData();
    form.append('one_key', this.ONE_KEY);
    form.append('query_text', queryText);
    form.append('k', k);

    if (filters && filters.document_name) {
      form.append('document_name', filters.document_name);
    }

    try {
      // Pass the FormData directly
      const response = await this.client.post(endpoint, form);
      return response.data; // The API returns { data: ... }
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = IntellicloudWrapper;

},{"../config.json":1,"../utils/ConnHelper":30,"../utils/FetchClient":31,"form-data":24}],47:[function(require,module,exports){
/*Apache License
Copyright 2023 Github.com/Barqawiz/IntelliNode*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class MistralAIWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.mistral.base;

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    });
  }

  async generateText(params) {
    const endpoint = config.url.mistral.completions;
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getEmbeddings(params) {
    const endpoint = config.url.mistral.embed;
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = MistralAIWrapper;

},{"../config.json":1,"../utils/ConnHelper":30,"../utils/FetchClient":31}],48:[function(require,module,exports){
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class NvidiaWrapper {
  /**
   * @param {string} apiKey - API key (if required for cloud usage)
   * @param {object} [options] - Optional settings.
   *        options.baseUrl: Override the default base URL.
   */
  constructor(apiKey, options = {}) {
    // use the provided baseUrl (e.g. local NIM) or the default cloud URL
    this.API_BASE_URL = options.baseUrl || config.nvidia.base;
    this.ENDPOINT_CHAT = config.nvidia.chat;
    this.VERSION = config.nvidia.version;

    // build headers
    let headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }
    
    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: headers
    });
  }

  async generateText(params) {
    if (params.stream === undefined) {
      params.stream = false;
    }
    try {
      const extraConfig = params.stream ? { responseType: 'stream' } : {};
      return await this.client.post(this.ENDPOINT_CHAT, params, extraConfig);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateTextStream(params) {
    params.stream = true;
    try {
      return await this.client.post(this.ENDPOINT_CHAT, params, {
        responseType: 'stream'
      });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  /**
   * Generates embeddings using NVIDIA's embedding endpoint.
   * Expects the user to pass a `model` field inside params so that the endpoint
   * is constructed as:
   *   {config.nvidia.embedding}/{model}/embeddings
   *
   * @param {object} params - Must include `model` and other required fields.
   */
  async generateRetrieval(params) {
    if (!params.model) {
      throw new Error("Missing 'model' parameter for embeddings");
    }
    // use the embedding base endpoint from config and append the user-specified model name.
    const baseEmbedding = config.nvidia.retrieval;
    // model name example snowflake/arctic-embed
    const embeddingEndpoint = `${baseEmbedding}/${params.model}/embeddings`;
    try {
      return await this.client.post(embeddingEndpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = NvidiaWrapper;

},{"../config.json":1,"../utils/ConnHelper":30,"../utils/FetchClient":31}],49:[function(require,module,exports){
/*Apache License
Copyright 2023 Github.com/Barqawiz/IntelliNode*/
const ProxyHelper = require('../utils/ProxyHelper');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class OpenAIWrapper {
  constructor(apiKey, customProxyHelper = null) {
    this.proxyHelper = customProxyHelper || ProxyHelper.getInstance();

    if (this.proxyHelper.getOpenaiType() === 'azure') {
      if (this.proxyHelper.getOpenaiResource() === '') {
        throw new Error('Set your azure resource name');
      }
      this.API_BASE_URL = this.proxyHelper.getOpenaiURL();
      this.API_KEY = apiKey;
      this.client = new FetchClient({
        baseURL: this.API_BASE_URL,
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.API_KEY
        }
      });
    } else {
      this.API_BASE_URL = this.proxyHelper.getOpenaiURL();
      this.API_KEY = apiKey;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.API_KEY}`
      };
      // Check if Organization ID exists
      const orgId = this.proxyHelper.getOpenaiOrg();
      if (orgId) {
        headers['OpenAI-Organization'] = orgId;
      }
      this.client = new FetchClient({
        baseURL: this.API_BASE_URL,
        headers
      });
    }
  }

  async generateText(params) {
    /*deprecated*/
    const endpoint = this.proxyHelper.getOpenaiCompletion(params.model);
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateChatText(params, functions = null, function_call = null) {
    const endpoint = this.proxyHelper.getOpenaiChat(params.model);
    try {
      const payload = { ...params };
      if (functions) payload.functions = functions;
      if (function_call) payload.function_call = function_call;

      const extraConfig = params.stream ? { responseType: 'stream' } : {};
      return await this.client.post(endpoint, payload, extraConfig);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateImages(params) {
    const endpoint = this.proxyHelper.getOpenaiImage();
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async uploadFile(params) {
    const endpoint = this.proxyHelper.getOpenaiFiles();
    try {
      // If params is FormData, fetch client will handle it
      return await this.client.post(endpoint, params, {
        headers: params.getHeaders ? params.getHeaders() : {}
      });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async storeFineTuningData(params) {
    const endpoint = this.proxyHelper.getOpenaiFineTuningJob();
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async listFineTuningData(params) {
    const endpoint = this.proxyHelper.getOpenaiFineTuningJob();
    try {
      // .get is an example usage; if you pass params as query, you might need
      // querystring appending or some logic. If you used axios.get with config,
      // you can do a .get with extra headers in the fetch client
      // or just do .post if that was your actual usage.
      return await this.client.get(endpoint, {
        headers: {
          // any custom headers
        }
      });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getEmbeddings(params) {
    const endpoint = this.proxyHelper.getOpenaiEmbed(params.model);
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async speechToText(params, headers) {
    const endpoint = this.proxyHelper.getOpenaiAudioTranscriptions();
    try {
      return await this.client.post(endpoint, params, { headers });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async textToSpeech(params, headers) {
    const endpoint = this.proxyHelper.getOpenaiAudioSpeech();
    try {
      const extraConfig = { headers };
      if (params.stream) {
        extraConfig.responseType = 'stream';
      }
      return await this.client.post(endpoint, params, extraConfig);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async imageToText(params, headers) {
    const endpoint = this.proxyHelper.getOpenaiChat();
    try {
      return await this.client.post(endpoint, params, { headers });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateChatAudio(params) {
    
    const endpoint = this.proxyHelper.getOpenaiChat(params.model);
  
    try {
      // "params" should include { model, modalities, audio, messages, etc. }
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = OpenAIWrapper;

},{"../utils/ConnHelper":30,"../utils/FetchClient":31,"../utils/ProxyHelper":37}],50:[function(require,module,exports){
/*Apache License
Copyright 2023 Github.com/Barqawiz/IntelliNode*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class ReplicateWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.replicate.base;
    this.API_KEY = apiKey;

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${this.API_KEY}`
      }
    });
  }

  async predict(modelTag, inputData) {
    const endpoint = config.url.replicate.predictions;
    try {
      return await this.client.post(endpoint, inputData);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getPredictionStatus(predictionId) {
    const endpoint = `/v1/predictions/${predictionId}`;
    try {
      // GET request
      return await this.client.get(endpoint);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = ReplicateWrapper;

},{"../config.json":1,"../utils/ConnHelper":30,"../utils/FetchClient":31}],51:[function(require,module,exports){
// wrappers/StabilityAIWrapper.js

const FormData = require('form-data');
const fs = require('fs');
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class StabilityAIWrapper {
    
    constructor(apiKey) {
        // Base URL from config.
        this.API_BASE_URL = config.url.stability.base;
        this.API_KEY = apiKey;

        this.client = new FetchClient({
            baseURL: this.API_BASE_URL,
            headers: {
                Authorization: `Bearer ${this.API_KEY}`
            }
        });

        this.V2_BETA_MODELS = ["core", "ultra", "sd3", "sd3-large", "sd3-large-turbo", "sd3-medium"];
    }

    async generateImageDispatcher(inputs) {
        // If user sets inputs.model to something in V2_BETA_MODELS, we do v2.
        const modelName = inputs.model || "";
        const isV2Beta = this.V2_BETA_MODELS.includes(modelName);
    
        if (isV2Beta) {
          
          const v2Resp = await this.generateStableImageV2Beta(inputs);
          // 2) Convert v2 response => same shape as v1 => { artifacts: [ { base64: ... }, ... ] }
          return {
            artifacts: [
              {
                base64: v2Resp.image // v2 returns { image, seed, finish_reason }
              }
            ]
          };
        } else {
          // old v1 approach
          return await this.generateTextToImage(inputs);
        }
      }

    /**
     * ===============
     *  V1 approach
     * ===============
     * 
     * Expects JSON in the request body:
     *   Content-Type: application/json
     *
     * Endpoint example:
     *   /v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image
     */
    async generateTextToImage(params, engine = 'stable-diffusion-xl-1024-v1-0') {
        const endpoint = config.url.stability.text_to_image.replace('{1}', engine);
        try {
            // pass extraConfig with your needed "Content-Type"
            return await this.client.post(endpoint, params, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            throw new Error(connHelper.getErrorMessage(error));
        }
    }

    async upscaleImage(imagePath, width, height, engine = 'esrgan-v1-x2plus') {
        const endpoint = config.url.stability.upscale.replace('{1}', engine);

        const formData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));
        formData.append('width', width);
        formData.append('height', height);

        try {
            // We want an image (arraybuffer)
            return await this.client.post(endpoint, formData, {
                responseType: 'arraybuffer'
            });
        } catch (error) {
            throw new Error(connHelper.getErrorMessage(error));
        }
    }

    async generateImageToImage(params, engine = 'stable-diffusion-xl-1024-v1-0') {
        const endpoint = config.url.stability.image_to_image.replace('{1}', engine);

        const formData = new FormData();
        // text_prompts is an array, so let's loop
        if (params.text_prompts) {
            params.text_prompts.forEach((prompt, index) => {
                formData.append(`text_prompts[${index}][text]`, prompt.text);
                formData.append(`text_prompts[${index}][weight]`, prompt.weight);
            });
        }

        // Add init_image from local file
        formData.append('init_image', fs.readFileSync(params.imagePath), {
            filename: params.imagePath.split('/').pop(),
            contentType: 'image/png'
        });

        // Add the other params
        for (const key of Object.keys(params)) {
            if (!['text_prompts', 'imagePath'].includes(key)) {
                formData.append(key, params[key]);
            }
        }

        try {
            return await this.client.post(endpoint, formData);
        } catch (error) {
            throw new Error(connHelper.getErrorMessage(error));
        }
    }

    /**
     * ===============
     *  V2beta approach
     * ===============
     *
     * Example: /v2beta/stable-image/generate/ultra
     */
    async generateStableImageV2Beta({
        model = 'ultra', // or 'core', 'sd3', etc.
        prompt,
        output_format = 'png', // or 'webp', 'jpeg'
        width,
        height,
        accept = 'application/json' // or 'image/*'
    }) {
        // E.g. /v2beta/stable-image/generate/ultra
        const endpoint = `/v2beta/stable-image/generate/${model}`;

        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('output_format', output_format);
        if (width) formData.append('width', width);
        if (height) formData.append('height', height);

        try {
            // If accept="application/json", you'll get { image, seed, finish_reason }
            // If accept="image/*" plus extraConfig.responseType='arraybuffer', you'll get raw bytes
            const resp = await this.client.post(endpoint, formData, {
                headers: {
                    Accept: accept
                },
            });
            return resp;
        } catch (error) {
            throw new Error(connHelper.getErrorMessage(error));
        }
    }
    async inpaintImage({
        imagePath,
        maskPath,
        prompt,
        output_format = "png",
        accept = "application/json"
    }) {
        // v2beta: /v2beta/stable-image/edit/inpaint
        const endpoint = config.url.stability.inpaint;

        const formData = new FormData();
        formData.append("image", fs.createReadStream(imagePath));
        formData.append("mask", fs.createReadStream(maskPath));
        formData.append("prompt", prompt);
        formData.append("output_format", output_format);

        try {
            const response = await this.client.post(endpoint, formData, {
                headers: {
                    Accept: accept
                }
            });
            return response; // if accept=application/json => { image, seed, finish_reason }
        } catch (error) {
            throw new Error(connHelper.getErrorMessage(error));
        }
    }

    async outpaintImage({
        imagePath,
        prompt,
        output_format = "png",
        left = 0,
        right = 0,
        top = 0,
        bottom = 0,
        accept = "application/json"
    }) {
        // v2beta: /v2beta/stable-image/edit/outpaint
        const endpoint = config.url.stability.outpaint;

        const formData = new FormData();
        formData.append("image", fs.createReadStream(imagePath));
        if (left) formData.append("left", left);
        if (right) formData.append("right", right);
        if (top) formData.append("top", top);
        if (bottom) formData.append("bottom", bottom);
        formData.append("prompt", prompt);
        formData.append("output_format", output_format);

        try {
            const response = await this.client.post(endpoint, formData, {
                headers: {
                    Accept: accept
                }
            });
            return response;
        } catch (error) {
            throw new Error(connHelper.getErrorMessage(error));
        }
    }

    async imageToVideo({
        imagePath,
        seed = 0,
        cfg_scale = 1.8,
        motion_bucket_id = 127,
        accept = "application/json"
    }) {
        // Step 1: Start generation
        const endpoint = config.url.stability.image_to_video;

        const formData = new FormData();
        formData.append("image", fs.createReadStream(imagePath));
        formData.append("seed", seed);
        formData.append("cfg_scale", cfg_scale);
        formData.append("motion_bucket_id", motion_bucket_id);

        try {
            const startResp = await this.client.post(endpoint, formData, {
                headers: {
                    Accept: accept
                }
            });

            return startResp;
        } catch (error) {
            throw new Error(connHelper.getErrorMessage(error));
        }
    }

    async fetchVideoResult(generation_id, accept = "video/*") {
        
        
        const endpoint = `${config.url.stability.fetch_video}${generation_id}`;

        try {
            const response = await this.client.get(endpoint, {
                headers: {
                    Accept: accept
                },
                responseType: "arraybuffer"
            });
            // If it's 200 => raw bytes
            // If it's 202 => you need to re-check. 
            return response;
        } catch (error) {
            throw new Error(connHelper.getErrorMessage(error));
        }
    }

    /**
   * Control: Sketch
   * POST /v2beta/stable-image/control/sketch
   *
   * Required: image, prompt
   * Optional: control_strength, negative_prompt, seed, output_format, style_preset
   */
  async controlSketch({
    imagePath,
    prompt,
    control_strength,
    negative_prompt,
    seed,
    output_format,
    style_preset,
    accept = 'image/*' // or 'application/json'
  }) {
    const endpoint = config.url.stability.control_sketch;
    const formData = new FormData();

    // Required
    if (typeof imagePath === 'string') {
        // Node usage
        const fs = require('fs');
        formData.append('image', fs.createReadStream(imagePath));
    } else {
        // Browser usage - assume it's a File or Blob
        formData.append('image', imagePath);
    }
    formData.append('prompt', prompt);

    // Optional
    if (control_strength !== undefined) formData.append('control_strength', control_strength);
    if (negative_prompt) formData.append('negative_prompt', negative_prompt);
    if (seed !== undefined) formData.append('seed', seed);
    if (output_format) formData.append('output_format', output_format);
    if (style_preset) formData.append('style_preset', style_preset);

    try {
      // If accept is image/*, we want the raw image (arraybuffer).
      // If accept is application/json, we get a base64 JSON.
      const response = await this.client.post(endpoint, formData, {
        headers: { Accept: accept },
        responseType: accept.startsWith('image/') ? 'arraybuffer' : undefined
      });
      return response;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  /**
   * Control: Structure
   * POST /v2beta/stable-image/control/structure
   *
   * Required: image, prompt
   * Optional: control_strength, negative_prompt, seed, output_format, style_preset
   */
  async controlStructure({
    imagePath,
    prompt,
    control_strength,
    negative_prompt,
    seed,
    output_format,
    style_preset,
    accept = 'image/*'
  }) {
    const endpoint = config.url.stability.control_structure;
    const formData = new FormData();

    // Required
    if (typeof imagePath === 'string') {
        // Node usage
        const fs = require('fs');
        formData.append('image', fs.createReadStream(imagePath));
    } else {
        // Browser usage - assume it's a File or Blob
        formData.append('image', imagePath);
    }
    formData.append('prompt', prompt);

    // Optional
    if (control_strength !== undefined) formData.append('control_strength', control_strength);
    if (negative_prompt) formData.append('negative_prompt', negative_prompt);
    if (seed !== undefined) formData.append('seed', seed);
    if (output_format) formData.append('output_format', output_format);
    if (style_preset) formData.append('style_preset', style_preset);

    try {
      const response = await this.client.post(endpoint, formData, {
        headers: { Accept: accept },
        responseType: accept.startsWith('image/') ? 'arraybuffer' : undefined
      });
      return response;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  /**
   * Control: Style
   * POST /v2beta/stable-image/control/style
   *
   * Required: image, prompt
   * Optional: negative_prompt, aspect_ratio, fidelity, seed, output_format, style_preset
   */
  async controlStyle({
    imagePath,
    prompt,
    negative_prompt,
    aspect_ratio,
    fidelity,
    seed,
    output_format,
    style_preset,
    accept = 'image/*'
  }) {
    const endpoint = '/v2beta/stable-image/control/style';
    const formData = new FormData();

    // Required
    if (typeof imagePath === 'string') {
        // Node usage
        const fs = require('fs');
        formData.append('image', fs.createReadStream(imagePath));
    } else {
        // Browser usage - assume it's a File or Blob
        formData.append('image', imagePath);
    }
    formData.append('prompt', prompt);

    // Optional
    if (negative_prompt) formData.append('negative_prompt', negative_prompt);
    if (aspect_ratio) formData.append('aspect_ratio', aspect_ratio);
    if (fidelity !== undefined) formData.append('fidelity', fidelity);
    if (seed !== undefined) formData.append('seed', seed);
    if (output_format) formData.append('output_format', output_format);
    if (style_preset) formData.append('style_preset', style_preset);

    try {
      const response = await this.client.post(endpoint, formData, {
        headers: { Accept: accept },
        responseType: accept.startsWith('image/') ? 'arraybuffer' : undefined
      });
      return response;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = StabilityAIWrapper;
},{"../config.json":1,"../utils/ConnHelper":30,"../utils/FetchClient":31,"form-data":24,"fs":21}],52:[function(require,module,exports){
const FetchClient = require('../utils/FetchClient');
const connHelper = require('../utils/ConnHelper');

class VLLMWrapper {
  constructor(apiBaseUrl) {
    this.client = new FetchClient({
      baseURL: apiBaseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async generateText(params) {
    const endpoint = '/v1/completions';
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateChatText(params) {
    const endpoint = '/v1/chat/completions';
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async getEmbeddings(texts) {
    const endpoint = '/embed';
    try {
      return await this.client.post(endpoint, { texts });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = VLLMWrapper;

},{"../utils/ConnHelper":30,"../utils/FetchClient":31}]},{},[12])(12)
});
