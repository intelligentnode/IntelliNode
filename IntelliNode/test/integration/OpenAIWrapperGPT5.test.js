require('dotenv').config();
const assert = require('assert');
const OpenAIWrapper = require('../../wrappers/OpenAIWrapper');

const apiKey = process.env.OPENAI_API_KEY;

async function testGPT5BasicResponse() {
  try {
    console.log('\n=== GPT-5 Basic Response Test ===\n');
    
    const wrapper = new OpenAIWrapper(apiKey);
    
    const params = {
      model: 'gpt-5',
      input: 'Write a haiku about code.',
      reasoning: { effort: 'low' }
    };

    const result = await wrapper.generateGPT5Response(params);
    
    console.log('GPT-5 Response:', result);
    console.log('Output:', result.output);
    
    assert(result.output, "GPT-5 response should have output field");
    assert(Array.isArray(result.output), "GPT-5 output should be an array");
    assert(result.output.length > 0, "GPT-5 output array should not be empty");
    
    // Extract and validate the message content
    const messageItems = result.output.filter(item => item.type === 'message');
    assert(messageItems.length > 0, "GPT-5 output should contain at least one message");
    console.log('Message content:', messageItems[0].content);
    
    console.log('✓ Test passed: GPT-5 basic response works correctly\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT5MinimalEffort() {
  try {
    console.log('\n=== GPT-5 Minimal Effort Test ===\n');
    
    const wrapper = new OpenAIWrapper(apiKey);
    
    const params = {
      model: 'gpt-5',
      input: 'What is 2 + 2?',
      reasoning: { effort: 'minimal' }
    };

    const result = await wrapper.generateGPT5Response(params);
    
    console.log('GPT-5 Response:', result);
    console.log('Output:', result.output);
    
    assert(result.output, "GPT-5 response should have output field");
    assert(Array.isArray(result.output), "GPT-5 output should be an array");
    console.log('✓ Test passed: GPT-5 minimal effort works\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT5MediumEffort() {
  try {
    console.log('\n=== GPT-5 Medium Effort Test ===\n');
    
    const wrapper = new OpenAIWrapper(apiKey);
    
    const params = {
      model: 'gpt-5',
      input: 'Explain quantum computing in simple terms.',
      reasoning: { effort: 'medium' }
    };

    const result = await wrapper.generateGPT5Response(params);
    
    console.log('GPT-5 Response:', result);
    console.log('Output:', result.output);
    
    assert(result.output, "GPT-5 response should have output field");
    assert(Array.isArray(result.output), "GPT-5 output should be an array");
    console.log('✓ Test passed: GPT-5 medium effort works\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT5HighEffort() {
  try {
    console.log('\n=== GPT-5 High Effort Test ===\n');
    
    const wrapper = new OpenAIWrapper(apiKey);
    
    const params = {
      model: 'gpt-5',
      input: 'How much gold would it take to coat the Statue of Liberty in a 1mm layer?',
      reasoning: { effort: 'high' }
    };

    const result = await wrapper.generateGPT5Response(params);
    
    console.log('GPT-5 Response:', result);
    console.log('Output:', result.output);
    
    assert(result.output, "GPT-5 response should have output field");
    assert(Array.isArray(result.output), "GPT-5 output should be an array");
    console.log('✓ Test passed: GPT-5 high effort works\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT5WithMaxOutputTokens() {
  try {
    console.log('\n=== GPT-5 With Max Output Tokens Test ===\n');
    
    const wrapper = new OpenAIWrapper(apiKey);
    
    const params = {
      model: 'gpt-5',
      input: 'Write a short story about a robot.',
      reasoning: { effort: 'medium' },
      max_output_tokens: 100
    };

    const result = await wrapper.generateGPT5Response(params);
    
    console.log('GPT-5 Response:', result);
    console.log('Output:', result.output);
    
    assert(result.output, "GPT-5 response should have output field");
    assert(Array.isArray(result.output), "GPT-5 output should be an array");
    console.log('✓ Test passed: GPT-5 with max_output_tokens works\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

async function testGPT5ComplexQuery() {
  try {
    console.log('\n=== GPT-5 Complex Query Test ===\n');
    
    const wrapper = new OpenAIWrapper(apiKey);
    
    const params = {
      model: 'gpt-5',
      input: 'system: You are a helpful coding assistant.\nuser: How do I implement a binary search tree in JavaScript?',
      reasoning: { effort: 'medium' }
    };

    const result = await wrapper.generateGPT5Response(params);
    
    console.log('GPT-5 Response:', result);
    console.log('Output length:', result.output ? result.output.length : 0);
    
    assert(result.output, "GPT-5 response should have output field");
    assert(Array.isArray(result.output), "GPT-5 output should be an array");
    console.log('✓ Test passed: GPT-5 complex query works\n');
  } catch (error) {
    console.error('✗ Test failed with exception:', error.message);
    throw error;
  }
}

(async () => {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   OpenAI GPT-5 Wrapper Tests          ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  try {
    await testGPT5BasicResponse();
    await testGPT5MinimalEffort();
    await testGPT5MediumEffort();
    await testGPT5HighEffort();
    await testGPT5WithMaxOutputTokens();
    await testGPT5ComplexQuery();
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   All GPT-5 Wrapper Tests Passed! ✓   ║');
    console.log('╚════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n✗ Test suite failed');
    process.exit(1);
  }
})();

