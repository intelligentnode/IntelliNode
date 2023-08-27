const { SemanticSearch } = require('intellinode');
// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

async function callSemanticSearch(apiKey, provider) {
  const pivotItem = 'Hello from OpenAI!';
  const searchArray = ['Greetings from OpenAI!', 'Bonjour de OpenAI!', 'Hola desde OpenAI!'];
  const numberOfMatches = 2;
  
  const search = new SemanticSearch(apiKey, provider);

  const results = await search.getTopMatches(pivotItem, searchArray, numberOfMatches);
  console.log('OpenAI Semantic Search Results:', results);
  console.log('top matches:', search.filterTopMatches(results, searchArray));
}

(async () => {
  
  // Test the search using openAI
  console.log('### Openai semantic search ###')
  await callSemanticSearch(process.env.OPENAI_API_KEY, 'openai');

  // Test the search using cohere
  console.log('\n### Cohere semantic search ###')
  await callSemanticSearch(process.env.COHERE_API_KEY, 'cohere');

})();
