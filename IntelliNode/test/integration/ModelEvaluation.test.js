require("dotenv").config();
const assert = require('assert');
const { ModelEvaluation } = require('../../utils/ModelEvaluation');
const { SupportedChatModels } = require('../../function/Chatbot');
const { SupportedLangModels } = require('../../controller/RemoteLanguageModel');
const openaiChatKey = process.env.OPENAI_API_KEY;
const cohereCompletionKey = process.env.COHERE_API_KEY;
const openaiChat = { apiKey: openaiChatKey, provider: SupportedChatModels.OPENAI,
                     type: 'chat', model:'gpt-3.5-turbo', maxTokens: 50};
const cohereCompletion = { apiKey: cohereCompletionKey, provider: SupportedLangModels.COHERE,
                            type:'completion', model: 'command', maxTokens: 50};

const modelEvaluation = new ModelEvaluation(openaiChatKey, 'openai');

async function testModelEvaluation() {
  const inputString = "Explain the process of photosynthesis in simple terms.";
  const targetAnswers = ["Photosynthesis is the process where green plants use sunlight to turn carbon dioxide and water into glucose and oxygen. The glucose provides food for the plant, and the oxygen gets released back into the air.",
                         "Photosynthesis is how plants make their own food. They take in water and carbon dioxide, use the energy from sunlight to transform them into glucose (their food) and oxygen, which they release into the air.",
                         "In simple terms, photosynthesis is like cooking for plants but instead of a stove, they use sunlight. They mix water and carbon dioxide with the sunlight to create glucose, which is their food, and also produce oxygen."];
  const providerSets = [openaiChat, cohereCompletion];

  const results = await modelEvaluation.compareModels(inputString, targetAnswers, providerSets);

  console.log('OpenAI Chat and Cohere Completion ModelEvaluation Results:', results);

  assert(Object.keys(results).length === providerSets.length+1, 'Test failed');
}

(async () => {
  await testModelEvaluation();
})();