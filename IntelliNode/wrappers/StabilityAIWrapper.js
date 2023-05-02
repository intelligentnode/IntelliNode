/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0
*/
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const config = require("../utils/Config2").getInstance();
const connHelper = require("../utils/ConnHelper");

class StabilityAIWrapper {
  constructor(apiKey) {
    this.API_BASE_URL = config.getProperty("url.stability.base");
    this.API_KEY = apiKey;
    this.httpClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
      },
    });
  }

  async generateTextToImage(params, engine = "stable-diffusion-xl-beta-v2-2-2") {
    const url = config.getProperty("url.stability.text_to_image").replace("{1}", engine);
    try {
      const response = await this.httpClient.post(url, params, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async upscaleImage(imagePath, width, height, engine = "esrgan-v1-x2plus") {
    const url = config.getProperty("url.stability.upscale").replace("{1}", engine);
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));
    formData.append("width", width);
    formData.append("height", height);

    try {
      const response = await this.httpClient.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
          Accept: "image/png",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }

  async generateImageToImage(params, engine = "stable-diffusion-xl-beta-v2-2-2") {
    const url = config
      .getProperty("url.stability.image_to_image")
      .replace("{1}", engine);
    const formData = new FormData();
    formData.append("text_prompts", JSON.stringify(params.text_prompts));
    formData.append("init_image", fs.readFileSync(params.imagePath), {
      filename: params.imagePath.split('/').pop(),
      contentType: "image/png",
    });
    Object.keys(params).forEach((key) => {
      if (key !== "text_prompts" && key !== "init_image" && key !== "imagePath") {
        formData.append(key, params[key]);
      }
    });

    try {
      const response = await this.httpClient.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(connHelper.getErrorMessage(error));
    }
  }
}

module.exports = StabilityAIWrapper;