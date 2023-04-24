const { RemoteSpeechModel, Text2SpeechInput } = require('intellinode');

async function generateSpeech(apiKey, text, language) {
  const speechModel = new RemoteSpeechModel(apiKey);
  const input = new Text2SpeechInput({ text: text, language: language });
  const audioContent = await speechModel.generateSpeech(input);
  console.log('Generated speech:', audioContent);
}

(async () => {
  // Generate speech
  const apiKey = 'your-api-key';
  const text = 'Welcome to Intelligent Node';
  const language = 'en-gb';

  await generateSpeech(apiKey, text, language);
})();