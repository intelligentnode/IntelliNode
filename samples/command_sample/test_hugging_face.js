const { HuggingWrapper } =  require('intellinode');
// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

// common object
const huggingWrapper = new HuggingWrapper(process.env.HUGGING_API_KEY);

async function testSummarizationTask() {
  const inputData = { inputs: 'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building...' };
  // facebook/bart-large-cnn is the model id
  const result = await huggingWrapper.generateText('facebook/bart-large-cnn', inputData);
  console.log('Summarization Task Result:', result);
}

async function testImageClassificationTask(imagePath) {
  const imageData = require('fs').readFileSync(imagePath);
  const result = await huggingWrapper.processImage('google/vit-base-patch16-224', imageData);
  console.log('Image Classification Task Result:', result);
}

(async () => {
  // test text
  await testSummarizationTask();
  
  // test image
  const args = process.argv.slice(2);
  const imagePath = args[0];

  if (imagePath) {
    await testImageClassificationTask(imagePath);
  } else {
    console.log('Image file not provided. Skipping Image Classification Task.');
  }

})();
