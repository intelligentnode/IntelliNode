const { Chatbot, LLamaReplicateInput, SupportedChatModels } = require('intellinode');
// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

async function callChatbot(apiKey, provider) {
  const chatbot = new Chatbot(apiKey, provider);

  const system = 'You are a helpful assistant.';
  const input = new LLamaReplicateInput(system);
  input.addUserMessage('Explain the plot of the Inception movie in one line.');

  const response = await chatbot.chat(input);

  console.log(`Chatbot response (${provider}):`);
  console.log(`Chatbot response: ${response}`);


}

(async () => {
  // Test chatbot using Llama
  await callChatbot(process.env.REPLICATE_API_KEY, SupportedChatModels.REPLICATE);
})();
