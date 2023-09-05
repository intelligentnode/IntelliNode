const fs = require('fs');
const tiktoken = require('tiktoken');
const readline = require('readline');

class OpenAIHelper {
  constructor(dataFilePath) {
    this.dataFilePath = dataFilePath;
    this.dataset = [];
    this.encoding = tiktoken.get_encoding('cl100k_base');
  }

  async loadData() {
    try {
      const fileStream = fs.createReadStream(this.dataFilePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        const jsonLine = JSON.parse(line);
        this.dataset.push(jsonLine);
      }

      return this.dataset;
    } catch (error) {
      throw new Error('Error loading data: ' + error.message);
    }
  }

  printDataStats() {
    console.log('Num examples:', this.dataset.length);
    console.log('First example:');
    for (const message of this.dataset[0].messages) {
      console.log(message);
    }
  }

  formatErrorChecks() {
    const formatErrors = {
      data_type: 0,
      missing_messages_list: 0,
      message_missing_key: 0,
      message_unrecognized_key: 0,
      unrecognized_role: 0,
      missing_content: 0,
      example_missing_assistant_message: 0,
    };

    for (const ex of this.dataset) {
      if (!ex || typeof ex !== 'object') {
        formatErrors.data_type += 1;
        continue;
      }

      const messages = ex.messages;
      if (!messages || !Array.isArray(messages)) {
        formatErrors.missing_messages_list += 1;
        continue;
      }

      for (const message of messages) {
        if (!message.role || !message.content) {
          formatErrors.message_missing_key += 1;
        }

        if (!['role', 'content', 'name'].includes(message.role) && !message.role.startsWith('assistant')) {
          formatErrors.message_unrecognized_key += 1;
        }

        if (!['system', 'user', 'assistant'].includes(message.role)) {
          formatErrors.unrecognized_role += 1;
        }

        const content = message.content;
        if (!content || typeof content !== 'string') {
          formatErrors.missing_content += 1;
        }
      }

      if (!messages.some((message) => message.role === 'assistant')) {
        formatErrors.example_missing_assistant_message += 1;
      }
    }

    if (Object.values(formatErrors).some((count) => count > 0)) {
      console.log('Found errors:');
      for (const key in formatErrors) {
        console.log(`${key}: ${formatErrors[key]}`);
      }
    } else {
      console.log('No errors found');
    }
  }

  numTokensFromMessages(messages, tokensPerMessage = 3, tokensPerName = 1) {
    let numTokens = 0;
    for (const message of messages) {
      numTokens += tokensPerMessage;
      for (const [key, value] of Object.entries(message)) {
        numTokens += this.encoding.encode(value).length;
        if (key === 'name') {
          numTokens += tokensPerName;
        }
      }
      numTokens += 3;
    }
    return numTokens;
  }

  numAssistantTokensFromMessages(messages) {
    let numTokens = 0;
    for (const message of messages) {
      if (message.role === 'assistant') {
        numTokens += this.encoding.encode(message.content).length;
      }
    }
    return numTokens;
  }

  printDistribution(values, name) {
    console.log(`\n#### Distribution of ${name}:`);
    console.log(`min / max: ${Math.min(...values)}, ${Math.max(...values)}`);
    console.log(`mean / median: ${this.mean(values)}, ${this.median(values)}`);
    console.log(`p5 / p95: ${this.quantile(values, 0.1)}, ${this.quantile(values, 0.9)}`);
  }

  mean(values) {
    return values.reduce((acc, val) => acc + val, 0) / values.length;
  }

  median(values) {
    const sortedValues = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sortedValues.length / 2);
    if (sortedValues.length % 2 === 0) {
      return (sortedValues[middle - 1] + sortedValues[middle]) / 2;
    } else {
      return sortedValues[middle];
    }
  }

  quantile(values, percentile) {
    const sortedValues = [...values].sort((a, b) => a - b);
    const index = Math.floor(percentile * (sortedValues.length - 1));
    return sortedValues[index];
  }

  checkDataFormatting() {
    const nMissingSystem = this.dataset.filter((ex) => !ex.messages.some((message) => message.role === 'system')).length;
    const nMissingUser = this.dataset.filter((ex) => !ex.messages.some((message) => message.role === 'user')).length;

    const nMessages = this.dataset.map((ex) => ex.messages.length);
    const convoLens = this.dataset.map((ex) => this.numTokensFromMessages(ex.messages));
    const assistantMessageLens = this.dataset.map((ex) => this.numAssistantTokensFromMessages(ex.messages));

    console.log('Num examples missing system message:', nMissingSystem);
    console.log('Num examples missing user message:', nMissingUser);
    this.printDistribution(nMessages, 'num_messages_per_example');
    this.printDistribution(convoLens, 'num_total_tokens_per_example');
    this.printDistribution(assistantMessageLens, 'num_assistant_tokens_per_example');

    const nTooLong = convoLens.filter((length) => length > 4096).length;
    console.log(`\n${nTooLong} examples may be over the 4096 token limit, they will be truncated during fine-tuning`);
  }

  estimatePricing() {
    const MAX_TOKENS_PER_EXAMPLE = 4096;
    const MIN_TARGET_EXAMPLES = 100;
    const MAX_TARGET_EXAMPLES = 25000;
    const TARGET_EPOCHS = 3;
    const MIN_EPOCHS = 1;
    const MAX_EPOCHS = 25;

    let nEpochs = TARGET_EPOCHS;
    const nTrainExamples = this.dataset.length;

    if (nTrainExamples * TARGET_EPOCHS < MIN_TARGET_EXAMPLES) {
      nEpochs = Math.min(MAX_EPOCHS, Math.floor(MIN_TARGET_EXAMPLES / nTrainExamples));
    } else if (nTrainExamples * TARGET_EPOCHS > MAX_TARGET_EXAMPLES) {
      nEpochs = Math.max(MIN_EPOCHS, Math.floor(MAX_TARGET_EXAMPLES / nTrainExamples));
    }

    const nBillingTokensInDataset = this.dataset.reduce((totalTokens, ex) => totalTokens + Math.min(MAX_TOKENS_PER_EXAMPLE, this.numTokensFromMessages(ex.messages)), 0);

    console.log(`Dataset has ~${nBillingTokensInDataset} tokens that will be charged for during training`);
    console.log(`By default, you'll train for ${nEpochs} epochs on this dataset`);
    console.log(`By default, you'll be charged for ~${nEpochs * nBillingTokensInDataset} tokens`);
    console.log('See pricing page to estimate total costs');
  }
}

module.exports = { OpenAIHelper };

// // Usage
// const dataFilePath = '<YOUR_JSON_FILE_HERE>';
// const openAIHelper = new OpenAIHelper(dataFilePath);

// (async () => {
//   await openAIHelper.loadData();
//   openAIHelper.printDataStats();
//   openAIHelper.formatErrorChecks();
//   openAIHelper.checkDataFormatting();
//   openAIHelper.estimatePricing();
// })();
