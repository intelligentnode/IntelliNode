const { Chatbot, ChatGPTInput, ChatGPTMessage } = require('intellinode');
// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

async function callChatbot(apiKey, provider) {
  const chatbot = new Chatbot(apiKey, provider);

  const system = 'You are a helpful assistant.';
  const input = new ChatGPTInput(system, options={model: "o3-mini"});
  input.addUserMessage('what is the story of batman the dark night with less than 50 words');
  input.numberOfOutputs = 1;

  const responses = await chatbot.chat(input);

  console.log(`Chatbot responses (${provider}):`);
  responses.forEach(response => console.log('- ', response));
}

async function callChatbotStream(apiKey, provider) {
  const chatbot = new Chatbot(apiKey, provider);

  const system = 'You are a helpful assistant.';
  const input = new ChatGPTInput(system, options={model: "o3-mini"});
  input.addUserMessage('what is the story of batman the dark night with less than 50 words');
  input.numberOfOutputs = 1;

  let response = '';
  for await (const contentText of chatbot.stream(input)) {
    response += contentText;
    console.log('Received chunk:', contentText);
  }

  console.log(`Chatbot responses (${provider}):`);
  console.log('the full response: ', response)
}

(async () => {
  // Test chatbot using OpenAI
  console.log('test the chat function')
  await callChatbot(process.env.OPENAI_API_KEY, 'openai');

  console.log('test the stream function')
  await callChatbotStream(process.env.OPENAI_API_KEY, 'openai');
})();
