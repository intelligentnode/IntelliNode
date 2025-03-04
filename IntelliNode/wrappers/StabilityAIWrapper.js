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

        this.V2_BETA_MODELS = ["core", "ultra", "sd3", "sd3-large", "sd3-large-turbo", "sd3-medium"];
    }

    async generateImageDispatcher(inputs) {
        // If user sets inputs.model to something in V2_BETA_MODELS, we do v2.
        const modelName = inputs.model || "";
        const isV2Beta = this.V2_BETA_MODELS.includes(modelName);
    
        if (isV2Beta) {
          
          const v2Resp = await this.generateStableImageV2Beta(inputs);
          // 2) Convert v2 response => same shape as v1 => { artifacts: [ { base64: ... }, ... ] }
          return {
            artifacts: [
              {
                base64: v2Resp.image // v2 returns { image, seed, finish_reason }
              }
            ]
          };
        } else {
          // old v1 approach
          return await this.generateTextToImage(inputs);
        }
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
                headers: {
                    'Content-Type': 'application/json'
                }
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
     *  V2beta approach
     * ===============
     *
     * Example: /v2beta/stable-image/generate/ultra
     */
    async generateStableImageV2Beta({
        model = 'ultra', // or 'core', 'sd3', etc.
        prompt,
        output_format = 'png', // or 'webp', 'jpeg'
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
                headers: {
                    Accept: accept
                },
            });
            return resp;
        } catch (error) {
            throw new Error(connHelper.getErrorMessage(error));
        }
    }
    async inpaintImage({
        imagePath,
        maskPath,
        prompt,
        output_format = "png",
        accept = "application/json"
    }) {
        // v2beta: /v2beta/stable-image/edit/inpaint
        const endpoint = config.url.stability.inpaint;

        const formData = new FormData();
        formData.append("image", fs.createReadStream(imagePath));
        formData.append("mask", fs.createReadStream(maskPath));
        formData.append("prompt", prompt);
        formData.append("output_format", output_format);

        try {
            const response = await this.client.post(endpoint, formData, {
                headers: {
                    Accept: accept
                }
            });
            return response; // if accept=application/json => { image, seed, finish_reason }
        } catch (error) {
            throw new Error(connHelper.getErrorMessage(error));
        }
    }

    async outpaintImage({
        imagePath,
        prompt,
        output_format = "png",
        left = 0,
        right = 0,
        top = 0,
        bottom = 0,
        accept = "application/json"
    }) {
        // v2beta: /v2beta/stable-image/edit/outpaint
        const endpoint = config.url.stability.outpaint;

        const formData = new FormData();
        formData.append("image", fs.createReadStream(imagePath));
        if (left) formData.append("left", left);
        if (right) formData.append("right", right);
        if (top) formData.append("top", top);
        if (bottom) formData.append("bottom", bottom);
        formData.append("prompt", prompt);
        formData.append("output_format", output_format);

        try {
            const response = await this.client.post(endpoint, formData, {
                headers: {
                    Accept: accept
                }
            });
            return response;
        } catch (error) {
            throw new Error(connHelper.getErrorMessage(error));
        }
    }

    async imageToVideo({
        imagePath,
        seed = 0,
        cfg_scale = 1.8,
        motion_bucket_id = 127,
        accept = "application/json"
    }) {
        // Step 1: Start generation
        const endpoint = config.url.stability.image_to_video;

        const formData = new FormData();
        formData.append("image", fs.createReadStream(imagePath));
        formData.append("seed", seed);
        formData.append("cfg_scale", cfg_scale);
        formData.append("motion_bucket_id", motion_bucket_id);

        try {
            const startResp = await this.client.post(endpoint, formData, {
                headers: {
                    Accept: accept
                }
            });

            return startResp;
        } catch (error) {
            throw new Error(connHelper.getErrorMessage(error));
        }
    }

    async fetchVideoResult(generation_id, accept = "video/*") {
        
        
        const endpoint = `${config.url.stability.fetch_video}${generation_id}`;

        try {
            const response = await this.client.get(endpoint, {
                headers: {
                    Accept: accept
                },
                responseType: "arraybuffer"
            });
            // If it's 200 => raw bytes
            // If it's 202 => you need to re-check. 
            return response;
        } catch (error) {
            throw new Error(connHelper.getErrorMessage(error));
        }
    }

    /**
   * Control: Sketch
   * POST /v2beta/stable-image/control/sketch
   *
   * Required: image, prompt
   * Optional: control_strength, negative_prompt, seed, output_format, style_preset
   */
  async controlSketch({
    imagePath,
    prompt,
    control_strength,
    negative_prompt,
    seed,
    output_format,
    style_preset,
    accept = 'image/*' // or 'application/json'
  }) {
    const endpoint = config.url.stability.control_sketch;
    const formData = new FormData();

    // Required
    if (typeof imagePath === 'string') {
        // Node usage
        const fs = require('fs');
        formData.append('image', fs.createReadStream(imagePath));
    } else {
        // Browser usage - assume it's a File or Blob
        formData.append('image', imagePath);
    }
    formData.append('prompt', prompt);

    // Optional
    if (control_strength !== undefined) formData.append('control_strength', control_strength);
    if (negative_prompt) formData.append('negative_prompt', negative_prompt);
    if (seed !== undefined) formData.append('seed', seed);
    if (output_format) formData.append('output_format', output_format);
    if (style_preset) formData.append('style_preset', style_preset);

    try {
      // If accept is image/*, we want the raw image (arraybuffer).
      // If accept is application/json, we get a base64 JSON.
      const response = await this.client.post(endpoint, formData, {
        headers: { Accept: accept },
        responseType: accept.startsWith('image/') ? 'arraybuffer' : undefined
      });
      return response;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  /**
   * Control: Structure
   * POST /v2beta/stable-image/control/structure
   *
   * Required: image, prompt
   * Optional: control_strength, negative_prompt, seed, output_format, style_preset
   */
  async controlStructure({
    imagePath,
    prompt,
    control_strength,
    negative_prompt,
    seed,
    output_format,
    style_preset,
    accept = 'image/*'
  }) {
    const endpoint = config.url.stability.control_structure;
    const formData = new FormData();

    // Required
    if (typeof imagePath === 'string') {
        // Node usage
        const fs = require('fs');
        formData.append('image', fs.createReadStream(imagePath));
    } else {
        // Browser usage - assume it's a File or Blob
        formData.append('image', imagePath);
    }
    formData.append('prompt', prompt);

    // Optional
    if (control_strength !== undefined) formData.append('control_strength', control_strength);
    if (negative_prompt) formData.append('negative_prompt', negative_prompt);
    if (seed !== undefined) formData.append('seed', seed);
    if (output_format) formData.append('output_format', output_format);
    if (style_preset) formData.append('style_preset', style_preset);

    try {
      const response = await this.client.post(endpoint, formData, {
        headers: { Accept: accept },
        responseType: accept.startsWith('image/') ? 'arraybuffer' : undefined
      });
      return response;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  /**
   * Control: Style
   * POST /v2beta/stable-image/control/style
   *
   * Required: image, prompt
   * Optional: negative_prompt, aspect_ratio, fidelity, seed, output_format, style_preset
   */
  async controlStyle({
    imagePath,
    prompt,
    negative_prompt,
    aspect_ratio,
    fidelity,
    seed,
    output_format,
    style_preset,
    accept = 'image/*'
  }) {
    const endpoint = '/v2beta/stable-image/control/style';
    const formData = new FormData();

    // Required
    if (typeof imagePath === 'string') {
        // Node usage
        const fs = require('fs');
        formData.append('image', fs.createReadStream(imagePath));
    } else {
        // Browser usage - assume it's a File or Blob
        formData.append('image', imagePath);
    }
    formData.append('prompt', prompt);

    // Optional
    if (negative_prompt) formData.append('negative_prompt', negative_prompt);
    if (aspect_ratio) formData.append('aspect_ratio', aspect_ratio);
    if (fidelity !== undefined) formData.append('fidelity', fidelity);
    if (seed !== undefined) formData.append('seed', seed);
    if (output_format) formData.append('output_format', output_format);
    if (style_preset) formData.append('style_preset', style_preset);

    try {
      const response = await this.client.post(endpoint, formData, {
        headers: { Accept: accept },
        responseType: accept.startsWith('image/') ? 'arraybuffer' : undefined
      });
      return response;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = StabilityAIWrapper;