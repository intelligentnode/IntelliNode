const { TextAnalyzer, SupportedLangModels } =  require('intellinode');
// below imports to call the keys from .env file
const dotenv = require('dotenv');
dotenv.config();

async function testSummarizec(apiKey, provider) {
  const analyzer = new TextAnalyzer(apiKey, provider);

  const text = 'IntelliNode is a javascript library that integrates cutting-edge AI models into your project. With its intuitive functions, you can easily feed data to models like ChatGPT, WaveNet, and Stable diffusion and receive generated text, speech, or images. It also offers high-level functions such as semantic search and chatbot capabilities.What sets IntelliNode apart is its lightning-fast access to the latest deep learning models, allowing you to integrate them into your projects with just a few lines of code.';
  const summary = await analyzer.summarize(text);
  console.log(`${provider} Summary:`, summary);
  
}

async function testSentimentAnalysis(apiKey, provider) {
  const analyzer = new TextAnalyzer(apiKey, provider);

  const text = 'IntelliNode is an amazing AI library that makes it easy to integrate various AI models. I love using it!';
  const sentiment = await analyzer.sentimentAnalysis(text);
  
  console.log(`${provider} Sentiment Analysis: `, sentiment);
}


(async () => {
  // test the summary
  console.log('*** symmary ***')
  await testSummarizec(process.env.OPENAI_API_KEY, 'openai');
  await testSummarizec(process.env.COHERE_API_KEY, 'cohere');

  // test sentiment analysis
  console.log('*** sentiment analysis ***')
  await testSentimentAnalysis(process.env.OPENAI_API_KEY, 'openai');
  await testSentimentAnalysis(process.env.COHERE_API_KEY, 'cohere');

})();
