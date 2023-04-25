const fs = require('fs');
const { RemoteImageModel, SupportedImageModels, ImageModelInput } = require('intellinode');
const dotenv = require('dotenv');
dotenv.config();

async function generateImages(apiKey, provider, imageInput) {
  const imgModel = new RemoteImageModel(apiKey, provider);
  const images = await imgModel.generateImages(imageInput);
  console.log(`Generated images (${provider}):`);
  images.forEach((image, index) => {
    fs.writeFileSync(`./temp/doge_image${index + 1}.png`, image, { encoding: 'base64' });
  });
  console.log('the images saved in the temp folder')
}

(async () => {
  
  // example 1: A cartoon-style Shiba Inu dog with a playful expression, sitting on a golden coin with "Doge" written on it, surrounded by other golden coins.
  // example 2: A cartoon-style Shiba Inu dog with a playful expression, standing on a patterned background with various dog toys scattered around. The background is filled with colorful paw prints and bones.

  prompt = 'A cartoon-style Shiba Inu dog with a playful expression, standing on a patterned background with various dog toys scattered around. The background is filled with colorful paw prints and bones.'

  // Generate image using Stability
  const myKey = process.env.OPENAI_API_KEY;
  const imageInput = new ImageModelInput({
    prompt: prompt,
    numberOfImages: 3,
    size: '512x512',
    responseFormat:'b64_json'
  });

  await generateImages(myKey, SupportedImageModels.OPENAI, imageInput);
})();
