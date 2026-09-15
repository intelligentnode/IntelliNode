// One code path for OpenRouter, Groq, DeepSeek, xAI, Together, a local Ollama / LM Studio or any OpenAI-compatible endpoint.
const { Chatbot, OpenAICompatibleInput, Gen } = require('intellinode');

const dotenv = require('dotenv');
dotenv.config();

async function localOllama() {
  // no key needed; pick any model you pulled with `ollama pull`
  const bot = new Chatbot(null, 'ollama', null, { model: process.env.OLLAMA_MODEL || 'qwen3' });
  console.log('models on this machine:', await bot.listModels());

  const input = new OpenAICompatibleInput('You are a helpful assistant.');
  input.addUserMessage('Give me three names for a coffee shop.');
  const responses = await bot.chat(input);
  console.log('\nOllama:', responses[0]);

  process.stdout.write('\nstreamed: ');
  for await (const chunk of bot.stream(input)) process.stdout.write(chunk);
  console.log();

  // the Gen functions accept the same providers
  const data = await Gen.generate_json('Suggest a coffee shop name and a tagline.',
    { type: 'object', properties: { name: { type: 'string' }, tagline: { type: 'string' } }, required: ['name', 'tagline'] },
    null, 'ollama', { model: process.env.OLLAMA_MODEL || 'qwen3' });
  console.log('\nGen.generate_json:', data);
}

async function openRouter() {
  const bot = new Chatbot(process.env.OPENROUTER_API_KEY, 'openrouter', null, {
    headers: { 'HTTP-Referer': 'https://intellinode.ai', 'X-OpenRouter-Title': 'IntelliNode sample' },
  });
  const input = new OpenAICompatibleInput('You are a helpful assistant.', { model: 'anthropic/claude-sonnet-5' });
  input.addUserMessage('Who painted the Mona Lisa?');
  console.log('\nOpenRouter:', (await bot.chat(input))[0]);
}

async function customEndpoint() {
  const bot = new Chatbot(process.env.MY_API_KEY, 'openai_compatible', null, {
    baseUrl: process.env.MY_BASE_URL || 'http://localhost:8000/v1',
    model: process.env.MY_MODEL,
    timeout: 60000,
    retries: 1,
  });
  const input = new OpenAICompatibleInput('You are a helpful assistant.');
  input.addUserMessage('Say hello.');
  console.log('\ncustom endpoint:', (await bot.chat(input))[0]);
}

(async () => {
  await localOllama();
  if (process.env.OPENROUTER_API_KEY) await openRouter();
  if (process.env.MY_BASE_URL) await customEndpoint();
})();
