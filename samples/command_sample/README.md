# IntelliNode Sample

## Setup
```
npm install
```

## Environment
Create a `.env` file with the required access keys:

```sh
# Access keys for various models
OPENAI_API_KEY=<your_openai_api_key>
COHERE_API_KEY=<your_cohere_api_key>
GOOGLE_API_KEY=<your_google_api_key>
STABILITY_API_KEY=<your_stability_api_key>
HUGGING_API_KEY=<your_hugging_api_key>
REPLICATE_API_KEY=<your_replicate_api_key>

# Optional - AWS access credentials for S3 automation sample
AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
```
The Llama model is made available by several hosting services, and Replicate is among the platforms that offer hosting for the Llama model.

## Samples Execution

1. E-commerce sample to product descriptions description and images:
`node ecommerce_tool.js`

2. Language model using openai and cohere:
`node test_language_models.js`

3. Image model using stable diffusion and DALL·E 2:
`node test_image_models.js`

4. Generate shiba images for fun:
`node shiba_image_generator.js`

5. Speech synthesis:
`node test_speech_models.js`

6. chatbot using ChatGPT:
`node test_chatbot.js`

7. Semantic search:
`node test_semantic_search.js`

8. Semantic search pagination to work with huge data:
`node test_semantic_search.js`

9. Text analyzer (summary & sentiment analysis):
`node test_text_analyzer.js`

10. Huggingface simplified inference access:
`node test_hugging_face.js`

11. Azure openai sample
`node test_azure_chatbot.js <resource_name> <deployment_name>`

12. Automation sample using the chatbot code call, it works by providing the model with your function details, and it decides to execute the code based on the user conversation:
`node automate_s3_bucket.js`

13. Llama V2 chatbot:
`node test_llama_chatbot.js`

14. LLM evaluator to compare models like chatGPT, Cohere, and Llama:
`node test_llm_evaluation.test.js`


## Access Keys
Generate your access keys from the corresponding websites; You only need to generate keys for the models you'll use.
For instance, if you're using the language model from OpenAI, there's no need for Cohere's keys.

1. openai: https://openai.com
2. cohere: https://cohere.com
3. google: https://console.cloud.google.com
4. stability: https://stability.ai
5. huggingface: https://huggingface.co
6. Replicate: https://replicate.com
