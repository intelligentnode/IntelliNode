const { Chatbot, ChatGPTInput, ChatGPTMessage } = require('intellinode');
const { ProxyHelper } = require('intellinode');

// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

async function callChatbot(apiKey, provider, modelName) {
  const chatbot = new Chatbot(apiKey, provider);

  const system = 'You are a helpful assistant.';
  const input = new ChatGPTInput(system);
  input.addUserMessage('What is the distance between the Earth and the Moon?');
  input.numberOfOutputs = 1;
  input.model = modelName

  const responses = await chatbot.chat(input);

  console.log(`Chatbot responses (${provider}):`);
  responses.forEach(response => console.log('- ', response));
}

(async () => {

  const args = process.argv.slice(2);
  const resourceName = args[0];
  const modelName = args[1];
  ProxyHelper.getInstance().setAzureOpenai(resourceName);
  // Test chatbot using OpenAI
  await callChatbot(process.env.AZURE_OPENAI_API_KEY, 'openai', modelName);
})();
