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
  console.log(`${response}`);


}

async function callReplicaCoderChatbot(apiKey, provider) {
  const chatbot = new Chatbot(apiKey, provider);

  const system = 'You are a helpful coder.';
  const input = new LLamaReplicateInput(system, 
                       {model: '13b-code-instruct', 
                        max_new_tokens: 128,
                        top_k: 50,
                        top_p: 0.9,
                        temperature: 0.1,
                        min_new_tokens: 500,
                        repetition_penalty: 1.15,
                        stop_sequences: '<end>'});
  input.addUserMessage('how to code micro service using node js and express.');

  const response = await chatbot.chat(input);

  console.log(`Chatbot response (${provider}):`);
  console.log(`${response}`);


}

async function callSageMakerChatbot(apiKey, provider, url) {

  const chatbot = new Chatbot(apiKey, provider, {url: url});

  const system = 'You are a helpful assistant.';
  const input = new LLamaSageInput(system);
  input.addUserMessage('Explain the plot of the Inception movie in one line.');

  const response = await chatbot.chat(input);

  console.log(`Chatbot response (${provider}):`);
  console.log(`${response}`);


}

(async () => {
  // Test chatbot using Llama
  console.log('### execute the llama chatbot ###')
  await callReplicaChatbot(process.env.REPLICATE_API_KEY, SupportedChatModels.REPLICATE);

  // Test chatbot using Llama codeer
  console.log('\n### execute the llama-code chatbot ###')
  await callReplicaCoderChatbot(process.env.REPLICATE_API_KEY, SupportedChatModels.REPLICATE);


  // Test chatbot using Sagemaker Llama private deployment
  // uncomment below if you deployed LLama in AWS sagemaker with API gateway

  // console.log('\n### execute the AWS llama chatbot ###')
  // await callSageMakerChatbot(null /*replace with api key, if the model not deployed in open gateway*/,
  //      SupportedChatModels.SAGEMAKER,
  //        process.env.AWS_API_URL /*replace with API gateway link*/)

})();
