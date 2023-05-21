/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class ModelHelper {

    constructor() {}

    static getGoogleTextModelInput(params) {
        const context = params.context;
        const examples = params.examples;
        const messages = params.messages;
        const temperature = params.temperature;
        const maxOutputTokens = params.maxOutputTokens;
        const topK = params.topK;
        const topP = params.topP;

        const modelInput = {
          instances: [
            {
              context: context,
              examples: examples,
              messages: messages,
            },
          ],
          parameters: {
            temperature: temperature,
            maxOutputTokens: maxOutputTokens,
            topK: topK,
            topP: topP,
          },
        };

        return JSON.stringify(modelInput);
  }

  static getGoogleSynthesizeInput(params) {
    const text = params.text;
    const languageCode = params.languageCode;
    const name = params.name;
    const ssmlGender = params.ssmlGender;

    const modelInput = {
      input: {
        text: text,
      },
      voice: {
        languageCode: languageCode,
        name: name,
        ssmlGender: ssmlGender,
      },
      audioConfig: {
        audioEncoding: 'MP3',
      },
    };

    return JSON.stringify(modelInput);
  }
}

module.exports = ModelHelper;