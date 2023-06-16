const fs = require("fs");
const path = require("path");

class SystemHelper {
  constructor() {
    this.systemsPath = path.join(__dirname, "..", "resource", "templates");
  }

  loadPrompt(file_type) {
    let promptPath = '';
    if (file_type === "sentiment") {
      promptPath = path.join(this.systemsPath, "sentiment_prompt.in");
    } else if (file_type === "summary") {
      promptPath = path.join(this.systemsPath, "summary_prompt.in");
    } else if (file_type === "html_page") {
      promptPath = path.join(this.systemsPath, "html_page_prompt.in");
    } else if (file_type === "graph_dashboard") {
      promptPath = path.join(this.systemsPath, "graph_dashboard_prompt.in");
    } else if (file_type === "instruct_update") {
      promptPath = path.join(this.systemsPath, "instruct_update.in");
    } else {
      throw new Error(`File type '${file_type}' not supported`);
    }
    const promptTemplate = fs.readFileSync(promptPath, "utf8");

    return promptTemplate;

  }
}

module.exports = SystemHelper;