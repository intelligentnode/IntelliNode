require('dotenv').config();
const config = require('../../utils/Config2').getInstance();
const ReplicateWrapper = require('../../wrappers/ReplicateWrapper');

const replicateWrapper = new ReplicateWrapper(process.env.REPLICATE_API_KEY);

async function testReplicateWrapperLLama() {
  try {

    const modelName = config.getProperty('models.replicate.llama.13b');
    const version = config.getProperty('models.replicate.llama.13b-chat-version');
    const inputData = { version: version,
                input: { prompt: 'Hello, LLama. introduce your self!',
                        system_prompt: 'You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe...',
                        max_new_tokens: 500,
                        temperature: 0.5,
                        top_p: 1,
                        repetition_penalty: 1,
                        debug: false } };

    const prediction = await replicateWrapper.predict(modelName, inputData);

    // check for the response every second
    const poll = setInterval(async () => {
      const status = await replicateWrapper.getPredictionStatus(prediction.id);

      console.log('the current status: ', status.status)

      if (status.status === 'succeeded' || status.status === 'failed') {
        clearInterval(poll); // stop polling if prediction has completed or failed

        if (status.status === 'succeeded') {
          console.log('LLama Predict Result:', status.output.join(''));
        } else {
          console.error('LLama Prediction Failed:', status.error);
        }
      }
    }, 1000);

  } catch (error) {
    console.error('LLama Error:', error);
  }
}

(async () => {
  // test LLama v2 from Replicate host
  await testReplicateWrapperLLama();
})();