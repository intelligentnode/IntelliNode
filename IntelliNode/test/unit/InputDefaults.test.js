const assert = require('assert');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');
const ImageModelInput = require('../../model/input/ImageModelInput');
const EmbedInput = require('../../model/input/EmbedInput');
const LanguageModelInput = require('../../model/input/LanguageModelInput');
const embeddedTemplates = require('../../resource/templates/templates');

function testInputDefaults() {
  // OpenAI images require a model and gpt-image rejects dall-e parameters
  const image = new ImageModelInput({ prompt: 'x', responseFormat: 'b64_json', quality: 'hd' }).getOpenAIInputs();
  assert.strictEqual(image.model, config.url.openai.models.image);
  assert.strictEqual(image.response_format, undefined);
  assert.strictEqual(image.quality, 'high');
  const legacy = ImageModelInput.normalizeOpenAIParams({ prompt: 'x', model: 'dall-e-3', response_format: 'url' });
  assert.strictEqual(legacy.response_format, 'url');

  const stability = new ImageModelInput({ prompt: 'x' });
  stability.setDefaultValues('stability');
  assert.strictEqual(stability.engine, 'stable-diffusion-xl-1024-v1-0');
  assert.strictEqual(stability.width, 1024);

  // embeddings
  const cohere = new EmbedInput({ texts: ['a'] });
  cohere.setDefaultValues('cohere');
  assert.strictEqual(cohere.getCohereInputs().model, config.url.cohere.models.embed);
  assert.strictEqual(cohere.getCohereInputs().input_type, 'search_document');
  const gemini = new EmbedInput({ texts: ['a'] });
  gemini.setDefaultValues('gemini');
  assert.strictEqual(gemini.model, `models/${config.url.gemini.models.embed}`);
  const nvidia = new EmbedInput({ texts: ['a'] });
  nvidia.setDefaultValues('nvidia');
  assert.strictEqual(nvidia.getNvidiaInputs().model, config.nvidia.models.embed);

  // completions
  const language = new LanguageModelInput({ prompt: 'x' });
  language.setDefaultModels('cohere');
  assert.strictEqual(language.model, config.url.cohere.models.chat);

  // embedded prompt templates stay in sync with resource/templates/*.in
  const templatesDir = path.join(__dirname, '..', '..', 'resource', 'templates');
  for (const file of fs.readdirSync(templatesDir).filter((name) => name.endsWith('.in'))) {
    assert.strictEqual(embeddedTemplates[file], fs.readFileSync(path.join(templatesDir, file), 'utf8'), `${file} is stale; run npm run build`);
  }
}

module.exports = testInputDefaults;
