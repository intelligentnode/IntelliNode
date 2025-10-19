require('dotenv').config();
const assert = require('assert');
const { Chatbot, SupportedChatModels } = require('../../function/Chatbot');
const { ChatGPTInput, ChatGPTMessage } = require('../../model/input/ChatModelInput');

const apiKey = process.env.OPENAI_API_KEY;

async function testGPT5ChatbotDefaultModel() {
  try {
    console.log('\n=== GPT-5 Chatbot Default Model Test ===\n');
    
    const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);
    
    // Using default model (should be gpt-5)
    const input = new ChatGPTInput('You are a helpful assistant.');
    input.addUserMessage('What is the capital of France?');
    
    const responses = await bot.chat(input);
    
    console.log('Responses:', responses);
    
    assert(responses.length > 0, "Should receive at least one response");
    assert(typeof responses[0] === 'string', "Response should be a string");
    assert(responses[0].length > 0, "Response should not be empty");
    
    console.log('✓ Test passed: GPT-5 default model works\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT5ChatbotExplicitModel() {
  try {
    console.log('\n=== GPT-5 Chatbot Explicit Model Test ===\n');
    
    const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);
    
    // Explicitly setting GPT-5
    const input = new ChatGPTInput('You are a helpful assistant.', { model: 'gpt-5' });
    input.addUserMessage('Write a haiku about programming.');
    
    const responses = await bot.chat(input);
    
    console.log('Responses:', responses);
    
    assert(responses.length > 0, "Should receive at least one response");
    assert(typeof responses[0] === 'string', "Response should be a string");
    
    console.log('✓ Test passed: GPT-5 explicit model works\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT5ChatbotMinimalEffort() {
  try {
    console.log('\n=== GPT-5 Chatbot Minimal Effort Test ===\n');
    
    const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);
    
    const input = new ChatGPTInput('You are a helpful assistant.', { 
      model: 'gpt-5',
      effort: 'minimal'
    });
    input.addUserMessage('What is 5 times 7?');
    
    const responses = await bot.chat(input);
    
    console.log('Responses:', responses);
    
    assert(responses.length > 0, "Should receive at least one response");
    console.log('✓ Test passed: GPT-5 minimal effort works\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT5ChatbotLowEffort() {
  try {
    console.log('\n=== GPT-5 Chatbot Low Effort Test ===\n');
    
    const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);
    
    const input = new ChatGPTInput('You are a helpful assistant.', { 
      model: 'gpt-5',
      effort: 'low'
    });
    input.addUserMessage('Explain photosynthesis briefly.');
    
    const responses = await bot.chat(input);
    
    console.log('Responses:', responses);
    
    assert(responses.length > 0, "Should receive at least one response");
    console.log('✓ Test passed: GPT-5 low effort works\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT5ChatbotMediumEffort() {
  try {
    console.log('\n=== GPT-5 Chatbot Medium Effort Test ===\n');
    
    const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);
    
    const input = new ChatGPTInput('You are a helpful assistant.', { 
      model: 'gpt-5',
      effort: 'medium'
    });
    input.addUserMessage('Explain the concept of recursion in programming.');
    
    const responses = await bot.chat(input);
    
    console.log('Responses:', responses);
    
    assert(responses.length > 0, "Should receive at least one response");
    console.log('✓ Test passed: GPT-5 medium effort works\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT5ChatbotHighEffort() {
  try {
    console.log('\n=== GPT-5 Chatbot High Effort Test ===\n');
    
    const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);
    
    const input = new ChatGPTInput('You are a helpful assistant.', { 
      model: 'gpt-5',
      effort: 'high'
    });
    input.addUserMessage('How would you design a distributed cache system for a global e-commerce platform?');
    
    const responses = await bot.chat(input);
    
    console.log('Responses:', responses);
    console.log('Response length:', responses[0] ? responses[0].length : 0);
    
    assert(responses.length > 0, "Should receive at least one response");
    console.log('✓ Test passed: GPT-5 high effort works\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT5ChatbotMultiMessage() {
  try {
    console.log('\n=== GPT-5 Chatbot Multi-Message Test ===\n');
    
    const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);
    
    const input = new ChatGPTInput('You are a helpful math tutor.', { 
      model: 'gpt-5',
      effort: 'medium'
    });
    input.addUserMessage('What is a prime number?');
    input.addAssistantMessage('A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.');
    input.addUserMessage('Give me three examples.');
    
    const responses = await bot.chat(input);
    
    console.log('Responses:', responses);
    
    assert(responses.length > 0, "Should receive at least one response");
    console.log('✓ Test passed: GPT-5 multi-message conversation works\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT5ChatbotWithMaxOutputTokens() {
  try {
    console.log('\n=== GPT-5 Chatbot With Max Output Tokens Test ===\n');
    
    const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);
    
    const input = new ChatGPTInput('You are a helpful assistant.', { 
      model: 'gpt-5',
      effort: 'low',
      maxTokens: 50
    });
    input.addUserMessage('Describe the solar system.');
    
    const responses = await bot.chat(input);
    
    console.log('Responses:', responses);
    
    assert(responses.length > 0, "Should receive at least one response");
    console.log('✓ Test passed: GPT-5 with max output tokens works\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT5ChatbotComplexReasoning() {
  try {
    console.log('\n=== GPT-5 Chatbot Complex Reasoning Test ===\n');
    
    const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);
    
    const input = new ChatGPTInput('You are a helpful assistant.', { 
      model: 'gpt-5',
      effort: 'high'
    });
    input.addUserMessage('If a train leaves Station A at 2 PM traveling at 60 mph and another train leaves Station B at 3 PM traveling at 80 mph toward Station A, and the stations are 300 miles apart, when will they meet?');
    
    const responses = await bot.chat(input);
    
    console.log('Responses:', responses);
    
    assert(responses.length > 0, "Should receive at least one response");
    console.log('✓ Test passed: GPT-5 complex reasoning works\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT4BackwardCompatibility() {
  try {
    console.log('\n=== GPT-4 Backward Compatibility Test ===\n');
    
    const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);
    
    // Using GPT-4 to ensure backward compatibility
    const input = new ChatGPTInput('You are a helpful assistant.', { model: 'gpt-4o' });
    input.addUserMessage('What is the meaning of life?');
    
    const responses = await bot.chat(input);
    
    console.log('Responses:', responses);
    
    assert(responses.length > 0, "Should receive at least one response");
    assert(typeof responses[0] === 'string', "Response should be a string");
    
    console.log('✓ Test passed: GPT-4 backward compatibility maintained\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT5StreamingError() {
  try {
    console.log('\n=== GPT-5 Streaming Error Test ===\n');
    
    const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);
    
    const input = new ChatGPTInput('You are a helpful assistant.', { model: 'gpt-5' });
    input.addUserMessage('Test streaming');
    
    let errorOccurred = false;
    try {
      for await (const chunk of bot.stream(input)) {
        console.log('Chunk:', chunk);
      }
    } catch (error) {
      errorOccurred = true;
      console.log('Expected error:', error.message);
    }
    
    assert(errorOccurred, "Streaming should throw an error for GPT-5");
    console.log('✓ Test passed: GPT-5 streaming correctly throws error\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

(async () => {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║      Chatbot GPT-5 Tests               ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  try {
    await testGPT5ChatbotDefaultModel();
    await testGPT5ChatbotExplicitModel();
    await testGPT5ChatbotMinimalEffort();
    await testGPT5ChatbotLowEffort();
    await testGPT5ChatbotMediumEffort();
    await testGPT5ChatbotHighEffort();
    await testGPT5ChatbotMultiMessage();
    await testGPT5ChatbotWithMaxOutputTokens();
    await testGPT5ChatbotComplexReasoning();
    await testGPT4BackwardCompatibility();
    await testGPT5StreamingError();
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   All Chatbot GPT-5 Tests Passed! ✓   ║');
    console.log('╚════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n✗ Test suite failed');
    process.exit(1);
  }
})();

