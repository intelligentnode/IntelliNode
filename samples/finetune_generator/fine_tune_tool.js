const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const { OpenAIWrapper } = require('.././../IntelliNode');
const path = require('path');

const MyKeys = {
  openai: process.env.OPENAI_API_KEY,
  cohere: process.env.COHERE_API_KEY,
  stability: process.env.STABILITY_API_KEY,
  google: process.env.GOOGLE_API_KEY,
};

// function to create a json file in current directory with the data
const createJsonFile = (fileName, data) => {
  const jobsPath = path.join(__dirname, 'jobs');
  if (!fs.existsSync(jobsPath)) {
    fs.mkdirSync(jobsPath);
  }
  const filename = path.join(__dirname, 'jobs', fileName + '.json');
  const fDis = fs.openSync(filename, 'w');
  fs.writeFileSync(fDis, JSON.stringify(data, null, 2), 'utf8');
  fs.closeSync(fDis);
};

async function main() {
  // request details for fine-tuning
  const filePath = path.join(__dirname, '../', '../', 'IntelliNode', 'tuneFile.jsonl');
  const openAIWrapper = new OpenAIWrapper(MyKeys.openai);
  const uploadResponse = await openAIWrapper.uploadFile(filePath);
  const fileId = uploadResponse.id;
  // const listFiles = await openAIWrapper.listFiles();

  //   createJsonFile(fileId, uploadResponse);

  //   // make sure file is processed
  const promiseFileProcessed = await new Promise((resolve, reject) => {
    // check every 2 seconds if file is processed
    const interval = setInterval(async () => {
      await requestFileStatus();
    }, 2000);
    const requestFileStatus = async () => {
      const file = await openAIWrapper.getFile(fileId);
      if (file.status === 'processed') {
        resolve(file);
        clearInterval(interval);
      }
    };
  });

  console.log('---- Response upload file -> ', promiseFileProcessed);

  const fineTuneParams = {
    training_file: promiseFileProcessed.id, // file id
    model: 'gpt-3.5-turbo-0613',
  };
  const fineTuneResponse = await openAIWrapper.createFineTuneJob(fineTuneParams); //-
  // extracts finetune id;
  const fineTuneId = fineTuneResponse.id;

  //   const retrieveFineTuneJob = await openAIWrapper.getFineTuneJob(fineTuneId);
  const promiseModelFineTuneSuccessAndGetModelId = await new Promise((resolve, reject) => {
    // check every 2 seconds if fine tune job is done
    const interval = setInterval(async () => {
      await requestFineTuneStatus();
    }, 2000);


    const requestFineTuneStatus = async () => {
      const fineTuneModel = await openAIWrapper.getFineTuneJob(fineTuneId);
      if (fineTuneModel.status === 'succeeded') {
        resolve(fineTuneModel.fine_tuned_model);
        clearInterval(interval);
      }
    };
  });

  //   promiseModelFineTuneSuccessAndGetModelId is the fineTunedModelId

  // const allFineTuneJobs = await openAIWrapper.getAllFineTuneJobs();
}

main();
