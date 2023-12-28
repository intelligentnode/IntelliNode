const assert = require("assert");
const FormData = require("form-data");
const { RemoteFineTuneModel, SupportedFineTuneModels } = require("../../controller/RemoteFinetune");
const { createReadStream } = require("fs");
const FineTuneInput = require("../../model/input/FineTuneInput");

require("dotenv").config();
const openaiKey = process.env.OPENAI_API_KEY;

async function testOpenAIFineTuneRemoteModel() {
  console.log('### Openai test case 1 ### \n');
  try {
    const wrapper = new RemoteFineTuneModel(openaiKey, SupportedFineTuneModels.OPEN_AI);

    if (openaiKey === "") return;

    const filePath = 'IntelliNode/test/temp/training_data.jsonl'

    const filePayload = new FormData();
    filePayload.append('file', createReadStream(filePath));
    filePayload.append('purpose', 'fine-tune');

    const file = await wrapper.openAIWrapper.uploadFile(filePayload)

    const input = new FineTuneInput({
      model: 'gpt-3.5-turbo',
      training_file: file.id
    })

    const result = await wrapper.generateFineTune(input)
    const list = await wrapper.listFineTune()

    const value = list.data.filter(b => b.id === result.id)
    console.log('Fine tuning Model Result:\n', value, '\n');
    assert(value.length > 0, 'testFineTuning response length should be greater than 0');

  } catch (error) {
    if (openaiKey === "") {
      console.log(
        "testOpenAIFineTuneRemoteModel: set the API key to run the test case."
      );
    } else {
      console.error("Test case failed with exception:", error);
    }
  }
}

(async () => {
  await testOpenAIFineTuneRemoteModel();
})();