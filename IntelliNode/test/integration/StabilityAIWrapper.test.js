require("dotenv").config();
const StabilityAIWrapper = require("../../wrappers/StabilityAIWrapper");
const ImageModelInput = require("../../model/input/ImageModelInput");
const fs = require('fs');
const stabilityAI = new StabilityAIWrapper(process.env.STABILITY_API_KEY);

async function testGenerateTextToImage() {
  try {
    // The v1 endpoint expects a JSON body
    const params = {
      text_prompts: [{ text: "A black and red gaming chair...", weight: 1.0 }],
      cfg_scale: 7,
      samples: 1,
      steps: 30
      // etc.
    };

    const result = await stabilityAI.generateTextToImage(params);

    console.log("Text to Image Result:", result);
    fs.writeFileSync('test_output.png', result.artifacts[0].base64, { encoding: 'base64' });
  } catch (error) {
    console.error("Text to Image Error:", error);
  }
}

async function testV2BetaCore() {
  try {
    const response = await stabilityAI.generateStableImageV2Beta({
      model: 'core',
      prompt: "Teddy writing a blog in Times Square, photorealistic",
      output_format: "webp",
      width: 512,
      height: 512,
      accept: "application/json"
    });
    console.log("v2beta (Core) JSON response:", response);
    fs.writeFileSync('test_v2beta_core.webp', response.image, { encoding: 'base64' });
  } catch (error) {
    console.error("testV2BetaCore Error:", error);
  }
}


(async () => {
  // await testGenerateTextToImage(); //v1
  await testV2BetaCore(); //v2
})();