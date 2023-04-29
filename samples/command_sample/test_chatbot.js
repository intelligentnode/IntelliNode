const { Chatbot, ChatGPTInput, ChatGPTMessage } = require('intellinode');
// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

async function callChatbot(apiKey, provider) {
  const chatbot = new Chatbot(apiKey, provider);

  const system = 'You are a helpful assistant.';
  const input = new ChatGPTInput(system);
  input.addUserMessage('What is the distance between the Earth and the Moon?');
  input.numberOfOutputs = 1;

  const responses = await chatbot.chat(input);

  console.log(`Chatbot responses (${provider}):`);
  responses.forEach(response => console.log('- ', response));
}

(async () => {
  // Test chatbot using OpenAI
  await callChatbot(process.env.OPENAI_API_KEY, 'openai');
})();
