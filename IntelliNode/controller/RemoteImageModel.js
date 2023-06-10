/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
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
      
      const results = await this.stabilityWrapper.generateTextToImage(inputs);

      /*console.log('results: ', results);*/
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