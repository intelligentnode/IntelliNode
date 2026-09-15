/**
 * ChatGPT-5.5 Example
 * 
 * This example demonstrates how to use ChatGPT-5 with IntelliNode.
 * GPT-5.5 is the default model with advanced reasoning capabilities.
 * 
 * Prerequisites:
 * - Set OPENAI_API_KEY in .env file
 * - npm install intellinode
 * 
 * Usage: node test_gpt5_example.js
 */

require("dotenv").config();
const { Chatbot, ChatGPTInput, SupportedChatModels } = require('intellinode');

// Initialize chatbot
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('❌ Error: OPENAI_API_KEY not set in .env file');
  console.error('Please add: OPENAI_API_KEY=your_key_here');
  process.exit(1);
}

const bot = new Chatbot(apiKey, SupportedChatModels.OPENAI);

// ============================================
// Example 1: Default GPT-5.5 with Low Effort
// ============================================
async function exampleDefaultGPT5() {
  try {
    console.log('\n=== Example 1: Default GPT-5.5 (Low Effort) ===\n');
    
    const input = new ChatGPTInput('You are a helpful assistant.');
    input.addUserMessage('What is the capital of France?');
    
    console.log('Sending request to GPT-5.5 (default)...');
    const responses = await bot.chat(input);
    
    console.log('\n📝 Response:');
    console.log(responses[0]);
    console.log('\n✓ Example 1 completed\n');
  } catch (error) {
    console.error('✗ Example 1 failed:', error.message);
  }
}

// ============================================
// Example 2: No Reasoning Effort (Fastest)
// ============================================
async function exampleMinimalEffort() {
  try {
    console.log('\n=== Example 2: GPT-5.5 with No Reasoning Effort ===\n');
    
    const input = new ChatGPTInput('You are a helpful assistant.', {
      model: 'gpt-5.5',
      effort: 'none'
    });
    input.addUserMessage('What is 5 times 7?');
    
    console.log('Sending request with no reasoning effort (fastest)...');
    const responses = await bot.chat(input);
    
    console.log('\n📝 Response:');
    console.log(responses[0]);
    console.log('\n✓ Example 2 completed\n');
  } catch (error) {
    console.error('✗ Example 2 failed:', error.message);
  }
}

// ============================================
// Example 3: High Reasoning Effort (Slow, Most Thorough)
// ============================================
async function exampleHighEffort() {
  try {
    console.log('\n=== Example 3: GPT-5.5 with High Effort ===\n');
    
    const input = new ChatGPTInput('You are a helpful assistant.', {
      model: 'gpt-5.5',
      effort: 'high'
    });
    input.addUserMessage('Explain quantum computing in simple terms.');
    
    console.log('Sending request with high reasoning effort (most thorough)...');
    const responses = await bot.chat(input);
    
    console.log('\n📝 Response:');
    console.log(responses[0]);
    console.log('\n✓ Example 3 completed\n');
  } catch (error) {
    console.error('✗ Example 3 failed:', error.message);
  }
}

// ============================================
// Example 4: Using GPT-4o (Backward Compatibility)
// ============================================
async function exampleGPT4Compatibility() {
  try {
    console.log('\n=== Example 4: Using GPT-4o (Backward Compatible) ===\n');
    
    const input = new ChatGPTInput('You are a helpful assistant.', {
      model: 'gpt-4o'
    });
    input.addUserMessage('What are the benefits of AI?');
    
    console.log('Sending request to GPT-4o...');
    const responses = await bot.chat(input);
    
    console.log('\n📝 Response:');
    console.log(responses[0]);
    console.log('\n✓ Example 4 completed\n');
  } catch (error) {
    console.error('✗ Example 4 failed:', error.message);
  }
}

// ============================================
// Example 5: Conversation with Multiple Messages
// ============================================
async function exampleConversation() {
  try {
    console.log('\n=== Example 5: Multi-turn Conversation ===\n');
    
    const input = new ChatGPTInput('You are a helpful assistant.', {
      model: 'gpt-5.5',
      effort: 'medium'
    });
    
    input.addUserMessage('What is the Fibonacci sequence?');
    input.addAssistantMessage('The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8, 13...');
    input.addUserMessage('Can you give me the first 10 numbers?');
    
    console.log('Sending multi-turn conversation to GPT-5.5...');
    const responses = await bot.chat(input);
    
    console.log('\n📝 Response:');
    console.log(responses[0]);
    console.log('\n✓ Example 5 completed\n');
  } catch (error) {
    console.error('✗ Example 5 failed:', error.message);
  }
}

// ============================================
// Run Examples
// ============================================
(async () => {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║         GPT-5.5 Examples with IntelliNode          ║');
  console.log('╚════════════════════════════════════════════════════╝');

  try {
    // Run examples sequentially
    await exampleDefaultGPT5();
    await exampleMinimalEffort();
    await exampleHighEffort();
    await exampleGPT4Compatibility();
    await exampleConversation();

    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║            All examples completed! ✓               ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n✗ Examples failed:', error.message);
    process.exit(1);
  }
})();
