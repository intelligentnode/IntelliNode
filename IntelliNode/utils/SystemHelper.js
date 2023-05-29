const fs = require("fs");
const path = require("path");

class SystemHelper {
  constructor() {
    this.systemsPath = path.join(__dirname, "..", "resource", "templates");
  }

  loadPrompt(file_type) {
    if (file_type === "sentiment") {
      const sentimentSystemPath = path.join(this.systemsPath, "sentiment_prompt.in");
      const promptTemplate = fs.readFileSync(sentimentSystemPath, "utf8");
      return promptTemplate;
    } else if (file_type === "summary") {
      const summarySystemPath = path.join(this.systemsPath, "summary_prompt.in");
      const promptTemplate = fs.readFileSync(summarySystemPath, "utf8");
      return promptTemplate;
    } else if (file_type === "html_page") {
      const promptPath = path.join(this.systemsPath, "html_page_prompt.in");
      const promptTemplate = fs.readFileSync(promptPath, "utf8");
      return promptTemplate;
    } else {
      throw new Error(`File type '${file_type}' not supported`);
    }
  }
}

module.exports = SystemHelper;