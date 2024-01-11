/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class FineTuneInput {
  constructor({ training_file, model }) {
    this.training_file = training_file
    this.model = model
  }

  getOpenAIInput() {
    const params = {
      training_file: this.training_file,
      model: this.model,
    };
    return params;
  }
}

module.exports = FineTuneInput;
