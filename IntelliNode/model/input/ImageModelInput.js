class ImageModelInput {
  constructor({
    prompt,
    numberOfImages = 1,
    imageSize = null,
    responseFormat= null,
  }) {
    this.prompt = prompt;
    this.numberOfImages = numberOfImages;
    this.imageSize = imageSize;
    this.responseFormat = responseFormat
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

  setDefaultValues(provider) {
    if (provider === "openai") {
      this.numberOfImages = 1;
      this.imageSize = '1024x1024';
    } else {
      throw new Error("Invalid provider name");
    }
  }
}

module.exports = ImageModelInput;