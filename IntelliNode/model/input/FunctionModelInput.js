/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class FunctionModelInput {
  constructor(name, description, parameters) {
    this.name = name;
    this.description = description || '';
    this.parameters = parameters || {};
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
