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

  async upscaleImage(imagePath, width, engine = "esrgan-v1-x2plus") {
    const url = config.getProperty("url.stability.upscale").replace("{1}", engine);
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));
    formData.append("width", width);

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
}

module.exports = StabilityAIWrapper;