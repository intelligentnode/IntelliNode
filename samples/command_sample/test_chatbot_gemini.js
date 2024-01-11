const { Chatbot, GeminiInput, SupportedChatModels } = require('intellinode');
// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

async function callChatbot(apiKey, provider) {
  const chatbot = new Chatbot(apiKey, provider);

  const system = 'You are a helpful assistant.';
  const input = new GeminiInput(system);
  input.addUserMessage('What is the distance between the Earth and the Moon?');
  // console.log(input.messages);

  const responses = await chatbot.chat(input);

  console.log(`Chatbot responses (${provider}):`);
  responses.forEach(response => console.log('- ', response));
}

(async () => {
  // Test chatbot using OpenAI
  console.log('test the chat function')
  await callChatbot(process.env.GEMINI_API_KEY, SupportedChatModels.GEMINI);
})();
