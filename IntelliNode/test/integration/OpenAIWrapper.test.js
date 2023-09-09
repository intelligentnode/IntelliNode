require('dotenv').config();
const assert = require('assert');
const FormData = require("form-data");
const GPTStreamParser = require('../../utils/StreamParser');
const OpenAIWrapper = require('../../wrappers/OpenAIWrapper');
const {
    createReadStream
} = require('fs');
const path = require('path');

const openAI = new OpenAIWrapper(process.env.OPENAI_API_KEY);

async function testLanguageModel() {
    try {
        const params = {
            model: 'text-davinci-003',
            prompt: 'Summarize the plot of the Inception movie in two sentences',
            max_tokens: 50,
            n: 1,
            stop: '<stop>',
            temperature: 0.7
        };

        const result = await openAI.generateText(params);
        const responseText = result['choices'][0]['text'].trim();
        console.log('Language Model Result:\n', responseText, '\n');
        assert(responseText.length > 0, 'testLanguageModel response length should be greater than 0');
    } catch (error) {
        console.error('Language Model Error:', error);
    }
}

async function testFineTuneModel(){
    try {
        
        const filePath = path.join(__dirname, 'Path_to_your_traning_file.jsonl'); // formated jsonl file supported by openai
        const upload = await openAI.uploadFile(filePath);
        console.log('Upload File Result:\n', upload, '\n');
        assert(upload.id.length > 0, 'testFineTuneUploadFile response length should be greater than 0');
        const fileId = upload.id;
        const processedFile = await new Promise((resolve, reject) => {
            // check every 5 seconds if file is processed
            const interval = setInterval(async () => {
              await requestFileStatus();
            }, 5000);
            const requestFileStatus = async () => {
              const file = await openAI.getFile(fileId);
              if (file.status === 'processed') {
                clearInterval(interval);
                resolve(file);
              }
            };
          });
        assert(processedFile.status === 'processed', 'testFineTuneUploadFile file status should be processed');
        const fineTuneParams = {
            training_file: processedFile.id, // file id
            model: 'gpt-3.5-turbo-0613',
        };
        assert(fineTuneParams.training_file.length > 0, 'testFineTuneCreateJob training_file should be greater than 0');
        assert(fineTuneParams.model.length > 0, 'testFineTuneCreateJob model should be greater than 0');
        const fineTuneJob = await openAI.createFineTuneJob(fineTuneParams); //-
        const fineTuneId =   fineTuneJob.id;
        assert(fineTuneId.length > 0, 'testFineTuneCreateJob fineTuneId should be greater than 0');
        const fineTunedModel = await new Promise((resolve, reject) => {
            let checkCount = 0;
            // check every 5 seconds if fine tune job is done
            const interval = setInterval(async () => {
                await requestFineTuneStatus();
            }, 5000);
            const requestFineTuneStatus = async () => {
                const fineTuneModel = await openAI.getFineTuneJob(fineTuneId);
                checkCount++;
                console.log('checkCount:', checkCount);
                if (fineTuneModel.status === 'succeeded') {
                    resolve(fineTuneModel);
                    clearInterval(interval);
                }
            };
        });
        assert(fineTunedModel.id.length > 0, 'testFineTuneCreateJob fineTunedModel should be greater than 0');
        assert(fineTunedModel.status === 'succeeded', 'testFineTuneCreateJob fineTunedModel status should be succeeded');
        assert(fineTunedModel.fine_tuned_model.length > 0, 'testFineTuneCreateJob fineTunedModel fine_tuned_model should be greater than 0');
        // test the newly created fine tune model
        const params = {
            model: fineTunedModel.fine_tuned_model, // fine tune model id
            messages: [{ role: 'system', content: 'You are javscript master.' }, { role: 'user', content: 'Explain how we can create efficient desktop softwares in javascript!.' }],
            max_tokens: 2000,
            n: 1,
            stop: '<stop>',
            temperature: 0.7
        };
        const result = await openAI.generateTextChatCompletion(params);
        console.log(result);
        assert(result.id.length > 0, 'testFineTuneModel result id should be greater than 0');
        assert(result.usage.completion_tokens > 0, 'testFineTuneModel result usage completion_tokens should be greater than 0');
        assert(result.choices.length > 0, 'testFineTuneModel result choices should be greater than 0');
        assert(result.choices[0].finish_reason.length > 0, 'testFineTuneModel result choices finish_reason should be greater than 0');
        assert(result.choices[0].message.role.length > 0, 'testFineTuneModel result choices role should be greater than 0');
        assert(result.choices[0].message.content.length > 0, 'testFineTuneModel result choices content should be greater than 0');
        const responseText = result['choices'][0]['message'].content.trim();
        console.log('Fine Tune Model Test Result:\n', responseText, '\n');
        assert(responseText.length > 0, 'testFineTuneModel response length should be greater than 0');
    
    } catch (error) {
        console.error('Fine Tune Model Test Error:', error);
    }
}


async function testChatGPT() {
    try {
        const params = {
            model: 'gpt-3.5-turbo',
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
            model: 'text-embedding-ada-002',
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


(async () => {
    await testLanguageModel();
    await testChatGPT();
    await testImageModel();
    await testEmbeddings();
    await testSpeechToText();
    await testChatGPTStream();
    await testFineTuneModel();
})();