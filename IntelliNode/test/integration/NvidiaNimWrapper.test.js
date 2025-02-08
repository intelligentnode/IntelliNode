require('dotenv').config();
const assert = require('assert');
const NvidiaWrapper = require('../../wrappers/NvidiaWrapper');

// localBaseUrl default value (http://localhost:8000) for local testing
const localBaseUrl = process.env.NVIDIA_NIM_BASE_URL || 'http://localhost:8000';
const apiKey = process.env.NVIDIA_API_KEY;
const nvidiaLocal = new NvidiaWrapper(apiKey, { baseUrl: localBaseUrl });

/**
 * Test chat completions (non-streaming) using NVIDIA NIM.
 */
async function testNimChatCompletion() {
  console.log('--- Testing NVIDIA NIM Chat Completion ---');
  const params = {
    model: 'meta/llama-3.1-8b-instruct',
    messages: [
      { role: 'user', content: 'Write a limerick about GPU computing.' }
    ],
    max_tokens: 64,
    temperature: 0.5,
    top_p: 1,
    stream: false
  };

  try {
    const response = await nvidiaLocal.generateText(params);
    console.log('Chat Completion Response:', JSON.stringify(response, null, 2));
    assert(response.choices && response.choices.length > 0, 'No choices returned from chat completion');
  } catch (error) {
    console.error('Error in chat completion:', error);
  }
}

/**
 * Test chat completions using streaming via NVIDIA NIM.
 */
async function testNimChatStream() {
  console.log('--- Testing NVIDIA NIM Chat Streaming ---');
  const params = {
    model: 'meta/llama-3.1-8b-instruct',
    messages: [
      { role: 'user', content: 'Compose a short poem about GPUs.' }
    ],
    max_tokens: 64,
    temperature: 0.5,
    top_p: 1,
    stream: true
  };

  try {
    const stream = await nvidiaLocal.generateTextStream(params);
    let collected = '';
    // For Node.js, we assume the returned stream is a ReadableStream.
    for await (const chunk of stream) {
      const text = chunk.toString('utf8');
      process.stdout.write(text);
      collected += text;
    }
    console.log('\nCollected stream output:', collected);
    assert(collected.length > 0, 'No text received in streaming response');
  } catch (error) {
    console.error('Error in streaming chat:', error);
  }
}

/**
 * Test embeddings using NVIDIA NIM.
 */
async function testNimEmbeddings() {
  console.log('--- Testing NVIDIA NIM Embeddings ---');
  const params = {
    input: ['What is the capital of France?'],
    model: 'snowflake/arctic-embed-l', 
    input_type: 'query',
    encoding_format: 'float',
    truncate: 'NONE'
  };

  try {
    const embeddings = await nvidiaLocal.generateEmbeddings(params);
    console.log('Embeddings Response:', embeddings);
    // expect array
    assert(Array.isArray(embeddings), 'Embeddings response should be an array');
    embeddings.forEach((emb, idx) => {
      if (typeof emb !== 'number') {
        if (Array.isArray(emb)) {
          assert(typeof emb[0] === 'number', `Embedding at index ${idx} is not numeric`);
        }
      }
    });
  } catch (error) {
    console.error('Error in embeddings:', error);
  }
}

(async () => {
  await testNimChatCompletion();
  await testNimChatStream();
  //await testNimEmbeddings();
})();
