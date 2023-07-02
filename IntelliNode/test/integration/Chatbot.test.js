require("dotenv").config();
const assert = require("assert");
const { Chatbot, SupportedChatModels } = require("../../function/Chatbot");
const { ChatGPTInput, ChatGPTMessage } = require("../../model/input/ChatModelInput");

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

async function testOpenaiChatGPTCase3() {
  try {

    console.log('\nChat test case 3: \n');

    const sysMsg = "You are a helpful assistant.";
    const input = new ChatGPTInput(sysMsg, {model: "gpt-3.5-turbo-0613"});
    input.addMessage(new ChatGPTMessage("Please return the current date and time.", "user"));

    const functions = [{
      name: 'get_current_datetime',
      description: 'Returns current datetime',
      parameters: {
        type: 'object',
        properties: {}
      }
    }];

    const function_call = 'auto';

    const responses = await bot.chat(input, functions, function_call);

    responses.forEach((response) => {
      if (typeof response === "object") {
        console.log("- Function call: ", JSON.stringify(response.function_call, null, 2));
      } else {
        console.log("- " + response);
      }
    });

    // asert
    const hasFunctionCall = responses.some(response =>
      typeof response === "object" &&
      response.function_call &&
      response.function_call.name === "get_current_datetime"
    );
    assert(hasFunctionCall, "testOpenaiChatGPTCase3 response should contain a function call");

  } catch (error) {
    console.error("Test case failed with exception:", error.message);
  }
}


(async () => {
  // await testOpenaiChatGPTCase1();
  await testOpenaiChatGPTCase2();
  await testOpenaiChatGPTCase3();
})();