require("dotenv").config();
const assert = require("assert");
const { Chatbot, SupportedChatModels } = require("../../function/Chatbot");
const { CohereStreamParser } = require('../../utils/StreamParser');
const { ChatGPTMessage,
        CohereInput 
      } = require("../../model/input/ChatModelInput");

// env key
const apiKey = process.env.COHERE_API_KEY;

// openai bot
const bot = new Chatbot(apiKey, SupportedChatModels.COHERE);

async function testChatGPTCase1() {
  try {
    console.log('\nchat test case 1: \n')
    const mode = "You are a helpful astronomy assistant.";
    const input = new CohereInput(mode);
    input.addUserMessage("what is the space between moon and earth");

    const responses = await bot.chat(input);

    responses.forEach((response) => console.log("- " + response));

    assert(responses.length > 0, "testOpenaiChatGPTCase1 response length should be greater than 0");
  } catch (error) {
    console.error("Test case failed with exception:", error.message);
  }
}

async function testChatGPTCase2() {
  try {
    console.log('\nchat test case 2: \n')
    const mode = "You are a helpful astronomy assistant.";
    const input = new CohereInput(mode);
    input.addUserMessage("Explain the plot of the Inception movie  in one line");
    input.addAssistantMessage("The plot of the movie Inception follows a skilled thief who enters people's dreams to steal their secrets and is tasked with implanting an idea into a target's mind to alter their future actions.");
    input.addUserMessage("Explain the plot of the dark night movie in one line");

    const responses = await bot.chat(input);

    responses.forEach((response) => console.log("- " + response));

    assert(responses.length > 0, "test case 2 response length should be greater than 0");
  } catch (error) {
    console.error("Test case failed with exception:", error.message);
  }
}

async function testChatGPTCase3() {
  try {

    console.log('\nchat test case 4: \n')

    const mode = "You are a helpful astronomy assistant.";
    const input = new CohereInput(mode);
    
    input.addUserMessage("Explain the plot of the Inception movie  in one line");
    input.addAssistantMessage("The plot of the movie Inception follows a skilled thief who enters people's dreams to steal their secrets and is tasked with implanting an idea into a target's mind to alter their future actions.");
    input.addUserMessage("Explain the plot of the dark night movie in one line");

    let response = '';
    for await (const contentText of bot.stream(input)) {
      response += contentText;
      console.log('Received chunk:', contentText);
    }

    assert(response.length > 0, "Test case 3 response length should be greater than 0");

  } catch (error) {
    console.error("Test case failed with exception:", error.message);
  }

    
}

(async () => {

  console.log('### Cohere model ###')
  await testChatGPTCase1();
  await testChatGPTCase2();
  await testChatGPTCase3();
  
})();