require('dotenv').config();
const GoogleAIWrapper = require('../wrappers/GoogleAIWrapper');

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

async function testGenerateText() {
  try {
    const params = {
      context: 'Node.js development',
      examples: [],
      messages: [{role: 'assistant', content: 'Help me with Node.js basics.'}],
      temperature: 0.5,
      maxOutputTokens: 100,
      topK: 10,
      topP: 0.9,
    };

    const result = await googleAI.generateText(params);
    console.log('Generate Text Result:', result);
  } catch (error) {
    console.error('Generate Text Error:', error);
  }
}


async function testGenerateEmbed() {
  try {
    const params = {
      content: 'connect to any AI model using Intelligent node',
    };

    const result = await googleAI.getEmbeddings(params);
    console.log('Generate embedding Result:', result);
  } catch (error) {
    console.error('Generate Text Error:', error);
  }
}

(async () => {
  console.log('## test audio generation ##')
  // await testGenerateSpeech();
  console.log('## test text generation ##')
  await testGenerateText();
  console.log('## test embed generation ##')
  await testGenerateEmbed();

})();