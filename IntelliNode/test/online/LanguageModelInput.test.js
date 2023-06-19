const LanguageModelInput = require("../../model/input/LanguageModelInput");

function testOpenAIInputs() {
  const input = new LanguageModelInput({
    prompt: "Once upon a time",
  });

  input.setDefaultValues("openai");

  const openAIInputs = input.getOpenAIInputs();

  if (openAIInputs.prompt !== "Once upon a time") {
    console.error("Error: Prompt value is incorrect.");
  } else {
    console.log("OpenAI inputs:", openAIInputs);
  }
}

testOpenAIInputs();