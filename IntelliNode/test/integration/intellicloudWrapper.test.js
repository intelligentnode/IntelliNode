require('dotenv').config();
const IntellicloudWrapper = require('../../wrappers/IntellicloudWrapper');
const assert = require('assert');

// Assuming you set your API key in an environment variable
const oneKey = process.env.INTELLI_ONE_KEY;
const apiBase = process.env.INTELLI_API_BASE;
const intellicloud = new IntellicloudWrapper(oneKey, apiBase);

async function testSemanticSearch() {
  try {
    // Replace with your actual query text and k value
    const queryText = "Why is Mars called the Red Planet?";
    const k = 2;

    const result = await intellicloud.semanticSearch(queryText, k);
    
    //console.log('Semantic Search Result:\n', result, '\n');
    result.forEach(document => {
        console.log('- Document Name:', document.document_name);
        console.log('Document Type:', document.document_type);
        document.data.forEach(dataItem => {
          console.log('Text:', dataItem.text);
        });
        console.log('\n');
    });
    
    assert(result.length > 0, 'Semantic search should return at least one result');

  } catch (error) {
    console.error('Semantic Search Test Error:', error);
  }
}

async function testSemanticSearchWithFilter() {
  try {
    // Replace with your actual query text and k value
    const queryText = "Why is Mars called the Red Planet?";
    const k = 2;
    const doc_name = 'test_mars_article.pdf'

    const result = await intellicloud.semanticSearch(queryText, k, {document_name:doc_name});
    
    //console.log('Semantic Search Result:\n', result, '\n');
    result.forEach(document => {
        console.log('- Document Name:', document.document_name);
        console.log('Document Type:', document.document_type);
        document.data.forEach(dataItem => {
          console.log('Text:', dataItem.text);
        });
        console.log('\n');
    });
    
    assert(result.length > 0, 'Semantic search should return at least one result');

  } catch (error) {
    console.error('Semantic Search Test Error:', error);
  }
}

(async () => {
  await testSemanticSearch();
  await testSemanticSearchWithFilter();
})();