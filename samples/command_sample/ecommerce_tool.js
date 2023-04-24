const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const {
  RemoteLanguageModel,
  SupportedLangModels,
  LanguageModelInput,
  Chatbot,
  ChatGPTInput,
  RemoteImageModel,
  SupportedImageModels,
  ImageModelInput,
  RemoteSpeechModel,
  Text2SpeechInput,
  AudioHelper,
} = require('intellinode');

const MyKeys = {
  openai: process.env.OPENAI_API_KEY,
  cohere: process.env.COHERE_API_KEY,
  stability: process.env.STABILITY_API_KEY,
  google: process.env.GOOGLE_API_KEY,
};

const audioHelper = new AudioHelper();


async function main() {
  // 1- Generate product description
  const textModelInput = 'Write a creative product description for gaming chair with black and red colors';
  const textProductDesc = await generateProductDescription(textModelInput, MyKeys.cohere, 'cohere');
  console.log('- Product description:\n', textProductDesc);

  // 2- Generate image description
  const imageDescription = await getImageDescription(textProductDesc, MyKeys.openai, 'openai');
  console.log('\n- Image description:\n', imageDescription);

  // 3- Generate multiple images
  const images = await generateImage(imageDescription, MyKeys.stability, SupportedImageModels.STABILITY);
  console.log('save the product images in the temp folder');
  images.forEach((image, index) => {
    fs.writeFileSync(`./temp/product_image${index + 1}.png`, image, { encoding: 'base64' });
  });

  // 4- Generate audio
  const decodedAudio = await generateSpeech(textProductDesc, MyKeys.google, 'google');
  audioHelper.saveAudio(decodedAudio, './temp', 'product_description.mp3');
  console.log('Audio generated');
}

async function generateProductDescription(textInput, apiKey, modelBackend) {
  const modelName = (modelBackend === SupportedLangModels.OPENAI) ? 'text-davinci-003' : 'command-xlarge-20221108';
  const langModel = new RemoteLanguageModel(apiKey, modelBackend);
  const results = await langModel.generateText(new LanguageModelInput({
    prompt: textInput,
    model: modelName,
    maxTokens: 300
  }));
  return results[0].trim();
}

async function getImageDescription(textInput, apiKey, modelBackend) {
  const chatbot = new Chatbot(apiKey, modelBackend);
  const input = new ChatGPTInput('generate image description from paragraph to use it as prompt to generate image from DALL·E or stable diffusion image model. return only the image description to use it as direct input');
  input.addUserMessage(textInput);
  const responses = await chatbot.chat(input);
  return responses[0].trim();
}

async function generateImage(imageText, apiKey, modelBackend) {
  const imgModel = new RemoteImageModel(apiKey, modelBackend);
  const imageInput = new ImageModelInput({
    prompt: imageText,
    numberOfImages: 3,
    width: 512,
    height: 512
  });
  return await imgModel.generateImages(imageInput);
}

async function generateSpeech(textProductDesc, apiKey, modelBackend) {
  const speechModel = new RemoteSpeechModel(apiKey);
  const input = new Text2SpeechInput({ text: textProductDesc, language: 'en-gb' });
  const audioContent = await speechModel.generateSpeech(input);
  
  return audioHelper.decode(audioContent);
}

main();
