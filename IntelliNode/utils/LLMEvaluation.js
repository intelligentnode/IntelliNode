const { RemoteEmbedModel, SupportedEmbedModels } = require('../controller/RemoteEmbedModel');
const LanguageModelInput = require('../model/input/LanguageModelInput');
const { Chatbot, SupportedChatModels } = require("../function/Chatbot");
const { RemoteLanguageModel, SupportedLangModels } = require("../controller/RemoteLanguageModel");
const { ChatGPTInput, LLamaReplicateInput, LLamaSageInput, GeminiInput, CohereInput, MistralInput, AnthropicInput } = require("../model/input/ChatModelInput");
const MatchHelpers = require('../utils/MatchHelpers');
const EmbedInput = require('../model/input/EmbedInput');
const { ModelEvaluation } = require('./ModelEvaluation');

class LLMEvaluation extends ModelEvaluation {

  constructor(embedKeyValue, embedProvider) {
    super()
    this.embedProvider = embedProvider;
    this.embedModel = new RemoteEmbedModel(embedKeyValue, embedProvider);
  }

  async generateEmbedding(inputString) {
    const embedInput = new EmbedInput({ texts: [inputString] });
    embedInput.setDefaultValues(this.embedProvider);
    const embeddingsResponse = await this.embedModel.getEmbeddings(embedInput);

    const embeddings = embeddingsResponse.map((item) => item.embedding);

    return embeddings[0];
  }

  async generateText(apiKey, inputString, provider, modelName, type,
    maxTokens = 500, custom_url = null) {

    if (type == 'chat' && Object.values(SupportedChatModels).includes(provider.toLowerCase())) {

      const customProxy = (custom_url != undefined && custom_url != null && custom_url != '') ? { url: custom_url } : null;

      const chatbot = new Chatbot(apiKey, provider, customProxy);

      // define the chat input
      let input;
      if (SupportedChatModels.REPLICATE == provider.toLowerCase()) {
        input = new LLamaReplicateInput("provide direct answer", { model: modelName, maxTokens: maxTokens });
      } else if (SupportedChatModels.SAGEMAKER == provider.toLowerCase()) {
        input = new LLamaSageInput("provide direct answer", { maxTokens: maxTokens });
      } else if (SupportedChatModels.GEMINI == provider.toLowerCase()) {
        input = new GeminiInput("provide direct answer", { maxTokens: maxTokens });
      } else if (SupportedChatModels.COHERE == provider.toLowerCase()) {
        input = new CohereInput("provide direct answer", { maxTokens: maxTokens });
      } else if (SupportedChatModels.MISTRAL == provider.toLowerCase()) {
        input = new MistralInput("provide direct answer", { model: modelName, maxTokens: maxTokens });
      } else if (SupportedChatModels.ANTHROPIC == provider.toLowerCase()) {
        input = new AnthropicInput("provide direct answer", { model: modelName, maxTokens: maxTokens });
      } else {
        input = new ChatGPTInput("provide direct answer", { model: modelName, maxTokens: maxTokens });
      }

      input.addUserMessage(inputString);
      const responses = await chatbot.chat(input);

      return responses[0].trim();
    } else if (type == 'completion' && Object.values(SupportedLangModels).includes(provider.toLowerCase())) {

      const languageModel = new RemoteLanguageModel(apiKey, provider);
      const langInput = new LanguageModelInput({ prompt: inputString, model: modelName, maxTokens: maxTokens });
      langInput.setDefaultValues(provider, maxTokens);

      const responses = await languageModel.generateText(langInput);
      return responses[0].trim();
    } else {
      throw new Error('Provider not supported');
    }
  }
  /**
  * This function compares models based on their performance in predicting a given input string.
  *
  * @param {string} inputString - The input text string that needs to be predicted by the models.
  *
  * @param {array} targetAnswers - An array of target answers that the prediction by the models will be compared against.
  * Each answer in the array is a string. For example: ['targetAnswer1', 'targetAnswer2', 'targetAnswer3']
  *
  * @param {array} providerSets - An array of providers (language models or chatbots) along with their relevant API keys.
  * Each provider in the array is an object.
  * For example: [
  *    { apiKey:'keyForOpenAI', provider: 'openai', type: 'completion' },
  *    { apiKey:'keyForReplicate', provider: 'replicate', type: 'chat' }
  *   ]
  *
  * @returns {object} results - An object containing comparison results. Each key in the object corresponds to a Provider.
  * The value for each key is an Array of objects. Each object in the array contains the 'prediction',
  * 'score_cosine_similarity', and 'score_euclidean_distance'.
  *
  * If invalid 'apiKey' or 'provider' is supplied, it may result in runtime exception or error.
  */
  async compareModels(inputString, targetAnswers, providerSets, isJson = false) {
    let results = {};
    let targetEmbeddings = [];

    // Initiate Embedding for targets
    for (let target of targetAnswers) {
      const embedding = await this.generateEmbedding(target);
      targetEmbeddings.push(embedding);
    }

    for (let provider of providerSets) {
      console.log(`- start ${provider.model} evaluation`)

      let predictions = [];
      try {
        let prediction = await this.generateText(provider.apiKey, inputString, provider.provider,
          provider.model, provider.type,
          provider.maxTokens, provider.url);
        const predictionEmbedding = await this.generateEmbedding(prediction);

        let cosineSum = 0, euclideanSum = 0, manhattanSum = 0;
        for (let targetEmbedding of targetEmbeddings) {
          cosineSum += MatchHelpers.cosineSimilarity(predictionEmbedding, targetEmbedding);
          euclideanSum += MatchHelpers.euclideanDistance(predictionEmbedding, targetEmbedding);
          manhattanSum += MatchHelpers.manhattanDistance(predictionEmbedding, targetEmbedding);
        }

        const avgCosine = cosineSum / targetEmbeddings.length;
        const avgEuclidean = euclideanSum / targetEmbeddings.length;
        const avgManhattan = manhattanSum / targetEmbeddings.length;

        predictions.push({
          prediction: prediction,
          score_cosine_similarity: avgCosine,
          score_euclidean_distance: avgEuclidean,
          score_manhattan_distance: avgManhattan,
          stop_reason: "complete"
        });
      } catch (error) {
        console.error(error);
        predictions.push({
          stop_reason: "error"
        });
      }

      results[`${provider.provider}/${provider.model}`] = predictions;
    }

    results['lookup'] = {
      'cosine_similarity': 'a value closer to 1 indicates a higher degree of similarity between two vectors.',
      'euclidean_distance': 'the lower the value, the closer the two points.',
      'manhattan_distance': 'the lower the value, the closer the two vectors.'
    }

    if (isJson) {
      results = JSON.stringify(results);
    }

    return results;
  }
}

module.exports = {
  LLMEvaluation
};