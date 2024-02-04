/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0
*/
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');

class StabilityAIWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.url.stability.base;
    this.API_KEY = apiKey;
    this.httpClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
      },
    });
  }

  async generateTextToImage(
    params,
    engine = 'stable-diffusion-xl-1024-v1-0'
  ) {
    const url = config.url.stability.text_to_image.replace(
      '{1}',
      engine
    );
    try {
      const response = await this.httpClient.post(url, params, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async upscaleImage(
    imagePath,
    width,
    height,
    engine = 'esrgan-v1-x2plus'
  ) {
    const url = config.url.stability.upscale.replace('{1}', engine);
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    formData.append('width', width);
    formData.append('height', height);

    try {
      const response = await this.httpClient.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
          Accept: 'image/png',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  /**
   * Generates an image based on the provided text prompts and initial image.
   *
   * @param {object} params - The parameters for the image-to-image generation.
   * @param {Array<{text: string, weight?: number}>} params.text_prompts - an array of text prompts to use for generation.
   * @param {string} params.imagePath - the path to the initial image file.
   * @param {string} [params.init_image_mode="IMAGE_STRENGTH"] - whether to use image_strength or step_schedule_* to control how much influence the init_image has on the result.
   * @param {number} [params.image_strength=0.35] - how much influence the init_image has on the diffusion process. Values close to 1 will yield images very similar to the init_image, while values close to 0 will yield images wildly different than the init_image.
   * @param {number} [params.cfg_scale=7] - how strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt).
   * @param {string} [params.sampler] - which sampler to use for the diffusion process. If this value is omitted, an appropriate sampler will be automatically selected.
   * @param {number} [params.samples=1] - number of images to generate.
   * @param {number} [params.seed=0] - random noise seed.
   * @param {number} [params.steps=50] - number of diffusion steps to run.
   * @param {string} [params.style_preset] - pass in a style preset to guide the image model towards a particular style.
   * @param {string} [engine="stable-diffusion-xl-1024-v1-0"] - the engine to use for image-to-image generation. Defaults to "stable-diffusion-xl-beta-v2-2-2".
   * @returns {Promise<object>} the generated image data.
   * @throws {Error} if there is an error during the request.
   */
  async generateImageToImage(
    params,
    engine = 'stable-diffusion-xl-1024-v1-0'
  ) {
    const url = config.url.stability.image_to_image.replace(
      '{1}',
      engine
    );
    const formData = new FormData();
    params.text_prompts.forEach((prompt, index) => {
      formData.append(`text_prompts[${index}][text]`, prompt.text);
      formData.append(
        `text_prompts[${index}][weight]`,
        prompt.weight
      );
    });
    formData.append('init_image', fs.readFileSync(params.imagePath), {
      filename: params.imagePath.split('/').pop(),
      contentType: 'image/png',
    });
    Object.keys(params).forEach((key) => {
      if (
        key !== 'text_prompts' &&
        key !== 'init_image' &&
        key !== 'imagePath'
      ) {
        formData.append(key, params[key]);
      }
    });

    try {
      const response = await this.httpClient.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = StabilityAIWrapper;
