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
        headers: { 'Content-Type': 'application/json' }
      });
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
      // We want an image (arraybuffer)
      return await this.client.post(endpoint, formData, {
        responseType: 'arraybuffer'
      });
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
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
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  /**
   * ===============
   *  V2beta approach (optional)
   * ===============
   *
   * 
   * Example: /v2beta/stable-image/generate/ultra
   */
  async generateStableImageV2Beta({
    model = 'ultra',         // or 'core', 'sd3', etc.
    prompt,
    output_format = 'png',   // or 'webp', 'jpeg'
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
        headers: { Accept: accept },
      });
      return resp;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = StabilityAIWrapper;