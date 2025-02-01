const { Chatbot, NvidiaInput, SupportedChatModels } = require('intellinode');

const dotenv = require('dotenv');
dotenv.config();

async function callChatbot(apiKey, provider) {
  const chatbot = new Chatbot(apiKey, provider);

  const system = 'You are a knowledgeable assistant about AI and technology.';
  const input = new NvidiaInput(system, {
    model: 'deepseek-ai/deepseek-r1',
    maxTokens: 512,
    temperature: 0.7
  });

  input.addUserMessage('What are the main differences between AI and Machine Learning? provide short answer');

  const responses = await chatbot.chat(input);

  console.log(`\nChatbot responses (${provider}):`);
  responses.forEach(response => console.log('- ', response));
}

async function callChatbotStream(apiKey, provider) {
  const chatbot = new Chatbot(apiKey, provider);

  const system = 'You are a poetic assistant.';
  const input = new NvidiaInput(system, {
    model: 'deepseek-ai/deepseek-r1',
    maxTokens: 512,
    temperature: 0.5,
    stream: true
  });

  input.addUserMessage('Write a haiku about artificial intelligence.');

  let response = '';
  console.log(`\n--- NVIDIA Streaming (${provider}) ---\n`);
  
  for await (const contentText of chatbot.stream(input)) {
    response += contentText;
    console.log('Received chunk:', contentText);
  }

  console.log(`\nChatbot responses (${provider}):`);
  console.log('The full response:', response);
}

(async () => {
  //console.log('\n🔹 Testing NVIDIA DeepSeek Chat\n');
  await callChatbot(process.env.NVIDIA_API_KEY, SupportedChatModels.NVIDIA);

  console.log('\n🔹 Testing NVIDIA DeepSeek Streaming\n');
  await callChatbotStream(process.env.NVIDIA_API_KEY, SupportedChatModels.NVIDIA);
})();
