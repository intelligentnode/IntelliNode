require('dotenv').config();
const assert = require("assert");
const Prompt = require("../../utils/Prompt");

const openaiApiKey = process.env.OPENAI_API_KEY;

async function testGeneratedPrompt1() {
  const promptTemp = await Prompt.fromChatGPT("generate a fantasy image with ninja jumping across buildings", openaiApiKey);
  
  const promptString = promptTemp.getInput();
  
  console.log("the generated prompt: ", promptString);

  assert(promptString.length > 0, "Test failed");
}

async function testGeneratedPrompt2() {
  const promptTemp = await Prompt.fromChatGPT("information retrieval about ${reference} text with ${query} user input", openaiApiKey);
  
  const promptString = promptTemp.getInput();
  
  console.log("the generated prompt: ", promptString);

  assert(promptString.length > 0, "Test failed");
}


(async () => {
  console.log('test prompt 1:');
  await testGeneratedPrompt1();

  console.log('test prompt 2:');
  await testGeneratedPrompt2();
})();