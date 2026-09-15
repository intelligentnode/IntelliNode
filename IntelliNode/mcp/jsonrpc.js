/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { readStreamChunks } = require('../utils/StreamParser');

/**
 * JSON-RPC 2.0 helpers shared by the MCP client and server: message builders and validators, the error codes
 * used by MCP, a newline-delimited JSON reader (stdio transport) and an SSE parser (Streamable HTTP transport).
 */

const JSONRPC_VERSION = '2.0';

const ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  // MCP 2026-07-28 protocol errors
  HEADER_MISMATCH: -32020,
  MISSING_REQUIRED_CLIENT_CAPABILITY: -32021,
  UNSUPPORTED_PROTOCOL_VERSION: -32022,
  // legacy (2025-xx) Streamable HTTP servers use these for "not initialized" and "session not found"
  SERVER_NOT_INITIALIZED: -32000,
  SESSION_NOT_FOUND: -32001,
};

// A JSON-RPC error with one of these codes can only come from a modern (2026-07-28+) server.
const MODERN_ERROR_CODES = new Set([
  ERROR_CODES.HEADER_MISMATCH,
  ERROR_CODES.MISSING_REQUIRED_CLIENT_CAPABILITY,
  ERROR_CODES.UNSUPPORTED_PROTOCOL_VERSION,
]);

// Protocol revisions: modern ones carry per-request _meta, legacy ones start with an initialize handshake.
const MODERN_VERSIONS = ['2026-07-28'];
const LEGACY_VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
const LATEST_LEGACY_VERSION = LEGACY_VERSIONS[0];

const META_KEYS = {
  protocolVersion: 'io.modelcontextprotocol/protocolVersion',
  clientInfo: 'io.modelcontextprotocol/clientInfo',
  clientCapabilities: 'io.modelcontextprotocol/clientCapabilities',
  serverInfo: 'io.modelcontextprotocol/serverInfo',
};

// Methods whose params.name / params.uri is mirrored into the Mcp-Name HTTP header.
const NAME_HEADER_FIELDS = {
  'tools/call': 'name',
  'resources/read': 'uri',
  'prompts/get': 'name',
};

class JsonRpcError extends Error {
  constructor(code, message, data) {
    super(message);
    this.name = 'JsonRpcError';
    this.code = code;
    if (data !== undefined) this.data = data;
  }

  toJSON() {
    return { code: this.code, message: this.message, ...(this.data !== undefined && { data: this.data }) };
  }
}

function hasId(message) {
  return message.id !== undefined && message.id !== null;
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isMessage(message) {
  return isObject(message) && message.jsonrpc === JSONRPC_VERSION
    && (typeof message.method === 'string' || 'result' in message || isObject(message.error));
}

function isRequest(message) {
  return isMessage(message) && typeof message.method === 'string' && hasId(message);
}

function isNotification(message) {
  return isMessage(message) && typeof message.method === 'string' && !hasId(message);
}

function isResponse(message) {
  return isMessage(message) && typeof message.method !== 'string' && ('result' in message || isObject(message.error));
}

function request(id, method, params) {
  return { jsonrpc: JSONRPC_VERSION, id, method, ...(params !== undefined && { params }) };
}

function notification(method, params) {
  return { jsonrpc: JSONRPC_VERSION, method, ...(params !== undefined && { params }) };
}

function response(id, result) {
  return { jsonrpc: JSONRPC_VERSION, id, result };
}

// id is null when the request id could not be determined (parse errors, invalid requests).
function errorResponse(id, code, message, data) {
  return {
    jsonrpc: JSONRPC_VERSION,
    id: id === undefined ? null : id,
    error: { code, message, ...(data !== undefined && { data }) },
  };
}

function errorFromResponse(message) {
  const error = message && message.error ? message.error : {};
  return new JsonRpcError(
    typeof error.code === 'number' ? error.code : ERROR_CODES.INTERNAL_ERROR,
    error.message || 'Unknown JSON-RPC error',
    error.data,
  );
}

// JSON.stringify escapes control characters, so the output never contains an embedded newline.
function serialize(message) {
  return JSON.stringify(message);
}

function parseMessage(text) {
  let value;
  try {
    value = JSON.parse(text);
  } catch (error) {
    throw new JsonRpcError(ERROR_CODES.PARSE_ERROR, `Parse error: ${error.message}`);
  }
  if (!isMessage(value)) {
    throw new JsonRpcError(ERROR_CODES.INVALID_REQUEST, 'Invalid Request: not a JSON-RPC 2.0 message');
  }
  return value;
}

// ---------------------------------------------------------------------
// HTTP header value encoding (Mcp-Name, Mcp-Param-*)
// ---------------------------------------------------------------------

const SENTINEL_PREFIX = '=?base64?';
const SENTINEL_SUFFIX = '?=';

// visible ASCII plus inner spaces/tabs, without leading or trailing whitespace
function isPlainHeaderValue(value) {
  return /^[\x21-\x7e]([\x20\x21-\x7e\t]*[\x21-\x7e])?$/.test(value);
}

function isSentinel(value) {
  return value.startsWith(SENTINEL_PREFIX) && value.endsWith(SENTINEL_SUFFIX);
}

// Base64 helpers that work in Node and in the browser bundle.
function toBase64(text) {
  if (typeof Buffer !== 'undefined') return Buffer.from(text, 'utf8').toString('base64');
  return btoa(unescape(encodeURIComponent(text)));
}

function fromBase64(text) {
  if (typeof Buffer !== 'undefined') return Buffer.from(text, 'base64').toString('utf8');
  return decodeURIComponent(escape(atob(text)));
}

/** Encode a body value for a mirrored header; non-ASCII, padded or sentinel-looking values use the Base64 form. */
function encodeHeaderValue(value) {
  const text = String(value);
  if (isPlainHeaderValue(text) && !isSentinel(text)) return text;
  return `${SENTINEL_PREFIX}${toBase64(text)}${SENTINEL_SUFFIX}`;
}

/** Decode a mirrored header value; throws on a malformed Base64 sentinel. */
function decodeHeaderValue(value) {
  const text = String(value);
  if (!isSentinel(text)) return text;
  const encoded = text.slice(SENTINEL_PREFIX.length, -SENTINEL_SUFFIX.length);
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) {
    throw new JsonRpcError(ERROR_CODES.HEADER_MISMATCH, 'Header value is not valid Base64');
  }
  return fromBase64(encoded);
}

// ---------------------------------------------------------------------
// Stream readers
// ---------------------------------------------------------------------

/**
 * Yield one parsed JSON value per non-empty line of a text stream (Node stream, web ReadableStream or an
 * iterable of string/Buffer chunks). Lines that are not valid JSON are passed to onInvalid and skipped.
 */
async function* readJsonLines(stream, onInvalid = null) {
  let buffer = '';
  const parse = (line) => {
    const text = line.endsWith('\r') ? line.slice(0, -1) : line;
    if (!text.trim()) return undefined;
    try {
      return JSON.parse(text);
    } catch (error) {
      if (onInvalid) onInvalid(text, error);
      return undefined;
    }
  };
  for await (const chunk of readStreamChunks(stream)) {
    buffer += chunk;
    let index;
    while ((index = buffer.indexOf('\n')) !== -1) {
      const value = parse(buffer.slice(0, index));
      buffer = buffer.slice(index + 1);
      if (value !== undefined) yield value;
    }
  }
  const last = parse(buffer);
  if (last !== undefined) yield last;
}

/**
 * Incremental text/event-stream parser. feed(chunk) returns the events completed by that chunk as
 * { event, data, id }; end() flushes a final event that was not terminated by a blank line.
 * Handles data:/event:/id:/retry: fields, comment lines, multi-line data and LF, CRLF or CR line endings.
 */
class SSEParser {
  constructor() {
    this.buffer = '';
    this._reset();
  }

  _reset() {
    this.dataLines = [];
    this.eventName = null;
    this.eventId = null;
  }

  feed(chunk) {
    this.buffer += chunk;
    const events = [];
    let index;
    while ((index = this.buffer.search(/\r\n|\n|\r/)) !== -1) {
      // a trailing CR may be the first half of a CRLF split across chunks
      if (this.buffer[index] === '\r' && index === this.buffer.length - 1) break;
      const line = this.buffer.slice(0, index);
      const width = this.buffer[index] === '\r' && this.buffer[index + 1] === '\n' ? 2 : 1;
      this.buffer = this.buffer.slice(index + width);
      const event = this._line(line);
      if (event) events.push(event);
    }
    return events;
  }

  end() {
    const events = [];
    const rest = this.buffer.replace(/\r$/, '');
    this.buffer = '';
    if (rest) {
      const event = this._line(rest);
      if (event) events.push(event);
    }
    const last = this._dispatch();
    if (last) events.push(last);
    return events;
  }

  _line(line) {
    if (line === '') return this._dispatch();
    if (line.startsWith(':')) return null;
    const colon = line.indexOf(':');
    const field = colon === -1 ? line : line.slice(0, colon);
    let value = colon === -1 ? '' : line.slice(colon + 1);
    if (value.startsWith(' ')) value = value.slice(1);
    if (field === 'data') this.dataLines.push(value);
    else if (field === 'event') this.eventName = value;
    else if (field === 'id' && !value.includes(' ')) this.eventId = value;
    // retry and unknown fields are ignored
    return null;
  }

  _dispatch() {
    if (this.dataLines.length === 0) {
      this._reset();
      return null;
    }
    const event = { event: this.eventName || 'message', data: this.dataLines.join('\n'), id: this.eventId };
    this._reset();
    return event;
  }
}

/** Yield the JSON-RPC messages carried by the data of an SSE body; events with other data are skipped. */
async function* readSSEMessages(body, onInvalid = null) {
  const parser = new SSEParser();
  const messages = (events) => events.map((event) => {
    if (!event.data.trim()) return undefined;
    try {
      const value = JSON.parse(event.data);
      if (isMessage(value)) return value;
      if (onInvalid) onInvalid(event.data, new Error('not a JSON-RPC message'));
    } catch (error) {
      if (onInvalid) onInvalid(event.data, error);
    }
    return undefined;
  }).filter((value) => value !== undefined);

  for await (const chunk of readStreamChunks(body)) {
    for (const message of messages(parser.feed(chunk))) yield message;
  }
  for (const message of messages(parser.end())) yield message;
}

module.exports = {
  JSONRPC_VERSION,
  ERROR_CODES,
  MODERN_ERROR_CODES,
  MODERN_VERSIONS,
  LEGACY_VERSIONS,
  LATEST_LEGACY_VERSION,
  META_KEYS,
  NAME_HEADER_FIELDS,
  JsonRpcError,
  isMessage,
  isRequest,
  isNotification,
  isResponse,
  request,
  notification,
  response,
  errorResponse,
  errorFromResponse,
  serialize,
  parseMessage,
  encodeHeaderValue,
  decodeHeaderValue,
  readJsonLines,
  SSEParser,
  readSSEMessages,
};
