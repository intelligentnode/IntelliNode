const OpenAIWrapper = require('../wrappers/OpenAIWrapper');
const CohereAIWrapper = require('../wrappers/CohereAIWrapper');
const ReplicateWrapper = require('../wrappers/ReplicateWrapper');
const EmbedInput = require('../model/input/EmbedInput');

const SupportedEmbedModels = {
  OPENAI: 'openai',
  COHERE: 'cohere',
  REPLICATE: 'replicate',
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

    } if (this.keyType === SupportedEmbedModels.REPLICATE) {

      const prediction = await this.replicateWrapper.predict('replicate', inputs);
      
      // Return a Promise that resolves with unified embedding result
      return new Promise((resolve, reject) => {
        const poll = setInterval(async () => {
          try {
            const status = await this.replicateWrapper.getPredictionStatus(prediction.id);
            if (status.status === 'succeeded' || status.status === 'failed') {
              clearInterval(poll); // Stop polling
              if (status.status === 'succeeded') {
                resolve(status.output);
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
    } else {
      throw new Error('The keyType is not supported');
    }
  }
}

module.exports = {
  RemoteEmbedModel,
  SupportedEmbedModels,
};