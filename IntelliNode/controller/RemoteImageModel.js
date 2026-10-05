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