const { RemoteImageModel, SupportedImageModels, ImageModelInput } = require('intellinode');

async function generateImages(apiKey, provider, imageInput) {
  const imgModel = new RemoteImageModel(apiKey, provider);
  const images = await imgModel.generateImages(imageInput);
  console.log(`Generated images (${provider}):`);
  images.forEach(image => console.log('- ', image));
}

(async () => {
  // Generate image using OpenAI
  const openaiKey = 'your-openai-api-key';
  const prompt = 'teddy writing a blog in times square';
  const openaiImageInput = new ImageModelInput({
    prompt: prompt,
    numberOfImages: 3
  });

  await generateImages(openaiKey, SupportedImageModels.OPENAI, openaiImageInput);

  // Generate image using Stability
  const stabilityKey = 'your-stability-api-key';
  const stabilityImageInput = new ImageModelInput({
    prompt: prompt,
    numberOfImages: 1,
    width: 512,
    height: 512
  });

  await generateImages(stabilityKey, SupportedImageModels.STABILITY, stabilityImageInput);
})();