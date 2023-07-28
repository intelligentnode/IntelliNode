const fs = require('fs');

class Prompt {
  constructor(template) {
    this.template = template;
  }

  format(data) {
    const regex = /\$\{([^}]+)\}/g;
    let result = this.template;
    let match;

    while ((match = regex.exec(this.template)) !== null) {
      const key = match[1];
      const value = data.hasOwnProperty(key) ? data[key] : '';

      result = result.replace(match[0], value);
    }

    return result;
  }

  static fromText(template) {
    return new Prompt(template);
  }

  static fromFile(filePath) {
    const template = fs.readFileSync(filePath, 'utf-8');
    return new Prompt(template);
  }
}

module.exports = Prompt;