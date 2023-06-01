const { RemoteLanguageModel } = require("../controller/RemoteLanguageModel");
const { RemoteImageModel, SupportedImageModels } = require("../controller/RemoteImageModel");
const { RemoteSpeechModel } = require("../controller/RemoteSpeechModel");
const { LanguageModelInput } = require("../model/input/LanguageModelInput");
const ImageModelInput = require("../model/input/ImageModelInput");
const Text2SpeechInput = require("../model/input/Text2SpeechInput");
const { Chatbot, SupportedChatModels } = require("../function/Chatbot");
const { ChatGPTInput, ChatGPTMessage } = require("../model/input/ChatModelInput");
const SystemHelper = require("../utils/SystemHelper");
const fs = require('fs');
const path = require('path');

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

  static async generate_html_page(text, openaiKey, model_name='gpt-4') {
    // load and fill the template
    const promptTemplate = new SystemHelper().loadPrompt("html_page");
    const prompt = promptTemplate.replace("${text}", text);

    // prepare the bot
    const chatbot = new Chatbot(openaiKey);
    const input = new ChatGPTInput('generate only html, css and javascript based on the user request in the following format {"html": "<code>", "message":"<text>"}',
                                   { maxTokens: 2000, model: model_name });
    // set the user message with the template
    input.addUserMessage(prompt);
    const responses = await chatbot.chat(input);
    return JSON.parse(responses[0].trim());
  }

  static async save_html_page(text, folder, file_name, openaiKey, model_name='gpt-4') {
    const htmlCode = await Gen.generate_html_page(text, openaiKey, model_name=model_name);
    const folderPath = path.join(folder, file_name + '.html');
    fs.writeFileSync(folderPath, htmlCode['html']);
    return true;
  }


  static async generate_dashboard(csv_str_data, topic, openaiKey, model_name='gpt-4', num_graphs=1) {

    if (num_graphs < 1 || num_graphs > 4) {
        throw new Error('num_graphs should be between 1 and 4 (inclusive)');
    }

    // load and fill the template
    const promptTemplate = new SystemHelper().loadPrompt("graph_dashboard");

    let prompt = promptTemplate.replace("${count}", num_graphs);
    prompt = prompt.replace("${topic}", topic);
    prompt = prompt.replace("${text}", csv_str_data);

    // prepare the bot
    const chatbot = new Chatbot(openaiKey);
    const input = new ChatGPTInput('generate html graphs from csv data following the Output template as validate json',
                                   { maxTokens: 2200, model: model_name });
    // set the user message with the template
    input.addUserMessage(prompt);
    const responses = await chatbot.chat(input);

    return JSON.parse(responses[0].trim());
  }

}

module.exports = { Gen };