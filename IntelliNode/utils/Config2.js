const fs = require('fs');
const path = require('path');

class Config2 {
  constructor() {
    const configPath = path.join(__dirname, '..', 'config.json');
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }

  getProperty(key) {
    return key.split('.').reduce((obj, k) => (obj && obj[k] !== 'undefined') ? obj[k] : undefined, this.config);
  }

  static getInstance() {
    if (!Config2.instance) {
      Config2.instance = new Config2();
    }
    return Config2.instance;
  }
}

module.exports = Config2;