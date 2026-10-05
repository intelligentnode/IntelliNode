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
      "responses": "/v1/responses",
      "imagegenerate": "/v1/images/generations",
      "embeddings": "/v1/embeddings",
      "audiotranscriptions": "/v1/audio/transcriptions",
      "audiospeech": "/v1/audio/speech",
      "files": "/v1/files",
      "finetuning": "/v1/fine_tuning/jobs",
      "organization": null,
      "models": {
        "chat": "gpt-5.5",
        "completion": "gpt-3.5-turbo-instruct",
        "image": "gpt-image-2",
        "embed": "text-embedding-3-small",
        "speech": "gpt-4o-mini-tts"
      }
    },
    "azure_openai": {
      "base": "https://{resource-name}.openai.azure.com/openai",
      "completions": "/deployments/{deployment-id}/completions?api-version={api-version}",
      "chatgpt": "/deployments/{deployment-id}/chat/completions?api-version={api-version}",
      "responses": "/deployments/{deployment-id}/responses?api-version={api-version}",
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
      "chat": "/chat",
      "embed": "/v1/embed",
      "version": "2022-12-06",
      "models": {
        "chat": "command-a-03-2025",
        "embed": "embed-v4.0"
      }
    },
    "google": {
      "base": "https://{1}.googleapis.com/v1/",
      "speech": {
        "prefix": "texttospeech",
        "synthesize": {
          "postfix": "text:synthesize"
        }
      },
      "speechtotext": {
        "prefix": "speech",
        "recognize": {
          "postfix": "speech:recognize"
        },
        "longrunning": {
          "postfix": "speech:longrunningrecognize"
        }
      },
      "vision": {
        "prefix": "vision",
        "annotate": {
          "postfix": "images:annotate"
        }
      },
      "language": {
        "prefix": "language",
        "annotate": {
          "postfix": "documents:annotateText"
        },
        "sentiment": {
          "postfix": "documents:analyzeSentiment"
        },
        "classify": {
          "postfix": "documents:classifyText"
        }
      },
      "translation": {
        "base": "https://translation.googleapis.com/language/translate/v2"
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
      "embed": "/v1/embeddings",
      "models": {
        "chat": "mistral-medium-latest",
        "embed": "mistral-embed"
      }
    },
    "gemini": {
      "base": "https://generativelanguage.googleapis.com/v1beta/models/",
      "generateContent": ":generateContent",
      "embedContent": ":embedContent",
      "batchEmbedContents": ":batchEmbedContents",
      "upload_base": "https://generativelanguage.googleapis.com/upload/v1beta/files",
      "models": {
        "chat": "gemini-3.6-flash",
        "vision": "gemini-3.6-flash",
        "embed": "gemini-embedding-001",
        "lite": "gemini-3.5-flash-lite",
        "image": "gemini-3.1-flash-image",
        "tts": "gemini-3.8-flash-tts",
        "tts_pro": "gemini-2.5-pro-preview-tts",
        "video": "veo-3.1-fast-generate-preview",
        "music": "lyria-3.5",
        "live": "gemini-3.8-live"
      },
      "vertex": {
        "global_host": "https://aiplatform.googleapis.com",
        "regional_host": "https://{location}-aiplatform.googleapis.com",
        "multi_regional_host": "https://aiplatform.{location}.rep.googleapis.com",
        "api_version": "v1beta1",
        "default_location": "global",
        "locations": {
          "video": "us-central1",
          "live": "us-central1",
          "music": "us-central1",
          "imagen": "us-central1",
          "agent_engine": "us-central1",
          "rag": "us-central1"
        },
        "models": {
          "chat": "gemini-3.8-flash",
          "vision": "gemini-3.8-flash",
          "embed": "gemini-embedding-001",
          "lite": "gemini-3.5-flash-lite",
          "image": "gemini-3.1-flash-image",
          "tts": "gemini-2.5-flash-tts",
          "tts_pro": "gemini-2.5-pro-tts",
          "video": "veo-3.1-fast-generate-001",
          "music": "lyria-002",
          "live": "gemini-3.8-live"
        },
        "catalog": {
          "text": [
            "gemini-3.8-flash",
            "gemini-3.7-flash",
            "gemini-3.6-flash",
            "gemini-3.5-flash",
            "gemini-3.5-flash-lite",
            "gemini-3.1-flash-lite",
            "gemini-3.1-pro-preview",
            "gemini-3-flash-preview",
            "gemini-2.5-pro",
            "gemini-2.5-flash",
            "gemini-2.5-flash-lite"
          ],
          "image": [
            "gemini-3.1-flash-image",
            "gemini-3.1-flash-lite-image",
            "gemini-3-pro-image",
            "gemini-2.5-flash-image"
          ],
          "video": [
            "veo-3.1-generate-001",
            "veo-3.1-fast-generate-001",
            "veo-3.1-lite-generate-001"
          ],
          "tts": [
            "gemini-2.5-flash-tts",
            "gemini-2.5-pro-tts",
            "gemini-3.8-flash-tts",
            "gemini-3.8-flash-lite-tts",
            "gemini-2.5-flash-lite-preview-tts"
          ],
          "music": [
            "lyria-002"
          ],
          "live": [
            "gemini-3.8-live",
            "gemini-live-2.5-flash-native-audio"
          ],
          "embedding": [
            "gemini-embedding-001",
            "text-embedding-005",
            "text-multilingual-embedding-002"
          ]
        }
      }
    },
    "anthropic": {
      "base": "https://api.anthropic.com",
      "messages": "/v1/messages",
      "version": "2023-06-01",
      "models": {
        "chat": "claude-sonnet-5",
        "sonnet": "claude-sonnet-5",
        "opus": "claude-opus-5",
        "haiku": "claude-haiku-4-5"
      }
    },
    "openai_compatible": {
      "chat": "/chat/completions",
      "embeddings": "/embeddings",
      "models": "/models",
      "presets": {
        "openrouter": {
          "base": "https://openrouter.ai/api/v1",
          "chat_model": "openai/gpt-5.5",
          "embed_model": "openai/text-embedding-3-small"
        },
        "groq": {
          "base": "https://api.groq.com/openai/v1",
          "chat_model": null,
          "embed_model": null
        },
        "deepseek": {
          "base": "https://api.deepseek.com",
          "chat_model": "deepseek-chat",
          "embed_model": null,
          "structured_output": "json_object"
        },
        "xai": {
          "base": "https://api.x.ai/v1",
          "chat_model": null,
          "embed_model": null
        },
        "together": {
          "base": "https://api.together.xyz/v1",
          "chat_model": null,
          "embed_model": null
        },
        "ollama": {
          "base": "http://localhost:11434/v1",
          "chat_model": null,
          "embed_model": null,
          "local": true
        },
        "lmstudio": {
          "base": "http://localhost:1234/v1",
          "chat_model": null,
          "embed_model": null,
          "local": true
        }
      }
    }
  },
  "nvidia": {
    "base": "https://integrate.api.nvidia.com",
    "chat": "/v1/chat/completions",
    "embeddings": "/v1/embeddings",
    "retrieval": "/v1/retrieval",
    "version": "v1",
    "models": {
      "chat": "deepseek-ai/deepseek-v4-flash-0731",
      "embed": "nvidia/llama-3.2-nv-embedqa-1b-v1"
    }
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
const NvidiaWrapper = require('../wrappers/NvidiaWrapper');
const OpenAICompatibleWrapper = require('../wrappers/OpenAICompatibleWrapper');

const SupportedEmbedModels = {
  OPENAI: 'openai',
  COHERE: 'cohere',
  REPLICATE: 'replicate',
  GEMINI: 'gemini',
  // Gemini embeddings on Vertex AI; returns one embedding per text, like openai
  VERTEX: 'vertex',
  NVIDIA: 'nvidia',
  VLLM: "vllm",
  // any service with an OpenAI embeddings API (needs { baseUrl } as the third argument)
  OPENAI_COMPATIBLE: 'openai_compatible',
  OPENROUTER: 'openrouter',
  TOGETHER: 'together',
  OLLAMA: 'ollama',
  LMSTUDIO: 'lmstudio'
};

const COMPATIBLE_PROVIDERS = new Set([
  SupportedEmbedModels.OPENAI_COMPATIBLE, SupportedEmbedModels.OPENROUTER, SupportedEmbedModels.TOGETHER,
  SupportedEmbedModels.OLLAMA, SupportedEmbedModels.LMSTUDIO
]);

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
        this.geminiWrapper = GeminiAIWrapper.fromOptions(keyValue, customProxyHelper || {});
    } else if (keyType === SupportedEmbedModels.VERTEX) {
        this.geminiWrapper = GeminiAIWrapper.fromOptions(keyValue, { ...(customProxyHelper || {}), vertex: true });
    } else if (keyType === SupportedEmbedModels.NVIDIA) {
      this.nvidiaWrapper = new NvidiaWrapper(keyValue, customProxyHelper);
    } else if (keyType === SupportedEmbedModels.VLLM) {
      const baseUrl = customProxyHelper.baseUrl;
      this.vllmWrapper = new VLLMWrapper(baseUrl);
    } else if (COMPATIBLE_PROVIDERS.has(keyType)) {
      const options = customProxyHelper || {};
      if (keyType === SupportedEmbedModels.OPENAI_COMPATIBLE && !options.baseUrl) {
        throw new Error("The openai_compatible provider requires { baseUrl } as the third argument.");
      }
      this.compatibleWrapper = new OpenAICompatibleWrapper(keyValue, {
        preset: keyType === SupportedEmbedModels.OPENAI_COMPATIBLE ? null : keyType,
        baseUrl: options.baseUrl,
        headers: options.headers,
      });
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
      } else if (this.keyType === SupportedEmbedModels.VERTEX) {
        inputs = { texts: embedInput.texts, model: embedInput.model, taskType: embedInput.inputType };
      } else if (this.keyType === SupportedEmbedModels.NVIDIA) {
        inputs = embedInput.getNvidiaInputs();
      } else if (this.keyType === SupportedEmbedModels.VLLM) {
        inputs = embedInput.getVLLMInputs();
      } else if (COMPATIBLE_PROVIDERS.has(this.keyType)) {
        inputs = embedInput.getOpenAIInputs();
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
    } else if (this.keyType === SupportedEmbedModels.VERTEX) {
      const texts = inputs.texts || (inputs.content ? [GeminiAIWrapper._contentText(inputs.content)] : []);
      const vectors = await this.geminiWrapper.embedTexts(texts, inputs.model || null, { taskType: inputs.taskType || null });
      return vectors.map((embedding, index) => ({ object: 'embedding', index, embedding }));
    } else if (this.keyType === SupportedEmbedModels.NVIDIA) {
      const result = await this.nvidiaWrapper.generateRetrieval(inputs);
      return Array.isArray(result) ? result : (result.data || []);
    } else if (this.keyType === SupportedEmbedModels.VLLM) {
      const results = await this.vllmWrapper.getEmbeddings(inputs.texts);
      return results.embeddings.map((embedding, index) => ({
        object: "embedding",
        index: index,
        embedding: embedding
      }));
    } else if (COMPATIBLE_PROVIDERS.has(this.keyType)) {
      const results = await this.compatibleWrapper.getEmbeddings(inputs);
      return results.data;
    } else {
      throw new Error('The keyType is not supported');
    }
  }
}

module.exports = {
  RemoteEmbedModel,
  SupportedEmbedModels,
};
},{"../model/input/EmbedInput":16,"../wrappers/CohereAIWrapper":68,"../wrappers/GeminiAIWrapper":69,"../wrappers/NvidiaWrapper":74,"../wrappers/OpenAICompatibleWrapper":75,"../wrappers/OpenAIWrapper":76,"../wrappers/ReplicateWrapper":77,"../wrappers/VLLMWrapper":79}],3:[function(require,module,exports){
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

},{"../model/input/FineTuneInput":17,"../wrappers/OpenAIWrapper":76}],4:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode
*/
const SupportedImageModels = {
  OPENAI: "openai",
  STABILITY: "stability",
  // Gemini image models on the Gemini Developer API, or on Vertex AI with the vertex provider
  GEMINI: "gemini",
  VERTEX: "vertex",
};

const OpenAIWrapper = require("../wrappers/OpenAIWrapper");
const StabilityAIWrapper = require("../wrappers/StabilityAIWrapper");
const GeminiAIWrapper = require("../wrappers/GeminiAIWrapper");
const ImageModelInput = require("../model/input/ImageModelInput");

class RemoteImageModel {
  /**
   * @param {string} keyValue - provider API key.
   * @param {string} provider - openai, stability, gemini or vertex.
   * @param {object} options - Gemini / Vertex AI settings: { projectId, location, accessToken, credentials }.
   */
  constructor(keyValue, provider, options = {}) {
    this.options = options || {};
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
    } else if (keyType === SupportedImageModels.GEMINI || keyType === SupportedImageModels.VERTEX) {
      const options = keyType === SupportedImageModels.VERTEX ? { ...this.options, vertex: true } : this.options;
      this.geminiWrapper = GeminiAIWrapper.fromOptions(keyValue, options);
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
      } else if (this.geminiWrapper) {
        inputs = imageInput.getGeminiInputs();
      } else {
        throw new Error("The keyType is not supported");
      }
    } else if (typeof imageInput === "object") {
      inputs = this.keyType === SupportedImageModels.OPENAI
        ? ImageModelInput.normalizeOpenAIParams(imageInput)
        : imageInput;
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

    } else if (this.geminiWrapper) {
      // one request per image; Gemini image models return one image per call
      const images = [];
      const count = inputs.numberOfImages || 1;
      for (let index = 0; index < count; index++) {
        const response = await this.geminiWrapper.generateImage(inputs.prompt, inputs.config || null, inputs.model || null, { images: inputs.images || null });
        images.push(...GeminiAIWrapper.extractImages(response).map((image) => image.data));
      }
      return images;
    } else {
      throw new Error(`This version supports ${SupportedImageModels.OPENAI} keyType only`);
    }
  }
}

module.exports = {
  RemoteImageModel,
  SupportedImageModels,
};
},{"../model/input/ImageModelInput":19,"../wrappers/GeminiAIWrapper":69,"../wrappers/OpenAIWrapper":76,"../wrappers/StabilityAIWrapper":78}],5:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const OpenAIWrapper = require('../wrappers/OpenAIWrapper');
const CohereAIWrapper = require('../wrappers/CohereAIWrapper');
const LanguageModelInput = require('../model/input/LanguageModelInput');
const config = require('../config.json');

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
      // Cohere removed the Generate API, so completions are served through the Chat API.
      const chatParams = {
        model: inputs.model || config.url.cohere.models.chat,
        message: inputs.prompt,
        ...(inputs.temperature != null && { temperature: inputs.temperature }),
        ...(inputs.max_tokens != null && { max_tokens: inputs.max_tokens }),
      };
      const results = [];
      const generations = Math.max(1, inputs.num_generations || 1);
      for (let i = 0; i < generations; i++) {
        const response = await this.cohereWrapper.generateChatText(chatParams);
        results.push(response.text);
      }
      return results;
    } else {
      throw new Error('The keyType is not supported');
    }
  }
}

module.exports = {
  RemoteLanguageModel,
  SupportedLangModels,
};
},{"../config.json":1,"../model/input/LanguageModelInput":20,"../wrappers/CohereAIWrapper":68,"../wrappers/OpenAIWrapper":76}],6:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const GoogleAIWrapper = require('../wrappers/GoogleAIWrapper');
const GeminiAIWrapper = require('../wrappers/GeminiAIWrapper');
const OpenAIWrapper = require('../wrappers/OpenAIWrapper');
const Text2SpeechInput = require('../model/input/Text2SpeechInput');

const SupportedSpeechModels = {
  GOOGLE: 'google',
  OPENAI: 'openAi',
  // Gemini TTS on the Gemini Developer API, or on Vertex AI with the vertex provider
  GEMINI: 'gemini',
  VERTEX: 'vertex',
};

class RemoteSpeechModel {
  /**
   * @param {string} keyValue - provider API key.
   * @param {string} provider - google (Cloud TTS), openAi, gemini or vertex.
   * @param {object} options - Gemini / Vertex AI settings: { projectId, location, accessToken, credentials }.
   */
  constructor(keyValue, provider, options = {}) {
    this.options = options || {};
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
    } else if (keyType === SupportedSpeechModels.GEMINI || keyType === SupportedSpeechModels.VERTEX) {
      const options = keyType === SupportedSpeechModels.VERTEX ? { ...this.options, vertex: true } : this.options;
      this.geminiWrapper = GeminiAIWrapper.fromOptions(keyValue, options);
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
    } else if (this.geminiWrapper) {
      const params = input instanceof Text2SpeechInput ? input.getGeminiInput() : input;
      if (!params || typeof params !== 'object') {
        throw new Error('Invalid input: Must be an instance of Text2SpeechInput or a dictionary');
      }
      // base64 WAV, like the base64 MP3 of the google provider
      const wav = await this.geminiWrapper.textToSpeech(params.text, { voice: params.voice, model: params.model, languageCode: params.languageCode });
      return wav.toString('base64');
    }  else {
      throw new Error('The keyType is not supported');
    }
  }
}

module.exports = {
  RemoteSpeechModel,
  SupportedSpeechModels,
};

},{"../model/input/Text2SpeechInput":21,"../wrappers/GeminiAIWrapper":69,"../wrappers/GoogleAIWrapper":70,"../wrappers/OpenAIWrapper":76}],7:[function(require,module,exports){
(function (Buffer){(function (){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { Chatbot, SupportedChatModels } = require('./Chatbot');
const GeminiAIWrapper = require('../wrappers/GeminiAIWrapper');
const { MemoryChatHistory } = require('../store/ChatHistory');
const { newId } = require('../store/VectorStore');
const TextSplitter = require('../utils/TextSplitter');

const DEFAULT_SYSTEM = 'You are a helpful assistant. Answer clearly and concisely.';
const GEMINI_PROVIDERS = new Set([SupportedChatModels.GEMINI, SupportedChatModels.VERTEX]);
const TEXT_EXTENSIONS = new Set(['txt', 'md', 'markdown', 'csv', 'json', 'html', 'htm', 'xml', 'yaml', 'yml', 'js', 'ts', 'py', 'java', 'go', 'rs', 'sql', 'log']);
const MIME_BY_EXTENSION = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', pdf: 'application/pdf',
  mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', m4a: 'audio/mp4', mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm',
  txt: 'text/plain', md: 'text/markdown', csv: 'text/csv', html: 'text/html', json: 'application/json',
};

/**
 * A ready-made chat assistant for Gemini- or ChatGPT-style apps, on any Chatbot provider:
 * conversations kept in a ChatHistory (memory, JSON files, Firestore), answers grounded on your documents
 * (a knowledge VectorStore, with numbered references), long-term memory recalled from earlier conversations
 * (a memory VectorStore), attachments (images, PDFs, audio, video on Gemini), Google Search grounding on
 * Gemini / Vertex AI, tools, and streaming.
 *
 *   const assistant = new Assistant({ provider: 'vertex', apiKey: process.env.VERTEX_API_KEY,
 *     history: new FileChatHistory({ dir: './conversations' }),
 *     knowledge: new MemoryVectorStore({ embedder: { provider: 'vertex', apiKey } }) });
 *   await assistant.addDocuments([{ id: 'handbook', text: handbookText }]);
 *   const reply = await assistant.chat('What is the refund policy?', { conversationId: 'c1' });
 *   // reply: { conversationId, text, references, citations, memories, usage }
 */
class Assistant {
  /**
   * @param {object} settings
   * @param {string} settings.provider - any Chatbot provider: openai, anthropic, gemini, vertex, mistral, cohere,
   *   nvidia, vllm, ollama, openrouter, ...
   * @param {string} settings.apiKey
   * @param {string} settings.model - chat model; the provider default when omitted.
   * @param {object} settings.options - Chatbot options: Gemini / Vertex { projectId, location, accessToken },
   *   compatible providers { baseUrl }, request { timeout, retries }.
   * @param {string} settings.systemMessage
   * @param {ChatHistory} settings.history - conversation store (default MemoryChatHistory).
   * @param {VectorStore} settings.knowledge - documents to ground answers on (RAG).
   * @param {VectorStore} settings.memory - long-term memory: every exchange is stored and recalled later.
   * @param {number} settings.maxHistory - recent messages sent with each turn (default 20).
   * @param {number} settings.topK - knowledge chunks per turn (default 4).
   * @param {number} settings.memoryTopK - recalled memories per turn (default 3).
   * @param {number} settings.minScore - drop knowledge and memory matches below this similarity.
   * @param {boolean} settings.googleSearch - ground answers on Google Search (gemini and vertex providers).
   * @param {object|Array} settings.tools - a Chatbot.runTools tool set; turns then run the tool loop.
   * @param {boolean} settings.autoTitle - name a new conversation after its first exchange (one extra model call).
   */
  constructor({
    provider = SupportedChatModels.OPENAI,
    apiKey = null,
    model = null,
    options = {},
    systemMessage = DEFAULT_SYSTEM,
    history = null,
    knowledge = null,
    memory = null,
    maxHistory = 20,
    topK = 4,
    memoryTopK = 3,
    minScore = null,
    googleSearch = false,
    tools = null,
    maxToolSteps = 5,
    maxTokens = null,
    temperature = null,
    inputOptions = {},
    autoTitle = false,
  } = {}) {
    this.provider = provider;
    this.model = model;
    this.options = options || {};
    this.chatbot = new Chatbot(apiKey, provider, this.options.customProxyHelper || null, this.options);
    this.systemMessage = systemMessage;
    this.history = history || new MemoryChatHistory();
    this.knowledge = knowledge;
    this.memory = memory;
    this.maxHistory = maxHistory;
    this.topK = topK;
    this.memoryTopK = memoryTopK;
    this.minScore = minScore;
    this.googleSearch = googleSearch;
    this.tools = tools;
    this.maxToolSteps = maxToolSteps;
    this.maxTokens = maxTokens;
    this.temperature = temperature;
    this.inputOptions = inputOptions || {};
    this.autoTitle = autoTitle;
    if (googleSearch && !GEMINI_PROVIDERS.has(provider)) {
      throw new Error('googleSearch grounding needs the gemini or vertex provider.');
    }
  }

  /**
   * Answer a message in a conversation (a new one when conversationId is omitted).
   * @param {string} message
   * @param {object} options - { conversationId, userId, attachments, filter (knowledge metadata filter), systemMessage,
   *   googleSearch (this turn only, gemini and vertex) }.
   *   attachments: file paths (Node), { data (base64 or bytes), mimeType, name } or { uri, mimeType }.
   * @returns {Promise<{conversationId, messageId, text, references, citations, memories, usage, model, toolSteps}>}
   *   references are the retrieved chunks; `cited: true` marks the ones the answer cites as [n].
   */
  async chat(message, options = {}) {
    const turn = await this._prepare(message, options);
    const bot = this._turnChatbot();
    let text;
    let toolSteps = [];
    if (this.tools) {
      const result = await bot.runTools(turn.input, this.tools, { maxSteps: this.maxToolSteps });
      text = result.text;
      toolSteps = result.steps;
    } else {
      const replies = await bot.chat(turn.input);
      const first = Array.isArray(replies) ? replies[0] : replies.result[0];
      text = typeof first === 'string' ? first : (first && first.content) || '';
    }
    return this._finish(turn, text, bot.lastResponse, toolSteps);
  }

  /**
   * Stream the answer. Yields { type: 'start', conversationId, references, memories }, then { type: 'text', text }
   * chunks, then { type: 'done', ...result } with the same fields as chat().
   */
  async* stream(message, options = {}) {
    const turn = await this._prepare(message, options);
    yield { type: 'start', conversationId: turn.conversationId, references: turn.references, memories: turn.memories };
    const bot = this._turnChatbot();
    let text = '';
    let toolSteps = [];
    if (this.tools) {
      // the tool loop needs whole replies; the final answer is sent as one chunk
      const result = await bot.runTools(turn.input, this.tools, { maxSteps: this.maxToolSteps });
      text = result.text;
      toolSteps = result.steps;
      if (text) yield { type: 'text', text };
    } else {
      for await (const chunk of bot.stream(turn.input)) {
        text += chunk;
        yield { type: 'text', text: chunk };
      }
    }
    yield { type: 'done', ...(await this._finish(turn, text, bot.lastResponse, toolSteps)) };
  }

  /** Answer the last user message of a conversation again (the previous answer is removed from the history). */
  async regenerate(conversationId, options = {}) {
    const messages = await this.history.getMessages(conversationId, { limit: 2 });
    if (messages.length < 2 || messages[1].role !== 'assistant' || messages[0].role !== 'user') {
      throw new Error('The conversation does not end with a user message and an answer.');
    }
    await this.history.deleteLastMessages(conversationId, 2);
    if (this.memory) await this.memory.delete([messages[0].id]).catch(() => {});
    return this.chat(messages[0].content, { ...options, conversationId });
  }

  /**
   * Add documents to the knowledge store, split into chunks.
   * @param {Array<string|{id?, text, metadata?}>} documents - metadata.source / title / url are shown in references.
   * @param {object} options - { chunkSize = 1200, chunkOverlap = 150 }.
   * @returns {Promise<string[]>} chunk ids.
   */
  async addDocuments(documents, { chunkSize = 1200, chunkOverlap = 150 } = {}) {
    if (!this.knowledge) throw new Error('addDocuments needs a knowledge VectorStore: new Assistant({ knowledge }).');
    const chunks = [];
    for (const document of documents || []) {
      const item = typeof document === 'string' ? { text: document } : document;
      const id = item.id || newId();
      const metadata = { source: id, ...(item.metadata || {}) };
      chunks.push(...TextSplitter.toDocuments(item.text, metadata, { chunkSize, chunkOverlap, idPrefix: String(id) }));
    }
    return this.knowledge.addDocuments(chunks);
  }

  /** Add text files (txt, md, csv, json, html, code) to the knowledge store; the file name becomes the source (Node). */
  async addFiles(paths, options = {}) {
    const fs = require('fs');
    const path = require('path');
    const documents = [];
    for (const file of Array.isArray(paths) ? paths : [paths]) {
      const extension = path.extname(file).slice(1).toLowerCase();
      if (!TEXT_EXTENSIONS.has(extension)) {
        throw new Error(`addFiles reads text files; extract the text of ${path.basename(file)} first (for a PDF on Gemini: GeminiAIWrapper.mediaToText).`);
      }
      documents.push({ id: path.basename(file), text: await fs.promises.readFile(file, 'utf8'), metadata: { source: path.basename(file), path: file } });
    }
    return this.addDocuments(documents, options);
  }

  async listConversations(options = {}) {
    return this.history.listConversations(options);
  }

  async getMessages(conversationId, options = {}) {
    return this.history.getMessages(conversationId, options);
  }

  /** Delete a conversation and its long-term memories. */
  async deleteConversation(conversationId) {
    if (this.memory) {
      const ids = (await this.history.getMessages(conversationId)).filter((message) => message.role === 'user').map((message) => message.id);
      if (ids.length) await this.memory.delete(ids).catch(() => {});
    }
    return this.history.deleteConversation(conversationId);
  }

  async renameConversation(conversationId, title) {
    return this.history.saveConversation({ id: conversationId, title });
  }

  /** Name a conversation from its first message (a short model call) and save the title. */
  async generateTitle(conversationId) {
    const [first] = await this.history.getMessages(conversationId, { limit: null }).then((messages) => messages.filter((m) => m.role === 'user'));
    if (!first) return null;
    const input = this._createInput('You write short titles for chat conversations.', { maxTokens: null, tools: null });
    input.addUserMessage(`Write a title of at most six words for a conversation that starts with the message below. Reply with the title only, no quotes.\n\n${first.content.slice(0, 2000)}`);
    const replies = await this._turnChatbot().chat(input);
    const reply = Array.isArray(replies) ? replies[0] : replies.result[0];
    const title = String(typeof reply === 'string' ? reply : (reply && reply.content) || '').replace(/^["'#\s]+|["'\s]+$/g, '').split('\n')[0].slice(0, 80) || null;
    if (title) await this.history.saveConversation({ id: conversationId, title });
    return title;
  }

  // ------------------------------------------------------------------
  // Turn building
  // ------------------------------------------------------------------

  // A per-turn view of the shared Chatbot (same wrappers and credentials), so concurrent turns keep their own
  // lastResponse. Request options (timeout, retries) are set once on assistant.chatbot.
  _turnChatbot() {
    const bot = Object.create(this.chatbot);
    bot.lastResponse = null;
    return bot;
  }

  _createInput(systemText, overrides = {}, googleSearch = this.googleSearch) {
    const isGemini = GEMINI_PROVIDERS.has(this.provider);
    const options = {
      ...this.inputOptions,
      ...(this.model && { model: this.model }),
      ...(this.maxTokens && { maxTokens: this.maxTokens }),
      ...(this.temperature !== null && this.temperature !== undefined && { temperature: this.temperature }),
      ...(isGemini && { systemInstruction: true }),
      ...overrides,
    };
    if (isGemini && googleSearch && overrides.tools !== null) {
      options.tools = [...(options.tools || []), { googleSearch: {} }];
    }
    if (overrides.tools === null) delete options.tools;
    if (overrides.maxTokens === null) delete options.maxTokens;
    return Chatbot.createInput(this.provider, systemText, options);
  }

  async _prepare(message, options) {
    const text = String(message === undefined || message === null ? '' : message);
    const conversationId = options.conversationId || newId();
    const existing = await this.history.getConversation(conversationId);
    if (existing && existing.userId && options.userId && existing.userId !== options.userId) {
      throw new Error(`Conversation '${conversationId}' belongs to another user.`);
    }
    if (!existing || (options.userId && !existing.userId)) {
      await this.history.saveConversation({ id: conversationId, ...(options.userId && { userId: options.userId }) });
    }
    const recent = this.maxHistory > 0 ? await this.history.getMessages(conversationId, { limit: this.maxHistory }) : [];
    const references = await this._searchKnowledge(text, options.filter || null);
    const memories = await this._recall(text, conversationId, options.userId || (existing && existing.userId) || null, recent);
    const attachments = (options.attachments || []).map((attachment) => Assistant._readAttachment(attachment));

    if (options.googleSearch && !GEMINI_PROVIDERS.has(this.provider)) {
      throw new Error('googleSearch grounding needs the gemini or vertex provider.');
    }
    const googleSearch = options.googleSearch !== undefined ? Boolean(options.googleSearch) : this.googleSearch;
    const input = this._createInput(this._systemText(options.systemMessage || this.systemMessage, references, memories), {}, googleSearch);
    for (const item of recent) {
      if (!item.content) continue;
      if (item.role === 'user') input.addUserMessage(item.content);
      else input.addAssistantMessage(item.content);
    }
    this._addUserTurn(input, text, attachments);
    return { conversationId, isNew: !existing, text, attachments, references, memories, input, userId: options.userId || (existing && existing.userId) || null };
  }

  _systemText(systemMessage, references, memories) {
    const sections = [systemMessage];
    if (references.length) {
      sections.push('Use the sources below when they are relevant to the question. Cite them inline as [1], [2] by their numbers. '
        + 'If the sources do not answer the question, say so before answering from general knowledge.');
      sections.push(`Sources:\n${references.map((reference) => `[${reference.index}] ${Assistant._sourceLabel(reference)}\n${reference.text}`).join('\n\n')}`);
    }
    if (memories.length) {
      sections.push('Notes from earlier conversations with this user (use them only when they help):\n'
        + memories.map((memory) => `- ${memory.text.replace(/\s+/g, ' ').slice(0, 600)}`).join('\n'));
    }
    return sections.join('\n\n');
  }

  static _sourceLabel(reference) {
    const metadata = reference.metadata || {};
    const label = metadata.title || metadata.source || reference.id;
    return metadata.url ? `${label} (${metadata.url})` : String(label);
  }

  async _searchKnowledge(text, filter) {
    if (!this.knowledge || !text.trim() || !this.topK) return [];
    const matches = await this.knowledge.query({ text, topK: this.topK, filter });
    return matches
      .filter((match) => this._relevant(match))
      .map((match, index) => ({ index: index + 1, id: match.id, text: match.text || '', score: match.score, metadata: match.metadata || {} }));
  }

  async _recall(text, conversationId, userId, recent) {
    if (!this.memory || !text.trim() || !this.memoryTopK) return [];
    const recentIds = new Set(recent.map((message) => message.id));
    const matches = await this.memory.query({ text, topK: this.memoryTopK + recent.length, filter: userId ? { userId } : null });
    return matches
      .filter((match) => !recentIds.has(match.id))
      .filter((match) => this._relevant(match))
      .slice(0, this.memoryTopK)
      .map((match) => ({ id: match.id, text: match.text || '', score: match.score, conversationId: match.metadata && match.metadata.conversationId }));
  }

  // A match passes minScore; stores that return no score (null) always pass.
  _relevant(match) {
    return this.minScore === null || this.minScore === undefined || typeof match.score !== 'number' || match.score >= this.minScore;
  }

  _addUserTurn(input, text, attachments) {
    if (!attachments.length) {
      input.addUserMessage(text);
      return;
    }
    if (GEMINI_PROVIDERS.has(this.provider)) {
      input.addUserMessage(text, attachments.map((item) => (item.uri ? { uri: item.uri, mimeType: item.mimeType } : { data: item.data, mimeType: item.mimeType })));
    } else if (this.provider === SupportedChatModels.ANTHROPIC) {
      const blocks = attachments.map((item) => {
        if (item.uri) throw new Error('Anthropic attachments need the file data, not a URI.');
        if (item.mimeType === 'application/pdf') return { type: 'document', source: { type: 'base64', media_type: item.mimeType, data: item.data } };
        if (item.mimeType.startsWith('image/')) return { type: 'image', source: { type: 'base64', media_type: item.mimeType, data: item.data } };
        throw new Error(`Anthropic takes image and PDF attachments, not ${item.mimeType}.`);
      });
      input.addUserMessage([...blocks, { type: 'text', text }]);
    } else {
      const parts = attachments.map((item) => {
        if (!item.mimeType.startsWith('image/')) throw new Error(`${this.provider} takes image attachments; ${item.mimeType} needs the gemini, vertex or anthropic provider.`);
        return { type: 'image_url', image_url: { url: item.uri || `data:${item.mimeType};base64,${item.data}` } };
      });
      input.addUserMessage([{ type: 'text', text }, ...parts]);
    }
  }

  // { data (base64), mimeType, name } or { uri, mimeType, name } from a path, bytes, a data URL or an object.
  static _readAttachment(attachment) {
    if (typeof attachment === 'string') {
      if (/^(gs|https?):\/\//i.test(attachment)) {
        const extension = attachment.split('?')[0].split('.').pop().toLowerCase();
        return { uri: attachment, mimeType: MIME_BY_EXTENSION[extension] || 'application/octet-stream', name: attachment.split('/').pop() };
      }
      if (attachment.startsWith('data:')) {
        const match = /^data:([^;,]+);base64,(.*)$/s.exec(attachment);
        if (!match) throw new Error('Attachments as data URLs must be base64.');
        return { data: match[2], mimeType: match[1], name: 'attachment' };
      }
      const fs = require('fs');
      const path = require('path');
      const extension = path.extname(attachment).slice(1).toLowerCase();
      return { data: fs.readFileSync(attachment).toString('base64'), mimeType: MIME_BY_EXTENSION[extension] || 'application/octet-stream', name: path.basename(attachment) };
    }
    if (attachment && (attachment.uri || attachment.fileUri)) {
      return { uri: attachment.uri || attachment.fileUri, mimeType: attachment.mimeType, name: attachment.name || null };
    }
    if (attachment && attachment.data !== undefined) {
      if (!attachment.mimeType) throw new Error('An attachment with data needs a mimeType.');
      const data = typeof attachment.data === 'string' ? attachment.data.replace(/^data:[^,]*,/, '') : Buffer.from(attachment.data).toString('base64');
      return { data, mimeType: attachment.mimeType, name: attachment.name || null };
    }
    throw new Error('An attachment is a file path, a data URL, { data, mimeType } or { uri, mimeType }.');
  }

  async _finish(turn, text, lastResponse, toolSteps) {
    const isGemini = GEMINI_PROVIDERS.has(this.provider);
    const citations = isGemini && lastResponse ? GeminiAIWrapper.extractCitations(lastResponse) : [];
    const usage = Assistant._usage(lastResponse);
    // the retrieved chunks the answer cites as [n]
    const cited = new Set([...String(text).matchAll(/\[(\d+(?:\s*,\s*\d+)*)\]/g)].flatMap((match) => match[1].split(',').map(Number)));
    for (const reference of turn.references) reference.cited = cited.has(reference.index);
    const [userMessage, assistantMessage] = await this.history.addMessages(turn.conversationId, [
      {
        role: 'user',
        content: turn.text,
        metadata: turn.attachments.length ? { attachments: turn.attachments.map((item) => ({ name: item.name, mimeType: item.mimeType })) } : null,
      },
      {
        role: 'assistant',
        content: text,
        metadata: {
          ...(turn.references.length && { references: turn.references.map(({ index, id, metadata, cited: isCited }) => ({ index, id, cited: isCited, source: metadata.source || null, title: metadata.title || null, url: metadata.url || null })) }),
          ...(citations.length && { citations }),
        },
      },
    ]);
    if (this.memory && text) {
      await this.memory.addDocuments([{
        id: userMessage.id,
        text: `User: ${turn.text}\nAssistant: ${text}`,
        metadata: { conversationId: turn.conversationId, ...(turn.userId && { userId: turn.userId }), createdAt: userMessage.createdAt },
      }]);
    }
    if (this.autoTitle && turn.isNew) {
      await this.generateTitle(turn.conversationId).catch(() => null);
    }
    return {
      conversationId: turn.conversationId,
      messageId: assistantMessage.id,
      text,
      references: turn.references,
      citations,
      memories: turn.memories,
      usage,
      model: Assistant._model(lastResponse, turn.input),
      toolSteps,
    };
  }

  // The model that answered: the response's own record when it has one, else the input's model.
  static _model(response, input) {
    if (response && typeof response === 'object') {
      if (response.modelVersion) return response.modelVersion;
      if (typeof response.model === 'string') return response.model;
    }
    return (input && input.model) || null;
  }

  // Token usage in one shape for every provider: { inputTokens, outputTokens, totalTokens }.
  static _usage(response) {
    if (!response || typeof response !== 'object') return null;
    const usage = response.usageMetadata || response.usage || (response.meta && response.meta.billed_units) || null;
    if (!usage) return null;
    const inputTokens = usage.promptTokenCount ?? usage.input_tokens ?? usage.prompt_tokens ?? null;
    const outputTokens = usage.candidatesTokenCount ?? usage.output_tokens ?? usage.completion_tokens ?? null;
    const totalTokens = usage.totalTokenCount ?? usage.total_tokens ?? (inputTokens !== null && outputTokens !== null ? inputTokens + outputTokens : null);
    return { inputTokens, outputTokens, totalTokens };
  }
}

module.exports = { Assistant };

}).call(this)}).call(this,require("buffer").Buffer)
},{"../store/ChatHistory":33,"../store/VectorStore":46,"../utils/TextSplitter":65,"../wrappers/GeminiAIWrapper":69,"./Chatbot":8,"buffer":25,"fs":24,"path":29}],8:[function(require,module,exports){
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
const config = require('../config.json');
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
    // Gemini on Vertex AI / the Gemini Enterprise Agent Platform (express mode with an API key, or options.projectId)
    VERTEX: "vertex",
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
    [SupportedChatModels.VERTEX]: GeminiInput,
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
     *   Gemini / Vertex AI also take { vertex, projectId, location, accessToken, credentials, apiVersion, quotaProjectId }.
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
        // the raw provider response of the last chat or stream (usage, grounding sources, finish reason)
        this.lastResponse = null;

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
        } else if (provider === SupportedChatModels.GEMINI || provider === SupportedChatModels.VERTEX) {
            const googleOptions = provider === SupportedChatModels.VERTEX ? { ...options, vertex: true } : options;
            this.geminiWrapper = GeminiAIWrapper.fromOptions(keyValue, googleOptions);
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
        } else if (this.provider === SupportedChatModels.GEMINI || this.provider === SupportedChatModels.VERTEX) {
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
        } else if (this.provider === SupportedChatModels.GEMINI || this.provider === SupportedChatModels.VERTEX) {
            yield* this._streamGemini(modelInput);
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
            throw new Error("The stream function supports openai, anthropic, gemini, vertex, mistral, cohere, nvidia, vllm and the OpenAI-compatible providers; for other providers use the chat function.");
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
        this.lastResponse = results;
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
            this.lastResponse = results;
            return this._parseResponsesOutput(results, legacyFunctions);
        }

        const results = await this.openaiWrapper.generateChatText(params, functions, function_call);
        this.lastResponse = results;
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
        this.lastResponse = results;

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
        this.lastResponse = results;

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

    _getGeminiParams(modelInput) {
        if (modelInput instanceof GeminiInput) {
            // an input that kept the Developer API default model uses the wrapper default (gemini-3.8-flash on Vertex AI)
            const keptDefault = modelInput.defaultModel && modelInput.model === config.url.gemini.models.chat;
            return { params: modelInput.getChatInput(), model: keptDefault && this.geminiWrapper.vertex ? null : modelInput.model };
        } else if (modelInput && typeof modelInput === "object") {
            // an optional `model` key selects the model; the wrapper removes it from the body
            return { params: modelInput, model: null };
        }
        throw new Error("Invalid input: Must be an instance of GeminiInput");
    }

    async _chatGemini(modelInput) {
        const { params, model } = this._getGeminiParams(modelInput);

        // call Gemini
        const result = await this.geminiWrapper.generateContent(params, false, model);
        this.lastResponse = result;

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

    async *_streamGemini(modelInput) {
        const { params, model } = this._getGeminiParams(modelInput);
        let last = null;
        for await (const chunk of this.geminiWrapper.streamGenerateContent(params, false, model)) {
            last = chunk;
            const text = GeminiAIWrapper.extractText(chunk);
            if (text) yield text;
        }
        // the last chunk carries the usage and grounding metadata
        this.lastResponse = last;
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
        this.lastResponse = results;

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
        this.lastResponse = resp;
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

},{"../config.json":1,"../model/input/ChatModelInput":15,"../utils/FetchClient":53,"../utils/ModelHelper":59,"../utils/OutputParser":60,"../utils/StreamParser":63,"../utils/SystemHelper":64,"../wrappers/AWSEndpointWrapper":66,"../wrappers/AnthropicWrapper":67,"../wrappers/CohereAIWrapper":68,"../wrappers/GeminiAIWrapper":69,"../wrappers/IntellicloudWrapper":72,"../wrappers/MistralAIWrapper":73,"../wrappers/NvidiaWrapper":74,"../wrappers/OpenAICompatibleWrapper":75,"../wrappers/OpenAIWrapper":76,"../wrappers/ReplicateWrapper":77,"../wrappers/VLLMWrapper":79}],9:[function(require,module,exports){
(function (Buffer){(function (){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { RemoteImageModel, SupportedImageModels } = require("../controller/RemoteImageModel");
const { RemoteSpeechModel } = require("../controller/RemoteSpeechModel");
const { SupportedLangModels } = require('../controller/RemoteLanguageModel');
const ImageModelInput = require("../model/input/ImageModelInput");
const Text2SpeechInput = require("../model/input/Text2SpeechInput");
const { Chatbot, SupportedChatModels } = require("../function/Chatbot");
const {
  ChatGPTInput,
  AnthropicInput,
  GeminiInput,
  MistralInput,
  CohereInput,
  NvidiaInput,
  VLLMInput,
  OpenAICompatibleInput
} = require("../model/input/ChatModelInput");
const SystemHelper = require("../utils/SystemHelper");
const Prompt = require("../utils/Prompt");
const FileHelper = require("../utils/FileHelper");
const path = require('path');
const config = require('../config.json');
const { isReasoningModel } = require('../utils/ModelHelper');
const { stripThinking, extractBlocks, extractCode, extractMarkdown, parseJson, extractSvg } = require('../utils/OutputParser');

const DEFAULT_OPENAI_MODEL = config.url.openai.models.chat;
const DEFAULT_SYSTEM = 'You are a helpful assistant.';

// The chat input class of every provider Gen can talk to through the Chatbot.
const CHAT_INPUTS = {
  [SupportedChatModels.OPENAI]: ChatGPTInput,
  [SupportedChatModels.ANTHROPIC]: AnthropicInput,
  [SupportedChatModels.GEMINI]: GeminiInput,
  [SupportedChatModels.VERTEX]: GeminiInput,
  [SupportedChatModels.MISTRAL]: MistralInput,
  [SupportedChatModels.COHERE]: CohereInput,
  [SupportedChatModels.NVIDIA]: NvidiaInput,
  [SupportedChatModels.VLLM]: VLLMInput,
  // OpenAI-compatible services share one chat-completions input
  [SupportedChatModels.OPENAI_COMPATIBLE]: OpenAICompatibleInput,
  [SupportedChatModels.OPENROUTER]: OpenAICompatibleInput,
  [SupportedChatModels.GROQ]: OpenAICompatibleInput,
  [SupportedChatModels.DEEPSEEK]: OpenAICompatibleInput,
  [SupportedChatModels.XAI]: OpenAICompatibleInput,
  [SupportedChatModels.TOGETHER]: OpenAICompatibleInput,
  [SupportedChatModels.OLLAMA]: OpenAICompatibleInput,
  [SupportedChatModels.LMSTUDIO]: OpenAICompatibleInput,
};

// Providers whose models (e.g. DeepSeek, local reasoning models) can return <think> reasoning inline;
// the other providers separate it already.
const INLINE_REASONING_PROVIDERS = new Set([
  SupportedChatModels.NVIDIA, SupportedChatModels.VLLM, SupportedChatModels.OPENAI_COMPATIBLE,
  SupportedChatModels.OPENROUTER, SupportedChatModels.GROQ, SupportedChatModels.DEEPSEEK, SupportedChatModels.XAI,
  SupportedChatModels.TOGETHER, SupportedChatModels.OLLAMA, SupportedChatModels.LMSTUDIO,
]);

// Chatbot options that Gen passes straight through from options.
const CHATBOT_OPTION_KEYS = ['baseUrl', 'headers', 'timeout', 'retries', 'retryDelay', 'signal',
  // Gemini on Vertex AI
  'vertex', 'projectId', 'location', 'accessToken', 'credentials', 'apiVersion', 'quotaProjectId'];

function chatbotOptionsFrom(options) {
  const chatbotOptions = {};
  for (const key of CHATBOT_OPTION_KEYS) {
    if (options[key] !== undefined) chatbotOptions[key] = options[key];
  }
  return chatbotOptions;
}

// Output token budgets for the generation use cases (ignored for OpenAI reasoning models).
const TOKENS = { short: 1200, medium: 4000, long: 8000, page: 12000 };

// Output floors for providers whose input class default cap is too small once adaptive thinking counts toward it.
const MAX_TOKEN_FLOORS = {
  [SupportedChatModels.ANTHROPIC]: 16000,
};

// Gen's own token budgets never undercut a provider floor; a caller's options.maxTokens is used as given.
function budgetFor(provider, tokens) {
  return Math.max(tokens, MAX_TOKEN_FLOORS[provider] || 0);
}

function buildChatInput(provider, system, options) {
  const InputClass = CHAT_INPUTS[provider];
  if (!InputClass) {
    throw new Error(`Unsupported provider '${provider}'. Use one of: ${Object.keys(CHAT_INPUTS).join(', ')}`);
  }
  const inputOptions = {
    ...(options.model && { model: options.model }),
    ...(options.responseSchema && { responseSchema: options.responseSchema }),
    ...(options.responseFormat && { responseFormat: options.responseFormat }),
  };
  // reasoning models (gpt-5+) spend output tokens on thinking, so only cap and tune the other models
  const reasoning = provider === SupportedChatModels.OPENAI && isReasoningModel(options.model || DEFAULT_OPENAI_MODEL);
  if (!reasoning) {
    const maxTokens = options.maxTokens || MAX_TOKEN_FLOORS[provider];
    if (maxTokens) inputOptions.maxTokens = maxTokens;
    if (options.temperature != null) inputOptions.temperature = options.temperature;
  }
  return new InputClass(system, inputOptions);
}

// The legacy functions take an OpenAI model name positionally. Released versions always used the default NVIDIA
// model (the name only picked the token budget), and an OpenAI model name is never sent to another provider.
function resolveLegacyModel(provider, modelName) {
  if (provider === SupportedChatModels.OPENAI) return modelName || null;
  if (provider === SupportedChatModels.NVIDIA) return null;
  if (!modelName || /^(gpt-|o\d|chatgpt-)/i.test(modelName)) return null;
  return modelName;
}

function legacyTokenSize(modelName, base) {
  const name = modelName || '';
  if (name.includes('-16k')) return 8000;
  if (name.includes('gpt-4o')) return 12000;
  if (name.includes('gpt-4')) return base;
  if (name.includes('deepseek')) return 15000;
  return 8000;
}

// The released page functions parsed with JSON.parse, so an unusable answer still rejects with a SyntaxError.
function parseLegacyPage(text, allowArray) {
  let value;
  try {
    value = parseJson(text, allowArray ? null : 'object');
  } catch (error) {
    throw new SyntaxError(error.message);
  }
  const page = Array.isArray(value) ? value[0] : value;
  if (!page || typeof page !== 'object' || typeof page.html !== 'string') {
    throw new SyntaxError(`The model response is not a JSON object with an html field: ${String(text).trim().slice(0, 200)}`);
  }
  return value;
}

function quoteBlock(title, content, language = '') {
  return content ? `${title}\n\`\`\`${language}\n${content}\n\`\`\`\n` : '';
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Scalar meta values; an array (e.g. several og:image URLs) becomes one tag per value.
function metaValues(content) {
  return (Array.isArray(content) ? content : [content]).filter((value) => value != null && typeof value !== 'object');
}

// Render <title>, <meta> and JSON-LD tags from the parsed SEO fields (safer than asking the model for HTML inside JSON).
function renderSeoHtml(meta) {
  const lines = [`<title>${escapeHtml(meta.title)}</title>`];
  if (meta.description) lines.push(`<meta name="description" content="${escapeHtml(meta.description)}">`);
  if (Array.isArray(meta.keywords) && meta.keywords.length) {
    lines.push(`<meta name="keywords" content="${escapeHtml(meta.keywords.join(', '))}">`);
  }
  for (const [property, content] of Object.entries(meta.openGraph || {})) {
    for (const value of metaValues(content)) {
      lines.push(`<meta property="${escapeHtml(property)}" content="${escapeHtml(value)}">`);
    }
  }
  for (const [name, content] of Object.entries(meta.twitter || {})) {
    for (const value of metaValues(content)) {
      lines.push(`<meta name="${escapeHtml(name)}" content="${escapeHtml(value)}">`);
    }
  }
  if (meta.jsonLd) {
    lines.push(`<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`);
  }
  return lines.join('\n');
}

/**
 * "code block + json block" answers. The details block is the last json block whose content has the expected shape
 * (so fixed code that is itself JSON is not mistaken for it); the code is the block tagged `language`, otherwise
 * the longest remaining block.
 */
function parseCodeWithDetails(text, codeKey, language, isDetails) {
  const blocks = extractBlocks(text);
  let detailsBlock = null;
  let details = null;
  for (const block of blocks.filter((candidate) => candidate.lang === 'json').reverse()) {
    try {
      const parsed = parseJson(block.code);
      if (isDetails(parsed)) {
        detailsBlock = block;
        details = parsed;
        break;
      }
    } catch (error) {
      // not the details block
    }
  }
  const codeBlocks = blocks.filter((block) => block !== detailsBlock);
  const preferred = language ? codeBlocks.find((block) => block.lang === language) : null;
  const codeBlock = preferred || codeBlocks.reduce((best, block) => (!best || block.code.length > best.code.length ? block : best), null);
  return { [codeKey]: codeBlock ? codeBlock.code : extractCode(text, language), details: details || {} };
}

const FRAMEWORK_LABELS = {
  html: 'plain HTML, CSS and JavaScript (one self-contained .html file)',
  react: 'React (function component with hooks)',
  vue: 'Vue 3 (single-file component with <script setup>)',
  svelte: 'Svelte (single-file component)',
  angular: 'Angular (standalone component)',
};

const STYLE_FORMATS = {
  css: 'plain CSS',
  scss: 'SCSS',
  tailwind: 'HTML markup styled with Tailwind CSS utility classes (return the markup with the classes applied)',
};

const PYTHON_FRAMEWORKS = /^(flask|fastapi|django|pytest|unittest)/i;
const JAVASCRIPT_REGEX_ENGINES = /^(javascript|js|typescript|ts|node(\.?js)?)$/i;

// ---------------------------------------------------------------------
// OpenAPI normalisation
// ---------------------------------------------------------------------

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

function operationIdFor(method, pathKey) {
  const words = `${method} ${pathKey}`.split(/[^A-Za-z0-9]+/).filter(Boolean);
  return words.map((word, index) => (index === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1))).join('');
}

function resolveRef(doc, ref) {
  return ref.slice(2).split('/').reduce(
    (node, part) => (node == null ? undefined : node[part.replace(/~1/g, '/').replace(/~0/g, '~')]), doc);
}

function collectRefs(node, refs = new Set()) {
  if (Array.isArray(node)) {
    node.forEach((item) => collectRefs(item, refs));
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (key === '$ref' && typeof value === 'string') refs.add(value);
      else collectRefs(value, refs);
    }
  }
  return refs;
}

// Make a model-written OpenAPI document internally consistent so Swagger UI and code generators accept it.
function normalizeOpenApi(doc, options = {}) {
  if (!doc || typeof doc !== 'object' || Array.isArray(doc) || !doc.paths || typeof doc.paths !== 'object') {
    throw new Error('Gen: the model did not return an OpenAPI document with paths.');
  }
  const trimmedBase = options.basePath ? String(options.basePath).replace(/^\/+|\/+$/g, '') : '';
  const basePath = trimmedBase ? `/${trimmedBase}` : '';
  const info = doc.info || {};
  const result = {
    ...doc,
    openapi: options.openapiVersion || '3.1.0',
    info: { ...info, title: options.title || info.title || 'Generated API', version: options.version || info.version || '1.0.0' },
    paths: {},
  };
  if (options.serverUrl) result.servers = [{ url: options.serverUrl }];

  // a { $ref } parameter is resolved so its name and location count as declared
  const parameterInfo = (param) => {
    if (param && typeof param.$ref === 'string') {
      const target = param.$ref.startsWith('#/') ? resolveRef(doc, param.$ref) : undefined;
      return target && typeof target === 'object' ? target : null;
    }
    return param && typeof param === 'object' ? param : null;
  };

  const usedIds = new Set();
  for (const [rawPath, rawItem] of Object.entries(doc.paths)) {
    if (!rawItem || typeof rawItem !== 'object') continue;
    // Express ":param" segments become "{param}"; a colon after a brace (custom methods such as {name}:cancel) is kept
    let pathKey = `/${String(rawPath).trim().replace(/^\/+/, '')}`.replace(/(^|\/):([A-Za-z_][A-Za-z0-9_]*)/g, '$1{$2}');
    if (basePath && pathKey !== basePath && !pathKey.startsWith(`${basePath}/`)) {
      pathKey = pathKey === '/' ? basePath : `${basePath}${pathKey}`;
    }
    const templateParams = [...pathKey.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
    // inline path parameters must match a template segment and are always required
    const fixParameters = (parameters) => (Array.isArray(parameters) ? parameters : [])
      .filter((param) => !(param && !param.$ref && param.in === 'path' && !templateParams.includes(param.name)))
      .map((param) => (param && !param.$ref && param.in === 'path' ? { ...param, required: true } : param));

    // when two raw keys normalise to the same path, the first definition of each field and method wins
    const item = { ...(result.paths[pathKey] || {}) };
    for (const [key, value] of Object.entries(rawItem)) {
      if (!HTTP_METHODS.includes(key.toLowerCase()) && !(key in item)) item[key] = value;
    }
    if (Array.isArray(item.parameters)) item.parameters = fixParameters(item.parameters);
    const pathLevelParams = Array.isArray(item.parameters) ? item.parameters : [];

    for (const [key, value] of Object.entries(rawItem)) {
      const method = key.toLowerCase();
      if (!HTTP_METHODS.includes(method) || !value || typeof value !== 'object' || item[method]) continue;
      const operation = { ...value };
      if (method === 'get' || method === 'delete') delete operation.requestBody;
      if (!operation.responses || typeof operation.responses !== 'object' || Object.keys(operation.responses).length === 0) {
        operation.responses = { 200: { description: 'Successful response' } };
      }
      const parameters = fixParameters(operation.parameters);
      const declared = new Set([...pathLevelParams, ...parameters]
        .map(parameterInfo)
        .filter((param) => param && param.in === 'path')
        .map((param) => param.name));
      for (const name of templateParams.filter((param) => !declared.has(param))) {
        parameters.push({ name, in: 'path', required: true, schema: { type: 'string' } });
      }
      if (parameters.length) operation.parameters = parameters;
      else delete operation.parameters;

      const base = operation.operationId || operationIdFor(method, pathKey);
      let id = base;
      for (let n = 2; usedIds.has(id); n++) id = `${base}${n}`;
      operation.operationId = id;
      usedIds.add(id);
      item[method] = operation;
    }
    result.paths[pathKey] = item;
  }

  // a dangling component reference breaks Swagger UI and code generators, so give it a placeholder schema
  for (const ref of collectRefs(result)) {
    if (!ref.startsWith('#/') || resolveRef(result, ref) !== undefined) continue;
    const match = /^#\/components\/schemas\/([^/]+)$/.exec(ref);
    if (!match) {
      throw new Error(`Gen: the OpenAPI document references ${ref}, which it does not define.`);
    }
    const name = match[1].replace(/~1/g, '/').replace(/~0/g, '~');
    result.components = { ...(result.components || {}) };
    result.components.schemas = {
      ...(result.components.schemas || {}),
      [name]: { type: 'object', description: 'Referenced by the API; the model did not define this schema.' },
    };
  }
  return result;
}

// ---------------------------------------------------------------------
// Design token normalisation
// ---------------------------------------------------------------------

const TOKEN_SCALES = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'];
const TOKEN_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const TOKEN_ROLES = [
  'background', 'foreground', 'muted', 'muted-foreground', 'primary', 'primary-foreground', 'secondary',
  'secondary-foreground', 'accent', 'border', 'ring', 'danger', 'danger-foreground',
];
const CONTRAST_PAIRS = [
  ['foreground', 'background'], ['muted-foreground', 'background'], ['primary-foreground', 'primary'], ['danger-foreground', 'danger'],
];
const NAMED_COLORS = {
  white: '#ffffff', black: '#000000', red: '#ff0000', green: '#008000', blue: '#0000ff', gray: '#808080', grey: '#808080',
  silver: '#c0c0c0', navy: '#000080', teal: '#008080', purple: '#800080', orange: '#ffa500', yellow: '#ffff00',
};

function toHex(red, green, blue) {
  // the epsilon absorbs floating point error on exact .5 channels, so they round up like browsers do
  return `#${[red, green, blue].map((channel) => Math.max(0, Math.min(255, Math.round(channel + 1e-9))).toString(16).padStart(2, '0')).join('')}`;
}

function hslToRgb(hue, saturation, lightness) {
  const h = (((hue % 360) + 360) % 360) / 360;
  const s = saturation / 100;
  const l = lightness / 100;
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [channel(h + 1 / 3) * 255, channel(h) * 255, channel(h - 1 / 3) * 255];
}

function parseAlpha(value) {
  if (value === undefined) return 1;
  const text = String(value).trim();
  return text.endsWith('%') ? Number(text.slice(0, -1)) / 100 : Number(text);
}

/**
 * Normalise a color to a lowercase six digit hex. Unsupported formats throw. Tokens are opaque, so a translucent
 * color keeps its RGB value and a warning is added when a warnings list is given.
 */
function normalizeColor(value, key, warnings = null) {
  const text = String(value).trim().toLowerCase();
  let hex = null;
  let alpha = 1;
  let match;
  if ((match = /^#([0-9a-f]{3})([0-9a-f])?$/.exec(text))) {
    hex = `#${match[1].split('').map((digit) => digit + digit).join('')}`;
    if (match[2]) alpha = parseInt(match[2] + match[2], 16) / 255;
  } else if ((match = /^#([0-9a-f]{6})([0-9a-f]{2})?$/.exec(text))) {
    hex = `#${match[1]}`;
    if (match[2]) alpha = parseInt(match[2], 16) / 255;
  } else if ((match = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/.exec(text))) {
    hex = toHex(Number(match[1]), Number(match[2]), Number(match[3]));
    alpha = parseAlpha(match[4]);
  } else if ((match = /^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/.exec(text))) {
    hex = toHex(...hslToRgb(Number(match[1]), Number(match[2]), Number(match[3])));
    alpha = parseAlpha(match[4]);
  } else if (NAMED_COLORS[text]) {
    hex = NAMED_COLORS[text];
  }
  if (!hex) {
    throw new Error(`Gen: unsupported color "${value}" at ${key}; expected a hex, rgb() or hsl() color.`);
  }
  if (alpha < 1 && warnings) {
    warnings.push(`${key} was the translucent color ${value}; tokens are opaque, so the transparency was dropped (${hex}).`);
  }
  return hex;
}

function relativeLuminance(hex) {
  const [red, green, blue] = [1, 3, 5]
    .map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first, second) {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function buildTokenCss(palette, semantic, radius, modes, prefix) {
  const declarations = (entries, indent = '  ') => entries.map(([name, value]) => `${indent}--${name}: ${value};`).join('\n');
  const rootEntries = [];
  for (const [scaleName, scaleSteps] of Object.entries(palette)) {
    for (const [step, value] of Object.entries(scaleSteps)) rootEntries.push([`${prefix}-${scaleName}-${step}`, value]);
  }
  for (const [size, value] of Object.entries(radius)) rootEntries.push([`radius-${size}`, value]);
  rootEntries.push(...Object.entries(semantic[modes[0]]));

  const blocks = [`:root {\n${declarations(rootEntries)}\n}`];
  for (const mode of modes.slice(1)) {
    const entries = Object.entries(semantic[mode]);
    blocks.push(`[data-theme="${mode}"] {\n${declarations(entries)}\n}`);
    if (mode === 'dark') {
      // only when no theme is chosen explicitly, so a selected data-theme always wins
      blocks.push(`@media (prefers-color-scheme: dark) {\n  :root:not([data-theme]) {\n${declarations(entries, '    ')}\n  }\n}`);
    }
  }
  return blocks.join('\n\n');
}

function buildTailwindTheme(palette, semantic, typography, radius, spacing, modes) {
  const colors = {};
  for (const [scaleName, scaleSteps] of Object.entries(palette)) colors[scaleName] = { ...scaleSteps };
  const roles = Object.keys(semantic[modes[0]]);
  for (const role of roles.filter((name) => !name.endsWith('-foreground'))) {
    colors[role] = { ...(colors[role] || {}), DEFAULT: `var(--${role})` };
  }
  for (const role of roles.filter((name) => name.endsWith('-foreground'))) {
    const base = role.slice(0, -'-foreground'.length);
    colors[base] = { ...(colors[base] || {}), foreground: `var(--${role})` };
  }
  const extend = { colors, borderRadius: { ...radius } };
  if (typography && typography.fontFamily) extend.fontFamily = { ...typography.fontFamily };
  if (typography && typography.fontSize) extend.fontSize = { ...typography.fontSize };
  if (spacing) extend.spacing = { ...spacing };
  return { theme: { extend } };
}

// Validate and complete model-written design tokens; syntax (hex, CSS, Tailwind) is produced by the library.
function normalizeDesignTokens(raw, options) {
  if (!raw || typeof raw !== 'object' || !raw.palette || typeof raw.palette !== 'object') {
    throw new Error('Gen: the model did not return design tokens with a palette.');
  }
  const modes = options.modes;
  const warnings = [];

  const palette = {};
  const missingSteps = [];
  for (const scaleName of TOKEN_SCALES) {
    palette[scaleName] = {};
    for (const step of TOKEN_STEPS) {
      const value = raw.palette[scaleName] && raw.palette[scaleName][step];
      if (value == null || value === '') {
        missingSteps.push(`${scaleName}.${step}`);
      } else {
        palette[scaleName][step] = normalizeColor(value, `palette.${scaleName}.${step}`, warnings);
      }
    }
  }
  if (missingSteps.length) {
    throw new Error(`Gen: the design tokens are missing palette steps: ${missingSteps.join(', ')}`);
  }
  if (options.brandColor) {
    const brand = normalizeColor(options.brandColor, 'options.brandColor');
    if (palette.primary['500'] !== brand) {
      warnings.push(`primary.500 was ${palette.primary['500']} and was set to the brand color ${brand}.`);
      palette.primary['500'] = brand;
    }
  }

  const resolve = (value, key) => {
    const reference = /^\s*([a-z]+)[.-](\d{2,3})\s*$/i.exec(String(value));
    if (reference) {
      const scaleSteps = palette[reference[1].toLowerCase()];
      if (scaleSteps && scaleSteps[reference[2]]) return scaleSteps[reference[2]];
    }
    return normalizeColor(value, key, warnings);
  };

  const semantic = {};
  const missingRoles = [];
  for (const mode of modes) {
    const source = (raw.semantic && raw.semantic[mode]) || {};
    semantic[mode] = {};
    for (const role of TOKEN_ROLES) {
      if (source[role] == null || source[role] === '') {
        missingRoles.push(`${mode}.${role}`);
      } else {
        semantic[mode][role] = resolve(source[role], `semantic.${mode}.${role}`);
      }
    }
  }
  if (missingRoles.length) {
    throw new Error(`Gen: the design tokens are missing semantic roles: ${missingRoles.join(', ')}`);
  }

  const contrast = [];
  for (const mode of modes) {
    for (const [foreground, background] of CONTRAST_PAIRS) {
      const exact = contrastRatio(semantic[mode][foreground], semantic[mode][background]);
      // WCAG compares the exact ratio; the reported value is truncated so it never looks like a pass when it is not
      const ratio = Math.floor(exact * 100) / 100;
      contrast.push({ mode, pair: `${foreground}/${background}`, ratio, aa: exact >= 4.5 });
      if (exact < 4.5) {
        warnings.push(`${mode}: ${foreground} on ${background} has a contrast of ${ratio}:1, below WCAG AA (4.5:1).`);
      }
    }
  }

  const typography = options.includeTypography === false ? null : (raw.typography || null);
  const spacing = options.includeSpacing === false ? null : (raw.spacing || null);
  const radius = { sm: '0.25rem', md: '0.5rem', lg: '1rem', full: '9999px', ...(raw.radius || {}) };
  return {
    name: raw.name || 'Design tokens',
    palette,
    semantic,
    typography,
    radius,
    spacing,
    contrast,
    css: buildTokenCss(palette, semantic, radius, modes, options.cssPrefix || 'color'),
    tailwind: buildTailwindTheme(palette, semantic, typography, radius, spacing, modes),
    warnings,
  };
}

class Gen {
  /**
   * One call to any chat provider. Returns the model text; for providers that return reasoning inline
   * (nvidia, vllm) the leading <think> block is removed.
   *
   * @param {string} prompt - the user message.
   * @param {string} apiKey - the provider key.
   * @param {string} provider - openai, anthropic, gemini, mistral, cohere, nvidia, vllm, or an OpenAI-compatible
   *   service: openrouter, groq, deepseek, xai, together, ollama, lmstudio, openai_compatible (with options.baseUrl).
   * @param {object} options - { system, model, maxTokens, temperature, customProxyHelper, baseUrl, headers,
   *   timeout, retries, retryDelay, signal }.
   */
  static async generate_text(prompt, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const input = buildChatInput(provider, options.system || DEFAULT_SYSTEM, options);
    input.addUserMessage(prompt);

    const chatbot = new Chatbot(apiKey, provider, options.customProxyHelper || null, chatbotOptionsFrom(options));
    const responses = await chatbot.chat(input);

    const first = responses[0];
    const text = typeof first === 'string' ? first : (first && first.content) || '';
    return INLINE_REASONING_PROVIDERS.has(provider) ? stripThinking(text) : String(text).trim();
  }

  /**
   * One call that returns parsed JSON. With a JSON Schema the provider's structured output is used (OpenAI,
   * Anthropic, Gemini, Mistral, Cohere and compatible services), so the reply matches the schema; without one the
   * model is asked for JSON and the reply is parsed even when it is wrapped in prose or fences.
   *
   * @param {string} prompt - the user message.
   * @param {object|null} schema - a JSON Schema for the reply, or null for free-form JSON.
   * @param {string} apiKey - the provider key.
   * @param {string} provider - any provider accepted by generate_text.
   * @param {object} options - the generate_text options.
   */
  static async generate_json(prompt, schema, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const text = await Gen.generate_text(prompt, apiKey, provider, {
      ...options,
      ...(schema ? { responseSchema: schema } : { responseFormat: 'json' }),
      system: options.system || 'You are a helpful assistant that replies with JSON.',
    });
    if (!text) {
      throw new Error(`Gen: empty response from ${provider}. The output budget may have been spent before any text was produced; raise options.maxTokens.`);
    }
    const kind = schema && (schema.type === 'array' ? 'array' : schema.type === 'object' ? 'object' : null);
    return parseJson(text, kind || null);
  }

  // Fill a prompt template, call the provider and parse the output as text, markdown, code, json or svg.
  static async _generate(templateName, variables, apiKey, provider, options = {}, settings = {}) {
    const template = new SystemHelper().loadPrompt(templateName);
    const prompt = new Prompt(template).format(variables);
    const defaults = settings.defaults && settings.defaults.maxTokens
      ? { ...settings.defaults, maxTokens: budgetFor(provider, settings.defaults.maxTokens) }
      : settings.defaults;
    const text = await Gen.generate_text(prompt, apiKey, provider, {
      ...defaults,
      ...options,
      system: options.system || settings.system || DEFAULT_SYSTEM,
    });

    if (!text && !settings.legacy) {
      const model = options.model ? ` (${options.model})` : '';
      throw new Error(`Gen: empty response from ${provider}${model}. The output budget may have been spent before any text was produced; raise options.maxTokens.`);
    }

    if (typeof settings.parse === 'function') {
      return settings.parse(text);
    }
    switch (settings.parse) {
      case 'json': return parseJson(text, settings.kind || null);
      case 'code': return extractCode(text, settings.language || null);
      case 'markdown': return extractMarkdown(text);
      case 'svg': return extractSvg(text);
      default: return text;
    }
  }

  // ---------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------

  // Marketing description generation
  static async get_marketing_desc(promptString, apiKey, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    return Gen.generate_text(`Create a marketing description for the following: ${promptString}`, apiKey, provider, {
      system: 'generate marketing description',
      maxTokens: budgetFor(provider, 800),
      ...(provider === SupportedChatModels.NVIDIA && { temperature: 0.6 }),
      customProxyHelper,
    });
  }

  // Blog post generation
  static async get_blog_post(promptString, apiKey, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    return Gen.generate_text(`Write a blog post with section titles about ${promptString}`, apiKey, provider, {
      system: 'generate blog post',
      maxTokens: budgetFor(provider, 1200),
      ...(provider === SupportedChatModels.NVIDIA && { temperature: 0.6 }),
      customProxyHelper,
    });
  }

  // Image description
  static async getImageDescription(promptString, apiKey, customProxyHelper = null, provider = SupportedChatModels.OPENAI) {
    return Gen.generate_text(`Generate image description from the following text: ${promptString}`, apiKey, provider,
      { system: 'Generate image description', customProxyHelper });
  }

  // Generate image from description
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

  // Speech synthesis
  static async generate_speech_synthesis(text, googleKey) {
    const speechModel = new RemoteSpeechModel(googleKey, "google");
    const input = new Text2SpeechInput({ text: text, language: "en-gb" });
    return await speechModel.generateSpeech(input);
  }

  /** Landing page copy: { headline, subheadline, features, cta, socialProof, faq }. options: { featureCount, tone }. */
  static async generate_landing_copy(product, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('landing_copy', {
      text: product,
      feature_count: options.featureCount || 3,
      tone: options.tone || 'professional',
    }, apiKey, provider, options, { parse: 'json', kind: 'object', defaults: { maxTokens: TOKENS.medium } });
  }

  /** FAQ list: [{ question, answer }]. options: { count, tone }. */
  static async generate_faq(topic, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('faq', {
      text: topic,
      count: options.count || 5,
      tone: options.tone || 'friendly and professional',
    }, apiKey, provider, options, { parse: 'json', kind: 'array', defaults: { maxTokens: TOKENS.medium } });
  }

  /** SEO metadata: { title, description, keywords, openGraph, twitter, jsonLd, html }. options: { url, siteName }. */
  static async generate_seo_meta(pageDescription, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const meta = await Gen._generate('seo_meta', {
      text: pageDescription,
      url: options.url || 'https://example.com/',
      site_name: options.siteName || 'the website',
    }, apiKey, provider, options, { parse: 'json', kind: 'object', defaults: { maxTokens: TOKENS.medium } });
    return { ...meta, html: renderSeoHtml(meta) };
  }

  /**
   * Translate a UI strings object (or JSON string) keeping keys and placeholders.
   * options: { targetLanguage (required), sourceLanguage }.
   */
  static async translate_ui_strings(strings, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    if (!options.targetLanguage) {
      throw new Error("translate_ui_strings requires options.targetLanguage, e.g. { targetLanguage: 'es' }");
    }
    const text = typeof strings === 'string' ? strings : JSON.stringify(strings, null, 2);
    return Gen._generate('translate_strings', {
      text,
      source_language: options.sourceLanguage || 'the source language',
      target_language: options.targetLanguage,
    }, apiKey, provider, options, { parse: 'json', kind: 'object', defaults: { maxTokens: TOKENS.long, temperature: 0.2 } });
  }

  /** Release notes in Markdown. options: { version }. */
  static async generate_release_notes(changes, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('release_notes', {
      text: changes,
      version: options.version || 'Unreleased',
    }, apiKey, provider, options, { parse: 'markdown', defaults: { maxTokens: TOKENS.medium } });
  }

  /** README.md content in Markdown for a project description. */
  static async generate_readme(projectDescription, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('readme', { text: projectDescription }, apiKey, provider, options,
      { parse: 'markdown', defaults: { maxTokens: TOKENS.long } });
  }

  // ---------------------------------------------------------------------
  // Frontend
  // ---------------------------------------------------------------------

  // Generate HTML page
  static async generate_html_page(text, apiKey, model_name = DEFAULT_OPENAI_MODEL, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    return Gen._generate('html_page', { text }, apiKey, provider, {
      model: resolveLegacyModel(provider, model_name),
      maxTokens: budgetFor(provider, legacyTokenSize(model_name, 4000)),
      temperature: 0.8,
      customProxyHelper,
    }, {
      parse: (answer) => parseLegacyPage(answer, false),
      legacy: true,
      system: 'generate html, css and javascript. Follow this template: {"html": "<code>", "message":"<text>"}',
    });
  }

  // Save HTML page (calls generate_html_page)
  static async save_html_page(text, folder, file_name, apiKey, model_name = DEFAULT_OPENAI_MODEL, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    const htmlCode = await Gen.generate_html_page(text, apiKey, model_name, provider, customProxyHelper);
    const folderPath = path.join(folder, file_name + '.html');
    FileHelper.writeDataToFile(folderPath, htmlCode['html']);
    return true;
  }

  // Generate dashboard
  static async generate_dashboard(csvStrData, topic, apiKey, model_name = DEFAULT_OPENAI_MODEL, num_graphs = 1, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    if (num_graphs < 1 || num_graphs > 4) {
      throw new Error('num_graphs must be between 1 and 4.');
    }
    const result = await Gen._generate('graph_dashboard', { count: num_graphs, topic, text: csvStrData }, apiKey, provider, {
      model: resolveLegacyModel(provider, model_name),
      maxTokens: budgetFor(provider, legacyTokenSize(model_name, 3900)),
      temperature: 0.3,
      customProxyHelper,
    }, {
      parse: (answer) => parseLegacyPage(answer, true),
      legacy: true,
      system: 'Generate HTML graphs from CSV data. Response must be valid JSON with full HTML code.',
    });
    return Array.isArray(result) ? result[0] : result;
  }

  /**
   * UI component source code. options: { framework: react|vue|svelte|angular|html, language: javascript|typescript,
   * styling: css|tailwind|css-modules|styled-components }.
   */
  static async generate_component(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const framework = options.framework || 'react';
    return Gen._generate('component', {
      text: description,
      framework: FRAMEWORK_LABELS[framework] || framework,
      language: options.language || (framework === 'angular' ? 'typescript' : 'javascript'),
      styling: options.styling || 'css',
    }, apiKey, provider, options, { parse: 'code', defaults: { maxTokens: TOKENS.long, temperature: 0.2 } });
  }

  /** Form with client-side validation. options: { framework: html|react|vue|svelte, action (URL to POST the values to) }. */
  static async generate_form(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const framework = options.framework || 'html';
    return Gen._generate('form', {
      text: description,
      framework: FRAMEWORK_LABELS[framework] || framework,
      submit: options.action
        ? `On submit, POST the values as JSON to ${options.action} and show the result to the user.`
        : 'On submit, prevent the default action and log the collected values as JSON.',
    }, apiKey, provider, options, { parse: 'code', defaults: { maxTokens: TOKENS.long, temperature: 0.2 } });
  }

  /** A page section (hero, pricing, features, testimonials, footer, ...). options: { sectionType, styling }. */
  static async generate_page_section(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('page_section', {
      text: description,
      section_type: options.sectionType || 'hero',
      styling: options.styling === 'tailwind' ? 'Tailwind CSS utility classes' : 'plain CSS',
    }, apiKey, provider, options, { parse: 'code', defaults: { maxTokens: TOKENS.long, temperature: 0.3 } });
  }

  /** Stylesheet or Tailwind markup. options: { format: css|scss|tailwind, html (markup to style) }. */
  static async generate_css(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const format = options.format || 'css';
    return Gen._generate('styles', {
      text: description,
      format: STYLE_FORMATS[format] || format,
      html_section: quoteBlock('Target this HTML markup:', options.html, 'html'),
    }, apiKey, provider, options, { parse: 'code', defaults: { maxTokens: TOKENS.medium, temperature: 0.2 } });
  }

  /** Accessibility fixes: { html, issues: [{ issue, fix, wcag }] }. */
  static async improve_accessibility(html, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('accessibility', { text: html }, apiKey, provider, options, {
      defaults: { maxTokens: TOKENS.long, temperature: 0.1 },
      parse: (text) => {
        const isDetails = (value) => Array.isArray(value) || Boolean(value && Array.isArray(value.issues));
        const { html: fixed, details } = parseCodeWithDetails(text, 'html', 'html', isDetails);
        return { html: fixed, issues: Array.isArray(details) ? details : (details.issues || []) };
      },
    });
  }

  /** Responsive, email-client-safe HTML email. */
  static async generate_email_template(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('email_template', { text: description }, apiKey, provider, options,
      { parse: 'code', language: 'html', defaults: { maxTokens: TOKENS.long, temperature: 0.3 } });
  }

  /** SVG icon markup. options: { size, style: outline|filled }. */
  static async generate_svg_icon(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('svg_icon', {
      text: description,
      size: options.size || 24,
      style: options.style === 'filled' ? 'filled (solid shapes)' : 'outline (stroke based, stroke-width 2, round line caps)',
    }, apiKey, provider, options, { parse: 'svg', defaults: { maxTokens: TOKENS.short, temperature: 0.2 } });
  }

  /** Color palette: { name, colors: [{ name, hex, usage }], css }. options: { count }. */
  static async generate_color_palette(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('color_palette', { text: description, count: options.count || 6 }, apiKey, provider, options,
      { parse: 'json', kind: 'object', defaults: { maxTokens: TOKENS.short } });
  }

  // ---------------------------------------------------------------------
  // Backend and developer workflow
  // ---------------------------------------------------------------------

  /**
   * API endpoint source. options: { framework: express|fastify|nextjs|koa|hono|flask|fastapi, language }.
   * The language defaults to python for flask, fastapi and django, otherwise javascript.
   */
  static async generate_api_endpoint(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const framework = options.framework || 'Express';
    return Gen._generate('api_endpoint', {
      text: description,
      framework,
      language: options.language || (PYTHON_FRAMEWORKS.test(framework) ? 'python' : 'javascript'),
    }, apiKey, provider, options, { parse: 'code', defaults: { maxTokens: TOKENS.medium, temperature: 0.2 } });
  }

  /** SQL statements. options: { dialect: postgresql|mysql|sqlite|sqlserver, schema (existing tables) }. */
  static async generate_sql(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('sql', {
      text: description,
      dialect: options.dialect || 'PostgreSQL',
      schema_section: quoteBlock('Existing schema:', options.schema, 'sql'),
    }, apiKey, provider, options, { parse: 'code', language: 'sql', defaults: { maxTokens: TOKENS.medium, temperature: 0.1 } });
  }

  /** JSON Schema (draft 2020-12) object for a data description. */
  static async generate_json_schema(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('json_schema', { text: description }, apiKey, provider, options,
      { parse: 'json', kind: 'object', defaults: { maxTokens: TOKENS.medium, temperature: 0.1 } });
  }

  /** Realistic mock records as an array. options: { count }. */
  static async generate_mock_data(schema, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const text = typeof schema === 'string' ? schema : JSON.stringify(schema, null, 2);
    const result = await Gen._generate('mock_data', { text, count: options.count || 5 }, apiKey, provider, options,
      { parse: 'json', defaults: { maxTokens: TOKENS.long, temperature: 0.7 } });
    return Array.isArray(result) ? result : [result];
  }

  /**
   * Regular expression: { pattern, flags, explanation, matches, nonMatches, regex (RegExp), verified }.
   * verified is true when the pattern behaves as the model's own examples claim, false when it does not (or there
   * is no pattern or no example to check), and null when options.language is not JavaScript, since the check runs
   * with JavaScript regex semantics. options: { language }.
   */
  static async generate_regex(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const language = options.language || 'JavaScript';
    const result = await Gen._generate('regex', { text: description, language },
      apiKey, provider, options, { parse: 'json', kind: 'object', defaults: { maxTokens: TOKENS.short, temperature: 0.1 } });
    // a single-escaped \b is read by JSON as a backspace character; in a pattern it means a word boundary
    result.pattern = typeof result.pattern === 'string' ? result.pattern.replace(/\x08/g, '\\b') : null;
    result.matches = Array.isArray(result.matches) ? result.matches : [];
    result.nonMatches = Array.isArray(result.nonMatches) ? result.nonMatches : [];
    try {
      // g and y make test() stateful, so they are left out of the returned RegExp
      result.regex = result.pattern ? new RegExp(result.pattern, String(result.flags || '').replace(/[gy]/g, '')) : null;
    } catch (error) {
      result.regex = null;
    }
    if (!result.regex || result.matches.length + result.nonMatches.length === 0) {
      result.verified = false;
    } else if (!JAVASCRIPT_REGEX_ENGINES.test(String(language).trim())) {
      result.verified = null;
    } else {
      result.verified = result.matches.every((sample) => result.regex.test(sample))
        && result.nonMatches.every((sample) => !result.regex.test(sample));
    }
    return result;
  }

  /** Unit test file source. options: { framework: jest|vitest|mocha|pytest, modulePath }. */
  static async generate_unit_tests(code, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const framework = options.framework || 'Jest';
    return Gen._generate('unit_tests', {
      text: code,
      framework,
      module_path: options.modulePath || (PYTHON_FRAMEWORKS.test(framework) ? 'module' : './module'),
    }, apiKey, provider, options, { parse: 'code', defaults: { maxTokens: TOKENS.long, temperature: 0.2 } });
  }

  /** Code review: { summary, score, issues: [{ severity, title, description, suggestion }] }. options: { language }. */
  static async review_code(code, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('code_review', { text: code, language: options.language || '' }, apiKey, provider, options,
      { parse: 'json', kind: 'object', defaults: { maxTokens: TOKENS.medium, temperature: 0.1 } });
  }

  /** Explain code in Markdown. options: { language, audience }. */
  static async explain_code(code, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('explain_code', {
      text: code,
      language: options.language || '',
      audience: options.audience || 'junior developer',
    }, apiKey, provider, options, { parse: 'markdown', defaults: { maxTokens: TOKENS.medium } });
  }

  /** Fix a bug: { code, explanation, changes }. options: { problem (error message or description), language }. */
  static async fix_code(code, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const language = options.language ? String(options.language).trim().toLowerCase() : null;
    return Gen._generate('fix_code', {
      text: code,
      problem: options.problem || 'the code does not work as intended',
      language: options.language || '',
    }, apiKey, provider, options, {
      defaults: { maxTokens: TOKENS.long, temperature: 0.1 },
      parse: (text) => {
        const isDetails = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
          && ('explanation' in value || 'changes' in value);
        const { code: fixed, details } = parseCodeWithDetails(text, 'code', language, isDetails);
        return { code: fixed, explanation: details.explanation || '', changes: Array.isArray(details.changes) ? details.changes : [] };
      },
    });
  }

  /** Convert code between languages or frameworks. options: { from, to }. */
  static async convert_code(code, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('convert_code', {
      text: code,
      from: options.from || 'JavaScript',
      to: options.to || 'TypeScript',
    }, apiKey, provider, options, { parse: 'code', defaults: { maxTokens: TOKENS.long, temperature: 0.1 } });
  }

  /** Commit message for a diff. options: { style: conventional|plain }. */
  static async generate_commit_message(diff, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('commit_message', {
      text: diff,
      style_rule: options.style === 'plain'
        ? 'Use an imperative, capitalized subject line without a trailing period.'
        : 'Use the Conventional Commits format for the subject: type(scope): summary, where type is one of feat, fix, docs, style, refactor, perf, test, chore, build or ci, and the summary is imperative and lowercase.',
    }, apiKey, provider, options, { parse: 'text', defaults: { maxTokens: TOKENS.short, temperature: 0.2 } });
  }

  /**
   * OpenAPI document (plain object) from route code or an API description. The library normalises it so paths use
   * {param} keys, path parameters are declared, operationIds are unique and every $ref resolves.
   * options: { title, version, openapiVersion ('3.1.0'), basePath, serverUrl }.
   */
  static async generate_openapi_spec(input, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const doc = await Gen._generate('openapi_spec', {
      text: input,
      openapi_version: options.openapiVersion || '3.1.0',
    }, apiKey, provider, options, { parse: 'json', kind: 'object', defaults: { maxTokens: TOKENS.long, temperature: 0.1 } });
    return normalizeOpenApi(doc, options);
  }

  /**
   * Design tokens: 11-step color scales, light/dark semantic roles, typography, radius and spacing, plus WCAG contrast,
   * CSS custom properties and a Tailwind theme.extend object computed by the library.
   * options: { brandColor, modes (['light', 'dark']), includeTypography, includeSpacing, cssPrefix ('color') }.
   */
  static async generate_design_tokens(input, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const modes = Array.isArray(options.modes) && options.modes.length ? options.modes : ['light', 'dark'];
    // validate the brand color before paying for a request, and give the model the normalised hex
    const brandColor = options.brandColor ? normalizeColor(options.brandColor, 'options.brandColor') : null;
    const raw = await Gen._generate('design_tokens', {
      text: input,
      brand_color_rule: brandColor
        ? `Use ${brandColor} exactly as primary 500.`
        : 'Choose a primary 500 color that fits the brand.',
      modes: modes.join(', '),
      typography_rule: options.includeTypography === false
        ? '- Set typography to null.'
        : '- typography has fontFamily with sans and mono font stacks, and fontSize from xs to 4xl as rem strings.',
      spacing_rule: options.includeSpacing === false
        ? '- Set spacing to null.'
        : '- spacing maps 1, 2, 3, 4, 6, 8, 12 and 16 to rem strings.',
    }, apiKey, provider, options, { parse: 'json', kind: 'object', defaults: { maxTokens: TOKENS.long, temperature: 0.3 } });
    return normalizeDesignTokens(raw, { ...options, brandColor, modes });
  }

  // Instruct update
  static async instructUpdate(modelOutput, userInstruction, type = '', apiKey, model_name = DEFAULT_OPENAI_MODEL, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    return Gen._generate('instruct_update', { model_output: modelOutput, user_instruction: userInstruction, type }, apiKey, provider, {
      model: resolveLegacyModel(provider, model_name),
      maxTokens: budgetFor(provider, (model_name || '').includes('gpt-4') ? 3900 : 2000),
      temperature: 0.2,
      customProxyHelper,
    }, {
      parse: 'text',
      legacy: true,
      system: 'Update the model message based on user feedback while maintaining format.',
    });
  }
}

module.exports = { Gen };

}).call(this)}).call(this,require("buffer").Buffer)
},{"../config.json":1,"../controller/RemoteImageModel":4,"../controller/RemoteLanguageModel":5,"../controller/RemoteSpeechModel":6,"../function/Chatbot":8,"../model/input/ChatModelInput":15,"../model/input/ImageModelInput":19,"../model/input/Text2SpeechInput":21,"../utils/FileHelper":54,"../utils/ModelHelper":59,"../utils/OutputParser":60,"../utils/Prompt":61,"../utils/SystemHelper":64,"buffer":25,"path":29}],10:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { RemoteEmbedModel, SupportedEmbedModels } = require('../controller/RemoteEmbedModel');
const EmbedInput = require('../model/input/EmbedInput');
const MatchHelpers = require('../utils/MatchHelpers');
const { Embedder } = require('../store/Embedder');

class SemanticSearch {
  constructor(keyValue, provider = SupportedEmbedModels.OPENAI, customProxyHelper = null) {
    this.keyValue = keyValue;
    this.provider = provider;
    this.customProxyHelper = customProxyHelper;

    this.remoteEmbedModel = new RemoteEmbedModel(keyValue, provider, customProxyHelper);
  }

  async getTopMatches(pivotItem, searchArray, numberOfMatches, modelName = null) {

      if (numberOfMatches > searchArray.length) {
        throw new Error('numberOfMatches should not be greater than the searchArray');
      }

      if (this.provider !== SupportedEmbedModels.OPENAI && this.provider !== SupportedEmbedModels.COHERE) {
        // gemini, vertex, nvidia, vllm and the OpenAI-compatible providers: one vector per text through the Embedder
        const embedder = new Embedder({ provider: this.provider, apiKey: this.keyValue, model: modelName, options: this.customProxyHelper || {} });
        const [pivotEmbedding, ...searchEmbeddings] = await embedder.embed([pivotItem, ...searchArray]);
        return this.getTopMatchesFromEmbeddings(pivotEmbedding, searchEmbeddings, numberOfMatches);
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

},{"../controller/RemoteEmbedModel":2,"../model/input/EmbedInput":16,"../store/Embedder":36,"../utils/MatchHelpers":57}],11:[function(require,module,exports){
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
},{"./SemanticSearch":10}],12:[function(require,module,exports){
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

    // chat models can wrap the JSON in a markdown code fence
    const cleaned = sentiment.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    const sentiment_output = JSON.parse(cleaned);
    return sentiment_output;
  }
}

module.exports = { TextAnalyzer };
},{"../controller/RemoteLanguageModel":5,"../model/input/LanguageModelInput":20,"../utils/SystemHelper":64}],13:[function(require,module,exports){
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
const { Assistant } = require('./function/Assistant');
// Node only: the browser bundle maps these modules to empty objects (package.json "browser")
const { CodingAgent } = require('./function/CodingAgent');
const WorkspaceToolkitModule = require('./utils/WorkspaceToolkit');
const WorkspaceToolkit = typeof WorkspaceToolkitModule === 'function' ? WorkspaceToolkitModule : undefined;

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
  VLLMInput,
  OpenAICompatibleInput
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
const { GoogleAIError, GoogleAIChatSession, GoogleAILiveSession } = GeminiAIWrapper;
const AnthropicWrapper = require('./wrappers/AnthropicWrapper');
const NvidiaWrapper = require('./wrappers/NvidiaWrapper');
const VLLMWrapper = require('./wrappers/VLLMWrapper');
const OpenAICompatibleWrapper = require('./wrappers/OpenAICompatibleWrapper');
// utils
const { LLMEvaluation } = require('./utils/LLMEvaluation');
const AudioHelper = require('./utils/AudioHelper');
const ConnHelper = require('./utils/ConnHelper');
const MatchHelpers = require('./utils/MatchHelpers');
const SystemHelper = require('./utils/SystemHelper');
const Prompt = require('./utils/Prompt');
const ProxyHelper = require('./utils/ProxyHelper');
const { GPTStreamParser, CohereStreamParser, VLLMStreamParser, AnthropicStreamParser } = require('./utils/StreamParser');
const ModelHelper = require('./utils/ModelHelper');
const ChatContext = require('./utils/ChatContext');
const MCPClient = require('./utils/MCPClient');
// Node only: the browser bundle maps this module to an empty object (package.json "browser")
const { MCPServer } = require('./mcp/server');
const FetchClient = require('./utils/FetchClient');
const OutputParser = require('./utils/OutputParser');
const TextSplitter = require('./utils/TextSplitter');
// Node only: the browser bundle maps this module to an empty object (package.json "browser")
const GoogleAuthModule = require('./utils/GoogleAuth');
const GoogleAuth = typeof GoogleAuthModule === 'function' ? GoogleAuthModule : undefined;
// stores: vector databases and chat history
const { VectorStore } = require('./store/VectorStore');
const { Embedder } = require('./store/Embedder');
const { MemoryVectorStore } = require('./store/MemoryVectorStore');
const { ChatHistory, MemoryChatHistory, FileChatHistory } = require('./store/ChatHistory');
const { FirestoreChatHistory } = require('./store/FirestoreChatHistory');
const { FirestoreVectorStore } = require('./store/FirestoreVectorStore');
const { VertexRAGStore } = require('./store/VertexRAGStore');
const { VertexVectorSearchStore, VertexVectorSearchIndexStore } = require('./store/VertexVectorSearchStore');
const { PineconeVectorStore } = require('./store/PineconeVectorStore');
const { QdrantVectorStore } = require('./store/QdrantVectorStore');
const { ChromaVectorStore } = require('./store/ChromaVectorStore');
const { WeaviateVectorStore } = require('./store/WeaviateVectorStore');
const { MilvusVectorStore } = require('./store/MilvusVectorStore');
const { ElasticsearchVectorStore } = require('./store/ElasticsearchVectorStore');
const { PgVectorStore } = require('./store/PgVectorStore');
const { MongoDBAtlasVectorStore } = require('./store/MongoDBAtlasVectorStore');

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
  VLLMInput,
  VLLMStreamParser,
  AnthropicStreamParser,
  ModelHelper,
  MCPClient,
  MCPServer,
  CodingAgent,
  WorkspaceToolkit,
  OpenAICompatibleWrapper,
  OpenAICompatibleInput,
  FetchClient,
  OutputParser,
  Assistant,
  GoogleAIError,
  GoogleAIChatSession,
  GoogleAILiveSession,
  GoogleAuth,
  TextSplitter,
  VectorStore,
  Embedder,
  MemoryVectorStore,
  ChatHistory,
  MemoryChatHistory,
  FileChatHistory,
  FirestoreChatHistory,
  FirestoreVectorStore,
  VertexRAGStore,
  VertexVectorSearchStore,
  VertexVectorSearchIndexStore,
  PineconeVectorStore,
  QdrantVectorStore,
  ChromaVectorStore,
  WeaviateVectorStore,
  MilvusVectorStore,
  ElasticsearchVectorStore,
  PgVectorStore,
  MongoDBAtlasVectorStore
};

},{"./controller/RemoteEmbedModel":2,"./controller/RemoteFineTuneModel":3,"./controller/RemoteImageModel":4,"./controller/RemoteLanguageModel":5,"./controller/RemoteSpeechModel":6,"./function/Assistant":7,"./function/Chatbot":8,"./function/CodingAgent":23,"./function/Gen":9,"./function/SemanticSearch":10,"./function/SemanticSearchPaging":11,"./function/TextAnalyzer":12,"./mcp/server":23,"./model/input/ChatModelInput":15,"./model/input/EmbedInput":16,"./model/input/FineTuneInput":17,"./model/input/FunctionModelInput":18,"./model/input/ImageModelInput":19,"./model/input/LanguageModelInput":20,"./model/input/Text2SpeechInput":21,"./store/ChatHistory":33,"./store/ChromaVectorStore":34,"./store/ElasticsearchVectorStore":35,"./store/Embedder":36,"./store/FirestoreChatHistory":37,"./store/FirestoreVectorStore":38,"./store/MemoryVectorStore":40,"./store/MilvusVectorStore":41,"./store/MongoDBAtlasVectorStore":42,"./store/PgVectorStore":43,"./store/PineconeVectorStore":44,"./store/QdrantVectorStore":45,"./store/VectorStore":46,"./store/VertexRAGStore":47,"./store/VertexVectorSearchStore":48,"./store/WeaviateVectorStore":49,"./utils/AudioHelper":50,"./utils/ChatContext":51,"./utils/ConnHelper":52,"./utils/FetchClient":53,"./utils/GoogleAuth":23,"./utils/LLMEvaluation":55,"./utils/MCPClient":56,"./utils/MatchHelpers":57,"./utils/ModelHelper":59,"./utils/OutputParser":60,"./utils/Prompt":61,"./utils/ProxyHelper":62,"./utils/StreamParser":63,"./utils/SystemHelper":64,"./utils/TextSplitter":65,"./utils/WorkspaceToolkit":23,"./wrappers/AWSEndpointWrapper":66,"./wrappers/AnthropicWrapper":67,"./wrappers/CohereAIWrapper":68,"./wrappers/GeminiAIWrapper":69,"./wrappers/GoogleAIWrapper":70,"./wrappers/HuggingWrapper":71,"./wrappers/IntellicloudWrapper":72,"./wrappers/MistralAIWrapper":73,"./wrappers/NvidiaWrapper":74,"./wrappers/OpenAICompatibleWrapper":75,"./wrappers/OpenAIWrapper":76,"./wrappers/ReplicateWrapper":77,"./wrappers/StabilityAIWrapper":78,"./wrappers/VLLMWrapper":79}],14:[function(require,module,exports){
(function (Buffer){(function (){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { readStreamChunks } = require('../utils/StreamParser');

/**
 * JSON-RPC 2.0 helpers shared by the MCP client and server: message builders and validators, the error codes
 * used by MCP, a newline-delimited JSON reader (stdio transport) and an SSE parser (Streamable HTTP transport).
 */

const JSONRPC_VERSION = '2.0';

const ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  // MCP 2026-07-28 protocol errors
  HEADER_MISMATCH: -32020,
  MISSING_REQUIRED_CLIENT_CAPABILITY: -32021,
  UNSUPPORTED_PROTOCOL_VERSION: -32022,
  // legacy (2025-xx) Streamable HTTP servers use these for "not initialized" and "session not found"
  SERVER_NOT_INITIALIZED: -32000,
  SESSION_NOT_FOUND: -32001,
};

// A JSON-RPC error with one of these codes can only come from a modern (2026-07-28+) server.
const MODERN_ERROR_CODES = new Set([
  ERROR_CODES.HEADER_MISMATCH,
  ERROR_CODES.MISSING_REQUIRED_CLIENT_CAPABILITY,
  ERROR_CODES.UNSUPPORTED_PROTOCOL_VERSION,
]);

// Protocol revisions: modern ones carry per-request _meta, legacy ones start with an initialize handshake.
const MODERN_VERSIONS = ['2026-07-28'];
const LEGACY_VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
const LATEST_LEGACY_VERSION = LEGACY_VERSIONS[0];

const META_KEYS = {
  protocolVersion: 'io.modelcontextprotocol/protocolVersion',
  clientInfo: 'io.modelcontextprotocol/clientInfo',
  clientCapabilities: 'io.modelcontextprotocol/clientCapabilities',
  serverInfo: 'io.modelcontextprotocol/serverInfo',
};

// Methods whose params.name / params.uri is mirrored into the Mcp-Name HTTP header.
const NAME_HEADER_FIELDS = {
  'tools/call': 'name',
  'resources/read': 'uri',
  'prompts/get': 'name',
};

class JsonRpcError extends Error {
  constructor(code, message, data) {
    super(message);
    this.name = 'JsonRpcError';
    this.code = code;
    if (data !== undefined) this.data = data;
  }

  toJSON() {
    return { code: this.code, message: this.message, ...(this.data !== undefined && { data: this.data }) };
  }
}

function hasId(message) {
  return message.id !== undefined && message.id !== null;
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isMessage(message) {
  return isObject(message) && message.jsonrpc === JSONRPC_VERSION
    && (typeof message.method === 'string' || 'result' in message || isObject(message.error));
}

function isRequest(message) {
  return isMessage(message) && typeof message.method === 'string' && hasId(message);
}

// A notification has no id member: a method with id null is an invalid request (MCP forbids null request ids).
function isNotification(message) {
  return isMessage(message) && typeof message.method === 'string' && message.id === undefined;
}

function isResponse(message) {
  return isMessage(message) && typeof message.method !== 'string' && ('result' in message || isObject(message.error));
}

function request(id, method, params) {
  return { jsonrpc: JSONRPC_VERSION, id, method, ...(params !== undefined && { params }) };
}

function notification(method, params) {
  return { jsonrpc: JSONRPC_VERSION, method, ...(params !== undefined && { params }) };
}

function response(id, result) {
  return { jsonrpc: JSONRPC_VERSION, id, result };
}

// id is null when the request id could not be determined (parse errors, invalid requests).
function errorResponse(id, code, message, data) {
  return {
    jsonrpc: JSONRPC_VERSION,
    id: id === undefined ? null : id,
    error: { code, message, ...(data !== undefined && { data }) },
  };
}

function errorFromResponse(message) {
  const error = message && message.error ? message.error : {};
  return new JsonRpcError(
    typeof error.code === 'number' ? error.code : ERROR_CODES.INTERNAL_ERROR,
    error.message || 'Unknown JSON-RPC error',
    error.data,
  );
}

// JSON.stringify escapes control characters, so the output never contains an embedded newline.
function serialize(message) {
  return JSON.stringify(message);
}

function parseMessage(text) {
  let value;
  try {
    value = JSON.parse(text);
  } catch (error) {
    throw new JsonRpcError(ERROR_CODES.PARSE_ERROR, `Parse error: ${error.message}`);
  }
  if (!isMessage(value)) {
    throw new JsonRpcError(ERROR_CODES.INVALID_REQUEST, 'Invalid Request: not a JSON-RPC 2.0 message');
  }
  return value;
}

// ---------------------------------------------------------------------
// HTTP header value encoding (Mcp-Name, Mcp-Param-*)
// ---------------------------------------------------------------------

const SENTINEL_PREFIX = '=?base64?';
const SENTINEL_SUFFIX = '?=';

// visible ASCII plus inner spaces/tabs, without leading or trailing whitespace
function isPlainHeaderValue(value) {
  return /^[\x21-\x7e]([\x20\x21-\x7e\t]*[\x21-\x7e])?$/.test(value);
}

function isSentinel(value) {
  return value.startsWith(SENTINEL_PREFIX) && value.endsWith(SENTINEL_SUFFIX);
}

// Base64 helpers that work in Node and in the browser bundle.
function toBase64(text) {
  if (typeof Buffer !== 'undefined') return Buffer.from(text, 'utf8').toString('base64');
  return btoa(unescape(encodeURIComponent(text)));
}

function fromBase64(text) {
  if (typeof Buffer !== 'undefined') return Buffer.from(text, 'base64').toString('utf8');
  return decodeURIComponent(escape(atob(text)));
}

/** Encode a body value for a mirrored header; non-ASCII, padded or sentinel-looking values use the Base64 form. */
function encodeHeaderValue(value) {
  const text = String(value);
  if (isPlainHeaderValue(text) && !isSentinel(text)) return text;
  return `${SENTINEL_PREFIX}${toBase64(text)}${SENTINEL_SUFFIX}`;
}

/** Decode a mirrored header value; throws on a malformed Base64 sentinel. */
function decodeHeaderValue(value) {
  const text = String(value);
  if (!isSentinel(text)) return text;
  const encoded = text.slice(SENTINEL_PREFIX.length, -SENTINEL_SUFFIX.length);
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) {
    throw new JsonRpcError(ERROR_CODES.HEADER_MISMATCH, 'Header value is not valid Base64');
  }
  return fromBase64(encoded);
}

// ---------------------------------------------------------------------
// Stream readers
// ---------------------------------------------------------------------

/**
 * Yield one parsed JSON value per non-empty line of a text stream (Node stream, web ReadableStream or an
 * iterable of string/Buffer chunks). Lines that are not valid JSON are passed to onInvalid and skipped.
 */
async function* readJsonLines(stream, onInvalid = null) {
  let buffer = '';
  const parse = (line) => {
    const text = line.endsWith('\r') ? line.slice(0, -1) : line;
    if (!text.trim()) return undefined;
    try {
      return JSON.parse(text);
    } catch (error) {
      if (onInvalid) onInvalid(text, error);
      return undefined;
    }
  };
  for await (const chunk of readStreamChunks(stream)) {
    buffer += chunk;
    let index;
    while ((index = buffer.indexOf('\n')) !== -1) {
      const value = parse(buffer.slice(0, index));
      buffer = buffer.slice(index + 1);
      if (value !== undefined) yield value;
    }
  }
  const last = parse(buffer);
  if (last !== undefined) yield last;
}

/**
 * Incremental text/event-stream parser. feed(chunk) returns the events completed by that chunk as
 * { event, data, id }; end() flushes a final event that was not terminated by a blank line.
 * Handles data:/event:/id:/retry: fields, comment lines, multi-line data and LF, CRLF or CR line endings.
 */
class SSEParser {
  constructor() {
    this.buffer = '';
    this._reset();
  }

  _reset() {
    this.dataLines = [];
    this.eventName = null;
    this.eventId = null;
  }

  feed(chunk) {
    this.buffer += chunk;
    const events = [];
    let index;
    while ((index = this.buffer.search(/\r\n|\n|\r/)) !== -1) {
      // a trailing CR may be the first half of a CRLF split across chunks
      if (this.buffer[index] === '\r' && index === this.buffer.length - 1) break;
      const line = this.buffer.slice(0, index);
      const width = this.buffer[index] === '\r' && this.buffer[index + 1] === '\n' ? 2 : 1;
      this.buffer = this.buffer.slice(index + width);
      const event = this._line(line);
      if (event) events.push(event);
    }
    return events;
  }

  end() {
    const events = [];
    const rest = this.buffer.replace(/\r$/, '');
    this.buffer = '';
    if (rest) {
      const event = this._line(rest);
      if (event) events.push(event);
    }
    const last = this._dispatch();
    if (last) events.push(last);
    return events;
  }

  _line(line) {
    if (line === '') return this._dispatch();
    if (line.startsWith(':')) return null;
    const colon = line.indexOf(':');
    const field = colon === -1 ? line : line.slice(0, colon);
    let value = colon === -1 ? '' : line.slice(colon + 1);
    if (value.startsWith(' ')) value = value.slice(1);
    if (field === 'data') this.dataLines.push(value);
    else if (field === 'event') this.eventName = value;
    else if (field === 'id' && !value.includes(' ')) this.eventId = value;
    // retry and unknown fields are ignored
    return null;
  }

  _dispatch() {
    if (this.dataLines.length === 0) {
      this._reset();
      return null;
    }
    const event = { event: this.eventName || 'message', data: this.dataLines.join('\n'), id: this.eventId };
    this._reset();
    return event;
  }
}

/** Yield the JSON-RPC messages carried by the data of an SSE body; events with other data are skipped. */
async function* readSSEMessages(body, onInvalid = null) {
  const parser = new SSEParser();
  const messages = (events) => events.map((event) => {
    if (!event.data.trim()) return undefined;
    try {
      const value = JSON.parse(event.data);
      if (isMessage(value)) return value;
      if (onInvalid) onInvalid(event.data, new Error('not a JSON-RPC message'));
    } catch (error) {
      if (onInvalid) onInvalid(event.data, error);
    }
    return undefined;
  }).filter((value) => value !== undefined);

  for await (const chunk of readStreamChunks(body)) {
    for (const message of messages(parser.feed(chunk))) yield message;
  }
  for (const message of messages(parser.end())) yield message;
}

module.exports = {
  JSONRPC_VERSION,
  ERROR_CODES,
  MODERN_ERROR_CODES,
  MODERN_VERSIONS,
  LEGACY_VERSIONS,
  LATEST_LEGACY_VERSION,
  META_KEYS,
  NAME_HEADER_FIELDS,
  JsonRpcError,
  isMessage,
  isRequest,
  isNotification,
  isResponse,
  request,
  notification,
  response,
  errorResponse,
  errorFromResponse,
  serialize,
  parseMessage,
  encodeHeaderValue,
  decodeHeaderValue,
  readJsonLines,
  SSEParser,
  readSSEMessages,
};

}).call(this)}).call(this,require("buffer").Buffer)
},{"../utils/StreamParser":63,"buffer":25}],15:[function(require,module,exports){
(function (Buffer){(function (){
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

// A media item as a Gemini part: a part object as is, { data, mimeType } inline, or { uri, mimeType } as file data.
function toGeminiPart(item) {
  if (!item || typeof item !== 'object') throw new Error('Gemini media must be a part or { data, mimeType } / { uri, mimeType }.');
  if (item.inlineData || item.inline_data || item.fileData || item.file_data || item.text !== undefined) return item;
  const mimeType = item.mimeType || item.mime_type;
  if (item.uri || item.fileUri) {
    return { fileData: { mimeType, fileUri: item.uri || item.fileUri } };
  }
  if (item.data !== undefined) {
    const data = typeof item.data === 'string' ? item.data.replace(/^data:[^,]*,/, '') : Buffer.from(item.data).toString('base64');
    return { inlineData: { mimeType, data } };
  }
  throw new Error('Gemini media must be a part or { data, mimeType } / { uri, mimeType }.');
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
    // a model left at the Developer API default is replaced by the Vertex AI default on the vertex provider
    this.defaultModel = this.model === config.url.gemini.models.chat && !(options.model && options.model !== 'gemini');
    this.maxOutputTokens = options.maxTokens
    this.temperature = options.temperature
    // tools in Gemini (functionDeclarations) or OpenAI function format
    this.tools = options.tools || null;
    this.toolChoice = options.toolChoice ?? null;
    // Gemini only: generationConfig entries (thinkingConfig, responseModalities, ...), safety settings and a
    // context cache name (GeminiAIWrapper.createCachedContent)
    this.generationConfig = options.generationConfig || null;
    this.safetySettings = options.safetySettings || null;
    this.cachedContent = options.cachedContent || null;
    // systemInstruction: true sends the system message as a Gemini system instruction; a string sets it directly.
    // Without it the system message is the first user turn, as before.
    this.systemInstruction = typeof options.systemInstruction === 'string' ? options.systemInstruction : null;

    if (systemMessage && typeof systemMessage === 'string') {
      if (options.systemInstruction === true) {
        this.systemInstruction = systemMessage;
      } else {
        this.addUserMessage(systemMessage);
        this.addModelMessage('I will response based on the provided instructions.');
      }
    }
  }

  /**
   * Add a user turn. media (optional) adds images, audio, video or PDFs: Gemini parts, { data, mimeType }
   * with base64 or bytes, or { uri, mimeType } for gs://, https, YouTube and Files API URIs.
   */
  addUserMessage(text, media = null) {
    const parts = [];
    if (!media || (text !== null && text !== undefined && text !== '')) parts.push({ text });
    for (const item of media ? (Array.isArray(media) ? media : [media]) : []) parts.push(toGeminiPart(item));
    this.messages.push({
      role: "user",
      parts
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
      ...(this.systemInstruction && { systemInstruction: { parts: [{ text: this.systemInstruction }] } }),
      generationConfig: {
        ...(this.temperature != null && { temperature: this.temperature }),
        ...(this.maxOutputTokens && { maxOutputTokens: this.maxOutputTokens }),
        ...(this.responseFormat === 'json' && { responseMimeType: 'application/json' }),
        ...(this.responseSchema && { responseSchema: toGeminiSchema(this.responseSchema) }),
        ...(this.generationConfig || {}),
      },
      ...(this.tools && { tools: toGeminiTools(this.tools) }),
      ...(toolConfig && { toolConfig }),
      ...(this.safetySettings && { safetySettings: this.safetySettings }),
      ...(this.cachedContent && { cachedContent: this.cachedContent }),
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

}).call(this)}).call(this,require("buffer").Buffer)
},{"../../config.json":1,"../../utils/ModelHelper":59,"buffer":25}],16:[function(require,module,exports){
const config = require('../../config.json');

class EmbedInput {
  constructor({
    texts,
    model = null,
    inputType = null,
  }) {
    this.texts = texts;
    this.model = model;
    // Cohere: search_document, search_query, classification or clustering. NVIDIA: query or passage.
    this.inputType = inputType;
  }

  getCohereInputs() {
    const inputs = {
      texts: this.texts,
      ...this.model && { model: this.model },
      // Cohere embed v3 and newer require an input type.
      input_type: this.inputType || 'search_document',
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
      model: this.model || config.nvidia.models.embed,
      input_type: this.inputType || input_type,
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
      this.model = config.url.openai.models.embed;
    } else if (provider === "cohere") {
      this.model = config.url.cohere.models.embed;
    } else if (provider === "replicate") {
        this.model = config.models.replicate.llama['llama-2-13b-embeddings-version'];
    } else if (provider === "gemini") {
        this.model = `models/${config.url.gemini.models.embed}`;
    } else if (provider === "vertex") {
        this.model = config.url.gemini.vertex.models.embed;
    } else if (provider === "nvidia") {
        this.model = config.nvidia.models.embed;
    } else if (provider === "vllm") {
        this.model = null;
    } else if (["openai_compatible", "openrouter", "together", "ollama", "lmstudio"].includes(provider)) {
        // the preset default (or the model given in the request) is applied by the wrapper
        this.model = null;
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = EmbedInput;

},{"../../config.json":1}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const config = require('../../config.json');

// gpt-image models only accept low/medium/high/auto quality.
const GPT_IMAGE_QUALITY = { standard: 'medium', hd: 'high' };

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
    quality = null,
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
    this.quality = quality;
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
      ...this.quality && { quality: this.quality },
      ...this.model && { model: this.model }
    };

    return ImageModelInput.normalizeOpenAIParams(inputs);
  }

  /**
   * The images API now requires a model, and gpt-image models always return base64 and
   * reject the dall-e era response_format/style parameters, so translate them.
   */
  static normalizeOpenAIParams(params) {
    const normalized = { ...params, model: params.model || config.url.openai.models.image };
    if (String(normalized.model).startsWith('gpt-image')) {
      delete normalized.response_format;
      delete normalized.style;
      if (normalized.quality) {
        normalized.quality = GPT_IMAGE_QUALITY[normalized.quality] || normalized.quality;
      }
    }
    return normalized;
  }

  // Gemini image models take an aspect ratio, not pixel sizes.
  getGeminiInputs() {
    const ratio = this.width && this.height ? ImageModelInput.aspectRatio(this.width, this.height) : null;
    return {
      prompt: this.prompt,
      numberOfImages: this.numberOfImages || 1,
      model: this.model || null,
      ...(ratio && { config: { imageConfig: { aspectRatio: ratio } } }),
    };
  }

  // The closest aspect ratio Gemini supports for a width and height.
  static aspectRatio(width, height) {
    const supported = ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'];
    const target = width / height;
    let best = supported[0];
    for (const ratio of supported) {
      const [w, h] = ratio.split(':').map(Number);
      const [bw, bh] = best.split(':').map(Number);
      if (Math.abs(w / h - target) < Math.abs(bw / bh - target)) best = ratio;
    }
    return best;
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
      this.model = this.model || config.url.openai.models.image;
    } else if (provider === "stability") {
      this.numberOfImages = 1;
      this.height = 1024;
      this.width = 1024;
      this.engine = 'stable-diffusion-xl-1024-v1-0';
    } else if (provider === "gemini" || provider === "vertex") {
      this.numberOfImages = 1;
      this.model = this.model || (provider === "vertex" ? config.url.gemini.vertex.models.image : config.url.gemini.models.image);
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = ImageModelInput;

},{"../../config.json":1}],20:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const config = require('../../config.json');

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
      // the completions endpoint only serves instruct models
      this.model = config.url.openai.models.completion;
    } else if (provider === "cohere") {
      // Cohere text generation now runs on the Chat API
      this.model = config.url.cohere.models.chat;
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = LanguageModelInput;

},{"../../config.json":1}],21:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const config = require('../../config.json');

class Text2SpeechInput {
  constructor({ text, language = "en-gb", gender = "FEMALE", voice, model = config.url.openai.models.speech, stream = true }) {
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

  /**
   * Gemini TTS input: a Gemini voice name (Kore, Puck, Charon, ...) when voice is one, otherwise Kore for a female
   * and Puck for a male voice. The OpenAI tts model default is replaced by the Gemini TTS default.
   */
  getGeminiInput() {
    const openAIVoices = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'onyx', 'nova', 'sage', 'shimmer', 'verse'];
    const voice = this.voice && !openAIVoices.includes(String(this.voice).toLowerCase())
      ? this.voice
      : (this.gender === Text2SpeechInput.Gender.MALE ? 'Puck' : 'Kore');
    const model = this.model && String(this.model).includes('tts') && String(this.model).startsWith('gemini') ? this.model : null;
    return { text: this.text, voice, model };
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

},{"../../config.json":1}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){

},{}],24:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],25:[function(require,module,exports){
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
},{"base64-js":22,"buffer":25,"ieee754":28}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
'use strict';

/* eslint-env browser */
module.exports = typeof self === 'object' ? self.FormData : window.FormData;

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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
},{"_process":30}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
module.exports={
  "name": "intellinode",
  "version": "3.1.0",
  "description": "Unified AI toolkit: one API for OpenAI, Anthropic, Gemini, Vertex AI, Mistral, Cohere, NVIDIA and OpenAI-compatible services, with an Assistant for chat apps, vector stores, a tool loop, structured output, generators for web developers, an MCP server and an agent skill.",
  "main": "index.js",
  "types": "index.d.ts",
  "bin": {
    "intellinode": "bin/intellinode.js"
  },
  "mcpName": "io.github.intelligentnode/intellinode",
  "browser": {
    "./mcp/server.js": false,
    "./function/CodingAgent.js": false,
    "./utils/WorkspaceToolkit.js": false,
    "./utils/GoogleAuth.js": false
  },
  "keywords": [
    "ai",
    "ChatGPT",
    "stable diffusion",
    "openai",
    "huggingface",
    "Llama",
    "image generation",
    "speech synthesis",
    "prompt",
    "automation",
    "mistral",
    "gemini",
    "deepseek",
    "framework",
    "mcp",
    "anthropic",
    "claude",
    "ollama",
    "openrouter",
    "groq",
    "openai-compatible",
    "tool-calling",
    "structured-output",
    "model-context-protocol",
    "coding-agent",
    "agent",
    "vertex-ai",
    "google-cloud",
    "rag",
    "vector-database",
    "assistant",
    "firestore",
    "agent-skills"
  ],
  "author": "IntelliNode",
  "license": "Apache",
  "repository": {
    "type": "git",
    "url": "https://github.com/intelligentnode/IntelliNode.git"
  },
  "scripts": {
    "build": "node scripts/build-templates.js && browserify index.js --standalone IntelliNode -o front/intellinode.js && uglifyjs front/intellinode.js -o front/intellinode.min.js",
    "test": "node test/unit/testRunner",
    "sync-skill": "node scripts/sync-skill.js"
  },
  "homepage": "https://www.intellinode.ai",
  "devDependencies": {
    "browserify": "^17.0.1",
    "uglify-js": "^3.19.3"
  },
  "dependencies": {
    "cross-fetch": "^4.1.0",
    "dotenv": "^17.4.2",
    "form-data": "^4.0.6"
  }
}

},{}],32:[function(require,module,exports){
// Generated by scripts/build-templates.js from resource/templates/*.in - do not edit.
module.exports = {
  "accessibility_prompt.in": "You are a web accessibility (WCAG 2.2 AA) expert. Review the HTML below, fix every accessibility problem you find and report what changed.\n\nReturn exactly two markdown code blocks and nothing else:\n1. A block tagged html containing the complete corrected HTML.\n2. A block tagged json containing an array of the problems you fixed, in this shape:\n[{\"issue\": \"what was wrong\", \"fix\": \"what you changed\", \"wcag\": \"criterion id, e.g. 1.1.1\"}]\n\nRules:\n- Keep the original structure, content and styling; only change what accessibility requires (alt text, labels, roles, landmarks, heading order, focus order, ARIA attributes, language, link text).\n- If the HTML has no problems, return it unchanged and an empty JSON array.\n\nHTML:\n${text}\n",
  "api_endpoint_prompt.in": "You are an expert backend engineer. Implement a ${framework} API endpoint in ${language} for the request below.\n\nRequirements:\n- Return only the complete source code of one file inside a single markdown code block. No explanation.\n- Validate the input, return proper HTTP status codes and JSON responses, and handle errors without crashing the process.\n- Use async/await and keep the handler easy to test; include a short usage comment showing the route and an example request.\n- Do not include credentials; use a placeholder data layer or in-memory data where storage is needed.\n\nRequest: ${text}\n",
  "augmented_chatbot.in": "Using the provided context, craft a  cohesive response that directly addresses the user's query. If the context lacks relevance or is absent, focus on generating a knowledgeable and accurate answer based on the user's question alone. Aim for clarity and conciseness in your reply.\nContext:\n${semantic_search}\n---------------------------------\nUser's Question:\n${user_query}",
  "code_review_prompt.in": "You are a senior software engineer doing a code review. Review the ${language} code below for bugs, security issues, performance problems, readability and best practices.\n\nReturn only a JSON object with this exact shape and no markdown fences:\n{\"summary\": \"one paragraph overall assessment\", \"score\": 7, \"issues\": [{\"severity\": \"high\", \"title\": \"short title\", \"description\": \"what is wrong and why it matters\", \"suggestion\": \"how to fix it, with a code snippet when useful\"}]}\n\nRules:\n- score is an integer from 1 (unsafe to ship) to 10 (excellent); severity is one of high, medium or low.\n- Order issues from highest to lowest severity and only report real problems; return an empty issues array for clean code.\n- Escape double quotes and newlines inside JSON strings so the JSON is valid.\n\nCode:\n${text}\n",
  "color_palette_prompt.in": "You are an expert UI designer. Create a ${count}-color palette for the request below.\n\nReturn only a JSON object with this exact shape and no markdown fences:\n{\"name\": \"palette name\", \"colors\": [{\"name\": \"primary\", \"hex\": \"#RRGGBB\", \"usage\": \"where to use it\"}], \"css\": \":root { --color-primary: #RRGGBB; }\"}\n\nRules:\n- Return exactly ${count} colors, each with a unique lowercase kebab-case name, a 6-digit hex value and a short usage note.\n- Include at least one background, one text and one accent color, and make sure text and background colors have enough contrast.\n- The css field must declare one CSS custom property per color inside :root.\n\nRequest: ${text}\n",
  "commit_message_prompt.in": "You are an expert developer writing a git commit message for the diff below.\n\nRequirements:\n- Return only the commit message as plain text: a subject line of at most 72 characters, then a blank line, then a short body with bullet points describing the changes and why.\n- ${style_rule}\n- Do not wrap the message in quotes or markdown.\n\nDiff:\n${text}\n",
  "component_prompt.in": "You are an expert frontend engineer. Build a ${framework} component in ${language} using ${styling} for styling, based on the request below.\n\nRequirements:\n- Return only the complete source code of one file inside a single markdown code block. No explanation before or after it.\n- The component must be self-contained, production quality, accessible (semantic HTML, labels, keyboard support) and responsive.\n- Export the component as the default export when the framework supports it.\n- Include realistic placeholder content and sensible props or state where useful.\n\nRequest: ${text}\n",
  "convert_code_prompt.in": "You are an expert software engineer. Convert the code below from ${from} to ${to}.\n\nRequirements:\n- Return only the converted code inside a single markdown code block. No explanation.\n- Preserve the behaviour, structure, names and comments; use idiomatic ${to} (for example proper types when converting to TypeScript, or utility classes when converting to Tailwind CSS).\n- Do not add features or remove existing ones.\n\nCode:\n${text}\n",
  "design_tokens_prompt.in": "You are a design systems engineer. Create the design tokens for the brand described below.\n\nColor rules:\n- Six scales: primary, secondary, neutral, success, warning and danger. Each scale has exactly these eleven steps, from lightest to darkest: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.\n- Every color is a six digit hex string such as #1d4ed8. Never use rgb(), hsl(), oklch(), a three digit hex or a color name.\n- ${brand_color_rule}\n- Steps change evenly in perceived lightness. Neutral carries a slight tint of the brand hue. Secondary is an analogous or complementary hue.\n- Define semantic roles for each of these modes: ${modes}. Each mode defines all thirteen roles: background, foreground, muted, muted-foreground, primary, primary-foreground, secondary, secondary-foreground, accent, border, ring, danger and danger-foreground.\n- A role value is a hex string or a reference to a scale step such as primary.600.\n- In every mode, foreground on background, muted-foreground on background, primary-foreground on primary and danger-foreground on danger reach a contrast ratio of at least 4.5 to 1. Design the dark mode on purpose instead of inverting the light one.\n${typography_rule}\n${spacing_rule}\n- radius has sm, md, lg and full as CSS length strings.\n\nReturn only one JSON object and no markdown fences, in this shape, filling in every object shown empty:\n{\"name\": \"token set name\", \"palette\": {\"primary\": {\"50\": \"#eef2ff\", \"100\": \"#e0e7ff\", \"200\": \"#c7d2fe\", \"300\": \"#a5b4fc\", \"400\": \"#818cf8\", \"500\": \"#4f46e5\", \"600\": \"#4338ca\", \"700\": \"#3730a3\", \"800\": \"#312e81\", \"900\": \"#1e1b4b\", \"950\": \"#131029\"}, \"secondary\": {}, \"neutral\": {}, \"success\": {}, \"warning\": {}, \"danger\": {}}, \"semantic\": {\"light\": {\"background\": \"#ffffff\", \"foreground\": \"neutral.900\", \"muted\": \"neutral.100\", \"muted-foreground\": \"neutral.600\", \"primary\": \"primary.600\", \"primary-foreground\": \"#ffffff\", \"secondary\": \"secondary.500\", \"secondary-foreground\": \"#ffffff\", \"accent\": \"primary.100\", \"border\": \"neutral.200\", \"ring\": \"primary.500\", \"danger\": \"danger.600\", \"danger-foreground\": \"#ffffff\"}, \"dark\": {}}, \"typography\": {\"fontFamily\": {\"sans\": \"Inter, system-ui, sans-serif\", \"mono\": \"ui-monospace, SFMono-Regular, monospace\"}, \"fontSize\": {\"xs\": \"0.75rem\", \"sm\": \"0.875rem\", \"base\": \"1rem\", \"lg\": \"1.125rem\", \"xl\": \"1.25rem\", \"2xl\": \"1.5rem\", \"3xl\": \"1.875rem\", \"4xl\": \"2.25rem\"}}, \"radius\": {\"sm\": \"0.25rem\", \"md\": \"0.5rem\", \"lg\": \"1rem\", \"full\": \"9999px\"}, \"spacing\": {\"1\": \"0.25rem\", \"2\": \"0.5rem\", \"3\": \"0.75rem\", \"4\": \"1rem\", \"6\": \"1.5rem\", \"8\": \"2rem\", \"12\": \"3rem\", \"16\": \"4rem\"}}\n\nBrand:\n${text}\n",
  "email_template_prompt.in": "You are an expert in HTML email development. Build a responsive HTML email for the request below.\n\nRequirements:\n- Return only the complete HTML document inside a single markdown code block. No explanation.\n- Use a table-based layout, inline CSS on elements, a 600px maximum width and web-safe fonts so it renders in Gmail, Outlook and Apple Mail.\n- Include a preheader, a header, the main content, a clear call-to-action button and a footer with an unsubscribe link placeholder.\n- Use placeholders like {{first_name}} and {{unsubscribe_url}} for dynamic values.\n- Add alt text to every image and keep the total size small.\n\nRequest: ${text}\n",
  "explain_code_prompt.in": "You are a patient senior engineer. Explain the ${language} code below to a ${audience}.\n\nRequirements:\n- Return Markdown only, no surrounding code fence.\n- Start with a one-paragraph summary of what the code does, then a \"How it works\" section that walks through it step by step, then a \"Things to watch\" section with pitfalls, edge cases or improvements.\n- Reference identifiers from the code in backticks and keep the explanation accurate to the code; do not invent behaviour.\n\nCode:\n${text}\n",
  "faq_prompt.in": "You are a content writer for a website. Write ${count} frequently asked questions with answers about the topic below.\n\nReturn only a JSON array with this exact shape and no markdown fences:\n[{\"question\": \"the question a visitor would ask\", \"answer\": \"a clear, helpful answer of one to three sentences\"}]\n\nRules:\n- Return exactly ${count} items, ordered from the most common to the least common question, without duplicates.\n- Write in a ${tone} tone and keep answers factual to the topic; use placeholders for details that are unknown.\n\nTopic:\n${text}\n",
  "fix_code_prompt.in": "You are an expert ${language} debugger. Fix the code below so the reported problem no longer happens.\n\nReturn exactly two markdown code blocks and nothing else:\n1. A block containing the complete fixed code.\n2. A block tagged json in this shape: {\"explanation\": \"what was wrong and what changed\", \"changes\": [\"one short line per change\"]}\n\nRules:\n- Keep the original style, names and behaviour except for the fix; do not add unrelated changes.\n\nProblem: ${problem}\n\nCode:\n${text}\n",
  "form_prompt.in": "You are an expert frontend engineer. Build a ${framework} form based on the request below.\n\nRequirements:\n- Return only the complete source code inside a single markdown code block. No explanation.\n- Include every field described, with proper labels, input types, placeholders and required markers.\n- Add client-side validation with clear inline error messages and an accessible success state.\n- The form must be responsive, keyboard accessible and use semantic HTML.\n- ${submit}\n\nRequest: ${text}\n",
  "graph_dashboard_prompt.in": "Generate an HTML dashboard using chart.js with ${count} graphs about the ${topic} topic from the provided data. Each graph should showcase the relationships between selected columns, ensuring the graphs are relevant to the topic.\n\nOutput example:\n[{\n  \"html\": \"<!DOCTYPE html><html><head>[Insert required styles and scripts for Chart.js]</head><body>[Include code for all the ${count} graphs]</body></html>\", \n  \"message\": \"the page ready to render\"\n}]\n\nFollow these instructions:\n---\n1. Return a single JSON response in the style shown in the output example.\n2. Use Chart.js for generating the graphs wherever possible.\n3. Use \\\" before any generated double quotation marks to ensure a valid JSON response.\n4. Design elegant, modern dashboard charts based on the provided data.\n5. Make sure the response is a valid JSON containing the complete HTML content.\n6. Ensure the response will not truncate in any circumstance.\n7. Select sample of the data based on the user instructions ensuring it fit in one page.\n8. Reply only with generated code.\n\nUser data: ###${text}###",
  "html_page_prompt.in": "Generate website, javascript and css in one page based on the user request.\n\nOutput format:\n{\"html\": \"<!DOCTYPE html><html><head>[generated head content]</head><body>[generated body content]</body></html>\", \"message\"\":\"the page ready for render\"}\n\nEnsure the page is compatible with screen sizes and use ready bootstrap component when needed.\n\nIf an image generated, add a clear image description in the alt to use for image generation:\n<img src=\"<image name and format>\" alt=\"<image description>\" width=\"<size or percentage>\" height=\"<size or percentage>\">\n\nuser request: ${text}\n\noutput:",
  "instruct_update.in": "Update the model output and make sure to maintain the format. Don't use the example content with the user message.\nReturn all the model generated after applying the instructions.\n\nExample:\nthe model generated json html output: ###{\"html\": \"<!DOCTYPE html><html><body><h1>Title1</h1></body></html>\"}###\nthe user update instructions: ###change to Title2###\noutput: {\"html\": \"<!DOCTYPE html><html><body><h1>Title2</h1></body></html>\"}\n----\nthe model generated text output: ###Text1 example bla bla###\nthe user update instructions: ###change to text2###\noutput: Text2 example  bla bla\n===\nUser message:\nthe model generated ${type} output: ###${model_output}###\nthe user update instructions:  ###${user_instruction}###\noutput:",
  "json_schema_prompt.in": "You are an API design expert. Write a JSON Schema (draft 2020-12) for the data described below.\n\nReturn only the JSON Schema object and no markdown fences.\n\nRules:\n- Set \"$schema\", \"type\": \"object\", \"properties\", \"required\" and \"additionalProperties\".\n- Give every property a \"type\" and a \"description\"; use \"format\" (email, date-time, uri, uuid), \"enum\", \"minimum\", \"maximum\", \"minLength\", \"maxLength\" and \"pattern\" where the description implies them.\n- Nest objects and arrays with their own \"items\" or \"properties\".\n\nData:\n${text}\n",
  "landing_copy_prompt.in": "You are a conversion copywriter. Write landing page copy for the product or service described below.\n\nReturn only a JSON object with this exact shape and no markdown fences:\n{\"headline\": \"short benefit-driven headline\", \"subheadline\": \"one supporting sentence\", \"features\": [{\"title\": \"feature title\", \"description\": \"one sentence benefit\"}], \"cta\": \"call-to-action button text\", \"socialProof\": \"one sentence trust statement\", \"faq\": [{\"question\": \"\", \"answer\": \"\"}]}\n\nRules:\n- Return exactly ${feature_count} features and 3 FAQ items, in a ${tone} tone.\n- Focus on benefits for the target audience, avoid hype words and keep every field concise.\n\nProduct:\n${text}\n",
  "mock_data_prompt.in": "You are a test data generator for web applications. Generate ${count} realistic records that match the schema or description below.\n\nRequirements:\n- Return only a JSON array with exactly ${count} objects and no markdown fences or explanation.\n- Every object must have the same keys in the same order, with realistic and varied values (names, emails, ISO 8601 dates, prices as numbers, sequential integer ids or UUIDs as described).\n- Respect any types, formats, enums and constraints given in the schema.\n\nSchema or description:\n${text}\n",
  "openapi_spec_prompt.in": "You are an API architect. Write an OpenAPI ${openapi_version} document for the API below.\n\nRules:\n- Document only the routes that appear in the input. Never invent endpoints, parameters, fields or status codes.\n- Write path keys in the OpenAPI brace form such as /users/{id}, never the colon form.\n- Infer request bodies from destructuring of the request body, or from a validation schema (zod, joi, yup) when one is present.\n- Infer status codes from the code: 201 for a created response, 204 for an empty response, 200 otherwise, plus every error status the code returns.\n- Declare query parameters with \"in\": \"query\", and path parameters with \"in\": \"path\" and \"required\": true.\n- GET and DELETE operations have no request body.\n- Give every operation a unique lowerCamelCase operationId, a short summary and at least one response.\n- Put a shape used more than once in components.schemas and reference it with $ref; every $ref must point to a schema defined in this document.\n\nReturn only one JSON object and no markdown fences, in this shape:\n{\"openapi\": \"${openapi_version}\", \"info\": {\"title\": \"API title\", \"version\": \"1.0.0\"}, \"paths\": {\"/users/{id}\": {\"get\": {\"operationId\": \"getUserById\", \"summary\": \"Get one user\", \"parameters\": [{\"name\": \"id\", \"in\": \"path\", \"required\": true, \"schema\": {\"type\": \"string\"}}], \"responses\": {\"200\": {\"description\": \"The user\", \"content\": {\"application/json\": {\"schema\": {\"$ref\": \"#/components/schemas/User\"}}}}, \"404\": {\"description\": \"Not found\"}}}}}, \"components\": {\"schemas\": {\"User\": {\"type\": \"object\", \"properties\": {\"id\": {\"type\": \"string\"}, \"email\": {\"type\": \"string\", \"format\": \"email\"}}, \"required\": [\"id\", \"email\"]}}}}\n\nAPI:\n${text}\n",
  "page_section_prompt.in": "You are an expert frontend engineer. Build a ${section_type} section for a website using ${styling}, based on the request below.\n\nRequirements:\n- Return only the HTML for the section inside a single markdown code block. No explanation and no full document (no <html>, <head> or <body> tags).\n- Make it responsive and accessible, with semantic elements, real-looking placeholder text and image placeholders with descriptive alt text.\n- Any needed CSS must be in one <style> tag at the top of the snippet, scoped with a unique class prefix so it can be pasted into an existing page.\n\nRequest: ${text}\n",
  "prompt_example.in": "Example of good prompt engineering response:\n\nUser: Create a prompt: to {query} from {context}.\n\nAssistant: Given the following context:\n\ncontext:\n---------\n${context}\n\nExtract the specific information denoted by the query: ${query} from the provided context.",
  "readme_prompt.in": "You are an expert technical writer. Write a README.md in Markdown for the project described below.\n\nRequirements:\n- Return only the Markdown content. No explanation and no surrounding code fence.\n- Start with a level-1 heading with the project name, then a one-paragraph description.\n- Include these level-2 sections: Features, Installation, Usage (with code examples), Configuration, Contributing and License.\n- Keep it concise, accurate to the description and free of invented facts; use placeholders where details are unknown.\n\nProject:\n${text}\n",
  "regex_prompt.in": "You are a regular expression expert. Write a ${language} regular expression for the request below.\n\nReturn only a JSON object with this exact shape and no markdown fences:\n{\"pattern\": \"the pattern without surrounding slashes\", \"flags\": \"flags such as i or g, or an empty string\", \"explanation\": \"short explanation of each part\", \"matches\": [\"three example strings that must match\"], \"nonMatches\": [\"three example strings that must not match\"]}\n\nRules:\n- Escape backslashes for JSON (write \\\\d for a digit class).\n- Keep the pattern as simple as possible while still correct, and make sure every example in matches really matches and every example in nonMatches really does not.\n\nRequest: ${text}\n",
  "release_notes_prompt.in": "You are a release manager. Write release notes in Markdown for the changes below.\n\nRequirements:\n- Return only the Markdown content. No explanation and no surrounding code fence.\n- Start with a level-2 heading \"${version}\" followed by a one-sentence summary.\n- Group changes under level-3 headings in this order, omitting empty groups: Highlights, New Features, Improvements, Bug Fixes, Breaking Changes, Other.\n- Write each change as a bullet from the user's point of view and keep the original ticket or PR references.\n\nChanges:\n${text}\n",
  "sentiment_prompt.in": "Outputs sentiment analysis results in a standardized JSON format with sentiment values 'positive', 'negative', or 'neutral'. The format of the output should follow json and you can add muti sentiments i needed. output format should be always {\"results\": {\"positive\": 0 or 1, \"negative\": 0 or 1, \"neutral\": 0 or 1}}}}",
  "seo_meta_prompt.in": "You are an SEO specialist. Create the metadata for the web page described below.\n\nReturn only a JSON object with this exact shape and no markdown fences:\n{\"title\": \"page title of at most 60 characters\", \"description\": \"meta description of 120 to 160 characters\", \"keywords\": [\"five to ten keywords\"], \"openGraph\": {\"og:title\": \"\", \"og:description\": \"\", \"og:type\": \"website\", \"og:url\": \"${url}\", \"og:image\": \"https://example.com/og-image.jpg\"}, \"twitter\": {\"twitter:card\": \"summary_large_image\", \"twitter:title\": \"\", \"twitter:description\": \"\"}, \"jsonLd\": {\"@context\": \"https://schema.org\", \"@type\": \"WebPage\", \"name\": \"\", \"description\": \"\"}}\n\nRules:\n- Use the site name \"${site_name}\" where relevant and choose the most specific schema.org @type for the page (for example Product, Article, Organization or FAQPage).\n- Return plain JSON values only: no HTML in any field.\n\nPage:\n${text}\n",
  "sql_prompt.in": "You are an expert database engineer. Write ${dialect} SQL for the request below.\n\nRequirements:\n- Return only the SQL inside a single markdown code block. No explanation outside SQL comments.\n- Use valid ${dialect} syntax, explicit column lists and parameter placeholders for user-supplied values where appropriate.\n- Add indexes or constraints when they are clearly needed and keep the statements safe to run.\n${schema_section}\nRequest: ${text}\n",
  "styles_prompt.in": "You are an expert CSS engineer. Write ${format} for the request below.\n\nRequirements:\n- Return only the code inside a single markdown code block. No explanation.\n- Use modern, responsive techniques (flexbox or grid, relative units, media queries) and keep selectors simple.\n- Include short comments only where they help.\n${html_section}\nRequest: ${text}\n",
  "summary_prompt.in": "Provide a short summary of the following text:\\n\\n${text}\\n\\nSummary:",
  "svg_icon_prompt.in": "You are an expert icon designer. Create an SVG icon for the request below.\n\nRequirements:\n- Return only the SVG markup, starting with <svg and ending with </svg>. No markdown and no explanation.\n- Use viewBox=\"0 0 24 24\", width=\"${size}\", height=\"${size}\" and a ${style} style.\n- Use currentColor for strokes and fills so the icon inherits the CSS color, and keep the shape simple and recognizable at small sizes.\n- Add role=\"img\" and a <title> element that describes the icon.\n\nRequest: ${text}\n",
  "translate_strings_prompt.in": "You are a professional software localizer. Translate the user interface strings in the JSON below from ${source_language} to ${target_language}.\n\nRequirements:\n- Return only a JSON object with exactly the same keys and nesting as the input, and no markdown fences.\n- Translate only the string values. Keep placeholders such as {name}, {{count}}, %s, %d and {0}, and any HTML tags, exactly as they are.\n- Use natural, concise wording that fits buttons, labels and messages; keep brand and product names untranslated.\n\nStrings:\n${text}\n",
  "unit_tests_prompt.in": "You are an expert in automated testing. Write ${framework} unit tests for the code below.\n\nRequirements:\n- Return only the complete test file inside a single markdown code block. No explanation.\n- Cover the normal behaviour, edge cases and error handling of every exported function or component.\n- Import the code under test from \"${module_path}\" and keep each test independent, readable and deterministic (mock network, time and randomness).\n\nCode:\n${text}\n"
};

},{}],33:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { newId } = require('./VectorStore');

/**
 * Where an Assistant keeps its conversations. Messages are { id, role: 'user' | 'assistant', content, createdAt,
 * metadata? }; conversations are { id, title, userId, createdAt, updatedAt, metadata }.
 *
 * Implementations: MemoryChatHistory (in process), FileChatHistory (JSON files, Node), FirestoreChatHistory (Google
 * Cloud Firestore). Write your own by extending ChatHistory and implementing the six methods.
 */
class ChatHistory {
  /** The last `limit` messages of a conversation, oldest first. */
  async getMessages() {
    throw new Error(`${this.constructor.name}.getMessages is not implemented.`);
  }

  /** Append messages; fills id and createdAt and updates the conversation's updatedAt. Returns the stored messages. */
  async addMessages() {
    throw new Error(`${this.constructor.name}.addMessages is not implemented.`);
  }

  async getConversation() {
    throw new Error(`${this.constructor.name}.getConversation is not implemented.`);
  }

  /** Create or update a conversation's fields (title, userId, metadata). */
  async saveConversation() {
    throw new Error(`${this.constructor.name}.saveConversation is not implemented.`);
  }

  /** Conversations, most recently updated first; { userId } keeps one user's. */
  async listConversations() {
    throw new Error(`${this.constructor.name}.listConversations is not implemented.`);
  }

  async deleteConversation() {
    throw new Error(`${this.constructor.name}.deleteConversation is not implemented.`);
  }

  /** Remove the last `count` messages (used to regenerate an answer). */
  async deleteLastMessages() {
    throw new Error(`${this.constructor.name}.deleteLastMessages is not implemented.`);
  }

  static _stamp(messages) {
    const now = new Date().toISOString();
    return (messages || []).map((message) => ({
      id: message.id || newId(),
      role: message.role,
      content: message.content === undefined || message.content === null ? '' : String(message.content),
      createdAt: message.createdAt || now,
      ...(message.metadata && Object.keys(message.metadata).length && { metadata: message.metadata }),
    }));
  }

  static _conversation(id, existing, fields = {}) {
    const now = new Date().toISOString();
    return {
      id,
      title: fields.title !== undefined ? fields.title : (existing && existing.title) || null,
      userId: fields.userId !== undefined ? fields.userId : (existing && existing.userId) || null,
      createdAt: (existing && existing.createdAt) || now,
      updatedAt: now,
      metadata: { ...((existing && existing.metadata) || {}), ...(fields.metadata || {}) },
    };
  }
}

/** Conversations in process memory (lost on restart). */
class MemoryChatHistory extends ChatHistory {
  constructor() {
    super();
    this.conversations = new Map();
  }

  _entry(id) {
    if (!this.conversations.has(id)) this.conversations.set(id, { conversation: ChatHistory._conversation(id, null), messages: [] });
    return this.conversations.get(id);
  }

  async getMessages(conversationId, { limit = null } = {}) {
    const entry = this.conversations.get(conversationId);
    if (!entry) return [];
    return limit ? entry.messages.slice(-limit) : [...entry.messages];
  }

  async addMessages(conversationId, messages) {
    const entry = this._entry(conversationId);
    const stamped = ChatHistory._stamp(messages);
    entry.messages.push(...stamped);
    entry.conversation = ChatHistory._conversation(conversationId, entry.conversation);
    return stamped;
  }

  async getConversation(conversationId) {
    const entry = this.conversations.get(conversationId);
    return entry ? { ...entry.conversation, messageCount: entry.messages.length } : null;
  }

  async saveConversation(conversation) {
    const entry = this._entry(conversation.id);
    entry.conversation = ChatHistory._conversation(conversation.id, entry.conversation, conversation);
    return entry.conversation;
  }

  async listConversations({ userId = null, limit = 50 } = {}) {
    return [...this.conversations.values()]
      .map((entry) => entry.conversation)
      .filter((conversation) => !userId || conversation.userId === userId)
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
      .slice(0, limit);
  }

  async deleteConversation(conversationId) {
    this.conversations.delete(conversationId);
  }

  async deleteLastMessages(conversationId, count = 1) {
    const entry = this.conversations.get(conversationId);
    if (entry) entry.messages.splice(Math.max(0, entry.messages.length - count), count);
  }
}

/**
 * Conversations as JSON files in a directory (Node only), one file per conversation. Good for local apps,
 * desktop tools and development; use FirestoreChatHistory (or your database) for multi-user servers.
 */
class FileChatHistory extends ChatHistory {
  constructor({ dir = '.intellinode/conversations' } = {}) {
    super();
    this.dir = dir;
  }

  _file(conversationId) {
    const safe = String(conversationId).replace(/[^A-Za-z0-9_.-]/g, '_');
    if (!safe || safe === '.' || safe === '..') throw new Error(`Invalid conversation id '${conversationId}'.`);
    return require('path').join(this.dir, `${safe}.json`);
  }

  async _read(conversationId) {
    try {
      return JSON.parse(await require('fs').promises.readFile(this._file(conversationId), 'utf8'));
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  }

  async _write(conversationId, data) {
    const fs = require('fs');
    await fs.promises.mkdir(this.dir, { recursive: true });
    const file = this._file(conversationId);
    await fs.promises.writeFile(`${file}.tmp`, JSON.stringify(data, null, 2));
    await fs.promises.rename(`${file}.tmp`, file);
  }

  async getMessages(conversationId, { limit = null } = {}) {
    const data = await this._read(conversationId);
    if (!data) return [];
    return limit ? data.messages.slice(-limit) : data.messages;
  }

  async addMessages(conversationId, messages) {
    const data = (await this._read(conversationId)) || { conversation: null, messages: [] };
    const stamped = ChatHistory._stamp(messages);
    data.messages.push(...stamped);
    data.conversation = ChatHistory._conversation(conversationId, data.conversation);
    await this._write(conversationId, data);
    return stamped;
  }

  async getConversation(conversationId) {
    const data = await this._read(conversationId);
    return data ? { ...data.conversation, messageCount: data.messages.length } : null;
  }

  async saveConversation(conversation) {
    const data = (await this._read(conversation.id)) || { conversation: null, messages: [] };
    data.conversation = ChatHistory._conversation(conversation.id, data.conversation, conversation);
    await this._write(conversation.id, data);
    return data.conversation;
  }

  async listConversations({ userId = null, limit = 50 } = {}) {
    const fs = require('fs');
    let files;
    try {
      files = (await fs.promises.readdir(this.dir)).filter((file) => file.endsWith('.json'));
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
    const conversations = [];
    for (const file of files) {
      try {
        const data = JSON.parse(await fs.promises.readFile(require('path').join(this.dir, file), 'utf8'));
        if (data.conversation && (!userId || data.conversation.userId === userId)) conversations.push(data.conversation);
      } catch (error) {
        // skip a file that is being written or is not a conversation
      }
    }
    return conversations.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))).slice(0, limit);
  }

  async deleteConversation(conversationId) {
    await require('fs').promises.rm(this._file(conversationId), { force: true });
  }

  async deleteLastMessages(conversationId, count = 1) {
    const data = await this._read(conversationId);
    if (!data) return;
    data.messages.splice(Math.max(0, data.messages.length - count), count);
    await this._write(conversationId, data);
  }
}

module.exports = { ChatHistory, MemoryChatHistory, FileChatHistory };

},{"./VectorStore":46,"fs":24,"path":29}],34:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('../utils/FetchClient');
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');

// Chroma rejects a where clause with more than one key unless the conditions are wrapped in $and.
function toChromaWhere(filter) {
  const clauses = Object.entries(filter || {}).map(([key, value]) => ({
    [key]: Array.isArray(value) ? { $in: value } : { $eq: value },
  }));
  if (clauses.length === 0) return null;
  return clauses.length === 1 ? clauses[0] : { $and: clauses };
}

// The distance space of a collection; Chroma's default is l2.
function collectionSpace(collection) {
  const config = collection.configuration_json || {};
  return (config.hnsw && config.hnsw.space)
    || (config.spann && config.spann.space)
    || (collection.metadata && collection.metadata['hnsw:space'])
    || 'l2';
}

// upsert and delete answer {} or { deleted } depending on the server version; only errors matter
function parseText(text) {
  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    return {};
  }
}

function chromaError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `Chroma error: ${wrapped.message}`;
  return wrapped;
}

/**
 * A Chroma server (self-hosted or Chroma Cloud) through the v2 REST API.
 *
 *   const store = new ChromaVectorStore({ url: 'http://localhost:8000', collection: 'docs', embedder });
 *
 * The collection is fetched or created by name (with the cosine space) on first use. Scores are converted from
 * the collection's distance: cosine and ip give 1 - distance, l2 gives 1 / (1 + distance).
 * filter becomes a where clause ($eq / $in, joined by $and); nativeFilter is a Chroma where clause.
 * Chroma metadata values must be strings, numbers, booleans or arrays of them (no nested objects).
 */
class ChromaVectorStore extends VectorStore {
  // API: https://docs.trychroma.com/reference/chroma-api/record/query-collection
  /**
   * @param {object} options - { url = 'http://localhost:8000', collection, tenant = 'default_tenant',
   *   database = 'default_database', apiKey (Chroma Cloud, sent as x-chroma-token), space = 'cosine' (for a new
   *   collection), batchSize = 1000, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.collection) throw new Error('ChromaVectorStore needs a collection name.');
    this.collection = options.collection;
    this.tenant = options.tenant || 'default_tenant';
    this.database = options.database || 'default_database';
    this.space = options.space || 'cosine';
    this.batchSize = options.batchSize || 1000;
    this.collectionId = null;
    this._ready = null;
    const headers = { 'Content-Type': 'application/json' };
    if (options.apiKey) headers['x-chroma-token'] = options.apiKey;
    this.client = new FetchClient({ baseURL: String(options.url || 'http://localhost:8000').replace(/\/+$/, ''), headers });
  }

  /** Get or create the collection by name; returns its id. */
  async getCollection() {
    if (!this._ready) {
      this._ready = this._request('POST', `${this._databasePath()}/collections`, {
        name: this.collection,
        metadata: { 'hnsw:space': this.space },
        get_or_create: true,
      }).then((collection) => {
        this.collectionId = collection.id;
        this.space = collectionSpace(collection);
        return collection.id;
      }).catch((error) => {
        this._ready = null;
        throw error;
      });
    }
    return this._ready;
  }

  async upsert(records) {
    const items = toItems(records);
    if (items.length === 0) return [];
    const path = await this._collectionPath();
    for (let start = 0; start < items.length; start += this.batchSize) {
      const batch = items.slice(start, start + this.batchSize);
      await this._request('POST', `${path}/upsert`, {
        ids: batch.map((item) => item.id),
        embeddings: batch.map((item) => item.vector),
        documents: batch.map((item) => item.text),
        // older Chroma servers reject an empty metadata object
        metadatas: batch.map((item) => (Object.keys(item.metadata).length > 0 ? item.metadata : null)),
      }, { responseType: 'text' });
    }
    return items.map((item) => item.id);
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const path = await this._collectionPath();
    const where = params.nativeFilter || toChromaWhere(params.filter);
    const body = { query_embeddings: [vector], n_results: params.topK || 5, include: ['documents', 'metadatas', 'distances'] };
    if (where) body.where = where;
    const data = await this._request('POST', `${path}/query`, body);
    const first = (list) => (Array.isArray(list) && Array.isArray(list[0]) ? list[0] : []);
    const documents = first(data.documents);
    const metadatas = first(data.metadatas);
    const distances = first(data.distances);
    return first(data.ids).map((id, index) => ({
      id,
      score: this._score(distances[index]),
      text: documents[index] ?? null,
      metadata: metadatas[index] || {},
    })).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const list = (ids || []).map(String);
    if (list.length === 0) return;
    const path = await this._collectionPath();
    for (let start = 0; start < list.length; start += this.batchSize) {
      await this._request('POST', `${path}/delete`, { ids: list.slice(start, start + this.batchSize) }, { responseType: 'text' });
    }
  }

  // cosine distance is 1 - cos and ip distance is 1 - dot; l2 is the squared euclidean distance
  _score(distance) {
    return this.space === 'l2' ? 1 / (1 + distance) : 1 - distance;
  }

  _databasePath() {
    return `/api/v2/tenants/${encodeURIComponent(this.tenant)}/databases/${encodeURIComponent(this.database)}`;
  }

  async _collectionPath() {
    const id = await this.getCollection();
    return `${this._databasePath()}/collections/${encodeURIComponent(id)}`;
  }

  async _request(method, path, body, extraConfig = {}) {
    try {
      const data = await this.client.request(method, path, body, extraConfig);
      return extraConfig.responseType === 'text' ? parseText(data) : data;
    } catch (error) {
      throw chromaError(error);
    }
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

module.exports = { ChromaVectorStore };

},{"../utils/ConnHelper":52,"../utils/FetchClient":53,"./VectorStore":46}],35:[function(require,module,exports){
(function (Buffer){(function (){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('../utils/FetchClient');
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');

const RETRY_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

/**
 * FetchClient JSON-encodes every body, but _bulk takes NDJSON: this client sends a string body as is (with the
 * same headers, timeout, retries and signal) and leaves every other request to FetchClient.
 */
class NdjsonFetchClient extends FetchClient {
  async request(method, endpoint, data, extraConfig = {}) {
    if (typeof data !== 'string') return super.request(method, endpoint, data, extraConfig);
    const fetch = require('cross-fetch');
    const url = endpoint.startsWith('http') ? endpoint : this.baseURL + endpoint;
    const headers = { ...this.defaultHeaders, 'Content-Type': 'application/x-ndjson', ...(extraConfig.headers || {}) };
    const options = this.resolveOptions(extraConfig);
    const aborted = () => Object.assign(new Error('The request was aborted.'), { name: 'AbortError', code: 'ABORT_ERR' });
    for (let attempt = 0; ; attempt++) {
      if (options.signal && options.signal.aborted) throw aborted();
      const controller = new AbortController();
      const abort = () => controller.abort();
      if (options.signal) options.signal.addEventListener('abort', abort, { once: true });
      let timedOut = false;
      const timer = options.timeout ? setTimeout(() => { timedOut = true; abort(); }, options.timeout) : null;
      let response;
      let text;
      try {
        response = await fetch(url, { method, headers, body: data, signal: controller.signal });
        text = await response.text();
      } catch (error) {
        if (options.signal && options.signal.aborted) throw aborted();
        if (attempt < options.retries) {
          await new Promise((resolve) => setTimeout(resolve, options.retryDelay * (2 ** attempt)));
          continue;
        }
        if (timedOut) throw Object.assign(new Error(`Request timed out after ${options.timeout}ms: ${url}`), { code: 'ETIMEDOUT' });
        throw error;
      } finally {
        if (timer) clearTimeout(timer);
        if (options.signal) options.signal.removeEventListener('abort', abort);
      }
      if (response.ok) return text ? JSON.parse(text) : {};
      if (attempt < options.retries && RETRY_STATUSES.has(response.status)) {
        await new Promise((resolve) => setTimeout(resolve, options.retryDelay * (2 ** attempt)));
        continue;
      }
      throw Object.assign(new Error(`HTTP error ${response.status}: ${text}`), { status: response.status, body: text });
    }
  }
}

function toBase64(text) {
  if (typeof Buffer !== 'undefined') return Buffer.from(text, 'utf8').toString('base64');
  return btoa(unescape(encodeURIComponent(text)));
}

function toElasticFilter(filter) {
  const clauses = Object.entries(filter || {}).map(([key, value]) => (
    Array.isArray(value) ? { terms: { [`metadata.${key}`]: value } } : { term: { [`metadata.${key}`]: value } }
  ));
  return clauses.length > 0 ? { bool: { filter: clauses } } : null;
}

function elasticError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `Elasticsearch error: ${wrapped.message}`;
  return wrapped;
}

/**
 * An Elasticsearch index (self-managed, Elastic Cloud or Serverless) with a dense_vector field, through the REST API.
 *
 *   const store = new ElasticsearchVectorStore({ url: 'https://my-deployment.es.io', apiKey, index: 'docs', embedder });
 *
 * A missing index is created on the first upsert: the vector field (dense_vector, index: true, similarity cosine),
 * `text`, and `metadata` whose string values are mapped as keyword so filters match exact values. Upserts and
 * deletes go through _bulk; queries use the top-level knn search. Elasticsearch scores cosine and dot_product as
 * (1 + cos) / 2, which is converted back to the cosine similarity; l2_norm keeps 1 / (1 + distance^2).
 * filter becomes term / terms clauses on metadata.<key>; nativeFilter is a query DSL filter for knn.filter.
 */
class ElasticsearchVectorStore extends VectorStore {
  // API: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/dense-vector
  /**
   * @param {object} options - { url = 'http://localhost:9200', apiKey (the encoded API key, sent as
   *   Authorization: ApiKey), username, password, index, dimension, similarity = 'cosine', createIndex = true,
   *   vectorField = 'embedding', refresh = 'wait_for' (false to skip waiting), numCandidates (default 10 x topK,
   *   at least 100), batchSize = 500, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.index) throw new Error('ElasticsearchVectorStore needs an index name.');
    this.index = options.index;
    this.dimension = options.dimension || null;
    this.similarity = options.similarity || 'cosine';
    this.createIndex = options.createIndex !== false;
    this.vectorField = options.vectorField || 'embedding';
    this.refresh = options.refresh === undefined ? 'wait_for' : options.refresh;
    this.numCandidates = options.numCandidates || null;
    this.batchSize = options.batchSize || 500;
    this._ready = null;
    const headers = { 'Content-Type': 'application/json' };
    if (options.apiKey) headers.Authorization = `ApiKey ${options.apiKey}`;
    else if (options.username) headers.Authorization = `Basic ${toBase64(`${options.username}:${options.password || ''}`)}`;
    this.client = new NdjsonFetchClient({ baseURL: String(options.url || 'http://localhost:9200').replace(/\/+$/, ''), headers });
  }

  /** Create the index with the vector mapping when it does not exist. Returns true when it was created. */
  async ensureIndex(dimension = this.dimension) {
    if (await this._exists()) return false;
    if (!dimension) throw new Error(`Elasticsearch index '${this.index}' does not exist and no dimension is known to create it.`);
    try {
      await this._request('PUT', this._path(), {
        mappings: {
          dynamic_templates: [{
            metadata_strings: { path_match: 'metadata.*', match_mapping_type: 'string', mapping: { type: 'keyword' } },
          }],
          properties: {
            [this.vectorField]: { type: 'dense_vector', dims: dimension, index: true, similarity: this.similarity },
            text: { type: 'text' },
            metadata: { type: 'object' },
          },
        },
      });
    } catch (error) {
      // resource_already_exists_exception: created meanwhile by another call
      if (await this._exists().catch(() => false)) return false;
      throw error;
    }
    return true;
  }

  async upsert(records) {
    const items = toItems(records);
    if (items.length === 0) return [];
    if (this.createIndex) await this._prepare(items[0].vector.length);
    for (let start = 0; start < items.length; start += this.batchSize) {
      const lines = [];
      for (const item of items.slice(start, start + this.batchSize)) {
        lines.push(JSON.stringify({ index: { _index: this.index, _id: item.id } }));
        lines.push(JSON.stringify({ text: item.text, metadata: item.metadata, [this.vectorField]: item.vector }));
      }
      await this._bulk(lines);
    }
    return items.map((item) => item.id);
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const topK = params.topK || 5;
    const knn = {
      field: this.vectorField,
      query_vector: vector,
      k: topK,
      num_candidates: Math.min(10000, Math.max(topK, this.numCandidates || Math.max(100, topK * 10))),
    };
    const filter = params.nativeFilter || toElasticFilter(params.filter);
    if (filter) knn.filter = filter;
    const data = await this._request('POST', `${this._path()}/_search`, { knn, size: topK, _source: { excludes: [this.vectorField] } });
    const hits = (data && data.hits && data.hits.hits) || [];
    return hits.map((hit) => {
      const source = hit._source || {};
      return { id: hit._id, score: this._score(hit._score), text: source.text ?? null, metadata: source.metadata || {} };
    }).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const list = (ids || []).map(String);
    for (let start = 0; start < list.length; start += this.batchSize) {
      await this._bulk(list.slice(start, start + this.batchSize).map((id) => JSON.stringify({ delete: { _index: this.index, _id: id } })));
    }
  }

  _score(score) {
    return this.similarity === 'cosine' || this.similarity === 'dot_product' ? 2 * score - 1 : score;
  }

  _path() {
    return `/${encodeURIComponent(this.index)}`;
  }

  async _exists() {
    try {
      await this._request('HEAD', this._path(), undefined, { responseType: 'text' });
      return true;
    } catch (error) {
      if (error.status === 404) return false;
      throw error;
    }
  }

  _prepare(dimension) {
    if (!this._ready) {
      this._ready = this.ensureIndex(this.dimension || dimension).catch((error) => {
        this._ready = null;
        throw error;
      });
    }
    return this._ready;
  }

  // _bulk answers 200 and reports failures per item; a delete of a missing id is not a failure.
  async _bulk(lines) {
    const refresh = this.refresh ? `?refresh=${encodeURIComponent(this.refresh)}` : '';
    const data = await this._request('POST', `/_bulk${refresh}`, `${lines.join('\n')}\n`);
    if (!data || !data.errors) return data;
    for (const item of data.items || []) {
      const [action, result] = Object.entries(item)[0] || [];
      if (!result || !result.error || (action === 'delete' && result.status === 404)) continue;
      const reason = result.error.reason || result.error.type || JSON.stringify(result.error);
      const error = new Error(`Elasticsearch error: ${action} ${result._id}: ${reason}`);
      error.status = result.status;
      error.body = JSON.stringify(result.error);
      throw error;
    }
    return data;
  }

  async _request(method, path, body, extraConfig = {}) {
    try {
      return await this.client.request(method, path, body, extraConfig);
    } catch (error) {
      throw elasticError(error);
    }
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

module.exports = { ElasticsearchVectorStore };

}).call(this)}).call(this,require("buffer").Buffer)
},{"../utils/ConnHelper":52,"../utils/FetchClient":53,"./VectorStore":46,"buffer":25,"cross-fetch":26}],36:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const EmbedInput = require('../model/input/EmbedInput');

// Providers that embed documents and queries differently, and the value each one expects.
const KIND_INPUT_TYPES = {
  cohere: { document: 'search_document', query: 'search_query' },
  nvidia: { document: 'passage', query: 'query' },
};
const GEMINI_TASK_TYPES = { document: 'RETRIEVAL_DOCUMENT', query: 'RETRIEVAL_QUERY' };
const GOOGLE_PROVIDERS = new Set(['gemini', 'google', 'vertex']);

/**
 * Turns texts into vectors with any IntelliNode embedding provider, for the vector stores and the Assistant.
 *
 *   new Embedder({ provider: 'openai', apiKey })
 *   new Embedder({ provider: 'gemini', apiKey, options: { vertex: true } })      // Gemini Developer API or Vertex AI
 *   new Embedder({ provider: 'ollama', options: { baseUrl: 'http://localhost:11434/v1' }, model: 'nomic-embed-text' })
 *
 * Gemini and Cohere embed documents and search queries differently; embed(texts, { kind: 'query' }) selects that.
 */
class Embedder {
  /**
   * @param {object} settings - { provider = 'openai', apiKey, model, dimensions, batchSize, options }.
   *   options holds the provider settings: Google { vertex, projectId, location, accessToken, credentials },
   *   OpenAI-compatible / vLLM { baseUrl, headers }, or an OpenAI proxy helper as options.customProxyHelper.
   */
  constructor({ provider = 'openai', apiKey = null, model = null, dimensions = null, batchSize = null, options = {} } = {}) {
    this.provider = String(provider).toLowerCase();
    this.model = model;
    this.dimensions = dimensions;
    this.options = options || {};
    if (GOOGLE_PROVIDERS.has(this.provider)) {
      const GoogleAIWrapper = require('../wrappers/GoogleAIWrapper');
      const googleOptions = this.provider === 'vertex' ? { vertex: true, ...this.options } : this.options;
      this.google = GoogleAIWrapper.fromOptions(apiKey, googleOptions);
      this.batchSize = batchSize || 100;
    } else {
      const { RemoteEmbedModel } = require('../controller/RemoteEmbedModel');
      const helper = this.options.customProxyHelper
        || (this.options.baseUrl || this.options.headers ? { baseUrl: this.options.baseUrl, headers: this.options.headers } : null);
      this.remote = new RemoteEmbedModel(apiKey, this.provider, helper);
      // Cohere accepts at most 96 texts per call
      this.batchSize = batchSize || 96;
    }
  }

  /** Embed a list of texts. kind: 'document' (default) or 'query'. Returns number[][] in the same order. */
  async embed(texts, { kind = 'document' } = {}) {
    const list = (Array.isArray(texts) ? texts : [texts]).map((text) => String(text));
    const vectors = [];
    for (let start = 0; start < list.length; start += this.batchSize) {
      vectors.push(...await this._embedBatch(list.slice(start, start + this.batchSize), kind));
    }
    return vectors;
  }

  async _embedBatch(texts, kind) {
    if (this.google) {
      return this.google.embedTexts(texts, this.model, {
        taskType: GEMINI_TASK_TYPES[kind] || null,
        outputDimensionality: this.dimensions,
      });
    }
    const inputTypes = KIND_INPUT_TYPES[this.provider];
    const input = new EmbedInput({ texts, model: this.model, inputType: inputTypes ? inputTypes[kind] : null });
    if (!this.model) input.setDefaultValues(this.provider);
    const raw = this.provider === 'openai' && this.dimensions
      ? { ...input.getOpenAIInputs(), dimensions: this.dimensions }
      : input;
    const results = await this.remote.getEmbeddings(raw);
    const items = Array.isArray(results) ? results : (results && results.data) || [];
    // OpenAI-style results carry an index; keep the input order
    const ordered = items.every((item) => item && typeof item.index === 'number')
      ? [...items].sort((a, b) => a.index - b.index)
      : items;
    return ordered.map((item) => (Array.isArray(item) ? item : item.embedding || item.values));
  }
}

/** An Embedder from an Embedder, a function (texts, { kind }) => vectors, an object with embed(), or settings. */
function toEmbedder(value) {
  if (!value) return null;
  if (typeof value === 'function') return { embed: (texts, opts) => value(texts, opts || {}) };
  if (typeof value.embed === 'function') return value;
  if (typeof value === 'object' && value.provider) return new Embedder(value);
  throw new Error('embedder must be an Embedder, a function (texts) => vectors, or { provider, apiKey, model, options }.');
}

module.exports = { Embedder, toEmbedder };

},{"../controller/RemoteEmbedModel":2,"../model/input/EmbedInput":16,"../wrappers/GoogleAIWrapper":70}],37:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
// API: Firestore REST v1 (documents:commit, runQuery, runAggregationQuery)
const { ChatHistory } = require('./ChatHistory');
const { GoogleCloudService, Firestore } = require('./GoogleCloud');

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';
const BATCH = 500;

/**
 * Conversations in Google Cloud Firestore, for multi-user Gemini / ChatGPT-style apps:
 *   <collection>/{conversationId}                 { title, userId, createdAt, updatedAt, metadata }
 *   <collection>/{conversationId}/messages/{id}   { role, content, createdAt, seq, metadata }
 *
 * No composite index is needed. Credentials: OAuth (accessToken, a service account, or
 * `gcloud auth application-default login`).
 */
class FirestoreChatHistory extends ChatHistory {
  /** @param {object} options - { projectId, database = '(default)', collection = 'conversations', accessToken, credentials }. */
  constructor(options = {}) {
    super();
    this.service = new GoogleCloudService({ ...options, label: 'Firestore' });
    this.client = this.service.client;
    this.database = options.database || '(default)';
    this.collection = options.collection || 'conversations';
  }

  async _root() {
    return `projects/${await this.service._project()}/databases/${this.database}/documents`;
  }

  async _conversationName(conversationId) {
    return `${await this._root()}/${this.collection}/${Firestore.docId(conversationId)}`;
  }

  async _commit(writes) {
    const url = `${FIRESTORE_BASE}/${await this._root()}:commit`;
    for (let start = 0; start < writes.length; start += BATCH) {
      await this.service._request('POST', url, { writes: writes.slice(start, start + BATCH) });
    }
  }

  async _runQuery(parent, structuredQuery) {
    const rows = await this.service._request('POST', `${FIRESTORE_BASE}/${parent}:runQuery`, { structuredQuery });
    return (Array.isArray(rows) ? rows : [rows]).filter((row) => row && row.document).map((row) => row.document);
  }

  static _message(document) {
    const data = Firestore.fromFields(document.fields);
    return {
      id: data.id || decodeURIComponent(document.name.split('/').pop()),
      role: data.role,
      content: data.content || '',
      createdAt: data.createdAt,
      ...(data.metadata && Object.keys(data.metadata).length && { metadata: data.metadata }),
    };
  }

  // Newest messages first: [{ name, ...message }].
  async _latest(conversationId, limit) {
    const documents = await this._runQuery(await this._conversationName(conversationId), {
      from: [{ collectionId: 'messages' }],
      orderBy: [{ field: { fieldPath: 'seq' }, direction: 'DESCENDING' }],
      ...(limit && { limit }),
    });
    return documents.map((document) => ({ name: document.name, ...FirestoreChatHistory._message(document) }));
  }

  async getMessages(conversationId, { limit = null } = {}) {
    const latest = await this._latest(conversationId, limit);
    return latest.reverse().map(({ name, ...message }) => message);
  }

  async addMessages(conversationId, messages) {
    const conversationName = await this._conversationName(conversationId);
    const stamped = ChatHistory._stamp(messages);
    const base = Date.now() * 100;
    const writes = stamped.map((message, index) => ({
      update: {
        name: `${conversationName}/messages/${Firestore.docId(message.id)}`,
        fields: Firestore.toFields({ ...message, seq: base + index }),
      },
    }));
    // touching updatedAt only (the conversation keeps its other fields)
    writes.push({
      update: { name: conversationName, fields: Firestore.toFields({ updatedAt: new Date().toISOString() }) },
      updateMask: { fieldPaths: ['updatedAt'] },
    });
    await this._commit(writes);
    return stamped;
  }

  async getConversation(conversationId) {
    const name = await this._conversationName(conversationId);
    let document;
    try {
      document = await this.service._request('GET', `${FIRESTORE_BASE}/${name}`);
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
    const data = Firestore.fromFields(document.fields);
    const count = await this.service._request('POST', `${FIRESTORE_BASE}/${name}:runAggregationQuery`, {
      structuredAggregationQuery: {
        structuredQuery: { from: [{ collectionId: 'messages' }] },
        aggregations: [{ alias: 'count', count: {} }],
      },
    }).catch(() => null);
    const aggregate = Array.isArray(count) && count[0] && count[0].result && count[0].result.aggregateFields;
    return {
      id: conversationId,
      title: data.title || null,
      userId: data.userId || null,
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null,
      metadata: data.metadata || {},
      ...(aggregate && aggregate.count && { messageCount: Number(Firestore.fromValue(aggregate.count)) }),
    };
  }

  async saveConversation(conversation) {
    const existing = await this.getConversation(conversation.id);
    const merged = ChatHistory._conversation(conversation.id, existing, conversation);
    const { id, ...fields } = merged;
    await this._commit([{ update: { name: await this._conversationName(conversation.id), fields: Firestore.toFields(fields) } }]);
    return merged;
  }

  async listConversations({ userId = null, limit = 50 } = {}) {
    const root = await this._root();
    // userId equality without orderBy needs no composite index; sorting happens here
    const documents = await this._runQuery(root, {
      from: [{ collectionId: this.collection }],
      ...(userId
        ? { where: Firestore.where({ userId }), limit: 500 }
        : { orderBy: [{ field: { fieldPath: 'updatedAt' }, direction: 'DESCENDING' }], limit }),
    });
    return documents
      .map((document) => {
        const data = Firestore.fromFields(document.fields);
        return {
          id: decodeURIComponent(document.name.split('/').pop()),
          title: data.title || null,
          userId: data.userId || null,
          createdAt: data.createdAt || null,
          updatedAt: data.updatedAt || null,
          metadata: data.metadata || {},
        };
      })
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
      .slice(0, limit);
  }

  async deleteConversation(conversationId) {
    const latest = await this._latest(conversationId, null);
    const writes = latest.map((message) => ({ delete: message.name }));
    writes.push({ delete: await this._conversationName(conversationId) });
    await this._commit(writes);
  }

  async deleteLastMessages(conversationId, count = 1) {
    const latest = await this._latest(conversationId, count);
    if (latest.length) await this._commit(latest.map((message) => ({ delete: message.name })));
  }
}

module.exports = { FirestoreChatHistory };

},{"./ChatHistory":33,"./GoogleCloud":39}],38:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
// API: https://cloud.google.com/firestore/native/docs/vector-search and the Firestore REST v1 reference
const { VectorStore } = require('./VectorStore');
const { GoogleCloudService, Firestore, FirestoreVector } = require('./GoogleCloud');

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';
// Firestore commits take at most 500 writes
const BATCH = 500;

/**
 * Vectors in Google Cloud Firestore (native vector search with findNearest), next to your app data.
 * Each record is a document { id, text, metadata, embedding }.
 *
 * Firestore needs a vector index on the embedding field before the first query, created once:
 *   gcloud firestore indexes composite create --collection-group=intellinode_vectors --query-scope=COLLECTION \
 *     --field-config field-path=embedding,vector-config='{"dimension":"768","flat":"{}"}' --database='(default)'
 * A metadata filter needs a composite index that also lists the metadata fields (metadata.<key>).
 * Credentials: OAuth (accessToken, a service account, or `gcloud auth application-default login`); API keys are not accepted.
 */
class FirestoreVectorStore extends VectorStore {
  /**
   * @param {object} options - { projectId, database = '(default)', collection = 'intellinode_vectors',
   *   vectorField = 'embedding', distanceMeasure = 'COSINE' (or 'EUCLIDEAN', 'DOT_PRODUCT'), accessToken,
   *   credentials, embedder }.
   */
  constructor(options = {}) {
    super(options);
    this.service = new GoogleCloudService({ ...options, label: 'Firestore' });
    this.client = this.service.client;
    this.database = options.database || '(default)';
    this.collection = options.collection || 'intellinode_vectors';
    this.vectorField = options.vectorField || 'embedding';
    this.distanceMeasure = options.distanceMeasure || 'COSINE';
  }

  async _root() {
    return `projects/${await this.service._project()}/databases/${this.database}/documents`;
  }

  async upsert(records) {
    const root = await this._root();
    const writes = (records || []).map((record) => {
      if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
      return {
        update: {
          name: `${root}/${this.collection}/${Firestore.docId(record.id)}`,
          fields: Firestore.toFields({
            id: String(record.id),
            text: record.text ?? null,
            metadata: record.metadata || {},
            [this.vectorField]: new FirestoreVector(record.vector),
          }),
        },
      };
    });
    await this._commit(writes);
    return (records || []).map((record) => String(record.id));
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const root = await this._root();
    const where = params.nativeFilter || Firestore.where(params.filter, 'metadata.');
    const body = {
      structuredQuery: {
        from: [{ collectionId: this.collection }],
        ...(where && { where }),
        findNearest: {
          vectorField: { fieldPath: this.vectorField },
          queryVector: Firestore.toValue(new FirestoreVector(vector)),
          distanceMeasure: this.distanceMeasure,
          limit: params.topK || 5,
          distanceResultField: '_distance',
        },
      },
    };
    const rows = await this.service._request('POST', `${FIRESTORE_BASE}/${root}:runQuery`, body);
    return (Array.isArray(rows) ? rows : [rows])
      .filter((row) => row && row.document)
      .map((row) => {
        const data = Firestore.fromFields(row.document.fields);
        return {
          id: data.id || decodeURIComponent(row.document.name.split('/').pop()),
          score: this._score(data._distance),
          text: data.text ?? null,
          metadata: data.metadata || {},
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  // Firestore returns distances: COSINE is 0..2 (0 = same), EUCLIDEAN grows with distance, DOT_PRODUCT grows with similarity.
  _score(distance) {
    if (typeof distance !== 'number') return 0;
    if (this.distanceMeasure === 'COSINE') return 1 - distance;
    if (this.distanceMeasure === 'EUCLIDEAN') return 1 / (1 + distance);
    return distance;
  }

  async delete(ids) {
    const root = await this._root();
    await this._commit((ids || []).map((id) => ({ delete: `${root}/${this.collection}/${Firestore.docId(id)}` })));
  }

  async _commit(writes) {
    if (!writes.length) return;
    const url = `${FIRESTORE_BASE}/projects/${await this.service._project()}/databases/${this.database}/documents:commit`;
    for (let start = 0; start < writes.length; start += BATCH) {
      await this.service._request('POST', url, { writes: writes.slice(start, start + BATCH) });
    }
  }

  /** The gcloud command that creates the vector index this store needs. */
  indexCommand(dimension) {
    return `gcloud firestore indexes composite create --collection-group=${this.collection} --query-scope=COLLECTION `
      + `--field-config field-path=${this.vectorField},vector-config='{"dimension":"${dimension}","flat":"{}"}' --database='${this.database}'`;
  }
}

module.exports = { FirestoreVectorStore };

},{"./GoogleCloud":39,"./VectorStore":46}],39:[function(require,module,exports){
(function (process){(function (){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('../utils/FetchClient');
const connHelper = require('../utils/ConnHelper');

/**
 * Shared plumbing for the Google Cloud stores (Firestore, RAG Engine, Vector Search): OAuth headers and one
 * FetchClient. These APIs reject API keys, so credentials come from an access token, a service account or
 * Application Default Credentials (`gcloud auth application-default login`), see utils/GoogleAuth.js.
 */
class GoogleCloudService {
  constructor({ projectId = null, accessToken = null, credentials = null, quotaProjectId = null, timeout, retries, label = 'Google Cloud' } = {}) {
    this.projectId = projectId || (typeof process !== 'undefined' && process.env ? process.env.GOOGLE_CLOUD_PROJECT || null : null);
    this.label = label;
    this.client = new FetchClient({ headers: { 'Content-Type': 'application/json' }, timeout, retries });
    this._accessToken = accessToken;
    this._credentials = credentials;
    this._quotaProjectId = quotaProjectId;
    this._auth = null;
  }

  async _headers() {
    if (this._accessToken) {
      const token = typeof this._accessToken === 'function' ? await this._accessToken() : this._accessToken;
      return { Authorization: `Bearer ${token}`, ...(this._quotaProjectId && { 'x-goog-user-project': this._quotaProjectId }) };
    }
    return this._getAuth().getHeaders();
  }

  _getAuth() {
    if (!this._auth) {
      const GoogleAuth = require('../utils/GoogleAuth');
      if (typeof GoogleAuth !== 'function') throw new Error(`${this.label} needs an accessToken in the browser.`);
      this._auth = new GoogleAuth({ credentials: this._credentials, quotaProjectId: this._quotaProjectId });
    }
    return this._auth;
  }

  async _project() {
    if (this.projectId) return this.projectId;
    if (!this._accessToken) this.projectId = await this._getAuth().getProjectId();
    if (!this.projectId) throw new Error(`${this.label} needs a projectId (or GOOGLE_CLOUD_PROJECT).`);
    return this.projectId;
  }

  async _request(method, url, body, extra = {}) {
    try {
      const headers = { ...(await this._headers()), ...(extra.headers || {}) };
      if (method === 'GET') return await this.client.get(url, { ...extra, headers });
      if (method === 'POST') return await this.client.post(url, body, { ...extra, headers });
      const text = await this.client.request(method, url, body, { ...extra, headers, responseType: 'text' });
      return text && String(text).trim() ? JSON.parse(text) : {};
    } catch (error) {
      const wrapped = connHelper.wrapError(error);
      wrapped.message = `${this.label} error: ${wrapped.message}`;
      throw wrapped;
    }
  }

  /** Poll a long-running operation until it is done; returns its response (or throws its error). */
  async waitForOperation(operation, operationUrl, { maxWaitMs = 600000, pollMs = 3000 } = {}) {
    let current = operation;
    const started = Date.now();
    while (!current.done) {
      if (Date.now() - started > maxWaitMs) throw new Error(`${this.label}: operation ${current.name} did not finish in time.`);
      await new Promise((resolve) => setTimeout(resolve, pollMs));
      current = await this._request('GET', operationUrl(current.name));
    }
    if (current.error) throw new Error(`${this.label} operation failed: ${JSON.stringify(current.error)}`);
    return current.response || current;
  }
}

// Firestore REST values <-> JavaScript values. Vectors use the map form the Firestore SDKs write.
const Firestore = {
  toValue(value) {
    if (value === null || value === undefined) return { nullValue: null };
    if (value instanceof FirestoreVector) {
      return { mapValue: { fields: { __type__: { stringValue: '__vector__' }, value: { arrayValue: { values: value.values.map((v) => ({ doubleValue: v })) } } } } };
    }
    if (typeof value === 'boolean') return { booleanValue: value };
    if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
    if (typeof value === 'string') return { stringValue: value };
    if (value instanceof Date) return { timestampValue: value.toISOString() };
    if (Array.isArray(value)) return { arrayValue: { values: value.map((item) => Firestore.toValue(item)) } };
    if (typeof value === 'object') return { mapValue: { fields: Firestore.toFields(value) } };
    return { stringValue: String(value) };
  },

  toFields(object) {
    const fields = {};
    for (const [key, value] of Object.entries(object || {})) {
      if (value !== undefined) fields[key] = Firestore.toValue(value);
    }
    return fields;
  },

  fromValue(value) {
    if (!value || typeof value !== 'object') return null;
    if ('nullValue' in value) return null;
    if ('booleanValue' in value) return value.booleanValue;
    if ('integerValue' in value) return Number(value.integerValue);
    if ('doubleValue' in value) return Number(value.doubleValue);
    if ('stringValue' in value) return value.stringValue;
    if ('timestampValue' in value) return value.timestampValue;
    if ('arrayValue' in value) return (value.arrayValue.values || []).map((item) => Firestore.fromValue(item));
    if ('mapValue' in value) {
      const fields = value.mapValue.fields || {};
      if (fields.__type__ && fields.__type__.stringValue === '__vector__') return Firestore.fromValue(fields.value);
      return Firestore.fromFields(fields);
    }
    if ('referenceValue' in value) return value.referenceValue;
    if ('geoPointValue' in value) return value.geoPointValue;
    if ('bytesValue' in value) return value.bytesValue;
    return null;
  },

  fromFields(fields) {
    const result = {};
    for (const [key, value] of Object.entries(fields || {})) result[key] = Firestore.fromValue(value);
    return result;
  },

  // A document id from any record id: '/' is not allowed in Firestore ids.
  docId(id) {
    const encoded = encodeURIComponent(String(id)).replace(/\./g, '%2E');
    if (!encoded || /^__.*__$/.test(encoded)) throw new Error(`Invalid Firestore document id '${id}'.`);
    return encoded;
  },

  // field filter(s) for metadata equality: { key: value } -> where clause on metadata.key
  where(filter, prefix = '') {
    const filters = Object.entries(filter || {}).map(([key, expected]) => ({
      fieldFilter: {
        field: { fieldPath: `${prefix}${Firestore.fieldPath(key)}` },
        op: Array.isArray(expected) ? 'IN' : 'EQUAL',
        value: Array.isArray(expected) ? { arrayValue: { values: expected.map((item) => Firestore.toValue(item)) } } : Firestore.toValue(expected),
      },
    }));
    if (!filters.length) return null;
    return filters.length === 1 ? filters[0] : { compositeFilter: { op: 'AND', filters } };
  },

  // A field path segment: simple names as is, others in backticks.
  fieldPath(name) {
    return /^[A-Za-z_][A-Za-z_0-9]*$/.test(name) ? name : `\`${String(name).replace(/[`\\]/g, '\\$&')}\``;
  },
};

class FirestoreVector {
  constructor(values) {
    this.values = values;
  }
}

module.exports = { GoogleCloudService, Firestore, FirestoreVector };

}).call(this)}).call(this,require('_process'))
},{"../utils/ConnHelper":52,"../utils/FetchClient":53,"../utils/GoogleAuth":23,"_process":30}],40:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { VectorStore, matchesFilter, cosineSimilarity } = require('./VectorStore');

/**
 * An in-process vector store (exact cosine search). Good for local apps, tests and a few thousand records.
 * With { path } (Node only) the records are kept in a JSON file and loaded on first use.
 *
 *   const store = new MemoryVectorStore({ embedder: { provider: 'openai', apiKey } });
 *   await store.addDocuments([{ text: 'IntelliNode supports Gemini.' }]);
 *   const hits = await store.search('Which models are supported?', 3);
 */
class MemoryVectorStore extends VectorStore {
  constructor(options = {}) {
    super(options);
    this.path = options.path || null;
    this.records = new Map();
    this._loaded = !this.path;
  }

  async upsert(records) {
    await this._load();
    for (const record of records || []) {
      if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
      const id = String(record.id);
      this.records.set(id, { id, vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} });
    }
    await this._save();
    return (records || []).map((record) => String(record.id));
  }

  async query(params = {}) {
    await this._load();
    const vector = await this._queryVector(params);
    const topK = params.topK || 5;
    const filter = params.nativeFilter || params.filter;
    const matches = [];
    for (const record of this.records.values()) {
      const passes = typeof filter === 'function' ? filter(record.metadata, record) : matchesFilter(record.metadata, filter);
      if (!passes) continue;
      matches.push({ id: record.id, score: cosineSimilarity(vector, record.vector), text: record.text, metadata: record.metadata });
    }
    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, topK);
  }

  async get(ids) {
    await this._load();
    return ids.map((id) => this.records.get(String(id))).filter(Boolean);
  }

  async delete(ids) {
    await this._load();
    for (const id of ids || []) this.records.delete(String(id));
    await this._save();
  }

  /** Delete every record (or only those whose metadata matches filter). */
  async clear(filter = null) {
    await this._load();
    if (!filter) {
      this.records.clear();
    } else {
      for (const [id, record] of this.records) {
        if (matchesFilter(record.metadata, filter)) this.records.delete(id);
      }
    }
    await this._save();
  }

  async count() {
    await this._load();
    return this.records.size;
  }

  async _load() {
    if (this._loaded) return;
    this._loaded = true;
    const fs = require('fs');
    if (!fs.promises || !this.path) return;
    try {
      const data = JSON.parse(await fs.promises.readFile(this.path, 'utf8'));
      for (const record of data.records || []) this.records.set(String(record.id), record);
    } catch (error) {
      if (error.code !== 'ENOENT') throw new Error(`Could not read the vector store file ${this.path}: ${error.message}`);
    }
  }

  async _save() {
    if (!this.path) return;
    const fs = require('fs');
    const path = require('path');
    await fs.promises.mkdir(path.dirname(this.path), { recursive: true });
    // write a temporary file first so a crash never leaves a half-written store
    const temporary = `${this.path}.tmp`;
    await fs.promises.writeFile(temporary, JSON.stringify({ version: 1, records: [...this.records.values()] }));
    await fs.promises.rename(temporary, this.path);
  }
}

module.exports = { MemoryVectorStore };

},{"./VectorStore":46,"fs":24,"path":29}],41:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('../utils/FetchClient');
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');

// Milvus string literals are double quoted with backslash escapes, which JSON.stringify produces.
function literal(value) {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error(`Milvus filters cannot take the number ${value}.`);
    return String(value);
  }
  if (typeof value === 'boolean') return String(value);
  return JSON.stringify(String(value));
}

function toMilvusFilter(filter) {
  const conditions = Object.entries(filter || {}).map(([key, value]) => {
    const field = `metadata[${JSON.stringify(key)}]`;
    return Array.isArray(value)
      ? `${field} in [${value.map(literal).join(', ')}]`
      : `${field} == ${literal(value)}`;
  });
  return conditions.length > 0 ? conditions.join(' and ') : null;
}

function parseMetadata(value) {
  if (!value) return {};
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return {};
  }
}

function milvusError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `Milvus error: ${wrapped.message}`;
  return wrapped;
}

/**
 * Milvus or Zilliz Cloud through the RESTful API v2.
 *
 *   const store = new MilvusVectorStore({ url: 'http://localhost:19530', token: 'root:Milvus', collection: 'docs', embedder });
 *
 * A missing collection is created on the first upsert with a VarChar primary key `id`, a FloatVector `vector`
 * (AUTOINDEX, COSINE), a VarChar `text` and a JSON `metadata` field; it is loaded right away. With COSINE (and IP)
 * Milvus returns the similarity itself in `distance`; L2 distances become 1 / (1 + distance).
 * filter becomes a boolean expression on the JSON field (metadata["key"] == "value", metadata["key"] in [...]);
 * nativeFilter is a Milvus expression string.
 */
class MilvusVectorStore extends VectorStore {
  // API: https://milvus.io/api-reference/restful/v2.6.x/v2/Vector%20(v2)/Search.md
  /**
   * @param {object} options - { url = 'http://localhost:19530', token ('user:password' or a Zilliz Cloud API key),
   *   collection, dbName, dimension, metricType = 'COSINE', createCollection = true, maxTextLength = 65535,
   *   consistencyLevel (e.g. 'Strong' to read your own writes), batchSize = 500, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.collection) throw new Error('MilvusVectorStore needs a collection name.');
    this.collection = options.collection;
    this.dbName = options.dbName || null;
    this.dimension = options.dimension || null;
    this.metricType = options.metricType || 'COSINE';
    this.createCollection = options.createCollection !== false;
    this.maxTextLength = options.maxTextLength || 65535;
    this.consistencyLevel = options.consistencyLevel || null;
    this.batchSize = options.batchSize || 500;
    this._ready = null;
    const headers = { 'Content-Type': 'application/json' };
    if (options.token) headers.Authorization = `Bearer ${options.token}`;
    this.client = new FetchClient({ baseURL: String(options.url || 'http://localhost:19530').replace(/\/+$/, ''), headers });
  }

  /** Create the collection when it does not exist. Returns true when it was created. */
  async ensureCollection(dimension = this.dimension) {
    if (await this._has()) return false;
    if (!dimension) throw new Error(`Milvus collection '${this.collection}' does not exist and no dimension is known to create it.`);
    try {
      await this._request('/v2/vectordb/collections/create', {
        schema: {
          autoId: false,
          fields: [
            { fieldName: 'id', dataType: 'VarChar', isPrimary: true, elementTypeParams: { max_length: 512 } },
            { fieldName: 'vector', dataType: 'FloatVector', elementTypeParams: { dim: String(dimension) } },
            { fieldName: 'text', dataType: 'VarChar', elementTypeParams: { max_length: this.maxTextLength } },
            { fieldName: 'metadata', dataType: 'JSON' },
          ],
        },
        indexParams: [{ fieldName: 'vector', indexName: 'vector', metricType: this.metricType, indexType: 'AUTOINDEX' }],
      });
    } catch (error) {
      if (await this._has().catch(() => false)) return false;
      throw error;
    }
    return true;
  }

  async upsert(records) {
    const items = lastById(toItems(records));
    if (items.length === 0) return [];
    if (this.createCollection) await this._prepare(items[0].vector.length);
    const rows = items.map((item) => ({ id: item.id, vector: item.vector, text: item.text ?? '', metadata: item.metadata }));
    for (let start = 0; start < rows.length; start += this.batchSize) {
      await this._request('/v2/vectordb/entities/upsert', { data: rows.slice(start, start + this.batchSize) });
    }
    return (records || []).map((record) => String(record.id));
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const filter = params.nativeFilter || toMilvusFilter(params.filter);
    const body = {
      data: [vector],
      annsField: 'vector',
      limit: params.topK || 5,
      outputFields: ['text', 'metadata'],
      searchParams: { metricType: this.metricType },
    };
    if (filter) body.filter = filter;
    if (this.consistencyLevel) body.consistencyLevel = this.consistencyLevel;
    const hits = await this._request('/v2/vectordb/entities/search', body);
    return (Array.isArray(hits) ? hits.flat() : []).map((hit) => ({
      id: String(hit.id),
      score: this.metricType === 'L2' ? 1 / (1 + hit.distance) : hit.distance,
      text: hit.text === '' || hit.text === undefined ? null : hit.text,
      metadata: parseMetadata(hit.metadata),
    })).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const list = (ids || []).map(String);
    for (let start = 0; start < list.length; start += this.batchSize) {
      const batch = list.slice(start, start + this.batchSize);
      await this._request('/v2/vectordb/entities/delete', { filter: `id in [${batch.map(literal).join(', ')}]` });
    }
  }

  async _has() {
    const data = await this._request('/v2/vectordb/collections/has', {});
    return Boolean(data && data.has);
  }

  _prepare(dimension) {
    if (!this._ready) {
      this._ready = this.ensureCollection(this.dimension || dimension).catch((error) => {
        this._ready = null;
        throw error;
      });
    }
    return this._ready;
  }

  // Every v2 call is a POST that answers HTTP 200 with { code, message } on failure, so check code too.
  async _request(path, body) {
    let response;
    try {
      response = await this.client.request('POST', path, {
        collectionName: this.collection,
        ...(this.dbName ? { dbName: this.dbName } : {}),
        ...body,
      });
    } catch (error) {
      throw milvusError(error);
    }
    if (response && response.code !== undefined && response.code !== 0 && response.code !== 200) {
      const error = new Error(`Milvus error: ${response.message || 'request failed'} (code ${response.code})`);
      error.body = JSON.stringify(response);
      throw error;
    }
    return response ? response.data : undefined;
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

// Milvus rejects a batch that repeats a primary key; the last record wins, like separate upserts.
function lastById(items) {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

module.exports = { MilvusVectorStore };

},{"../utils/ConnHelper":52,"../utils/FetchClient":53,"./VectorStore":46}],42:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');

function toAtlasFilter(filter) {
  const clauses = Object.entries(filter || {}).map(([key, value]) => ({
    [`metadata.${key}`]: Array.isArray(value) ? { $in: value } : { $eq: value },
  }));
  if (clauses.length === 0) return null;
  return clauses.length === 1 ? clauses[0] : { $and: clauses };
}

// The document for a record; a dotted path ('embedding.values') becomes nested fields.
function toDocument(item, textKey, path) {
  const document = { [textKey]: item.text, metadata: item.metadata };
  const keys = path.split('.');
  let target = document;
  for (const key of keys.slice(0, -1)) {
    target[key] = target[key] && typeof target[key] === 'object' ? target[key] : {};
    target = target[key];
  }
  target[keys[keys.length - 1]] = item.vector;
  return document;
}

function mongoError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `MongoDB error: ${wrapped.message}`;
  return wrapped;
}

/**
 * MongoDB Atlas Vector Search, without a driver dependency: pass a driver Collection
 * (client.db(name).collection(name) from the `mongodb` package).
 *
 *   const store = new MongoDBAtlasVectorStore({ collection: client.db('app').collection('docs'), embedder });
 *
 * Documents are { _id: id, text, metadata, embedding }. The collection needs an Atlas Vector Search index
 * (indexName) on `path`; createIndex({ dimension, filterFields }) creates one. Atlas only filters on paths
 * indexed as "filter" fields, so every metadata key used in `filter` must be listed there (as metadata.<key>).
 * filter becomes $eq / $in on metadata.<key> (joined by $and); nativeFilter is a $vectorSearch filter.
 * Atlas scores cosine and dotProduct as (1 + similarity) / 2, converted back to the similarity; euclidean keeps
 * 1 / (1 + distance).
 */
class MongoDBAtlasVectorStore extends VectorStore {
  // API: https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-stage/
  /**
   * @param {object} options - { collection, indexName = 'vector_index', path = 'embedding', textKey = 'text',
   *   similarity = 'cosine' (the index similarity), numCandidatesMultiplier = 20 (numCandidates = topK x it, at
   *   most 10,000), batchSize = 1000, embedder }.
   */
  constructor(options = {}) {
    super(options);
    const collection = options.collection;
    if (!collection || typeof collection.aggregate !== 'function' || typeof collection.bulkWrite !== 'function') {
      throw new Error('MongoDBAtlasVectorStore needs { collection }: a MongoDB driver Collection.');
    }
    this.collection = collection;
    this.indexName = options.indexName || 'vector_index';
    this.path = options.path || 'embedding';
    this.textKey = options.textKey || 'text';
    this.similarity = options.similarity || 'cosine';
    this.numCandidatesMultiplier = options.numCandidatesMultiplier || 20;
    this.batchSize = options.batchSize || 1000;
  }

  /**
   * Create the Atlas Vector Search index (it builds in the background, so queries return nothing until it is ready).
   * @param {{dimension: number, filterFields?: string[]}} settings - filterFields are metadata keys to filter on.
   */
  async createIndex({ dimension, filterFields = [] } = {}) {
    if (!dimension) throw new Error('createIndex needs the vector dimension.');
    const fields = [{ type: 'vector', path: this.path, numDimensions: dimension, similarity: this.similarity }];
    for (const key of filterFields) fields.push({ type: 'filter', path: `metadata.${key}` });
    try {
      return await this.collection.createSearchIndex({ name: this.indexName, type: 'vectorSearch', definition: { fields } });
    } catch (error) {
      throw mongoError(error);
    }
  }

  async upsert(records) {
    const items = toItems(records);
    for (let start = 0; start < items.length; start += this.batchSize) {
      const operations = items.slice(start, start + this.batchSize).map((item) => ({
        replaceOne: { filter: { _id: item.id }, replacement: toDocument(item, this.textKey, this.path), upsert: true },
      }));
      try {
        await this.collection.bulkWrite(operations, { ordered: true });
      } catch (error) {
        throw mongoError(error);
      }
    }
    return items.map((item) => item.id);
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const limit = Math.floor(params.topK || 5);
    const stage = {
      index: this.indexName,
      path: this.path,
      queryVector: vector,
      numCandidates: Math.min(10000, Math.max(limit, limit * this.numCandidatesMultiplier)),
      limit,
    };
    const filter = params.nativeFilter || toAtlasFilter(params.filter);
    if (filter) stage.filter = filter;
    const pipeline = [
      { $vectorSearch: stage },
      { $project: { _id: 1, [this.textKey]: 1, metadata: 1, score: { $meta: 'vectorSearchScore' } } },
    ];
    let rows;
    try {
      rows = await this.collection.aggregate(pipeline).toArray();
    } catch (error) {
      throw mongoError(error);
    }
    return (rows || []).map((row) => ({
      id: String(row._id),
      score: this.similarity === 'euclidean' ? row.score : 2 * row.score - 1,
      text: row[this.textKey] ?? null,
      metadata: row.metadata || {},
    })).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const list = (ids || []).map(String);
    if (list.length === 0) return;
    try {
      await this.collection.deleteMany({ _id: { $in: list } });
    } catch (error) {
      throw mongoError(error);
    }
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

module.exports = { MongoDBAtlasVectorStore };

},{"../utils/ConnHelper":52,"./VectorStore":46}],43:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');

// table or schema.table: identifier characters only, since the name goes into the SQL text
const TABLE_NAME = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)?$/;
// pgvector indexes the vector type with HNSW up to 2,000 dimensions
const MAX_INDEXED_DIMENSIONS = 2000;

function toVectorLiteral(vector) {
  return `[${vector.map((value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) throw new Error(`pgvector cannot store the value ${value}.`);
    return number;
  }).join(',')}]`;
}

function pgError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `pgvector error: ${wrapped.message}`;
  return wrapped;
}

/**
 * PostgreSQL with the pgvector extension (also AlloyDB, Cloud SQL, Supabase, Neon), without a driver dependency:
 * pass any client with query(sql, params) -> { rows }, such as a `pg` Pool or Client.
 *
 *   const { Pool } = require('pg');
 *   const store = new PgVectorStore({ client: new Pool({ connectionString }), dimension: 1536, embedder });
 *
 * With createTable the first use runs CREATE EXTENSION IF NOT EXISTS vector and creates the table
 * (id text primary key, text, metadata jsonb, embedding vector(dimension)) plus an HNSW cosine index when the
 * dimension is at most 2,000. Scores are 1 - cosine distance. filter matches with metadata @> (arrays mean
 * one of); nativeFilter is a SQL condition string, or { sql, params } with its own $1.. placeholders.
 */
class PgVectorStore extends VectorStore {
  // API: https://github.com/pgvector/pgvector
  /**
   * @param {object} options - { client, table = 'intellinode_vectors' (or schema.table), dimension,
   *   createTable = true, createIndex = true, batchSize = 500, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.client || typeof options.client.query !== 'function') {
      throw new Error('PgVectorStore needs { client }: a pg Pool or Client, or any object with query(sql, params).');
    }
    this.client = options.client;
    this.table = options.table || 'intellinode_vectors';
    if (!TABLE_NAME.test(this.table)) throw new Error(`Invalid table name '${this.table}': use letters, digits and underscores.`);
    this.dimension = options.dimension || null;
    this.createTable = options.createTable !== false;
    this.createIndex = options.createIndex !== false;
    this.batchSize = options.batchSize || 500;
    this._ready = null;
  }

  /** Create the extension, the table and its index when missing. */
  async ensureTable(dimension = this.dimension) {
    const size = Number(dimension);
    if (!Number.isInteger(size) || size <= 0) throw new Error('PgVectorStore needs a dimension to create its table.');
    await this._query('CREATE EXTENSION IF NOT EXISTS vector');
    await this._query(`CREATE TABLE IF NOT EXISTS ${this.table} (
      id text PRIMARY KEY,
      text text,
      metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
      embedding vector(${size}) NOT NULL
    )`);
    if (this.createIndex && size <= MAX_INDEXED_DIMENSIONS) {
      const indexName = `${this.table.split('.').pop()}_embedding_idx`;
      await this._query(`CREATE INDEX IF NOT EXISTS ${indexName} ON ${this.table} USING hnsw (embedding vector_cosine_ops)`);
    }
  }

  async upsert(records) {
    // one INSERT cannot touch the same row twice: the last record of an id wins
    const items = [...new Map(toItems(records).map((item) => [item.id, item])).values()];
    if (items.length === 0) return [];
    await this._prepare(items[0].vector.length);
    for (let start = 0; start < items.length; start += this.batchSize) {
      const rows = [];
      const params = [];
      for (const item of items.slice(start, start + this.batchSize)) {
        const n = params.length;
        rows.push(`($${n + 1}, $${n + 2}, $${n + 3}::jsonb, $${n + 4}::vector)`);
        params.push(item.id, item.text, JSON.stringify(item.metadata), toVectorLiteral(item.vector));
      }
      await this._query(`INSERT INTO ${this.table} (id, text, metadata, embedding) VALUES ${rows.join(', ')}
        ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, metadata = EXCLUDED.metadata, embedding = EXCLUDED.embedding`, params);
    }
    return (records || []).map((record) => String(record.id));
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    if (this.dimension) await this._prepare(this.dimension);
    const values = [toVectorLiteral(vector)];
    const conditions = [];
    if (params.nativeFilter) {
      const native = typeof params.nativeFilter === 'string' ? { sql: params.nativeFilter, params: [] } : params.nativeFilter;
      const offset = values.length;
      conditions.push(`(${native.sql.replace(/\$(\d+)/g, (match, index) => `$${Number(index) + offset}`)})`);
      values.push(...(native.params || []));
    } else if (params.filter) {
      const equal = {};
      for (const [key, value] of Object.entries(params.filter)) {
        if (!Array.isArray(value)) {
          equal[key] = value;
          continue;
        }
        // a jsonb array contains a scalar member, so this reads "metadata.key is one of value"
        values.push(JSON.stringify(value), key);
        conditions.push(`$${values.length - 1}::jsonb @> (metadata -> $${values.length}::text)`);
      }
      if (Object.keys(equal).length > 0) {
        values.push(JSON.stringify(equal));
        conditions.push(`metadata @> $${values.length}::jsonb`);
      }
    }
    values.push(Math.floor(params.topK || 5));
    const where = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
    const result = await this._query(`SELECT id, text, metadata, 1 - (embedding <=> $1::vector) AS score
      FROM ${this.table}${where} ORDER BY embedding <=> $1::vector LIMIT $${values.length}`, values);
    return ((result && result.rows) || []).map((row) => ({
      id: String(row.id),
      score: Number(row.score),
      text: row.text ?? null,
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {}),
    })).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const list = (ids || []).map(String);
    if (list.length === 0) return;
    await this._query(`DELETE FROM ${this.table} WHERE id = ANY($1::text[])`, [list]);
  }

  _prepare(dimension) {
    if (!this.createTable) return Promise.resolve();
    if (!this._ready) {
      this._ready = this.ensureTable(this.dimension || dimension).catch((error) => {
        this._ready = null;
        throw error;
      });
    }
    return this._ready;
  }

  async _query(sql, params) {
    try {
      return await (params ? this.client.query(sql, params) : this.client.query(sql));
    } catch (error) {
      throw pgError(error);
    }
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

module.exports = { PgVectorStore };

},{"../utils/ConnHelper":52,"./VectorStore":46}],44:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('../utils/FetchClient');
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');

// Pinecone rejects upsert requests over 2MB; stay under it with room for the JSON envelope
const MAX_BATCH_BYTES = 1500000;

function toPineconeFilter(filter) {
  const entries = Object.entries(filter || {});
  if (entries.length === 0) return null;
  const result = {};
  for (const [key, value] of entries) result[key] = Array.isArray(value) ? { $in: value } : { $eq: value };
  return result;
}

// Pinecone metadata takes strings, numbers, booleans and string lists, and rejects nulls.
function cleanMetadata(metadata) {
  const result = {};
  for (const [key, value] of Object.entries(metadata || {})) {
    if (value !== null && value !== undefined) result[key] = value;
  }
  return result;
}

function pineconeError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `Pinecone error: ${wrapped.message}`;
  return wrapped;
}

/**
 * A Pinecone index through the data plane REST API.
 *
 *   const store = new PineconeVectorStore({ apiKey, indexHost: 'docs-abc123.svc.aped-4627-b74a.pinecone.io', embedder });
 *
 * Create the index first (console or control plane) with the embedder's dimension; with the cosine metric the
 * scores are cosine similarities. The record text is kept in the metadata under textKey. filter becomes
 * { key: { $eq } } or { key: { $in } }; nativeFilter is a Pinecone metadata filter.
 */
class PineconeVectorStore extends VectorStore {
  // API: https://docs.pinecone.io/reference/api/2026-07/data-plane/upsert
  /**
   * @param {object} options - { apiKey, indexHost (the index host, with or without https://), namespace,
   *   apiVersion = '2026-07', metric = 'cosine' (the index metric: cosine, dotproduct or euclidean),
   *   textKey = 'text', batchSize = 100, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.apiKey) throw new Error('PineconeVectorStore needs an apiKey.');
    if (!options.indexHost) throw new Error('PineconeVectorStore needs the indexHost of the index.');
    const host = String(options.indexHost).replace(/\/+$/, '');
    this.namespace = options.namespace || null;
    this.metric = options.metric || 'cosine';
    this.textKey = options.textKey || 'text';
    this.batchSize = Math.min(options.batchSize || 100, 1000);
    this.client = new FetchClient({
      baseURL: /^https?:\/\//i.test(host) ? host : `https://${host}`,
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': options.apiKey,
        'X-Pinecone-Api-Version': options.apiVersion || '2026-07',
      },
    });
  }

  async upsert(records) {
    const items = toItems(records);
    const vectors = items.map((item) => {
      const metadata = cleanMetadata(item.metadata);
      if (item.text !== null) metadata[this.textKey] = item.text;
      return Object.keys(metadata).length > 0
        ? { id: item.id, values: item.vector, metadata }
        : { id: item.id, values: item.vector };
    });
    let batch = [];
    let bytes = 0;
    for (const vector of vectors) {
      const size = JSON.stringify(vector).length;
      if (batch.length > 0 && (batch.length >= this.batchSize || bytes + size > MAX_BATCH_BYTES)) {
        await this._request('POST', '/vectors/upsert', this._withNamespace({ vectors: batch }));
        batch = [];
        bytes = 0;
      }
      batch.push(vector);
      bytes += size;
    }
    if (batch.length > 0) await this._request('POST', '/vectors/upsert', this._withNamespace({ vectors: batch }));
    return items.map((item) => item.id);
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const filter = params.nativeFilter || toPineconeFilter(params.filter);
    const body = this._withNamespace({ vector, topK: params.topK || 5, includeMetadata: true, includeValues: false });
    if (filter) body.filter = filter;
    const data = await this._request('POST', '/query', body);
    return ((data && data.matches) || []).map((match) => {
      const { [this.textKey]: text = null, ...metadata } = match.metadata || {};
      // cosine and dotproduct scores are similarities; euclidean is a distance
      const score = this.metric === 'euclidean' ? 1 / (1 + match.score) : match.score;
      return { id: match.id, score, text, metadata };
    }).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const list = (ids || []).map(String);
    for (let start = 0; start < list.length; start += 1000) {
      await this._request('POST', '/vectors/delete', this._withNamespace({ ids: list.slice(start, start + 1000) }));
    }
  }

  _withNamespace(body) {
    return this.namespace ? { ...body, namespace: this.namespace } : body;
  }

  async _request(method, path, body) {
    try {
      return await this.client.request(method, path, body);
    } catch (error) {
      throw pineconeError(error);
    }
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

module.exports = { PineconeVectorStore };

},{"../utils/ConnHelper":52,"../utils/FetchClient":53,"./VectorStore":46}],45:[function(require,module,exports){
(function (process){(function (){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('../utils/FetchClient');
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// RFC 4122 DNS namespace: the same mapping as uuid.uuid5(uuid.NAMESPACE_DNS, id) in Python and Weaviate's generate_uuid5(id)
const NAMESPACE_BYTES = [0x6b, 0xa7, 0xb8, 0x10, 0x9d, 0xad, 0x11, 0xd1, 0x80, 0xb4, 0x00, 0xc0, 0x4f, 0xd4, 0x30, 0xc8];
const DISTANCE_METRICS = new Set(['Euclid', 'Manhattan']);

function sha1(bytes) {
  // process.getBuiltinModule (Node 20.16+) reaches crypto without a require() that browserify would bundle
  const crypto = typeof process !== 'undefined' && typeof process.getBuiltinModule === 'function'
    ? process.getBuiltinModule('crypto') : null;
  if (crypto && typeof crypto.createHash === 'function') {
    return Array.from(crypto.createHash('sha1').update(Uint8Array.from(bytes)).digest());
  }
  return sha1Fallback(bytes);
}

function sha1Fallback(bytes) {
  const length = bytes.length;
  const words = new Uint32Array((((length + 8) >> 6) + 1) * 16);
  for (let i = 0; i < length; i++) words[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
  words[length >> 2] |= 0x80 << (24 - (length % 4) * 8);
  words[words.length - 1] = length * 8;
  const state = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  const w = new Uint32Array(80);
  for (let block = 0; block < words.length; block += 16) {
    for (let t = 0; t < 16; t++) w[t] = words[block + t];
    for (let t = 16; t < 80; t++) {
      const x = w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16];
      w[t] = (x << 1) | (x >>> 31);
    }
    let [a, b, c, d, e] = state;
    for (let t = 0; t < 80; t++) {
      const f = t < 20 ? ((b & c) | (~b & d)) + 0x5a827999
        : t < 40 ? (b ^ c ^ d) + 0x6ed9eba1
          : t < 60 ? ((b & c) | (b & d) | (c & d)) + 0x8f1bbcdc
            : (b ^ c ^ d) + 0xca62c1d6;
      const next = (((a << 5) | (a >>> 27)) + f + e + w[t]) >>> 0;
      e = d;
      d = c;
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = next;
    }
    state[0] = (state[0] + a) >>> 0;
    state[1] = (state[1] + b) >>> 0;
    state[2] = (state[2] + c) >>> 0;
    state[3] = (state[3] + d) >>> 0;
    state[4] = (state[4] + e) >>> 0;
  }
  const digest = [];
  for (const word of state) digest.push(word >>> 24, (word >>> 16) & 0xff, (word >>> 8) & 0xff, word & 0xff);
  return digest;
}

/**
 * The UUID a store that only accepts UUID ids (Qdrant, Weaviate) keeps for a record id: the id itself when it
 * already is a UUID, otherwise its UUID v5 (so upsert, query and delete always map an id to the same point).
 */
function stableUuid(id) {
  const text = String(id);
  if (UUID_PATTERN.test(text)) return text.toLowerCase();
  const bytes = sha1([...NAMESPACE_BYTES, ...new TextEncoder().encode(text)]).slice(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function toQdrantFilter(filter) {
  const conditions = Object.entries(filter || {}).map(([key, value]) => ({
    key: `metadata.${key}`,
    match: Array.isArray(value) ? { any: value } : { value },
  }));
  return conditions.length > 0 ? { must: conditions } : null;
}

function qdrantError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `Qdrant error: ${wrapped.message}`;
  return wrapped;
}

/**
 * Qdrant (self-hosted or Qdrant Cloud) through its REST API.
 *
 *   const store = new QdrantVectorStore({ url: 'http://localhost:6333', collection: 'docs', embedder });
 *
 * Qdrant point ids must be unsigned integers or UUIDs, so every record id is stored as its UUID v5 (see stableUuid)
 * and the original id is kept in the payload: { text, metadata, id }. Query results return the original id.
 * filter matches payload.metadata keys with match.value (keyword, integer, bool) or match.any for arrays;
 * nativeFilter is a Qdrant filter object ({ must, should, must_not }).
 */
class QdrantVectorStore extends VectorStore {
  // API: https://api.qdrant.tech/api-reference/points/upsert-points
  /**
   * @param {object} options - { url = 'http://localhost:6333', apiKey, collection, distance = 'Cosine' (Cosine,
   *   Dot, Euclid, Manhattan), createCollection = true, dimension, vectorName (a named vector), textKey = 'text',
   *   batchSize = 256, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.collection) throw new Error('QdrantVectorStore needs a collection name.');
    this.collection = options.collection;
    this.distance = options.distance || 'Cosine';
    this.createCollection = options.createCollection !== false;
    this.dimension = options.dimension || null;
    this.vectorName = options.vectorName || null;
    this.textKey = options.textKey || 'text';
    this.batchSize = options.batchSize || 256;
    this._ready = null;
    const headers = { 'Content-Type': 'application/json' };
    if (options.apiKey) headers['api-key'] = options.apiKey;
    this.client = new FetchClient({ baseURL: String(options.url || 'http://localhost:6333').replace(/\/+$/, ''), headers });
  }

  /** Create the collection when it does not exist. Returns true when it was created. */
  async ensureCollection(dimension = this.dimension) {
    if (await this._exists()) return false;
    if (!dimension) throw new Error(`Qdrant collection '${this.collection}' does not exist and no dimension is known to create it.`);
    const vectors = { size: dimension, distance: this.distance };
    try {
      // a conflict means another call created it: no retries, then check again
      await this._request('PUT', this._path(), { vectors: this.vectorName ? { [this.vectorName]: vectors } : vectors }, { retries: 0 });
    } catch (error) {
      if (await this._exists().catch(() => false)) return false;
      throw error;
    }
    return true;
  }

  async upsert(records) {
    const items = toItems(records);
    if (items.length === 0) return [];
    if (this.createCollection) await this._prepare(items[0].vector.length);
    const points = items.map((item) => ({
      id: stableUuid(item.id),
      vector: this.vectorName ? { [this.vectorName]: item.vector } : item.vector,
      payload: { [this.textKey]: item.text, metadata: item.metadata, id: item.id },
    }));
    for (let start = 0; start < points.length; start += this.batchSize) {
      await this._request('PUT', `${this._path()}/points?wait=true`, { points: points.slice(start, start + this.batchSize) });
    }
    return items.map((item) => item.id);
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const filter = params.nativeFilter || toQdrantFilter(params.filter);
    const body = { query: vector, limit: params.topK || 5, with_payload: true };
    if (this.vectorName) body.using = this.vectorName;
    if (filter) body.filter = filter;
    const data = await this._request('POST', `${this._path()}/points/query`, body);
    const points = (data && data.result && data.result.points) || [];
    return points.map((point) => {
      const payload = point.payload || {};
      return {
        id: payload.id !== undefined && payload.id !== null ? String(payload.id) : String(point.id),
        // Cosine and Dot are similarities; Euclid and Manhattan are distances
        score: DISTANCE_METRICS.has(this.distance) ? 1 / (1 + point.score) : point.score,
        text: payload[this.textKey] ?? null,
        metadata: payload.metadata || {},
      };
    }).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const points = (ids || []).map(stableUuid);
    for (let start = 0; start < points.length; start += 1000) {
      await this._request('POST', `${this._path()}/points/delete?wait=true`, { points: points.slice(start, start + 1000) });
    }
  }

  _path() {
    return `/collections/${encodeURIComponent(this.collection)}`;
  }

  async _exists() {
    const data = await this._request('GET', `${this._path()}/exists`);
    return Boolean(data && data.result && data.result.exists);
  }

  _prepare(dimension) {
    if (!this._ready) {
      this._ready = this.ensureCollection(this.dimension || dimension).catch((error) => {
        this._ready = null;
        throw error;
      });
    }
    return this._ready;
  }

  async _request(method, path, body, extraConfig = {}) {
    try {
      return await this.client.request(method, path, body, extraConfig);
    } catch (error) {
      throw qdrantError(error);
    }
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

module.exports = { QdrantVectorStore, stableUuid };

}).call(this)}).call(this,require('_process'))
},{"../utils/ConnHelper":52,"../utils/FetchClient":53,"./VectorStore":46,"_process":30}],46:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { toEmbedder } = require('./Embedder');

let idCounter = 0;

/** A random-looking id for records added without one (no crypto dependency, so it also runs in the browser). */
function newId() {
  idCounter = (idCounter + 1) % 1e6;
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}${idCounter.toString(36)}`;
}

/**
 * Base class of every vector store: Memory, Pinecone, Qdrant, Chroma, Weaviate, Milvus, Elasticsearch, pgvector,
 * Firestore and Vertex AI Vector Search share this interface, so an Assistant or a RAG step can swap them.
 *
 * Records are { id, vector, text?, metadata? }. Query results are { id, score, text, metadata } sorted by score,
 * where a higher score is more similar (each store converts its own distance to a similarity).
 *
 * Subclasses implement upsert(records), query({ vector, topK, filter }) and delete(ids); the base class adds
 * text embedding (addDocuments, search) through the optional embedder.
 */
class VectorStore {
  /**
   * @param {object} options - { embedder }: an Embedder, a function async (texts, { kind }) => vectors, or
   *   { provider, apiKey, model, options } to build one (see store/Embedder.js).
   */
  constructor(options = {}) {
    this.embedder = options.embedder ? toEmbedder(options.embedder) : null;
  }

  /** Embed texts with the store's embedder. kind is 'document' or 'query' (Gemini and Cohere embed them differently). */
  async embed(texts, kind = 'document') {
    if (!this.embedder) {
      throw new Error(`${this.constructor.name} has no embedder: pass { embedder } to the constructor, or give vectors.`);
    }
    const list = Array.isArray(texts) ? texts : [texts];
    if (list.length === 0) return [];
    const vectors = await this.embedder.embed(list, { kind });
    if (!Array.isArray(vectors) || vectors.length !== list.length) {
      throw new Error(`The embedder returned ${Array.isArray(vectors) ? vectors.length : 'no'} vectors for ${list.length} texts.`);
    }
    return vectors;
  }

  /**
   * Add documents, embedding the ones without a vector. Returns the ids.
   * @param {Array<{id?: string, text: string, metadata?: object, vector?: number[]}>|string[]} documents
   */
  async addDocuments(documents) {
    const records = (documents || []).map((document) => (typeof document === 'string' ? { text: document } : { ...document }));
    const missing = records.filter((record) => !Array.isArray(record.vector));
    if (missing.length > 0) {
      const vectors = await this.embed(missing.map((record) => String(record.text || '')), 'document');
      missing.forEach((record, index) => { record.vector = vectors[index]; });
    }
    for (const record of records) {
      if (record.id === undefined || record.id === null || record.id === '') record.id = newId();
      record.id = String(record.id);
      record.metadata = record.metadata || {};
    }
    await this.upsert(records);
    return records.map((record) => record.id);
  }

  /** Embed the query text and return the topK closest records: [{ id, score, text, metadata }]. */
  async search(text, topK = 5, filter = null) {
    const [vector] = await this.embed([String(text)], 'query');
    return this.query({ vector, topK, filter });
  }

  /** Upsert [{ id, vector, text?, metadata? }]. */
  async upsert() {
    throw new Error(`${this.constructor.name}.upsert is not implemented.`);
  }

  /**
   * Nearest records to a vector (or to a text when an embedder is set).
   * @param {{vector?: number[], text?: string, topK?: number, filter?: object}} params - filter is metadata
   *   equality ({ key: value }, all must match); each store also accepts its own native filter as `nativeFilter`.
   */
  async query() {
    throw new Error(`${this.constructor.name}.query is not implemented.`);
  }

  /** Delete records by id. */
  async delete() {
    throw new Error(`${this.constructor.name}.delete is not implemented.`);
  }

  // The vector of a query: params.vector, or the embedded params.text.
  async _queryVector(params = {}) {
    if (Array.isArray(params.vector)) return params.vector;
    if (params.text !== undefined && params.text !== null) {
      const [vector] = await this.embed([String(params.text)], 'query');
      return vector;
    }
    throw new Error('query needs a vector, or a text and an embedder.');
  }
}

/** True when every key of filter equals the same key of metadata (arrays in the filter mean "one of"). */
function matchesFilter(metadata, filter) {
  if (!filter) return true;
  const data = metadata || {};
  return Object.entries(filter).every(([key, expected]) => {
    const actual = data[key];
    if (Array.isArray(expected)) return expected.some((value) => value === actual);
    return actual === expected;
  });
}

function cosineSimilarity(a, b) {
  if (a.length !== b.length) throw new Error(`Vector size mismatch: ${a.length} and ${b.length}.`);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = { VectorStore, matchesFilter, cosineSimilarity, newId };

},{"./Embedder":36}],47:[function(require,module,exports){
(function (Buffer){(function (){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
// API: https://cloud.google.com/vertex-ai/generative-ai/docs/rag-engine/rag-overview (REST v1: ragCorpora, ragFiles,
// media.upload, projects.locations.retrieveContexts)
const config = require('../config.json');
const { VectorStore } = require('./VectorStore');
const { GoogleCloudService } = require('./GoogleCloud');

/**
 * Vertex AI RAG Engine: a managed corpus that parses, chunks, embeds and indexes your files on Google Cloud.
 * Use it as a knowledge store (query by text), or ground Gemini directly with store.tool().
 *
 *   const corpus = await VertexRAGStore.createCorpus({ projectId, displayName: 'handbook' });
 *   const store = new VertexRAGStore({ projectId, corpus: corpus.name });
 *   await store.uploadFile('handbook.pdf');                     // or importFiles(['gs://bucket/docs/'])
 *   const hits = await store.query({ text: 'refund policy', topK: 5 });
 *
 * RAG Engine needs OAuth credentials (API keys are rejected) and a supported region; us-central1 needs an allowlist
 * for new projects, europe-west3 / europe-west4 are generally available.
 */
class VertexRAGStore extends VectorStore {
  /**
   * @param {object} options - { projectId, location = 'us-central1', corpus (full name or id), topK, vectorDistanceThreshold,
   *   accessToken, credentials }.
   */
  constructor(options = {}) {
    super({});
    this.service = new GoogleCloudService({ ...options, label: 'Vertex AI RAG Engine' });
    this.client = this.service.client;
    this.location = options.location || config.url.gemini.vertex.locations.rag;
    this.corpus = options.corpus || null;
    this.vectorDistanceThreshold = options.vectorDistanceThreshold ?? null;
  }

  _host() {
    return `https://${this.location}-aiplatform.googleapis.com`;
  }

  async _parent() {
    return `projects/${await this.service._project()}/locations/${this.location}`;
  }

  async corpusName() {
    if (!this.corpus) throw new Error('VertexRAGStore needs a corpus (name or id).');
    if (String(this.corpus).startsWith('projects/')) return this.corpus;
    return `${await this._parent()}/ragCorpora/${this.corpus}`;
  }

  /**
   * Create a corpus and wait for it. embeddingModel defaults to text-embedding-005 (the RAG Engine default).
   * Returns the corpus ({ name, displayName, ... }).
   */
  static async createCorpus({ displayName, description = null, embeddingModel = null, ...options }) {
    const store = new VertexRAGStore(options);
    const parent = await store._parent();
    const body = {
      displayName,
      ...(description && { description }),
      ...(embeddingModel && {
        vectorDbConfig: {
          ragManagedDb: { knn: {} },
          ragEmbeddingModelConfig: {
            vertexPredictionEndpoint: {
              endpoint: embeddingModel.startsWith('projects/') ? embeddingModel : `${parent}/publishers/google/models/${embeddingModel}`,
            },
          },
        },
      }),
    };
    const operation = await store.service._request('POST', `${store._host()}/v1/${parent}/ragCorpora`, body);
    return store.service.waitForOperation(operation, (name) => `${store._host()}/v1/${name}`);
  }

  async listCorpora({ pageSize = null, pageToken = null } = {}) {
    const query = [pageSize && `page_size=${pageSize}`, pageToken && `page_token=${encodeURIComponent(pageToken)}`].filter(Boolean).join('&');
    return this.service._request('GET', `${this._host()}/v1/${await this._parent()}/ragCorpora${query ? `?${query}` : ''}`);
  }

  async getCorpus() {
    return this.service._request('GET', `${this._host()}/v1/${await this.corpusName()}`);
  }

  /** Delete the corpus; force also deletes its files. */
  async deleteCorpus({ force = true } = {}) {
    return this.service._request('DELETE', `${this._host()}/v1/${await this.corpusName()}${force ? '?force=true' : ''}`);
  }

  /**
   * Upload one local file (a path, or bytes with { displayName, mimeType }) into the corpus; RAG Engine parses,
   * chunks and embeds it. Returns the RagFile.
   */
  async uploadFile(source, { displayName = null, description = null, mimeType = null, chunkSize = 512, chunkOverlap = 100 } = {}) {
    const FormData = require('form-data');
    let data = source;
    let name = displayName;
    if (typeof source === 'string') {
      data = require('fs').readFileSync(source);
      name = name || require('path').basename(source);
    }
    if (!name) throw new Error('displayName is required when uploading bytes.');
    const form = new FormData();
    form.append('metadata', JSON.stringify({
      ragFile: { displayName: name, ...(description && { description }) },
      uploadRagFileConfig: {
        ragFileTransformationConfig: { ragFileChunkingConfig: { fixedLengthChunking: { chunkSize, chunkOverlap } } },
      },
    }), { contentType: 'application/json' });
    form.append('file', Buffer.from(data), { filename: name, ...(mimeType && { contentType: mimeType }) });
    const url = `${this._host()}/upload/v1/${await this.corpusName()}/ragFiles:upload`;
    const result = await this.service._request('POST', url, form, { headers: { 'X-Goog-Upload-Protocol': 'multipart' } });
    if (result && result.error) throw new Error(`Vertex AI RAG Engine upload error: ${JSON.stringify(result.error)}`);
    return (result && result.ragFile) || result;
  }

  /**
   * Import files from Cloud Storage (gs://bucket/path) or Google Drive (folder / file links) and wait for the
   * import to finish. Returns the import result counts.
   */
  async importFiles(uris, { chunkSize = 512, chunkOverlap = 100, maxEmbeddingRequestsPerMin = 1000, wait = true } = {}) {
    const list = Array.isArray(uris) ? uris : [uris];
    const gcs = list.filter((uri) => uri.startsWith('gs://'));
    const drive = list.filter((uri) => !uri.startsWith('gs://'));
    const body = {
      importRagFilesConfig: {
        ...(gcs.length && { gcsSource: { uris: gcs } }),
        ...(drive.length && {
          googleDriveSource: {
            resourceIds: drive.map((uri) => {
              const id = (/\/folders\/([^/?#]+)/.exec(uri) || /\/d\/([^/?#]+)/.exec(uri) || [null, uri])[1];
              return { resourceType: /\/folders\//.test(uri) ? 'RESOURCE_TYPE_FOLDER' : 'RESOURCE_TYPE_FILE', resourceId: id };
            }),
          },
        }),
        ragFileTransformationConfig: { ragFileChunkingConfig: { fixedLengthChunking: { chunkSize, chunkOverlap } } },
        maxEmbeddingRequestsPerMin,
      },
    };
    const operation = await this.service._request('POST', `${this._host()}/v1/${await this.corpusName()}/ragFiles:import`, body);
    if (!wait) return operation;
    return this.service.waitForOperation(operation, (name) => `${this._host()}/v1/${name}`);
  }

  async listFiles({ pageSize = null, pageToken = null } = {}) {
    const query = [pageSize && `page_size=${pageSize}`, pageToken && `page_token=${encodeURIComponent(pageToken)}`].filter(Boolean).join('&');
    return this.service._request('GET', `${this._host()}/v1/${await this.corpusName()}/ragFiles${query ? `?${query}` : ''}`);
  }

  /** Add text documents: each one is uploaded as a text file named after its id (or metadata.source). */
  async addDocuments(documents, options = {}) {
    const names = [];
    for (const document of documents || []) {
      const item = typeof document === 'string' ? { text: document } : document;
      const base = String((item.metadata && item.metadata.source) || item.id || `document-${Date.now()}`);
      const displayName = /\.[a-z0-9]+$/i.test(base) ? base : `${base}.txt`;
      const file = await this.uploadFile(Buffer.from(String(item.text || ''), 'utf8'), { displayName, mimeType: 'text/plain', ...options });
      names.push(file.name || displayName);
    }
    return names;
  }

  async upsert() {
    throw new Error('VertexRAGStore embeds files itself: use addDocuments, uploadFile or importFiles.');
  }

  /**
   * Retrieve chunks for a text query: [{ id, score, text, metadata: { source, title, pages } }].
   * RAG Engine returns a cosine distance by default (0 = same); score is 1 - distance.
   */
  async query(params = {}) {
    if (params.text === undefined || params.text === null) throw new Error('VertexRAGStore queries by text: query({ text }).');
    const filter = params.nativeFilter || (this.vectorDistanceThreshold !== null ? { vectorDistanceThreshold: this.vectorDistanceThreshold } : null);
    const body = {
      vertexRagStore: { ragResources: [{ ragCorpus: await this.corpusName() }] },
      query: { text: String(params.text), ragRetrievalConfig: { topK: params.topK || 5, ...(filter && { filter }) } },
    };
    const result = await this.service._request('POST', `${this._host()}/v1/${await this._parent()}:retrieveContexts`, body);
    const contexts = (result.contexts && result.contexts.contexts) || [];
    return contexts.map((context, index) => {
      const chunk = context.chunk || {};
      const distance = typeof context.score === 'number' ? context.score : typeof context.distance === 'number' ? context.distance : null;
      return {
        id: chunk.chunkId || `${context.sourceUri || 'context'}#${index}`,
        score: distance === null ? null : 1 - distance,
        text: context.text || chunk.text || '',
        metadata: {
          source: context.sourceUri || null,
          title: context.sourceDisplayName || null,
          ...(chunk.pageSpan && { pages: chunk.pageSpan }),
        },
      };
    });
  }

  /** Delete RAG files by their resource names (from addDocuments / listFiles). */
  async delete(fileNames) {
    for (const name of fileNames || []) {
      const fullName = String(name).startsWith('projects/') ? name : `${await this.corpusName()}/ragFiles/${name}`;
      await this.service._request('DELETE', `${this._host()}/v1/${fullName}`);
    }
  }

  /** A Gemini grounding tool for this corpus (Vertex AI generateContent): tools: [await store.tool()]. */
  async tool({ topK = 5, vectorDistanceThreshold = null } = {}) {
    return {
      retrieval: {
        vertexRagStore: {
          ragResources: [{ ragCorpus: await this.corpusName() }],
          ragRetrievalConfig: { topK, ...(vectorDistanceThreshold !== null && { filter: { vectorDistanceThreshold } }) },
        },
      },
    };
  }
}

module.exports = { VertexRAGStore };

}).call(this)}).call(this,require("buffer").Buffer)
},{"../config.json":1,"./GoogleCloud":39,"./VectorStore":46,"buffer":25,"form-data":27,"fs":24,"path":29}],48:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
// API: Vector Search 2.0 (vectorsearch.googleapis.com v1: collections, dataObjects:batchCreate / search) and
// Vector Search 1.0 (aiplatform v1: indexes:upsertDatapoints / removeDatapoints, indexEndpoints:findNeighbors)
const { VectorStore } = require('./VectorStore');
const { GoogleCloudService } = require('./GoogleCloud');

const VECTOR_SEARCH_BASE = 'https://vectorsearch.googleapis.com/v1';

// Data object ids must be 1-63 lowercase letters, digits or hyphens and start with a letter (RFC 1035).
function dataObjectId(id) {
  const text = String(id);
  if (/^[a-z](?:[-a-z0-9]{0,61}[a-z0-9])?$/.test(text)) return text;
  // FNV-1a, two rounds, so any id maps to a stable valid id
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ code, 0x811c9dc5) >>> 0;
  }
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  return `d-${slug ? `${slug}-` : ''}${h1.toString(16)}${h2.toString(16)}`.slice(0, 63).replace(/-+$/, '');
}

/**
 * Vertex AI Vector Search 2.0 collections: managed vector search that stores the data objects (text and metadata)
 * with their vectors. Create the collection once with createCollection({ dimensions }).
 * Metadata keys are stored as top-level data fields, so filters work on them ({ genre: 'sci-fi' }).
 * Credentials: OAuth (accessToken, a service account, or `gcloud auth application-default login`).
 */
class VertexVectorSearchStore extends VectorStore {
  /**
   * @param {object} options - { projectId, location = 'us-central1', collection, vectorField = 'embedding',
   *   distanceMetric = 'COSINE_DISTANCE' (or 'DOT_PRODUCT'), accessToken, credentials, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.collection) throw new Error('VertexVectorSearchStore needs a collection id.');
    this.service = new GoogleCloudService({ ...options, label: 'Vertex AI Vector Search' });
    this.client = this.service.client;
    this.location = options.location || 'us-central1';
    this.collection = options.collection;
    this.vectorField = options.vectorField || 'embedding';
    this.distanceMetric = options.distanceMetric || 'COSINE_DISTANCE';
  }

  async _collectionName() {
    if (this.collection.startsWith('projects/')) return this.collection;
    return `projects/${await this.service._project()}/locations/${this.location}/collections/${this.collection}`;
  }

  /** Create the collection (once). Waits for the operation when the API returns one. */
  async createCollection({ dimensions, displayName = null, description = null } = {}) {
    if (!dimensions) throw new Error('createCollection needs the vector dimensions.');
    const parent = `projects/${await this.service._project()}/locations/${this.location}`;
    const body = {
      displayName: displayName || this.collection,
      ...(description && { description }),
      vectorSchema: { [this.vectorField]: { denseVector: { dimensions } } },
      dataSchema: { type: 'object', properties: { text: { type: 'string' }, sourceId: { type: 'string' } } },
    };
    const result = await this.service._request('POST', `${VECTOR_SEARCH_BASE}/${parent}/collections?collectionId=${encodeURIComponent(this.collection)}`, body);
    if (result && result.name && result.done !== undefined) {
      return this.service.waitForOperation(result, (name) => `${VECTOR_SEARCH_BASE}/${name}`);
    }
    return result;
  }

  async upsert(records) {
    const collection = await this._collectionName();
    // create fails on an existing id, so replaced records are deleted first
    await this.delete((records || []).map((record) => record.id), { ignoreMissing: true });
    for (let start = 0; start < (records || []).length; start += 1000) {
      const requests = records.slice(start, start + 1000).map((record) => {
        if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
        return {
          dataObjectId: dataObjectId(record.id),
          dataObject: {
            data: { ...(record.metadata || {}), text: record.text ?? null, sourceId: String(record.id) },
            vectors: { [this.vectorField]: { dense: { values: record.vector } } },
          },
        };
      });
      await this.service._request('POST', `${VECTOR_SEARCH_BASE}/${collection}/dataObjects:batchCreate`, { requests });
    }
    return (records || []).map((record) => String(record.id));
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const filter = params.nativeFilter || VertexVectorSearchStore._filter(params.filter);
    const body = {
      vectorSearch: {
        searchField: this.vectorField,
        vector: { values: vector },
        topK: params.topK || 5,
        distanceMetric: this.distanceMetric,
        ...(filter && { filter }),
      },
    };
    const result = await this.service._request('POST', `${VECTOR_SEARCH_BASE}/${await this._collectionName()}/dataObjects:search`, body);
    return (result.results || []).map((item) => {
      const object = item.dataObject || {};
      const { text = null, sourceId = null, ...metadata } = object.data || {};
      return {
        id: sourceId || object.dataObjectId || (object.name || '').split('/').pop(),
        score: this._score(item.distance),
        text,
        metadata,
      };
    }).sort((a, b) => b.score - a.score);
  }

  _score(distance) {
    if (typeof distance !== 'number') return 0;
    return this.distanceMetric === 'COSINE_DISTANCE' ? 1 - distance : distance;
  }

  static _filter(filter) {
    if (!filter) return null;
    const clauses = Object.entries(filter).map(([key, value]) => ({ [key]: Array.isArray(value) ? { $in: value } : { $eq: value } }));
    if (!clauses.length) return null;
    return clauses.length === 1 ? clauses[0] : { $and: clauses };
  }

  async delete(ids, { ignoreMissing = false } = {}) {
    const collection = await this._collectionName();
    for (const id of ids || []) {
      try {
        await this.service._request('DELETE', `${VECTOR_SEARCH_BASE}/${collection}/dataObjects/${dataObjectId(id)}`);
      } catch (error) {
        if (!(ignoreMissing && error.status === 404)) throw error;
      }
    }
  }
}

/**
 * Vertex AI Vector Search 1.0: an index with stream updates deployed to a public index endpoint. Text and metadata
 * travel in embeddingMetadata (up to 2 KB per datapoint); metadata equality filters use restricts.
 */
class VertexVectorSearchIndexStore extends VectorStore {
  /**
   * @param {object} options - { projectId, location = 'us-central1', index (id or name), indexEndpoint (id or name),
   *   deployedIndexId, publicEndpointDomain (e.g. 123.us-central1-456.vdb.vertexai.goog), distanceMeasure =
   *   'DOT_PRODUCT_DISTANCE' (or 'COSINE_DISTANCE', 'SQUARED_L2_DISTANCE'), restrictKeys (metadata keys sent as
   *   restricts), accessToken, credentials, embedder }.
   */
  constructor(options = {}) {
    super(options);
    for (const key of ['index', 'indexEndpoint', 'deployedIndexId', 'publicEndpointDomain']) {
      if (!options[key]) throw new Error(`VertexVectorSearchIndexStore needs ${key}.`);
    }
    this.service = new GoogleCloudService({ ...options, label: 'Vertex AI Vector Search' });
    this.client = this.service.client;
    this.location = options.location || 'us-central1';
    this.index = options.index;
    this.indexEndpoint = options.indexEndpoint;
    this.deployedIndexId = options.deployedIndexId;
    this.publicEndpointDomain = String(options.publicEndpointDomain).replace(/^https?:\/\//, '').replace(/\/+$/, '');
    this.distanceMeasure = options.distanceMeasure || 'DOT_PRODUCT_DISTANCE';
    this.restrictKeys = options.restrictKeys || [];
  }

  async _name(kind, value) {
    if (String(value).startsWith('projects/')) return value;
    return `projects/${await this.service._project()}/locations/${this.location}/${kind}/${value}`;
  }

  async upsert(records) {
    const index = await this._name('indexes', this.index);
    const datapoints = (records || []).map((record) => {
      if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
      const metadata = record.metadata || {};
      const restricts = this.restrictKeys
        .filter((key) => metadata[key] !== undefined && metadata[key] !== null)
        .map((key) => ({ namespace: key, allowList: (Array.isArray(metadata[key]) ? metadata[key] : [metadata[key]]).map(String) }));
      return {
        datapointId: String(record.id),
        featureVector: record.vector,
        ...(restricts.length && { restricts }),
        embeddingMetadata: { text: record.text ?? null, metadata },
      };
    });
    const url = `https://${this.location}-aiplatform.googleapis.com/v1/${index}:upsertDatapoints`;
    for (let start = 0; start < datapoints.length; start += 1000) {
      await this.service._request('POST', url, { datapoints: datapoints.slice(start, start + 1000) });
    }
    return datapoints.map((datapoint) => datapoint.datapointId);
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    const restricts = Object.entries(params.filter || {}).map(([key, value]) => ({ namespace: key, allowList: (Array.isArray(value) ? value : [value]).map(String) }));
    const endpoint = await this._name('indexEndpoints', this.indexEndpoint);
    const body = {
      deployedIndexId: this.deployedIndexId,
      returnFullDatapoint: true,
      queries: [{
        datapoint: { datapointId: 'query', featureVector: vector, ...(restricts.length && { restricts }), ...(params.nativeFilter || {}) },
        neighborCount: params.topK || 5,
      }],
    };
    const result = await this.service._request('POST', `https://${this.publicEndpointDomain}/v1/${endpoint}:findNeighbors`, body);
    const neighbors = (result.nearestNeighbors && result.nearestNeighbors[0] && result.nearestNeighbors[0].neighbors) || [];
    return neighbors.map((neighbor) => {
      const datapoint = neighbor.datapoint || {};
      const payload = datapoint.embeddingMetadata || {};
      return { id: datapoint.datapointId, score: this._score(neighbor.distance), text: payload.text ?? null, metadata: payload.metadata || {} };
    }).sort((a, b) => b.score - a.score);
  }

  // DOT_PRODUCT_DISTANCE comes back as the dot product (higher is closer); the others are distances.
  _score(distance) {
    if (typeof distance !== 'number') return 0;
    if (this.distanceMeasure === 'COSINE_DISTANCE') return 1 - distance;
    if (this.distanceMeasure === 'SQUARED_L2_DISTANCE') return 1 / (1 + distance);
    return distance;
  }

  async delete(ids) {
    const index = await this._name('indexes', this.index);
    await this.service._request('POST', `https://${this.location}-aiplatform.googleapis.com/v1/${index}:removeDatapoints`, { datapointIds: (ids || []).map(String) });
  }
}

module.exports = { VertexVectorSearchStore, VertexVectorSearchIndexStore, dataObjectId };

},{"./GoogleCloud":39,"./VectorStore":46}],49:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('../utils/FetchClient');
const ConnHelper = require('../utils/ConnHelper');
const { VectorStore } = require('./VectorStore');
const { stableUuid } = require('./QdrantVectorStore');

const ID_PROPERTY = 'recordId';
const METADATA_PROPERTY = 'metadataJson';
// metadata keys that can also be stored as their own (filterable) property
const PROPERTY_NAME = /^[_a-z][_0-9A-Za-z]*$/;
const RESERVED = new Set(['id', '_id', '_additional', ID_PROPERTY, METADATA_PROPERTY]);

function isScalar(value) {
  return typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value));
}

function valueKey(value) {
  if (typeof value === 'boolean') return 'valueBoolean';
  if (typeof value === 'number') return 'valueNumber';
  return 'valueText';
}

function toWeaviateWhere(filter) {
  const operands = Object.entries(filter || {}).map(([key, value]) => {
    if (!Array.isArray(value)) return { path: [key], operator: 'Equal', [valueKey(value)]: value };
    const options = value.map((item) => ({ path: [key], operator: 'Equal', [valueKey(item)]: item }));
    return options.length === 1 ? options[0] : { operator: 'Or', operands: options };
  });
  if (operands.length === 0) return null;
  return operands.length === 1 ? operands[0] : { operator: 'And', operands };
}

// GraphQL input literal: object keys are bare names and `operator` values are enums.
function gql(value, key) {
  if (Array.isArray(value)) return `[${value.map((item) => gql(item)).join(', ')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value).map(([name, item]) => `${name}: ${gql(item, name)}`).join(', ')}}`;
  }
  if (key === 'operator' && /^[A-Za-z]+$/.test(String(value))) return String(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error(`Weaviate cannot take the number ${value}.`);
    return String(value);
  }
  return JSON.stringify(value);
}

function parseMetadata(value) {
  if (!value) return {};
  try {
    return JSON.parse(value);
  } catch (error) {
    return {};
  }
}

function weaviateError(error) {
  const wrapped = ConnHelper.wrapError(error);
  wrapped.message = `Weaviate error: ${wrapped.message}`;
  return wrapped;
}

/**
 * A Weaviate collection (class) through the REST and GraphQL APIs, with vectors you provide.
 *
 *   const store = new WeaviateVectorStore({ url: 'http://localhost:8080', className: 'Docs', embedder });
 *
 * Objects need UUIDs, so each record id is stored as its UUID v5 (the same as the Python client's
 * generate_uuid5(id)) and the original id goes in the recordId property. Metadata is kept whole as JSON in
 * metadataJson, and its scalar keys (lowercase names) are also written as their own properties so `filter` can
 * match them (Equal; a text property follows its tokenization). nativeFilter is a Weaviate where object, e.g.
 * { path: ['year'], operator: 'GreaterThan', valueInt: 2020 }.
 *
 * A new class is created with a self-provided named vector (vectorName = 'default'); an existing class keeps its
 * own vector setup (named or legacy). Scores: cosine 1 - distance, dot -distance, other metrics 1 / (1 + distance).
 */
class WeaviateVectorStore extends VectorStore {
  // API: https://docs.weaviate.io/weaviate/api/graphql/search-operators (GraphQL), /v1/batch/objects and /v1/schema (REST)
  /**
   * @param {object} options - { url = 'http://localhost:8080', apiKey, className, textKey = 'text',
   *   vectorName = 'default' (null for the legacy unnamed vector), distance = 'cosine', createClass = true,
   *   headers (e.g. module API keys), batchSize = 100, embedder }.
   */
  constructor(options = {}) {
    super(options);
    if (!options.className) throw new Error('WeaviateVectorStore needs a className.');
    const name = String(options.className);
    this.className = name.charAt(0).toUpperCase() + name.slice(1);
    if (!/^[A-Z][_0-9A-Za-z]*$/.test(this.className)) throw new Error(`Invalid Weaviate class name '${options.className}'.`);
    this.textKey = options.textKey || 'text';
    this.vectorName = options.vectorName === undefined ? 'default' : options.vectorName;
    this.distance = options.distance || 'cosine';
    this.createClass = options.createClass !== false;
    this.batchSize = options.batchSize || 100;
    this._classReady = false;
    this._loading = null;
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (options.apiKey) headers.Authorization = `Bearer ${options.apiKey}`;
    this.client = new FetchClient({ baseURL: String(options.url || 'http://localhost:8080').replace(/\/+$/, ''), headers });
  }

  async upsert(records) {
    const items = toItems(records);
    if (items.length === 0) return [];
    await this._prepare(true);
    const objects = items.map((item) => {
      const properties = { [this.textKey]: item.text, [ID_PROPERTY]: item.id, [METADATA_PROPERTY]: JSON.stringify(item.metadata) };
      for (const [key, value] of Object.entries(item.metadata)) {
        if (key === this.textKey || RESERVED.has(key) || !PROPERTY_NAME.test(key)) continue;
        if (isScalar(value) || (Array.isArray(value) && value.length > 0 && value.every(isScalar))) properties[key] = value;
      }
      const object = { class: this.className, id: stableUuid(item.id), properties };
      if (this.vectorName) object.vectors = { [this.vectorName]: item.vector };
      else object.vector = item.vector;
      return object;
    });
    for (let start = 0; start < objects.length; start += this.batchSize) {
      const results = await this._request('POST', '/v1/batch/objects', { objects: objects.slice(start, start + this.batchSize) });
      // the batch answers 200 and reports failures per object
      const failed = (Array.isArray(results) ? results : []).find((result) => result.result && result.result.errors);
      if (failed) {
        const messages = (failed.result.errors.error || []).map((error) => error.message).join('; ');
        throw new Error(`Weaviate error: object ${failed.id}: ${messages || JSON.stringify(failed.result.errors)}`);
      }
    }
    return items.map((item) => item.id);
  }

  async query(params = {}) {
    const vector = await this._queryVector(params);
    await this._prepare(false);
    const near = { vector };
    if (this.vectorName) near.targetVectors = [this.vectorName];
    const args = [`nearVector: ${gql(near)}`, `limit: ${Math.floor(params.topK || 5)}`];
    const where = params.nativeFilter || toWeaviateWhere(params.filter);
    if (where) args.push(`where: ${gql(where)}`);
    const fields = `${this.textKey} ${ID_PROPERTY} ${METADATA_PROPERTY} _additional { id distance }`;
    const data = await this._request('POST', '/v1/graphql', { query: `{ Get { ${this.className}(${args.join(', ')}) { ${fields} } } }` });
    if (data && Array.isArray(data.errors) && data.errors.length > 0) {
      throw new Error(`Weaviate error: ${data.errors.map((error) => error.message).join('; ')}`);
    }
    const objects = (data && data.data && data.data.Get && data.data.Get[this.className]) || [];
    return objects.map((object) => {
      const additional = object._additional || {};
      return {
        id: object[ID_PROPERTY] ?? additional.id,
        score: this._score(additional.distance),
        text: object[this.textKey] ?? null,
        metadata: parseMetadata(object[METADATA_PROPERTY]),
      };
    }).sort((a, b) => b.score - a.score);
  }

  async delete(ids) {
    const uuids = (ids || []).map(stableUuid);
    for (let start = 0; start < uuids.length; start += 1000) {
      await this._request('DELETE', '/v1/batch/objects', {
        match: { class: this.className, where: { path: ['id'], operator: 'ContainsAny', valueTextArray: uuids.slice(start, start + 1000) } },
        output: 'minimal',
      });
    }
  }

  _score(distance) {
    if (this.distance === 'cosine') return 1 - distance;
    if (this.distance === 'dot') return -distance;
    return 1 / (1 + distance);
  }

  // Read the class once: an existing class decides the vector setup; a missing one is created on the first upsert.
  async _prepare(create) {
    if (this._classReady) return;
    if (!this._loading) this._loading = this._loadClass().finally(() => { this._loading = null; });
    if (await this._loading) {
      this._classReady = true;
    } else if (create && this.createClass) {
      await this._createClass();
      this._classReady = true;
    }
  }

  async _loadClass() {
    let schema;
    try {
      schema = await this._request('GET', `/v1/schema/${this.className}`);
    } catch (error) {
      if (error.status === 404) return false;
      throw error;
    }
    const named = schema && schema.vectorConfig ? Object.keys(schema.vectorConfig) : [];
    if (named.length === 0) {
      this.vectorName = null;
    } else if (!named.includes(this.vectorName)) {
      this.vectorName = named[0];
    }
    const indexConfig = this.vectorName ? schema.vectorConfig[this.vectorName].vectorIndexConfig : schema && schema.vectorIndexConfig;
    if (indexConfig && indexConfig.distance) this.distance = indexConfig.distance;
    return true;
  }

  async _createClass() {
    const vectorIndexConfig = { distance: this.distance };
    const definition = {
      class: this.className,
      properties: [
        { name: this.textKey, dataType: ['text'] },
        { name: ID_PROPERTY, dataType: ['text'], tokenization: 'field' },
        { name: METADATA_PROPERTY, dataType: ['text'], indexFilterable: false, indexSearchable: false },
      ],
    };
    if (this.vectorName) {
      definition.vectorConfig = { [this.vectorName]: { vectorizer: { none: {} }, vectorIndexType: 'hnsw', vectorIndexConfig } };
    } else {
      Object.assign(definition, { vectorizer: 'none', vectorIndexType: 'hnsw', vectorIndexConfig });
    }
    try {
      await this._request('POST', '/v1/schema', definition, { retries: 0 });
    } catch (error) {
      // created meanwhile by another call
      if (!(await this._loadClass().catch(() => false))) throw error;
    }
  }

  async _request(method, path, body, extraConfig = {}) {
    try {
      return await this.client.request(method, path, body, extraConfig);
    } catch (error) {
      throw weaviateError(error);
    }
  }
}

function toItems(records) {
  return (records || []).map((record) => {
    if (!Array.isArray(record.vector)) throw new Error(`Record '${record.id}' has no vector.`);
    return { id: String(record.id), vector: record.vector, text: record.text ?? null, metadata: record.metadata || {} };
  });
}

module.exports = { WeaviateVectorStore };

},{"../utils/ConnHelper":52,"../utils/FetchClient":53,"./QdrantVectorStore":45,"./VectorStore":46}],50:[function(require,module,exports){
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
},{"./FileHelper":54,"buffer":25}],51:[function(require,module,exports){
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
},{"../controller/RemoteEmbedModel":2,"../function/SemanticSearch":10}],52:[function(require,module,exports){
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
    if (!error || typeof error !== 'object') return String(error);
    if (error.response && error.response.data) {
      return `Unexpected HTTP response: ${error.response.status} Error details: ${JSON.stringify(error.response.data)}`;
    }
    return error.message;
  }

  /**
   * The error a wrapper rethrows: same message as before, keeping name (AbortError), code (ETIMEDOUT),
   * status and body from the HTTP layer, with the original error as cause.
   */
  static wrapError(error) {
    const wrapped = new Error(ConnHelper.getErrorMessage(error));
    if (error && typeof error === 'object') {
      if (error.name && error.name !== 'Error') wrapped.name = error.name;
      for (const key of ['code', 'status', 'body']) {
        if (error[key] !== undefined) wrapped[key] = error[key];
      }
      wrapped.cause = error;
    }
    return wrapped;
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
},{"buffer":25}],53:[function(require,module,exports){
(function (process,Buffer){(function (){
const fetch = require('cross-fetch');
const FormData = require('form-data');

// Statuses worth retrying: request timeout, conflict, too early, rate limit and server errors.
const RETRY_STATUSES = new Set([408, 409, 425, 429, 500, 502, 503, 504]);
const MAX_BACKOFF_MS = 30000;
const MAX_RETRY_AFTER_MS = 60000;
// true in Node, false in the browser bundle (browserify's process shim has no versions.node)
const IS_NODE = typeof process !== 'undefined' && Boolean(process.versions && process.versions.node);

function isNativeFormData(data) {
  return typeof globalThis.FormData !== 'undefined' && data instanceof globalThis.FormData;
}

function isFormData(data) {
  return data instanceof FormData || isNativeFormData(data);
}

// node-fetch does not understand Node's global FormData, so copy it into a form-data instance.
async function toNodeForm(data) {
  const form = new FormData();
  for (const [key, value] of data.entries()) {
    if (typeof value === 'string') {
      form.append(key, value);
    } else {
      form.append(key, Buffer.from(await value.arrayBuffer()), {
        filename: value.name || 'blob',
        ...(value.type && { contentType: value.type }),
      });
    }
  }
  return form;
}

function deleteContentType(headers) {
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === 'content-type') delete headers[key];
  }
}

// Retry-After can be seconds or an HTTP date.
function retryAfterMs(response) {
  const header = response.headers && typeof response.headers.get === 'function' && response.headers.get('retry-after');
  if (!header) return null;
  const seconds = Number(header);
  if (!Number.isNaN(seconds)) return seconds * 1000;
  const date = Date.parse(header);
  return Number.isNaN(date) ? null : Math.max(0, date - Date.now());
}

// Resolves after ms, or rejects with an AbortError as soon as the caller's signal aborts.
function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal && signal.aborted) {
      reject(abortError());
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(abortError());
    };
    const timer = setTimeout(() => {
      if (signal) signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    if (signal) signal.addEventListener('abort', onAbort, { once: true });
  });
}

// One AbortSignal that fires on the caller's signal or on the timeout.
function linkSignal(signal, timeout) {
  const controller = new AbortController();
  const state = { signal: controller.signal, timedOut: false, timer: null };
  if (timeout) {
    state.timer = setTimeout(() => {
      state.timedOut = true;
      controller.abort();
    }, timeout);
  }
  state.abort = () => controller.abort();
  const onAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', onAbort);
  }
  state.clearTimer = () => {
    if (state.timer) clearTimeout(state.timer);
    state.timer = null;
  };
  state.cleanup = () => {
    state.clearTimer();
    if (signal) signal.removeEventListener('abort', onAbort);
  };
  return state;
}

/**
 * Small fetch wrapper shared by every provider wrapper: JSON or FormData bodies, JSON / stream / arraybuffer
 * responses, a per-request timeout, retries with exponential backoff (honouring Retry-After) and AbortSignal.
 *
 * Defaults come from FetchClient.defaults and can be changed globally with FetchClient.configure({...}),
 * per client with setRequestOptions({...}), or per call through extraConfig.
 */
class FetchClient {
  constructor({ baseURL = '', headers = {}, timeout, retries, retryDelay, signal } = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = headers;
    this.requestOptions = {};
    this.setRequestOptions({ timeout, retries, retryDelay, signal });
  }

  /** Change the defaults for every FetchClient created afterwards. */
  static configure(options = {}) {
    for (const key of ['timeout', 'retries', 'retryDelay']) {
      if (options[key] !== undefined) FetchClient.defaults[key] = options[key];
    }
    return FetchClient.defaults;
  }

  /** Set timeout (ms), retries, retryDelay (ms) or an AbortSignal for this client; undefined values are ignored. */
  setRequestOptions(options = {}) {
    for (const key of ['timeout', 'retries', 'retryDelay', 'signal']) {
      if (options[key] !== undefined) this.requestOptions[key] = options[key];
    }
    return this;
  }

  resolveOptions(extraConfig) {
    const pick = (key) => (extraConfig[key] !== undefined ? extraConfig[key]
      : this.requestOptions[key] !== undefined ? this.requestOptions[key] : FetchClient.defaults[key]);
    return {
      timeout: pick('timeout') || 0,
      retries: Math.max(0, pick('retries') || 0),
      retryDelay: pick('retryDelay') || 0,
      signal: extraConfig.signal || this.requestOptions.signal || null,
    };
  }

  /**
   * Send a POST request.
   *
   * @param {string} endpoint - URL path or full URL if it starts with http.
   * @param {object|FormData} data - Data to send in the request body.
   * @param {object} extraConfig - Optional { headers, responseType: 'arraybuffer' | 'stream' | 'text', timeout, retries, retryDelay, signal }.
   * @returns {Promise<any|ReadableStream|ArrayBuffer>} - JSON by default, or the stream/arrayBuffer if specified.
   */
  async post(endpoint, data, extraConfig = {}) {
    return this.request('POST', endpoint, data, extraConfig);
  }

  /**
   * Send a GET request.
   *
   * @param {string} endpoint - URL path or full URL if it starts with http.
   * @param {object} extraConfig - Optional { headers, responseType: 'arraybuffer' | 'stream' | 'text', timeout, retries, retryDelay, signal }.
   * @returns {Promise<any|ReadableStream|ArrayBuffer>} - JSON by default, or the stream/arrayBuffer if specified.
   */
  async get(endpoint, extraConfig = {}) {
    return this.request('GET', endpoint, undefined, extraConfig);
  }

  async request(method, endpoint, data, extraConfig = {}) {
    const url = endpoint.startsWith('http') ? endpoint : this.baseURL + endpoint;
    const headers = { ...this.defaultHeaders, ...(extraConfig.headers || {}) };

    if (IS_NODE && isNativeFormData(data) && !(data instanceof FormData)) {
      data = await toNodeForm(data);
    }

    let body;
    const formBody = isFormData(data);
    if (formBody) {
      body = data;
      // the multipart boundary header comes from the form (Node) or from fetch itself (browser)
      deleteContentType(headers);
      if (typeof data.getHeaders === 'function') Object.assign(headers, data.getHeaders());
    } else if (data !== undefined) {
      body = JSON.stringify(data);
    }

    const options = this.resolveOptions(extraConfig);
    // a multipart body with file streams cannot be sent twice
    const retries = formBody ? 0 : options.retries;

    for (let attempt = 0; ; attempt++) {
      if (options.signal && options.signal.aborted) throw abortError();
      const link = linkSignal(options.signal, options.timeout);
      let response;
      try {
        response = await fetch(url, { method, headers, body, signal: link.signal });
      } catch (error) {
        link.cleanup();
        if (options.signal && options.signal.aborted) throw abortError();
        const failure = link.timedOut ? timeoutError(options.timeout, url) : error;
        if (attempt < retries) {
          await sleep(backoff(attempt, options.retryDelay), options.signal);
          continue;
        }
        throw failure;
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        link.cleanup();
        if (options.signal && options.signal.aborted) throw abortError();
        if (attempt < retries && RETRY_STATUSES.has(response.status)) {
          const wait = retryAfterMs(response);
          await sleep(wait !== null && wait <= MAX_RETRY_AFTER_MS ? wait : backoff(attempt, options.retryDelay), options.signal);
          continue;
        }
        const error = new Error(`HTTP error ${response.status}: ${errorText}`);
        error.status = response.status;
        error.body = errorText;
        throw error;
      }

      if (extraConfig.responseType === 'stream') {
        // the timeout covers the connection only; the caller's signal can still cancel the stream
        link.clearTimer();
        return releaseStream(response.body, link);
      }
      try {
        if (extraConfig.responseType === 'arraybuffer') return await response.arrayBuffer();
        if (extraConfig.responseType === 'text') return await response.text();
        return await response.json();
      } catch (error) {
        // the timeout also covers the body download; a parse error is not retried
        if (options.signal && options.signal.aborted) throw abortError();
        if (!link.timedOut) throw error;
        if (attempt < retries) {
          link.cleanup();
          await sleep(backoff(attempt, options.retryDelay), options.signal);
          continue;
        }
        throw timeoutError(options.timeout, url);
      } finally {
        link.cleanup();
      }
    }
  }
}

FetchClient.defaults = { timeout: 300000, retries: 2, retryDelay: 500 };

function backoff(attempt, retryDelay) {
  return Math.min(MAX_BACKOFF_MS, retryDelay * (2 ** attempt)) + Math.floor(Math.random() * 250);
}

// Tie the request to the body: the listener on the caller's signal is removed when the body finishes, and a
// Node body destroyed before its end (e.g. a for-await loop that breaks) also aborts the request, otherwise the
// paused socket stays open until the server has sent the whole response.
function releaseStream(body, link) {
  if (body && typeof body.once === 'function' && typeof body.on === 'function') {
    body.once('close', () => {
      if (!body.readableEnded) {
        body.on('error', () => {});
        link.abort();
      }
      link.cleanup();
    });
    return body;
  }
  if (body && typeof body.pipeThrough === 'function' && typeof TransformStream !== 'undefined') {
    return body.pipeThrough(new TransformStream({
      flush() { link.cleanup(); },
      cancel() { link.cleanup(); },
    }));
  }
  return body;
}

function timeoutError(timeout, url) {
  return Object.assign(new Error(`Request timed out after ${timeout}ms: ${url}`), { code: 'ETIMEDOUT' });
}

function abortError() {
  const error = new Error('The request was aborted.');
  error.name = 'AbortError';
  error.code = 'ABORT_ERR';
  return error;
}

module.exports = FetchClient;

}).call(this)}).call(this,require('_process'),require("buffer").Buffer)
},{"_process":30,"buffer":25,"cross-fetch":26,"form-data":27}],54:[function(require,module,exports){
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

},{"fs":24}],55:[function(require,module,exports){
const { RemoteEmbedModel, SupportedEmbedModels } = require('../controller/RemoteEmbedModel');
const LanguageModelInput = require('../model/input/LanguageModelInput');
const { Chatbot, SupportedChatModels } = require("../function/Chatbot");
const { RemoteLanguageModel, SupportedLangModels } = require("../controller/RemoteLanguageModel");
const { ChatGPTInput, LLamaReplicateInput, LLamaSageInput, GeminiInput, CohereInput, MistralInput, AnthropicInput } = require("../model/input/ChatModelInput");
const MatchHelpers = require('../utils/MatchHelpers');
const EmbedInput = require('../model/input/EmbedInput');
const { ModelEvaluation } = require('./ModelEvaluation');
const config = require('../config.json');
const { isReasoningModel } = require('./ModelHelper');

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
      } else if (SupportedChatModels.GEMINI == provider.toLowerCase() || SupportedChatModels.VERTEX == provider.toLowerCase()) {
        input = new GeminiInput("provide direct answer", { model: modelName, maxTokens: maxTokens });
      } else if (SupportedChatModels.COHERE == provider.toLowerCase()) {
        input = new CohereInput("provide direct answer", { model: modelName, maxTokens: maxTokens });
      } else if (SupportedChatModels.MISTRAL == provider.toLowerCase()) {
        input = new MistralInput("provide direct answer", { model: modelName, maxTokens: maxTokens });
      } else if (SupportedChatModels.ANTHROPIC == provider.toLowerCase()) {
        input = new AnthropicInput("provide direct answer", { model: modelName, maxTokens: maxTokens });
      } else {
        const openaiModel = modelName || config.url.openai.models.chat;
        // reasoning models (gpt-5+) spend output tokens on thinking, so only cap older models
        input = new ChatGPTInput("provide direct answer",
          isReasoningModel(openaiModel) ? { model: openaiModel } : { model: openaiModel, maxTokens: maxTokens });
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
},{"../config.json":1,"../controller/RemoteEmbedModel":2,"../controller/RemoteLanguageModel":5,"../function/Chatbot":8,"../model/input/ChatModelInput":15,"../model/input/EmbedInput":16,"../model/input/LanguageModelInput":20,"../utils/MatchHelpers":57,"./ModelEvaluation":58,"./ModelHelper":59}],56:[function(require,module,exports){
(function (process){(function (){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const fetch = require('cross-fetch');
const rpc = require('../mcp/jsonrpc');
const packageInfo = require('../package.json');

const {
  ERROR_CODES, MODERN_ERROR_CODES, MODERN_VERSIONS, LATEST_LEGACY_VERSION, META_KEYS, NAME_HEADER_FIELDS, JsonRpcError,
} = rpc;

const DEFAULT_TIMEOUT = 60000;
// how long the server/discover era probe waits before a silent server is treated as legacy
const DEFAULT_PROBE_TIMEOUT = 5000;
const SHUTDOWN_GRACE = 2000;
const MAX_LIST_PAGES = 1000;

// Stop reading a response body and close its connection. node-fetch v2 keeps the socket open until the request is
// aborted and reports that abort as an 'error' event on the body, so the body gets a no-op error listener first.
// In the browser the body is a ReadableStream whose reader was already cancelled; the abort closes the request.
function releaseBody(body, controller) {
  if (body && typeof body.on === 'function') {
    body.on('error', () => {});
    if (typeof body.destroy === 'function' && !body.destroyed) body.destroy();
  }
  controller.abort();
}

class MCPTimeoutError extends Error {
  constructor(method, timeout) {
    super(`MCP request '${method}' timed out after ${timeout}ms`);
    this.name = 'MCPTimeoutError';
  }
}

/**
 * MCPClient - Model Context Protocol client for Streamable HTTP and stdio servers.
 *
 * Talks the modern protocol (2026-07-28, per-request _meta, no sessions) and falls back to the legacy
 * initialize handshake (2025-11-25 and earlier, Mcp-Session-Id over HTTP) when the server needs it.
 *
 * Usage:
 *   const client = new MCPClient('https://host/mcp');                              // Streamable HTTP
 *   const client = new MCPClient({ url, headers: { Authorization: 'Bearer ..' } }); // with auth headers
 *   const client = new MCPClient({ command: 'npx', args: ['-y', 'pkg'] });         // stdio subprocess
 *   await client.connect();                         // handshake, then the tool list is fetched into client.tools
 *   const tools = client.listTools();                // cached tools (sync); await client.fetchTools() refreshes them
 *   const { text } = await client.callTool('tool_name', { param: 'value' });
 *   await client.close();
 */
class MCPClient {
  constructor(options = {}) {
    const config = typeof options === 'string' ? { url: options } : { ...options };
    if (!config.url && !config.command) {
      throw new Error('MCPClient needs a url (Streamable HTTP) or a command (stdio subprocess)');
    }
    this.url = config.url ? String(config.url).replace(/(.)\/$/, '$1') : null;
    this.headers = { ...(config.headers || {}) };
    this.command = config.command || null;
    this.args = Array.isArray(config.args) ? config.args.slice() : [];
    this.env = config.env || null;
    this.cwd = config.cwd || null;
    this.transport = this.command ? 'stdio' : 'http';
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.probeTimeout = config.probeTimeout || DEFAULT_PROBE_TIMEOUT;
    this.debug = Boolean(config.debug);
    this.clientInfo = { name: config.name || 'intellinode', version: config.version || packageInfo.version };
    this.onNotification = typeof config.onNotification === 'function' ? config.onNotification : null;

    this.era = null; // 'modern' | 'legacy', cached per server
    this.protocolVersion = null;
    this.serverInfo = null;
    this.capabilities = null;
    this.instructions = null;
    this.sessionId = null; // legacy HTTP only
    this.tools = [];
    this.toolsFetched = false;
    this.requestId = 0;
    this.connecting = null; // the in-flight connect() promise, shared by concurrent first requests

    this.process = null;
    this.pending = new Map();
    this.exitError = null;
  }

  /** { name: MCPClient } from a Claude Desktop / Cursor style { mcpServers: { name: { command | url, ... } } }. */
  static fromConfig(config, defaults = {}) {
    const servers = config && config.mcpServers ? config.mcpServers : config || {};
    const clients = {};
    for (const [name, entry] of Object.entries(servers)) {
      if (!entry || typeof entry !== 'object' || entry.disabled) continue;
      clients[name] = new MCPClient({ ...defaults, ...entry });
    }
    return clients;
  }

  // ---------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------

  /**
   * Detect the server era, run the handshake and fetch the tool list into client.tools.
   * Resolves with { protocolVersion, serverInfo, capabilities, instructions }; concurrent calls share one handshake.
   */
  async connect() {
    if (this.connecting) return this.connecting;
    if (this.era) return this._info();
    this.connecting = this._connect().finally(() => {
      this.connecting = null;
    });
    return this.connecting;
  }

  async _connect() {
    try {
      if (this.transport === 'stdio') await this._spawn();
      const probe = await this._probe(MODERN_VERSIONS[0]);
      if (probe.kind === 'legacy') {
        this._log(`legacy server detected (${probe.reason}); using the initialize handshake`);
        await this._initializeLegacy();
      } else {
        this._applyDiscover(probe.result, probe.version);
      }
      await this._loadTools();
    } catch (error) {
      // a failed handshake must not leave a server process (and the parent event loop) or a legacy session behind
      await this._release();
      this.era = null;
      this.protocolVersion = null;
      this.sessionId = null;
      this.toolsFetched = false;
      throw error;
    }
    return this._info();
  }

  /** Connect when needed, fetch every tool and return the list (the intellinode 2.x entry point). */
  async initialize() {
    try {
      return await this.fetchTools();
    } catch (error) {
      throw new Error(`Failed to initialize MCP client: ${error.message}`);
    }
  }

  /** End the stdio process or the legacy HTTP session; the client can connect() again afterwards. */
  async close() {
    await this._release();
    this.era = null;
    this.protocolVersion = null;
    this.sessionId = null;
    this.exitError = null;
    this.toolsFetched = false; // the cached tools stay readable; a new connect() refreshes them
  }

  // Stop the stdio process, or DELETE the legacy HTTP session.
  async _release() {
    if (this.transport === 'stdio') {
      await this._stopProcess();
    } else if (this.era === 'legacy' && this.sessionId) {
      try {
        await this._fetch({ method: 'DELETE', headers: this._legacyHeaders() }, SHUTDOWN_GRACE);
      } catch (error) {
        this._log(`session DELETE ignored: ${error.message}`);
      }
    }
  }

  _info() {
    return {
      protocolVersion: this.protocolVersion,
      serverInfo: this.serverInfo,
      capabilities: this.capabilities,
      instructions: this.instructions,
    };
  }

  // ---------------------------------------------------------------------
  // Tools
  // ---------------------------------------------------------------------

  /** The cached tool list (sync, as in intellinode 2.x): connect() fills it, fetchTools() refreshes it. */
  listTools() {
    return this.tools;
  }

  /** Fetch every page of tools/list (connecting first when needed), cache the tools in client.tools and return them. */
  async fetchTools() {
    if (this.connecting || !this.era) {
      await this.connect();
      // the handshake fetched the list, so one connect() plus fetchTools() is still a single tools/list
      if (this.toolsFetched) return this.tools;
    }
    return this._fetchToolPages();
  }

  /** Same as fetchTools(); the intellinode 2.x name. */
  async getTools() {
    return this.fetchTools();
  }

  // Part of connect(): a server without tools (method not found, or tools not advertised) leaves the cache empty.
  async _loadTools() {
    try {
      await this._fetchToolPages();
    } catch (error) {
      const advertised = !this.capabilities || this.capabilities.tools !== undefined;
      if (!(error instanceof JsonRpcError) || (error.code !== ERROR_CODES.METHOD_NOT_FOUND && advertised)) throw error;
      this._log(`tools/list unavailable (${error.message}); the tool cache stays empty`);
      this.tools = [];
      this.toolsFetched = true;
    }
  }

  async _fetchToolPages() {
    const tools = [];
    const seen = new Set();
    let cursor;
    for (let page = 0; page < MAX_LIST_PAGES; page++) {
      const result = await this._request('tools/list', cursor !== undefined ? { cursor } : {});
      tools.push(...(Array.isArray(result.tools) ? result.tools : []));
      cursor = result.nextCursor;
      if (cursor === undefined || cursor === null || cursor === '' || seen.has(cursor)) break;
      seen.add(cursor);
    }
    this.tools = tools;
    this.toolsFetched = true;
    return tools;
  }

  /**
   * Call a tool. Resolves with { content, structuredContent, isError, text } where text joins the text blocks;
   * a protocol error (unknown tool, invalid params) rejects with a JsonRpcError.
   */
  async callTool(name, args = {}, { timeout } = {}) {
    if (this.connecting || !this.era) await this.connect();
    const result = await this._request('tools/call', { name, arguments: args || {} }, { timeout });
    const content = Array.isArray(result.content) ? result.content : [];
    return {
      content,
      structuredContent: result.structuredContent,
      isError: Boolean(result.isError),
      text: content
        .filter((block) => block && block.type === 'text' && typeof block.text === 'string')
        .map((block) => block.text)
        .join('\n'),
    };
  }

  /** Cached tools in the chat-completions tool format understood by the IntelliNode chat inputs. */
  toChatTools() {
    return this.tools.map((tool) => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description || tool.title || '',
        parameters: tool.inputSchema || { type: 'object', properties: {} },
      },
    }));
  }

  getTool(toolName) {
    return this.tools.find((tool) => tool.name === toolName) || null;
  }

  getToolNames() {
    return this.tools.map((tool) => tool.name);
  }

  hasTool(toolName) {
    return this.tools.some((tool) => tool.name === toolName);
  }

  // ---------------------------------------------------------------------
  // Era detection
  // ---------------------------------------------------------------------

  // Send server/discover; { kind: 'modern', result, version } or { kind: 'legacy', reason }.
  async _probe(version, allowRetry = true) {
    const message = rpc.request(this._nextId(), 'server/discover', { _meta: this._meta(version) });
    let outcome;
    if (this.transport === 'stdio') {
      let reply;
      try {
        reply = await this._sendStdio(message, this.probeTimeout, false);
      } catch (error) {
        if (error instanceof MCPTimeoutError) return { kind: 'legacy', reason: 'no answer to server/discover' };
        throw error;
      }
      outcome = this._classify(reply, null);
    } else {
      const reply = await this._postHttp(message, this._modernHeaders(message, version), this.timeout);
      outcome = this._classify(reply.message, reply.status);
    }

    if (outcome.kind === 'retry') {
      const supported = Array.isArray(outcome.supported) ? outcome.supported : [];
      const mutual = MODERN_VERSIONS.find((candidate) => supported.includes(candidate));
      if (!mutual || !allowRetry) {
        throw new Error(`No mutually supported MCP protocol version: server supports ${supported.join(', ') || 'none'}, client supports ${MODERN_VERSIONS.join(', ')}`);
      }
      return this._probe(mutual, false);
    }
    return outcome.kind === 'modern' ? { ...outcome, version } : outcome;
  }

  // Modern servers answer with a DiscoverResult or a recognised modern error; anything else is legacy.
  _classify(message, status) {
    if (!message) return { kind: 'legacy', reason: status ? `HTTP ${status} without a JSON-RPC body` : 'empty reply' };
    if ('result' in message) return { kind: 'modern', result: message.result };
    const error = message.error || {};
    if (error.code === ERROR_CODES.UNSUPPORTED_PROTOCOL_VERSION) {
      return { kind: 'retry', supported: error.data && error.data.supported };
    }
    if (MODERN_ERROR_CODES.has(error.code)) throw rpc.errorFromResponse(message);
    // a modern server without server/discover (spec violation) still answers 404 + method not found
    if (status !== null && status >= 400 && status < 500 && error.code === ERROR_CODES.METHOD_NOT_FOUND) {
      return { kind: 'modern', result: {} };
    }
    return { kind: 'legacy', reason: `server/discover answered ${error.code}: ${error.message}` };
  }

  _applyDiscover(result, version) {
    const supported = Array.isArray(result.supportedVersions) ? result.supportedVersions : [version];
    this.era = 'modern';
    this.protocolVersion = supported.includes(version) ? version : (MODERN_VERSIONS.find((v) => supported.includes(v)) || version);
    this.capabilities = result.capabilities || {};
    this.serverInfo = (result._meta && result._meta[META_KEYS.serverInfo]) || null;
    this.instructions = result.instructions || null;
  }

  async _initializeLegacy() {
    this.era = 'legacy';
    this.protocolVersion = LATEST_LEGACY_VERSION;
    this.sessionId = null;
    const params = { protocolVersion: LATEST_LEGACY_VERSION, capabilities: {}, clientInfo: this.clientInfo };
    let result;
    try {
      result = await this._request('initialize', params, { legacyInit: true });
    } catch (error) {
      // a modern-only server names its versions when rejecting initialize; take the hint instead of failing
      const supported = error && error.data && Array.isArray(error.data.supported) ? error.data.supported : [];
      const mutual = MODERN_VERSIONS.find((candidate) => supported.includes(candidate));
      if (!mutual) throw error;
      this.era = null;
      const probe = await this._probe(mutual, false);
      if (probe.kind !== 'modern') throw error;
      this._applyDiscover(probe.result, mutual);
      return;
    }
    if (result.protocolVersion) this.protocolVersion = String(result.protocolVersion);
    this.capabilities = result.capabilities || {};
    this.serverInfo = result.serverInfo || null;
    this.instructions = result.instructions || null;
    await this._notify('notifications/initialized');
  }

  // ---------------------------------------------------------------------
  // Requests
  // ---------------------------------------------------------------------

  _nextId() {
    this.requestId += 1;
    return this.requestId;
  }

  _meta(version) {
    return {
      [META_KEYS.protocolVersion]: version,
      [META_KEYS.clientInfo]: this.clientInfo,
      [META_KEYS.clientCapabilities]: {},
    };
  }

  _withMeta(params) {
    const base = params && typeof params === 'object' ? params : {};
    return { ...base, _meta: { ...(base._meta || {}), ...this._meta(this.protocolVersion) } };
  }

  async _request(method, params = {}, { timeout, legacyInit = false } = {}) {
    const wait = timeout || this.timeout;
    const modern = this.era === 'modern';
    const message = rpc.request(this._nextId(), method, modern ? this._withMeta(params) : params);

    if (this.transport === 'stdio') {
      const reply = await this._sendStdio(message, wait, true);
      if (reply.error) throw rpc.errorFromResponse(reply);
      return reply.result;
    }

    const headers = modern ? this._modernHeaders(message, this.protocolVersion) : this._legacyHeaders(legacyInit);
    let reply = await this._postHttp(message, headers, wait);
    // a legacy server that dropped the session answers 404: start a new one and retry once
    if (!modern && !legacyInit && reply.status === 404 && this.sessionId) {
      this._log('session expired; re-initializing');
      await this._initializeLegacy();
      reply = await this._postHttp(message, this._legacyHeaders(), wait);
    }
    if (legacyInit) {
      const sessionId = reply.headers && reply.headers.get && reply.headers.get('mcp-session-id');
      if (sessionId) this.sessionId = sessionId;
    }
    if (reply.message) {
      if (reply.message.error) throw rpc.errorFromResponse(reply.message);
      return reply.message.result;
    }
    throw new Error(`MCP request '${method}' failed: HTTP ${reply.status}${reply.text ? ` ${reply.text.slice(0, 200)}` : ''}`);
  }

  async _notify(method, params) {
    const message = rpc.notification(method, this.era === 'modern' ? this._withMeta(params) : params);
    if (this.transport === 'stdio') {
      await this._writeStdio(message);
      return;
    }
    const headers = this.era === 'modern' ? this._modernHeaders(message, this.protocolVersion) : this._legacyHeaders();
    const reply = await this._postHttp(message, headers, this.timeout);
    if (reply.status >= 400) {
      throw new Error(`MCP notification '${method}' rejected: HTTP ${reply.status}`);
    }
  }

  _emitNotification(message) {
    if (this.onNotification) {
      try {
        this.onNotification(message);
      } catch (error) {
        this._log(`onNotification failed: ${error.message}`);
      }
    }
  }

  // ---------------------------------------------------------------------
  // Streamable HTTP transport
  // ---------------------------------------------------------------------

  _modernHeaders(message, version) {
    const headers = {
      Accept: 'application/json, text/event-stream',
      'Content-Type': 'application/json',
      'MCP-Protocol-Version': version,
      'Mcp-Method': message.method,
    };
    const field = NAME_HEADER_FIELDS[message.method];
    if (field && message.params && message.params[field] !== undefined && message.params[field] !== null) {
      headers['Mcp-Name'] = rpc.encodeHeaderValue(message.params[field]);
    }
    return headers;
  }

  _legacyHeaders(isInitialize = false) {
    const headers = {
      Accept: 'application/json, text/event-stream',
      'Content-Type': 'application/json',
    };
    // the version header is only defined once a version has been negotiated
    if (!isInitialize && this.protocolVersion) headers['MCP-Protocol-Version'] = this.protocolVersion;
    if (!isInitialize && this.sessionId) headers['Mcp-Session-Id'] = this.sessionId;
    return headers;
  }

  async _fetch(init, timeout) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      return await fetch(this.url, { ...init, headers: { ...this.headers, ...(init.headers || {}) }, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  // POST one message; { status, headers, message (the matching JSON-RPC response or null), text }.
  async _postHttp(message, headers, timeout) {
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeout);
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: { ...this.headers, ...headers },
        body: rpc.serialize(message),
        signal: controller.signal,
      });
      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      const reply = { status: response.status, headers: response.headers, message: null, text: '' };
      if (response.status === 202 || response.status === 204) return reply;

      if (contentType.includes('text/event-stream')) {
        try {
          for await (const item of rpc.readSSEMessages(response.body, (data) => this._log(`ignored SSE data: ${data}`))) {
            if (rpc.isResponse(item) && rpc.isRequest(message) && String(item.id) === String(message.id)) {
              reply.message = item;
              break;
            }
            if (rpc.isNotification(item)) this._emitNotification(item);
          }
        } finally {
          // the stream may stay open after the reply (keep-alives, later events): release the connection
          releaseBody(response.body, controller);
        }
        return reply;
      }

      reply.text = await response.text();
      if (reply.text) {
        try {
          const parsed = JSON.parse(reply.text);
          const candidates = Array.isArray(parsed) ? parsed : [parsed];
          reply.message = candidates.find((item) => rpc.isResponse(item)
            && (!rpc.isRequest(message) || item.id === null || String(item.id) === String(message.id))) || null;
        } catch (error) {
          this._log(`non-JSON body (HTTP ${response.status})`);
        }
      }
      return reply;
    } catch (error) {
      // only the timer counts as a timeout; releaseBody() also aborts, after the reply has been read
      if (timedOut) throw new MCPTimeoutError(message.method, timeout);
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  // ---------------------------------------------------------------------
  // stdio transport
  // ---------------------------------------------------------------------

  async _spawn() {
    if (this.process) return;
    // required lazily: the browser bundle maps child_process and readline to empty modules
    const { spawn } = require('child_process');
    const readline = require('readline');
    if (typeof spawn !== 'function' || typeof readline.createInterface !== 'function') {
      throw new Error('The MCP stdio transport ({ command }) needs Node.js; in the browser use { url } (Streamable HTTP)');
    }

    this.exitError = null;
    const child = spawn(this.command, this.args, {
      cwd: this.cwd || undefined,
      env: this.env ? { ...process.env, ...this.env } : process.env,
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });
    this.process = child;

    // a child that was already replaced by close() + connect() must not fail the new one
    const current = () => !this.process || this.process === child;
    child.on('error', (error) => {
      if (!current()) return;
      this.exitError = new Error(`Failed to start MCP server '${this.command}': ${error.message}`);
      this._failAll(this.exitError);
    });
    child.on('exit', (code, signal) => {
      if (!current()) return;
      const reason = signal ? `signal ${signal}` : `code ${code}`;
      this.exitError = new Error(`MCP server process '${this.command}' exited (${reason})`);
      this._failAll(this.exitError);
    });
    child.stdin.on('error', (error) => this._failAll(new Error(`MCP server stdin closed: ${error.message}`)));
    child.stderr.on('data', (chunk) => {
      if (this.debug) process.stderr.write(`[mcp:${this.command}] ${chunk}`);
    });
    readline.createInterface({ input: child.stdout, crlfDelay: Infinity, terminal: false })
      .on('line', (line) => this._onLine(line));
  }

  _onLine(line) {
    if (!line.trim()) return;
    let message;
    try {
      message = rpc.parseMessage(line);
    } catch (error) {
      this._log(`ignored stdout line: ${line.slice(0, 200)}`);
      return;
    }
    if (rpc.isResponse(message)) {
      const entry = this.pending.get(String(message.id));
      if (!entry) return;
      this.pending.delete(String(message.id));
      clearTimeout(entry.timer);
      entry.resolve(message);
    } else if (rpc.isNotification(message)) {
      this._emitNotification(message);
    } else if (rpc.isRequest(message)) {
      // legacy servers may ask for roots or sampling; this client offers neither
      this._writeStdio(rpc.errorResponse(message.id, ERROR_CODES.METHOD_NOT_FOUND, `Method not supported by client: ${message.method}`)).catch(() => {});
    }
  }

  _writeStdio(message) {
    return new Promise((resolve, reject) => {
      if (this.exitError) return reject(this.exitError);
      if (!this.process || !this.process.stdin.writable) return reject(new Error('MCP server process is not running'));
      try {
        this.process.stdin.write(`${rpc.serialize(message)}\n`, (error) => (error ? reject(error) : resolve()));
      } catch (error) {
        reject(error);
      }
      return undefined;
    });
  }

  _sendStdio(message, timeout, cancelOnTimeout) {
    const key = String(message.id);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(key);
        if (cancelOnTimeout) {
          this._notify('notifications/cancelled', { requestId: message.id, reason: 'timeout' }).catch(() => {});
        }
        reject(new MCPTimeoutError(message.method, timeout));
      }, timeout);
      this.pending.set(key, { resolve, reject, timer });
      this._writeStdio(message).catch((error) => {
        if (this.pending.delete(key)) {
          clearTimeout(timer);
          reject(error);
        }
      });
    });
  }

  _failAll(error) {
    for (const [key, entry] of this.pending) {
      this.pending.delete(key);
      clearTimeout(entry.timer);
      entry.reject(error);
    }
  }

  // Close stdin, wait, then escalate to SIGTERM and SIGKILL.
  async _stopProcess() {
    const child = this.process;
    if (!child) return;
    this.process = null;
    this._failAll(new Error('MCP client closed'));

    const exited = new Promise((resolve) => {
      if (child.exitCode !== null || child.signalCode !== null) resolve(true);
      else child.once('exit', () => resolve(true));
    });
    const wait = (ms) => Promise.race([exited, new Promise((resolve) => {
      const timer = setTimeout(() => resolve(false), ms);
      if (timer.unref) timer.unref();
    })]);

    try {
      child.stdin.end();
    } catch (error) {
      // already closed
    }
    if (await wait(SHUTDOWN_GRACE)) return;
    child.kill('SIGTERM');
    if (await wait(SHUTDOWN_GRACE)) return;
    child.kill('SIGKILL');
    await wait(SHUTDOWN_GRACE);
  }

  _log(text) {
    if (this.debug) process.stderr.write(`[MCPClient] ${text}\n`);
  }
}

MCPClient.MCPTimeoutError = MCPTimeoutError;
MCPClient.JsonRpcError = JsonRpcError;

module.exports = MCPClient;

}).call(this)}).call(this,require('_process'))
},{"../mcp/jsonrpc":14,"../package.json":31,"_process":30,"child_process":24,"cross-fetch":26,"readline":24}],57:[function(require,module,exports){
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
},{}],58:[function(require,module,exports){
class ModelEvaluation {

  constructor() {}
}

module.exports = {
  ModelEvaluation
};
},{}],59:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/

// Trailing tokens that force a gpt-5+ model onto /v1/chat/completions instead of /v1/responses.
const CHAT_ROUTE_OVERRIDE_SUFFIXES = [':chat', '#chat', '|chat'];

// "<family>-<major>[-<minor>]" inside a Claude id, e.g. claude-opus-4-8 -> (opus, 4, 8).
// The trailing (?!\d) keeps date suffixes (-20251001) and legacy "claude-3-7-sonnet-..." ids out.
const CLAUDE_VERSION_RE = /(opus|sonnet|haiku|fable|mythos)-(\d{1,2})(?:-(\d{1,2}))?(?!\d)/;

function hasRouteOverride(model) {
  if (!model) return false;
  const lowered = String(model).toLowerCase().trim();
  return CHAT_ROUTE_OVERRIDE_SUFFIXES.some((suffix) => lowered.endsWith(suffix));
}

/** Remove a trailing :chat / #chat / |chat token so the API receives a clean model id. */
function stripRouteOverride(model) {
  if (!hasRouteOverride(model)) return model;
  const trimmed = String(model).trim();
  const suffix = CHAT_ROUTE_OVERRIDE_SUFFIXES.find((s) => trimmed.toLowerCase().endsWith(s));
  return trimmed.slice(0, -suffix.length);
}

// Matches "gpt-<major>" anywhere in the name, as earlier releases routed any name containing
// "gpt-5" (e.g. Azure deployments like "prod-gpt-5") to the Responses API.
function gptMajorVersion(model) {
  const match = /gpt-(\d+)/.exec(String(model || '').toLowerCase().trim());
  return match ? parseInt(match[1], 10) : null;
}

/**
 * True for OpenAI gpt-5 and newer models, which use the /v1/responses endpoint.
 * A ":chat" suffix keeps a gpt-5+ model or deployment on chat completions.
 */
function isReasoningModel(model) {
  if (!model || hasRouteOverride(model)) return false;
  const major = gptMajorVersion(model);
  return major !== null && major >= 5;
}

/** True for chat-completions models that need max_completion_tokens and reject custom temperature (o-series, gpt-5+). */
function isReasoningChatModel(model) {
  const cleaned = String(stripRouteOverride(model) || '').toLowerCase().trim();
  if (/^o\d+(?:-|$)/.test(cleaned)) return true;
  const major = gptMajorVersion(cleaned);
  return major !== null && major >= 5;
}

/** The *-pro reasoning models only accept medium/high/xhigh effort. */
function defaultReasoningEffort(model) {
  return String(model || '').toLowerCase().includes('-pro') ? 'medium' : 'low';
}

/**
 * True for Claude models that reject temperature/top_p/top_k (Opus 4.7+ and the Claude 5 family).
 * Sonnet 4.x, Opus <= 4.6 and Haiku 4.5 still accept them.
 */
function claudeRejectsSamplingParams(model) {
  if (!model) return false;
  const lowered = String(model).toLowerCase();
  if (lowered.includes('mythos-preview')) return true;

  const match = CLAUDE_VERSION_RE.exec(lowered);
  if (!match) return false;
  const family = match[1];
  const major = parseInt(match[2], 10);
  const minor = match[3] !== undefined ? parseInt(match[3], 10) : null;
  if (major >= 5) return true;
  return family === 'opus' && major === 4 && minor !== null && minor >= 7;
}

// Tools can be written in chat-completions format ({type:'function', function:{...}}) or the flat
// Responses format ({type:'function', name, parameters}); these helpers convert to what each API expects.
// Accepts chat-completions tools ({ type, function }), Responses tools ({ type, name, parameters }) and plain
// definitions ({ name, description, parameters | input_schema }); returns the chat-completions shape.
function toChatTools(tools) {
  if (!Array.isArray(tools)) return tools;
  return tools.map((tool) => {
    if (!tool || typeof tool !== 'object' || tool.function) return tool;
    const plain = !tool.type && tool.name && (tool.parameters || tool.input_schema || tool.description);
    if ((tool.type === 'function' || plain) && tool.name) {
      const { name, description, strict } = tool;
      const parameters = tool.parameters !== undefined ? tool.parameters : tool.input_schema;
      return {
        type: 'function',
        function: {
          name,
          ...(description !== undefined && { description }),
          ...(parameters !== undefined && { parameters }),
          ...(strict !== undefined && { strict }),
        },
      };
    }
    return tool;
  });
}

function toResponsesTools(tools) {
  if (!Array.isArray(tools)) return tools;
  return toChatTools(tools).map((tool) => (tool && tool.type === 'function' && tool.function ? { type: 'function', ...tool.function } : tool));
}

// Function tools (chat-completions, Responses or plain { name, description, parameters }) become Anthropic tools,
// keeping extra fields such as strict or cache_control; Anthropic-native tools pass through unchanged.
function toAnthropicTools(tools) {
  if (!Array.isArray(tools)) return tools;
  return tools.map((tool) => {
    if (!tool || typeof tool !== 'object' || tool.input_schema || (tool.type && tool.type !== 'function')) return tool;
    if (tool.type !== 'function' && !tool.function && tool.parameters === undefined) return tool;
    const source = tool.function ? { ...tool.function } : { ...tool };
    const { type, handler, name, description, parameters, ...extra } = source;
    return {
      name,
      ...(description !== undefined && { description }),
      input_schema: parameters || { type: 'object', properties: {} },
      ...extra,
    };
  });
}

function toChatToolChoice(choice) {
  if (choice && typeof choice === 'object' && choice.type === 'function' && !choice.function && choice.name) {
    return { type: 'function', function: { name: choice.name } };
  }
  return choice;
}

function toResponsesToolChoice(choice) {
  if (choice && typeof choice === 'object' && choice.type === 'function' && choice.function) {
    return { type: 'function', name: choice.function.name };
  }
  return choice;
}

function toAnthropicToolChoice(choice) {
  if (typeof choice === 'string') {
    const mapped = { auto: { type: 'auto' }, any: { type: 'any' }, required: { type: 'any' }, none: { type: 'none' } };
    return mapped[choice] || choice;
  }
  if (choice && typeof choice === 'object' && choice.type === 'function') {
    return { type: 'tool', name: choice.function ? choice.function.name : choice.name };
  }
  return choice;
}

/** Convert legacy chat-completions `functions` / `function_call` into tools / tool_choice. */
function functionsToTools(functions) {
  if (!Array.isArray(functions)) return functions;
  return functions.map((fn) => ({ type: 'function', function: fn }));
}

function functionCallToToolChoice(functionCall) {
  if (functionCall && typeof functionCall === 'object' && functionCall.name) {
    return { type: 'function', function: { name: functionCall.name } };
  }
  return functionCall;
}

module.exports = {
  stripRouteOverride,
  isReasoningModel,
  isReasoningChatModel,
  defaultReasoningEffort,
  claudeRejectsSamplingParams,
  toChatTools,
  toResponsesTools,
  toAnthropicTools,
  toChatToolChoice,
  toResponsesToolChoice,
  toAnthropicToolChoice,
  functionsToTools,
  functionCallToToolChoice,
};

},{}],60:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/

/**
 * Remove inline reasoning that some models (DeepSeek on NVIDIA, vLLM) put before the answer.
 * Only a leading <think>...</think> block, or a closing tag when the chat template opened the block itself,
 * is removed; tags mentioned later in the answer are kept. A reasoning block that never closes (the output
 * budget ran out while thinking) leaves no answer, so an empty string is returned.
 * Use it only for providers that return reasoning inline.
 */
function stripThinking(text) {
  const trimmed = String(text || '').trim();
  if (trimmed.startsWith('<think>')) {
    const close = trimmed.indexOf('</think>');
    return close === -1 ? '' : trimmed.slice(close + '</think>'.length).trim();
  }
  const close = trimmed.indexOf('</think>');
  if (close !== -1 && !trimmed.slice(0, close).includes('<think>')) {
    return trimmed.slice(close + '</think>'.length).trim();
  }
  return trimmed;
}

// A fence line: at most three spaces of indentation, three or more backticks or tildes, then an optional info string.
function parseFence(line) {
  const match = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
  if (!match) return null;
  const info = match[2].trim();
  if (match[1][0] === '`' && info.includes('`')) return null;
  return {
    char: match[1][0],
    length: match[1].length,
    info,
    lang: (info.split(/\s+/)[0] || '').toLowerCase(),
  };
}

function closesFence(fence, opener) {
  return Boolean(fence) && !fence.info && fence.char === opener.char && fence.length >= opener.length;
}

// Split text into fenced blocks. A fence with an info string never closes a block, and a closing fence
// must use the same character and at least as many of them as the opening fence (CommonMark rules).
function scanBlocks(text) {
  const blocks = [];
  let current = null;
  for (const line of String(text || '').replace(/\r\n/g, '\n').split('\n')) {
    const fence = parseFence(line);
    if (!current) {
      if (fence) current = { opener: fence, lines: [], closed: false };
      continue;
    }
    if (closesFence(fence, current.opener)) {
      current.closed = true;
      blocks.push(current);
      current = null;
    } else {
      current.lines.push(line);
    }
  }
  if (current) blocks.push(current);
  return blocks.map((block) => ({
    lang: block.opener.lang,
    code: block.lines.join('\n').replace(/^(?:[ \t]*\n)+/, '').replace(/\s+$/, ''),
    closed: block.closed,
  }));
}

// A block whose content starts with another fence is a wrapper (e.g. ```markdown around ```javascript): use the inner blocks.
function expandWrappers(blocks) {
  const result = [];
  for (const block of blocks) {
    const firstLine = block.code.split('\n').find((line) => line.trim());
    if (firstLine && parseFence(firstLine)) {
      const inner = scanBlocks(block.code).map((innerBlock) => ({ ...innerBlock, closed: innerBlock.closed || block.closed }));
      result.push(...expandWrappers(inner));
    } else {
      result.push(block);
    }
  }
  return result;
}

/**
 * All markdown code blocks in the text as [{ lang, code }].
 * A block cut off at the end of the text (truncated output) is kept when no block was closed, or when it is
 * language-tagged and longer than every closed block (the main code after a short setup snippet).
 */
function extractBlocks(text) {
  const blocks = expandWrappers(scanBlocks(text)).filter((block) => block.code.trim());
  const closed = blocks.filter((block) => block.closed);
  const longestClosed = closed.reduce((max, block) => Math.max(max, block.code.length), 0);
  return blocks
    .filter((block) => block.closed || closed.length === 0 || (block.lang && block.code.length > longestClosed))
    .map(({ lang, code }) => ({ lang, code }));
}

/**
 * Return the code from the block tagged `language`, otherwise the longest block
 * (models sometimes add a short block, e.g. a usage example, next to the real one).
 * Text without fences is returned trimmed.
 */
function extractCode(text, language = null) {
  const blocks = extractBlocks(text);
  if (language) {
    const wanted = blocks.find((block) => block.lang === String(language).toLowerCase());
    if (wanted) return wanted.code;
  }
  if (blocks.length > 0) {
    return blocks.reduce((best, block) => (block.code.length > best.code.length ? block : best)).code;
  }
  return String(text || '').trim();
}

const WRAPPER_LANGS = new Set(['', 'markdown', 'md', 'mdx']);

function isShortRemark(lines) {
  const remarks = lines.filter((line) => line.trim());
  return remarks.length === 0 || (remarks.length === 1 && remarks[0].length <= 200 && !/^\s*#/.test(remarks[0]));
}

// The inner fences of a real wrapper pair up: every opening fence has its closing fence.
function hasBalancedFences(lines) {
  let open = null;
  for (const line of lines) {
    const fence = parseFence(line);
    if (!fence) continue;
    if (!open) open = fence;
    else if (closesFence(fence, open)) open = null;
  }
  return open === null;
}

/**
 * Markdown answers are sometimes wrapped in a ```markdown (or ````markdown) fence, even with code blocks inside;
 * unwrap it. The wrapper may only follow a short lead-in ("Here is the README:"), must close on the last fence
 * line with at most one short sign-off after it, and must contain balanced inner fences. Anything else, such as
 * a ```markdown example inside an explanation, is returned unchanged.
 */
function extractMarkdown(text) {
  const cleaned = String(text || '').trim();
  const lines = cleaned.split('\n');
  const openIndex = lines.findIndex((line) => parseFence(line));
  if (openIndex === -1) return cleaned;
  const opener = parseFence(lines[openIndex]);
  if (!WRAPPER_LANGS.has(opener.lang) || !isShortRemark(lines.slice(0, openIndex))) return cleaned;

  let closeIndex = -1;
  for (let i = lines.length - 1; i > openIndex; i--) {
    if (closesFence(parseFence(lines[i]), opener)) {
      closeIndex = i;
      break;
    }
  }
  if (closeIndex === -1) {
    // an unterminated ```markdown wrapper at the start is a truncated document
    const truncated = openIndex === 0 && opener.lang && hasBalancedFences(lines.slice(1));
    return truncated ? lines.slice(1).join('\n').trim() : cleaned;
  }
  const body = lines.slice(openIndex + 1, closeIndex);
  if (!isShortRemark(lines.slice(closeIndex + 1)) || !hasBalancedFences(body)) return cleaned;
  return body.join('\n').trim();
}

function dropTrailingComma(out) {
  let i = out.length - 1;
  while (i >= 0 && /\s/.test(out[i])) i--;
  return out[i] === ',' ? out.slice(0, i) + out.slice(i + 1) : out;
}

/**
 * Fix the JSON mistakes models make most: raw newlines/tabs inside strings, trailing commas, and single
 * backslashes from regexes or file paths (\d, \b, \u without four hex digits), which are kept as literal
 * backslashes. Structure outside strings is only touched to drop trailing commas.
 */
function repairJson(text) {
  let out = '';
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === '\\') {
        const next = text[i + 1];
        if (next === undefined) {
          out += '\\\\';
          continue;
        }
        const unicode = next === 'u' && /^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6));
        out += '"\\/nrt'.includes(next) || unicode ? ch + next : `\\\\${next}`;
        i++;
      } else if (ch === '"') {
        inString = false;
        out += ch;
      } else if (ch === '\n') {
        out += '\\n';
      } else if (ch === '\r') {
        out += '\\r';
      } else if (ch === '\t') {
        out += '\\t';
      } else {
        out += ch;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === '}' || ch === ']') {
      out = dropTrailingComma(out);
    }
    out += ch;
  }
  return out;
}

function matchesKind(value, kind) {
  if (kind === 'array') return Array.isArray(value);
  if (kind === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  return true;
}

function tryParse(candidate, kind) {
  for (const attempt of [candidate, repairJson(candidate)]) {
    try {
      const value = JSON.parse(attempt);
      return matchesKind(value, kind) ? { value } : null;
    } catch (error) {
      // try the repaired text next
    }
  }
  return null;
}

// Find the first balanced JSON object or array (respecting strings and escapes) that parses and has the wanted kind.
// A balanced candidate that is rejected is skipped as a whole, so a nested value is never returned in its place;
// an opening bracket that never closes (stray prose) is skipped by itself.
function findBalancedJson(text, kind) {
  let start = 0;
  while (start < text.length) {
    const open = text[start];
    if (open !== '{' && open !== '[') {
      start++;
      continue;
    }
    // a balanced value of the other kind is still skipped as a whole, so nothing nested inside it is returned
    const wanted = (open === '{' && kind !== 'array') || (open === '[' && kind !== 'object');
    const close = open === '{' ? '}' : ']';
    let depth = 0;
    let inString = false;
    let escaped = false;
    let end = -1;
    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') inString = true;
      else if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    if (end === -1) {
      start++;
      continue;
    }
    const parsed = wanted ? tryParse(text.slice(start, end + 1), kind) : null;
    if (parsed) return parsed.value;
    start = end + 1;
  }
  return undefined;
}

/**
 * Parse JSON from model output that may include prose, markdown fences or small syntax slips.
 * @param {string} text - the model output.
 * @param {string|null} kind - 'object' or 'array' to only accept that kind of value.
 */
function parseJson(text, kind = null) {
  const cleaned = String(text || '').trim();
  const jsonBlocks = extractBlocks(cleaned).filter((block) => block.lang === 'json').map((block) => block.code);
  for (const candidate of [cleaned, ...jsonBlocks, extractCode(cleaned)]) {
    const parsed = tryParse(candidate, kind);
    if (parsed) return parsed.value;
  }
  const found = findBalancedJson(cleaned, kind);
  if (found !== undefined) return found;
  const expected = kind ? `a JSON ${kind}` : 'valid JSON';
  throw new Error(`The model response is not ${expected}: ${cleaned.slice(0, 200)}`);
}

// Every <svg>...</svg> element in the source, as { openTag, svg }.
function svgElements(source) {
  const elements = [];
  const lower = source.toLowerCase();
  const opener = /<svg\b[^>]*>/gi;
  let match;
  while ((match = opener.exec(source)) !== null) {
    const end = lower.indexOf('</svg>', opener.lastIndex);
    if (end === -1) break;
    elements.push({ openTag: match[0], svg: source.slice(match.index, end + '</svg>'.length) });
  }
  return elements;
}

/**
 * Return an SVG element from model output. Blocks tagged svg, xml or html (or untagged) are searched first,
 * then the other blocks and the raw text. A real SVG (viewBox or xmlns, no JSX expressions) is preferred.
 */
function extractSvg(text) {
  const source = String(text || '');
  const blocks = extractBlocks(source);
  const markupLangs = ['svg', 'xml', 'html', ''];
  const candidates = [
    ...blocks.filter((block) => markupLangs.includes(block.lang)).map((block) => block.code),
    ...blocks.filter((block) => !markupLangs.includes(block.lang)).map((block) => block.code),
    source,
  ];
  let plain = null;
  let jsx = null;
  for (const candidate of candidates) {
    for (const element of svgElements(candidate)) {
      if (element.openTag.includes('{')) {
        jsx = jsx || element.svg;
      } else if (/\b(viewBox|xmlns)\s*=/i.test(element.openTag)) {
        return element.svg;
      } else {
        plain = plain || element.svg;
      }
    }
  }
  if (plain || jsx) return plain || jsx;
  throw new Error(`The model response does not contain an <svg> element: ${source.trim().slice(0, 200)}`);
}

module.exports = { stripThinking, extractBlocks, extractCode, extractMarkdown, repairJson, parseJson, extractSvg };

},{}],61:[function(require,module,exports){
const FileHelper = require('./FileHelper')
const { Chatbot, SupportedChatModels } = require("../function/Chatbot");
const { ChatGPTInput, ChatGPTMessage } = require("../model/input/ChatModelInput");
const SystemHelper = require("../utils/SystemHelper");
const config = require('../config.json');
const { isReasoningModel } = require('./ModelHelper');

class Prompt {
  constructor(template) {
    this.template = template;
  }

  getInput() {
    return this.template;
  }

  format(data) {
    // single pass with a replacer function: inserted values (user code, diffs) are never
    // re-scanned for placeholders and replacement patterns such as "$1" inside them are kept as-is
    return this.template.replace(/\$\{([^}]+)\}/g, (match, key) => (
      Object.prototype.hasOwnProperty.call(data, key) ? String(data[key]) : ''
    ));
  }

  static fromText(template) {
    return new Prompt(template);
  }

  static fromFile(filePath) {
    const template = FileHelper.readData(filePath, 'utf-8');
    return new Prompt(template);
  }

  static async fromChatGPT(promptTopic, apiKey, customProxyHelper=null, model=config.url.openai.models.chat) {

    const chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);

    const promptExample = new SystemHelper().loadPrompt("prompt_example");

    // reasoning models (gpt-5+) spend output tokens on thinking, so only cap older models
    const options = isReasoningModel(model) ? { model: model } : { maxTokens: 800, model: model, temperature: 0.7 };
    const input = new ChatGPTInput("generate a prompt text, following prompt engineering best practices", options);
    input.addUserMessage(promptExample);
    input.addUserMessage(`Create a prompt: ${promptTopic}`);

    const responses = await chatbot.chat(input);

    return new Prompt(responses[0].trim());
  }
}

module.exports = Prompt;

},{"../config.json":1,"../function/Chatbot":8,"../model/input/ChatModelInput":15,"../utils/SystemHelper":64,"./FileHelper":54,"./ModelHelper":59}],62:[function(require,module,exports){
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

  getOpenaiResponses(model = '') {
    if (this._openai_type == 'azure') {
      return this._openaiResponses
        .replace('{deployment-id}', model)
        .replace('{api-version}', ProxyHelper.API_VERSION);
    } else {
      return this._openaiResponses;
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
    this._openaiResponses =
      proxySettings.responses || config.url.openai.responses;
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
    this._openaiResponses = config.url.azure_openai.responses;
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
    this._openaiResponses = config.url.openai.responses;
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

},{"../config.json":1}],63:[function(require,module,exports){
(function (Buffer){(function (){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/

/**
 * Iterate a fetch response body as decoded text.
 * Handles Node streams (Buffer chunks) and browser ReadableStreams (Uint8Array chunks),
 * including browsers without async iteration on ReadableStream (Safari).
 */
async function* readStreamChunks(stream) {
    const decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8') : null;
    const decode = (chunk) => {
        if (typeof chunk === 'string') return chunk;
        if (decoder) return decoder.decode(chunk, { stream: true });
        return Buffer.from(chunk).toString('utf8');
    };

    if (stream && typeof stream.getReader === 'function') {
        const reader = stream.getReader();
        let finished = false;
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    finished = true;
                    break;
                }
                yield decode(value);
            }
        } finally {
            if (!finished) {
                try { await reader.cancel(); } catch (error) { /* stream already closed */ }
            }
            reader.releaseLock();
        }
    } else {
        for await (const chunk of stream) {
            yield decode(chunk);
        }
    }

    if (decoder) {
        const tail = decoder.decode();
        if (tail) yield tail;
    }
}

// Split complete server-sent events from the buffer; returns [events, remainingBuffer].
function splitEvents(buffer) {
    const parts = buffer.replace(/\r\n/g, '\n').split('\n\n');
    const rest = parts.pop();
    return [parts, rest];
}

// Joined `data:` payload of one server-sent event, or null when the event has no data.
function eventData(rawEvent) {
    const lines = rawEvent.split('\n').filter((line) => line.startsWith('data:'));
    if (lines.length === 0) return null;
    return lines.map((line) => line.slice(5).replace(/^ /, '')).join('\n');
}

/** Parses OpenAI-compatible streams: chat completions and the Responses API (gpt-5+). */
class GPTStreamParser {
    constructor(isLog = false) {
        this.buffer = '';
        this.isLog = isLog;
        this.done = false;
    }

    async * feed(data) {
        if (this.done) return;
        this.buffer += data;
        const [events, rest] = splitEvents(this.buffer);
        this.buffer = rest;

        for (const rawEvent of events) {
            const payload = eventData(rawEvent.trim());
            if (payload === null) continue;

            // look for the stop signal
            if (payload.trim() === '[DONE]') {
                this.done = true;
                if (this.isLog) {
                    console.log("Parsing finished.");
                }
                return;
            }

            let jsonData;
            try {
                jsonData = JSON.parse(payload);
            } catch (error) {
                console.error("Error parsing JSON in stream:", error);
                continue;
            }

            // chat completions format
            const contentText = jsonData.choices?.[0]?.delta?.content;
            if (contentText) {
                yield contentText;
                continue;
            }

            // Responses API format
            if ((jsonData.type === 'response.output_text.delta' || jsonData.type === 'response.refusal.delta') && jsonData.delta) {
                yield jsonData.delta;
            } else if (jsonData.type === 'error') {
                throw new Error(`OpenAI stream error: ${jsonData.message || JSON.stringify(jsonData)}`);
            } else if (jsonData.type === 'response.failed') {
                throw new Error(`OpenAI response failed: ${jsonData.response?.error?.message || 'unknown error'}`);
            }
        }
    }
}

/** Parses Anthropic Messages API streams, yielding answer text and skipping thinking deltas. */
class AnthropicStreamParser {
    constructor(isLog = false) {
        this.buffer = '';
        this.isLog = isLog;
    }

    async * feed(data) {
        this.buffer += data;
        const [events, rest] = splitEvents(this.buffer);
        this.buffer = rest;

        for (const rawEvent of events) {
            const payload = eventData(rawEvent.trim());
            if (payload === null) continue;

            let jsonData;
            try {
                jsonData = JSON.parse(payload);
            } catch (error) {
                console.error("Error parsing JSON in stream:", error);
                continue;
            }

            if (jsonData.type === 'content_block_delta' && jsonData.delta?.type === 'text_delta' && jsonData.delta.text) {
                yield jsonData.delta.text;
            } else if (jsonData.type === 'error') {
                throw new Error(`Anthropic stream error: ${jsonData.error?.message || JSON.stringify(jsonData)}`);
            } else if (jsonData.type === 'message_stop' && this.isLog) {
                console.log("Parsing finished.");
            }
        }
    }
}

/** Parses Cohere chat streams (newline-delimited JSON). */
class CohereStreamParser {
    constructor(isLog = false) {
        this.buffer = '';
        this.isLog = isLog;
    }

    async * feed(data) {
        this.buffer += data;

        // a single chunk can carry several events, so drain every complete line
        let eventEndIndex;
        while ((eventEndIndex = this.buffer.indexOf('\n')) !== -1) {
            const rawData = this.buffer.slice(0, eventEndIndex).trim();
            this.buffer = this.buffer.slice(eventEndIndex + 1);
            if (!rawData) continue;

            let jsonData;
            try {
                jsonData = JSON.parse(rawData);
            } catch (error) {
                console.error("Error parsing JSON in stream:", error);
                continue;
            }

            // stream-end repeats the full text inside `response`; only text-generation carries new text
            if (jsonData.event_type && jsonData.event_type !== 'text-generation') continue;
            if (jsonData.text) {
                yield jsonData.text;
            }
        }
    }
}

class VLLMStreamParser {
  constructor(isLog = false) {
    this.buffer = '';
    this.isLog = isLog;
  }

  async *feed(data) {
    this.buffer += data;

    // Check if the buffer contains events
    while (this.buffer.includes('\n\n')) {
      const eventEndIndex = this.buffer.indexOf('\n\n');
      let rawData = this.buffer.slice(0, eventEndIndex).trim();

      // Remove the processed event
      this.buffer = this.buffer.slice(eventEndIndex + 2);

      // Look for the stop signal
      if (rawData === "data: [DONE]") {
        if (this.isLog) {
          console.log("Parsing finished.");
        }
        return;
      }

      // Skip lines without "data: "
      if (!rawData.startsWith("data: ")) {
        continue;
      }

      try {
        // Parse the JSON
        const jsonData = JSON.parse(rawData.substring(6));

        // Handle both completion and chat completion formats
        let contentText = null;

        if (jsonData.choices?.[0]?.text) {
          // Text completion format
          contentText = jsonData.choices[0].text;
        } else if (jsonData.choices?.[0]?.delta?.content) {
          // Chat completion format
          contentText = jsonData.choices[0].delta.content;
        }

        if (contentText) {
          yield contentText;
        }
      } catch (error) {
        console.error("Error parsing JSON in stream:", error);
      }
    }
  }
}


module.exports = {
    GPTStreamParser,
    CohereStreamParser,
    VLLMStreamParser,
    AnthropicStreamParser,
    readStreamChunks
};

}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":25}],64:[function(require,module,exports){
(function (__dirname){(function (){
const FileHelper = require('./FileHelper')
const path = require("path");

// Template files that do not follow the "<name>_prompt.in" naming.
const TEMPLATE_FILES = {
  instruct_update: "instruct_update.in",
  prompt_example: "prompt_example.in",
  augmented_chatbot: "augmented_chatbot.in",
};

class SystemHelper {
  constructor() {
    this.systemsPath = path.join(__dirname, "..", "resource", "templates");
  }

  static getTemplateFileName(fileType) {
    return TEMPLATE_FILES[fileType] || `${fileType}_prompt.in`;
  }

  getPromptPath(fileType) {
    return path.join(this.systemsPath, SystemHelper.getTemplateFileName(fileType));
  }

  loadPrompt(fileType) {
    const fileName = SystemHelper.getTemplateFileName(fileType);
    // the browser bundle has no file system, so fall back to the templates embedded at build time
    const embedded = require('../resource/templates/templates');
    try {
      return FileHelper.readData(this.getPromptPath(fileType), 'utf-8');
    } catch (error) {
      if (embedded[fileName] !== undefined) {
        return embedded[fileName];
      }
      throw new Error(`File type '${fileType}' not supported`);
    }
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
},{"../resource/templates/templates":32,"./FileHelper":54,"path":29}],65:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/

// Separators tried in order: paragraphs, lines, sentences, words.
const SEPARATORS = ['\n\n', '\n', '. ', '? ', '! ', '; ', ', ', ' '];

/**
 * Split long text into overlapping chunks for embeddings and RAG. Chunks break at paragraphs, then lines, then
 * sentences, then words, so a chunk rarely cuts a sentence in half. Sizes are in characters.
 *
 *   TextSplitter.split(text, { chunkSize: 1200, chunkOverlap: 150 })
 *   TextSplitter.toDocuments(text, { source: 'handbook.md' })  // [{ id, text, metadata: { source, chunk } }]
 */
class TextSplitter {
  static split(text, { chunkSize = 1200, chunkOverlap = 150 } = {}) {
    const clean = String(text || '').replace(/\r\n/g, '\n').trim();
    if (!clean) return [];
    if (chunkOverlap >= chunkSize) throw new Error('chunkOverlap must be smaller than chunkSize.');
    const pieces = TextSplitter._pieces(clean, chunkSize, 0);
    const chunks = [];
    let current = '';
    for (const piece of pieces) {
      if (current && current.length + piece.length > chunkSize) {
        chunks.push(current.trim());
        // start the next chunk with the tail of the previous one
        const tail = current.slice(Math.max(0, current.length - chunkOverlap));
        const boundary = tail.search(/\s/);
        current = chunkOverlap > 0 && boundary >= 0 ? tail.slice(boundary + 1) : '';
      }
      current += piece;
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }

  // Pieces no longer than size, each keeping its trailing separator.
  static _pieces(text, size, level) {
    if (text.length <= size) return [text];
    if (level >= SEPARATORS.length) {
      const parts = [];
      for (let start = 0; start < text.length; start += size) parts.push(text.slice(start, start + size));
      return parts;
    }
    const separator = SEPARATORS[level];
    const split = text.split(separator);
    if (split.length === 1) return TextSplitter._pieces(text, size, level + 1);
    const pieces = [];
    split.forEach((part, index) => {
      const piece = index < split.length - 1 ? part + separator : part;
      if (!piece) return;
      if (piece.length > size) pieces.push(...TextSplitter._pieces(piece, size, level + 1));
      else pieces.push(piece);
    });
    return pieces;
  }

  /** Chunks as vector store documents: [{ id, text, metadata: { ...metadata, chunk } }]. */
  static toDocuments(text, metadata = {}, options = {}) {
    const prefix = options.idPrefix || (metadata.source ? String(metadata.source) : null);
    return TextSplitter.split(text, options).map((chunk, index) => ({
      ...(prefix && { id: `${prefix}#${index}` }),
      text: chunk,
      metadata: { ...metadata, chunk: index },
    }));
  }
}

module.exports = TextSplitter;

},{}],66:[function(require,module,exports){
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

},{"../utils/FetchClient":53}],67:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

// Anthropic rejects browser (CORS) requests unless this opt-in header is present.
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

class AnthropicWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.anthropic.base;
    this.API_VERSION = config.url.anthropic.version;

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': this.API_VERSION,
    };
    if (isBrowser) {
      headers['anthropic-dangerous-direct-browser-access'] = 'true';
    }

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers,
    });
  }

  /**
   * Call the Messages API.
   * @param {object} params - Messages API request body.
   * @param {object} [extraHeaders] - Optional per-request headers, e.g. { 'anthropic-beta': '<feature>' }.
   */
  async generateText(params, extraHeaders = null) {
    const endpoint = config.url.anthropic.messages;

    try {
      return await this.client.post(endpoint, params, extraHeaders ? { headers: extraHeaders } : {});
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  /** Stream the Messages API; returns the raw server-sent events body. */
  async streamText(params, extraHeaders = null) {
    const endpoint = config.url.anthropic.messages;

    try {
      return await this.client.post(endpoint, { ...params, stream: true }, {
        responseType: 'stream',
        headers: { Accept: 'text/event-stream', ...(extraHeaders || {}) },
      });
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }
}

module.exports = AnthropicWrapper;

},{"../config.json":1,"../utils/ConnHelper":52,"../utils/FetchClient":53}],68:[function(require,module,exports){
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
      throw connHelper.wrapError(error);
    }
  }

  async generateChatText(params) {
    const endpoint = config.url.cohere.chat;
    try {
      // If stream is true, set responseType='stream'
      const extraConfig = params.stream ? { responseType: 'stream' } : {};
      return await this.client.post(endpoint, params, extraConfig);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  async getEmbeddings(params) {
    const endpoint = config.url.cohere.embed;
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }
}

module.exports = CohereAIWrapper;


},{"../config.json":1,"../utils/ConnHelper":52,"../utils/FetchClient":53}],69:[function(require,module,exports){
(function (process,Buffer){(function (){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');
const { readStreamChunks } = require('../utils/StreamParser');

const IS_NODE = typeof process !== 'undefined' && Boolean(process.versions && process.versions.node);

// snake_case keys that are renamed to camelCase in request bodies (Google accepts both; one form keeps the
// body predictable for the checks below).
const KEY_MAP = {
  system_instruction: 'systemInstruction',
  generation_config: 'generationConfig',
  safety_settings: 'safetySettings',
  tool_config: 'toolConfig',
  cached_content: 'cachedContent',
  response_modalities: 'responseModalities',
  speech_config: 'speechConfig',
  voice_config: 'voiceConfig',
  multi_speaker_voice_config: 'multiSpeakerVoiceConfig',
  speaker_voice_configs: 'speakerVoiceConfigs',
  prebuilt_voice_config: 'prebuiltVoiceConfig',
  voice_name: 'voiceName',
  response_mime_type: 'responseMimeType',
  response_schema: 'responseSchema',
  inline_data: 'inlineData',
  file_data: 'fileData',
  mime_type: 'mimeType',
  file_uri: 'fileUri',
};

// Values under these keys belong to the caller (function arguments and schemas), so they are never renamed.
const USER_DATA_KEYS = new Set(['args', 'response', 'parameters', 'parametersJsonSchema', 'responseSchema',
  'response_schema', 'responseJsonSchema']);

const MIME_TYPES = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', heic: 'image/heic', heif: 'image/heif',
  gif: 'image/gif', mp4: 'video/mp4', mov: 'video/quicktime', avi: 'video/x-msvideo', webm: 'video/webm',
  mpeg: 'video/mpeg', mp3: 'audio/mpeg', wav: 'audio/wav', flac: 'audio/flac', ogg: 'audio/ogg', m4a: 'audio/mp4',
  aac: 'audio/aac', pdf: 'application/pdf', txt: 'text/plain', md: 'text/markdown', html: 'text/html',
  csv: 'text/csv', json: 'application/json',
};

// Hosts that may receive the wrapper credentials (downloadMedia).
const GOOGLE_API_HOST = /(^|\.)(generativelanguage|([a-z0-9-]+-)?aiplatform)\.googleapis\.com$|^aiplatform\.[a-z0-9-]+\.rep\.googleapis\.com$/;

/**
 * Error from the Gemini / Vertex AI methods. It keeps `status` and `body` like the errors of the other wrappers,
 * adds `details` (the parsed error body), and never contains the API key or access token.
 */
class GoogleAIError extends Error {
  constructor(message, status = null, details = null) {
    super(message);
    this.name = 'GoogleAIError';
    this.status = status;
    this.statusCode = status;
    this.details = details;
  }
}

function camelize(value) {
  if (Array.isArray(value)) return value.map(camelize);
  if (!value || typeof value !== 'object' || isBinary(value)) return value;
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    result[KEY_MAP[key] || key] = USER_DATA_KEYS.has(key) ? item : camelize(item);
  }
  return result;
}

function isBinary(value) {
  return (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) || value instanceof Uint8Array || value instanceof ArrayBuffer;
}

function toBuffer(value) {
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) return value;
  if (value instanceof ArrayBuffer) return Buffer.from(new Uint8Array(value));
  return Buffer.from(value);
}

function extensionOf(source) {
  const clean = String(source).split('?')[0].split('#')[0];
  const match = /\.([a-z0-9]+)$/i.exec(clean);
  return match ? match[1].toLowerCase() : '';
}

function knownMimeType(source) {
  return MIME_TYPES[extensionOf(source)] || null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gemini models on the Gemini Developer API (AI Studio key) or on Vertex AI / the Gemini Enterprise Agent Platform.
 *
 *   new GeminiAIWrapper(GEMINI_API_KEY)                                        // Gemini Developer API
 *   new GeminiAIWrapper(VERTEX_API_KEY, { vertex: true })                      // Vertex express mode (API key)
 *   new GeminiAIWrapper(VERTEX_API_KEY, { vertex: true, projectId })           // project scoped (Veo, Live, Lyria)
 *   new GeminiAIWrapper(null, { projectId, location: 'global' })               // Application Default Credentials
 *   new GeminiAIWrapper(null, { projectId, accessToken: () => getToken() })   // your own OAuth token
 *
 * Covers text, chat sessions, streaming, structured output, function calling, Google Search / URL context /
 * code execution / RAG grounding, image, audio, video and PDF understanding, Gemini image generation and editing,
 * Veo video, Lyria music, Gemini TTS, embeddings, token counting, the Files API, context caching, model listing,
 * Agent Engine and the Live API. GoogleAIWrapper extends this class with the Google Cloud APIs.
 */
class GeminiAIWrapper {
  /**
   * @param {string|null} apiKey - AI Studio key (Developer API) or Agent Platform key (Vertex).
   * @param {object} options - { vertex, projectId, location, accessToken, credentials, apiVersion, baseUrl,
   *   quotaProjectId, timeout, retries, retryDelay, WebSocket }.
   */
  constructor(apiKey = null, options = {}) {
    this.API_BASE_URL = config.url.gemini.base;
    this.API_KEY = typeof apiKey === 'string' ? apiKey.trim() || null : apiKey || null;

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        ...(this.API_KEY && { 'x-goog-api-key': this.API_KEY }),
      },
      timeout: options.timeout,
      retries: options.retries,
      retryDelay: options.retryDelay,
    });
    // the client for Gemini calls; GoogleAIWrapper keeps `client` for the Cloud APIs
    this.genaiClient = this.client;
    this._initGenAI(options || {});
  }

  /**
   * A wrapper from Chatbot / controller options. Vertex AI is used only when the options ask for it (vertex,
   * projectId, credentials or accessToken), never because of an environment variable.
   */
  static fromOptions(apiKey = null, options = {}) {
    const opts = { ...(options || {}) };
    if (opts.projectId === undefined) opts.projectId = opts.project_id || opts.vertexProject || undefined;
    if (opts.location === undefined) opts.location = opts.vertexLocation || undefined;
    if (opts.accessToken === undefined) opts.accessToken = opts.access_token || undefined;
    if (opts.vertex === undefined || opts.vertex === null) {
      opts.vertex = Boolean(opts.projectId || opts.credentials || opts.accessToken);
    }
    return new this(apiKey, opts);
  }

  _initGenAI(options) {
    const env = IS_NODE ? process.env : {};
    const vertexConfig = config.url.gemini.vertex;
    const projectOption = options.projectId || options.project_id || options.vertexProject || null;
    const accessToken = options.accessToken || options.access_token || null;
    let vertex = options.vertex;
    if (vertex === undefined || vertex === null) {
      const envVertex = ['1', 'true', 'yes'].includes(String(env.GOOGLE_GENAI_USE_VERTEXAI || env.GOOGLE_GENAI_USE_ENTERPRISE || '').trim().toLowerCase());
      vertex = Boolean(projectOption || options.credentials || accessToken || envVertex);
    }
    this.vertex = Boolean(vertex);

    let projectId = projectOption;
    if (this.vertex && !projectId && !this.API_KEY) projectId = env.GOOGLE_CLOUD_PROJECT || null;
    this.projectId = projectId || null;

    let location = options.location || options.vertexLocation || null;
    if (!location && this.vertex && env.GOOGLE_CLOUD_LOCATION) location = env.GOOGLE_CLOUD_LOCATION;
    this._locationExplicit = Boolean(location);
    if (!location && this.vertex && this.projectId) location = vertexConfig.default_location;
    this.location = location || null;

    this._accessToken = accessToken;
    this._credentials = options.credentials || null;
    this.quotaProjectId = options.quotaProjectId || null;
    this.baseUrl = options.baseUrl ? String(options.baseUrl).replace(/\/+$/, '') : null;
    this.WebSocket = options.WebSocket || null;
    this._auth = null;

    this._devApiBase = config.url.gemini.base.replace(/\/models\/?$/, '');
    this._devUploadBase = config.url.gemini.upload_base;
    if (this.vertex) {
      this.apiVersion = options.apiVersion || vertexConfig.api_version;
      this.models = { ...config.url.gemini.models, ...vertexConfig.models };
    } else {
      if (options.apiVersion) {
        this._devApiBase = this._devApiBase.replace(/\/v[^/]+$/, `/${options.apiVersion}`);
        this._devUploadBase = this._devUploadBase.replace(/\/v[^/]+\/files$/, `/${options.apiVersion}/files`);
      }
      this.apiVersion = this._devApiBase.split('/').pop();
      // shared with config, so a changed default applies to existing wrappers
      this.models = config.url.gemini.models;
    }
    this._capabilityLocations = { ...vertexConfig.locations };
  }

  /** Apply timeout (ms), retries, retryDelay (ms) or an AbortSignal to every Gemini request. */
  setRequestOptions(options = {}) {
    this.genaiClient.setRequestOptions(options);
    if (this.client !== this.genaiClient) this.client.setRequestOptions(options);
    return this;
  }

  // Accepts both 'gemini-3.6-flash' and 'models/gemini-3.6-flash'.
  static getModelId(model) {
    return String(model).replace(/^models\//, '');
  }

  // ------------------------------------------------------------------
  // Auth, URLs and errors
  // ------------------------------------------------------------------

  // Headers added to a request: none with an API key (the client sends it), a Bearer token otherwise.
  async _authHeaders() {
    if (this.API_KEY) return {};
    return this._bearerHeaders();
  }

  // Explicit credential headers, for requests that do not go through the client (Live API, downloads, uploads).
  async _credentialHeaders() {
    if (this.API_KEY) return { 'x-goog-api-key': this.API_KEY };
    return this._bearerHeaders();
  }

  async _bearerHeaders() {
    if (!this.vertex && !this._accessToken) {
      throw new GoogleAIError('The Gemini Developer API needs an API key. Pass apiKey, or use { vertex: true, projectId } '
        + 'with an access token or Application Default Credentials.');
    }
    if (this._accessToken) {
      const token = typeof this._accessToken === 'function' ? await this._accessToken() : this._accessToken;
      if (!token) throw new GoogleAIError('The accessToken function returned no token.');
      this._lastToken = String(token).trim();
      return { Authorization: `Bearer ${this._lastToken}`, ...(this.quotaProjectId && { 'x-goog-user-project': this.quotaProjectId }) };
    }
    const auth = this._getAuth();
    const headers = await auth.getHeaders();
    this._lastToken = headers.Authorization.slice(7);
    if (this.quotaProjectId) headers['x-goog-user-project'] = this.quotaProjectId;
    return headers;
  }

  _getAuth() {
    if (this._auth) return this._auth;
    const GoogleAuth = require('../utils/GoogleAuth');
    if (typeof GoogleAuth !== 'function') {
      throw new GoogleAIError('Google service account and ADC credentials need Node.js. In the browser pass an apiKey or accessToken.');
    }
    this._auth = new GoogleAuth({ credentials: this._credentials, quotaProjectId: this.quotaProjectId });
    return this._auth;
  }

  // The project for Vertex calls without one: the credentials' project when using OAuth.
  async _ensureProject(feature) {
    if (this.projectId) return this.projectId;
    if (this.vertex && !this.API_KEY && !this._accessToken) {
      this.projectId = await this._getAuth().getProjectId();
      if (this.projectId && !this.location) this.location = config.url.gemini.vertex.default_location;
    }
    if (!this.projectId && feature) {
      throw new GoogleAIError(`${feature} needs a Google Cloud project. Create the wrapper with { vertex: true, projectId }.`);
    }
    return this.projectId;
  }

  _vertexHost(location) {
    const vertexConfig = config.url.gemini.vertex;
    if (!location || location === 'global') return vertexConfig.global_host;
    if (location === 'us' || location === 'eu') return vertexConfig.multi_regional_host.replace('{location}', location);
    return vertexConfig.regional_host.replace('{location}', location);
  }

  _locationFor(capability, location = null) {
    if (location) return location;
    if (capability && !this._locationExplicit && this._capabilityLocations[capability]) return this._capabilityLocations[capability];
    return this.location;
  }

  static _vertexModelPath(model) {
    const name = String(model || '').trim();
    if (!name) throw new Error('A model name is required');
    if (name.startsWith('projects/') || name.startsWith('publishers/')) return name;
    if (name.startsWith('models/')) return `publishers/google/${name}`;
    if (name.includes('/')) {
      const [publisher, ...rest] = name.split('/');
      return `publishers/${publisher}/models/${rest.join('/')}`;
    }
    return `publishers/google/models/${name}`;
  }

  _modelPath(model) {
    if (this.vertex) return GeminiAIWrapper._vertexModelPath(model);
    const name = String(model || '').trim();
    if (!name) throw new Error('A model name is required');
    return name.startsWith('models/') || name.startsWith('tunedModels/') ? name : `models/${name}`;
  }

  /** Full URL of a resource path such as 'publishers/google/models/x:generateContent'. */
  async _resourceUrl(path, location = null) {
    let resource = String(path).replace(/^\/+/, '');
    if (!this.vertex) return `${this.baseUrl || this._devApiBase}/${resource}`;
    const match = /^projects\/[^/]+\/locations\/([^/]+)\//.exec(resource);
    let hostLocation;
    if (match) {
      hostLocation = match[1];
    } else {
      if (!this.API_KEY && !this.projectId) {
        await this._ensureProject();
        if (!this.projectId) {
          throw new GoogleAIError('Vertex AI with OAuth credentials needs a project. Pass projectId (or set GOOGLE_CLOUD_PROJECT); '
            + 'only API keys can use express mode.');
        }
      }
      if (this.projectId) {
        const resourceLocation = location || this.location || 'global';
        resource = `projects/${this.projectId}/locations/${resourceLocation}/${resource}`;
        hostLocation = resourceLocation;
      } else {
        hostLocation = location;
      }
    }
    return `${this.baseUrl || `${this._vertexHost(hostLocation)}/${this.apiVersion}`}/${resource}`;
  }

  async _modelUrl(model, method, location = null) {
    return this._resourceUrl(`${this._modelPath(model)}:${method}`, location);
  }

  _vertexProjectUrl(project, location, path) {
    const root = this.baseUrl && this.vertex ? this.baseUrl : `${this._vertexHost(location)}/${config.url.gemini.vertex.api_version}`;
    return `${root}/projects/${project}/locations/${location}/${path}`;
  }

  // URL of a full Vertex resource name (projects/.../locations/<loc>/...).
  _nameUrl(name) {
    const match = /^projects\/[^/]+\/locations\/([^/]+)\//.exec(name);
    const root = this.baseUrl && this.vertex ? this.baseUrl : `${this._vertexHost(match ? match[1] : null)}/${config.url.gemini.vertex.api_version}`;
    return `${root}/${name}`;
  }

  async _requireProject(feature) {
    if (!this.vertex) {
      throw new GoogleAIError(`${feature} needs Vertex AI. Create the wrapper with { vertex: true, projectId }.`);
    }
    return this._ensureProject(feature);
  }

  _defaultModel(kind) {
    const model = this.models[kind] || config.url.gemini.models[kind];
    if (!model) throw new Error(`No default Gemini model is configured for '${kind}'. Pass the model explicitly.`);
    return model;
  }

  _secrets() {
    const values = [this.API_KEY, typeof this._accessToken === 'string' ? this._accessToken : null, this._lastToken];
    return values.filter((value) => typeof value === 'string' && value.length >= 6).sort((a, b) => b.length - a.length);
  }

  _redact(text) {
    let result = String(text);
    for (const secret of this._secrets()) result = result.split(secret).join('<redacted>');
    return result.replace(/([?&]key=)[^&\s"']+/g, '$1<redacted>');
  }

  _hint(text) {
    if (!this.vertex && text.includes('API_KEY_SERVICE_BLOCKED')) {
      return 'hint: this key is not enabled for the Gemini Developer API; if it is a Vertex AI / Agent Platform key, pass { vertex: true }';
    }
    if (this.vertex && text.includes('API keys are not supported by this API')) {
      return 'hint: this Vertex AI endpoint needs OAuth; use Application Default Credentials (gcloud auth application-default login) or pass accessToken';
    }
    if (this.vertex && text.includes('RESOURCE_PROJECT_INVALID')) {
      return 'hint: this endpoint needs a project; pass { projectId }';
    }
    return null;
  }

  _apiError(prefix, error) {
    if (error instanceof GoogleAIError) return error;
    // timeouts and cancellation keep their name and code
    if (error && (error.name === 'AbortError' || error.code === 'ETIMEDOUT')) return connHelper.wrapError(error);
    const raw = error && error.message !== undefined ? error.message : String(error);
    const hint = this._hint(raw);
    let details = null;
    if (error && error.body) {
      try {
        details = JSON.parse(this._redact(error.body));
      } catch (parseError) {
        details = this._redact(error.body).slice(0, 2000);
      }
    }
    // the provider JSON stays at the end of the message, where apps look for it
    const wrapped = new GoogleAIError(this._redact(`${prefix}${hint ? ` (${hint})` : ''}: ${raw}`), error && error.status ? error.status : null, details);
    if (error && error.body !== undefined) wrapped.body = this._redact(error.body);
    if (error && error.code !== undefined) wrapped.code = error.code;
    wrapped.cause = error;
    return wrapped;
  }

  async _post(url, body, prefix, extra = {}) {
    try {
      const headers = { ...(await this._authHeaders()), ...(extra.headers || {}) };
      return await this.genaiClient.post(url, body, { ...extra, headers });
    } catch (error) {
      throw this._apiError(prefix, error);
    }
  }

  async _get(url, prefix, extra = {}) {
    try {
      const headers = { ...(await this._authHeaders()), ...(extra.headers || {}) };
      return await this.genaiClient.get(url, { ...extra, headers });
    } catch (error) {
      throw this._apiError(prefix, error);
    }
  }

  async _delete(url, prefix) {
    try {
      const headers = await this._authHeaders();
      const text = await this.genaiClient.request('DELETE', url, undefined, { headers, responseType: 'text' });
      return text && String(text).trim() ? JSON.parse(text) : { status: 'deleted' };
    } catch (error) {
      throw this._apiError(prefix, error);
    }
  }

  static _query(params) {
    const entries = Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== null && value !== '');
    return entries.length ? `?${entries.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')}` : '';
  }

  // ------------------------------------------------------------------
  // Request bodies
  // ------------------------------------------------------------------

  // One content item; Vertex AI rejects contents without a role.
  _content(content) {
    if (typeof content === 'string') return { role: 'user', parts: [{ text: content }] };
    if (content && typeof content === 'object' && this.vertex && !content.role) {
      const parts = content.parts || [];
      const isModel = parts.some((part) => part && (part.functionCall || part.function_call));
      return { ...content, role: isModel ? 'model' : 'user' };
    }
    return content;
  }

  // Body for generateContent-style calls: camelCase keys, string prompts, roles on Vertex, no 'model' key.
  _prepareBody(params) {
    const source = typeof params === 'string' ? { contents: [{ role: 'user', parts: [{ text: params }] }] } : params || {};
    const { model, ...rest } = source;
    const body = camelize(rest);
    let contents = body.contents;
    if (typeof contents === 'string' || (contents && !Array.isArray(contents))) contents = [contents];
    if (Array.isArray(contents)) body.contents = contents.map((content) => this._content(content));
    if (typeof body.systemInstruction === 'string') body.systemInstruction = { parts: [{ text: body.systemInstruction }] };
    return body;
  }

  /**
   * One content part for an image, audio, video or document.
   * @param {object|string|Buffer|Uint8Array} source - a part object (returned as is), { data, mimeType }, bytes,
   *   a local path (Node), or a gs://, https:// or YouTube URI.
   * @param {string} mimeType - needed for bytes and for URIs without an extension (Files API URIs).
   */
  mediaPart(source, mimeType = null, { videoMetadata = null } = {}) {
    let part;
    if (source && typeof source === 'object' && !isBinary(source)) {
      if (source.inlineData || source.inline_data || source.fileData || source.file_data || source.text !== undefined) {
        return camelize(source);
      }
      if (source.data !== undefined) {
        const type = source.mimeType || source.mime_type || mimeType;
        if (typeof source.data !== 'string') return this.mediaPart(source.data, type, { videoMetadata: source.videoMetadata || videoMetadata });
        // string data is base64 (a data URL prefix is dropped)
        if (!type) throw new Error('mimeType is required for raw bytes');
        part = { inlineData: { mimeType: type, data: source.data.replace(/^data:[^,]*,/, '') } };
        if (source.videoMetadata || videoMetadata) part.videoMetadata = source.videoMetadata || videoMetadata;
        return part;
      }
      if (source.uri || source.fileUri) {
        return this.mediaPart(source.uri || source.fileUri, source.mimeType || mimeType, { videoMetadata: source.videoMetadata || videoMetadata });
      }
      throw new Error('A media object needs data, uri or a Gemini part (inlineData / fileData).');
    }
    if (isBinary(source)) {
      if (!mimeType) throw new Error('mimeType is required for raw bytes');
      part = { inlineData: { mimeType, data: toBuffer(source).toString('base64') } };
    } else if (typeof source === 'string') {
      if (/^(gs|https?):\/\//i.test(source)) {
        const isYouTube = /youtube\.com|youtu\.be/i.test(source);
        const type = mimeType || (isYouTube ? 'video/mp4' : knownMimeType(source));
        if (!type) {
          throw new Error(`Could not tell the file type of ${source.slice(0, 80)}; pass mimeType (for a Files API URI use getFile(name).mimeType).`);
        }
        part = { fileData: { mimeType: type, fileUri: source } };
      } else if (source.startsWith('data:')) {
        const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(source);
        if (!match) throw new Error('Invalid data URL');
        const data = match[2] ? match[3] : Buffer.from(decodeURIComponent(match[3])).toString('base64');
        part = { inlineData: { mimeType: mimeType || match[1] || 'application/octet-stream', data } };
      } else {
        const fs = require('fs');
        if (!IS_NODE || !fs.existsSync || !fs.existsSync(source)) {
          throw new Error(`Not a file path or URI: ${source.slice(0, 80)}`);
        }
        part = { inlineData: { mimeType: mimeType || knownMimeType(source) || 'application/octet-stream', data: fs.readFileSync(source).toString('base64') } };
      }
    } else {
      throw new Error('Provide bytes, a file path, a URI or a part object.');
    }
    if (videoMetadata) part.videoMetadata = videoMetadata;
    return part;
  }

  _toParts(prompt = null, media = null) {
    const parts = [];
    const prompts = prompt === null || prompt === undefined ? [] : Array.isArray(prompt) ? prompt : [prompt];
    for (const item of prompts) parts.push(typeof item === 'string' ? { text: item } : camelize(item));
    const mediaList = media === null || media === undefined ? [] : Array.isArray(media) ? media : [media];
    for (const item of mediaList) parts.push(this.mediaPart(item));
    return parts;
  }

  _buildRequest(prompt, { systemInstruction, media, generationConfig, tools, toolConfig, safetySettings, history, cachedContent } = {}) {
    const contents = (history || []).map((content) => this._content(content));
    if ((prompt !== null && prompt !== undefined) || (media && media.length !== 0)) {
      contents.push({ role: 'user', parts: this._toParts(prompt, media) });
    }
    const body = { contents };
    if (systemInstruction) {
      body.systemInstruction = typeof systemInstruction === 'string' ? { parts: [{ text: systemInstruction }] } : systemInstruction;
    }
    if (generationConfig) body.generationConfig = { ...generationConfig };
    if (tools) body.tools = tools;
    if (toolConfig) body.toolConfig = toolConfig;
    if (safetySettings) body.safetySettings = safetySettings;
    if (cachedContent) body.cachedContent = cachedContent;
    return body;
  }

  // ------------------------------------------------------------------
  // Response helpers
  // ------------------------------------------------------------------

  static* _parts(response) {
    for (const candidate of (response && response.candidates) || []) {
      for (const part of (candidate && candidate.content && candidate.content.parts) || []) {
        if (part && typeof part === 'object') yield part;
      }
    }
  }

  /** The text of the first candidate (thought summaries are skipped unless includeThoughts). */
  static extractText(response, includeThoughts = false) {
    const candidates = (response && response.candidates) || [];
    if (!candidates.length) return '';
    const parts = (candidates[0] && candidates[0].content && candidates[0].content.parts) || [];
    return parts.filter((part) => part && typeof part.text === 'string' && (includeThoughts || !part.thought)).map((part) => part.text).join('');
  }

  /** finishReason of the first candidate (STOP, MAX_TOKENS, SAFETY, ...), or the prompt blockReason, or null. */
  static extractFinishReason(response) {
    const candidates = (response && response.candidates) || [];
    if (candidates.length) return (candidates[0] && candidates[0].finishReason) || null;
    return (response && response.promptFeedback && response.promptFeedback.blockReason) || null;
  }

  /** [{ name, args, id? }] for every functionCall part. */
  static extractFunctionCalls(response) {
    const calls = [];
    for (const part of GeminiAIWrapper._parts(response)) {
      const call = part.functionCall || part.function_call;
      if (call) calls.push({ ...call });
    }
    return calls;
  }

  /** groundingMetadata of the first candidate (search queries, sources, supports), or {}. */
  static extractGrounding(response) {
    const candidates = (response && response.candidates) || [];
    return (candidates.length && candidates[0] && candidates[0].groundingMetadata) || {};
  }

  /** The sources the answer was grounded on: [{ title, uri, text? }] from Google Search, URL context or RAG. */
  static extractCitations(response) {
    const metadata = GeminiAIWrapper.extractGrounding(response);
    const seen = new Set();
    const citations = [];
    for (const chunk of metadata.groundingChunks || []) {
      const source = chunk.web || chunk.retrievedContext || chunk.maps || {};
      const uri = source.uri || null;
      const key = uri || source.title;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      citations.push({ title: source.title || uri, uri, ...(source.domain && { domain: source.domain }), ...(source.text && { text: source.text }) });
    }
    return citations;
  }

  /** usageMetadata (promptTokenCount, candidatesTokenCount, thoughtsTokenCount, totalTokenCount), or null. */
  static extractUsage(response) {
    return (response && response.usageMetadata) || null;
  }

  static _extractMedia(response, prefix) {
    const items = [];
    for (const part of GeminiAIWrapper._parts(response)) {
      const inline = part.inlineData || part.inline_data;
      if (inline) {
        const mimeType = inline.mimeType || inline.mime_type || '';
        if (mimeType.startsWith(prefix)) items.push({ mimeType, data: inline.data });
      }
    }
    for (const prediction of (response && response.predictions) || []) {
      if (prediction && prediction.bytesBase64Encoded) {
        const mimeType = prediction.mimeType || (prefix === 'audio/' ? 'audio/wav' : 'image/png');
        if (mimeType.startsWith(prefix)) items.push({ mimeType, data: prediction.bytesBase64Encoded });
      }
    }
    return items;
  }

  /** Images from a Gemini response or an Imagen prediction: [{ mimeType, data (base64) }]. */
  static extractImages(response) {
    return GeminiAIWrapper._extractMedia(response, 'image/');
  }

  /** Audio from a Gemini TTS / music response or a Lyria prediction: [{ mimeType, data (base64) }]. */
  static extractAudio(response) {
    return GeminiAIWrapper._extractMedia(response, 'audio/');
  }

  /** Videos from a finished Veo operation: [{ mimeType, data (base64) or null, uri or null }]. */
  static extractVideos(operation) {
    const response = (operation && operation.response) || {};
    const videos = [];
    for (const video of response.videos || []) {
      videos.push({ mimeType: video.mimeType || 'video/mp4', data: video.bytesBase64Encoded || null, uri: video.gcsUri || null });
    }
    const samples = (response.generateVideoResponse && response.generateVideoResponse.generatedSamples) || response.generatedVideos || [];
    for (const sample of samples) {
      const video = sample.video || {};
      videos.push({ mimeType: video.mimeType || 'video/mp4', data: video.encodedVideo || video.bytesBase64Encoded || null, uri: video.uri || null });
    }
    return videos;
  }

  /** Wrap raw 16-bit PCM (Gemini TTS, Live API) in a WAV container. pcm is bytes or base64. Returns a Buffer. */
  static pcmToWav(pcm, sampleRate = 24000, channels = 1, sampleWidth = 2) {
    const data = typeof pcm === 'string' ? Buffer.from(pcm, 'base64') : toBuffer(pcm);
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + data.length, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(channels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * channels * sampleWidth, 28);
    header.writeUInt16LE(channels * sampleWidth, 32);
    header.writeUInt16LE(sampleWidth * 8, 34);
    header.write('data', 36);
    header.writeUInt32LE(data.length, 40);
    return Buffer.concat([header, data]);
  }

  /** WAV bytes (Buffer) for an item from extractAudio: raw L16 PCM is wrapped, WAV is returned as is. */
  static audioToWav(audio) {
    const raw = typeof audio.data === 'string' ? Buffer.from(audio.data, 'base64') : toBuffer(audio.data);
    const mimeType = String(audio.mimeType || audio.mime_type || '').toLowerCase();
    if (raw.slice(0, 4).toString('latin1') === 'RIFF') return GeminiAIWrapper._fixWavSizes(raw);
    if (mimeType.includes('l16') || mimeType.includes('pcm')) {
      const rate = /rate=(\d+)/.exec(mimeType);
      return GeminiAIWrapper.pcmToWav(raw, rate ? Number(rate[1]) : 24000);
    }
    return raw;
  }

  // Correct the RIFF and data sizes when a streamed WAV header claims more audio than is present.
  static _fixWavSizes(raw) {
    const position = raw.indexOf('data', 12, 'latin1');
    if (raw.slice(8, 12).toString('latin1') !== 'WAVE' || position < 0 || position + 8 > raw.length) return raw;
    const actual = raw.length - (position + 8);
    if (raw.readUInt32LE(position + 4) <= actual) return raw;
    const fixed = Buffer.from(raw);
    fixed.writeUInt32LE(raw.length - 8, 4);
    fixed.writeUInt32LE(actual, position + 4);
    return fixed;
  }

  // ------------------------------------------------------------------
  // Text, chat and multimodal generation
  // ------------------------------------------------------------------

  /**
   * Call generateContent and return the JSON response.
   * @param {object|string} params - a generateContent body (an optional `model` key selects the model and is not
   *   sent), or a plain prompt.
   * @param {boolean} vision - use the configured vision model when no model is given.
   * @param {string} modelOverride - model id that takes precedence over params.model.
   */
  async generateContent(params, vision = false, modelOverride = null) {
    const paramsModel = params && typeof params === 'object' ? params.model : null;
    const model = GeminiAIWrapper.getModelId(modelOverride || paramsModel || this._defaultModel(vision ? 'vision' : 'chat'));
    return this._post(await this._modelUrl(model, 'generateContent'), this._prepareBody(params), 'Gemini API error');
  }

  /** Call streamGenerateContent (server-sent events) and yield each response chunk. */
  async* streamGenerateContent(params, vision = false, modelOverride = null) {
    const paramsModel = params && typeof params === 'object' ? params.model : null;
    const model = GeminiAIWrapper.getModelId(modelOverride || paramsModel || this._defaultModel(vision ? 'vision' : 'chat'));
    const url = `${await this._modelUrl(model, 'streamGenerateContent')}?alt=sse`;
    const stream = await this._post(url, this._prepareBody(params), 'Gemini stream error', { responseType: 'stream' });
    for await (const event of GeminiAIWrapper._sseEvents(stream)) {
      if (event && typeof event === 'object' && event.error && typeof event.error === 'object') {
        throw new GoogleAIError(this._redact(`Gemini stream error: ${JSON.stringify(event.error)}`), event.error.code || null, event);
      }
      yield event;
    }
  }

  // Parse a server-sent events stream into JSON objects (text that is not JSON is yielded as a string).
  static async* _sseEvents(stream) {
    let buffer = '';
    const parse = (block) => {
      const data = block.split(/\r?\n/).filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trimStart()).join('\n');
      if (!data || data === '[DONE]') return undefined;
      try {
        return JSON.parse(data);
      } catch (error) {
        return data;
      }
    };
    for await (const chunk of readStreamChunks(stream)) {
      buffer += chunk;
      let match;
      while ((match = /\r?\n\r?\n/.exec(buffer))) {
        const block = buffer.slice(0, match.index);
        buffer = buffer.slice(match.index + match[0].length);
        const event = parse(block);
        if (event !== undefined) yield event;
      }
    }
    const last = parse(buffer);
    if (last !== undefined) yield last;
  }

  /**
   * Generate and return text.
   * @param {string|Array} prompt - text, or parts.
   * @param {object} options - { model, systemInstruction, media, generationConfig, tools, toolConfig, safetySettings,
   *   history, cachedContent }. media takes paths, bytes ({ data, mimeType }), gs:// / https URIs or parts.
   */
  async generateText(prompt, options = {}) {
    const body = this._buildRequest(prompt, options);
    return GeminiAIWrapper.extractText(await this.generateContent(body, false, options.model || this._defaultModel('chat')));
  }

  /** Yield the text of the reply as the model writes it. Same options as generateText. */
  async* streamText(prompt, options = {}) {
    const body = this._buildRequest(prompt, options);
    for await (const chunk of this.streamGenerateContent(body, false, options.model || this._defaultModel('chat'))) {
      const text = GeminiAIWrapper.extractText(chunk);
      if (text) yield text;
    }
  }

  /**
   * A multi-turn chat that keeps the history, including the thought signatures Gemini 3 needs for tool use
   * and image editing. Save chat.history (JSON) to resume later with startChat({ history }).
   * @param {object} options - { model, systemInstruction, generationConfig, tools, toolConfig, safetySettings, history }.
   */
  startChat(options = {}) {
    return new GoogleAIChatSession(this, options);
  }

  /** generateContent with a system instruction (content parts in, raw response out). */
  async generateContentWithSystemInstructions(contentParts, systemInstruction = null, modelOverride = null) {
    return this.generateContent({
      contents: [{ role: 'user', parts: contentParts }],
      ...(systemInstruction && { systemInstruction: { parts: [{ text: systemInstruction }] } }),
    }, false, modelOverride);
  }

  /** JSON output that follows responseSchema (OpenAPI-style or JSON Schema types). Returns the raw response. */
  async generateStructuredContent(contentParts, responseSchema, { systemInstruction = null, model = null, generationConfig = null, tools = null, toolConfig = null } = {}) {
    const parts = typeof contentParts === 'string' ? [{ text: contentParts }] : contentParts;
    return this.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: { responseMimeType: 'application/json', responseSchema, ...(generationConfig || {}) },
      ...(systemInstruction && { systemInstruction: { parts: [{ text: systemInstruction }] } }),
      ...(tools && { tools }),
      ...(toolConfig && { toolConfig }),
    }, false, model);
  }

  /** Count the tokens of a prompt or a request body: { totalTokens, ... }. */
  async countTokens(params, model = null) {
    const body = this._prepareBody(params);
    const target = model || (params && params.model) || this._defaultModel('chat');
    let request;
    if (this.vertex) {
      request = {};
      for (const key of ['contents', 'systemInstruction', 'tools', 'generationConfig']) if (body[key] !== undefined) request[key] = body[key];
    } else {
      // the Developer API takes the other request fields only inside generateContentRequest
      const extra = {};
      for (const key of ['systemInstruction', 'tools', 'generationConfig', 'toolConfig', 'safetySettings', 'cachedContent']) {
        if (body[key] !== undefined) {
          extra[key] = body[key];
          delete body[key];
        }
      }
      request = Object.keys(extra).length ? { generateContentRequest: { model: this._modelPath(target), ...body, ...extra } } : body;
    }
    return this._post(await this._modelUrl(target, 'countTokens'), request, 'Gemini countTokens error');
  }

  /** Token ids and pieces of a request (Vertex AI only). */
  async computeTokens(params, model = null) {
    if (!this.vertex) throw new GoogleAIError('computeTokens is only available on Vertex AI. Create the wrapper with { vertex: true }.');
    const body = this._prepareBody(params);
    return this._post(await this._modelUrl(model || this._defaultModel('chat'), 'computeTokens'), { contents: body.contents || [] }, 'Gemini computeTokens error');
  }

  // ------------------------------------------------------------------
  // Image, audio, video and document understanding
  // ------------------------------------------------------------------

  async imageToText(userInput, filePath, extension, modelOverride = null) {
    const imageData = require('fs').readFileSync(filePath, { encoding: 'base64' });
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
    return this.generateContent(params, true, modelOverride);
  }

  /** Ask about images, audio, video or documents and return text. Options as generateText. */
  async mediaToText(prompt, media, options = {}) {
    return this.generateText(prompt, { ...options, media, model: options.model || this._defaultModel('vision') });
  }

  /** Transcribe or describe audio (bytes with mimeType, a path, or a gs:// / https URI). */
  async audioToText(audio, prompt = 'Transcribe this audio.', options = {}) {
    return this.mediaToText(prompt, [this.mediaPart(audio, options.mimeType || null)], options);
  }

  /** Summarize or ask about a video (bytes, a path, a gs:// URI or a YouTube URL). videoMetadata clips it. */
  async videoToText(video, prompt = 'Summarize this video.', options = {}) {
    const part = this.mediaPart(video, options.mimeType || null, { videoMetadata: options.videoMetadata || null });
    return this.mediaToText(prompt, [part], options);
  }

  // ------------------------------------------------------------------
  // Image generation (Gemini image models, Imagen)
  // ------------------------------------------------------------------

  /**
   * Generate images with a Gemini image model; pass images to edit or combine them. configParams is merged into
   * generationConfig, e.g. { imageConfig: { aspectRatio: '16:9' } }. Read the result with extractImages.
   */
  async generateImage(prompt, configParams = null, modelOverride = null, { images = null } = {}) {
    const model = modelOverride || this._defaultModel('image');
    const imageList = images === null || images === undefined ? [] : Array.isArray(images) ? images : [images];
    const body = this._prepareBody({
      contents: [{ role: 'user', parts: [{ text: prompt }, ...imageList.map((image) => this.mediaPart(image))] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'], ...(configParams || {}) },
    });
    return this._post(await this._modelUrl(model, 'generateContent'), body, 'Gemini Image Generation error');
  }

  /** Edit one or more images with a text instruction. */
  async editImage(prompt, images, configParams = null, modelOverride = null) {
    return this.generateImage(prompt, configParams, modelOverride, { images: Array.isArray(images) ? images : [images] });
  }

  // Image object for Imagen / Veo requests: bytes, a path, a gs:// URI, base64 text or an object.
  _imagenImage(image, mimeType = null, defaultMime = null) {
    if (image && typeof image === 'object' && !isBinary(image)) return image;
    let result;
    let type = mimeType;
    if (isBinary(image)) {
      const data = toBuffer(image);
      result = { bytesBase64Encoded: data.toString('base64') };
      type = type || GeminiAIWrapper._sniffImageMime(data);
    } else if (typeof image === 'string' && image.startsWith('gs://')) {
      result = { gcsUri: image };
      type = type || knownMimeType(image);
    } else if (typeof image === 'string' && /^https?:\/\//i.test(image)) {
      throw new Error('Imagen and Veo take image bytes, a local path or a gs:// URI, not an http(s) URL.');
    } else if (typeof image === 'string' && IS_NODE && require('fs').existsSync && require('fs').existsSync(image)) {
      const data = require('fs').readFileSync(image);
      result = { bytesBase64Encoded: data.toString('base64') };
      type = type || knownMimeType(image) || GeminiAIWrapper._sniffImageMime(data);
    } else if (typeof image === 'string' && /^[A-Za-z0-9+/=\s]+$/.test(image)) {
      result = { bytesBase64Encoded: image };
    } else {
      throw new Error('image must be bytes, a path, a gs:// URI, base64 text or an object');
    }
    type = type || defaultMime;
    if (type) result.mimeType = type;
    return result;
  }

  static _sniffImageMime(data) {
    if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return 'image/jpeg';
    if (data.slice(0, 8).toString('latin1') === '\x89PNG\r\n\x1a\n') return 'image/png';
    if (data.slice(0, 4).toString('latin1') === 'RIFF' && data.slice(8, 12).toString('latin1') === 'WEBP') return 'image/webp';
    return null;
  }

  _imagenModel(model) {
    if (model) return model;
    throw new Error('Google retired the Imagen models on 2026-06-30 (they return 404). Use generateImage / editImage with a '
      + 'Gemini image model, or pass { model } for an Imagen model your project can still call.');
  }

  /** Imagen :predict (retired by Google; needs an explicit model). */
  async imagenGenerateImages(prompt, { numberOfImages = 1, model = null, aspectRatio = null, negativePrompt = null, parameters = null } = {}) {
    const body = {
      instances: [{ prompt }],
      parameters: { sampleCount: numberOfImages, ...(aspectRatio && { aspectRatio }), ...(negativePrompt && { negativePrompt }), ...(parameters || {}) },
    };
    return this._post(await this._modelUrl(this._imagenModel(model), 'predict', this._locationFor('imagen')), body, 'Imagen error');
  }

  // ------------------------------------------------------------------
  // Video generation (Veo)
  // ------------------------------------------------------------------

  /**
   * Start a Veo video generation and return the long-running operation (poll it with getVideoOperation or
   * waitForVideoCompletion). On Vertex AI it needs a project. configParams are Veo parameters, e.g.
   * { durationSeconds: 4, aspectRatio: '16:9', resolution: '720p', generateAudio: false, storageUri: 'gs://...' }.
   */
  async generateVideo(prompt, configParams = null, projectId = null, { model = null, image = null, lastFrame = null, location = null } = {}) {
    const instance = { prompt };
    if (image !== null && image !== undefined) instance.image = this._imagenImage(image, null, 'image/png');
    if (lastFrame !== null && lastFrame !== undefined) instance.lastFrame = this._imagenImage(lastFrame, null, 'image/png');
    const body = { instances: [instance], parameters: { aspectRatio: '16:9', ...(configParams || {}) } };
    let url;
    if (this.vertex || projectId) {
      const project = projectId || this.projectId || (!this.API_KEY ? await this._requireProject('Veo video generation') : null);
      if (!project) {
        throw new Error('Video generation on Vertex AI needs a project (Veo does not run in express mode). Pass projectId.');
      }
      const videoLocation = this._locationFor('video', location) || 'us-central1';
      const videoModel = model || (this.vertex ? this._defaultModel('video') : config.url.gemini.vertex.models.video);
      url = this._vertexProjectUrl(project, videoLocation, `${GeminiAIWrapper._vertexModelPath(videoModel)}:predictLongRunning`);
    } else {
      url = await this._modelUrl(model || this._defaultModel('video'), 'predictLongRunning');
    }
    return this._post(url, body, 'Veo Video Generation error');
  }

  /** Poll a Veo operation (a name or the operation object). */
  async getVideoOperation(operation) {
    const name = operation && typeof operation === 'object' ? operation.name : operation;
    if (!name) throw new Error('operation name is required');
    if (name.startsWith('projects/')) {
      const resource = name.slice(0, name.lastIndexOf('/operations/'));
      return this._post(`${this._nameUrl(resource)}:fetchPredictOperation`, { operationName: name }, 'Video status check error');
    }
    if (this.vertex) throw new Error("Vertex AI operation names start with 'projects/'.");
    return this._get(`${this.baseUrl || this._devApiBase}/${name}`, 'Video status check error');
  }

  /** Poll until the operation is done and return it. Throws after maxWaitMs. */
  async waitForVideoCompletion(operation, { maxWaitMs = 600000, pollMs = 10000 } = {}) {
    const started = Date.now();
    while (Date.now() - started < maxWaitMs) {
      const status = await this.getVideoOperation(operation);
      if (status && status.done) {
        if (status.error) throw new GoogleAIError(`Veo Video Generation error: ${JSON.stringify(status.error)}`, status.error.code || null, status.error);
        return status;
      }
      await sleep(pollMs);
    }
    throw new Error(`Video generation did not complete within ${Math.round(maxWaitMs / 1000)} seconds`);
  }

  /**
   * Download a generated file from an https URI (e.g. a Developer API Veo video) and return its bytes (Buffer).
   * The credentials are sent only to Google API hosts; redirects to other hosts get none.
   */
  async downloadMedia(uri) {
    if (!/^https:\/\//i.test(uri)) throw new Error('downloadMedia takes an https:// URI');
    const fetch = require('cross-fetch');
    let url = uri.includes('alt=') ? uri : `${uri}${uri.includes('?') ? '&' : '?'}alt=media`;
    for (let hop = 0; hop < 5; hop++) {
      const host = new URL(url).hostname.toLowerCase();
      const trusted = GOOGLE_API_HOST.test(host) || (this.baseUrl && new URL(this.baseUrl).hostname.toLowerCase() === host);
      const headers = trusted ? await this._credentialHeaders() : {};
      const response = await fetch(url, { headers, redirect: 'manual' });
      if ([301, 302, 303, 307, 308].includes(response.status) && response.headers.get('location')) {
        url = new URL(response.headers.get('location'), url).toString();
        continue;
      }
      if (!response.ok) {
        const error = new Error(`HTTP error ${response.status}: ${await response.text().catch(() => '')}`);
        error.status = response.status;
        throw this._apiError('Download error', error);
      }
      return Buffer.from(await response.arrayBuffer());
    }
    throw new GoogleAIError('Download error: too many redirects');
  }

  // ------------------------------------------------------------------
  // Music (Lyria) and speech (Gemini TTS)
  // ------------------------------------------------------------------

  /**
   * Generate music. Lyria 2 (lyria-002, Vertex AI) uses :predict; Lyria 3 models (lyria-3.5, Developer API) use
   * generateContent. Read the audio with extractAudio and audioToWav.
   */
  async generateMusic(prompt, { model = null, negativePrompt = null, seed = null, sampleCount = null, generationConfig = null, location = null } = {}) {
    const target = model || this._defaultModel('music');
    if (!target.includes('/') && /^lyria-0\d\d/.test(target)) {
      if (!this.vertex) {
        throw new GoogleAIError(`${target} runs on Vertex AI. Create the wrapper with { vertex: true }, or use a Lyria 3 model on the Developer API.`);
      }
      const instance = { prompt, ...(negativePrompt && { negative_prompt: negativePrompt }), ...(seed !== null && { seed }) };
      const body = { instances: [instance], ...(sampleCount && { parameters: { sample_count: sampleCount } }) };
      return this._post(await this._modelUrl(target, 'predict', this._locationFor('music', location)), body, 'Lyria music error');
    }
    const text = negativePrompt ? `${prompt}\nAvoid: ${negativePrompt}` : prompt;
    const body = this._prepareBody({
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: { responseModalities: ['AUDIO', 'TEXT'], ...(seed !== null && { seed }), ...(generationConfig || {}) },
    });
    return this._post(await this._modelUrl(target, 'generateContent', location), body, 'Lyria music error');
  }

  /**
   * Speech with a Gemini TTS model (default voice Kore). Returns the response: extractAudio(response) then
   * audioToWav(item) gives a playable WAV. Style the voice in the text ("Say cheerfully: ...").
   */
  async generateGeminiSpeech(text, voiceConfig = null, modelOverride = null, { voice = null, languageCode = null } = {}) {
    const body = this._prepareBody({
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voice || 'Kore' }, ...camelize(voiceConfig || {}) },
          ...(languageCode && { languageCode }),
        },
      },
    });
    return this._post(await this._modelUrl(modelOverride || this._defaultModel('tts'), 'generateContent'), body, 'Gemini TTS error');
  }

  /** Multi-speaker speech: speakerConfigs [{ speaker, voiceConfig: { prebuiltVoiceConfig: { voiceName } } }]. */
  async generateMultiSpeakerSpeech(text, speakerConfigs, modelOverride = null) {
    const body = this._prepareBody({
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: { multiSpeakerVoiceConfig: { speakerVoiceConfigs: camelize(speakerConfigs) } },
      },
    });
    return this._post(await this._modelUrl(modelOverride || this._defaultModel('tts'), 'generateContent'), body, 'Gemini Multi-Speaker TTS error');
  }

  /** Text to a WAV Buffer in one call (Gemini TTS). */
  async textToSpeech(text, { voice = 'Kore', model = null, languageCode = null } = {}) {
    const response = await this.generateGeminiSpeech(text, null, model, { voice, languageCode });
    const [audio] = GeminiAIWrapper.extractAudio(response);
    if (!audio) throw new GoogleAIError(`Gemini TTS error: the response has no audio (finishReason ${GeminiAIWrapper.extractFinishReason(response)})`);
    return GeminiAIWrapper.audioToWav(audio);
  }

  // ------------------------------------------------------------------
  // Embeddings
  // ------------------------------------------------------------------

  static _contentText(content) {
    if (typeof content === 'string') return content;
    return ((content && content.parts) || []).filter((part) => part && part.text).map((part) => part.text).join('\n');
  }

  // Vertex AI embeddings: gemini-embedding-001 and text-embedding-* use :predict (gemini-embedding-001 takes one
  // input per request, the others up to 250); newer Gemini embedding models use :embedContent.
  async _vertexEmbed(modelId, texts, { taskType = null, title = null, outputDimensionality = null } = {}) {
    const vectors = [];
    if (modelId.includes('gemini') && modelId !== 'gemini-embedding-001') {
      for (const text of texts) {
        const embedConfig = { ...(taskType && { taskType }), ...(title && { title }), ...(outputDimensionality && { outputDimensionality }) };
        const body = { content: { role: 'user', parts: [{ text }] }, ...(Object.keys(embedConfig).length && { embedContentConfig: embedConfig }) };
        const data = await this._post(await this._modelUrl(modelId, 'embedContent'), body, 'Gemini API error');
        vectors.push((data.embedding && data.embedding.values) || []);
      }
      return vectors;
    }
    const maxCount = modelId.startsWith('gemini-embedding') ? 1 : 250;
    for (let start = 0; start < texts.length; start += maxCount) {
      const instances = texts.slice(start, start + maxCount).map((text) => ({ content: text, ...(taskType && { task_type: taskType }), ...(title && { title }) }));
      const body = { instances, ...(outputDimensionality && { parameters: { outputDimensionality } }) };
      const data = await this._post(await this._modelUrl(modelId, 'predict'), body, 'Gemini API error');
      for (const prediction of data.predictions || []) vectors.push((prediction.embeddings && prediction.embeddings.values) || []);
    }
    return vectors;
  }

  /**
   * One embedding: params { model?, content: { parts: [{ text }] }, taskType?, outputDimensionality? }.
   * Returns the embedding object ({ values }) on both backends.
   */
  async getEmbeddings(params) {
    const modelId = GeminiAIWrapper.getModelId(params.model || this._defaultModel('embed')).split('/').pop();
    if (this.vertex) {
      const [values] = await this._vertexEmbed(modelId, [GeminiAIWrapper._contentText(params.content)], {
        taskType: params.taskType || params.task_type, title: params.title, outputDimensionality: params.outputDimensionality || params.output_dimensionality,
      });
      return { values: values || [] };
    }
    const response = await this._post(await this._modelUrl(modelId, 'embedContent'), { ...camelize(params), model: `models/${modelId}` }, 'Gemini API error');
    return response.embedding;
  }

  /** Batch embeddings: params { requests: [{ model?, content }] }. Returns [{ values }]. */
  async getBatchEmbeddings(params) {
    const requests = params.requests || [];
    const requestedModel = requests.length > 0 ? requests[0].model : null;
    const modelId = GeminiAIWrapper.getModelId(requestedModel || this._defaultModel('embed')).split('/').pop();
    if (this.vertex) {
      const vectors = await this._vertexEmbed(modelId, requests.map((request) => GeminiAIWrapper._contentText(request.content)));
      return vectors.map((values) => ({ values }));
    }
    const response = await this._post(await this._modelUrl(modelId, 'batchEmbedContents'), {
      ...params,
      requests: requests.map((request) => ({ ...camelize(request), model: `models/${modelId}` })),
    }, 'Gemini API error');
    return response.embeddings;
  }

  /**
   * Embed texts and return the vectors (number[][]).
   * @param {object} options - { taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY' | 'SEMANTIC_SIMILARITY' | ..., title, outputDimensionality }.
   */
  async embedTexts(texts, model = null, { taskType = null, title = null, outputDimensionality = null } = {}) {
    const list = Array.isArray(texts) ? texts : [texts];
    const modelId = GeminiAIWrapper.getModelId(model || this._defaultModel('embed')).split('/').pop();
    if (this.vertex) return this._vertexEmbed(modelId, list, { taskType, title, outputDimensionality });
    const vectors = [];
    // batchEmbedContents takes at most 100 requests
    for (let start = 0; start < list.length; start += 100) {
      const requests = list.slice(start, start + 100).map((text) => ({
        model: `models/${modelId}`,
        content: { parts: [{ text: String(text) }] },
        ...(taskType && { taskType }),
        ...(title && { title }),
        ...(outputDimensionality && { outputDimensionality }),
      }));
      const data = await this._post(await this._modelUrl(modelId, 'batchEmbedContents'), { requests }, 'Gemini API error');
      for (const item of data.embeddings || []) vectors.push(item.values || []);
    }
    return vectors;
  }

  // ------------------------------------------------------------------
  // Files API (Gemini Developer API only)
  // ------------------------------------------------------------------

  _developerApiOnly(feature) {
    if (this.vertex) {
      throw new GoogleAIError(`${feature} is only available on the Gemini Developer API. On Vertex AI send files inline (mediaPart) or as gs:// URIs.`);
    }
  }

  _fileUrl(name) {
    const file = String(name).startsWith('files/') ? name : `files/${name}`;
    return `${this.baseUrl || this._devApiBase}/${file}`;
  }

  /**
   * Upload a file (a path, or bytes with { mimeType }) with the resumable Files API and return the file
   * ({ name, uri, mimeType, state, ... }). Videos are PROCESSING at first: use waitForFileActive before asking about them.
   */
  async uploadFile(source, { displayName = null, mimeType = null } = {}) {
    this._developerApiOnly('The Files API');
    let data;
    let type = mimeType;
    let name = displayName;
    if (typeof source === 'string') {
      const fs = require('fs');
      if (!IS_NODE || !fs.existsSync(source)) throw new Error(`File not found: ${source}`);
      data = fs.readFileSync(source);
      type = type || knownMimeType(source) || 'application/octet-stream';
      name = name || require('path').basename(source);
    } else {
      data = toBuffer(source);
      if (!type) throw new Error('mimeType is required when uploading bytes');
    }
    const fetch = require('cross-fetch');
    const credentials = await this._credentialHeaders();
    const start = await fetch(this._devUploadBase, {
      method: 'POST',
      headers: {
        ...credentials,
        'Content-Type': 'application/json',
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Command': 'start',
        'X-Goog-Upload-Header-Content-Length': String(data.length),
        'X-Goog-Upload-Header-Content-Type': type,
      },
      body: JSON.stringify({ file: { display_name: name || 'upload' } }),
    });
    if (!start.ok) {
      const error = Object.assign(new Error(`HTTP error ${start.status}: ${await start.text().catch(() => '')}`), { status: start.status });
      throw this._apiError('File upload error', error);
    }
    const uploadUrl = start.headers.get('x-goog-upload-url');
    if (!uploadUrl) throw new GoogleAIError('File upload error: the upload URL is missing from the response headers');
    const upload = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Length': String(data.length), 'X-Goog-Upload-Offset': '0', 'X-Goog-Upload-Command': 'upload, finalize' },
      body: data,
    });
    const text = await upload.text();
    if (!upload.ok) throw this._apiError('File upload error', Object.assign(new Error(`HTTP error ${upload.status}: ${text}`), { status: upload.status }));
    const result = JSON.parse(text);
    return result.file || result;
  }

  async getFile(name) {
    this._developerApiOnly('The Files API');
    return this._get(this._fileUrl(name), 'Get file error');
  }

  async listFiles({ pageSize = null, pageToken = null } = {}) {
    this._developerApiOnly('The Files API');
    return this._get(`${this.baseUrl || this._devApiBase}/files${GeminiAIWrapper._query({ pageSize, pageToken })}`, 'List files error');
  }

  async deleteFile(name) {
    this._developerApiOnly('The Files API');
    return this._delete(this._fileUrl(name), 'Delete file error');
  }

  /** Wait until an uploaded file leaves PROCESSING; returns the file, throws if it FAILED or the wait times out. */
  async waitForFileActive(name, { maxWaitMs = 300000, pollMs = 3000 } = {}) {
    const started = Date.now();
    while (Date.now() - started < maxWaitMs) {
      const file = await this.getFile(typeof name === 'object' ? name.name : name);
      if (file.state === 'ACTIVE' || !file.state) return file;
      if (file.state === 'FAILED') throw new GoogleAIError(`File processing failed: ${JSON.stringify(file.error || {})}`);
      await sleep(pollMs);
    }
    throw new Error(`The file was not ready within ${Math.round(maxWaitMs / 1000)} seconds`);
  }

  // ------------------------------------------------------------------
  // Models, context caching and Agent Engine
  // ------------------------------------------------------------------

  /** List models. On Vertex AI this lists Google publisher models and needs OAuth; use modelCatalog() offline. */
  async listModels({ pageSize = null, pageToken = null } = {}) {
    const query = GeminiAIWrapper._query({ pageSize, pageToken });
    const url = this.vertex
      ? `${this.baseUrl || `${this._vertexHost(null)}/${this.apiVersion}`}/publishers/google/models${query}`
      : `${this.baseUrl || this._devApiBase}/models${query}`;
    return this._get(url, 'List models error');
  }

  /** Known Vertex AI model ids by capability (from config). */
  static modelCatalog() {
    return JSON.parse(JSON.stringify(config.url.gemini.vertex.catalog));
  }

  async _cacheUrl(name = null, location = null) {
    if (this.vertex) {
      if (name && name.startsWith('projects/')) return this._nameUrl(name);
      const project = await this._requireProject('Context caching');
      const path = name ? `cachedContents/${name.split('/').pop()}` : 'cachedContents';
      return this._vertexProjectUrl(project, location || this.location || 'global', path);
    }
    const root = this.baseUrl || this._devApiBase;
    if (name) return `${root}/${name.startsWith('cachedContents/') ? name : `cachedContents/${name}`}`;
    return `${root}/cachedContents`;
  }

  /**
   * Cache a large prompt prefix (documents, video, a long system instruction) and reuse it with
   * generateContent({ cachedContent: cache.name, contents }). Google enforces a minimum size; the generate call
   * must use the same model. Vertex AI needs a project and OAuth.
   */
  async createCachedContent(model, contents, { systemInstruction = null, ttl = '3600s', displayName = null, tools = null, toolConfig = null, location = null } = {}) {
    const body = this._prepareBody({ contents });
    if (this.vertex) {
      const project = await this._requireProject('Context caching');
      const modelPath = GeminiAIWrapper._vertexModelPath(model);
      body.model = modelPath.startsWith('projects/') ? modelPath : `projects/${project}/locations/${location || this.location || 'global'}/${modelPath}`;
    } else {
      body.model = this._modelPath(model);
    }
    if (systemInstruction) body.systemInstruction = typeof systemInstruction === 'string' ? { parts: [{ text: systemInstruction }] } : systemInstruction;
    if (ttl) body.ttl = ttl;
    if (displayName) body.displayName = displayName;
    if (tools) body.tools = tools;
    if (toolConfig) body.toolConfig = toolConfig;
    return this._post(await this._cacheUrl(null, location), body, 'Context cache error');
  }

  async getCachedContent(name) {
    return this._get(await this._cacheUrl(name), 'Context cache error');
  }

  async listCachedContents({ pageSize = null, pageToken = null, location = null } = {}) {
    return this._get(`${await this._cacheUrl(null, location)}${GeminiAIWrapper._query({ pageSize, pageToken })}`, 'Context cache error');
  }

  async deleteCachedContent(name) {
    return this._delete(await this._cacheUrl(name), 'Context cache error');
  }

  async _agentEngineName(name, location = null) {
    if (name.startsWith('projects/')) return name;
    const project = await this._requireProject('Agent Engine');
    return `projects/${project}/locations/${this._locationFor('agent_engine', location) || 'us-central1'}/reasoningEngines/${name}`;
  }

  /** Agents deployed to Vertex AI Agent Engine in the project. */
  async listAgentEngines({ location = null, pageSize = null, pageToken = null, filter = null } = {}) {
    const project = await this._requireProject('Agent Engine');
    const url = this._vertexProjectUrl(project, this._locationFor('agent_engine', location) || 'us-central1', 'reasoningEngines');
    return this._get(`${url}${GeminiAIWrapper._query({ pageSize, pageToken, filter })}`, 'Agent Engine error');
  }

  async getAgentEngine(name, { location = null } = {}) {
    return this._get(this._nameUrl(await this._agentEngineName(name, location)), 'Agent Engine error');
  }

  /** Call a deployed agent's query method: returns { output }. Input keys depend on the agent (ADK: message, user_id). */
  async queryAgentEngine(name, input = {}, { classMethod = null, location = null } = {}) {
    const url = `${this._nameUrl(await this._agentEngineName(name, location))}:query`;
    return this._post(url, { input: input || {}, ...(classMethod && { classMethod }) }, 'Agent Engine error');
  }

  /** Call a deployed agent's streaming method and yield each event (object, or text when not JSON). */
  async* streamQueryAgentEngine(name, input = {}, { classMethod = 'stream_query', location = null } = {}) {
    const url = `${this._nameUrl(await this._agentEngineName(name, location))}:streamQuery?alt=sse`;
    const stream = await this._post(url, { input: input || {}, ...(classMethod && { classMethod }) }, 'Agent Engine error', { responseType: 'stream' });
    let buffer = '';
    const parse = (line) => {
      const text = line.startsWith('data:') ? line.slice(5).trim() : line.trim();
      if (!text) return undefined;
      try {
        return JSON.parse(text);
      } catch (error) {
        return text;
      }
    };
    for await (const chunk of readStreamChunks(stream)) {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop();
      for (const line of lines) {
        const event = parse(line);
        if (event !== undefined) yield event;
      }
    }
    const last = parse(buffer);
    if (last !== undefined) yield last;
  }

  // ------------------------------------------------------------------
  // Grounding tools
  // ------------------------------------------------------------------

  /** Google Search grounding tool: tools: [GeminiAIWrapper.googleSearchTool()]. */
  static googleSearchTool() {
    return { googleSearch: {} };
  }

  /** Vertex AI RAG Engine grounding tool for one or more corpora (names or ids with projectId). */
  ragTool(corpora, { topK = 5, vectorDistanceThreshold = null, location = null } = {}) {
    const list = Array.isArray(corpora) ? corpora : [corpora];
    const ragResources = list.map((corpus) => ({
      ragCorpus: String(corpus).startsWith('projects/') ? corpus
        : `projects/${this.projectId}/locations/${location || this._locationFor('rag') || 'us-central1'}/ragCorpora/${corpus}`,
    }));
    return {
      retrieval: {
        vertexRagStore: {
          ragResources,
          ragRetrievalConfig: { topK, ...(vectorDistanceThreshold !== null && { filter: { vectorDistanceThreshold } }) },
        },
      },
    };
  }

  /** Vertex AI Search grounding tool for a data store (full resource name). */
  static vertexAISearchTool(datastore) {
    return { retrieval: { vertexAiSearch: { datastore } } };
  }

  // ------------------------------------------------------------------
  // Live API (bidirectional streaming over a websocket)
  // ------------------------------------------------------------------

  async _liveEndpoint(model = null, location = null) {
    const target = model || this._defaultModel('live');
    if (this.vertex) {
      const project = await this._requireProject('The Live API');
      const liveLocation = this._locationFor('live', location) || 'us-central1';
      const host = this._vertexHost(liveLocation).replace(/^https:\/\//, 'wss://');
      const url = `${host}/ws/google.cloud.aiplatform.${this.apiVersion}.LlmBidiService/BidiGenerateContent`;
      const modelPath = GeminiAIWrapper._vertexModelPath(target);
      const modelName = modelPath.startsWith('projects/') ? modelPath : `projects/${project}/locations/${liveLocation}/${modelPath}`;
      return { url, modelName, headers: await this._credentialHeaders() };
    }
    const host = /^https:\/\/[^/]+/.exec(this._devApiBase)[0].replace(/^https:\/\//, 'wss://');
    const url = `${host}/ws/google.ai.generativelanguage.${this.apiVersion}.GenerativeService.BidiGenerateContent`;
    // the Developer API documents the key as a query parameter for the websocket
    if (this.API_KEY) return { url: `${url}?key=${encodeURIComponent(this.API_KEY)}`, modelName: this._modelPath(target), headers: {} };
    return { url, modelName: this._modelPath(target), headers: await this._credentialHeaders() };
  }

  /**
   * Open a Live API session (voice or text, with tools) and return a GoogleAILiveSession after setup completes.
   * config is the setup message without `model`, e.g. { generationConfig: { responseModalities: ['AUDIO'] },
   * systemInstruction, outputAudioTranscription: {} }. Needs a WebSocket: Node 22+ has one built in; on older
   * Node pass { WebSocket: require('ws') } to the wrapper. Vertex AI needs projectId (Live models run in us-central1).
   */
  async liveConnect({ model = null, config: setupConfig = null, location = null } = {}) {
    const { url, modelName, headers } = await this._liveEndpoint(model, location);
    const setup = { model: modelName, ...camelize(setupConfig || {}) };
    setup.generationConfig = { responseModalities: ['AUDIO'], ...(setup.generationConfig || {}) };
    const WebSocketClass = this.WebSocket || (typeof globalThis !== 'undefined' ? globalThis.WebSocket : null);
    if (!WebSocketClass) {
      throw new GoogleAIError('The Live API needs a WebSocket: use Node 22+ or pass { WebSocket: require("ws") } to the wrapper.');
    }
    let socket;
    try {
      const isBrowser = typeof window !== 'undefined' && WebSocketClass === window.WebSocket;
      if (isBrowser) {
        // browsers cannot set headers; the Developer API URL already carries the key
        if (this.vertex) throw new Error('In the browser the Live API works with a Developer API key only.');
        socket = new WebSocketClass(url);
      } else {
        socket = Object.keys(headers).length ? new WebSocketClass(url, { headers }) : new WebSocketClass(url);
      }
    } catch (error) {
      throw new GoogleAIError(this._redact(`Live API connection error: ${error.message}`));
    }
    const session = new GoogleAILiveSession(socket);
    try {
      await session._opened();
      session.send({ setup });
      const first = await session._next();
      if (!first || first.setupComplete === undefined) {
        throw new GoogleAIError(this._redact(`Live API setup failed: ${JSON.stringify(first)}`));
      }
      session.setupResponse = first;
    } catch (error) {
      session.close();
      throw error instanceof GoogleAIError ? error : new GoogleAIError(this._redact(`Live API setup error: ${error.message}`));
    }
    return session;
  }

  /** One text turn over the Live API: { text, transcription, audio (Buffer, 24 kHz PCM), toolCalls, usage }. */
  async liveGenerate(text, { model = null, config: setupConfig = null, location = null } = {}) {
    const settings = camelize(setupConfig || {});
    const modalities = (settings.generationConfig && settings.generationConfig.responseModalities) || ['AUDIO'];
    if (modalities.includes('AUDIO') && settings.outputAudioTranscription === undefined) settings.outputAudioTranscription = {};
    const session = await this.liveConnect({ model, config: settings, location });
    try {
      session.sendText(text);
      return await session.receiveTurn();
    } finally {
      session.close();
    }
  }
}

/**
 * A multi-turn Gemini chat. The history keeps the model turns as returned, including thought signatures, which
 * Gemini 3 needs for multi-turn tool use and image editing. history is plain JSON: store it to resume later.
 */
class GoogleAIChatSession {
  constructor(wrapper, { model = null, systemInstruction = null, generationConfig = null, tools = null, toolConfig = null, safetySettings = null, cachedContent = null, history = null } = {}) {
    this.wrapper = wrapper;
    this.model = model || wrapper._defaultModel('chat');
    this.systemInstruction = systemInstruction;
    this.generationConfig = generationConfig;
    this.tools = tools;
    this.toolConfig = toolConfig;
    this.safetySettings = safetySettings;
    this.cachedContent = cachedContent;
    this.history = (history || []).map((content) => wrapper._content(content));
    this.lastResponse = null;
  }

  _body(userContent) {
    return this.wrapper._buildRequest(null, {
      systemInstruction: this.systemInstruction,
      generationConfig: this.generationConfig,
      tools: this.tools,
      toolConfig: this.toolConfig,
      safetySettings: this.safetySettings,
      cachedContent: this.cachedContent,
      history: [...this.history, userContent],
    });
  }

  _userContent(message, media, parts) {
    return { role: 'user', parts: parts || this.wrapper._toParts(message, media) };
  }

  /** Send a user turn and return the full response; the turn and the reply join the history. */
  async send(message = null, media = null, { parts = null } = {}) {
    const userContent = this._userContent(message, media, parts);
    const response = await this.wrapper.generateContent(this._body(userContent), false, this.model);
    this.lastResponse = response;
    const candidate = response.candidates && response.candidates[0];
    const modelContent = candidate && candidate.content;
    // a blocked or empty reply leaves the history unchanged, so it cannot block the next turn
    if (modelContent && Array.isArray(modelContent.parts) && modelContent.parts.length) {
      this.history.push(userContent, { role: 'model', ...modelContent });
    }
    return response;
  }

  /** Send a user turn and return only the reply text. */
  async sendText(message = null, media = null) {
    return GeminiAIWrapper.extractText(await this.send(message, media));
  }

  /** Return one tool result after the model asked for a function call. For several calls use send(null, null, { parts }). */
  async sendFunctionResponse(name, response, callId = null) {
    const functionResponse = { name, response, ...(callId && { id: callId }) };
    return this.send(null, null, { parts: [{ functionResponse }] });
  }

  /** Yield reply text chunks; the turn joins the history when the stream ends. lastResponse keeps the last chunk. */
  async* stream(message = null, media = null) {
    const userContent = this._userContent(message, media, null);
    const parts = [];
    let last = null;
    for await (const chunk of this.wrapper.streamGenerateContent(this._body(userContent), false, this.model)) {
      last = chunk;
      for (const part of GeminiAIWrapper._parts(chunk)) parts.push(part);
      const text = GeminiAIWrapper.extractText(chunk);
      if (text) yield text;
    }
    this.lastResponse = last;
    if (parts.length) this.history.push(userContent, { role: 'model', parts: GoogleAIChatSession._mergeTextParts(parts) });
  }

  static _mergeTextParts(parts) {
    const merged = [];
    for (const part of parts) {
      const plain = Object.keys(part).length === 1 && typeof part.text === 'string';
      const previous = merged[merged.length - 1];
      if (plain && previous && Object.keys(previous).length === 1 && typeof previous.text === 'string') {
        merged[merged.length - 1] = { text: previous.text + part.text };
      } else {
        merged.push({ ...part });
      }
    }
    return merged;
  }

  reset() {
    this.history = [];
    this.lastResponse = null;
  }
}

/** An open Live API session (from wrapper.liveConnect). Close it when done. */
class GoogleAILiveSession {
  constructor(socket) {
    this.socket = socket;
    this.setupResponse = null;
    this._queue = [];
    this._waiters = [];
    this._closed = false;
    this._error = null;
    const onMessage = async (event) => {
      try {
        let raw = event && event.data !== undefined ? event.data : event;
        if (raw && typeof raw !== 'string') {
          raw = typeof raw.text === 'function' ? await raw.text() : toBuffer(raw).toString('utf8');
        }
        this._push(JSON.parse(raw));
      } catch (error) {
        this._fail(error);
      }
    };
    const onClose = () => {
      this._closed = true;
      this._flush();
    };
    const onError = (event) => this._fail(new Error((event && event.message) || 'Live API websocket error'));
    if (typeof socket.addEventListener === 'function') {
      socket.addEventListener('message', onMessage);
      socket.addEventListener('close', onClose);
      socket.addEventListener('error', onError);
    } else {
      socket.on('message', (data) => onMessage({ data }));
      socket.on('close', onClose);
      socket.on('error', onError);
    }
  }

  _opened() {
    const OPEN = 1;
    if (this.socket.readyState === OPEN) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const done = () => resolve();
      const failed = (event) => reject(new Error((event && event.message) || 'could not open the websocket'));
      if (typeof this.socket.addEventListener === 'function') {
        this.socket.addEventListener('open', done, { once: true });
        this.socket.addEventListener('error', failed, { once: true });
      } else {
        this.socket.once('open', done);
        this.socket.once('error', failed);
      }
    });
  }

  _push(message) {
    const waiter = this._waiters.shift();
    if (waiter) waiter.resolve(message);
    else this._queue.push(message);
  }

  _fail(error) {
    this._error = error;
    this._flush();
  }

  _flush() {
    while (this._waiters.length) {
      const waiter = this._waiters.shift();
      if (this._error) waiter.reject(this._error);
      else waiter.resolve(null);
    }
  }

  // The next server message, or null when the socket closed.
  _next() {
    if (this._queue.length) return Promise.resolve(this._queue.shift());
    if (this._error) return Promise.reject(this._error);
    if (this._closed) return Promise.resolve(null);
    return new Promise((resolve, reject) => this._waiters.push({ resolve, reject }));
  }

  /** Send a raw client message. */
  send(message) {
    this.socket.send(JSON.stringify(message));
  }

  sendText(text, turnComplete = true) {
    this.send({ clientContent: { turns: [{ role: 'user', parts: [{ text }] }], turnComplete } });
  }

  /** Stream a chunk of microphone audio (16-bit PCM, 16 kHz by default). */
  sendAudio(data, mimeType = 'audio/pcm;rate=16000') {
    const encoded = typeof data === 'string' ? data : toBuffer(data).toString('base64');
    this.send({ realtimeInput: { audio: { data: encoded, mimeType } } });
  }

  sendAudioStreamEnd() {
    this.send({ realtimeInput: { audioStreamEnd: true } });
  }

  /** functionResponses: [{ id, name, response }]. */
  sendToolResponse(functionResponses) {
    this.send({ toolResponse: { functionResponses } });
  }

  /** Every server message, until the socket closes. */
  async* receive() {
    while (true) {
      const message = await this._next();
      if (message === null) return;
      yield message;
    }
  }

  /** Collect messages until the model finishes its turn or asks for a tool call. */
  async receiveTurn() {
    const result = { text: '', transcription: '', inputTranscription: '', audio: Buffer.alloc(0), audioMimeType: null, toolCalls: [], usage: null, messages: 0 };
    const audioChunks = [];
    let received = false;
    for await (const message of this.receive()) {
      result.messages += 1;
      if (message.usageMetadata) result.usage = message.usageMetadata;
      if (message.toolCall) {
        result.toolCalls.push(...(message.toolCall.functionCalls || []));
        // the turn that asked for the tool still sends its own turnComplete later
        this._skipCompletion = true;
        break;
      }
      const content = message.serverContent || {};
      if (this._skipCompletion && !received && !content.modelTurn && !content.outputTranscription) {
        if (content.turnComplete) this._skipCompletion = false;
        continue;
      }
      received = true;
      this._skipCompletion = false;
      for (const part of (content.modelTurn && content.modelTurn.parts) || []) {
        if (part.text && !part.thought) result.text += part.text;
        if (part.inlineData && part.inlineData.data) {
          audioChunks.push(Buffer.from(part.inlineData.data, 'base64'));
          result.audioMimeType = part.inlineData.mimeType;
        }
      }
      if (content.outputTranscription && content.outputTranscription.text) result.transcription += content.outputTranscription.text;
      if (content.inputTranscription && content.inputTranscription.text) result.inputTranscription += content.inputTranscription.text;
      if (content.turnComplete) break;
    }
    result.audio = Buffer.concat(audioChunks);
    return result;
  }

  close() {
    try {
      this.socket.close();
    } catch (error) {
      // already closed
    }
  }
}

module.exports = GeminiAIWrapper;
module.exports.GeminiAIWrapper = GeminiAIWrapper;
module.exports.GoogleAIError = GoogleAIError;
module.exports.GoogleAIChatSession = GoogleAIChatSession;
module.exports.GoogleAILiveSession = GoogleAILiveSession;

}).call(this)}).call(this,require('_process'),require("buffer").Buffer)
},{"../config.json":1,"../utils/ConnHelper":52,"../utils/FetchClient":53,"../utils/GoogleAuth":23,"../utils/StreamParser":63,"_process":30,"buffer":25,"cross-fetch":26,"fs":24,"path":29}],70:[function(require,module,exports){
(function (Buffer){(function (){
/*
Apache License
*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');
const GeminiAIWrapper = require('./GeminiAIWrapper');
const { GoogleAIError, GoogleAIChatSession, GoogleAILiveSession } = GeminiAIWrapper;

/**
 * One wrapper for Google AI.
 *
 * - Google Cloud APIs with a Cloud API key: Text-to-Speech (generateSpeech), Speech-to-Text, Vision,
 *   Natural Language and Translation.
 * - Gemini on the Gemini Developer API or on Vertex AI / the Gemini Enterprise Agent Platform: every method of
 *   GeminiAIWrapper (text, chat, streaming, tools, grounding, media understanding, image / video / music / speech
 *   generation, embeddings, Files API, caching, Agent Engine, Live API).
 *
 *   new GoogleAIWrapper(CLOUD_API_KEY).generateSpeech({ text, languageCode, name, ssmlGender })   // Cloud TTS
 *   new GoogleAIWrapper(GEMINI_API_KEY).generateText('Hello')                                    // Developer API
 *   new GoogleAIWrapper(VERTEX_API_KEY, { vertex: true }).generateText('Hello')                  // Vertex express
 *
 * `client` stays the Cloud Text-to-Speech client; Gemini calls use `genaiClient`.
 */
class GoogleAIWrapper extends GeminiAIWrapper {
  constructor(apiKey, options = {}) {
    super(apiKey, options);
    this.API_SPEECH_URL = config.url.google.base.replace(
      '{1}',
      config.url.google.speech.prefix
    );
    this.API_KEY = this.API_KEY || apiKey;

    this.client = new FetchClient({
      baseURL: this.API_SPEECH_URL,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...(this.API_KEY && { 'X-Goog-Api-Key': this.API_KEY })
      },
      timeout: options.timeout,
      retries: options.retries,
      retryDelay: options.retryDelay
    });
  }

  // ------------------------------------------------------------------
  // Google Cloud Text-to-Speech
  // ------------------------------------------------------------------

  /** Cloud Text-to-Speech: params { text, languageCode, name, ssmlGender }. Returns { audioContent (base64 MP3) }. */
  async generateSpeech(params) {
    const url = this.API_SPEECH_URL + config.url.google.speech.synthesize.postfix;

    const json = this.getSynthesizeInput(params);
    try {
      return await this.client.post(url, JSON.parse(json));
    } catch (error) {
      throw connHelper.wrapError(error);
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

  /** Cloud Text-to-Speech from SSML. voiceParams { languageCode, name, ssmlGender }. Returns { audioContent }. */
  async generateSpeechWithSSML(ssml, voiceParams, audioConfig = { audioEncoding: 'MP3' }) {
    const url = this.API_SPEECH_URL + config.url.google.speech.synthesize.postfix;
    return this._cloudPost(url, { input: { ssml }, voice: voiceParams, audioConfig });
  }

  // ------------------------------------------------------------------
  // Speech-to-Text, Vision, Natural Language and Translation (Cloud API key)
  // ------------------------------------------------------------------

  _cloudUrl(service, postfix) {
    return config.url.google.base.replace('{1}', config.url.google[service].prefix) + postfix;
  }

  async _cloudPost(url, body) {
    try {
      return await this.client.post(url, body);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  async _cloudGet(url) {
    try {
      return await this.client.get(url);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  static _base64(content) {
    if (typeof content === 'string') return content;
    return Buffer.from(content).toString('base64');
  }

  /**
   * Cloud Speech-to-Text (short audio, up to one minute).
   * @param {Buffer|string} audio - bytes or base64.
   * @param {object} recognitionConfig - default { languageCode: 'en-US', enableAutomaticPunctuation: true }.
   */
  async transcribeAudio(audio, recognitionConfig = null) {
    return this._cloudPost(this._cloudUrl('speechtotext', config.url.google.speechtotext.recognize.postfix), {
      config: recognitionConfig || { languageCode: 'en-US', enableAutomaticPunctuation: true },
      audio: { content: GoogleAIWrapper._base64(audio) },
    });
  }

  /** Cloud Speech-to-Text for long audio in Cloud Storage (gs://); returns the long-running operation. */
  async transcribeAudioLongRunning(audioUri, recognitionConfig = null) {
    return this._cloudPost(this._cloudUrl('speechtotext', config.url.google.speechtotext.longrunning.postfix), {
      config: recognitionConfig || { languageCode: 'en-US', enableAutomaticPunctuation: true, enableWordTimeOffsets: true },
      audio: { uri: audioUri },
    });
  }

  /**
   * Cloud Vision annotate for one image (bytes, base64 or a gs:// / https URI).
   * @param {Array} features - default labels, text, faces and landmarks.
   */
  async analyzeImage(image, features = null) {
    const source = typeof image === 'string' && /^(gs|https?):\/\//i.test(image)
      ? { source: { imageUri: image } }
      : { content: GoogleAIWrapper._base64(image) };
    return this._cloudPost(this._cloudUrl('vision', config.url.google.vision.annotate.postfix), {
      requests: [{
        image: source,
        features: features || [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'TEXT_DETECTION' },
          { type: 'FACE_DETECTION' },
          { type: 'LANDMARK_DETECTION' },
        ],
      }],
    });
  }

  /** OCR with layout (DOCUMENT_TEXT_DETECTION): { text, pages }. */
  async extractDocumentText(image) {
    const result = await this.analyzeImage(image, [{ type: 'DOCUMENT_TEXT_DETECTION' }]);
    const response = (result.responses && result.responses[0]) || {};
    const annotation = response.fullTextAnnotation || {};
    return { text: annotation.text || '', pages: annotation.pages || [] };
  }

  /** Cloud Natural Language: sentiment, entities, syntax and categories of a text (annotateText). */
  async analyzeText(text, features = null) {
    return this._cloudPost(this._cloudUrl('language', config.url.google.language.annotate.postfix), {
      document: { type: 'PLAIN_TEXT', content: text },
      features: features || { extractSyntax: false, extractEntities: true, extractDocumentSentiment: true, classifyText: false },
      encodingType: 'UTF8',
    });
  }

  /** Cloud Natural Language document sentiment. */
  async analyzeSentiment(text) {
    return this._cloudPost(this._cloudUrl('language', config.url.google.language.sentiment.postfix), {
      document: { type: 'PLAIN_TEXT', content: text },
      encodingType: 'UTF8',
    });
  }

  /** Cloud Natural Language content categories. */
  async classifyText(text) {
    return this._cloudPost(this._cloudUrl('language', config.url.google.language.classify.postfix), {
      document: { type: 'PLAIN_TEXT', content: text },
    });
  }

  /** Cloud Translation (Basic): returns { data: { translations: [{ translatedText, detectedSourceLanguage }] } }. */
  async translateText(text, targetLanguage, sourceLanguage = null, format = 'text') {
    return this._cloudPost(config.url.google.translation.base, {
      q: text,
      target: targetLanguage,
      format,
      ...(sourceLanguage && { source: sourceLanguage }),
    });
  }

  /** Cloud Translation (Basic) language detection. */
  async detectLanguage(text) {
    return this._cloudPost(`${config.url.google.translation.base}/detect`, { q: text });
  }

  /** Languages supported by Cloud Translation, with names in targetLanguage. */
  async getSupportedLanguages(targetLanguage = 'en') {
    return this._cloudGet(`${config.url.google.translation.base}/languages?target=${encodeURIComponent(targetLanguage)}`);
  }
}

module.exports = GoogleAIWrapper;
module.exports.GoogleAIWrapper = GoogleAIWrapper;
module.exports.GoogleAIError = GoogleAIError;
module.exports.GoogleAIChatSession = GoogleAIChatSession;
module.exports.GoogleAILiveSession = GoogleAILiveSession;

}).call(this)}).call(this,require("buffer").Buffer)
},{"../config.json":1,"../utils/ConnHelper":52,"../utils/FetchClient":53,"./GeminiAIWrapper":69,"buffer":25}],71:[function(require,module,exports){
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
      throw connHelper.wrapError(error);
    }
  }

  async generateImage(modelId, data) {
    const endpoint = `/${modelId}`;
    try {
      // We need arraybuffer to get raw image data
      return await this.client.post(endpoint, data, { responseType: 'arraybuffer' });
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  async processImage(modelId, data) {
    const endpoint = `/${modelId}`;
    try {
      const arrayBuf = await this.client.post(endpoint, data, { responseType: 'arraybuffer' });
      return JSON.parse(Buffer.from(arrayBuf).toString());
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }
}

module.exports = HuggingWrapper;

}).call(this)}).call(this,require("buffer").Buffer)
},{"../config.json":1,"../utils/ConnHelper":52,"../utils/FetchClient":53,"buffer":25}],72:[function(require,module,exports){
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
      throw connHelper.wrapError(error);
    }
  }
}

module.exports = IntellicloudWrapper;

},{"../config.json":1,"../utils/ConnHelper":52,"../utils/FetchClient":53,"form-data":27}],73:[function(require,module,exports){
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
      const extraConfig = params.stream ? { responseType: 'stream' } : {};
      return await this.client.post(endpoint, params, extraConfig);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  async getEmbeddings(params) {
    const endpoint = config.url.mistral.embed;
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }
}

module.exports = MistralAIWrapper;

},{"../config.json":1,"../utils/ConnHelper":52,"../utils/FetchClient":53}],74:[function(require,module,exports){
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
      throw connHelper.wrapError(error);
    }
  }

  async generateTextStream(params) {
    params.stream = true;
    try {
      return await this.client.post(this.ENDPOINT_CHAT, params, {
        responseType: 'stream'
      });
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  /**
   * Generates embeddings using NVIDIA's OpenAI-compatible /v1/embeddings endpoint
   * (the older /v1/retrieval/{model}/embeddings route no longer exists).
   *
   * @param {object} params - Must include `model`, e.g. nvidia/llama-3.2-nv-embedqa-1b-v1.
   */
  async generateRetrieval(params) {
    if (!params.model) {
      throw new Error("Missing 'model' parameter for embeddings");
    }
    try {
      return await this.client.post(config.nvidia.embeddings, params);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  async getEmbeddings(params) {
    return this.generateRetrieval(params);
  }
}

module.exports = NvidiaWrapper;

},{"../config.json":1,"../utils/ConnHelper":52,"../utils/FetchClient":53}],75:[function(require,module,exports){
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

const compatible = config.url.openai_compatible;

/**
 * One wrapper for every service that speaks the OpenAI chat-completions API: OpenRouter, Groq, DeepSeek, xAI,
 * Together, Ollama, LM Studio, vLLM servers and any other base URL.
 *
 * new OpenAICompatibleWrapper(apiKey, { preset: 'openrouter' })
 * new OpenAICompatibleWrapper(apiKey, { baseUrl: 'https://host/v1', headers: { 'X-Title': 'My app' } })
 */
class OpenAICompatibleWrapper {
  constructor(apiKey, options = {}) {
    const preset = options.preset ? OpenAICompatibleWrapper.getPreset(options.preset) : null;
    const baseUrl = options.baseUrl || (preset && preset.base);
    if (!baseUrl) {
      throw new Error(`OpenAICompatibleWrapper needs a baseUrl or one of the presets: ${Object.keys(compatible.presets).join(', ')}`);
    }
    this.preset = options.preset || null;
    this.API_BASE_URL = String(baseUrl).replace(/\/+$/, '');
    this.API_KEY = apiKey;
    this.defaultModel = options.model || (preset && preset.chat_model) || null;
    this.defaultEmbedModel = (preset && preset.embed_model) || null;
    // 'json_object' for services that reject json_schema response formats
    this.structuredOutput = options.structuredOutput || (preset && preset.structured_output) || 'json_schema';

    const headers = { 'Content-Type': 'application/json', Accept: 'application/json', ...(options.headers || {}) };
    // local runtimes ignore the key; a placeholder keeps proxies that require the header happy
    const key = apiKey || (preset && preset.local ? 'not-needed' : null);
    if (key) headers.Authorization = `Bearer ${key}`;

    this.client = new FetchClient({ baseURL: this.API_BASE_URL, headers });
  }

  static getPreset(name) {
    const preset = compatible.presets[name];
    if (!preset) {
      throw new Error(`Unknown OpenAI-compatible preset '${name}'. Use one of: ${Object.keys(compatible.presets).join(', ')}`);
    }
    return preset;
  }

  static presets() {
    return Object.keys(compatible.presets);
  }

  // Fill in the preset's default model; a preset without one needs the model in the request.
  withModel(params) {
    if (params.model) return params;
    if (!this.defaultModel) {
      const hint = this.preset ? `Call listModels() to see the models available on ${this.preset}.` : 'Call listModels() to see the available models.';
      throw new Error(`No model set for the OpenAI-compatible request. Pass a model name. ${hint}`);
    }
    return { ...params, model: this.defaultModel };
  }

  // Services without json_schema support get json_object, with the schema added to the system message.
  adaptResponseFormat(params) {
    const format = params.response_format;
    if (!format || format.type !== 'json_schema' || this.structuredOutput !== 'json_object') return params;
    const schema = format.json_schema ? format.json_schema.schema : format.schema;
    const instruction = `Respond with JSON only, matching this JSON Schema: ${JSON.stringify(schema)}`;
    const messages = Array.isArray(params.messages) ? params.messages.slice() : [];
    const systemIndex = messages.findIndex((message) => message.role === 'system' && typeof message.content === 'string');
    if (systemIndex >= 0) {
      messages[systemIndex] = { ...messages[systemIndex], content: `${messages[systemIndex].content}\n${instruction}` };
    } else {
      messages.unshift({ role: 'system', content: instruction });
    }
    return { ...params, messages, response_format: { type: 'json_object' } };
  }

  async generateChatText(params) {
    try {
      const payload = this.adaptResponseFormat(this.withModel(params));
      const extraConfig = payload.stream ? { responseType: 'stream' } : {};
      return await this.client.post(compatible.chat, payload, extraConfig);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  async getEmbeddings(params) {
    try {
      const payload = params.model || !this.defaultEmbedModel ? params : { ...params, model: this.defaultEmbedModel };
      if (!payload.model) throw new Error('No embedding model set. Pass a model name in the request.');
      return await this.client.post(compatible.embeddings, payload);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  /** The model ids served by the endpoint (GET /models). */
  async listModels() {
    try {
      const response = await this.client.get(compatible.models);
      return (response.data || []).map((model) => model.id);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }
}

module.exports = OpenAICompatibleWrapper;

},{"../config.json":1,"../utils/ConnHelper":52,"../utils/FetchClient":53}],76:[function(require,module,exports){
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
      throw connHelper.wrapError(error);
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
      throw connHelper.wrapError(error);
    }
  }

  async generateImages(params) {
    const endpoint = this.proxyHelper.getOpenaiImage();
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw connHelper.wrapError(error);
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
      throw connHelper.wrapError(error);
    }
  }

  async storeFineTuningData(params) {
    const endpoint = this.proxyHelper.getOpenaiFineTuningJob();
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw connHelper.wrapError(error);
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
      throw connHelper.wrapError(error);
    }
  }

  async getEmbeddings(params) {
    const endpoint = this.proxyHelper.getOpenaiEmbed(params.model);
    try {
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  async speechToText(params, headers) {
    const endpoint = this.proxyHelper.getOpenaiAudioTranscriptions();
    try {
      return await this.client.post(endpoint, params, { headers });
    } catch (error) {
      throw connHelper.wrapError(error);
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
      throw connHelper.wrapError(error);
    }
  }

  async imageToText(params, headers) {
    const endpoint = this.proxyHelper.getOpenaiChat(params.model);
    try {
      return await this.client.post(endpoint, params, { headers });
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  async generateChatAudio(params) {
    
    const endpoint = this.proxyHelper.getOpenaiChat(params.model);
  
    try {
      // "params" should include { model, modalities, audio, messages, etc. }
      return await this.client.post(endpoint, params);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  async generateGPT5Response(params) {
    const endpoint = this.proxyHelper.getOpenaiResponses(params.model);

    try {
      const extraConfig = params.stream ? { responseType: 'stream' } : {};
      return await this.client.post(endpoint, params, extraConfig);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  // Responses API (/v1/responses) used by gpt-5 and newer models.
  async generateResponse(params) {
    return this.generateGPT5Response(params);
  }
}

module.exports = OpenAIWrapper;

},{"../utils/ConnHelper":52,"../utils/FetchClient":53,"../utils/ProxyHelper":62}],77:[function(require,module,exports){
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
      throw connHelper.wrapError(error);
    }
  }

  async getPredictionStatus(predictionId) {
    const endpoint = `/v1/predictions/${predictionId}`;
    try {
      // GET request
      return await this.client.get(endpoint);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }
}

module.exports = ReplicateWrapper;

},{"../config.json":1,"../utils/ConnHelper":52,"../utils/FetchClient":53}],78:[function(require,module,exports){
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
          // v1 text-to-image: engine selects the endpoint and is not a request body field
          const { engine, model, ...body } = inputs;
          return await this.generateTextToImage(body, engine || undefined);
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
            throw connHelper.wrapError(error);
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
            throw connHelper.wrapError(error);
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
            throw connHelper.wrapError(error);
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
            throw connHelper.wrapError(error);
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
            throw connHelper.wrapError(error);
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
            throw connHelper.wrapError(error);
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
            throw connHelper.wrapError(error);
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
            throw connHelper.wrapError(error);
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
      throw connHelper.wrapError(error);
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
      throw connHelper.wrapError(error);
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
      throw connHelper.wrapError(error);
    }
  }
}

module.exports = StabilityAIWrapper;
},{"../config.json":1,"../utils/ConnHelper":52,"../utils/FetchClient":53,"form-data":27,"fs":24}],79:[function(require,module,exports){
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
      const extraConfig = params.stream ? { responseType: 'stream' } : {};
      return await this.client.post(endpoint, params, extraConfig);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  async generateChatText(params) {
    const endpoint = '/v1/chat/completions';
    try {
      const extraConfig = params.stream ? { responseType: 'stream' } : {};
      return await this.client.post(endpoint, params, extraConfig);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  async getEmbeddings(texts) {
    const endpoint = '/embed';
    try {
      return await this.client.post(endpoint, { texts });
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }
}

module.exports = VLLMWrapper;
},{"../utils/ConnHelper":52,"../utils/FetchClient":53}]},{},[13])(13)
});
