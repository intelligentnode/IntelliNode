require("dotenv").config();
const assert = require("assert");
const { Chatbot, SupportedChatModels } = require("../../function/Chatbot");
const { CohereStreamParser } = require('../../utils/StreamParser');
const { ChatGPTInput,
  ChatGPTMessage,
  ChatLLamaInput,
  CohereInput,
  LLamaReplicateInput,
  GeminiInput,
  LLamaSageInput } = require("../../model/input/ChatModelInput");

const openaiKey = process.env.OPENAI_API_KEY;
const replicateApiKey = process.env.REPLICATE_API_KEY;
const intelliKey = process.env.INTELLI_ONE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;
// openai bot
const bot = new Chatbot(openaiKey, SupportedChatModels.OPENAI, null,
  { oneKey: intelliKey, intelliBase: process.env.INTELLI_API_BASE });
// llama - replicate bot
const replicateBot = new Chatbot(replicateApiKey, SupportedChatModels.REPLICATE, null,
  { oneKey: intelliKey, intelliBase: process.env.INTELLI_API_BASE });
// gemini api key
const geminiBot = new Chatbot(geminiApiKey, SupportedChatModels.GEMINI, null,
  { oneKey: intelliKey, intelliBase: process.env.INTELLI_API_BASE });

async function testOpenaiChatGPTCase1() {
  try {
    console.log('\nchat test case 1: \n')
    const mode = "You are a helpful astronomy assistant.";
    const input = new ChatGPTInput(mode);
    input.addUserMessage("Tell me about the Mars the Red Planet? summarize the context");

    const responses = await bot.chat(input);

    console.log('### the chatbot response ###')
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
    const input = new ChatGPTInput(mode, { model: 'gpt-4o' });
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
    console.log('\nchat test case 1: \n')
    const mode = "You are a helpful astronomy assistant.";
    const input = new ChatGPTInput(mode, { model: 'gpt-4o', attachReference: true });
    input.addUserMessage("Tell me about the Mars the Red Planet? summarize the context");

    const responses = await bot.chat(input);

    console.log('### the chatbot response ###')
    responses.result.forEach((response) => console.log("- " + response));

    console.log('### the chatbot references ###')
    console.log(Object.keys(responses.references))

    assert(responses.result.length > 0, "testOpenaiChatGPTCase1 response length should be greater than 0");
  } catch (error) {
    console.error("Test case failed with exception:", error.message);
  }
}


async function testReplicateLLamaCase1() {
  try {
    console.log('\nLLama test case 1: \n')
    const input = new LLamaReplicateInput("you are helpful assistant!");
    input.addUserMessage("Explain the plot of the Inception movie");
    input.addAssistantMessage("Dom Cobb (Leonardo DiCaprio) is a thief with the rare ability to enter people's dreams and steal their secrets from their subconscious. His skill has made him a hot commodity in the world of corporate espionage but has also cost him everything he loves. Cobb gets a chance at redemption when he is offered a seemingly impossible task: Plant an idea in someone's mind. If he succeeds, it will be the perfect crime, but a dangerous enemy anticipates Cobb's every move.");
    input.addUserMessage("Tell me about the Mars the Red Planet? summarize the context");

    const responses = await replicateBot.chat(input);

    responses.forEach((response) => console.log("- " + response));

    assert(responses.length > 0, "testReplicateLLamaCase1 response length should be greater than 0");
  } catch (error) {
    console.error("Test case failed with exception:", error.message);
  }
}

async function testReplicateLLamaCase2() {
  try {
    console.log('\nLLama test case 2: \n')
    const input = new LLamaReplicateInput("you are helpful assistant!", { attachReference: true });
    input.addUserMessage("Explain the plot of the Inception movie");
    input.addAssistantMessage("Dom Cobb (Leonardo DiCaprio) is a thief with the rare ability to enter people's dreams and steal their secrets from their subconscious. His skill has made him a hot commodity in the world of corporate espionage but has also cost him everything he loves. Cobb gets a chance at redemption when he is offered a seemingly impossible task: Plant an idea in someone's mind. If he succeeds, it will be the perfect crime, but a dangerous enemy anticipates Cobb's every move.");
    input.addUserMessage("Tell me about the Mars the Red Planet? summarize the context");

    const responses = await replicateBot.chat(input);

    responses.result.forEach((response) => console.log("- " + response));

    console.log('### the chatbot references ###')
    console.log(Object.keys(responses.references))

    assert(responses.result.length > 0, "testReplicateLLamaCase1 response length should be greater than 0");
  } catch (error) {
    console.error("Test case failed with exception:", error.message);
  }
}

async function testStreamOpenaiChatGPTCase1() {
  console.log('\nchat stream test case 1: \n')
  const mode = "You are a helpful assistant.";
  const input = new ChatGPTInput(mode, { model: 'gpt-4o' });
  input.addUserMessage("Tell me about the Mars the Red Planet? summarize the context");

  let fullText = '';
  for await (const contentText of bot.stream(input)) {
    fullText += contentText;
    console.log('Received chunk:', contentText);
  }

  console.log('full stream text: ', fullText)
  assert(fullText.length > 0, "testStreamOpenaiChatGPTCase1 response length should be greater than 0");
}

async function testCohereChatCase() {
  console.log('\nchat test case 1 for Cohere: \n');
  const bot = new Chatbot(process.env.COHERE_API_KEY, SupportedChatModels.COHERE, null,
    { oneKey: intelliKey, intelliBase: process.env.INTELLI_API_BASE });

  const input = new CohereInput("You are a helpful computer programming assistant.", { web: true });
  input.addUserMessage("Tell me about the Mars the Red Planet? summarize the context");

  const responses = await bot.chat(input);

  responses.forEach((response) => console.log("- " + response));

  assert(responses.length > 0, "Cohere chat response length should be greater than 0");
}

async function testGeminiChatCase1() {
  try {
    console.log('\ngemini test case 1: \n')

    const input = new GeminiInput("", { searchK: 4 });
    input.addUserMessage("Tell me about the Mars the Red Planet? summarize the context");

    const responses = await geminiBot.chat(input);

    console.log('### the chatbot response ###')
    responses.forEach((response) => console.log("- " + response));

    assert(responses.length > 0, "testOpenaiChatGPTCase1 response length should be greater than 0");
  } catch (error) {
    console.error("Test case failed with exception:", error.message);
  }
}


async function testGeminiChatCase2() {
  try {
    console.log('\ngemini test case 2: \n')

    const input = new GeminiInput("", { searchK: 4, attachReference: true });
    input.addUserMessage("Tell me about the Mars the Red Planet? summarize the context");

    const responses = await geminiBot.chat(input);

    console.log('### the chatbot response ###')
    responses.result.forEach((response) => console.log("- " + response));

    console.log('### the chatbot references ###')
    console.log(Object.keys(responses.references))

    assert(responses.result.length > 0, "testOpenaiChatGPTCase1 response length should be greater than 0");
  } catch (error) {
    console.error("Test case failed with exception:", error.message);
  }
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

  console.log('### Cohere model ###')
  await testCohereChatCase();
  await testReplicateLLamaCase2();

  console.log('### Gemini model ###')
  await testGeminiChatCase1();
  await testGeminiChatCase2();

})();