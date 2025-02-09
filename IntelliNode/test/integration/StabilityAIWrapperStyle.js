require("dotenv").config();
const fs = require('fs');
const path = require('path');
const StabilityAIWrapper = require('../../wrappers/StabilityAIWrapper');

// Expected tun command:
// node StabilityAIWrapperStyle.js /absolute/path/to/image.png

const imagePath = process.argv[2];
if (!imagePath) {
  console.error('Usage: node StabilityAIWrapperStyle.js <path_to_image>');
  process.exit(1);
}

// Make sure we have a folder ../temp/stability/ to store images:
const outputDir = path.join(__dirname, '../../temp/stability');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// A helper to extract the base file name
const baseName = path.parse(imagePath).name;

// Initialize the wrapper
const stability = new StabilityAIWrapper(process.env.STABILITY_API_KEY);

async function testControlSketch() {
  try {
    const responseBuffer = await stability.controlSketch({
      imagePath,
      prompt: 'a medieval castle on a hill, fantasy illustration',
      control_strength: 0.7,
      output_format: 'png',
      // style_preset: 'photographic', // optional example
      // negative_prompt: 'ugly face', // optional example
      // seed: 12345, // optional
      accept: 'image/*' // request raw image
    });

    // Save result as "cat_sketch_edit.png" (example)
    const outName = `${baseName}_sketch_edit.png`;
    const outPath = path.join(outputDir, outName);

    fs.writeFileSync(outPath, Buffer.from(responseBuffer), 'binary');
    console.log(`Sketch image saved to: ${outPath}`);
  } catch (err) {
    console.error('Error in testControlSketch:', err);
  }
}

async function testControlStructure() {
  try {
    const responseBuffer = await stability.controlStructure({
      imagePath,
      prompt: 'a well manicured shrub in an english garden, topiary artwork',
      control_strength: 0.7,
      output_format: 'webp',
      accept: 'image/*'
    });

    const outName = `${baseName}_structure_edit.webp`;
    const outPath = path.join(outputDir, outName);

    fs.writeFileSync(outPath, Buffer.from(responseBuffer), 'binary');
    console.log(`Structure image saved to: ${outPath}`);
  } catch (err) {
    console.error('Error in testControlStructure:', err);
  }
}

async function testControlStyle() {
  try {
    const responseBuffer = await stability.controlStyle({
      imagePath,
      prompt: 'a majestic portrait of a chicken',
      // optional extras:
      // negative_prompt: 'blurry, lowres',
      // aspect_ratio: '16:9',
      // fidelity: 0.5,
      // seed: 987654,
      output_format: 'png',
      accept: 'image/*'
    });

    const outName = `${baseName}_style_edit.png`;
    const outPath = path.join(outputDir, outName);

    fs.writeFileSync(outPath, Buffer.from(responseBuffer), 'binary');
    console.log(`Style image saved to: ${outPath}`);
  } catch (err) {
    console.error('Error in testControlStyle:', err);
  }
}

// Run them all in sequence
(async () => {
  await testControlSketch();
  await testControlStructure();
  await testControlStyle();
})();
