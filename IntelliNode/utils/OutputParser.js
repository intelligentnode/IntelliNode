/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/

/**
 * Remove reasoning that some models (e.g. DeepSeek) put before the answer: complete <think>...</think>
 * blocks, and everything up to a leftover closing tag when the chat template opened the block itself.
 */
function stripThinking(text) {
  let cleaned = String(text || '').replace(/<think>[\s\S]*?<\/think>/g, '');
  const orphanClose = cleaned.lastIndexOf('</think>');
  if (orphanClose !== -1) {
    cleaned = cleaned.slice(orphanClose + '</think>'.length);
  }
  return cleaned.trim();
}

const FENCE_LINE = /^\s*```\s*([\w+#.-]*)/;

/**
 * All markdown code blocks in the text as [{ lang, code }], parsed line by line.
 * A language-tagged fence inside a block opens a new block (closing fences never carry a language),
 * which handles answers wrapped in an outer ```markdown fence. A block left open at the end of the
 * text (truncated output) is kept only when no closed block exists.
 */
function extractBlocks(text) {
  const cleaned = stripThinking(text);
  const blocks = [];
  let current = null;

  for (const line of cleaned.split('\n')) {
    const fence = FENCE_LINE.exec(line);
    if (!fence) {
      if (current) current.lines.push(line);
      continue;
    }
    const lang = fence[1].toLowerCase();
    if (!current) {
      current = { lang, lines: [], closed: false };
    } else if (lang) {
      blocks.push(current);
      current = { lang, lines: [], closed: false };
    } else {
      current.closed = true;
      blocks.push(current);
      current = null;
    }
  }
  if (current) blocks.push(current);

  const finished = blocks
    .map((block) => ({ lang: block.lang, code: block.lines.join('\n').replace(/\s+$/, ''), closed: block.closed }))
    .filter((block) => block.code.trim());
  const hasClosed = finished.some((block) => block.closed);
  return finished
    .filter((block) => block.closed || !hasClosed)
    .map((block) => ({ lang: block.lang, code: block.code }));
}

/**
 * Return the code from the markdown block tagged `language`, otherwise the longest block
 * (models sometimes emit a short block, e.g. a usage example, next to the real one).
 * Text without fences is returned trimmed.
 */
function extractCode(text, language = null) {
  const cleaned = stripThinking(text);
  const blocks = extractBlocks(cleaned);
  if (language) {
    const wanted = blocks.find((block) => block.lang === String(language).toLowerCase());
    if (wanted) return wanted.code;
  }
  if (blocks.length > 0) {
    return blocks.reduce((best, block) => (block.code.length > best.code.length ? block : best)).code;
  }
  return cleaned.replace(/^```[^\n]*\n?/, '').replace(/\n?```\s*$/, '').trim();
}

// Remove an outer fence wrapper while keeping any code blocks nested inside it.
function unwrapFence(text) {
  const opener = /^\s*```[^\n]*\n?/.exec(text);
  if (!opener) return text.trim();
  let body = text.slice(opener[0].length);
  const fences = body.match(/^\s*```/gm) || [];
  if (fences.length % 2 === 1) {
    // an odd number of remaining fences means the last one closes the wrapper
    body = body.slice(0, body.lastIndexOf('```'));
  }
  return body.trim();
}

/** Markdown answers are sometimes wrapped in a ```markdown fence (even with code blocks inside); unwrap it. */
function extractMarkdown(text) {
  const cleaned = stripThinking(text);
  const wrapper = /(^|\n)\s*```(?:markdown|md)\b[^\n]*\n/i.exec(cleaned);
  if (wrapper) {
    // only a short lead-in ("Here is the README:") may precede a wrapper; a later ```md block is an example inside the document
    const leadIn = cleaned.slice(0, wrapper.index);
    if (leadIn.split('\n').filter((line) => line.trim()).length <= 1 && !/^\s*#/m.test(leadIn)) {
      return unwrapFence(cleaned.slice(wrapper.index));
    }
  }
  // a document that merely starts with a code block is not a wrapper, so require a closing fence at the very end
  return cleaned.startsWith('```') && /\n\s*```\s*$/.test(cleaned) ? unwrapFence(cleaned) : cleaned;
}

const JSON_ESCAPES = new Set(['"', '\\', '/', 'b', 'f', 'n', 'r', 't', 'u']);

function dropTrailingComma(out) {
  let i = out.length - 1;
  while (i >= 0 && /\s/.test(out[i])) i--;
  return out[i] === ',' ? out.slice(0, i) + out.slice(i + 1) : out;
}

/**
 * Fix the JSON mistakes models make most: raw newlines/tabs inside strings, lone backslashes that are not
 * JSON escapes (\d in a regex pattern) and trailing commas. Only structure outside strings is touched.
 */
function repairJson(text) {
  let out = '';
  let inString = false;
  let escaped = false;
  for (const ch of text) {
    if (inString) {
      if (escaped) {
        escaped = false;
        out += JSON_ESCAPES.has(ch) ? `\\${ch}` : `\\\\${ch}`;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
        out += ch;
      } else if (ch === '\n') {
        out += '\\n';
      } else if (ch === '\r') {
        out += '\\r';
      } else if (ch === '\t') {
        out += '\\t';
      } else {
        out += ch;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === '}' || ch === ']') {
      out = dropTrailingComma(out);
    }
    out += ch;
  }
  if (escaped) out += '\\\\';
  return out;
}

function tryParse(candidate) {
  for (const attempt of [candidate, repairJson(candidate)]) {
    try {
      return { value: JSON.parse(attempt) };
    } catch (error) {
      // try the next attempt
    }
  }
  return null;
}

// Find the first balanced JSON object or array (respecting strings and escapes) that parses.
// A candidate that does not parse is skipped as a whole, so nested objects are never returned in its place.
function findBalancedJson(text) {
  let start = 0;
  while (start < text.length) {
    const open = text[start];
    if (open !== '{' && open !== '[') {
      start++;
      continue;
    }
    const close = open === '{' ? '}' : ']';
    let depth = 0;
    let inString = false;
    let escaped = false;
    let end = -1;
    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') inString = true;
      else if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    if (end === -1) return undefined;
    const parsed = tryParse(text.slice(start, end + 1));
    if (parsed) return parsed.value;
    start = end + 1;
  }
  return undefined;
}

/** Parse JSON from model output that may include prose, markdown fences, thinking blocks or small syntax slips. */
function parseJson(text) {
  const cleaned = stripThinking(text);
  for (const candidate of [cleaned, extractCode(cleaned, 'json')]) {
    const parsed = tryParse(candidate);
    if (parsed) return parsed.value;
  }
  const found = findBalancedJson(cleaned);
  if (found !== undefined) return found;
  throw new Error(`The model response is not valid JSON: ${cleaned.slice(0, 200)}`);
}

/** Return the first <svg>...</svg> element from model output. */
function extractSvg(text) {
  const cleaned = extractCode(text);
  const match = /<svg[\s\S]*?<\/svg>/i.exec(cleaned);
  if (!match) {
    throw new Error(`The model response does not contain an <svg> element: ${cleaned.slice(0, 200)}`);
  }
  return match[0];
}

module.exports = { stripThinking, extractBlocks, extractCode, extractMarkdown, repairJson, parseJson, extractSvg };
