const { RemoteImageModel, SupportedImageModels, ImageModelInput } = require('intellinode');
// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

async function generateImages(apiKey, provider, imageInput) {
  const imgModel = new RemoteImageModel(apiKey, provider);
  const images = await imgModel.generateImages(imageInput);
  console.log(`Generated images (${provider}):`);
  images.forEach(image => console.log('- ', image));
}

(async () => {
  // Generate image using OpenAI
  const openaiKey = process.env.OPENAI_API_KEY;
  const prompt = 'teddy writing a blog in times square';
  const openaiImageInput = new ImageModelInput({
    prompt: prompt,
    numberOfImages: 3
  });

  await generateImages(openaiKey, SupportedImageModels.OPENAI, openaiImageInput);

  // Generate image using Stability
  const stabilityKey = process.env.STABILITY_API_KEY;
  const stabilityImageInput = new ImageModelInput({
    prompt: prompt,
    numberOfImages: 1,
    width: 512,
    height: 512
  });

  await generateImages(stabilityKey, SupportedImageModels.STABILITY, stabilityImageInput);
})();