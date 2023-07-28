const fs = require('fs');

class Prompt {
  constructor(template) {
    this.template = template;
  }

  format(data) {
    const regex = /{([^}]+)}|\$\{([^}]+)\}/g;
    const matches = this.template.match(regex);

    let result = this.template;
    if (matches) {
      for (const match of matches) {
        const key = match.slice(1, -1) || match.slice(2, -1); // Remove braces if present
        const value = data[key] || '';
        result = result.replace(match, value);
      }
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