const { RemoteLanguageModel } = require("../controller/RemoteLanguageModel");
const { RemoteImageModel, SupportedImageModels } = require("../controller/RemoteImageModel");
const { RemoteSpeechModel } = require("../controller/RemoteSpeechModel");
const { LanguageModelInput } = require("../model/input/LanguageModelInput");
const ImageModelInput = require("../model/input/ImageModelInput");
const Text2SpeechInput = require("../model/input/Text2SpeechInput");
const { Chatbot, SupportedChatModels } = require("../function/Chatbot");
const { ChatGPTInput, ChatGPTMessage } = require("../model/input/ChatModelInput");


class Gen {
  static async get_marketing_desc(prompt, openaiKey) {
    const chatbot = new Chatbot(openaiKey);
    const input = new ChatGPTInput("generate marketing description", { maxTokens: 800 });
    input.addUserMessage(`Create a marketing description for the following: ${prompt}`);
    const responses = await chatbot.chat(input);
    return responses[0].trim();
  }

  static async get_blog_post(prompt, openaiKey) {
    const chatbot = new Chatbot(openaiKey);
    const input = new ChatGPTInput("generate blog posts related to user input", { maxTokens: 800 });
    input.addUserMessage(`Write a blog post about ${prompt}`);
    const responses = await chatbot.chat(input);
    return responses[0].trim();
  }

  static async getImageDescription(prompt, apiKey) {
    const chatbot = new Chatbot(apiKey);
    const input = new ChatGPTInput("Generate image description to use for image generation models. return only the image description");
    input.addUserMessage(`Generate image description from the following text: ${prompt}`);
    const responses = await chatbot.chat(input);
    return responses[0].trim();
  }

  static async generate_image_from_desc(prompt, openaiKey, stabilityKey, is_base64 = true) {
    const imageDescription = await Gen.getImageDescription(prompt, openaiKey);
    const imgModel = new RemoteImageModel(stabilityKey, SupportedImageModels.STABILITY);
    const images = await imgModel.generateImages(
      new ImageModelInput({ prompt: imageDescription, numberOfImages: 1, width: 512, height: 512 })
    );

    if (is_base64) {
      return images[0];
    } else {
      return Buffer.from(images[0], "base64");
    }
  }

  static async generate_speech_synthesis(text, googleKey) {
    const speechModel = new RemoteSpeechModel(googleKey, "google");
    const input = new Text2SpeechInput({ text: text, language: "en-gb" });
    const audioContent = await speechModel.generateSpeech(input);
    return audioContent;
  }
}

module.exports = { Gen };