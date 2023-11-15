require('dotenv').config();
const config = require('../../config.json');
const ReplicateWrapper = require('../../wrappers/ReplicateWrapper');

const replicateWrapper = new ReplicateWrapper(
  process.env.REPLICATE_API_KEY
);

async function testReplicateWrapperLLama() {
  try {
    const modelName = config.models.replicate.llama['13b-chat'];
    const version = config.models.replicate.llama['13b-chat-version'];
    const inputData = {
      version: version,
      input: {
        prompt: 'Hello, LLama. introduce your self!',
        system_prompt:
          'You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe...',
        max_new_tokens: 500,
        temperature: 0.5,
        top_p: 1,
        repetition_penalty: 1,
        debug: false,
      },
    };

    const prediction = await replicateWrapper.predict(
      modelName,
      inputData
    );

    // check for the response every second
    const poll = setInterval(async () => {
      const status = await replicateWrapper.getPredictionStatus(
        prediction.id
      );

      console.log('the current status: ', status.status);

      if (
        status.status === 'succeeded' ||
        status.status === 'failed'
      ) {
        clearInterval(poll); // stop polling if prediction has completed or failed

        if (status.status === 'succeeded') {
          console.log(
            'LLama Predict Result:',
            status.output.join('')
          );
        } else {
          console.error('LLama Prediction Failed:', status.error);
        }
      }
    }, 1000);
  } catch (error) {
    console.error('LLama Error:', error);
  }
}

async function testReplicateLLamaCoder() {
  try {
    const modelName = config.models.replicate.llama['34b-python'];
    const version =
      config.models.replicate.llama['13b-code-instruct-version'];
    const inputData = {
      version: version,
      input: {
        prompt: '# function that adds 2 number inputs.',
        max_new_tokens: 128,
        top_k: 50,
        top_p: 0.9,
        temperature: 0.1,
        min_new_tokens: -1,
        debug: false,
        stop_sequences: '<end>',
      },
    };

    const prediction = await replicateWrapper.predict(
      modelName,
      inputData
    );

    // check for the response every second
    const poll = setInterval(async () => {
      const status = await replicateWrapper.getPredictionStatus(
        prediction.id
      );

      console.log('the current status: ', status.status);

      if (
        status.status === 'succeeded' ||
        status.status === 'failed'
      ) {
        clearInterval(poll); // stop polling if prediction has completed or failed

        if (status.status === 'succeeded') {
          console.log(
            'LLama Predict Result:',
            status.output.join('')
          );
        } else {
          console.error('LLama Prediction Failed:', status.error);
        }
      }
    }, 1000);
  } catch (error) {
    console.error('LLama Error:', error);
  }
}

async function testReplicateLLamaEmbeddings() {
  try {
    const modelName = config.models.replicate.llama['llama-2-13b-embeddings'];
    const version = config.models.replicate.llama['llama-2-13b-embeddings-version'];
    const inputData = {
      version: version,
      input: {
        prompts: "cat\n\ndog\n\nmetallica",
        prompt_separator: "\n\n"
      },
    };

    const prediction = await replicateWrapper.predict(modelName, inputData);

    const poll = setInterval(async () => {
      const status = await replicateWrapper.getPredictionStatus(prediction.id);

      console.log('Current status:', status.status);

      if (status.status === 'succeeded' || status.status === 'failed') {
        clearInterval(poll);

        if (status.status === 'succeeded') {
          console.log('LLama Embeddings Result:', status.output);
          console.log('LLama Embeddings Size:', status.output.length);
        } else {
          console.error('LLama Embeddings Prediction Failed:', status.error);
        }
      }
    }, 1000);
  } catch (error) {
    console.error('LLama Embeddings Error:', error);
  }
}

(async () => {
  // test LLama v2 from Replicate host
  // await testReplicateWrapperLLama();

  // test LLama v2 coder
  // await testReplicateLLamaCoder();

  // test embeddings
  await testReplicateLLamaEmbeddings();
})();
