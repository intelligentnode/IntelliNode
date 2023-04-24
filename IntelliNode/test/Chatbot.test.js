require("dotenv").config();
const assert = require("assert");
const { Chatbot, SupportedChatModels } = require("../function/Chatbot");
const { ChatGPTInput, ChatGPTMessage } = require("../model/input/ChatModelInput");

const apiKey = process.env.OPENAI_API_KEY;
const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);

async function testOpenaiChatGPTCase1() {
  try {
    console.log('\nchat test case 1: \n')
    const mode = "You are a helpful astronomy assistant.";
    const input = new ChatGPTInput(mode);
    input.addUserMessage("what is the space between moon and earth");

    const responses = await bot.chat(input);

    responses.forEach((response) => console.log("- " + response));

    assert(responses.length > 0, "testOpenaiChatGPTCase1 response length should be greater than 0");
  } catch (error) {
    console.error("Test case failed with exception:", error.message);
  }
}

async function testOpenaiChatGPTCase2() {
  try {
    console.log('\nchat test case 2: \n')
    const mode = "You are a helpful assistant.";
    const input = new ChatGPTInput(mode);
    input.addMessage(new ChatGPTMessage("Who won the world series in 2020?", "user"));
    input.addMessage(new ChatGPTMessage("The Los Angeles Dodgers won the World Series in 2020.", "assistant"));
    input.addMessage(new ChatGPTMessage("Where was it played?", "user"));
    input.numberOfOutputs = 2;

    const responses = await bot.chat(input);

    responses.forEach((response) => console.log("- " + response));

    assert(responses.length > 0, "testOpenaiChatGPTCase2 response length should be greater than 0");
  } catch (error) {
    console.error("Test case failed with exception:", error.message);
  }
}

(async () => {
  await testOpenaiChatGPTCase1();
  await testOpenaiChatGPTCase2();
})();