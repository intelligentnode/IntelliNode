require('dotenv').config();
const assert = require('assert');
const { TextAnalyzer } = require('../../function/TextAnalyzer');
const { SupportedLangModels } = require('../../controller/RemoteLanguageModel');

const openaiApiKey = process.env.OPENAI_API_KEY;
const cohereApiKey = process.env.COHERE_API_KEY;

const openaiTextAnalyzer = new TextAnalyzer(openaiApiKey, SupportedLangModels.OPENAI);
const cohereTextAnalyzer = new TextAnalyzer(cohereApiKey, SupportedLangModels.COHERE);

async function testOpenAISummarize() {
  const text = 'IntelliNode is a javascript library that integrates cutting-edge AI models into your project. With its intuitive functions, you can easily feed data to models like ChatGPT, WaveNet, and Stable diffusion and receive generated text, speech, or images. It also offers high-level functions such as semantic search and chatbot capabilities.';
  const summary = await openaiTextAnalyzer.summarize(text);
  console.log('OpenAI Summary:', summary);
  assert(summary.length > 0, 'Test passed');
}

async function testCohereSummarize() {
  const text = 'IntelliNode is a javascript library that integrates cutting-edge AI models into your project. With its intuitive functions, you can easily feed data to models like ChatGPT, WaveNet, and Stable diffusion and receive generated text, speech, or images. It also offers high-level functions such as semantic search and chatbot capabilities.';
  const summary = await cohereTextAnalyzer.summarize(text);
  console.log('Cohere Summary:', summary);
  assert(summary.length > 0, 'Test passed');
}

async function testOpenAISentimentAnalysis() {
  console.log('** start testOpenAISentimentAnalysis **');
  const text = 'IntelliNode is an amazing AI library that makes it easy to integrate various AI models. I love using it!';
  const sentiment = await openaiTextAnalyzer.sentimentAnalysis(text);
  console.log('OpenAI Sentiment Analysis:', sentiment);
  assert(sentiment.results && sentiment.results.positive !== undefined && sentiment.results.negative !== undefined && sentiment.results.neutral !== undefined, 'Test passed');
}

async function testCohereSentimentAnalysis() {
  console.log('** start testCohereSentimentAnalysis **');
  const text = 'IntelliNode is an amazing AI library that makes it easy to integrate various AI models. I love using it!';
  const sentiment = await cohereTextAnalyzer.sentimentAnalysis(text);
  console.log('Cohere Sentiment Analysis:', sentiment);
  assert(sentiment.results && sentiment.results.positive !== undefined && sentiment.results.negative !== undefined && sentiment.results.neutral !== undefined, 'Test passed');
}

(async () => {
  await testOpenAISummarize();
  await testCohereSummarize();
  await testOpenAISentimentAnalysis();
  await testCohereSentimentAnalysis();
})();