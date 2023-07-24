require('dotenv').config();
const AWSEndpointWrapper = require('../../wrappers/AWSEndpointWrapper');

const awsWrapper = new AWSEndpointWrapper(process.env.AWS_API_URL);

async function testAWSEndpointWrapper() {
  try {
    const inputData = {
        "inputs": [
            [
                {
                    "role": "system",
                    "content": "You are helpful assistant"
                },
                {
                    "role": "user",
                    "content": "Explain the plot of the Inception movie in one line."
                }
            ]
        ],
        "parameters": {
            "max_new_tokens": 200,
            "temperature": 0.7
        }
    };

    const prediction = await awsWrapper.predict(inputData);

    console.log('AWS Predict Result:', prediction);
    /*
     *    response example:
     *    [
     *      {
     *        generation: {
     *          role: 'assistant',
     *          content: " ...."
     *        }
     *      }
     *    ]
     */

  } catch (error) {
    console.error('AWS Error:', error);
  }
}

(async () => {
  await testAWSEndpointWrapper();
})();