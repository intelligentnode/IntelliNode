// Let the model call your functions until it has an answer (works with every provider).
const { Chatbot, ChatGPTInput, AnthropicInput, SupportedChatModels } = require('intellinode');

const dotenv = require('dotenv');
dotenv.config();

const tools = [
  {
    name: 'get_weather',
    description: 'Current weather for a city',
    parameters: { type: 'object', properties: { city: { type: 'string' } }, required: ['city'] },
    handler: async ({ city }) => ({ city, tempC: 22, sky: 'sunny' }),
  },
  {
    name: 'convert_temperature',
    description: 'Convert Celsius to Fahrenheit',
    parameters: { type: 'object', properties: { celsius: { type: 'number' } }, required: ['celsius'] },
    handler: async ({ celsius }) => ({ fahrenheit: celsius * 9 / 5 + 32 }),
  },
];

async function runWithOpenAI() {
  const bot = new Chatbot(process.env.OPENAI_API_KEY, SupportedChatModels.OPENAI);
  const input = new ChatGPTInput('You are a weather assistant. Use the tools.');
  input.addUserMessage('What is the weather in Paris in Fahrenheit?');

  const { text, steps } = await bot.runTools(input, tools, {
    onToolCall: (name, args) => console.log(`-> ${name}(${JSON.stringify(args)})`),
  });
  console.log('\nOpenAI answer:', text);
  console.log('tool rounds:', steps.length);
}

async function runWithAnthropic() {
  const bot = new Chatbot(process.env.ANTHROPIC_API_KEY, SupportedChatModels.ANTHROPIC);
  const input = new AnthropicInput('You are a weather assistant. Use the tools.');
  input.addUserMessage('What is the weather in Paris in Fahrenheit?');

  const { text } = await bot.runTools(input, tools);
  console.log('\nClaude answer:', text);
}

async function structuredOutput() {
  const bot = new Chatbot(process.env.OPENAI_API_KEY, SupportedChatModels.OPENAI);
  const schema = {
    type: 'object',
    properties: { city: { type: 'string' }, country: { type: 'string' }, population: { type: 'integer' } },
    required: ['city', 'country', 'population'],
  };
  const input = new ChatGPTInput('Answer as JSON.', { responseSchema: schema });
  input.addUserMessage('Where is the Eiffel Tower?');

  const data = await bot.chatJson(input);
  console.log('\nJSON that matches the schema:', data);
}

(async () => {
  await runWithOpenAI();
  await runWithAnthropic();
  await structuredOutput();
})();
