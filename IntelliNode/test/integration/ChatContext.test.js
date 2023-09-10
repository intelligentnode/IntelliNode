const ChatContext = require('../../utils/ChatContext');
require("dotenv").config();
const assert = require('assert');

const apiKey = process.env.OPENAI_API_KEY;

async function testGetSimpleContext() {
  const context = new ChatContext(apiKey);
  const userMessage = "Hello";
  const historyMessages = ["Good morning", "Dinner time", "How can I help you?", "Hello"];
  const n = 3;

  const resultContext = await context.getStringContext(userMessage, historyMessages, n);

  console.log('result: ', resultContext)

  assert.strictEqual(resultContext.length, n);
}

// Test for getRoleContext
async function testGetRoleContext() {

  const context = new ChatContext(apiKey);
  const userMessage = "Hello";
  const historyMessages = [
    { role: 'user', content: 'Dinner time' },
    { role: 'user', content: 'Good Morning' },
    { role: 'assistant', content: 'How can I help you?' },
    { role: 'user', content: 'Hello' }
  ];
  const n = 3;

  const resultContext = await context.getRoleContext(userMessage, historyMessages, n);

  console.log('resultContext: ', resultContext)

  assert.strictEqual(resultContext.length, n);

}


(async () => {
    testGetSimpleContext();
    testGetRoleContext();
})();