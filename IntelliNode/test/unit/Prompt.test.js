const assert = require('assert');
const SystemHelper = require("../../utils/SystemHelper");
const Prompt = require("../../utils/Prompt");


function testPrompt() {
  const text = 'sample text';
  const template = new SystemHelper().loadPrompt("html_page");
  const promptTemp = new Prompt(template);
  
  const formattedText = promptTemp.format({'text': text});

  assert(formattedText.includes(text), 'Formatted text does not contain the sample text');

}

module.exports = testPrompt;