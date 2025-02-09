/**
 * Demonstrates advanced usage of Stability v2beta:
 *  - Image to Image (Inpaint, Outpaint, etc.)
 *  - Upscale
 *  - Image-to-Video
 *
 * Run with: 
 *    node test/integration/StabilityAIWrapperExtend.test.js [imagePath]
 * OR:
 *   node test/integration/StabilityAIWrapperExtend.test.js  [imagePath] [maskPath]
 * 
 * If no arguments are provided, it will default to some placeholder paths.
 */

require("dotenv").config();
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const StabilityAIWrapper = require("../../wrappers/StabilityAIWrapper");

const stabilityAI = new StabilityAIWrapper(process.env.STABILITY_API_KEY);

async function testUpscale(imagePath) {
  console.log("\n=== testUpscale() ===");
  try {
    const width = 1024;
    const height = 1024;
    const engine = "esrgan-v1-x2plus";
    const arrayBuffer = await stabilityAI.upscaleImage(imagePath, width, height, engine);

    const outFile = "test_upscaled.png";
    fs.writeFileSync(outFile, Buffer.from(arrayBuffer));
    console.log("Upscaled image saved to", outFile);
  } catch (error) {
    console.error("Upscale Error:", error);
  }
}

/**
 * testInpaint (v2beta) 
 *   For inpainting, you pass an original image + a mask. 
 *   We use the /v2beta/stable-image/edit/inpaint endpoint in a direct form-data request.
 * 
 */
async function testInpaint(imagePath, maskPath) {
  console.log("\n=== testInpaint() ===");
  try {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));
    formData.append("mask", fs.createReadStream(maskPath));
    formData.append("prompt", "golden retriever in a field"); 
    formData.append("output_format", "webp");

    // v2beta endpoint
    const endpoint = "/v2beta/stable-image/edit/inpaint";
    const response = await stabilityAI.client.post(endpoint, formData, {
      headers: {
        Accept: "application/json" // or "image/*" if you want raw bytes
      }
    });

    // If Accept=application/json, you get a JSON with { image, finish_reason, seed }
    const base64Data = response.image; 
    const outFile = "test_inpainted.webp";
    fs.writeFileSync(outFile, base64Data, { encoding: 'base64' });
    console.log("Inpainted image saved to", outFile);
  } catch (error) {
    console.error("Inpaint Error:", error);
  }
}

/**
 * testOutpaint (v2beta)
 *   Outpainting extends the canvas in one or more directions. 
 *   The request includes left, right, top, or bottom.
 */
async function testOutpaint(imagePath) {
  console.log("\n=== testOutpaint() ===");
  try {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));
    formData.append("left", 200);   // how many pixels to expand on left
    formData.append("bottom", 200); // how many pixels to expand on bottom
    formData.append("prompt", "A bigger, lush green field around the dog");
    formData.append("output_format", "webp");

    const endpoint = "/v2beta/stable-image/edit/outpaint";
    const response = await stabilityAI.client.post(endpoint, formData, {
      headers: { Accept: "application/json" }
    });

    const base64Data = response.image;
    const outFile = "test_outpainted.webp";
    fs.writeFileSync(outFile, base64Data, { encoding: 'base64' });
    console.log("Outpainted image saved to", outFile);
  } catch (error) {
    console.error("Outpaint Error:", error);
  }
}

/**
 * testImageToImage (v2beta) - example using stable-image/generate/<model> 
 * to do "image variation" or partial "image to image" with some strength param.
 *
 * If you prefer the old v1 approach or you have a method in StabilityAIWrapper,
 * use that. This is just to show how to do partial 2beta calls with "prompt+init_image".
 */
async function testImageToImage(imagePath) {
  console.log("\n=== testImageToImage() ===");
  // We'll treat it as if there's a v2beta param "init_image_strength" 
  // or "image_strength" in the /generate/<model> calls. 
  // The official docs for direct "image to image" are typically 
  // /v1/generation/<engine>/image-to-image, but let's do a form-data approach with 
  // v2. You could also do the direct /v2beta/stable-image/edit/inpaint with a blank mask. 

  // For demonstration:
  const model = "core";
  try {
    const formData = new FormData();
    formData.append("init_image", fs.createReadStream(imagePath));
    formData.append("prompt", "A stylized version of this image, comic style, high contrast");
    formData.append("image_strength", 0.4);
    formData.append("output_format", "png");

    const endpoint = `/v2beta/stable-image/generate/${model}`;
    const response = await stabilityAI.client.post(endpoint, formData, {
      headers: { Accept: "application/json" }
    });

    const base64Data = response.image;
    const outFile = "test_img2img.png";
    fs.writeFileSync(outFile, base64Data, { encoding: 'base64' });
    console.log("Image2Image result saved to", outFile);
  } catch (error) {
    console.error("Image2Image Error:", error);
  }
}

/**
 * testImageToVideo
 *   1) Send initial image to /v2beta/image-to-video, get a generation_id
 *   2) Poll /v2beta/image-to-video/result/<generation_id> 
 *      until status=200 or 202
 */
async function testImageToVideo(imagePath) {
  console.log("\n=== testImageToVideo() ===");
  try {
    // Start generation
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));
    formData.append("seed", 0);        // or random
    formData.append("cfg_scale", 1.8); // optional
    formData.append("motion_bucket_id", 127); // picks some motion style

    const startEndpoint = "/v2beta/image-to-video";
    const startResp = await stabilityAI.client.post(startEndpoint, formData, {
      headers: { Accept: "application/json" }
    });
    // e.g. { id: "a6dc6c6e20acda010fe14d71..." }
    const generationId = startResp.id;
    console.log("Video generationId:", generationId);

    // Poll for result
    const resultEndpoint = `/v2beta/image-to-video/result/${generationId}`;
    let attempts = 0;
    while (true) {
      attempts++;
      // "Accept: video/*" to get raw bytes if 200
      const response = await fetchWithStatusCheck(
        stabilityAI.client,
        resultEndpoint,
        { headers: { Accept: "video/*" }, responseType: "arraybuffer" }
      );

      if (response.httpStatus === 200) {
        // Save the video
        const outFile = "test_video.mp4";
        fs.writeFileSync(outFile, Buffer.from(response.data));
        console.log(`Video saved to ${outFile}`);
        break;
      } else if (response.httpStatus === 202) {
        console.log(`[Attempt ${attempts}] Still processing. Retrying in 10s...`);
        await new Promise((r) => setTimeout(r, 10000));
      } else {
        console.log(`[Attempt ${attempts}] Error`, response.errorText);
        break;
      }
      if (attempts > 10) {
        console.log("Timeout waiting for video generation. Exiting...");
        break;
      }
    }
  } catch (error) {
    console.error("ImageToVideo Error:", error);
  }
}

/**
 * Helper function to do GET with known status code check 
 * because we want to handle 202 vs 200 vs 4xx/5xx
 */
async function fetchWithStatusCheck(fetchClient, endpoint, config) {
  let data, errorText;
  let httpStatus = 200;
  try {
    // The fetchClient doesn't have a built-in "status check" mode, 
    // so we do a manual approach:
    const rawResponse = await fetchClient.getRaw(endpoint, config);
    httpStatus = rawResponse.status;
    if (httpStatus === 200) {
      if (config.responseType === 'arraybuffer') {
        data = await rawResponse.arrayBuffer();
      } else {
        data = await rawResponse.json();
      }
    } else if (httpStatus === 202) {
      // still processing
    } else {
      errorText = await rawResponse.text();
    }
  } catch (err) {
    errorText = err.toString();
    httpStatus = 500;
  }
  return { httpStatus, data, errorText };
}

// We might need a small extension to FetchClient to support a "getRaw" 
// that returns the entire response object. 
// For instance (pseudocode in your existing FetchClient.js):
//   async getRaw(endpoint, extraConfig = {}) { 
//      const url = ...
//      const response = await fetch(url, {...});
//      return response; // no .json or .text calls
//   }
//
// Or you can do a bare "fetch()" call inline. 
// We'll assume we've added getRaw() for demonstration.


/**
 * Main runner
 */
(async () => {
  const args = process.argv.slice(2);
  const imagePath = args[0] || "./dog.png";  // a default
  const maskPath  = args[1] || "./mask.png"; // if you have a mask

  console.log("Using imagePath:", imagePath);
  console.log("Using maskPath:", maskPath);

  // 1) Upscale
  await testUpscale(imagePath);

  // 2) Inpaint
  await testInpaint(imagePath, maskPath);

  // 3) Outpaint
  await testOutpaint(imagePath);

  // 4) Simple image2image
  await testImageToImage(imagePath);

  // 5) Image to Video (longer poll process)
  await testImageToVideo(imagePath);
})();
