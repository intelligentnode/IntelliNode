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
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = ImageModelInput;
