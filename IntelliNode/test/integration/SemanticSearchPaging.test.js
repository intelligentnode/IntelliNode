require('dotenv').config();
const assert = require('assert');
const { SemanticSearchPaging } = require('../../function/SemanticSearchPaging');
const { SupportedEmbedModels } = require('../../controller/RemoteEmbedModel');

const openaiApiKey = process.env.OPENAI_API_KEY;
const cohereApiKey = process.env.COHERE_API_KEY;

const pivotItem = 'Hello from IntelliNode';

const openaiSemanticSearch = new SemanticSearchPaging(openaiApiKey,
                                                     SupportedEmbedModels.OPENAI,
                                                     pivotItem, 2);
const cohereSemanticSearch = new SemanticSearchPaging(cohereApiKey,
                                                      SupportedEmbedModels.COHERE,
                                                      pivotItem, 2);

async function addToSessionAndTest(semanticSearch, newSearchItems) {

  await semanticSearch.addNewData( newSearchItems);
  const results = semanticSearch.getCurrentTopMatches();

  console.log('Semantic Search Session Results:', results);
  assert(results.length <= semanticSearch.numberOfMatches, 'Test passed');
}

(async () => {

  // semantic search with openai embedding
  await addToSessionAndTest(openaiSemanticSearch,  ['Greetings from IntelliNode!', 'Saluti da IntelliNode!']);
  await addToSessionAndTest(openaiSemanticSearch, ['Hola desde IntelliNode!', 'Bonjour de IntelliNode!']);

  openaiSemanticSearch.clean();

  // semantic search with cohere embedding
  await addToSessionAndTest(cohereSemanticSearch,  ['Greetings from IntelliNode!', 'Bonjour de IntelliNode!']);
  await addToSessionAndTest(cohereSemanticSearch, ['Hola desde IntelliNode!', 'Saluti da IntelliNode!']);
})();