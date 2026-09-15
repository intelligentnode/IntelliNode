const fetch = require('cross-fetch');
const FormData = require('form-data');

// Statuses worth retrying: request timeout, conflict, too early, rate limit and server errors.
const RETRY_STATUSES = new Set([408, 409, 425, 429, 500, 502, 503, 504]);
const MAX_BACKOFF_MS = 30000;
const MAX_RETRY_AFTER_MS = 60000;

function isFormData(data) {
  return data instanceof FormData
    || (typeof globalThis.FormData !== 'undefined' && data instanceof globalThis.FormData);
}

// Retry-After can be seconds or an HTTP date.
function retryAfterMs(response) {
  const header = response.headers && typeof response.headers.get === 'function' && response.headers.get('retry-after');
  if (!header) return null;
  const seconds = Number(header);
  if (!Number.isNaN(seconds)) return seconds * 1000;
  const date = Date.parse(header);
  return Number.isNaN(date) ? null : Math.max(0, date - Date.now());
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// One AbortSignal that fires on the caller's signal or on the timeout.
function linkSignal(signal, timeout) {
  const controller = new AbortController();
  const state = { signal: controller.signal, timedOut: false, timer: null };
  if (timeout) {
    state.timer = setTimeout(() => {
      state.timedOut = true;
      controller.abort();
    }, timeout);
  }
  state.abort = () => controller.abort();
  const onAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', onAbort);
  }
  state.clearTimer = () => {
    if (state.timer) clearTimeout(state.timer);
    state.timer = null;
  };
  state.cleanup = () => {
    state.clearTimer();
    if (signal) signal.removeEventListener('abort', onAbort);
  };
  return state;
}

/**
 * Small fetch wrapper shared by every provider wrapper: JSON or FormData bodies, JSON / stream / arraybuffer
 * responses, a per-request timeout, retries with exponential backoff (honouring Retry-After) and AbortSignal.
 *
 * Defaults come from FetchClient.defaults and can be changed globally with FetchClient.configure({...}),
 * per client with setRequestOptions({...}), or per call through extraConfig.
 */
class FetchClient {
  constructor({ baseURL = '', headers = {}, timeout, retries, retryDelay, signal } = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = headers;
    this.requestOptions = {};
    this.setRequestOptions({ timeout, retries, retryDelay, signal });
  }

  /** Change the defaults for every FetchClient created afterwards. */
  static configure(options = {}) {
    for (const key of ['timeout', 'retries', 'retryDelay']) {
      if (options[key] !== undefined) FetchClient.defaults[key] = options[key];
    }
    return FetchClient.defaults;
  }

  /** Set timeout (ms), retries, retryDelay (ms) or an AbortSignal for this client; undefined values are ignored. */
  setRequestOptions(options = {}) {
    for (const key of ['timeout', 'retries', 'retryDelay', 'signal']) {
      if (options[key] !== undefined) this.requestOptions[key] = options[key];
    }
    return this;
  }

  resolveOptions(extraConfig) {
    const pick = (key) => (extraConfig[key] !== undefined ? extraConfig[key]
      : this.requestOptions[key] !== undefined ? this.requestOptions[key] : FetchClient.defaults[key]);
    return {
      timeout: pick('timeout') || 0,
      retries: Math.max(0, pick('retries') || 0),
      retryDelay: pick('retryDelay') || 0,
      signal: extraConfig.signal || this.requestOptions.signal || null,
    };
  }

  /**
   * Send a POST request.
   *
   * @param {string} endpoint - URL path or full URL if it starts with http.
   * @param {object|FormData} data - Data to send in the request body.
   * @param {object} extraConfig - Optional { headers, responseType: 'arraybuffer' | 'stream', timeout, retries, retryDelay, signal }.
   * @returns {Promise<any|ReadableStream|ArrayBuffer>} - JSON by default, or the stream/arrayBuffer if specified.
   */
  async post(endpoint, data, extraConfig = {}) {
    return this.request('POST', endpoint, data, extraConfig);
  }

  /**
   * Send a GET request.
   *
   * @param {string} endpoint - URL path or full URL if it starts with http.
   * @param {object} extraConfig - Optional { headers, responseType: 'arraybuffer' | 'stream', timeout, retries, retryDelay, signal }.
   * @returns {Promise<any|ReadableStream|ArrayBuffer>} - JSON by default, or the stream/arrayBuffer if specified.
   */
  async get(endpoint, extraConfig = {}) {
    return this.request('GET', endpoint, undefined, extraConfig);
  }

  async request(method, endpoint, data, extraConfig = {}) {
    const url = endpoint.startsWith('http') ? endpoint : this.baseURL + endpoint;
    const headers = { ...this.defaultHeaders, ...(extraConfig.headers || {}) };

    let body;
    if (isFormData(data)) {
      body = data;
      // In Node the form supplies its own multipart boundary header.
      if (typeof data.getHeaders === 'function') Object.assign(headers, data.getHeaders());
      else delete headers['Content-Type'];
    } else if (data !== undefined) {
      body = JSON.stringify(data);
    }

    const options = this.resolveOptions(extraConfig);
    // a multipart body with file streams cannot be sent twice
    const retries = isFormData(data) ? 0 : options.retries;

    for (let attempt = 0; ; attempt++) {
      if (options.signal && options.signal.aborted) throw abortError();
      const link = linkSignal(options.signal, options.timeout);
      let response;
      try {
        response = await fetch(url, { method, headers, body, signal: link.signal });
      } catch (error) {
        link.cleanup();
        if (options.signal && options.signal.aborted) throw abortError();
        const failure = link.timedOut
          ? Object.assign(new Error(`Request timed out after ${options.timeout}ms: ${url}`), { code: 'ETIMEDOUT' })
          : error;
        if (attempt < retries) {
          await sleep(backoff(attempt, options.retryDelay));
          continue;
        }
        throw failure;
      }

      if (!response.ok) {
        link.cleanup();
        const errorText = await response.text().catch(() => '');
        if (attempt < retries && RETRY_STATUSES.has(response.status)) {
          const wait = retryAfterMs(response);
          await sleep(wait !== null && wait <= MAX_RETRY_AFTER_MS ? wait : backoff(attempt, options.retryDelay));
          continue;
        }
        const error = new Error(`HTTP error ${response.status}: ${errorText}`);
        error.status = response.status;
        error.body = errorText;
        throw error;
      }

      if (extraConfig.responseType === 'stream') {
        // the timeout covers the connection only; the caller's signal can still cancel the stream
        link.clearTimer();
        return releaseOnEarlyClose(response.body, link.abort);
      }
      try {
        if (extraConfig.responseType === 'arraybuffer') return await response.arrayBuffer();
        if (extraConfig.responseType === 'text') return await response.text();
        return await response.json();
      } finally {
        link.cleanup();
      }
    }
  }
}

FetchClient.defaults = { timeout: 300000, retries: 2, retryDelay: 500 };

function backoff(attempt, retryDelay) {
  return Math.min(MAX_BACKOFF_MS, retryDelay * (2 ** attempt)) + Math.floor(Math.random() * 250);
}

// A Node body that the consumer destroys before the end (e.g. breaking out of a for-await loop) must also
// abort the request, otherwise the paused socket stays open until the server has sent the whole response.
function releaseOnEarlyClose(body, abort) {
  if (body && typeof body.once === 'function' && typeof body.on === 'function') {
    body.once('close', () => {
      if (!body.readableEnded) {
        body.on('error', () => {});
        abort();
      }
    });
  }
  return body;
}

function abortError() {
  const error = new Error('The request was aborted.');
  error.name = 'AbortError';
  error.code = 'ABORT_ERR';
  return error;
}

module.exports = FetchClient;
