/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const fetch = require('cross-fetch');
const rpc = require('../mcp/jsonrpc');
const packageInfo = require('../package.json');

const {
  ERROR_CODES, MODERN_ERROR_CODES, MODERN_VERSIONS, LATEST_LEGACY_VERSION, META_KEYS, NAME_HEADER_FIELDS, JsonRpcError,
} = rpc;

const DEFAULT_TIMEOUT = 60000;
// how long the server/discover era probe waits before a silent server is treated as legacy
const DEFAULT_PROBE_TIMEOUT = 5000;
const SHUTDOWN_GRACE = 2000;
const MAX_LIST_PAGES = 1000;

// Stop reading a response body and close its connection. node-fetch v2 keeps the socket open until the request is
// aborted and reports that abort as an 'error' event on the body, so the body gets a no-op error listener first.
// In the browser the body is a ReadableStream whose reader was already cancelled; the abort closes the request.
function releaseBody(body, controller) {
  if (body && typeof body.on === 'function') {
    body.on('error', () => {});
    if (typeof body.destroy === 'function' && !body.destroyed) body.destroy();
  }
  controller.abort();
}

class MCPTimeoutError extends Error {
  constructor(method, timeout) {
    super(`MCP request '${method}' timed out after ${timeout}ms`);
    this.name = 'MCPTimeoutError';
  }
}

/**
 * MCPClient - Model Context Protocol client for Streamable HTTP and stdio servers.
 *
 * Talks the modern protocol (2026-07-28, per-request _meta, no sessions) and falls back to the legacy
 * initialize handshake (2025-11-25 and earlier, Mcp-Session-Id over HTTP) when the server needs it.
 *
 * Usage:
 *   const client = new MCPClient('https://host/mcp');                              // Streamable HTTP
 *   const client = new MCPClient({ url, headers: { Authorization: 'Bearer ..' } }); // with auth headers
 *   const client = new MCPClient({ command: 'npx', args: ['-y', 'pkg'] });         // stdio subprocess
 *   await client.connect();                         // handshake, then the tool list is fetched into client.tools
 *   const tools = client.listTools();                // cached tools (sync); await client.fetchTools() refreshes them
 *   const { text } = await client.callTool('tool_name', { param: 'value' });
 *   await client.close();
 */
class MCPClient {
  constructor(options = {}) {
    const config = typeof options === 'string' ? { url: options } : { ...options };
    if (!config.url && !config.command) {
      throw new Error('MCPClient needs a url (Streamable HTTP) or a command (stdio subprocess)');
    }
    this.url = config.url ? String(config.url).replace(/(.)\/$/, '$1') : null;
    this.headers = { ...(config.headers || {}) };
    this.command = config.command || null;
    this.args = Array.isArray(config.args) ? config.args.slice() : [];
    this.env = config.env || null;
    this.cwd = config.cwd || null;
    this.transport = this.command ? 'stdio' : 'http';
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.probeTimeout = config.probeTimeout || DEFAULT_PROBE_TIMEOUT;
    this.debug = Boolean(config.debug);
    this.clientInfo = { name: config.name || 'intellinode', version: config.version || packageInfo.version };
    this.onNotification = typeof config.onNotification === 'function' ? config.onNotification : null;

    this.era = null; // 'modern' | 'legacy', cached per server
    this.protocolVersion = null;
    this.serverInfo = null;
    this.capabilities = null;
    this.instructions = null;
    this.sessionId = null; // legacy HTTP only
    this.tools = [];
    this.toolsFetched = false;
    this.requestId = 0;
    this.connecting = null; // the in-flight connect() promise, shared by concurrent first requests

    this.process = null;
    this.pending = new Map();
    this.exitError = null;
  }

  /** { name: MCPClient } from a Claude Desktop / Cursor style { mcpServers: { name: { command | url, ... } } }. */
  static fromConfig(config, defaults = {}) {
    const servers = config && config.mcpServers ? config.mcpServers : config || {};
    const clients = {};
    for (const [name, entry] of Object.entries(servers)) {
      if (!entry || typeof entry !== 'object' || entry.disabled) continue;
      clients[name] = new MCPClient({ ...defaults, ...entry });
    }
    return clients;
  }

  // ---------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------

  /**
   * Detect the server era, run the handshake and fetch the tool list into client.tools.
   * Resolves with { protocolVersion, serverInfo, capabilities, instructions }; concurrent calls share one handshake.
   */
  async connect() {
    if (this.connecting) return this.connecting;
    if (this.era) return this._info();
    this.connecting = this._connect().finally(() => {
      this.connecting = null;
    });
    return this.connecting;
  }

  async _connect() {
    try {
      if (this.transport === 'stdio') await this._spawn();
      const probe = await this._probe(MODERN_VERSIONS[0]);
      if (probe.kind === 'legacy') {
        this._log(`legacy server detected (${probe.reason}); using the initialize handshake`);
        await this._initializeLegacy();
      } else {
        this._applyDiscover(probe.result, probe.version);
      }
      await this._loadTools();
    } catch (error) {
      // a failed handshake must not leave a server process (and the parent event loop) or a legacy session behind
      await this._release();
      this.era = null;
      this.protocolVersion = null;
      this.sessionId = null;
      this.toolsFetched = false;
      throw error;
    }
    return this._info();
  }

  /** Connect when needed, fetch every tool and return the list (the intellinode 2.x entry point). */
  async initialize() {
    try {
      return await this.fetchTools();
    } catch (error) {
      throw new Error(`Failed to initialize MCP client: ${error.message}`);
    }
  }

  /** End the stdio process or the legacy HTTP session; the client can connect() again afterwards. */
  async close() {
    await this._release();
    this.era = null;
    this.protocolVersion = null;
    this.sessionId = null;
    this.exitError = null;
    this.toolsFetched = false; // the cached tools stay readable; a new connect() refreshes them
  }

  // Stop the stdio process, or DELETE the legacy HTTP session.
  async _release() {
    if (this.transport === 'stdio') {
      await this._stopProcess();
    } else if (this.era === 'legacy' && this.sessionId) {
      try {
        await this._fetch({ method: 'DELETE', headers: this._legacyHeaders() }, SHUTDOWN_GRACE);
      } catch (error) {
        this._log(`session DELETE ignored: ${error.message}`);
      }
    }
  }

  _info() {
    return {
      protocolVersion: this.protocolVersion,
      serverInfo: this.serverInfo,
      capabilities: this.capabilities,
      instructions: this.instructions,
    };
  }

  // ---------------------------------------------------------------------
  // Tools
  // ---------------------------------------------------------------------

  /** The cached tool list (sync, as in intellinode 2.x): connect() fills it, fetchTools() refreshes it. */
  listTools() {
    return this.tools;
  }

  /** Fetch every page of tools/list (connecting first when needed), cache the tools in client.tools and return them. */
  async fetchTools() {
    if (this.connecting || !this.era) {
      await this.connect();
      // the handshake fetched the list, so one connect() plus fetchTools() is still a single tools/list
      if (this.toolsFetched) return this.tools;
    }
    return this._fetchToolPages();
  }

  /** Same as fetchTools(); the intellinode 2.x name. */
  async getTools() {
    return this.fetchTools();
  }

  // Part of connect(): a server without tools (method not found, or tools not advertised) leaves the cache empty.
  async _loadTools() {
    try {
      await this._fetchToolPages();
    } catch (error) {
      const advertised = !this.capabilities || this.capabilities.tools !== undefined;
      if (!(error instanceof JsonRpcError) || (error.code !== ERROR_CODES.METHOD_NOT_FOUND && advertised)) throw error;
      this._log(`tools/list unavailable (${error.message}); the tool cache stays empty`);
      this.tools = [];
      this.toolsFetched = true;
    }
  }

  async _fetchToolPages() {
    const tools = [];
    const seen = new Set();
    let cursor;
    for (let page = 0; page < MAX_LIST_PAGES; page++) {
      const result = await this._request('tools/list', cursor !== undefined ? { cursor } : {});
      tools.push(...(Array.isArray(result.tools) ? result.tools : []));
      cursor = result.nextCursor;
      if (cursor === undefined || cursor === null || cursor === '' || seen.has(cursor)) break;
      seen.add(cursor);
    }
    this.tools = tools;
    this.toolsFetched = true;
    return tools;
  }

  /**
   * Call a tool. Resolves with { content, structuredContent, isError, text } where text joins the text blocks;
   * a protocol error (unknown tool, invalid params) rejects with a JsonRpcError.
   */
  async callTool(name, args = {}, { timeout } = {}) {
    if (this.connecting || !this.era) await this.connect();
    const result = await this._request('tools/call', { name, arguments: args || {} }, { timeout });
    const content = Array.isArray(result.content) ? result.content : [];
    return {
      content,
      structuredContent: result.structuredContent,
      isError: Boolean(result.isError),
      text: content
        .filter((block) => block && block.type === 'text' && typeof block.text === 'string')
        .map((block) => block.text)
        .join('\n'),
    };
  }

  /** Cached tools in the chat-completions tool format understood by the IntelliNode chat inputs. */
  toChatTools() {
    return this.tools.map((tool) => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description || tool.title || '',
        parameters: tool.inputSchema || { type: 'object', properties: {} },
      },
    }));
  }

  getTool(toolName) {
    return this.tools.find((tool) => tool.name === toolName) || null;
  }

  getToolNames() {
    return this.tools.map((tool) => tool.name);
  }

  hasTool(toolName) {
    return this.tools.some((tool) => tool.name === toolName);
  }

  // ---------------------------------------------------------------------
  // Era detection
  // ---------------------------------------------------------------------

  // Send server/discover; { kind: 'modern', result, version } or { kind: 'legacy', reason }.
  async _probe(version, allowRetry = true) {
    const message = rpc.request(this._nextId(), 'server/discover', { _meta: this._meta(version) });
    let outcome;
    if (this.transport === 'stdio') {
      let reply;
      try {
        reply = await this._sendStdio(message, this.probeTimeout, false);
      } catch (error) {
        if (error instanceof MCPTimeoutError) return { kind: 'legacy', reason: 'no answer to server/discover' };
        throw error;
      }
      outcome = this._classify(reply, null);
    } else {
      const reply = await this._postHttp(message, this._modernHeaders(message, version), this.timeout);
      outcome = this._classify(reply.message, reply.status);
    }

    if (outcome.kind === 'retry') {
      const supported = Array.isArray(outcome.supported) ? outcome.supported : [];
      const mutual = MODERN_VERSIONS.find((candidate) => supported.includes(candidate));
      if (!mutual || !allowRetry) {
        throw new Error(`No mutually supported MCP protocol version: server supports ${supported.join(', ') || 'none'}, client supports ${MODERN_VERSIONS.join(', ')}`);
      }
      return this._probe(mutual, false);
    }
    return outcome.kind === 'modern' ? { ...outcome, version } : outcome;
  }

  // Modern servers answer with a DiscoverResult or a recognised modern error; anything else is legacy.
  _classify(message, status) {
    if (!message) return { kind: 'legacy', reason: status ? `HTTP ${status} without a JSON-RPC body` : 'empty reply' };
    if ('result' in message) return { kind: 'modern', result: message.result };
    const error = message.error || {};
    if (error.code === ERROR_CODES.UNSUPPORTED_PROTOCOL_VERSION) {
      return { kind: 'retry', supported: error.data && error.data.supported };
    }
    if (MODERN_ERROR_CODES.has(error.code)) throw rpc.errorFromResponse(message);
    // a modern server without server/discover (spec violation) still answers 404 + method not found
    if (status !== null && status >= 400 && status < 500 && error.code === ERROR_CODES.METHOD_NOT_FOUND) {
      return { kind: 'modern', result: {} };
    }
    return { kind: 'legacy', reason: `server/discover answered ${error.code}: ${error.message}` };
  }

  _applyDiscover(result, version) {
    const supported = Array.isArray(result.supportedVersions) ? result.supportedVersions : [version];
    this.era = 'modern';
    this.protocolVersion = supported.includes(version) ? version : (MODERN_VERSIONS.find((v) => supported.includes(v)) || version);
    this.capabilities = result.capabilities || {};
    this.serverInfo = (result._meta && result._meta[META_KEYS.serverInfo]) || null;
    this.instructions = result.instructions || null;
  }

  async _initializeLegacy() {
    this.era = 'legacy';
    this.protocolVersion = LATEST_LEGACY_VERSION;
    this.sessionId = null;
    const params = { protocolVersion: LATEST_LEGACY_VERSION, capabilities: {}, clientInfo: this.clientInfo };
    let result;
    try {
      result = await this._request('initialize', params, { legacyInit: true });
    } catch (error) {
      // a modern-only server names its versions when rejecting initialize; take the hint instead of failing
      const supported = error && error.data && Array.isArray(error.data.supported) ? error.data.supported : [];
      const mutual = MODERN_VERSIONS.find((candidate) => supported.includes(candidate));
      if (!mutual) throw error;
      this.era = null;
      const probe = await this._probe(mutual, false);
      if (probe.kind !== 'modern') throw error;
      this._applyDiscover(probe.result, mutual);
      return;
    }
    if (result.protocolVersion) this.protocolVersion = String(result.protocolVersion);
    this.capabilities = result.capabilities || {};
    this.serverInfo = result.serverInfo || null;
    this.instructions = result.instructions || null;
    await this._notify('notifications/initialized');
  }

  // ---------------------------------------------------------------------
  // Requests
  // ---------------------------------------------------------------------

  _nextId() {
    this.requestId += 1;
    return this.requestId;
  }

  _meta(version) {
    return {
      [META_KEYS.protocolVersion]: version,
      [META_KEYS.clientInfo]: this.clientInfo,
      [META_KEYS.clientCapabilities]: {},
    };
  }

  _withMeta(params) {
    const base = params && typeof params === 'object' ? params : {};
    return { ...base, _meta: { ...(base._meta || {}), ...this._meta(this.protocolVersion) } };
  }

  async _request(method, params = {}, { timeout, legacyInit = false } = {}) {
    const wait = timeout || this.timeout;
    const modern = this.era === 'modern';
    const message = rpc.request(this._nextId(), method, modern ? this._withMeta(params) : params);

    if (this.transport === 'stdio') {
      const reply = await this._sendStdio(message, wait, true);
      if (reply.error) throw rpc.errorFromResponse(reply);
      return reply.result;
    }

    const headers = modern ? this._modernHeaders(message, this.protocolVersion) : this._legacyHeaders(legacyInit);
    let reply = await this._postHttp(message, headers, wait);
    // a legacy server that dropped the session answers 404: start a new one and retry once
    if (!modern && !legacyInit && reply.status === 404 && this.sessionId) {
      this._log('session expired; re-initializing');
      await this._initializeLegacy();
      reply = await this._postHttp(message, this._legacyHeaders(), wait);
    }
    if (legacyInit) {
      const sessionId = reply.headers && reply.headers.get && reply.headers.get('mcp-session-id');
      if (sessionId) this.sessionId = sessionId;
    }
    if (reply.message) {
      if (reply.message.error) throw rpc.errorFromResponse(reply.message);
      return reply.message.result;
    }
    throw new Error(`MCP request '${method}' failed: HTTP ${reply.status}${reply.text ? ` ${reply.text.slice(0, 200)}` : ''}`);
  }

  async _notify(method, params) {
    const message = rpc.notification(method, this.era === 'modern' ? this._withMeta(params) : params);
    if (this.transport === 'stdio') {
      await this._writeStdio(message);
      return;
    }
    const headers = this.era === 'modern' ? this._modernHeaders(message, this.protocolVersion) : this._legacyHeaders();
    const reply = await this._postHttp(message, headers, this.timeout);
    if (reply.status >= 400) {
      throw new Error(`MCP notification '${method}' rejected: HTTP ${reply.status}`);
    }
  }

  _emitNotification(message) {
    if (this.onNotification) {
      try {
        this.onNotification(message);
      } catch (error) {
        this._log(`onNotification failed: ${error.message}`);
      }
    }
  }

  // ---------------------------------------------------------------------
  // Streamable HTTP transport
  // ---------------------------------------------------------------------

  _modernHeaders(message, version) {
    const headers = {
      Accept: 'application/json, text/event-stream',
      'Content-Type': 'application/json',
      'MCP-Protocol-Version': version,
      'Mcp-Method': message.method,
    };
    const field = NAME_HEADER_FIELDS[message.method];
    if (field && message.params && message.params[field] !== undefined && message.params[field] !== null) {
      headers['Mcp-Name'] = rpc.encodeHeaderValue(message.params[field]);
    }
    return headers;
  }

  _legacyHeaders(isInitialize = false) {
    const headers = {
      Accept: 'application/json, text/event-stream',
      'Content-Type': 'application/json',
    };
    // the version header is only defined once a version has been negotiated
    if (!isInitialize && this.protocolVersion) headers['MCP-Protocol-Version'] = this.protocolVersion;
    if (!isInitialize && this.sessionId) headers['Mcp-Session-Id'] = this.sessionId;
    return headers;
  }

  async _fetch(init, timeout) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      return await fetch(this.url, { ...init, headers: { ...this.headers, ...(init.headers || {}) }, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  // POST one message; { status, headers, message (the matching JSON-RPC response or null), text }.
  async _postHttp(message, headers, timeout) {
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeout);
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: { ...this.headers, ...headers },
        body: rpc.serialize(message),
        signal: controller.signal,
      });
      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      const reply = { status: response.status, headers: response.headers, message: null, text: '' };
      if (response.status === 202 || response.status === 204) return reply;

      if (contentType.includes('text/event-stream')) {
        try {
          for await (const item of rpc.readSSEMessages(response.body, (data) => this._log(`ignored SSE data: ${data}`))) {
            if (rpc.isResponse(item) && rpc.isRequest(message) && String(item.id) === String(message.id)) {
              reply.message = item;
              break;
            }
            if (rpc.isNotification(item)) this._emitNotification(item);
          }
        } finally {
          // the stream may stay open after the reply (keep-alives, later events): release the connection
          releaseBody(response.body, controller);
        }
        return reply;
      }

      reply.text = await response.text();
      if (reply.text) {
        try {
          const parsed = JSON.parse(reply.text);
          const candidates = Array.isArray(parsed) ? parsed : [parsed];
          reply.message = candidates.find((item) => rpc.isResponse(item)
            && (!rpc.isRequest(message) || item.id === null || String(item.id) === String(message.id))) || null;
        } catch (error) {
          this._log(`non-JSON body (HTTP ${response.status})`);
        }
      }
      return reply;
    } catch (error) {
      // only the timer counts as a timeout; releaseBody() also aborts, after the reply has been read
      if (timedOut) throw new MCPTimeoutError(message.method, timeout);
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  // ---------------------------------------------------------------------
  // stdio transport
  // ---------------------------------------------------------------------

  async _spawn() {
    if (this.process) return;
    // required lazily: the browser bundle maps child_process and readline to empty modules
    const { spawn } = require('child_process');
    const readline = require('readline');
    if (typeof spawn !== 'function' || typeof readline.createInterface !== 'function') {
      throw new Error('The MCP stdio transport ({ command }) needs Node.js; in the browser use { url } (Streamable HTTP)');
    }

    this.exitError = null;
    const child = spawn(this.command, this.args, {
      cwd: this.cwd || undefined,
      env: this.env ? { ...process.env, ...this.env } : process.env,
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });
    this.process = child;

    // a child that was already replaced by close() + connect() must not fail the new one
    const current = () => !this.process || this.process === child;
    child.on('error', (error) => {
      if (!current()) return;
      this.exitError = new Error(`Failed to start MCP server '${this.command}': ${error.message}`);
      this._failAll(this.exitError);
    });
    child.on('exit', (code, signal) => {
      if (!current()) return;
      const reason = signal ? `signal ${signal}` : `code ${code}`;
      this.exitError = new Error(`MCP server process '${this.command}' exited (${reason})`);
      this._failAll(this.exitError);
    });
    child.stdin.on('error', (error) => this._failAll(new Error(`MCP server stdin closed: ${error.message}`)));
    child.stderr.on('data', (chunk) => {
      if (this.debug) process.stderr.write(`[mcp:${this.command}] ${chunk}`);
    });
    readline.createInterface({ input: child.stdout, crlfDelay: Infinity, terminal: false })
      .on('line', (line) => this._onLine(line));
  }

  _onLine(line) {
    if (!line.trim()) return;
    let message;
    try {
      message = rpc.parseMessage(line);
    } catch (error) {
      this._log(`ignored stdout line: ${line.slice(0, 200)}`);
      return;
    }
    if (rpc.isResponse(message)) {
      const entry = this.pending.get(String(message.id));
      if (!entry) return;
      this.pending.delete(String(message.id));
      clearTimeout(entry.timer);
      entry.resolve(message);
    } else if (rpc.isNotification(message)) {
      this._emitNotification(message);
    } else if (rpc.isRequest(message)) {
      // legacy servers may ask for roots or sampling; this client offers neither
      this._writeStdio(rpc.errorResponse(message.id, ERROR_CODES.METHOD_NOT_FOUND, `Method not supported by client: ${message.method}`)).catch(() => {});
    }
  }

  _writeStdio(message) {
    return new Promise((resolve, reject) => {
      if (this.exitError) return reject(this.exitError);
      if (!this.process || !this.process.stdin.writable) return reject(new Error('MCP server process is not running'));
      try {
        this.process.stdin.write(`${rpc.serialize(message)}\n`, (error) => (error ? reject(error) : resolve()));
      } catch (error) {
        reject(error);
      }
      return undefined;
    });
  }

  _sendStdio(message, timeout, cancelOnTimeout) {
    const key = String(message.id);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(key);
        if (cancelOnTimeout) {
          this._notify('notifications/cancelled', { requestId: message.id, reason: 'timeout' }).catch(() => {});
        }
        reject(new MCPTimeoutError(message.method, timeout));
      }, timeout);
      this.pending.set(key, { resolve, reject, timer });
      this._writeStdio(message).catch((error) => {
        if (this.pending.delete(key)) {
          clearTimeout(timer);
          reject(error);
        }
      });
    });
  }

  _failAll(error) {
    for (const [key, entry] of this.pending) {
      this.pending.delete(key);
      clearTimeout(entry.timer);
      entry.reject(error);
    }
  }

  // Close stdin, wait, then escalate to SIGTERM and SIGKILL.
  async _stopProcess() {
    const child = this.process;
    if (!child) return;
    this.process = null;
    this._failAll(new Error('MCP client closed'));

    const exited = new Promise((resolve) => {
      if (child.exitCode !== null || child.signalCode !== null) resolve(true);
      else child.once('exit', () => resolve(true));
    });
    const wait = (ms) => Promise.race([exited, new Promise((resolve) => {
      const timer = setTimeout(() => resolve(false), ms);
      if (timer.unref) timer.unref();
    })]);

    try {
      child.stdin.end();
    } catch (error) {
      // already closed
    }
    if (await wait(SHUTDOWN_GRACE)) return;
    child.kill('SIGTERM');
    if (await wait(SHUTDOWN_GRACE)) return;
    child.kill('SIGKILL');
    await wait(SHUTDOWN_GRACE);
  }

  _log(text) {
    if (this.debug) process.stderr.write(`[MCPClient] ${text}\n`);
  }
}

MCPClient.MCPTimeoutError = MCPTimeoutError;
MCPClient.JsonRpcError = JsonRpcError;

module.exports = MCPClient;
