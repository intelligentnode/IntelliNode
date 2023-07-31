require("dotenv").config();
const assert = require('assert');
const { LLMEvaluation } = require('../../utils/LLMEvaluation');
const { SupportedChatModels } = require('../../function/Chatbot');
const { SupportedLangModels } = require('../../controller/RemoteLanguageModel');

// prepare the evaluation settings
const llamaChat = { apiKey: process.env.REPLICATE_API_KEY, provider: SupportedChatModels.REPLICATE,
                            type:'chat', model: '13b-chat', maxTokens: 50};
const openaiChat = { apiKey: process.env.OPENAI_API_KEY, provider: SupportedChatModels.OPENAI,
                     type: 'chat', model:'gpt-3.5-turbo', maxTokens: 50};
const cohereCompletion = { apiKey: process.env.COHERE_API_KEY, provider: SupportedLangModels.COHERE,
                            type:'completion', model: 'command', maxTokens: 50};

// create the evaluation object
const llmEvaluation = new LLMEvaluation(process.env.OPENAI_API_KEY, 'openai');

async function testLLMEvaluation() {
  const inputString = "Explain the process of photosynthesis in simple terms.";
  const targetAnswers = ["Photosynthesis is the process where green plants use sunlight to turn carbon dioxide and water into glucose and oxygen. The glucose provides food for the plant, and the oxygen gets released back into the air.",
                         "Photosynthesis is how plants make their own food. They take in water and carbon dioxide, use the energy from sunlight to transform them into glucose (their food) and oxygen, which they release into the air.",
                         "In simple terms, photosynthesis is like cooking for plants but instead of a stove, they use sunlight. They mix water and carbon dioxide with the sunlight to create glucose, which is their food, and also produce oxygen."];
  const providerSets = [llamaChat, openaiChat, cohereCompletion];

  const results = await llmEvaluation.compareModels(inputString, targetAnswers, providerSets);

  console.log('OpenAI Chat and Cohere Completion ModelEvaluation Results:', results);

  assert(Object.keys(results).length === providerSets.length+1, 'Test failed');
}

(async () => {
  await testLLMEvaluation();
})();