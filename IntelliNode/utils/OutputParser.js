/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/

/**
 * Remove inline reasoning that some models (DeepSeek on NVIDIA, vLLM) put before the answer.
 * Only a leading <think>...</think> block, or a closing tag when the chat template opened the block itself,
 * is removed; tags mentioned later in the answer are kept. A reasoning block that never closes (the output
 * budget ran out while thinking) leaves no answer, so an empty string is returned.
 * Use it only for providers that return reasoning inline.
 */
function stripThinking(text) {
  const trimmed = String(text || '').trim();
  if (trimmed.startsWith('<think>')) {
    const close = trimmed.indexOf('</think>');
    return close === -1 ? '' : trimmed.slice(close + '</think>'.length).trim();
  }
  const close = trimmed.indexOf('</think>');
  if (close !== -1 && !trimmed.slice(0, close).includes('<think>')) {
    return trimmed.slice(close + '</think>'.length).trim();
  }
  return trimmed;
}

// A fence line: at most three spaces of indentation, three or more backticks or tildes, then an optional info string.
function parseFence(line) {
  const match = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
  if (!match) return null;
  const info = match[2].trim();
  if (match[1][0] === '`' && info.includes('`')) return null;
  return {
    char: match[1][0],
    length: match[1].length,
    info,
    lang: (info.split(/\s+/)[0] || '').toLowerCase(),
  };
}

function closesFence(fence, opener) {
  return Boolean(fence) && !fence.info && fence.char === opener.char && fence.length >= opener.length;
}

// Split text into fenced blocks. A fence with an info string never closes a block, and a closing fence
// must use the same character and at least as many of them as the opening fence (CommonMark rules).
function scanBlocks(text) {
  const blocks = [];
  let current = null;
  for (const line of String(text || '').replace(/\r\n/g, '\n').split('\n')) {
    const fence = parseFence(line);
    if (!current) {
      if (fence) current = { opener: fence, lines: [], closed: false };
      continue;
    }
    if (closesFence(fence, current.opener)) {
      current.closed = true;
      blocks.push(current);
      current = null;
    } else {
      current.lines.push(line);
    }
  }
  if (current) blocks.push(current);
  return blocks.map((block) => ({
    lang: block.opener.lang,
    code: block.lines.join('\n').replace(/^(?:[ \t]*\n)+/, '').replace(/\s+$/, ''),
    closed: block.closed,
  }));
}

// A block whose content starts with another fence is a wrapper (e.g. ```markdown around ```javascript): use the inner blocks.
function expandWrappers(blocks) {
  const result = [];
  for (const block of blocks) {
    const firstLine = block.code.split('\n').find((line) => line.trim());
    if (firstLine && parseFence(firstLine)) {
      const inner = scanBlocks(block.code).map((innerBlock) => ({ ...innerBlock, closed: innerBlock.closed || block.closed }));
      result.push(...expandWrappers(inner));
    } else {
      result.push(block);
    }
  }
  return result;
}

/**
 * All markdown code blocks in the text as [{ lang, code }].
 * A block cut off at the end of the text (truncated output) is kept when no block was closed, or when it is
 * language-tagged and longer than every closed block (the main code after a short setup snippet).
 */
function extractBlocks(text) {
  const blocks = expandWrappers(scanBlocks(text)).filter((block) => block.code.trim());
  const closed = blocks.filter((block) => block.closed);
  const longestClosed = closed.reduce((max, block) => Math.max(max, block.code.length), 0);
  return blocks
    .filter((block) => block.closed || closed.length === 0 || (block.lang && block.code.length > longestClosed))
    .map(({ lang, code }) => ({ lang, code }));
}

/**
 * Return the code from the block tagged `language`, otherwise the longest block
 * (models sometimes add a short block, e.g. a usage example, next to the real one).
 * Text without fences is returned trimmed.
 */
function extractCode(text, language = null) {
  const blocks = extractBlocks(text);
  if (language) {
    const wanted = blocks.find((block) => block.lang === String(language).toLowerCase());
    if (wanted) return wanted.code;
  }
  if (blocks.length > 0) {
    return blocks.reduce((best, block) => (block.code.length > best.code.length ? block : best)).code;
  }
  return String(text || '').trim();
}

const WRAPPER_LANGS = new Set(['', 'markdown', 'md', 'mdx']);

function isShortRemark(lines) {
  const remarks = lines.filter((line) => line.trim());
  return remarks.length === 0 || (remarks.length === 1 && remarks[0].length <= 200 && !/^\s*#/.test(remarks[0]));
}

// The inner fences of a real wrapper pair up: every opening fence has its closing fence.
function hasBalancedFences(lines) {
  let open = null;
  for (const line of lines) {
    const fence = parseFence(line);
    if (!fence) continue;
    if (!open) open = fence;
    else if (closesFence(fence, open)) open = null;
  }
  return open === null;
}

/**
 * Markdown answers are sometimes wrapped in a ```markdown (or ````markdown) fence, even with code blocks inside;
 * unwrap it. The wrapper may only follow a short lead-in ("Here is the README:"), must close on the last fence
 * line with at most one short sign-off after it, and must contain balanced inner fences. Anything else, such as
 * a ```markdown example inside an explanation, is returned unchanged.
 */
function extractMarkdown(text) {
  const cleaned = String(text || '').trim();
  const lines = cleaned.split('\n');
  const openIndex = lines.findIndex((line) => parseFence(line));
  if (openIndex === -1) return cleaned;
  const opener = parseFence(lines[openIndex]);
  if (!WRAPPER_LANGS.has(opener.lang) || !isShortRemark(lines.slice(0, openIndex))) return cleaned;

  let closeIndex = -1;
  for (let i = lines.length - 1; i > openIndex; i--) {
    if (closesFence(parseFence(lines[i]), opener)) {
      closeIndex = i;
      break;
    }
  }
  if (closeIndex === -1) {
    // an unterminated ```markdown wrapper at the start is a truncated document
    const truncated = openIndex === 0 && opener.lang && hasBalancedFences(lines.slice(1));
    return truncated ? lines.slice(1).join('\n').trim() : cleaned;
  }
  const body = lines.slice(openIndex + 1, closeIndex);
  if (!isShortRemark(lines.slice(closeIndex + 1)) || !hasBalancedFences(body)) return cleaned;
  return body.join('\n').trim();
}

function dropTrailingComma(out) {
  let i = out.length - 1;
  while (i >= 0 && /\s/.test(out[i])) i--;
  return out[i] === ',' ? out.slice(0, i) + out.slice(i + 1) : out;
}

/**
 * Fix the JSON mistakes models make most: raw newlines/tabs inside strings, trailing commas, and single
 * backslashes from regexes or file paths (\d, \b, \u without four hex digits), which are kept as literal
 * backslashes. Structure outside strings is only touched to drop trailing commas.
 */
function repairJson(text) {
  let out = '';
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === '\\') {
        const next = text[i + 1];
        if (next === undefined) {
          out += '\\\\';
          continue;
        }
        const unicode = next === 'u' && /^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6));
        out += '"\\/nrt'.includes(next) || unicode ? ch + next : `\\\\${next}`;
        i++;
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
  return out;
}

function matchesKind(value, kind) {
  if (kind === 'array') return Array.isArray(value);
  if (kind === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  return true;
}

function tryParse(candidate, kind) {
  for (const attempt of [candidate, repairJson(candidate)]) {
    try {
      const value = JSON.parse(attempt);
      return matchesKind(value, kind) ? { value } : null;
    } catch (error) {
      // try the repaired text next
    }
  }
  return null;
}

// Find the first balanced JSON object or array (respecting strings and escapes) that parses and has the wanted kind.
// A balanced candidate that is rejected is skipped as a whole, so a nested value is never returned in its place;
// an opening bracket that never closes (stray prose) is skipped by itself.
function findBalancedJson(text, kind) {
  let start = 0;
  while (start < text.length) {
    const open = text[start];
    const wanted = (open === '{' && kind !== 'array') || (open === '[' && kind !== 'object');
    if (!wanted) {
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
    if (end === -1) {
      start++;
      continue;
    }
    const parsed = tryParse(text.slice(start, end + 1), kind);
    if (parsed) return parsed.value;
    start = end + 1;
  }
  return undefined;
}

/**
 * Parse JSON from model output that may include prose, markdown fences or small syntax slips.
 * @param {string} text - the model output.
 * @param {string|null} kind - 'object' or 'array' to only accept that kind of value.
 */
function parseJson(text, kind = null) {
  const cleaned = String(text || '').trim();
  const jsonBlocks = extractBlocks(cleaned).filter((block) => block.lang === 'json').map((block) => block.code);
  for (const candidate of [cleaned, ...jsonBlocks, extractCode(cleaned)]) {
    const parsed = tryParse(candidate, kind);
    if (parsed) return parsed.value;
  }
  const found = findBalancedJson(cleaned, kind);
  if (found !== undefined) return found;
  const expected = kind ? `a JSON ${kind}` : 'valid JSON';
  throw new Error(`The model response is not ${expected}: ${cleaned.slice(0, 200)}`);
}

// Every <svg>...</svg> element in the source, as { openTag, svg }.
function svgElements(source) {
  const elements = [];
  const lower = source.toLowerCase();
  const opener = /<svg\b[^>]*>/gi;
  let match;
  while ((match = opener.exec(source)) !== null) {
    const end = lower.indexOf('</svg>', opener.lastIndex);
    if (end === -1) break;
    elements.push({ openTag: match[0], svg: source.slice(match.index, end + '</svg>'.length) });
  }
  return elements;
}

/**
 * Return an SVG element from model output. Blocks tagged svg, xml or html (or untagged) are searched first,
 * then the other blocks and the raw text. A real SVG (viewBox or xmlns, no JSX expressions) is preferred.
 */
function extractSvg(text) {
  const source = String(text || '');
  const blocks = extractBlocks(source);
  const markupLangs = ['svg', 'xml', 'html', ''];
  const candidates = [
    ...blocks.filter((block) => markupLangs.includes(block.lang)).map((block) => block.code),
    ...blocks.filter((block) => !markupLangs.includes(block.lang)).map((block) => block.code),
    source,
  ];
  let plain = null;
  let jsx = null;
  for (const candidate of candidates) {
    for (const element of svgElements(candidate)) {
      if (element.openTag.includes('{')) {
        jsx = jsx || element.svg;
      } else if (/\b(viewBox|xmlns)\s*=/i.test(element.openTag)) {
        return element.svg;
      } else {
        plain = plain || element.svg;
      }
    }
  }
  if (plain || jsx) return plain || jsx;
  throw new Error(`The model response does not contain an <svg> element: ${source.trim().slice(0, 200)}`);
}

module.exports = { stripThinking, extractBlocks, extractCode, extractMarkdown, repairJson, parseJson, extractSvg };
