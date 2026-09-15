const FileHelper = require('./FileHelper')
const path = require("path");

// Template files that do not follow the "<name>_prompt.in" naming.
const TEMPLATE_FILES = {
  instruct_update: "instruct_update.in",
  prompt_example: "prompt_example.in",
  augmented_chatbot: "augmented_chatbot.in",
};

class SystemHelper {
  constructor() {
    this.systemsPath = path.join(__dirname, "..", "resource", "templates");
  }

  static getTemplateFileName(fileType) {
    return TEMPLATE_FILES[fileType] || `${fileType}_prompt.in`;
  }

  getPromptPath(fileType) {
    return path.join(this.systemsPath, SystemHelper.getTemplateFileName(fileType));
  }

  loadPrompt(fileType) {
    const fileName = SystemHelper.getTemplateFileName(fileType);
    // the browser bundle has no file system, so fall back to the templates embedded at build time
    const embedded = require('../resource/templates/templates');
    try {
      return FileHelper.readData(this.getPromptPath(fileType), 'utf-8');
    } catch (error) {
      if (embedded[fileName] !== undefined) {
        return embedded[fileName];
      }
      throw new Error(`File type '${fileType}' not supported`);
    }
  }

  loadStaticPrompt(fileType) { 

    if (fileType === "augmented_chatbot") { 
      return "Using the provided context, craft a  cohesive response that directly addresses the user's query. " +
      "If the context lacks relevance or is absent, focus on generating a knowledgeable and accurate answer based on the user's question alone. " +
      "Aim for clarity and conciseness in your reply.\n" +
      "Context:\n" +
      "${semantic_search}" +
      "\n---------------------------------\n" +
      "User's Question:\n" +
      "${user_query}";
    }

  }
}

module.exports = SystemHelper;
