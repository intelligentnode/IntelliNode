const { HuggingWrapper } =  require('intellinode');
// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

// common object
const huggingWrapper = new HuggingWrapper(process.env.HUGGING_API_KEY);

async function testSummarizationTask() {
  try {
    const modelId = 'facebook/bart-large-cnn';
    const inputData = { inputs: 'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building...' };
    const result = await huggingWrapper.generateText(modelId, inputData);
    console.log('Summarization Task Result:', result);
  } catch (error) {
    console.error('Summarization Task Error:', error);
  }
}

async function testImageClassificationTask(imagePath) {
  try {
    const modelId = 'google/vit-base-patch16-224';
    const imageData = require('fs').readFileSync(imagePath);
    const result = await huggingWrapper.processImage(modelId, imageData);
    console.log('Image Classification Task Result:', result);
  } catch (error) {
    console.error('Image Classification Task Error:', error);
  }
}

(async () => {
  // test text
  await testSummarizationTask();
  
  // text image
  const args = process.argv.slice(2);
  const imagePath = args[0];

  if (imagePath) {
    await testImageClassificationTask(imagePath);
  } else {
    console.log('Image file not provided. Skipping Image Classification Task.');
  }

})();
