const fs = require('fs');
require('dotenv').config();
const assert = require('assert');
// const { RemoteSpeechModel, SupportedSpeechModels } = require('../controller/RemoteSpeechModel');
const { RemoteSpeechModel, SupportedSpeechModels } = require('../../controller/RemoteSpeechModel')
const Text2SpeechInput = require('../../model/input/Text2SpeechInput');
const AudioHelper = require('../../utils/AudioHelper');

const remoteSpeechModel = new RemoteSpeechModel(process.env.GOOGLE_API_KEY, SupportedSpeechModels.GOOGLE);
const openAiRemoteSpeechModel = new RemoteSpeechModel(process.env.OPENAI_API_KEY, SupportedSpeechModels.OPENAI);
const audioHelper = new AudioHelper();

async function testGenerateSpeech() {
  try {

    const tempDir = '../temp';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const input = new Text2SpeechInput({
      text: 'Welcome to Intelligent Node',
      language: 'en-gb'
    });

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

async function testOpenAiGenerateSpeech() {
  try {
    const input = new Text2SpeechInput({
      model: 'tts-1',
      text: "The quick brown fox jumped over the lazy dog.",
      voice: "alloy",
      stream: true
    });

    const result = await openAiRemoteSpeechModel.generateSpeech(input);

    // Create a writable stream and pipe the response data to the stream
    const filePath = 'downloaded_audio.mp3'; // Replace with the desired file name and extension

    const writer = fs.createWriteStream(filePath);
    result.pipe(writer);

    // Handle the completion of writing the file
    writer.on('finish', () => {
      const fileExists = fs.existsSync(filePath);
      assert(fileExists === true, 'file should be generated on finish')
      console.log('Audio file downloaded successfully!');
    });

    // Handle any errors that may occur during the download process
    writer.on('error', (err) => {
      console.error('Error downloading the audio file:', err);
    });

  } catch (error) {
    console.error('Test failed:', error);
  }
}

(async () => {
  await testGenerateSpeech();
  await testOpenAiGenerateSpeech();
})();
