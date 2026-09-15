require('dotenv').config();
const assert = require('assert');
const config = require('../../config.json');
const { Chatbot, SupportedChatModels } = require('../../function/Chatbot');
const { CohereInput } = require('../../model/input/ChatModelInput');
const { RemoteLanguageModel, SupportedLangModels } = require('../../controller/RemoteLanguageModel');
const { RemoteEmbedModel, SupportedEmbedModels } = require('../../controller/RemoteEmbedModel');
const { SemanticSearch } = require('../../function/SemanticSearch');
const LanguageModelInput = require('../../model/input/LanguageModelInput');
const EmbedInput = require('../../model/input/EmbedInput');

const apiKey = process.env.COHERE_API_KEY;
const bot = new Chatbot(apiKey, SupportedChatModels.COHERE);

const results = [];
async function run(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    results.push({ name, ok: true });
  } catch (error) {
    console.error(`✗ ${name}: ${error.message}`);
    results.push({ name, ok: false });
  }
}

async function testWebOptionNoLongerBreaksChat() {
  // Cohere removed connectors; web: true used to make the request fail
  const input = new CohereInput('You are a concise assistant.', { web: true, maxTokens: 50 });
  input.addUserMessage('What is the capital of Italy? Answer in one word.');
  const responses = await bot.chat(input);
  console.log(`  ${config.url.cohere.models.chat}:`, responses);
  assert.match(responses[0], /rome/i);
}

async function testHistoryAndStream() {
  const input = new CohereInput('You are a concise assistant.');
  input.addUserMessage('My name is Sam.');
  input.addAssistantMessage('Nice to meet you, Sam.');
  input.addUserMessage('What is my name? Then count from 1 to 3.');
  let text = '';
  for await (const chunk of bot.stream(input)) {
    text += chunk;
  }
  console.log('  streamed:', JSON.stringify(text));
  assert.match(text, /sam/i);
  assert.match(text, /1[\s\S]*2[\s\S]*3/);
}

async function testLanguageModelUsesChatApi() {
  const languageModel = new RemoteLanguageModel(apiKey, SupportedLangModels.COHERE);
  const input = new LanguageModelInput({ prompt: 'Write a one sentence description of a smart plug.' });
  input.setDefaultValues(SupportedLangModels.COHERE, 80);
  const outputs = await languageModel.generateText(input);
  console.log('  completion:', outputs);
  assert.ok(outputs.length === 1 && outputs[0].length > 0);
}

async function testDefaultEmbeddings() {
  const embedModel = new RemoteEmbedModel(apiKey, SupportedEmbedModels.COHERE);
  const input = new EmbedInput({ texts: ['Hello from Cohere!', 'Hallo von Cohere!'] });
  input.setDefaultValues(SupportedEmbedModels.COHERE);
  const embeddings = await embedModel.getEmbeddings(input);
  console.log(`  ${config.url.cohere.models.embed} dims:`, embeddings[0].embedding.length);
  assert.strictEqual(embeddings.length, 2);
}

async function testSemanticSearch() {
  const search = new SemanticSearch(apiKey, SupportedEmbedModels.COHERE);
  const matches = await search.getTopMatches('greeting someone', ['hello there, nice to meet you', 'the car engine needs oil'], 1);
  assert.strictEqual(matches[0].index, 0);
}

(async () => {
  await run('web option no longer breaks chat', testWebOptionNoLongerBreaksChat);
  await run('history and stream', testHistoryAndStream);
  await run('language model uses the Chat API', testLanguageModelUsesChatApi);
  await run('default embeddings', testDefaultEmbeddings);
  await run('semantic search', testSemanticSearch);

  const failed = results.filter((result) => !result.ok);
  console.log(`\nCohere: ${results.length - failed.length}/${results.length} passed`);
  if (failed.length > 0) process.exitCode = 1;
})();
