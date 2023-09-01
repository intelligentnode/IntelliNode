/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class GPTStreamParser {
    constructor(handler, isLog = false) {
        this.handler = handler;
        this.buffer = '';
        this.isLog = isLog;
    }

    feed(data) {
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
            this.handler(jsonData);
            this.buffer = this.buffer.slice(eventEndIndex + 2);
        }
    }
}
module.exports = GPTStreamParser;