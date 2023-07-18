const { Chatbot, ChatGPTInput, ChatGPTMessage, ProxyHelper } = require('intellinode');
// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

const openaiProxyJson = {
  "url":"https://chimeragpt.adventblocks.cc",
  "completions":"/v1/completions",
  "chatgpt":"/v1/chat/completions",
  "imagegenerate":"/v1/images/generations",
  "embeddings": "/v1/embeddings"
}

const proxyHelper = new ProxyHelper();
proxyHelper.setOpenaiProxyValues(openaiProxyJson)

async function callChatbot(apiKey, provider) {
  const chatbot = new Chatbot(apiKey, provider, proxyHelper);

  const system = 'You are a helpful assistant.';
  const input = new ChatGPTInput(system);
  input.addUserMessage('为什么答案是42?');
  input.numberOfOutputs = 1;

  const responses = await chatbot.chat(input);

  console.log(`Chatbot responses (${provider}):`);
  responses.forEach(response => console.log('- ', response));
}

(async () => {
  // Test chatbot using OpenAI
  await callChatbot(process.env.OPENAI_API_KEY, 'openai');
})();
