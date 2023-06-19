require("dotenv").config();
const StabilityAIWrapper = require("../../wrappers/StabilityAIWrapper");
const ImageModelInput = require("../../model/input/ImageModelInput");
const fs = require('fs');
const stabilityAI = new StabilityAIWrapper(process.env.STABILITY_API_KEY);

async function testGenerateTextToImage() {
  try {
    const imageInput = new ImageModelInput({
      prompt: "A black and red gaming chair with a futuristic look that resembles the cockpit of a spaceship, made of high-quality materials and fully adjustable for comfortable gaming sessions.",
      numberOfImages: 1,
    });

    const result = await stabilityAI.generateTextToImage(imageInput.getStabilityInputs());

    console.log("Text to Image Result:", result);
  } catch (error) {
    console.error("Text to Image Error:", error);
  }
}

async function testGenerateImageToImage(imagePath) {
  try {
    const params = {
      text_prompts: [
        { text: "apply manga style to the human image and make him ninja.", weight: 0.6 },
      ],
      image_strength: 0.45,
      imagePath: imagePath,
      cfg_scale: 8.0,
      clip_guidance_preset: "FAST_BLUE",
      samples: 1,
      steps: 50,
      // sampler: "K_LMS",
    };

    const result = await stabilityAI.generateImageToImage(params);
    image = result['artifacts'][0]['base64']
    fs.writeFileSync('../temp/test_style_image.png', image, { encoding: 'base64' });

    // console.log("Image to Image Result:", result);
  } catch (error) {
    console.error("Image to Image Error:", error);
  }
}

(async () => {
  await testGenerateTextToImage();

  const args = process.argv.slice(2);
  const imagePath = args[0];

  if (imagePath) {
    await testGenerateImageToImage(imagePath);
  } else {
    console.log("Image file not provided. Skipping Image to Image Task.");
  }
})();