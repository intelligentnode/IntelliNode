require('dotenv').config();
const assert = require('assert');
const NvidiaWrapper = require('../../wrappers/NvidiaWrapper');

const nvidia = new NvidiaWrapper(process.env.NVIDIA_API_KEY);

async function testNvidiaGenerateText(mode_name) {
  try {
    console.log('--- NVIDIA Generate Text ---\n');
    const params = {
      model: mode_name,
      messages: [
        {
          role: 'user',
          content: 'Which number is larger, 9.11 or 9.8?',
        },
      ],
      max_tokens: 1024,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 0.7,
      temperature: 0.6,
      stream: false,
    };

    const result = await nvidia.generateText(params);
    console.log('NVIDIA deepseek response:', JSON.stringify(result, null, 2));

    // Basic check that we have at least one choice
    assert(
      result.choices && result.choices.length > 0,
      'Nvidia response should contain at least one choice'
    );

  } catch (error) {
    console.error('Nvidia Error:', error);
  }
}

async function testNvidiaStream(model_name) {
  try {
    console.log('--- NVIDIA Streaming ---\n');
    const params = {
      model: model_name,
      messages: [
        {
          role: 'user',
          content: 'Write a limerick about the wonders of GPU computing.'
        }
      ],
      max_tokens: 1024,
      temperature: 0.2,
      stream: true, // force streaming
    };

    const stream = await nvidia.generateTextStream(params);
    console.log('--- NVIDIA Streaming ---\n');

    for await (const chunk of stream) {
      // The chunk is likely raw text or JSON lines. 
      // If you want to parse partial JSON events, do so here.
      process.stdout.write(chunk.toString('utf8'));
    }

    console.log('\n--- End of NVIDIA Streaming ---\n');

  } catch (error) {
    console.error('Nvidia Streaming Error:', error);
  }
}

async function testNvidiaDeepSeekStream(model_name) {
  try {
    const nvidia = new NvidiaWrapper(process.env.NVIDIA_API_KEY);
    const params = {
      model: model_name,
      messages: [
        {
          role: 'user',
          content: 'Write a short poem about the future of GPUs.'
        }
      ],
      max_tokens: 256,
      temperature: 0.6
    };

    const stream = await nvidia.generateTextStream(params);

    console.log('\n--- NVIDIA Deep Seek Streaming ---\n');
    for await (const chunk of stream) {
      process.stdout.write(chunk.toString('utf8'));
    }
    console.log('\n--- End of Deep Seek Streaming ---\n');
  } catch (error) {
    console.error('Error during Deep Seek stream:', error);
  }
}

(async () => {
  await testNvidiaGenerateText('deepseek-ai/deepseek-r1');
  await testNvidiaStream('meta/llama-3.3-70b-instruct');
  await testNvidiaDeepSeekStream('deepseek-ai/deepseek-r1');
})();
