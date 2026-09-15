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
        this.geminiWrapper = new GeminiAIWrapper(keyValue);
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