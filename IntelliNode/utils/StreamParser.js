/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/

/**
 * Iterate a fetch response body as decoded text.
 * Handles Node streams (Buffer chunks) and browser ReadableStreams (Uint8Array chunks),
 * including browsers without async iteration on ReadableStream (Safari).
 */
async function* readStreamChunks(stream) {
    const decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8') : null;
    const decode = (chunk) => {
        if (typeof chunk === 'string') return chunk;
        if (decoder) return decoder.decode(chunk, { stream: true });
        return Buffer.from(chunk).toString('utf8');
    };

    if (stream && typeof stream.getReader === 'function') {
        const reader = stream.getReader();
        let finished = false;
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    finished = true;
                    break;
                }
                yield decode(value);
            }
        } finally {
            if (!finished) {
                try { await reader.cancel(); } catch (error) { /* stream already closed */ }
            }
            reader.releaseLock();
        }
    } else {
        for await (const chunk of stream) {
            yield decode(chunk);
        }
    }

    if (decoder) {
        const tail = decoder.decode();
        if (tail) yield tail;
    }
}

// Split complete server-sent events from the buffer; returns [events, remainingBuffer].
function splitEvents(buffer) {
    const parts = buffer.replace(/\r\n/g, '\n').split('\n\n');
    const rest = parts.pop();
    return [parts, rest];
}

// Joined `data:` payload of one server-sent event, or null when the event has no data.
function eventData(rawEvent) {
    const lines = rawEvent.split('\n').filter((line) => line.startsWith('data:'));
    if (lines.length === 0) return null;
    return lines.map((line) => line.slice(5).replace(/^ /, '')).join('\n');
}

/** Parses OpenAI-compatible streams: chat completions and the Responses API (gpt-5+). */
class GPTStreamParser {
    constructor(isLog = false) {
        this.buffer = '';
        this.isLog = isLog;
        this.done = false;
    }

    async * feed(data) {
        if (this.done) return;
        this.buffer += data;
        const [events, rest] = splitEvents(this.buffer);
        this.buffer = rest;

        for (const rawEvent of events) {
            const payload = eventData(rawEvent.trim());
            if (payload === null) continue;

            // look for the stop signal
            if (payload.trim() === '[DONE]') {
                this.done = true;
                if (this.isLog) {
                    console.log("Parsing finished.");
                }
                return;
            }

            let jsonData;
            try {
                jsonData = JSON.parse(payload);
            } catch (error) {
                console.error("Error parsing JSON in stream:", error);
                continue;
            }

            // chat completions format
            const contentText = jsonData.choices?.[0]?.delta?.content;
            if (contentText) {
                yield contentText;
                continue;
            }

            // Responses API format
            if ((jsonData.type === 'response.output_text.delta' || jsonData.type === 'response.refusal.delta') && jsonData.delta) {
                yield jsonData.delta;
            } else if (jsonData.type === 'error') {
                throw new Error(`OpenAI stream error: ${jsonData.message || JSON.stringify(jsonData)}`);
            } else if (jsonData.type === 'response.failed') {
                throw new Error(`OpenAI response failed: ${jsonData.response?.error?.message || 'unknown error'}`);
            }
        }
    }
}

/** Parses Anthropic Messages API streams, yielding answer text and skipping thinking deltas. */
class AnthropicStreamParser {
    constructor(isLog = false) {
        this.buffer = '';
        this.isLog = isLog;
    }

    async * feed(data) {
        this.buffer += data;
        const [events, rest] = splitEvents(this.buffer);
        this.buffer = rest;

        for (const rawEvent of events) {
            const payload = eventData(rawEvent.trim());
            if (payload === null) continue;

            let jsonData;
            try {
                jsonData = JSON.parse(payload);
            } catch (error) {
                console.error("Error parsing JSON in stream:", error);
                continue;
            }

            if (jsonData.type === 'content_block_delta' && jsonData.delta?.type === 'text_delta' && jsonData.delta.text) {
                yield jsonData.delta.text;
            } else if (jsonData.type === 'error') {
                throw new Error(`Anthropic stream error: ${jsonData.error?.message || JSON.stringify(jsonData)}`);
            } else if (jsonData.type === 'message_stop' && this.isLog) {
                console.log("Parsing finished.");
            }
        }
    }
}

/** Parses Cohere chat streams (newline-delimited JSON). */
class CohereStreamParser {
    constructor(isLog = false) {
        this.buffer = '';
        this.isLog = isLog;
    }

    async * feed(data) {
        this.buffer += data;

        // a single chunk can carry several events, so drain every complete line
        let eventEndIndex;
        while ((eventEndIndex = this.buffer.indexOf('\n')) !== -1) {
            const rawData = this.buffer.slice(0, eventEndIndex).trim();
            this.buffer = this.buffer.slice(eventEndIndex + 1);
            if (!rawData) continue;

            let jsonData;
            try {
                jsonData = JSON.parse(rawData);
            } catch (error) {
                console.error("Error parsing JSON in stream:", error);
                continue;
            }

            // stream-end repeats the full text inside `response`; only text-generation carries new text
            if (jsonData.event_type && jsonData.event_type !== 'text-generation') continue;
            if (jsonData.text) {
                yield jsonData.text;
            }
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
    VLLMStreamParser,
    AnthropicStreamParser,
    readStreamChunks
};
