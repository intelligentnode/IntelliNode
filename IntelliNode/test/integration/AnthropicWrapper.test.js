require('dotenv').config();
const assert = require('assert');
const AnthropicWrapper = require('../../wrappers/AnthropicWrapper');

// initiate anthropic object
const anthropic = new AnthropicWrapper(process.env.ANTHROPIC_API_KEY);

async function testAnthropicGenerate() {
    try {
        const params = {
            "model": "claude-3-sonnet-20240229",
            "messages": [
                {
                    "role": "user",
                    "content": "Who is the most renowned French painter? Provide a single direct short answer."
                }
            ],
            "max_tokens": 256
        };

        const result = await anthropic.generateText(params);
        console.log('Anthropic Language Model Result:', result.content[0].text);
    } catch (error) {
        console.error('Anthropic Language Model Error:', error);
    }
}

(async () => {
    await testAnthropicGenerate();
})();