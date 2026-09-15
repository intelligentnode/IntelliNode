require('dotenv').config();
const assert = require('assert');
const AnthropicWrapper = require('../../wrappers/AnthropicWrapper');

// initiate anthropic object
const anthropic = new AnthropicWrapper(process.env.ANTHROPIC_API_KEY);

async function testAnthropicGenerate() {
    try {
        const params = {
            "model": "claude-sonnet-5",
            "messages": [
                {
                    "role": "user",
                    "content": "Who is the most renowned French painter? Provide a single direct short answer."
                }
            ],
            "max_tokens": 256
        };

        const result = await anthropic.generateText(params);
        // Claude 5 models can return a thinking block before the answer
        const textBlock = result.content.find((block) => block.type === 'text');
        console.log('Anthropic Language Model Result:', textBlock.text);
        assert(textBlock.text.length > 0, 'testAnthropicGenerate response should contain text');
    } catch (error) {
        console.error('Anthropic Language Model Error:', error);
    }
}

(async () => {
    await testAnthropicGenerate();
})();