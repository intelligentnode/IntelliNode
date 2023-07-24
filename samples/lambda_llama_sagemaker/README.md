# IntelliNode - Llama Connector

The Llama v2 chatbot is avaialble as part of the Amazon SageMaker JumpStart. Once you have deployed your Llama model, you'll need to create a Lambda function to connect the model, then trigger the lambda from the API gateway.

This folder contains a Lambda export which establishes a connection to your Sagemaker Llama deployment.

### Pre request
Create a SageMaker
 domain.
Deploy the llama model using SageMaker Jumpstart.
Copy the endpoint name.
Create node.js lambda function.
Create environment variable `llama_endpoint` with the SageMaker endpoint value.
Import the zip file in your lambda function.
