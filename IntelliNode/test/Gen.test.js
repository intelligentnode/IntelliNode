const { Gen } = require("../function/Gen");
require("dotenv").config();
const assert = require("assert");
const fs = require('fs');

const openaiApiKey = process.env.OPENAI_API_KEY;
const stabilityApiKey = process.env.STABILITY_API_KEY;
const googleApiKey = process.env.GOOGLE_API_KEY;

async function testGetMarketingDesc() {
  const prompt = "gaming chair.";
  const marketingDesc = await Gen.get_marketing_desc(prompt, openaiApiKey);
  // console.log("Marketing Description:", marketingDesc);
  assert(marketingDesc.length > 0, "Test passed");
}

async function testGetBlogPost() {
  const prompt = "AI in art blog post.";
  const blogPost = await Gen.get_blog_post(prompt, openaiApiKey);
  // console.log("Blog Post:", blogPost);
  assert(blogPost.length > 0, "Test passed");
}

async function testGenerateImageFromDesc() {
  const prompt = "Generate an image of a futuristic city skyline.";
  const image = await Gen.generate_image_from_desc(prompt, openaiApiKey, stabilityApiKey, true);
  // console.log("Generated Image (Base64):", image);
  assert(image.length > 0, "Test passed");
}

async function testGenerateSpeechSynthesis() {
  const text = "IntelliNode is a powerful library to integrate AI models into your project.";
  const speech = await Gen.generate_speech_synthesis(text, googleApiKey);
  // console.log("Generated Speech (Base64):", speech);
  assert(speech.length > 0, "Test passed");
}


async function testGenerateHtmlPage() {
  const tempDir = '../temp';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const text = "a registration page with flat modern theme.";
  const htmlCode = await Gen.generate_html_page(text, openaiApiKey);

  fs.writeFileSync(`${tempDir}/generated_page_test.html`, htmlCode["html"]);

  assert(htmlCode["html"].length > 0, "Test passed");
}

async function testSaveHTML() {
  prompt = "a registration page with flat modern theme."
  status = await Gen.save_html_page(prompt, folder='../temp', file_name='test_register', openaiKeyclea=openaiApiKey);
  assert.strictEqual(status, true, "Test passed");
}

(async () => {
  await testGetMarketingDesc();
  await testGetBlogPost();
  await testGenerateImageFromDesc();
  await testGenerateSpeechSynthesis();
  await testGenerateHtmlPage();
  await testSaveHTML();
})();