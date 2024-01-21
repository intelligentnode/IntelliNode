/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { RemoteEmbedModel, SupportedEmbedModels } = require('../controller/RemoteEmbedModel');
const EmbedInput = require('../model/input/EmbedInput');
const MatchHelpers = require('../utils/MatchHelpers');

class SemanticSearch {
  constructor(keyValue, provider = SupportedEmbedModels.OPENAI, customProxyHelper = null) {
    this.keyValue = keyValue;
    this.provider = provider;

    this.remoteEmbedModel = new RemoteEmbedModel(keyValue, provider, customProxyHelper);
  }

  async getTopMatches(pivotItem, searchArray, numberOfMatches, modelName = null) {

      if (numberOfMatches > searchArray.length) {
        throw new Error('numberOfMatches should not be greater than the searchArray');
      }

      const embedInput = new EmbedInput({
        texts: [pivotItem, ...searchArray],
        model: modelName
      });

      if (modelName == null) {
        embedInput.setDefaultValues(this.provider);
      }

      const embeddingsResponse = await this.remoteEmbedModel.getEmbeddings(embedInput);

      // Extract embeddings based on the provider
      let embeddings;
      if (this.provider === SupportedEmbedModels.OPENAI) {
        embeddings = embeddingsResponse.map((item) => item.embedding);
      } else if (this.provider === SupportedEmbedModels.COHERE) {
        embeddings = embeddingsResponse.map((item) => item.embedding);
      } else {
        throw new Error('Invalid provider name');
      }

      const pivotEmbedding = embeddings[0];
      const searchEmbeddings = embeddings.slice(1);

      return this.getTopMatchesFromEmbeddings(pivotEmbedding, searchEmbeddings, numberOfMatches);
    }

  getTopVectorMatches(pivotEmbedding, searchEmbeddings, numberOfMatches) {
    if (numberOfMatches >= searchEmbeddings.length) {
      throw new Error('numberOfMatches should be less than the length of the searchEmbeddings');
    }

    return this.getTopMatchesFromEmbeddings(pivotEmbedding, searchEmbeddings, numberOfMatches);
  }

  getTopMatchesFromEmbeddings(pivotEmbedding, searchEmbeddings, numberOfMatches) {
    const similarities = searchEmbeddings.map((embedding) => MatchHelpers.cosineSimilarity(pivotEmbedding, embedding));
    const sortedIndices = this.argsort(similarities).reverse();
    const topMatchesIndices = sortedIndices.slice(0, numberOfMatches);

    return topMatchesIndices.map((index) => ({ index, similarity: similarities[index] }));
  }

  argsort(array) {
    const arrayObject = array.map((value, index) => ({ value, index }));
    arrayObject.sort((a, b) => a.value - b.value);
    return arrayObject.map((item) => item.index);
  }

  filterTopMatches(searchResults, originalArray) {
      return searchResults.map(result => (originalArray[result.index]));
  }
}

module.exports = { SemanticSearch };
