require('dotenv').config();
const assert = require('assert');
const SemanticSearch = require('../function/SemanticSearch');
const { SupportedEmbedModels } = require('../controller/RemoteEmbedModel');

const openaiApiKey = process.env.OPENAI_API_KEY;
const cohereApiKey = process.env.COHERE_API_KEY;

const openaiSemanticSearch = new SemanticSearch(openaiApiKey, SupportedEmbedModels.OPENAI);
const cohereSemanticSearch = new SemanticSearch(cohereApiKey, SupportedEmbedModels.COHERE);

async function testOpenAISemanticSearch() {
  const pivotItem = 'Hello from OpenAI!';
  const searchArray = ['Greetings from OpenAI!', 'Bonjour de OpenAI!', 'Hola desde OpenAI!'];
  const numberOfMatches = 2;

  const results = await openaiSemanticSearch.getTopMatches(pivotItem, searchArray, numberOfMatches);
  console.log('OpenAI Semantic Search Results:', results);
  console.log('top matches:', openaiSemanticSearch.filterTopMatches(results, searchArray));
  assert(results.length === numberOfMatches, 'Test passed');
}

async function testCohereSemanticSearch() {
  const pivotItem = 'Hello from Cohere!';
  const searchArray = ['Greetings from Cohere!', 'Bonjour de Cohere!', 'Hola desde Cohere!'];
  const numberOfMatches = 2;

  const results = await cohereSemanticSearch.getTopMatches(pivotItem, searchArray, numberOfMatches);
  console.log('Cohere Semantic Search Results:', results);
  console.log('top matches:', openaiSemanticSearch.filterTopMatches(results, searchArray));
  assert(results.length === numberOfMatches, 'Test passed');
}

(async () => {
  await testOpenAISemanticSearch();
  await testCohereSemanticSearch();
})();