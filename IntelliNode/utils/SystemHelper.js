const FileHelper = require('./FileHelper')
const path = require("path");

class SystemHelper {
  constructor() {
    this.systemsPath = path.join(__dirname, "..", "resource", "templates");
  }

  getPromptPath(fileType) {
    let promptPath = '';
    if (fileType === "sentiment") {
      promptPath = path.join(this.systemsPath, "sentiment_prompt.in");
    } else if (fileType === "summary") {
      promptPath = path.join(this.systemsPath, "summary_prompt.in");
    } else if (fileType === "html_page") {
      promptPath = path.join(this.systemsPath, "html_page_prompt.in");
    } else if (fileType === "graph_dashboard") {
      promptPath = path.join(this.systemsPath, "graph_dashboard_prompt.in");
    } else if (fileType === "instruct_update") {
      promptPath = path.join(this.systemsPath, "instruct_update.in");
    } else if (fileType === "prompt_example") {
      promptPath = path.join(this.systemsPath, "prompt_example.in");
    } else if (fileType === "augmented_chatbot") {
      promptPath = path.join(this.systemsPath, "augmented_chatbot.in");
    } else {
      throw new Error(`File type '${file_type}' not supported`);
    }

    return promptPath;
  }

  loadPrompt(fileType) {
    let promptPath = this.getPromptPath(fileType)
    const promptTemplate = FileHelper.readData(promptPath, 'utf-8');

    return promptTemplate;

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