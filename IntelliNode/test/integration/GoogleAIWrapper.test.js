require('dotenv').config();
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

(async () => {
  await testGenerateSpeech();
})();