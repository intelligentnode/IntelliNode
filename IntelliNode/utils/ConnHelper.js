/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const axios = require('axios');

class ConnHelper {
  constructor() {
  }

  static convertMapToJson(params) {
    return JSON.stringify(params);
  }

  static getErrorMessage(error) {
    if (error.response && error.response.data) {
      return `Unexpected HTTP response: ${error.response.status} Error details: ${JSON.stringify(error.response.data)}`;
    }
    return error.message;
  }

  static readStream(stream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', err => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }
}

module.exports = { ConnHelper };
