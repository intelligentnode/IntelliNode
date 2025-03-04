/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class GPTStreamParser {
    constructor(isLog = false) {
        this.buffer = '';
        this.isLog = isLog;
    }

    async * feed(data) {
        this.buffer += data;

        // check if the buffer contains events
        while (this.buffer.includes('\n\n')) {
            // find the end of the first complete event
            const eventEndIndex = this.buffer.indexOf('\n\n');
            let rawData = this.buffer.slice(0, eventEndIndex).trim();

            // remove the processed event
            this.buffer = this.buffer.slice(eventEndIndex + 2);

            // look for the stop signal
            if (rawData === "data: [DONE]") {
                if (this.isLog) {
                    console.log("Parsing finished.");
                }
                // stop processing if the stream is done
                return;
            }

            // skip lines without "data: "
            if (!rawData.startsWith("data: ")) {
                continue;
            }

            try {
                // parse the JSON
                const jsonData = JSON.parse(rawData.substring(6));
                const contentText = jsonData.choices?.[0]?.delta?.content;
                if (contentText) {
                    yield contentText;
                }
            } catch (error) {
                console.error("Error parsing JSON in stream:", error);
            }
        }
    }
}
class CohereStreamParser {
    constructor(isLog = false) {
        this.buffer = '';
        this.isLog = false;
    }

    async * feed(data) {
        this.buffer += data;

        if (this.buffer.includes('\n')) {
            const eventEndIndex = this.buffer.indexOf('\n');
            const rawData = this.buffer.slice(0, eventEndIndex + 1).trim();

            // Convert the rawData into JSON format
            const jsonData = JSON.parse(rawData);
            const contentText = jsonData.text;
            if (contentText) {
                yield contentText;
            }
            this.buffer = this.buffer.slice(eventEndIndex + 1);
        }
    }
}

class VLLMStreamParser {
  constructor(isLog = false) {
    this.buffer = '';
    this.isLog = isLog;
  }

  async *feed(data) {
    this.buffer += data;

    // Check if the buffer contains events
    while (this.buffer.includes('\n\n')) {
      const eventEndIndex = this.buffer.indexOf('\n\n');
      let rawData = this.buffer.slice(0, eventEndIndex).trim();

      // Remove the processed event
      this.buffer = this.buffer.slice(eventEndIndex + 2);

      // Look for the stop signal
      if (rawData === "data: [DONE]") {
        if (this.isLog) {
          console.log("Parsing finished.");
        }
        return;
      }

      // Skip lines without "data: "
      if (!rawData.startsWith("data: ")) {
        continue;
      }

      try {
        // Parse the JSON
        const jsonData = JSON.parse(rawData.substring(6));

        // Handle both completion and chat completion formats
        let contentText = null;

        if (jsonData.choices?.[0]?.text) {
          // Text completion format
          contentText = jsonData.choices[0].text;
        } else if (jsonData.choices?.[0]?.delta?.content) {
          // Chat completion format
          contentText = jsonData.choices[0].delta.content;
        }

        if (contentText) {
          yield contentText;
        }
      } catch (error) {
        console.error("Error parsing JSON in stream:", error);
      }
    }
  }
}


module.exports = {
    GPTStreamParser,
    CohereStreamParser,
    VLLMStreamParser
};