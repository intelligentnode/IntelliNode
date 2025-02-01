// Gen.js
const { RemoteLanguageModel } = require("../controller/RemoteLanguageModel");
const { RemoteImageModel, SupportedImageModels } = require("../controller/RemoteImageModel");
const { RemoteSpeechModel } = require("../controller/RemoteSpeechModel");
const LanguageModelInput = require("../model/input/LanguageModelInput");
const ImageModelInput = require("../model/input/ImageModelInput");
const Text2SpeechInput = require("../model/input/Text2SpeechInput");
const { Chatbot, SupportedChatModels } = require("../function/Chatbot");
const { ChatGPTInput, ChatGPTMessage, NvidiaInput } = require("../model/input/ChatModelInput");
const { SupportedLangModels } = require('../controller/RemoteLanguageModel');
const SystemHelper = require("../utils/SystemHelper");
const Prompt = require("../utils/Prompt");
const FileHelper = require("../utils/FileHelper");
const path = require('path');

function stripThinking(text) {
  /** emove any <think>...</think> block from NVIDIA responses. */
  return text.replace(/<think>[\s\S]*?<\/think>/, '').trim();
}

class Gen {
  // Marketing description generation
  static async get_marketing_desc(promptString, apiKey, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    if (provider === SupportedLangModels.OPENAI) {
      const chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);
      const input = new ChatGPTInput("generate marketing description", { maxTokens: 800 });
      input.addUserMessage(`Create a marketing description for the following: ${promptString}`);
      const responses = await chatbot.chat(input);
      return responses[0].trim();
    } else if (provider === SupportedLangModels.COHERE) {
      const langInput = new LanguageModelInput({ prompt: `Create a marketing description for the following: ${promptString}` });
      langInput.setDefaultValues(SupportedLangModels.COHERE, 400);
      const cohereLanguageModel = new RemoteLanguageModel(apiKey, provider);
      const responses = await cohereLanguageModel.generateText(langInput);
      return responses[0].trim();
    } else if (provider === SupportedChatModels.NVIDIA) {
      const chatbot = new Chatbot(apiKey, SupportedChatModels.NVIDIA, customProxyHelper);
      const input = new NvidiaInput("generate marketing description", { maxTokens: 800, model: 'deepseek-ai/deepseek-r1', temperature: 0.6 });
      input.addUserMessage(`Create a marketing description for the following: ${promptString}`);
      const responses = await chatbot.chat(input);
      let text = responses[0].trim();
      return stripThinking(text);
    } else {
      const supported = RemoteLanguageModel.getSupportedModels().join(' - ');
      throw new Error(`Unsupported provider. Use one of: ${supported}, ${SupportedChatModels.NVIDIA}`);
    }
  }

  // Blog post generation
  static async get_blog_post(promptString, apiKey, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    if (provider === SupportedLangModels.OPENAI) {
      const chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);
      const input = new ChatGPTInput("generate blog post", { maxTokens: 1200 });
      input.addUserMessage(`Write a blog post about ${promptString}`);
      const responses = await chatbot.chat(input);
      return responses[0].trim();
    } else if (provider === SupportedLangModels.COHERE) {
      const langInput = new LanguageModelInput({ prompt: `Write a blog post with section titles about ${promptString}` });
      langInput.setDefaultValues(SupportedLangModels.COHERE, 1200);
      const cohereLanguageModel = new RemoteLanguageModel(apiKey, provider);
      const responses = await cohereLanguageModel.generateText(langInput);
      return responses[0].trim();
    } else if (provider === SupportedChatModels.NVIDIA) {
      const chatbot = new Chatbot(apiKey, SupportedChatModels.NVIDIA, customProxyHelper);
      const input = new NvidiaInput("generate blog post", { maxTokens: 1200, model: 'deepseek-ai/deepseek-r1', temperature: 0.6 });
      input.addUserMessage(`Write a blog post about ${promptString}`);
      const responses = await chatbot.chat(input);
      let text = responses[0].trim();
      return stripThinking(text);
    } else {
      const supported = RemoteLanguageModel.getSupportedModels().join(' - ');
      throw new Error(`Unsupported provider. Use one of: ${supported}, ${SupportedChatModels.NVIDIA}`);
    }
  }

  // Image description (unchanged)
  static async getImageDescription(promptString, apiKey, customProxyHelper = null) {
    const chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);
    const input = new ChatGPTInput("Generate image description", {});
    input.addUserMessage(`Generate image description from the following text: ${promptString}`);
    const responses = await chatbot.chat(input);
    return responses[0].trim();
  }

  // Generate image from description (unchanged)
  static async generate_image_from_desc(promptString, openaiKey, imageApiKey, is_base64 = true, width = 1024,
                                          height = 1024, provider = SupportedImageModels.STABILITY, customProxyHelper = null) {
    const imageDescription = await Gen.getImageDescription(promptString, openaiKey, customProxyHelper);
    const imgModel = new RemoteImageModel(imageApiKey, provider);
    const images = await imgModel.generateImages(
      new ImageModelInput({
        prompt: imageDescription,
        numberOfImages: 1,
        width: width,
        height: height,
        responseFormat: 'b64_json'
      })
    );
    return is_base64 ? images[0] : Buffer.from(images[0], "base64");
  }

  // Speech synthesis (unchanged)
  static async generate_speech_synthesis(text, googleKey) {
    const speechModel = new RemoteSpeechModel(googleKey, "google");
    const input = new Text2SpeechInput({ text: text, language: "en-gb" });
    return await speechModel.generateSpeech(input);
  }

  // Generate HTML page
  static async generate_html_page(text, apiKey, model_name = 'gpt-4o', provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    const template = new SystemHelper().loadPrompt("html_page");
    const promptTemp = new Prompt(template);
    let tokenSize = 8000;
    if (model_name.includes('-16k')) {
      tokenSize = 8000;
    } else if (model_name.includes('gpt-4o')) {
      tokenSize = 12000;
    } else if (model_name.includes('gpt-4')) {
      tokenSize = 4000;
    } else if (model_name.includes('deepseek')) {
      tokenSize = 15000;
    }
    let chatbot, input;
    if (provider === SupportedLangModels.OPENAI) {
      chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);
      input = new ChatGPTInput('generate html, css and javascript. Follow this template: {"html": "<code>", "message":"<text>"}',
        { maxTokens: tokenSize, model: model_name, temperature: 0.8 });
    } else if (provider === SupportedChatModels.NVIDIA) {
      chatbot = new Chatbot(apiKey, SupportedChatModels.NVIDIA, customProxyHelper);
      input = new NvidiaInput('generate html, css and javascript. Follow this template: {"html": "<code>", "message":"<text>"}',
        { maxTokens: tokenSize, model: 'deepseek-ai/deepseek-r1', temperature: 0.8 });
    } else {
      throw new Error("Unsupported provider for generate_html_page.");
    }
    input.addUserMessage(promptTemp.format({ 'text': text }));
    const responses = await chatbot.chat(input);
    let cleaned = responses[0]
      .trim()
      .replace(/```json/g, '')
      .replace(/```/g, '');
    if (provider === SupportedChatModels.NVIDIA) {
      cleaned = stripThinking(cleaned);
    }
    return JSON.parse(cleaned);
  }

  // Save HTML page (calls generate_html_page)
  static async save_html_page(text, folder, file_name, apiKey, model_name = 'gpt-4o', provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    const htmlCode = await Gen.generate_html_page(text, apiKey, model_name, provider, customProxyHelper);
    const folderPath = path.join(folder, file_name + '.html');
    FileHelper.writeDataToFile(folderPath, htmlCode['html']);
    return true;
  }

  // Generate dashboard
  static async generate_dashboard(csvStrData, topic, apiKey, model_name = 'gpt-4o', num_graphs = 1, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    if (num_graphs < 1 || num_graphs > 4) {
      throw new Error('num_graphs must be between 1 and 4.');
    }
    const template = new SystemHelper().loadPrompt("graph_dashboard");
    const promptTemp = new Prompt(template);
    let tokenSize = 2100;
    if (model_name.includes('-16k')) {
      tokenSize = 8000;
    } else if (model_name.includes('gpt-4o')) {
      tokenSize = 12000;
    } else if (model_name.includes('gpt-4')) {
      tokenSize = 3900;
    } else if (model_name.includes('deepseek')) {
      tokenSize = 15000;
    }
    let chatbot, input;
    if (provider === SupportedLangModels.OPENAI) {
      chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);
      input = new ChatGPTInput('Generate HTML graphs from CSV data. Response must be valid JSON with full HTML code.',
        { maxTokens: tokenSize, model: model_name, temperature: 0.3 });
    } else if (provider === SupportedChatModels.NVIDIA) {
      chatbot = new Chatbot(apiKey, SupportedChatModels.NVIDIA, customProxyHelper);
      input = new NvidiaInput('Generate HTML graphs from CSV data. Response must be valid JSON with full HTML code.',
        { maxTokens: tokenSize, model: 'deepseek-ai/deepseek-r1', temperature: 0.3 });
    } else {
      throw new Error("Unsupported provider for generate_dashboard.");
    }
    input.addUserMessage(promptTemp.format({ 'count': num_graphs, 'topic': topic, 'text': csvStrData }));
    const responses = await chatbot.chat(input);
    let cleaned = responses[0]
      .trim()
      .replace(/```json/g, '')
      .replace(/```/g, '');
    if (provider === SupportedChatModels.NVIDIA) {
      cleaned = stripThinking(cleaned);
    }
    return JSON.parse(cleaned)[0];
  }

  // Instruct update
  static async instructUpdate(modelOutput, userInstruction, type = '', apiKey, model_name = 'gpt-4o', provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    const template = new SystemHelper().loadPrompt("instruct_update");
    const promptTemp = new Prompt(template);
    let tokenSize = 2000;
    if (model_name.includes('gpt-4')) {
      tokenSize = 3900;
    }
    let chatbot, input;
    if (provider === SupportedLangModels.OPENAI) {
      chatbot = new Chatbot(apiKey, SupportedChatModels.OPENAI, customProxyHelper);
      input = new ChatGPTInput('Update the model message based on user feedback while maintaining format.',
        { maxTokens: tokenSize, model: model_name, temperature: 0.2 });
    } else if (provider === SupportedChatModels.NVIDIA) {
      chatbot = new Chatbot(apiKey, SupportedChatModels.NVIDIA, customProxyHelper);
      input = new NvidiaInput('Update the model message based on user feedback while maintaining format.',
        { maxTokens: tokenSize, model: 'deepseek-ai/deepseek-r1', temperature: 0.2 });
    } else {
      throw new Error("Unsupported provider for instructUpdate.");
    }
    input.addUserMessage(promptTemp.format({ 'model_output': modelOutput, 'user_instruction': userInstruction, 'type': type }));
    const responses = await chatbot.chat(input);
    let text = responses[0].trim();
    if (provider === SupportedChatModels.NVIDIA) {
      text = stripThinking(text);
    }
    return text;
  }
}

module.exports = { Gen };
