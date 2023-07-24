const { Chatbot, LLamaReplicateInput, LLamaSageInput, SupportedChatModels } = require('intellinode');
// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

async function callReplicaChatbot(apiKey, provider) {
  const chatbot = new Chatbot(apiKey, provider);

  const system = 'You are a helpful assistant.';
  const input = new LLamaReplicateInput(system);
  input.addUserMessage('Explain the plot of the Inception movie in one line.');

  const response = await chatbot.chat(input);

  console.log(`Chatbot response (${provider}):`);
  console.log(`Chatbot response: ${response}`);


}


async function callSageMakerChatbot(apiKey, provider, url) {

  const chatbot = new Chatbot(apiKey, provider, {url: url});

  const system = 'You are a helpful assistant.';
  const input = new LLamaSageInput(system);
  input.addUserMessage('Explain the plot of the Inception movie in one line.');

  const response = await chatbot.chat(input);

  console.log(`Chatbot response (${provider}):`);
  console.log(`Chatbot response: ${response}`);


}

(async () => {
  // Test chatbot using Llama
  await callReplicaChatbot(process.env.REPLICATE_API_KEY, SupportedChatModels.REPLICATE);

  // Test chatbot using Sagemaker Llama private deployment
  // uncomment below if you deployed LLama in AWS sagemaker with API gateway
  // await callSageMakerChatbot(null /*replace with api key, if the model not deployed in open gateway*/,
  //      SupportedChatModels.SAGEMAKER,
  //        process.env.AWS_API_URL /*replace with API gateway link*/)

})();
