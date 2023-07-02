// imports
// const AWS = require('aws-sdk');
const { S3Client, ListBucketsCommand, ListObjectsCommand } = require('@aws-sdk/client-s3');
const { Chatbot, ChatGPTInput, ChatGPTMessage, FunctionModelInput } = require('intellinode');
require('dotenv').config();

// initialize the objects
const openApikey = process.env.OPENAI_API_KEY;
const bot = new Chatbot(openApikey);
// const s3 = new AWS.S3();
const s3client = new S3Client();

// initial variables
const gpt_model = "gpt-3.5-turbo-0613"

// define the functions details
const functions_desc = [
  new FunctionModelInput('list_buckets', 'List all available S3 buckets'),
  new FunctionModelInput('list_objects', 'List the objects or files inside an S3 bucket', {
    type: 'object',
    properties: {
      bucket: { type: 'string', description: 'The name of the S3 bucket' },
      prefix: { type: 'string', description: 'The folder path in the S3 bucket' }
    },
    required: ['bucket']
  })
];

// define the implementation mapper
const functions_dict = {
  list_buckets: async () => {
    const command = new ListBucketsCommand({});
    const response = await s3client.send(command);
    return response.Buckets;
  },
  list_objects: async (bucket, prefix = '') => {
    console.log('Bucket name: ', bucket)
    const command = new ListObjectsCommand({
      Bucket: bucket,
      Prefix: prefix,
    });
    const response = await s3client.send(command);
    return response.Contents;
  },
  // define other S3 bucket functions
};

async function runOneshotConversation(userInput, topic = "s3 bucket functions.", isLog = false) {
  console.log('\nRunning oneshot conversation: \n');

  const systemMessage = `Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous. If the user asks a question not related to ${topic}, respond within the scope of ${topic}.`;

  const input = new ChatGPTInput(systemMessage, { model: gpt_model });
  input.addMessage(new ChatGPTMessage(userInput, "user"));

  const responses = await bot.chat(input, functions_desc.map(f => f.getFunctionModelInput()));

  let finalMessage;

  const response = responses[0];
  if (typeof response === "object") {
    const functionName = response.function_call.name;
    const functionArgs = JSON.parse(response.function_call.arguments);

    // call the function
    const functionResponse = await functions_dict[functionName](...Object.values(functionArgs));
    // console.log("Function response: ", functionResponse);

    // add the response to the conversation
    input.addMessage(new ChatGPTMessage(JSON.stringify(functionResponse), "function", functionName));

    const secondResponses = await bot.chat(input);

    finalMessage = secondResponses.join('\n');
    
  } else {
    finalMessage = response;
    
  }

  return finalMessage;
}



(async () => {
  // Test chatbot using OpenAI
  model_response = await runOneshotConversation("List my s3 buckets");
  console.log("the model message:\n", model_response)
})();
