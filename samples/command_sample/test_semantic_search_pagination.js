const { SemanticSearchPaging, SupportedEmbedModels } = require('intellinode');
// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

async function callSemanticSearch(apiKey, provider) {
  const pivotItem = 'Hello from IntelliNode!';
  const searchArray1 = ['Greetings from IntelliNode!', 'Bonjour de IntelliNode!', '来自 IntelliNode 的问候！'] ;
  const searchArray2 = ['Saudações do IntelliNode!', 'Hola desde IntelliNode!', 'Groeten van IntelliNode!'];
  const numberOfMatches = 2;
  
  const search = new SemanticSearchPaging(apiKey,
                                          provider,
                                          pivotItem, 
                                          numberOfMatches);

  await search.addNewData(searchArray1);
  await search.addNewData(searchArray2);


  const results = await search.getCurrentTopMatches();
  
  console.log('Semantic Search Results:\n', results);

  
}

(async () => {
  
  // Test the search using openAI
  console.log('### Openai extended semantic search ###')
  await callSemanticSearch(process.env.OPENAI_API_KEY, SupportedEmbedModels.OPENAI);

  // Test the search using cohere
  console.log('\n### Cohere extended semantic search ###')
  await callSemanticSearch(process.env.COHERE_API_KEY, SupportedEmbedModels.COHERE);

})();
