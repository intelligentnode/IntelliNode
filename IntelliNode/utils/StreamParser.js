/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class GPTStreamParser {
    constructor(isLog = false) {
        this.buffer = '';
        this.isLog = false;
    }

    async *feed(data) {
        this.buffer += data;

        if (this.buffer.startsWith("data: [DONE]")) {
            if (this.isLog) {
                console.log("Parsing finished.");
            }
            this.buffer = '';
            return;
        }

        if (this.buffer.includes('\n\n')) {
            const eventEndIndex = this.buffer.indexOf('\n\n');
            const rawData = this.buffer.slice(0, eventEndIndex + 1).trim();

            if (!rawData.startsWith("data: ")) {
                // skip it, if not a data line.
                this.buffer = this.buffer.slice(eventEndIndex + 2);
                return;
            }
            // remove initial "data: " from rawData.
            const jsonData = JSON.parse(rawData.slice(6));
            const contentText = jsonData.choices[0]?.delta?.content;
            if (contentText) {
                yield contentText;
            }
            this.buffer = this.buffer.slice(eventEndIndex + 2);
        }
    }
}
class CohereStreamParser {
    constructor(isLog = false) {
      this.buffer = '';
      this.isLog = false;
    }
  
    async *feed(data) {
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

module.exports = {GPTStreamParser, CohereStreamParser};