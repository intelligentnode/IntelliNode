const { SemanticSearch } = require('./SemanticSearch'); // assuming path

class SemanticSearchPaging extends SemanticSearch {
  constructor(keyValue, provider, pivotItem, numberOfMatches) {
    super(keyValue, provider);
    this.pivotItem = pivotItem;
    this.numberOfMatches = numberOfMatches;
    this.textAndMatches = []; // To store { text: '...', similarity: 0.9 } results
    this.topMatches = [];
  }

  async addNewData(newSearchItems) {
      // get the best matches for new items
      const newMatches = await super.getTopMatches(this.pivotItem, newSearchItems, newSearchItems.length);

      // map the matches format
      const newMatchesWithText = newMatches.map(match => ({
        text: newSearchItems[match.index],
        score: match.similarity,
      }));

      // combine with old top matches and sort
      this.topMatches = [...this.topMatches, ...newMatchesWithText]
        .sort((a, b) => b.score - a.score)
        .slice(0, this.numberOfMatches);
}

  getCurrentTopMatches() {
    return this.topMatches;
  }

  clean() {
    this.topMatches = [];
  }
}

module.exports = { SemanticSearchPaging };