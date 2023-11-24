require('dotenv').config();
const fs = require('fs');

const GoogleAIWrapper = require('../../wrappers/GoogleAIWrapper');

const googleAI = new GoogleAIWrapper(process.env.GOOGLE_API_KEY);

async function testGenerateSpeech() {
  try {
    const params = {
      text: 'Welcome to IntelliNode',
      languageCode: 'en-US',
      name: 'en-US-Wavenet-A',
      ssmlGender: 'MALE',
    };

    const result = await googleAI.generateSpeech(params);
    console.log('Generate Speech Result:', result['audioContent']);
  } catch (error) {
    console.error('Generate Speech Error:', error);
  }
}
async function testImageToText() {
  try {
    const filePath = 'images/llama_sagemaker/s5_gateway.png'
    const data = fs.readFileSync(filePath);
    // Convert data to base64
    const base64Data = Buffer.from(data).toString('base64');

    const params = {
      content: base64Data
    }

    const [result] = await googleAI.imageToText(params);
    const detectedText = result.textAnnotations.map((annotation) => annotation.description);
    console.log('Generate Result:', detectedText);
  } catch (error) {
    console.error('Generate Speech Error:', error);
  }
}

(async () => {
  await testGenerateSpeech();
  await testImageToText();
})();