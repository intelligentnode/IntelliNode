const { Gen } = require("../function/Gen");
require("dotenv").config();
const assert = require("assert");
const fs = require('fs');

const openaiApiKey = process.env.OPENAI_API_KEY;
const cohereApiKey = process.env.COHERE_API_KEY;
const stabilityApiKey = process.env.STABILITY_API_KEY;
const googleApiKey = process.env.GOOGLE_API_KEY;

async function testGetMarketingDesc(custom_provider) {

  const prompt = "gaming chair.";
  let marketingDesc = '';
  if (custom_provider == 'openai') {
    marketingDesc = await Gen.get_marketing_desc(prompt, openaiApiKey);
  } else if (custom_provider == 'cohere') {
    marketingDesc = await Gen.get_marketing_desc(prompt, cohereApiKey, provider=custom_provider);
  }

  // console.log("Marketing Description:", marketingDesc);

  assert(marketingDesc.length > 0, "Test passed");
}

async function testGetBlogPost(custom_provider) {

  const prompt = "bitcoin positive and negative impact.";
  let result = '';
  if (custom_provider == 'openai') {
    result = await Gen.get_blog_post(prompt, openaiApiKey);
  } else if (custom_provider == 'cohere') {
    result = await Gen.get_blog_post(prompt, cohereApiKey, provider=custom_provider);
  }

  // console.log("model output:", result);

  assert(result.length > 0, "Test passed");
}

async function testGenerateImageFromDesc(custom_provider) {
  const prompt = "Generate an image of a futuristic city skyline.";
  let image = ''
  if (custom_provider == 'stability') {
    image = await Gen.generate_image_from_desc(prompt, openaiApiKey, stabilityApiKey, true);
  } else if (custom_provider == 'openai'){
    image = await Gen.generate_image_from_desc(prompt, openaiApiKey,
                                    openaiApiKey, true, provider='openai');
  }
  // console.log("Generated Image (Base64):", image);
  assert(image.length > 10, "Test passed");
}

(async () => {
  /*
  console.log('marketing description using openai')
  await testGetMarketingDesc('openai');

  console.log('\n')

  console.log('marketing description using cohere')
  await testGetMarketingDesc('cohere');

  console.log('\n')

  console.log('blog using openai')
  await testGetBlogPost('openai');

  console.log('\n')

  console.log('blog using cohere')
  await testGetBlogPost('cohere');
  */
  console.log('\n')

  console.log('stability image')
  //testGenerateImageFromDesc('stability')

  console.log('DALL·E 2 image')
  testGenerateImageFromDesc('openai')

})();