require('dotenv').config();
const assert = require('assert');
const GeminiAIWrapper = require('../../wrappers/GeminiAIWrapper');
const gemini = new GeminiAIWrapper(process.env.GEMINI_API_KEY);

async function testGeminiAIWrapper() {
    try {
        const params = {
            "contents": [{
                "parts": [{
                    "text": "Write a story about a magic backpack."
                }]
            }]
        };

        const result = await gemini.generateContent(params);

        if (Array.isArray(result.candidates)) {
            let generatedText = result.candidates[0]?.content?.parts[0]?.text;
            console.log('Gemini AI Content Generation Test Result:\n', generatedText, '\n');
            assert(generatedText, 'Gemini AI returned no results');
        } else {
            console.log('Unexpected output format from Gemini API');
        }
    } catch (error) {
        console.error('Gemini AI Error:', error);
    }
}

async function testImageToText() {
    try {

        const filePath = '../temp/test_image_desc.png'
        const result = await gemini.imageToText('describe the image', filePath, 'png');

        if (Array.isArray(result.candidates)) {
            let generatedText = result.candidates[0]?.content?.parts[0]?.text;
            console.log('Gemini AI Image To Text Generation Test Result:\n', generatedText, '\n');
            assert(generatedText, 'Gemini AI returned no results');
        } else {
            console.log('Unexpected output format from Gemini API');
        }
    } catch (error) {
        console.error('Gemini AI Error:', error);
    }
}

async function testGetEmbeddings() {
    try {
        const text = "Write a story about a magic backpack.";
        const params = {
            model: "models/embedding-001",
            content: {
                parts: [{
                    text: text
                }]
            }
        };

        const result = await gemini.getEmbeddings(params);
        console.log('Gemini Single Embedding Test Result:\n', result, '\n');
        assert(result && result.values, 'Gemini AI returned no embedding results');
    } catch (error) {
        console.error('Gemini Embedding Error:', error);
    }
}

async function testGetBatchEmbeddings() {
    try {
        const texts = ["Hello world", "Write a story about a magic backpack."];
        const requests = texts.map(text => ({
            model: "models/embedding-001",
            content: {
                parts: [{ text }]
            }
        }));

        const result = await gemini.getBatchEmbeddings({ requests });
        console.log('Gemini Batch Embedding Test Result:\n', result, '\n');
        assert(result && result.length > 0 && result.every(e => e.values && e.values.length > 0),
            'Gemini AI returned no batch embedding results');
    } catch (error) {
        console.error('Gemini Batch Embedding Error:', error);
    }
}


(async () => {
    await testGeminiAIWrapper();
    await testImageToText();
    await testGetEmbeddings();
    await testGetBatchEmbeddings();
})();