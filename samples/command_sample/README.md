# IntelliNode Sample

## Setup
```
npm install
```

## Environment
Create a `.env` file with the required access keys:

```
OPENAI_API_KEY=<key_value>
COHERE_API_KEY=<key_value>
GOOGLE_API_KEY=<key_value>
STABILITY_API_KEY=<key_value>
HUGGING_API_KEY=<key_value>
```
For the S3 automation sample, you'll additionally need AWS access credentials:

 ```
 AWS_ACCESS_KEY_ID=<key_value>
 AWS_SECRET_ACCESS_KEY=<key_value>
 ```

## Samples Execution

1. E-commerce sample to generate products description and images:
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

8. Text analyzer (summary & sentiment analysis):
`node test_text_analyzer.js`

9. Huggingface simplified inference access:
`node test_hugging_face.js`

10. Azure openai sample
`node test_azure_chatbot.js <resource_name> <deployment_name>`

11. Automation sample using the chatbot function call:
`node automate_s3_bucket.js`

## Access Keys
Generate your access keys from the corresponding websites; You only need to generate keys for the models you'll use.

1. openai: https://openai.com
2. cohere: https://cohere.com
3. google: https://console.cloud.google.com
4. stability: https://stability.ai
5. huggingface: https://huggingface.co

For instance, if you're using the language model from OpenAI, there's no need for Cohere's keys.
