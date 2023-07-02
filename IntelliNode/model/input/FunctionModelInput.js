/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class FunctionModelInput {
  /**
  * Function input constructor.
  * @param {string} name - The name of the function.
  * @param {string} [description] - The description of the function. (Optional)
  * @param {object} [parameters] - The parameters of the function. (Optional)
  *   @param {string} [parameters.type] - The data type of the parameters.
  *   @param {object} [parameters.properties] - The properties or fields of the parameters.
  *   @param {string[]} [parameters.required] - The required properties. (Optional)
  */
  constructor(name, description, parameters) {
    this.name = name;
    this.description = description || '';
    this.parameters = parameters || {type: 'object', properties: {}};
  }

  getFunctionModelInput() {
    return {
      name: this.name,
      description: this.description,
      parameters: this.parameters,
    };
  }
}

module.exports = FunctionModelInput ;
