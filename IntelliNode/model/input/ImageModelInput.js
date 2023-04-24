/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
class ImageModelInput {
  constructor({
    prompt,
    numberOfImages = 1,
    imageSize = null,
    responseFormat = null,
    height = null,
    width = null,
    diffusion_cfgScale = null,
    diffusion_style_preset = null
  }) {
    this.prompt = prompt;
    this.numberOfImages = numberOfImages;
    this.imageSize = imageSize;
    this.responseFormat = responseFormat;
    this.height = height;
    this.width = width;
    this.diffusion_cfgScale = diffusion_cfgScale;
    this.diffusion_style_preset = diffusion_style_preset;
  }

  getOpenAIInputs() {
    const inputs = {
      prompt: this.prompt,
      ...this.numberOfImages && { n: this.numberOfImages },
      ...this.imageSize && { size: this.imageSize },
      ...this.responseFormat && { response_format: this.responseFormat },
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
      ...this.diffusion_style_preset && {style_preset: this.diffusion_style_preset}
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
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = ImageModelInput;