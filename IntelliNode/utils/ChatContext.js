/* Apache License
Copyright 2023 Github.com/Barqawiz/IntelliNode */
const { SemanticSearch } = require('../function/SemanticSearch');
const { SupportedEmbedModels } = require('../controller/RemoteEmbedModel');

class ChatContext {

    /**
     * Constructs a new instance of the Chat Context.
     *
     * @param {string} - The apiKey the model Key.
     * @param {string} - The provider the provider of the embedding model.
     */
    constructor(apiKey, provider = SupportedEmbedModels.OPENAI, customProxyHelper = null) {
        this.semanticSearch = new SemanticSearch(apiKey, provider, customProxyHelper);
    }

    /**
     * Provides n context messages from the history, combining last 2 messages with relevant ones from the history.
     *
     * @param {string} userMessage - The user message to filter context.
     * @param {string[]} historyMessages - The array of previous messages.
     * @param {number} n - The number of messages to return.
     * @returns {string[]} - The most relevant n messages.
     */
    async getStringContext(userMessage, historyMessages, n, modelName = null) {
        let returnMessages;
        if (n >= historyMessages.length) {
            returnMessages = historyMessages.slice(-n);
        } else {
            const relevantMessages = historyMessages.slice(0, historyMessages.length - 2);

            if (relevantMessages.length > 0) {
                let semanticSearchResult =
                    await this.semanticSearch.getTopMatches(userMessage, relevantMessages, n - 2, modelName);

                const topMatches = this.semanticSearch.filterTopMatches(semanticSearchResult, relevantMessages);

                returnMessages = topMatches.concat(historyMessages.slice(-2));
            } else {
                returnMessages = historyMessages.slice(-2);
            }

        }

        return returnMessages;
    }

    /**
     * Provides n relevant context messages from the history,
     * where each history message includes a role and content.
     *
     * @param {string} userMessage - The user message to filter context.
     * @param {Array} historyMessages - Array of dictionary including 'role' and 'content' fields.
     * @param {number} n - The number of context messages to return.
     * @returns {Array} - The most relevant n message objects with 'role' and 'content' fields.
     */
    async getRoleContext(userMessage, historyMessages, n, modelName = null) {
        const historyMessageContents = historyMessages.map(msg => msg.content);
        let returnMessages;

        if (n >= historyMessages.length) {
            returnMessages = historyMessages.slice(-n);
        } else {
            const relevantMessages = historyMessageContents.slice(0, -2);

            if (relevantMessages.length > 0) {
                let semanticSearchResult =
                    await this.semanticSearch.getTopMatches(userMessage, relevantMessages, n - 2, modelName);

                const semanticSearchTopMatches = semanticSearchResult.map(result => result.index);
                const topMatches = historyMessages.filter((value, index) => semanticSearchTopMatches.includes(index));
                returnMessages = topMatches.concat(historyMessages.slice(-2));
            } else {
                returnMessages = historyMessages.slice(-2);
            }
        }

        return returnMessages;
    }
}

module.exports = ChatContext;