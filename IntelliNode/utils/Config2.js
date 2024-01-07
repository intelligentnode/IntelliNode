/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FileHelper = require('./FileHelper')
const path = require('path');

// WARNING: This file is deprecated
class Config2 {
  constructor() {
    const configPath = path.join(__dirname, '..', 'config.json');
    this.config = JSON.parse(FileHelper.readData(configPath, 'utf-8'));
  }

  getProperty(key) {
    return key.split('.').reduce((obj, k) => (obj && obj[k] !== null && obj[k] !== 'undefined') ? obj[k] : null, this.config);
  }

  static getInstance() {
    if (!Config2.instance) {
      Config2.instance = new Config2();
    }
    return Config2.instance;
  }
}

module.exports = Config2;