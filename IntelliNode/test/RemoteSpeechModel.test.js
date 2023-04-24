const fs = require('fs');
require('dotenv').config();
const assert = require('assert');
const { RemoteSpeechModel, SupportedSpeechModels } = require('../controller/RemoteSpeechModel');
const Text2SpeechInput = require('../model/input/Text2SpeechInput');
const AudioHelper = require('../utils/AudioHelper');

const remoteSpeechModel = new RemoteSpeechModel(process.env.GOOGLE_API_KEY, SupportedSpeechModels.GOOGLE);
const audioHelper = new AudioHelper();

async function testGenerateSpeech() {
  try {

    const tempDir = '../temp';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const input = new Text2SpeechInput({text: 'Welcome to Intelligent Node',
                                        language: 'en-gb'});

    const audioContent = await remoteSpeechModel.generateSpeech(input);

    assert(audioContent.length > 0, 'testGenerateSpeech response length should be greater than 0');

    const decodedAudio = audioHelper.decode(audioContent);
    const saved = audioHelper.saveAudio(decodedAudio, tempDir, 'temp.mp3');
    assert(saved, 'Audio file should be saved successfully');

    console.log('Test passed: Audio generated and saved successfully');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

(async () => {
  await testGenerateSpeech();
})();
