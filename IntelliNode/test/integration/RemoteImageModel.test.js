const assert = require("assert");
const { RemoteImageModel } = require("../../controller/RemoteImageModel");
const ImageModelInput = require("../../model/input/ImageModelInput");

require("dotenv").config();
const openaiKey = process.env.OPENAI_API_KEY;
const stabilityKey = process.env.STABILITY_API_KEY;

async function testOpenaiImageRemoteModel() {
  console.log('### Openai test case 1 ### \n');
  const prompt = "teddy writing a blog in times square";

  try {
    const wrapper = new RemoteImageModel(openaiKey, "openai");

    if (openaiKey === "") return;

    const images = await wrapper.generateImages({ prompt: prompt, n: 3 });

    for (const image of images) {
      console.log("- ", image, "\n");
    }

    assert(
      images.length > 0,
      "testOpenaiImageRemoteModel response length should be greater than 0"
    );
  } catch (error) {
    if (openaiKey === "") {
      console.log(
        "testOpenaiImageRemoteModel: set the API key to run the test case."
      );
    } else {
      console.error("Test case failed with exception:", error);
    }
  }
}

async function testBase64IOpenaimageRemoteModel() {
  console.log('### Openai test case 2 ### \n');
  const prompt = "teddy writing a blog in times square";

  try {
    const wrapper = new RemoteImageModel(openaiKey, "openai");

    if (openaiKey === "") return;

    const images = await wrapper.generateImages({ prompt: prompt, n: 1, response_format: 'b64_json', size: '256x256' });

    for (const image of images) {
      console.log("- ", image, "\n");
    }

    assert(
      images.length > 0,
      "testOpenaiImageRemoteModel response length should be greater than 0"
    );
  } catch (error) {
    if (openaiKey === "") {
      console.log(
        "testOpenaiImageRemoteModel: set the API key to run the test case."
      );
    } else {
      console.error("Test case failed with exception:", error);
    }
  }
}

async function testStabilityImageRemoteModel() {
  console.log('\n ### Diffusion test case ### \n');

  const prompt = "teddy writing a blog in times square";

  try {
    const wrapper = new RemoteImageModel(stabilityKey, "stability");

    if (stabilityKey === "") return;

    const images = await wrapper.generateImages(new ImageModelInput({prompt:prompt, numberOfImages:1, width: 512, height: 512}));

    for (const image of images) {
      console.log("- ", image, "\n");
    }

    assert(
      images.length > 0,
      "testStabilityImageRemoteModel response length should be greater than 0"
    );
  } catch (error) {
    if (stabilityKey === "") {
      console.log(
        "testStabilityImageRemoteModel: set the API key to run the test case."
      );
    } else {
      console.error("Test case failed with exception:", error);
    }
  }
}

async function testOpenaiDallEImageRemoteModel() {
  const prompt = "teddy writing a blog in times square";

  try {
    const wrapper = new RemoteImageModel(openaiKey, "openai");

    if (openaiKey === "") return;

    const images = await wrapper.generateImages(new ImageModelInput({
      prompt,
      model: 'dall-e-3'
    }));

    for (const image of images) {
      console.log("- ", image, "\n");
    }

    assert(
      images.length > 0,
      "testOpenaiImageRemoteModel response length should be greater than 0"
    );
  } catch (error) {
    if (openaiKey === "") {
      console.log(
        "testOpenaiImageRemoteModel: set the API key to run the test case."
      );
    } else {
      console.error("Test case failed with exception:", error);
    }
  }
}

(async () => {
  await testOpenaiImageRemoteModel();
  await testBase64IOpenaimageRemoteModel();
  await testStabilityImageRemoteModel();
  await testOpenaiDallEImageRemoteModel();
})();