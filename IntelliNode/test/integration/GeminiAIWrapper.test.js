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
            console.log('Gemini AI Result:', generatedText)
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
            console.log('Gemini AI Result:', generatedText)
            assert(generatedText, 'Gemini AI returned no results');
        } else {
            console.log('Unexpected output format from Gemini API');
        }
    } catch (error) {
        console.error('Gemini AI Error:', error);
    }
}

(async () => {
    await testGeminiAIWrapper();
    await testImageToText();
})();