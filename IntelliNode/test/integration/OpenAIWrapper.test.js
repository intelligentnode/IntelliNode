require('dotenv').config();
const assert = require('assert');
const FormData = require("form-data");
const { GPTStreamParser } = require('../../utils/StreamParser');
const OpenAIWrapper = require('../../wrappers/OpenAIWrapper');
const {
    createReadStream, readFileSync, createWriteStream, existsSync
} = require('fs');
const AudioHelper = require('../../utils/AudioHelper');

const openAI = new OpenAIWrapper(process.env.OPENAI_API_KEY);

async function testChatGPT() {
    try {
        const params = {
            model: 'gpt-4o',
            messages: [{
                role: 'system',
                content: 'You are a helpful assistant.'
            },
            {
                role: 'user',
                content: 'Generate a product description for black and white standing desk.'
            }
            ],
            max_tokens: 100,
            temperature: 0.8
        };

        const result = await openAI.generateChatText(params);
        const responseText = result['choices'][0]['message']['content'].trim();
        console.log('ChatGPT Result: \n', responseText, '\n');
        assert(responseText.length > 0, 'testChatGPT response length should be greater than 0');
    } catch (error) {
        console.error('ChatGPT Error:', error);
    }
}

async function testImageModel() {
    try {
        const params = {
            prompt: 'teddy writing a blog in times square',
            n: 1,
            size: '256x256'
        };

        const result = await openAI.generateImages(params);
        const responseUrl = result['data'][0]['url'].trim();
        console.log('Image Model Result:\n', responseUrl, '\n');
        assert(responseUrl.length > 0, 'testImageModel response length should be greater than 0');
    } catch (error) {
        console.error('Image Model Error:', error);
    }
}

async function testEmbeddings() {
    try {
        const params = {
            input: 'IntelliNode provide lightning-fast access to the latest deep learning models',
            model: 'text-embedding-3-small',
        };

        const result = await openAI.getEmbeddings(params);
        const embeddings = result['data'];
        console.log('Embeddings Result:\n', embeddings[0]['embedding'].slice(0, 50), '\n');
        assert(embeddings.length > 0, 'testEmbeddings response length should be greater than 0');
    } catch (error) {
        console.error('Embeddings Error:', error);
    }
}

async function testSpeechToText() {
    try {
        const audioFilePath = '../temp/test-audio.mp3'
        const form = new FormData();
        form.append('file', createReadStream(audioFilePath));
        form.append('model', 'whisper-1');

        const result = await openAI.speechToText(form, {
            ...form.getHeaders()
        });
        const responseUrl = result.text;
        console.log('Speech Model Result:\n', responseUrl, '\n');
        assert(responseUrl.length > 0, 'testSpeechToText response length should be greater than 0');
    } catch (error) {
        console.error('Image Model Error:', error);
    }
}

async function testChatGPTStream() {
    try {
        const params = {
            model: 'gpt-4',
            messages: [{
                role: 'system',
                content: 'You are a helpful assistant.'
            },
            {
                role: 'user',
                content: 'Generate a product description for black and white standing desk.'
            }
            ],
            max_tokens: 100,
            temperature: 0.8,
            stream: true
        };

        let responseChunks = '';
        const streamParser = new GPTStreamParser();

        const stream = await openAI.generateChatText(params);

        // Collect data from the stream
        for await (const chunk of stream) {
            const chunkText = chunk.toString('utf8');
            for await (const contentText of streamParser.feed(chunkText)) {
                console.log('result chunk:', contentText);
                responseChunks += contentText;
            }
        }

        console.log('Concatenated text: ', responseChunks);
        assert(responseChunks.length > 0, 'testChatGPTStream response length should be greater than 0');
    } catch (error) {
        console.error('ChatGPTStream Error:', error);
    }
}

async function testVisionImageToText() {
    try {
        const filePath = '../temp/test_image_desc.png'
        const data = readFileSync(filePath, { encoding: 'base64' });
        // Convert data to base64
        const params = {
            "model": "gpt-4-vision-preview",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "What's in this image?"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": `data:image/png;base64,${data}`
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 300
        };

        const result = await openAI.imageToText(params);
        const value = result.choices[0].message.content
        console.log('Vision Model Result:\n', value, '\n');
        assert(value.length > 0, 'testVisionImageToText response length should be greater than 0');
    } catch (error) {
        console.error('testVisionImageToText Error:', error);
    }
}

async function testTextToSpeech() {
    try {
        const payload = {
            model: 'tts-1',
            input: "The quick brown fox jumped over the lazy dog.",
            voice: "alloy",
            stream: true
        }
        const filePath = '../temp/downloaded_audio.mp3'; // Replace with the desired file name and extension

        const result = await openAI.textToSpeech(payload);
        // Create a writable stream and pipe the response data to the stream
        const writer = createWriteStream(filePath);
        result.pipe(writer);

        // Handle the completion of writing the file
        writer.on('finish', () => {
            const fileExists = existsSync(filePath);
            assert(fileExists === true, 'file should be generated on finish')
            console.log('Audio file downloaded successfully!');
        });

        // Handle any errors that may occur during the download process
        writer.on('error', (err) => {
            console.error('Error downloading the audio file:', err);
        });
    } catch (error) {
        console.error('Image Model Error:', error);
    }
}

async function testFineTuning() {
    try {
        const filePath = '../temp/training_data.jsonl'

        const filePayload = new FormData();
        filePayload.append('file', createReadStream(filePath));
        filePayload.append('purpose', 'fine-tune');

        const file = await openAI.uploadFile(filePayload)
        const payload = {
            model: 'gpt-3.5-turbo',
            training_file: file.id
        }
        const result = await openAI.storeFineTuningData(payload);
        const allFineTuneObjects = await openAI.listFineTuningData();
        const value = allFineTuneObjects.data.filter(b => b.id === result.id)
        console.log('Fine tuning Model Result:\n', value, '\n');
        assert(value.length > 0, 'testFineTuning response length should be greater than 0');

    } catch (error) {
        console.error('testFineTuning Error:', error);
    }
}

async function testGenerateChatAudio() {
    console.log('\n### testGenerateChatAudio ###\n');
    
    try {
      // 1) Build parameters for OpenAI's audio generation
      const audioParams = {
        model: 'gpt-4o-audio-preview',
        modalities: ['text', 'audio'],
        audio: {
          voice: 'alloy',
          format: 'wav'
        },
        messages: [
          {
            role: 'user',
            content: 'Fragaria vesca, commonly called the wild strawberry among other names, is a perennial herbaceous plant in the rose family that grows naturally throughout much of the Northern Hemisphere.'
          }
        ]
      };
  
      // 2) Call wrapper method
      const result = await openAI.generateChatAudio(audioParams);
  
      // 3) Parse response; e.g. result.choices[0].message.audio.data is base64
      const choice = result.choices?.[0];
      if (!choice || !choice.message?.audio?.data) {
        throw new Error('No audio data returned in choices[0].message.audio.data');
      }
  
      const audioBase64 = choice.message.audio.data;
      console.log('Audio base64 length:', audioBase64.length);
  
      // 4) Decode & save
      const audioHelper = new AudioHelper();
      const audioBuffer = audioHelper.decode(audioBase64); 
      // If format is 'wav', let's name it "openai_audio.wav"
      // If 'mp3', name it "openai_audio.mp3", etc.
      const fileName = 'openai_audio.wav';
      const saveOk = audioHelper.saveAudio(audioBuffer, '../temp', fileName);
  
      if (!saveOk) {
        throw new Error('Audio file failed to save');
      }
      console.log(`Audio saved to ../temp/${fileName}`);
  
    } catch (error) {
      console.error('testGenerateChatAudio Error:', error);
    }
  }

(async () => {
    /*
    await testChatGPT();
    await testImageModel();
    await testEmbeddings();
    await testSpeechToText();
    await testChatGPTStream();
    await testVisionImageToText();
    await testTextToSpeech();
    await testFineTuning();*/
    await testGenerateChatAudio();
})();