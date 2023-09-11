const ChatContext = require('../../utils/ChatContext');
require("dotenv").config();
const assert = require('assert');
const ProxyHelper = require('../../utils/ProxyHelper');
const apiKey = process.env.AZURE_OPENAI_API_KEY;

async function testGetSimpleContext(proxyHelper, modelName) {
  const context = new ChatContext(apiKey, 'openai', proxyHelper);
  const userMessage = "Hello";
  const historyMessages = ["Good morning", "Dinner time", "How can I help you?", "Hello"];
  const n = 3;

  const resultContext = await context.getStringContext(userMessage, historyMessages, n, modelName);

  console.log('result: ', resultContext)

  assert.strictEqual(resultContext.length, n);
}

// Test for getRoleContext
async function testGetRoleContext(proxyHelper, modelName) {

  const context = new ChatContext(apiKey, 'openai', proxyHelper);
  const userMessage = "Hello";
  const historyMessages = [
    { role: 'user', content: 'Dinner time' },
    { role: 'user', content: 'Good Morning' },
    { role: 'assistant', content: 'How can I help you?' },
    { role: 'user', content: 'Hello' }
  ];
  const n = 3;

  const resultContext = await context.getRoleContext(userMessage, historyMessages, n, modelName);

  console.log('resultContext: ', resultContext)

  assert.strictEqual(resultContext.length, n);

}


(async () => {

    const args = process.argv.slice(2);
    const resourceName = args[0];
    const modelName = args[1];

    // set azure openai parameters
    proxyHelper = new ProxyHelper()
    proxyHelper.setAzureOpenai(resourceName);

    testGetSimpleContext(proxyHelper, modelName);
    testGetRoleContext(proxyHelper, modelName);

})();