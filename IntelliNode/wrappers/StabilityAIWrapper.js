/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0
*/
const FormData = require('form-data');
const fs = require('fs');
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');

class StabilityAIWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.stability.base;
    this.API_KEY = apiKey;

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        Authorization: `Bearer ${this.API_KEY}`
      }
    });
  }

  async generateTextToImage(params, engine = 'stable-diffusion-xl-1024-v1-0') {
    const endpoint = config.url.stability.text_to_image.replace('{1}', engine);
    try {
      return await this.client.post(endpoint, params);
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
      // We want an image (arraybuffer) in return
      return await this.client.post(endpoint, formData, {
        responseType: 'arraybuffer'
      });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  /**
   * Generates an image based on the provided text prompts and initial image.
   */
  async generateImageToImage(params, engine = 'stable-diffusion-xl-1024-v1-0') {
    const endpoint = config.url.stability.image_to_image.replace('{1}', engine);

    const formData = new FormData();
    params.text_prompts.forEach((prompt, index) => {
      formData.append(`text_prompts[${index}][text]`, prompt.text);
      formData.append(`text_prompts[${index}][weight]`, prompt.weight);
    });
    formData.append('init_image', fs.readFileSync(params.imagePath), {
      filename: params.imagePath.split('/').pop(),
      contentType: 'image/png'
    });

    // Add the other params
    Object.keys(params).forEach((key) => {
      if (key !== 'text_prompts' && key !== 'init_image' && key !== 'imagePath') {
        formData.append(key, params[key]);
      }
    });

    try {
      return await this.client.post(endpoint, formData);
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = StabilityAIWrapper;

