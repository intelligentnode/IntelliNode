const fs = require("fs");
const path = require("path");

class SystemHelper {
  constructor() {
    this.systemsPath = path.join(__dirname, "..", "resource", "systems");
  }

  loadSystem(file_type) {
    if (file_type === "sentiment") {
      const sentimentSystemPath = path.join(this.systemsPath, "sentiment_system.in");
      const sentimentSystem = fs.readFileSync(sentimentSystemPath, "utf8");
      return sentimentSystem;
    } else if (file_type === "summary") {
      const summarySystemPath = path.join(this.systemsPath, "summary_system.in");
      const summarySystem = fs.readFileSync(summarySystemPath, "utf8");
      return summarySystem;
    } else {
      throw new Error(`File type '${file_type}' not supported`);
    }
  }
}

module.exports = SystemHelper;