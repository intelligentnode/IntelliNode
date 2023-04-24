const { RemoteLanguageModel, SupportedLangModels, LanguageModelInput } = require('intellinode');

async function generateText(apiKey, provider, model, prompt, temperature) {
  const langModel = new RemoteLanguageModel(apiKey, provider);
  const results = await langModel.generateText(new LanguageModelInput({
    prompt: prompt,
    model: model,
    temperature: temperature,
    maxTokens: 200
  }));
  console.log('- Generated ', provider, ' text:', results[0]);
}

(async () => {
  // Generate text using OpenAI
  const openaiKey = 'your-key';
  const openaiModel = 'text-davinci-003';
  const prompt = 'Write a product description for smart plug that works with voice assistant.';
  const temperature = 0.7;

  await generateText(openaiKey, SupportedLangModels.OPENAI, openaiModel, prompt, temperature);

  // Generate text using Cohere
  const cohereKey = 'your-key';
  const cohereModel = 'command-xlarge-20221108';

  await generateText(cohereKey, SupportedLangModels.COHERE, cohereModel, prompt, temperature);
})();