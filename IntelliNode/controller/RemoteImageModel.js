const OpenAIWrapper = require('../wrappers/OpenAIWrapper');
const ImageModelInput = require('../model/input/ImageModelInput');

const SupportedImageModels = {
  OPENAI: 'openai',
};

class RemoteImageModel {
  constructor(keyValue, provider) {
    if (!provider) {
      provider = SupportedImageModels.OPENAI;
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

    if (keyType === SupportedImageModels.OPENAI) {
      this.openaiWrapper = new OpenAIWrapper(keyValue);
    } else {
      throw new Error('Invalid provider name');
    }
  }

  getSupportedModels() {
    return Object.values(SupportedImageModels);
  }

  async generateImages(imageInput) {
    let inputs;

    if (imageInput instanceof ImageModelInput) {
      inputs = imageInput.getOpenAIInputs();
    } else if (typeof imageInput === 'object') {
      inputs = imageInput;
    } else {
      throw new Error('Invalid input: Must be an instance of ImageModelInput or a dictionary');
    }

    if (this.keyType === SupportedImageModels.OPENAI) {
      const results = await this.openaiWrapper.generateImages(inputs);
      return results.data.map((data) => data.url);
    } else {
      throw new Error(`This version supports ${SupportedImageModels.OPENAI} keyType only`);
    }
  }
}

module.exports = {
  RemoteImageModel,
  SupportedImageModels,
};