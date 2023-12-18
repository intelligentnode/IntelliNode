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