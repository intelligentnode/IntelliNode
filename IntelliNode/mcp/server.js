/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const rpc = require('./jsonrpc');
const packageInfo = require('../package.json');

const {
  ERROR_CODES, MODERN_VERSIONS, LEGACY_VERSIONS, LATEST_LEGACY_VERSION, META_KEYS, NAME_HEADER_FIELDS, JsonRpcError,
} = rpc;

const CONTENT_TYPES = new Set(['text', 'image', 'audio', 'resource', 'resource_link']);
const LEGACY_NEGOTIABLE = new Set(['2025-11-25', '2025-06-18', '2025-03-26']);
const SESSION_IDLE_MS = 60 * 60 * 1000;
const MAX_SESSIONS = 1000;
const MAX_BODY_BYTES = 8 * 1024 * 1024;

// Random hex without require('crypto'), which would pull crypto-browserify into the browser bundle.
function randomHex(bytes) {
  const buffer = new Uint8Array(bytes);
  if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(buffer);
  } else {
    for (let i = 0; i < bytes; i++) buffer[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(buffer, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function lowerCaseKeys(headers) {
  const result = {};
  for (const [key, value] of Object.entries(headers || {})) {
    result[key.toLowerCase()] = Array.isArray(value) ? value[0] : value;
  }
  return result;
}

function toolError(text) {
  return { content: [{ type: 'text', text }], isError: true };
}

function jsonText(value) {
  return { type: 'text', text: JSON.stringify(value, null, 2) };
}

function isContentBlock(value) {
  return Boolean(value) && typeof value === 'object' && CONTENT_TYPES.has(value.type);
}

// A handler may return a string, an object, one content block, an array of blocks or a full result.
function normalizeToolResult(output) {
  if (output === undefined || output === null) return { content: [] };
  if (typeof output === 'string') return { content: [{ type: 'text', text: output }] };
  if (typeof output !== 'object') return { content: [{ type: 'text', text: String(output) }] };
  if (Array.isArray(output)) {
    return output.every(isContentBlock) ? { content: output } : { content: [jsonText(output)] };
  }
  if (isContentBlock(output)) return { content: [output] };
  if (Array.isArray(output.content)) {
    const result = { content: output.content };
    if (output.structuredContent !== undefined) result.structuredContent = output.structuredContent;
    if (output.isError) result.isError = true;
    return result;
  }
  return { content: [jsonText(output)], structuredContent: output };
}

const JSON_TYPES = {
  string: (value) => typeof value === 'string',
  number: (value) => typeof value === 'number',
  integer: (value) => Number.isInteger(value),
  boolean: (value) => typeof value === 'boolean',
  array: (value) => Array.isArray(value),
  object: (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value),
  null: (value) => value === null,
};

// Top-level required / type / enum checks: enough to give the model an actionable message without a validator.
function validateArguments(schema, args) {
  const problems = [];
  if (!schema || typeof schema !== 'object') return problems;
  for (const key of Array.isArray(schema.required) ? schema.required : []) {
    if (args[key] === undefined) problems.push(`missing required argument '${key}'`);
  }
  for (const [key, property] of Object.entries(schema.properties || {})) {
    const value = args[key];
    if (value === undefined || !property || typeof property !== 'object') continue;
    const types = Array.isArray(property.type) ? property.type : (property.type ? [property.type] : []);
    if (types.length && !types.some((type) => JSON_TYPES[type] && JSON_TYPES[type](value))) {
      problems.push(`argument '${key}' must be of type ${types.join(' or ')}`);
    } else if (Array.isArray(property.enum) && !property.enum.includes(value)) {
      problems.push(`argument '${key}' must be one of: ${property.enum.join(', ')}`);
    }
  }
  return problems;
}

function encodeCursor(offset) {
  return Buffer.from(String(offset), 'utf8').toString('base64');
}

function decodeCursor(cursor) {
  const offset = Number(Buffer.from(String(cursor), 'base64').toString('utf8'));
  if (!Number.isInteger(offset) || offset < 0) {
    throw new JsonRpcError(ERROR_CODES.INVALID_PARAMS, 'Invalid cursor');
  }
  return offset;
}

// HTTP status for a JSON-RPC response, following the Streamable HTTP rules.
function statusFor(response) {
  if (!response || !response.error) return 200;
  switch (response.error.code) {
    case ERROR_CODES.METHOD_NOT_FOUND:
    case ERROR_CODES.SESSION_NOT_FOUND:
      return 404;
    case ERROR_CODES.PARSE_ERROR:
    case ERROR_CODES.INVALID_REQUEST:
    case ERROR_CODES.HEADER_MISMATCH:
    case ERROR_CODES.MISSING_REQUIRED_CLIENT_CAPABILITY:
    case ERROR_CODES.UNSUPPORTED_PROTOCOL_VERSION:
    case ERROR_CODES.SERVER_NOT_INITIALIZED:
      return 400;
    default:
      return 200;
  }
}

/**
 * MCPServer - a dependency-free MCP server exposing tools over stdio or Streamable HTTP.
 *
 * Serves the modern protocol (2026-07-28: per-request _meta, server/discover, no sessions) and the legacy
 * initialize handshake (2025-11-25 and earlier) at the same time: a request carrying modern _meta is served
 * statelessly, an initialize request switches the stdio process (or mints an HTTP session) to legacy semantics.
 *
 * Usage:
 *   const server = new MCPServer({ name, version, instructions, tools: [{ name, description, inputSchema, handler }] });
 *   server.startStdio();                       // or
 *   await server.startHttp({ port: 3210 });    // http://127.0.0.1:3210/mcp
 */
class MCPServer {
  constructor({ name = 'intellinode', version = packageInfo.version, instructions = null, tools = [], pageSize = 0, debug = false } = {}) {
    this.name = name;
    this.version = version;
    this.instructions = instructions;
    this.pageSize = Number(pageSize) > 0 ? Number(pageSize) : 0;
    this.debug = Boolean(debug);
    this.supportedVersions = MODERN_VERSIONS.slice();
    this.tools = new Map();
    this.sessions = new Map(); // legacy HTTP sessions
    this.stdioSession = null; // legacy stdio state
    this.httpServer = null;
    this.stdioInterface = null;
    for (const tool of tools) this.addTool(tool);
  }

  addTool(tool) {
    if (!tool || typeof tool.name !== 'string' || !tool.name) throw new Error('A tool needs a name');
    if (typeof tool.handler !== 'function') throw new Error(`Tool '${tool.name}' needs a handler function`);
    const inputSchema = tool.inputSchema && typeof tool.inputSchema === 'object' ? tool.inputSchema : { type: 'object', properties: {} };
    this.tools.set(tool.name, { ...tool, inputSchema });
    return this;
  }

  get serverInfo() {
    return { name: this.name, version: this.version };
  }

  // ---------------------------------------------------------------------
  // Message handling (transport independent)
  // ---------------------------------------------------------------------

  /**
   * Handle one JSON-RPC message. context: { transport: 'stdio' | 'http', headers }. Resolves with the response
   * object, or null for notifications. When a legacy HTTP initialize mints a session, context.sessionId is set.
   */
  async handle(message, context = {}) {
    if (!rpc.isMessage(message)) {
      return rpc.errorResponse(null, ERROR_CODES.INVALID_REQUEST, 'Invalid Request: not a JSON-RPC 2.0 message');
    }
    if (rpc.isResponse(message)) return null;

    const transport = context.transport === 'http' ? 'http' : 'stdio';
    const headers = lowerCaseKeys(context.headers);
    const params = message.params && typeof message.params === 'object' && !Array.isArray(message.params) ? message.params : {};
    const meta = params._meta && typeof params._meta === 'object' ? params._meta : {};

    if (rpc.isNotification(message)) {
      this._onNotification(message, transport, headers);
      return null;
    }

    try {
      const requestedVersion = meta[META_KEYS.protocolVersion];
      const headerVersion = headers['mcp-protocol-version'];
      const modern = requestedVersion !== undefined
        || (transport === 'http' && headerVersion !== undefined && !LEGACY_VERSIONS.includes(headerVersion));
      let result;
      if (modern) {
        if (transport === 'http') this._validateHeaders(message, params, headers, requestedVersion);
        if (!this.supportedVersions.includes(requestedVersion)) {
          throw new JsonRpcError(ERROR_CODES.UNSUPPORTED_PROTOCOL_VERSION, 'Unsupported protocol version', {
            supported: this.supportedVersions,
            requested: requestedVersion,
          });
        }
        result = { resultType: 'complete', ...(await this._dispatchModern(message.method, params, context)) };
      } else {
        result = await this._dispatchLegacy(message.method, params, transport, headers, context);
      }
      return rpc.response(message.id, result);
    } catch (error) {
      if (error instanceof JsonRpcError) return rpc.errorResponse(message.id, error.code, error.message, error.data);
      this._log(`internal error on ${message.method}: ${error.stack || error.message}`);
      return rpc.errorResponse(message.id, ERROR_CODES.INTERNAL_ERROR, error.message || 'Internal error');
    }
  }

  // Streamable HTTP mirrors body fields into headers; both must agree.
  _validateHeaders(message, params, headers, requestedVersion) {
    const mismatch = (text) => new JsonRpcError(ERROR_CODES.HEADER_MISMATCH, `Header mismatch: ${text}`);
    if (requestedVersion === undefined) {
      throw mismatch(`MCP-Protocol-Version header is '${headers['mcp-protocol-version']}' but the body carries no ${META_KEYS.protocolVersion}`);
    }
    if (headers['mcp-protocol-version'] === undefined) throw mismatch('MCP-Protocol-Version header is required');
    if (headers['mcp-protocol-version'] !== requestedVersion) {
      throw mismatch(`MCP-Protocol-Version header '${headers['mcp-protocol-version']}' does not match body value '${requestedVersion}'`);
    }
    if (headers['mcp-method'] === undefined) throw mismatch('Mcp-Method header is required');
    if (headers['mcp-method'] !== message.method) {
      throw mismatch(`Mcp-Method header '${headers['mcp-method']}' does not match body value '${message.method}'`);
    }
    const field = NAME_HEADER_FIELDS[message.method];
    if (field && params[field] !== undefined && params[field] !== null) {
      if (headers['mcp-name'] === undefined) throw mismatch(`Mcp-Name header is required for ${message.method}`);
      const decoded = rpc.decodeHeaderValue(headers['mcp-name']);
      if (decoded !== String(params[field])) {
        throw mismatch(`Mcp-Name header value '${decoded}' does not match body value '${params[field]}'`);
      }
    }
  }

  async _dispatchModern(method, params, context) {
    switch (method) {
      case 'server/discover':
        return {
          supportedVersions: this.supportedVersions,
          capabilities: { tools: {} },
          _meta: { [META_KEYS.serverInfo]: this.serverInfo },
          ...(this.instructions && { instructions: this.instructions }),
        };
      case 'ping':
        return {};
      case 'tools/list':
        return this._listTools(params.cursor);
      case 'tools/call':
        return this._callTool(params, context);
      default:
        throw new JsonRpcError(ERROR_CODES.METHOD_NOT_FOUND, `Method not found: ${method}`);
    }
  }

  async _dispatchLegacy(method, params, transport, headers, context) {
    if (method === 'initialize') {
      const requested = typeof params.protocolVersion === 'string' ? params.protocolVersion : '';
      const protocolVersion = LEGACY_NEGOTIABLE.has(requested) ? requested : LATEST_LEGACY_VERSION;
      if (transport === 'http') {
        context.sessionId = this._mintSession(protocolVersion);
      } else {
        this.stdioSession = { protocolVersion, initialized: false };
      }
      return {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: this.serverInfo,
        ...(this.instructions && { instructions: this.instructions }),
      };
    }
    if (method === 'ping') return {};

    // an unknown session id means the session was terminated: legacy clients re-initialize on 404
    if (transport === 'http' && headers['mcp-session-id'] !== undefined) {
      const session = this.sessions.get(headers['mcp-session-id']);
      if (!session) throw new JsonRpcError(ERROR_CODES.SESSION_NOT_FOUND, 'Session not found');
      session.lastSeen = Date.now();
    }
    switch (method) {
      case 'tools/list':
        return this._listTools(params.cursor);
      case 'tools/call':
        return this._callTool(params, context);
      default:
        throw new JsonRpcError(ERROR_CODES.METHOD_NOT_FOUND, `Method not found: ${method}`);
    }
  }

  _onNotification(message, transport, headers) {
    if (message.method === 'notifications/initialized') {
      if (transport === 'http') {
        const session = this.sessions.get(headers['mcp-session-id']);
        if (session) session.initialized = true;
      } else if (this.stdioSession) {
        this.stdioSession.initialized = true;
      }
    }
    // notifications/cancelled and others are accepted and ignored: tool calls here are not cancellable
  }

  _mintSession(protocolVersion) {
    const now = Date.now();
    for (const [id, session] of this.sessions) {
      if (now - session.lastSeen > SESSION_IDLE_MS) this.sessions.delete(id);
    }
    while (this.sessions.size >= MAX_SESSIONS) {
      this.sessions.delete(this.sessions.keys().next().value);
    }
    const id = randomHex(16);
    this.sessions.set(id, { protocolVersion, initialized: false, lastSeen: now });
    return id;
  }

  // ---------------------------------------------------------------------
  // Tools
  // ---------------------------------------------------------------------

  _publicTools() {
    return Array.from(this.tools.values(), ({ handler, ...tool }) => tool);
  }

  _listTools(cursor) {
    const tools = this._publicTools();
    const offset = cursor === undefined || cursor === null ? 0 : decodeCursor(cursor);
    const size = this.pageSize || tools.length || 1;
    const result = { tools: tools.slice(offset, offset + size) };
    if (offset + size < tools.length) result.nextCursor = encodeCursor(offset + size);
    return result;
  }

  async _callTool(params, context) {
    if (typeof params.name !== 'string') {
      throw new JsonRpcError(ERROR_CODES.INVALID_PARAMS, 'tools/call requires params.name');
    }
    const tool = this.tools.get(params.name);
    if (!tool) throw new JsonRpcError(ERROR_CODES.INVALID_PARAMS, `Unknown tool: ${params.name}`);
    const args = params.arguments && typeof params.arguments === 'object' && !Array.isArray(params.arguments) ? params.arguments : {};
    const problems = validateArguments(tool.inputSchema, args);
    if (problems.length) return toolError(`Invalid arguments for ${params.name}: ${problems.join('; ')}`);
    try {
      return normalizeToolResult(await tool.handler(args, { name: params.name, transport: context.transport || 'stdio' }));
    } catch (error) {
      this._log(`tool ${params.name} failed: ${error.message}`);
      return toolError(error && error.message ? error.message : String(error));
    }
  }

  // ---------------------------------------------------------------------
  // stdio transport
  // ---------------------------------------------------------------------

  /** Serve newline-delimited JSON-RPC on stdin/stdout; exits the process on stdin EOF unless exitOnClose is false. */
  startStdio({ input = process.stdin, output = process.stdout, exitOnClose = true } = {}) {
    // required lazily: the browser bundle maps readline to an empty module
    const readline = require('readline');
    this.stdioSession = null;
    let pending = 0;
    let closed = false;
    const finish = () => {
      if (closed && pending === 0 && exitOnClose) process.exit(0);
    };
    const write = (response) => {
      if (response) output.write(`${rpc.serialize(response)}\n`);
    };

    this.stdioInterface = readline.createInterface({ input, crlfDelay: Infinity, terminal: false });
    this.stdioInterface.on('line', (line) => {
      if (!line.trim()) return;
      let message;
      try {
        message = rpc.parseMessage(line);
      } catch (error) {
        write(rpc.errorResponse(null, error.code, error.message));
        return;
      }
      pending += 1;
      this.handle(message, { transport: 'stdio' })
        .then(write, (error) => write(rpc.errorResponse(message.id === undefined ? null : message.id, ERROR_CODES.INTERNAL_ERROR, error.message)))
        .then(() => {
          pending -= 1;
          finish();
        });
    });
    this.stdioInterface.on('close', () => {
      closed = true;
      finish();
    });
    return this;
  }

  // ---------------------------------------------------------------------
  // Streamable HTTP transport
  // ---------------------------------------------------------------------

  /**
   * Listen on host:port and serve the MCP endpoint at path. allowedOrigins adds to the localhost origins that
   * are accepted by default ('*' accepts any). Resolves with the Node http.Server once it is listening.
   */
  async startHttp({ host = '127.0.0.1', port = 3210, path = '/mcp', allowedOrigins = [], maxBodyBytes = MAX_BODY_BYTES } = {}) {
    // required lazily: keeps the browser bundle free of the http polyfill until the server is actually used
    const http = require('http');
    const options = { path, allowedOrigins, maxBodyBytes };
    const server = http.createServer((req, res) => {
      this._handleHttp(req, res, options).catch((error) => {
        this._log(`http handler failed: ${error.stack || error.message}`);
        if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(rpc.serialize(rpc.errorResponse(null, ERROR_CODES.INTERNAL_ERROR, error.message)));
      });
    });
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(port, host, () => {
        server.off('error', reject);
        resolve();
      });
    });
    this.httpServer = server;
    // the listening address, so callers (and the CLI) can print or connect to the endpoint
    const address = server.address();
    const unspecified = ['0.0.0.0', '::', ''].includes(address.address);
    const hostName = unspecified ? '127.0.0.1' : address.family === 'IPv6' ? `[${address.address}]` : address.address;
    server.host = address.address;
    server.port = address.port;
    server.path = path;
    server.url = `http://${hostName}:${address.port}${path}`;
    return server;
  }

  _originAllowed(origin, allowedOrigins) {
    if (allowedOrigins.includes('*')) return true;
    if (allowedOrigins.some((allowed) => allowed.toLowerCase() === origin.toLowerCase())) return true;
    try {
      const { hostname } = new URL(origin);
      return ['localhost', '127.0.0.1', '::1', '[::1]'].includes(hostname.toLowerCase());
    } catch (error) {
      return false;
    }
  }

  async _handleHttp(req, res, { path, allowedOrigins, maxBodyBytes }) {
    const send = (status, body, headers = {}) => {
      res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
      res.end(body === undefined ? undefined : rpc.serialize(body));
    };
    const pathname = new URL(req.url || '/', 'http://localhost').pathname;
    if (pathname !== path) {
      send(404, { error: `Not found: the MCP endpoint is POST ${path}` });
      return;
    }
    const origin = req.headers.origin;
    if (origin !== undefined && !this._originAllowed(String(origin), allowedOrigins)) {
      send(403, { jsonrpc: '2.0', error: { code: ERROR_CODES.INVALID_REQUEST, message: `Origin not allowed: ${origin}` } });
      return;
    }
    if (req.method === 'DELETE') {
      const sessionId = req.headers['mcp-session-id'];
      if (sessionId && this.sessions.delete(String(sessionId))) {
        res.writeHead(204);
        res.end();
      } else {
        send(405, { jsonrpc: '2.0', error: { code: ERROR_CODES.INVALID_REQUEST, message: 'Method Not Allowed' } }, { Allow: 'POST' });
      }
      return;
    }
    if (req.method !== 'POST') {
      send(405, { jsonrpc: '2.0', error: { code: ERROR_CODES.INVALID_REQUEST, message: 'Method Not Allowed: use POST' } }, { Allow: 'POST' });
      return;
    }

    let body;
    try {
      body = await readBody(req, maxBodyBytes);
    } catch (error) {
      send(error.status || 400, rpc.errorResponse(null, ERROR_CODES.INVALID_REQUEST, error.message));
      return;
    }
    let message;
    try {
      message = JSON.parse(body);
    } catch (error) {
      send(400, rpc.errorResponse(null, ERROR_CODES.PARSE_ERROR, `Parse error: ${error.message}`));
      return;
    }
    if (Array.isArray(message)) {
      send(400, rpc.errorResponse(null, ERROR_CODES.INVALID_REQUEST, 'Batch requests are not supported'));
      return;
    }
    if (!rpc.isMessage(message)) {
      send(400, rpc.errorResponse(null, ERROR_CODES.INVALID_REQUEST, 'Invalid Request: not a JSON-RPC 2.0 message'));
      return;
    }

    const context = { transport: 'http', headers: req.headers };
    if (!rpc.isRequest(message)) {
      await this.handle(message, context);
      res.writeHead(202);
      res.end();
      return;
    }
    const response = await this.handle(message, context);
    send(statusFor(response), response, context.sessionId ? { 'Mcp-Session-Id': context.sessionId } : {});
  }

  /** Close the HTTP listener and the stdio reader. */
  async stop() {
    if (this.stdioInterface) {
      this.stdioInterface.close();
      this.stdioInterface = null;
    }
    const server = this.httpServer;
    this.httpServer = null;
    if (server) {
      if (typeof server.closeAllConnections === 'function') server.closeAllConnections();
      await new Promise((resolve) => server.close(() => resolve()));
    }
    this.sessions.clear();
  }

  _log(text) {
    if (this.debug) process.stderr.write(`[MCPServer] ${text}\n`);
  }
}

function readBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        const error = new Error(`Request body exceeds ${maxBytes} bytes`);
        error.status = 413;
        req.destroy();
        reject(error);
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

module.exports = { MCPServer, normalizeToolResult, validateArguments };
