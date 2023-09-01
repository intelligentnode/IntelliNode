require("dotenv").config();
const assert = require("assert");
const { Chatbot, SupportedChatModels } = require("../../function/Chatbot");
const { ChatGPTInput,
        ChatGPTMessage,
        ChatLLamaInput,
        LLamaReplicateInput,
        LLamaSageInput } = require("../../model/input/ChatModelInput");

const apiKey = process.env.OPENAI_API_KEY;
const replicateApiKey = process.env.REPLICATE_API_KEY;
// openai bot
const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);
// llama - replicate bot
const replicateBot = new Chatbot(replicateApiKey, SupportedChatModels.REPLICATE);
// llama - sagemaker bot (open access)
const sageBot = new Chatbot(null, SupportedChatModels.SAGEMAKER,
                        {url: process.env.AWS_API_URL});

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
    input.addMessage(new ChatGPTMessage("Please return the current date and time in Dublin.", "user"));

    const functions =  [
      {
        name: 'get_current_datetime',
        description: 'Returns current datetime',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The location to get current datetime',
            },
          },
          required: ['location'],
        },
      },
    ];

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

async function testReplicateLLamaCase1() {
  try {
    console.log('\nLLama test case 1: \n')
    const input = new LLamaReplicateInput("you are helpful assistant!");
    input.addUserMessage("Explain the plot of the Inception movie");

    const responses = await replicateBot.chat(input);

    responses.forEach((response) => console.log("- " + response));

    assert(responses.length > 0, "testReplicateLLamaCase1 response length should be greater than 0");
  } catch (error) {
    console.error("Test case failed with exception:", error.message);
  }
}

async function testReplicateLLamaCase2() {
  try {
    console.log('\nLLama test case 3: \n')
    const input = new LLamaReplicateInput("you are helpful coding assistant!",
                                          {model: '34b-code'});
    input.addUserMessage("how to develop micro service using node js");

    const responses = await replicateBot.chat(input);

    responses.forEach((response) => console.log("- " + response));

    assert(responses.length > 0, "testReplicateLLamaCase1 response length should be greater than 0");
  } catch (error) {
    console.error("Test case failed with exception:", error.message);
  }
}

async function testSageMakerLLamaCase() {
    try {
    console.log('\nLLama sagemaker test case 1: \n')

    const input = new LLamaSageInput("you are helpful assistant!");
    input.addUserMessage("Explain the plot of the Inception movie  in one line");
    input.addAssistantMessage("The plot of the movie Inception follows a skilled thief who enters people's dreams to steal their secrets and is tasked with implanting an idea into a target's mind to alter their future actions.");
    input.addUserMessage("Explain the plot of the dark night movie in one line");

    const responses = await sageBot.chat(input);

    responses.forEach((response) => console.log("- " + response));

    assert(responses.length > 0, "testSageMakerLLamaCase response length should be greater than 0");

  } catch (error) {
    console.error("Test case failed with exception:", error.message);
  }

}

async function testStreamOpenaiChatGPTCase1() {
    console.log('\nchat test case 1: \n')
    const mode = "You are a helpful astronomy assistant.";
    const input = new ChatGPTInput(mode);
    input.addUserMessage("what is the story of batman the dark night with less than 10 words");

    let fullText = '';
    for await (const contentText of bot.stream(input)) {
        fullText += contentText;
        console.log('Received chunk:', contentText);
    }

    console.log('full stream text: ', fullText)
    assert(fullText.length > 0, "testStreamOpenaiChatGPTCase1 response length should be greater than 0");
}

(async () => {

  console.log('### Openai model ###')
  await testOpenaiChatGPTCase1();
  await testOpenaiChatGPTCase2();
  await testOpenaiChatGPTCase3();
  // streaming
  await testStreamOpenaiChatGPTCase1();

  console.log('### Replicate llama model ###')
  await testReplicateLLamaCase1();
  await testReplicateLLamaCase2();

  console.log('### SageMaker llama model ###')
  //await testSageMakerLLamaCase();

})();