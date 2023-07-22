const { Chatbot, ChatLLamaInput, SupportedChatModels } = require('intellinode');
// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

async function callChatbot(apiKey, provider) {
  const chatbot = new Chatbot(apiKey, provider);

  const system = 'You are a helpful assistant.';
  const input = new ChatLLamaInput(system);
  input.addUserMessage('What is the distance between the Earth and the Moon?');

  const response = await chatbot.chat(input);

  console.log(`Chatbot response (${provider}):`);
  console.log(`Chatbot response: ${response}`);


}

(async () => {
  // Test chatbot using Llama
  await callChatbot(process.env.REPLICATE_API_KEY, SupportedChatModels.REPLICATE);
})();
