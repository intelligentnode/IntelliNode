const { Chatbot, CohereInput } = require('intellinode');
// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

async function callChatbot(apiKey, provider) {
  const chatbot = new Chatbot(apiKey, provider);

  const system = 'You are a helpful assistant.';
  const input = new CohereInput(system);
  input.addUserMessage('what is the story of batman the dark night with less than 50 words');

  const responses = await chatbot.chat(input);

  console.log(`Chatbot responses (${provider}):`);
  responses.forEach(response => console.log('- ', response));
}


async function callMultiMessageChatbot(apiKey, provider) {
  const chatbot = new Chatbot(apiKey, provider);

  const system = 'You are a helpful assistant.';
  const input = new CohereInput(system);
  input.addUserMessage("Explain the plot of the Inception movie  in one line");
  input.addAssistantMessage("The plot of the movie Inception follows a skilled thief who enters people's dreams to steal their secrets and is tasked with implanting an idea into a target's mind to alter their future actions.");
  input.addUserMessage("Explain the plot of the dark night movie in one line");

  const responses = await chatbot.chat(input);

  console.log(`Chatbot responses (${provider}):`);
  responses.forEach(response => console.log('- ', response));
}

async function callChatbotStream(apiKey, provider) {
  const chatbot = new Chatbot(apiKey, provider);

  const system = 'You are a helpful assistant.';
  const input = new CohereInput(system);
  input.addUserMessage('what is the story of batman the dark night with less than 50 words');

  let response = '';
  for await (const contentText of chatbot.stream(input)) {
    response += contentText;
    console.log('Received chunk:', contentText);
  }

  console.log(`Chatbot responses (${provider}):`);
  console.log('the full response: ', response)
}

(async () => {
  // Test chatbot using Cohere
  console.log('test the chat function')
  await callChatbot(process.env.COHERE_API_KEY, 'cohere');

  console.log('test the multi message')
  await callMultiMessageChatbot(process.env.COHERE_API_KEY, 'cohere');

  console.log('test the stream function')
  await callChatbotStream(process.env.COHERE_API_KEY, 'cohere');
})();
