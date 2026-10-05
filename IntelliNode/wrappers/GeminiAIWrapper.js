/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');
const { readStreamChunks } = require('../utils/StreamParser');

const IS_NODE = typeof process !== 'undefined' && Boolean(process.versions && process.versions.node);

// snake_case keys that are renamed to camelCase in request bodies (Google accepts both; one form keeps the
// body predictable for the checks below).
const KEY_MAP = {
  system_instruction: 'systemInstruction',
  generation_config: 'generationConfig',
  safety_settings: 'safetySettings',
  tool_config: 'toolConfig',
  cached_content: 'cachedContent',
  response_modalities: 'responseModalities',
  speech_config: 'speechConfig',
  voice_config: 'voiceConfig',
  multi_speaker_voice_config: 'multiSpeakerVoiceConfig',
  speaker_voice_configs: 'speakerVoiceConfigs',
  prebuilt_voice_config: 'prebuiltVoiceConfig',
  voice_name: 'voiceName',
  response_mime_type: 'responseMimeType',
  response_schema: 'responseSchema',
  inline_data: 'inlineData',
  file_data: 'fileData',
  mime_type: 'mimeType',
  file_uri: 'fileUri',
};

// Values under these keys belong to the caller (function arguments and schemas), so they are never renamed.
const USER_DATA_KEYS = new Set(['args', 'response', 'parameters', 'parametersJsonSchema', 'responseSchema',
  'response_schema', 'responseJsonSchema']);

const MIME_TYPES = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', heic: 'image/heic', heif: 'image/heif',
  gif: 'image/gif', mp4: 'video/mp4', mov: 'video/quicktime', avi: 'video/x-msvideo', webm: 'video/webm',
  mpeg: 'video/mpeg', mp3: 'audio/mpeg', wav: 'audio/wav', flac: 'audio/flac', ogg: 'audio/ogg', m4a: 'audio/mp4',
  aac: 'audio/aac', pdf: 'application/pdf', txt: 'text/plain', md: 'text/markdown', html: 'text/html',
  csv: 'text/csv', json: 'application/json',
};

// Hosts that may receive the wrapper credentials (downloadMedia).
const GOOGLE_API_HOST = /(^|\.)(generativelanguage|([a-z0-9-]+-)?aiplatform)\.googleapis\.com$|^aiplatform\.[a-z0-9-]+\.rep\.googleapis\.com$/;

/**
 * Error from the Gemini / Vertex AI methods. It keeps `status` and `body` like the errors of the other wrappers,
 * adds `details` (the parsed error body), and never contains the API key or access token.
 */
class GoogleAIError extends Error {
  constructor(message, status = null, details = null) {
    super(message);
    this.name = 'GoogleAIError';
    this.status = status;
    this.statusCode = status;
    this.details = details;
  }
}

function camelize(value) {
  if (Array.isArray(value)) return value.map(camelize);
  if (!value || typeof value !== 'object' || isBinary(value)) return value;
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    result[KEY_MAP[key] || key] = USER_DATA_KEYS.has(key) ? item : camelize(item);
  }
  return result;
}

function isBinary(value) {
  return (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) || value instanceof Uint8Array || value instanceof ArrayBuffer;
}

function toBuffer(value) {
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) return value;
  if (value instanceof ArrayBuffer) return Buffer.from(new Uint8Array(value));
  return Buffer.from(value);
}

function extensionOf(source) {
  const clean = String(source).split('?')[0].split('#')[0];
  const match = /\.([a-z0-9]+)$/i.exec(clean);
  return match ? match[1].toLowerCase() : '';
}

function knownMimeType(source) {
  return MIME_TYPES[extensionOf(source)] || null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gemini models on the Gemini Developer API (AI Studio key) or on Vertex AI / the Gemini Enterprise Agent Platform.
 *
 *   new GeminiAIWrapper(GEMINI_API_KEY)                                        // Gemini Developer API
 *   new GeminiAIWrapper(VERTEX_API_KEY, { vertex: true })                      // Vertex express mode (API key)
 *   new GeminiAIWrapper(VERTEX_API_KEY, { vertex: true, projectId })           // project scoped (Veo, Live, Lyria)
 *   new GeminiAIWrapper(null, { projectId, location: 'global' })               // Application Default Credentials
 *   new GeminiAIWrapper(null, { projectId, accessToken: () => getToken() })   // your own OAuth token
 *
 * Covers text, chat sessions, streaming, structured output, function calling, Google Search / URL context /
 * code execution / RAG grounding, image, audio, video and PDF understanding, Gemini image generation and editing,
 * Veo video, Lyria music, Gemini TTS, embeddings, token counting, the Files API, context caching, model listing,
 * Agent Engine and the Live API. GoogleAIWrapper extends this class with the Google Cloud APIs.
 */
class GeminiAIWrapper {
  /**
   * @param {string|null} apiKey - AI Studio key (Developer API) or Agent Platform key (Vertex).
   * @param {object} options - { vertex, projectId, location, accessToken, credentials, apiVersion, baseUrl,
   *   quotaProjectId, timeout, retries, retryDelay, WebSocket }.
   */
  constructor(apiKey = null, options = {}) {
    this.API_BASE_URL = config.url.gemini.base;
    this.API_KEY = typeof apiKey === 'string' ? apiKey.trim() || null : apiKey || null;

    this.client = new FetchClient({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        ...(this.API_KEY && { 'x-goog-api-key': this.API_KEY }),
      },
      timeout: options.timeout,
      retries: options.retries,
      retryDelay: options.retryDelay,
    });
    // the client for Gemini calls; GoogleAIWrapper keeps `client` for the Cloud APIs
    this.genaiClient = this.client;
    this._initGenAI(options || {});
  }

  /**
   * A wrapper from Chatbot / controller options. Vertex AI is used only when the options ask for it (vertex,
   * projectId, credentials or accessToken), never because of an environment variable.
   */
  static fromOptions(apiKey = null, options = {}) {
    const opts = { ...(options || {}) };
    if (opts.projectId === undefined) opts.projectId = opts.project_id || opts.vertexProject || undefined;
    if (opts.location === undefined) opts.location = opts.vertexLocation || undefined;
    if (opts.accessToken === undefined) opts.accessToken = opts.access_token || undefined;
    if (opts.vertex === undefined || opts.vertex === null) {
      opts.vertex = Boolean(opts.projectId || opts.credentials || opts.accessToken);
    }
    return new this(apiKey, opts);
  }

  _initGenAI(options) {
    const env = IS_NODE ? process.env : {};
    const vertexConfig = config.url.gemini.vertex;
    const projectOption = options.projectId || options.project_id || options.vertexProject || null;
    const accessToken = options.accessToken || options.access_token || null;
    let vertex = options.vertex;
    if (vertex === undefined || vertex === null) {
      const envVertex = ['1', 'true', 'yes'].includes(String(env.GOOGLE_GENAI_USE_VERTEXAI || env.GOOGLE_GENAI_USE_ENTERPRISE || '').trim().toLowerCase());
      vertex = Boolean(projectOption || options.credentials || accessToken || envVertex);
    }
    this.vertex = Boolean(vertex);

    let projectId = projectOption;
    if (this.vertex && !projectId && !this.API_KEY) projectId = env.GOOGLE_CLOUD_PROJECT || null;
    this.projectId = projectId || null;

    let location = options.location || options.vertexLocation || null;
    if (!location && this.vertex && env.GOOGLE_CLOUD_LOCATION) location = env.GOOGLE_CLOUD_LOCATION;
    this._locationExplicit = Boolean(location);
    if (!location && this.vertex && this.projectId) location = vertexConfig.default_location;
    this.location = location || null;

    this._accessToken = accessToken;
    this._credentials = options.credentials || null;
    this.quotaProjectId = options.quotaProjectId || null;
    this.baseUrl = options.baseUrl ? String(options.baseUrl).replace(/\/+$/, '') : null;
    this.WebSocket = options.WebSocket || null;
    this._auth = null;

    this._devApiBase = config.url.gemini.base.replace(/\/models\/?$/, '');
    this._devUploadBase = config.url.gemini.upload_base;
    if (this.vertex) {
      this.apiVersion = options.apiVersion || vertexConfig.api_version;
      this.models = { ...config.url.gemini.models, ...vertexConfig.models };
    } else {
      if (options.apiVersion) {
        this._devApiBase = this._devApiBase.replace(/\/v[^/]+$/, `/${options.apiVersion}`);
        this._devUploadBase = this._devUploadBase.replace(/\/v[^/]+\/files$/, `/${options.apiVersion}/files`);
      }
      this.apiVersion = this._devApiBase.split('/').pop();
      // shared with config, so a changed default applies to existing wrappers
      this.models = config.url.gemini.models;
    }
    this._capabilityLocations = { ...vertexConfig.locations };
  }

  /** Apply timeout (ms), retries, retryDelay (ms) or an AbortSignal to every Gemini request. */
  setRequestOptions(options = {}) {
    this.genaiClient.setRequestOptions(options);
    if (this.client !== this.genaiClient) this.client.setRequestOptions(options);
    return this;
  }

  // Accepts both 'gemini-3.6-flash' and 'models/gemini-3.6-flash'.
  static getModelId(model) {
    return String(model).replace(/^models\//, '');
  }

  // ------------------------------------------------------------------
  // Auth, URLs and errors
  // ------------------------------------------------------------------

  // Headers added to a request: none with an API key (the client sends it), a Bearer token otherwise.
  async _authHeaders() {
    if (this.API_KEY) return {};
    return this._bearerHeaders();
  }

  // Explicit credential headers, for requests that do not go through the client (Live API, downloads, uploads).
  async _credentialHeaders() {
    if (this.API_KEY) return { 'x-goog-api-key': this.API_KEY };
    return this._bearerHeaders();
  }

  async _bearerHeaders() {
    if (!this.vertex && !this._accessToken) {
      throw new GoogleAIError('The Gemini Developer API needs an API key. Pass apiKey, or use { vertex: true, projectId } '
        + 'with an access token or Application Default Credentials.');
    }
    if (this._accessToken) {
      const token = typeof this._accessToken === 'function' ? await this._accessToken() : this._accessToken;
      if (!token) throw new GoogleAIError('The accessToken function returned no token.');
      this._lastToken = String(token).trim();
      return { Authorization: `Bearer ${this._lastToken}`, ...(this.quotaProjectId && { 'x-goog-user-project': this.quotaProjectId }) };
    }
    const auth = this._getAuth();
    const headers = await auth.getHeaders();
    this._lastToken = headers.Authorization.slice(7);
    if (this.quotaProjectId) headers['x-goog-user-project'] = this.quotaProjectId;
    return headers;
  }

  _getAuth() {
    if (this._auth) return this._auth;
    const GoogleAuth = require('../utils/GoogleAuth');
    if (typeof GoogleAuth !== 'function') {
      throw new GoogleAIError('Google service account and ADC credentials need Node.js. In the browser pass an apiKey or accessToken.');
    }
    this._auth = new GoogleAuth({ credentials: this._credentials, quotaProjectId: this.quotaProjectId });
    return this._auth;
  }

  // The project for Vertex calls without one: the credentials' project when using OAuth.
  async _ensureProject(feature) {
    if (this.projectId) return this.projectId;
    if (this.vertex && !this.API_KEY && !this._accessToken) {
      this.projectId = await this._getAuth().getProjectId();
      if (this.projectId && !this.location) this.location = config.url.gemini.vertex.default_location;
    }
    if (!this.projectId && feature) {
      throw new GoogleAIError(`${feature} needs a Google Cloud project. Create the wrapper with { vertex: true, projectId }.`);
    }
    return this.projectId;
  }

  _vertexHost(location) {
    const vertexConfig = config.url.gemini.vertex;
    if (!location || location === 'global') return vertexConfig.global_host;
    if (location === 'us' || location === 'eu') return vertexConfig.multi_regional_host.replace('{location}', location);
    return vertexConfig.regional_host.replace('{location}', location);
  }

  _locationFor(capability, location = null) {
    if (location) return location;
    if (capability && !this._locationExplicit && this._capabilityLocations[capability]) return this._capabilityLocations[capability];
    return this.location;
  }

  static _vertexModelPath(model) {
    const name = String(model || '').trim();
    if (!name) throw new Error('A model name is required');
    if (name.startsWith('projects/') || name.startsWith('publishers/')) return name;
    if (name.startsWith('models/')) return `publishers/google/${name}`;
    if (name.includes('/')) {
      const [publisher, ...rest] = name.split('/');
      return `publishers/${publisher}/models/${rest.join('/')}`;
    }
    return `publishers/google/models/${name}`;
  }

  _modelPath(model) {
    if (this.vertex) return GeminiAIWrapper._vertexModelPath(model);
    const name = String(model || '').trim();
    if (!name) throw new Error('A model name is required');
    return name.startsWith('models/') || name.startsWith('tunedModels/') ? name : `models/${name}`;
  }

  /** Full URL of a resource path such as 'publishers/google/models/x:generateContent'. */
  async _resourceUrl(path, location = null) {
    let resource = String(path).replace(/^\/+/, '');
    if (!this.vertex) return `${this.baseUrl || this._devApiBase}/${resource}`;
    const match = /^projects\/[^/]+\/locations\/([^/]+)\//.exec(resource);
    let hostLocation;
    if (match) {
      hostLocation = match[1];
    } else {
      if (!this.API_KEY && !this.projectId) {
        await this._ensureProject();
        if (!this.projectId) {
          throw new GoogleAIError('Vertex AI with OAuth credentials needs a project. Pass projectId (or set GOOGLE_CLOUD_PROJECT); '
            + 'only API keys can use express mode.');
        }
      }
      if (this.projectId) {
        const resourceLocation = location || this.location || 'global';
        resource = `projects/${this.projectId}/locations/${resourceLocation}/${resource}`;
        hostLocation = resourceLocation;
      } else {
        hostLocation = location;
      }
    }
    return `${this.baseUrl || `${this._vertexHost(hostLocation)}/${this.apiVersion}`}/${resource}`;
  }

  async _modelUrl(model, method, location = null) {
    return this._resourceUrl(`${this._modelPath(model)}:${method}`, location);
  }

  _vertexProjectUrl(project, location, path) {
    const root = this.baseUrl && this.vertex ? this.baseUrl : `${this._vertexHost(location)}/${config.url.gemini.vertex.api_version}`;
    return `${root}/projects/${project}/locations/${location}/${path}`;
  }

  // URL of a full Vertex resource name (projects/.../locations/<loc>/...).
  _nameUrl(name) {
    const match = /^projects\/[^/]+\/locations\/([^/]+)\//.exec(name);
    const root = this.baseUrl && this.vertex ? this.baseUrl : `${this._vertexHost(match ? match[1] : null)}/${config.url.gemini.vertex.api_version}`;
    return `${root}/${name}`;
  }

  async _requireProject(feature) {
    if (!this.vertex) {
      throw new GoogleAIError(`${feature} needs Vertex AI. Create the wrapper with { vertex: true, projectId }.`);
    }
    return this._ensureProject(feature);
  }

  _defaultModel(kind) {
    const model = this.models[kind] || config.url.gemini.models[kind];
    if (!model) throw new Error(`No default Gemini model is configured for '${kind}'. Pass the model explicitly.`);
    return model;
  }

  _secrets() {
    const values = [this.API_KEY, typeof this._accessToken === 'string' ? this._accessToken : null, this._lastToken];
    return values.filter((value) => typeof value === 'string' && value.length >= 6).sort((a, b) => b.length - a.length);
  }

  _redact(text) {
    let result = String(text);
    for (const secret of this._secrets()) result = result.split(secret).join('<redacted>');
    return result.replace(/([?&]key=)[^&\s"']+/g, '$1<redacted>');
  }

  _hint(text) {
    if (!this.vertex && text.includes('API_KEY_SERVICE_BLOCKED')) {
      return 'hint: this key is not enabled for the Gemini Developer API; if it is a Vertex AI / Agent Platform key, pass { vertex: true }';
    }
    if (this.vertex && text.includes('API keys are not supported by this API')) {
      return 'hint: this Vertex AI endpoint needs OAuth; use Application Default Credentials (gcloud auth application-default login) or pass accessToken';
    }
    if (this.vertex && text.includes('RESOURCE_PROJECT_INVALID')) {
      return 'hint: this endpoint needs a project; pass { projectId }';
    }
    return null;
  }

  _apiError(prefix, error) {
    if (error instanceof GoogleAIError) return error;
    // timeouts and cancellation keep their name and code
    if (error && (error.name === 'AbortError' || error.code === 'ETIMEDOUT')) return connHelper.wrapError(error);
    const raw = error && error.message !== undefined ? error.message : String(error);
    const hint = this._hint(raw);
    let details = null;
    if (error && error.body) {
      try {
        details = JSON.parse(this._redact(error.body));
      } catch (parseError) {
        details = this._redact(error.body).slice(0, 2000);
      }
    }
    // the provider JSON stays at the end of the message, where apps look for it
    const wrapped = new GoogleAIError(this._redact(`${prefix}${hint ? ` (${hint})` : ''}: ${raw}`), error && error.status ? error.status : null, details);
    if (error && error.body !== undefined) wrapped.body = this._redact(error.body);
    if (error && error.code !== undefined) wrapped.code = error.code;
    wrapped.cause = error;
    return wrapped;
  }

  async _post(url, body, prefix, extra = {}) {
    try {
      const headers = { ...(await this._authHeaders()), ...(extra.headers || {}) };
      return await this.genaiClient.post(url, body, { ...extra, headers });
    } catch (error) {
      throw this._apiError(prefix, error);
    }
  }

  async _get(url, prefix, extra = {}) {
    try {
      const headers = { ...(await this._authHeaders()), ...(extra.headers || {}) };
      return await this.genaiClient.get(url, { ...extra, headers });
    } catch (error) {
      throw this._apiError(prefix, error);
    }
  }

  async _delete(url, prefix) {
    try {
      const headers = await this._authHeaders();
      const text = await this.genaiClient.request('DELETE', url, undefined, { headers, responseType: 'text' });
      return text && String(text).trim() ? JSON.parse(text) : { status: 'deleted' };
    } catch (error) {
      throw this._apiError(prefix, error);
    }
  }

  static _query(params) {
    const entries = Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== null && value !== '');
    return entries.length ? `?${entries.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')}` : '';
  }

  // ------------------------------------------------------------------
  // Request bodies
  // ------------------------------------------------------------------

  // One content item; Vertex AI rejects contents without a role.
  _content(content) {
    if (typeof content === 'string') return { role: 'user', parts: [{ text: content }] };
    if (content && typeof content === 'object' && this.vertex && !content.role) {
      const parts = content.parts || [];
      const isModel = parts.some((part) => part && (part.functionCall || part.function_call));
      return { ...content, role: isModel ? 'model' : 'user' };
    }
    return content;
  }

  // Body for generateContent-style calls: camelCase keys, string prompts, roles on Vertex, no 'model' key.
  _prepareBody(params) {
    const source = typeof params === 'string' ? { contents: [{ role: 'user', parts: [{ text: params }] }] } : params || {};
    const { model, ...rest } = source;
    const body = camelize(rest);
    let contents = body.contents;
    if (typeof contents === 'string' || (contents && !Array.isArray(contents))) contents = [contents];
    if (Array.isArray(contents)) body.contents = contents.map((content) => this._content(content));
    if (typeof body.systemInstruction === 'string') body.systemInstruction = { parts: [{ text: body.systemInstruction }] };
    return body;
  }

  /**
   * One content part for an image, audio, video or document.
   * @param {object|string|Buffer|Uint8Array} source - a part object (returned as is), { data, mimeType }, bytes,
   *   a local path (Node), or a gs://, https:// or YouTube URI.
   * @param {string} mimeType - needed for bytes and for URIs without an extension (Files API URIs).
   */
  mediaPart(source, mimeType = null, { videoMetadata = null } = {}) {
    let part;
    if (source && typeof source === 'object' && !isBinary(source)) {
      if (source.inlineData || source.inline_data || source.fileData || source.file_data || source.text !== undefined) {
        return camelize(source);
      }
      if (source.data !== undefined) {
        const type = source.mimeType || source.mime_type || mimeType;
        if (typeof source.data !== 'string') return this.mediaPart(source.data, type, { videoMetadata: source.videoMetadata || videoMetadata });
        // string data is base64 (a data URL prefix is dropped)
        if (!type) throw new Error('mimeType is required for raw bytes');
        part = { inlineData: { mimeType: type, data: source.data.replace(/^data:[^,]*,/, '') } };
        if (source.videoMetadata || videoMetadata) part.videoMetadata = source.videoMetadata || videoMetadata;
        return part;
      }
      if (source.uri || source.fileUri) {
        return this.mediaPart(source.uri || source.fileUri, source.mimeType || mimeType, { videoMetadata: source.videoMetadata || videoMetadata });
      }
      throw new Error('A media object needs data, uri or a Gemini part (inlineData / fileData).');
    }
    if (isBinary(source)) {
      if (!mimeType) throw new Error('mimeType is required for raw bytes');
      part = { inlineData: { mimeType, data: toBuffer(source).toString('base64') } };
    } else if (typeof source === 'string') {
      if (/^(gs|https?):\/\//i.test(source)) {
        const isYouTube = /youtube\.com|youtu\.be/i.test(source);
        const type = mimeType || (isYouTube ? 'video/mp4' : knownMimeType(source));
        if (!type) {
          throw new Error(`Could not tell the file type of ${source.slice(0, 80)}; pass mimeType (for a Files API URI use getFile(name).mimeType).`);
        }
        part = { fileData: { mimeType: type, fileUri: source } };
      } else if (source.startsWith('data:')) {
        const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(source);
        if (!match) throw new Error('Invalid data URL');
        const data = match[2] ? match[3] : Buffer.from(decodeURIComponent(match[3])).toString('base64');
        part = { inlineData: { mimeType: mimeType || match[1] || 'application/octet-stream', data } };
      } else {
        const fs = require('fs');
        if (!IS_NODE || !fs.existsSync || !fs.existsSync(source)) {
          throw new Error(`Not a file path or URI: ${source.slice(0, 80)}`);
        }
        part = { inlineData: { mimeType: mimeType || knownMimeType(source) || 'application/octet-stream', data: fs.readFileSync(source).toString('base64') } };
      }
    } else {
      throw new Error('Provide bytes, a file path, a URI or a part object.');
    }
    if (videoMetadata) part.videoMetadata = videoMetadata;
    return part;
  }

  _toParts(prompt = null, media = null) {
    const parts = [];
    const prompts = prompt === null || prompt === undefined ? [] : Array.isArray(prompt) ? prompt : [prompt];
    for (const item of prompts) parts.push(typeof item === 'string' ? { text: item } : camelize(item));
    const mediaList = media === null || media === undefined ? [] : Array.isArray(media) ? media : [media];
    for (const item of mediaList) parts.push(this.mediaPart(item));
    return parts;
  }

  _buildRequest(prompt, { systemInstruction, media, generationConfig, tools, toolConfig, safetySettings, history, cachedContent } = {}) {
    const contents = (history || []).map((content) => this._content(content));
    if ((prompt !== null && prompt !== undefined) || (media && media.length !== 0)) {
      contents.push({ role: 'user', parts: this._toParts(prompt, media) });
    }
    const body = { contents };
    if (systemInstruction) {
      body.systemInstruction = typeof systemInstruction === 'string' ? { parts: [{ text: systemInstruction }] } : systemInstruction;
    }
    if (generationConfig) body.generationConfig = { ...generationConfig };
    if (tools) body.tools = tools;
    if (toolConfig) body.toolConfig = toolConfig;
    if (safetySettings) body.safetySettings = safetySettings;
    if (cachedContent) body.cachedContent = cachedContent;
    return body;
  }

  // ------------------------------------------------------------------
  // Response helpers
  // ------------------------------------------------------------------

  static* _parts(response) {
    for (const candidate of (response && response.candidates) || []) {
      for (const part of (candidate && candidate.content && candidate.content.parts) || []) {
        if (part && typeof part === 'object') yield part;
      }
    }
  }

  /** The text of the first candidate (thought summaries are skipped unless includeThoughts). */
  static extractText(response, includeThoughts = false) {
    const candidates = (response && response.candidates) || [];
    if (!candidates.length) return '';
    const parts = (candidates[0] && candidates[0].content && candidates[0].content.parts) || [];
    return parts.filter((part) => part && typeof part.text === 'string' && (includeThoughts || !part.thought)).map((part) => part.text).join('');
  }

  /** finishReason of the first candidate (STOP, MAX_TOKENS, SAFETY, ...), or the prompt blockReason, or null. */
  static extractFinishReason(response) {
    const candidates = (response && response.candidates) || [];
    if (candidates.length) return (candidates[0] && candidates[0].finishReason) || null;
    return (response && response.promptFeedback && response.promptFeedback.blockReason) || null;
  }

  /** [{ name, args, id? }] for every functionCall part. */
  static extractFunctionCalls(response) {
    const calls = [];
    for (const part of GeminiAIWrapper._parts(response)) {
      const call = part.functionCall || part.function_call;
      if (call) calls.push({ ...call });
    }
    return calls;
  }

  /** groundingMetadata of the first candidate (search queries, sources, supports), or {}. */
  static extractGrounding(response) {
    const candidates = (response && response.candidates) || [];
    return (candidates.length && candidates[0] && candidates[0].groundingMetadata) || {};
  }

  /** The sources the answer was grounded on: [{ title, uri, text? }] from Google Search, URL context or RAG. */
  static extractCitations(response) {
    const metadata = GeminiAIWrapper.extractGrounding(response);
    const seen = new Set();
    const citations = [];
    for (const chunk of metadata.groundingChunks || []) {
      const source = chunk.web || chunk.retrievedContext || chunk.maps || {};
      const uri = source.uri || null;
      const key = uri || source.title;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      citations.push({ title: source.title || uri, uri, ...(source.domain && { domain: source.domain }), ...(source.text && { text: source.text }) });
    }
    return citations;
  }

  /** usageMetadata (promptTokenCount, candidatesTokenCount, thoughtsTokenCount, totalTokenCount), or null. */
  static extractUsage(response) {
    return (response && response.usageMetadata) || null;
  }

  static _extractMedia(response, prefix) {
    const items = [];
    for (const part of GeminiAIWrapper._parts(response)) {
      const inline = part.inlineData || part.inline_data;
      if (inline) {
        const mimeType = inline.mimeType || inline.mime_type || '';
        if (mimeType.startsWith(prefix)) items.push({ mimeType, data: inline.data });
      }
    }
    for (const prediction of (response && response.predictions) || []) {
      if (prediction && prediction.bytesBase64Encoded) {
        const mimeType = prediction.mimeType || (prefix === 'audio/' ? 'audio/wav' : 'image/png');
        if (mimeType.startsWith(prefix)) items.push({ mimeType, data: prediction.bytesBase64Encoded });
      }
    }
    return items;
  }

  /** Images from a Gemini response or an Imagen prediction: [{ mimeType, data (base64) }]. */
  static extractImages(response) {
    return GeminiAIWrapper._extractMedia(response, 'image/');
  }

  /** Audio from a Gemini TTS / music response or a Lyria prediction: [{ mimeType, data (base64) }]. */
  static extractAudio(response) {
    return GeminiAIWrapper._extractMedia(response, 'audio/');
  }

  /** Videos from a finished Veo operation: [{ mimeType, data (base64) or null, uri or null }]. */
  static extractVideos(operation) {
    const response = (operation && operation.response) || {};
    const videos = [];
    for (const video of response.videos || []) {
      videos.push({ mimeType: video.mimeType || 'video/mp4', data: video.bytesBase64Encoded || null, uri: video.gcsUri || null });
    }
    const samples = (response.generateVideoResponse && response.generateVideoResponse.generatedSamples) || response.generatedVideos || [];
    for (const sample of samples) {
      const video = sample.video || {};
      videos.push({ mimeType: video.mimeType || 'video/mp4', data: video.encodedVideo || video.bytesBase64Encoded || null, uri: video.uri || null });
    }
    return videos;
  }

  /** Wrap raw 16-bit PCM (Gemini TTS, Live API) in a WAV container. pcm is bytes or base64. Returns a Buffer. */
  static pcmToWav(pcm, sampleRate = 24000, channels = 1, sampleWidth = 2) {
    const data = typeof pcm === 'string' ? Buffer.from(pcm, 'base64') : toBuffer(pcm);
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + data.length, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(channels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * channels * sampleWidth, 28);
    header.writeUInt16LE(channels * sampleWidth, 32);
    header.writeUInt16LE(sampleWidth * 8, 34);
    header.write('data', 36);
    header.writeUInt32LE(data.length, 40);
    return Buffer.concat([header, data]);
  }

  /** WAV bytes (Buffer) for an item from extractAudio: raw L16 PCM is wrapped, WAV is returned as is. */
  static audioToWav(audio) {
    const raw = typeof audio.data === 'string' ? Buffer.from(audio.data, 'base64') : toBuffer(audio.data);
    const mimeType = String(audio.mimeType || audio.mime_type || '').toLowerCase();
    if (raw.slice(0, 4).toString('latin1') === 'RIFF') return GeminiAIWrapper._fixWavSizes(raw);
    if (mimeType.includes('l16') || mimeType.includes('pcm')) {
      const rate = /rate=(\d+)/.exec(mimeType);
      return GeminiAIWrapper.pcmToWav(raw, rate ? Number(rate[1]) : 24000);
    }
    return raw;
  }

  // Correct the RIFF and data sizes when a streamed WAV header claims more audio than is present.
  static _fixWavSizes(raw) {
    const position = raw.indexOf('data', 12, 'latin1');
    if (raw.slice(8, 12).toString('latin1') !== 'WAVE' || position < 0 || position + 8 > raw.length) return raw;
    const actual = raw.length - (position + 8);
    if (raw.readUInt32LE(position + 4) <= actual) return raw;
    const fixed = Buffer.from(raw);
    fixed.writeUInt32LE(raw.length - 8, 4);
    fixed.writeUInt32LE(actual, position + 4);
    return fixed;
  }

  // ------------------------------------------------------------------
  // Text, chat and multimodal generation
  // ------------------------------------------------------------------

  /**
   * Call generateContent and return the JSON response.
   * @param {object|string} params - a generateContent body (an optional `model` key selects the model and is not
   *   sent), or a plain prompt.
   * @param {boolean} vision - use the configured vision model when no model is given.
   * @param {string} modelOverride - model id that takes precedence over params.model.
   */
  async generateContent(params, vision = false, modelOverride = null) {
    const paramsModel = params && typeof params === 'object' ? params.model : null;
    const model = GeminiAIWrapper.getModelId(modelOverride || paramsModel || this._defaultModel(vision ? 'vision' : 'chat'));
    return this._post(await this._modelUrl(model, 'generateContent'), this._prepareBody(params), 'Gemini API error');
  }

  /** Call streamGenerateContent (server-sent events) and yield each response chunk. */
  async* streamGenerateContent(params, vision = false, modelOverride = null) {
    const paramsModel = params && typeof params === 'object' ? params.model : null;
    const model = GeminiAIWrapper.getModelId(modelOverride || paramsModel || this._defaultModel(vision ? 'vision' : 'chat'));
    const url = `${await this._modelUrl(model, 'streamGenerateContent')}?alt=sse`;
    const stream = await this._post(url, this._prepareBody(params), 'Gemini stream error', { responseType: 'stream' });
    for await (const event of GeminiAIWrapper._sseEvents(stream)) {
      if (event && typeof event === 'object' && event.error && typeof event.error === 'object') {
        throw new GoogleAIError(this._redact(`Gemini stream error: ${JSON.stringify(event.error)}`), event.error.code || null, event);
      }
      yield event;
    }
  }

  // Parse a server-sent events stream into JSON objects (text that is not JSON is yielded as a string).
  static async* _sseEvents(stream) {
    let buffer = '';
    const parse = (block) => {
      const data = block.split(/\r?\n/).filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trimStart()).join('\n');
      if (!data || data === '[DONE]') return undefined;
      try {
        return JSON.parse(data);
      } catch (error) {
        return data;
      }
    };
    for await (const chunk of readStreamChunks(stream)) {
      buffer += chunk;
      let match;
      while ((match = /\r?\n\r?\n/.exec(buffer))) {
        const block = buffer.slice(0, match.index);
        buffer = buffer.slice(match.index + match[0].length);
        const event = parse(block);
        if (event !== undefined) yield event;
      }
    }
    const last = parse(buffer);
    if (last !== undefined) yield last;
  }

  /**
   * Generate and return text.
   * @param {string|Array} prompt - text, or parts.
   * @param {object} options - { model, systemInstruction, media, generationConfig, tools, toolConfig, safetySettings,
   *   history, cachedContent }. media takes paths, bytes ({ data, mimeType }), gs:// / https URIs or parts.
   */
  async generateText(prompt, options = {}) {
    const body = this._buildRequest(prompt, options);
    return GeminiAIWrapper.extractText(await this.generateContent(body, false, options.model || this._defaultModel('chat')));
  }

  /** Yield the text of the reply as the model writes it. Same options as generateText. */
  async* streamText(prompt, options = {}) {
    const body = this._buildRequest(prompt, options);
    for await (const chunk of this.streamGenerateContent(body, false, options.model || this._defaultModel('chat'))) {
      const text = GeminiAIWrapper.extractText(chunk);
      if (text) yield text;
    }
  }

  /**
   * A multi-turn chat that keeps the history, including the thought signatures Gemini 3 needs for tool use
   * and image editing. Save chat.history (JSON) to resume later with startChat({ history }).
   * @param {object} options - { model, systemInstruction, generationConfig, tools, toolConfig, safetySettings, history }.
   */
  startChat(options = {}) {
    return new GoogleAIChatSession(this, options);
  }

  /** generateContent with a system instruction (content parts in, raw response out). */
  async generateContentWithSystemInstructions(contentParts, systemInstruction = null, modelOverride = null) {
    return this.generateContent({
      contents: [{ role: 'user', parts: contentParts }],
      ...(systemInstruction && { systemInstruction: { parts: [{ text: systemInstruction }] } }),
    }, false, modelOverride);
  }

  /** JSON output that follows responseSchema (OpenAPI-style or JSON Schema types). Returns the raw response. */
  async generateStructuredContent(contentParts, responseSchema, { systemInstruction = null, model = null, generationConfig = null, tools = null, toolConfig = null } = {}) {
    const parts = typeof contentParts === 'string' ? [{ text: contentParts }] : contentParts;
    return this.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: { responseMimeType: 'application/json', responseSchema, ...(generationConfig || {}) },
      ...(systemInstruction && { systemInstruction: { parts: [{ text: systemInstruction }] } }),
      ...(tools && { tools }),
      ...(toolConfig && { toolConfig }),
    }, false, model);
  }

  /** Count the tokens of a prompt or a request body: { totalTokens, ... }. */
  async countTokens(params, model = null) {
    const body = this._prepareBody(params);
    const target = model || (params && params.model) || this._defaultModel('chat');
    let request;
    if (this.vertex) {
      request = {};
      for (const key of ['contents', 'systemInstruction', 'tools', 'generationConfig']) if (body[key] !== undefined) request[key] = body[key];
    } else {
      // the Developer API takes the other request fields only inside generateContentRequest
      const extra = {};
      for (const key of ['systemInstruction', 'tools', 'generationConfig', 'toolConfig', 'safetySettings', 'cachedContent']) {
        if (body[key] !== undefined) {
          extra[key] = body[key];
          delete body[key];
        }
      }
      request = Object.keys(extra).length ? { generateContentRequest: { model: this._modelPath(target), ...body, ...extra } } : body;
    }
    return this._post(await this._modelUrl(target, 'countTokens'), request, 'Gemini countTokens error');
  }

  /** Token ids and pieces of a request (Vertex AI only). */
  async computeTokens(params, model = null) {
    if (!this.vertex) throw new GoogleAIError('computeTokens is only available on Vertex AI. Create the wrapper with { vertex: true }.');
    const body = this._prepareBody(params);
    return this._post(await this._modelUrl(model || this._defaultModel('chat'), 'computeTokens'), { contents: body.contents || [] }, 'Gemini computeTokens error');
  }

  // ------------------------------------------------------------------
  // Image, audio, video and document understanding
  // ------------------------------------------------------------------

  async imageToText(userInput, filePath, extension, modelOverride = null) {
    const imageData = require('fs').readFileSync(filePath, { encoding: 'base64' });
    const params = {
      contents: [
        {
          parts: [
            { text: `${userInput}` },
            {
              inline_data: {
                mime_type: `image/${extension}`,
                data: imageData
              }
            }
          ]
        }
      ]
    };
    return this.generateContent(params, true, modelOverride);
  }

  /** Ask about images, audio, video or documents and return text. Options as generateText. */
  async mediaToText(prompt, media, options = {}) {
    return this.generateText(prompt, { ...options, media, model: options.model || this._defaultModel('vision') });
  }

  /** Transcribe or describe audio (bytes with mimeType, a path, or a gs:// / https URI). */
  async audioToText(audio, prompt = 'Transcribe this audio.', options = {}) {
    return this.mediaToText(prompt, [this.mediaPart(audio, options.mimeType || null)], options);
  }

  /** Summarize or ask about a video (bytes, a path, a gs:// URI or a YouTube URL). videoMetadata clips it. */
  async videoToText(video, prompt = 'Summarize this video.', options = {}) {
    const part = this.mediaPart(video, options.mimeType || null, { videoMetadata: options.videoMetadata || null });
    return this.mediaToText(prompt, [part], options);
  }

  // ------------------------------------------------------------------
  // Image generation (Gemini image models, Imagen)
  // ------------------------------------------------------------------

  /**
   * Generate images with a Gemini image model; pass images to edit or combine them. configParams is merged into
   * generationConfig, e.g. { imageConfig: { aspectRatio: '16:9' } }. Read the result with extractImages.
   */
  async generateImage(prompt, configParams = null, modelOverride = null, { images = null } = {}) {
    const model = modelOverride || this._defaultModel('image');
    const imageList = images === null || images === undefined ? [] : Array.isArray(images) ? images : [images];
    const body = this._prepareBody({
      contents: [{ role: 'user', parts: [{ text: prompt }, ...imageList.map((image) => this.mediaPart(image))] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'], ...(configParams || {}) },
    });
    return this._post(await this._modelUrl(model, 'generateContent'), body, 'Gemini Image Generation error');
  }

  /** Edit one or more images with a text instruction. */
  async editImage(prompt, images, configParams = null, modelOverride = null) {
    return this.generateImage(prompt, configParams, modelOverride, { images: Array.isArray(images) ? images : [images] });
  }

  // Image object for Imagen / Veo requests: bytes, a path, a gs:// URI, base64 text or an object.
  _imagenImage(image, mimeType = null, defaultMime = null) {
    if (image && typeof image === 'object' && !isBinary(image)) return image;
    let result;
    let type = mimeType;
    if (isBinary(image)) {
      const data = toBuffer(image);
      result = { bytesBase64Encoded: data.toString('base64') };
      type = type || GeminiAIWrapper._sniffImageMime(data);
    } else if (typeof image === 'string' && image.startsWith('gs://')) {
      result = { gcsUri: image };
      type = type || knownMimeType(image);
    } else if (typeof image === 'string' && /^https?:\/\//i.test(image)) {
      throw new Error('Imagen and Veo take image bytes, a local path or a gs:// URI, not an http(s) URL.');
    } else if (typeof image === 'string' && IS_NODE && require('fs').existsSync && require('fs').existsSync(image)) {
      const data = require('fs').readFileSync(image);
      result = { bytesBase64Encoded: data.toString('base64') };
      type = type || knownMimeType(image) || GeminiAIWrapper._sniffImageMime(data);
    } else if (typeof image === 'string' && /^[A-Za-z0-9+/=\s]+$/.test(image)) {
      result = { bytesBase64Encoded: image };
    } else {
      throw new Error('image must be bytes, a path, a gs:// URI, base64 text or an object');
    }
    type = type || defaultMime;
    if (type) result.mimeType = type;
    return result;
  }

  static _sniffImageMime(data) {
    if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return 'image/jpeg';
    if (data.slice(0, 8).toString('latin1') === '\x89PNG\r\n\x1a\n') return 'image/png';
    if (data.slice(0, 4).toString('latin1') === 'RIFF' && data.slice(8, 12).toString('latin1') === 'WEBP') return 'image/webp';
    return null;
  }

  _imagenModel(model) {
    if (model) return model;
    throw new Error('Google retired the Imagen models on 2026-06-30 (they return 404). Use generateImage / editImage with a '
      + 'Gemini image model, or pass { model } for an Imagen model your project can still call.');
  }

  /** Imagen :predict (retired by Google; needs an explicit model). */
  async imagenGenerateImages(prompt, { numberOfImages = 1, model = null, aspectRatio = null, negativePrompt = null, parameters = null } = {}) {
    const body = {
      instances: [{ prompt }],
      parameters: { sampleCount: numberOfImages, ...(aspectRatio && { aspectRatio }), ...(negativePrompt && { negativePrompt }), ...(parameters || {}) },
    };
    return this._post(await this._modelUrl(this._imagenModel(model), 'predict', this._locationFor('imagen')), body, 'Imagen error');
  }

  // ------------------------------------------------------------------
  // Video generation (Veo)
  // ------------------------------------------------------------------

  /**
   * Start a Veo video generation and return the long-running operation (poll it with getVideoOperation or
   * waitForVideoCompletion). On Vertex AI it needs a project. configParams are Veo parameters, e.g.
   * { durationSeconds: 4, aspectRatio: '16:9', resolution: '720p', generateAudio: false, storageUri: 'gs://...' }.
   */
  async generateVideo(prompt, configParams = null, projectId = null, { model = null, image = null, lastFrame = null, location = null } = {}) {
    const instance = { prompt };
    if (image !== null && image !== undefined) instance.image = this._imagenImage(image, null, 'image/png');
    if (lastFrame !== null && lastFrame !== undefined) instance.lastFrame = this._imagenImage(lastFrame, null, 'image/png');
    const body = { instances: [instance], parameters: { aspectRatio: '16:9', ...(configParams || {}) } };
    let url;
    if (this.vertex || projectId) {
      const project = projectId || this.projectId || (!this.API_KEY ? await this._requireProject('Veo video generation') : null);
      if (!project) {
        throw new Error('Video generation on Vertex AI needs a project (Veo does not run in express mode). Pass projectId.');
      }
      const videoLocation = this._locationFor('video', location) || 'us-central1';
      const videoModel = model || (this.vertex ? this._defaultModel('video') : config.url.gemini.vertex.models.video);
      url = this._vertexProjectUrl(project, videoLocation, `${GeminiAIWrapper._vertexModelPath(videoModel)}:predictLongRunning`);
    } else {
      url = await this._modelUrl(model || this._defaultModel('video'), 'predictLongRunning');
    }
    return this._post(url, body, 'Veo Video Generation error');
  }

  /** Poll a Veo operation (a name or the operation object). */
  async getVideoOperation(operation) {
    const name = operation && typeof operation === 'object' ? operation.name : operation;
    if (!name) throw new Error('operation name is required');
    if (name.startsWith('projects/')) {
      const resource = name.slice(0, name.lastIndexOf('/operations/'));
      return this._post(`${this._nameUrl(resource)}:fetchPredictOperation`, { operationName: name }, 'Video status check error');
    }
    if (this.vertex) throw new Error("Vertex AI operation names start with 'projects/'.");
    return this._get(`${this.baseUrl || this._devApiBase}/${name}`, 'Video status check error');
  }

  /** Poll until the operation is done and return it. Throws after maxWaitMs. */
  async waitForVideoCompletion(operation, { maxWaitMs = 600000, pollMs = 10000 } = {}) {
    const started = Date.now();
    while (Date.now() - started < maxWaitMs) {
      const status = await this.getVideoOperation(operation);
      if (status && status.done) {
        if (status.error) throw new GoogleAIError(`Veo Video Generation error: ${JSON.stringify(status.error)}`, status.error.code || null, status.error);
        return status;
      }
      await sleep(pollMs);
    }
    throw new Error(`Video generation did not complete within ${Math.round(maxWaitMs / 1000)} seconds`);
  }

  /**
   * Download a generated file from an https URI (e.g. a Developer API Veo video) and return its bytes (Buffer).
   * The credentials are sent only to Google API hosts; redirects to other hosts get none.
   */
  async downloadMedia(uri) {
    if (!/^https:\/\//i.test(uri)) throw new Error('downloadMedia takes an https:// URI');
    const fetch = require('cross-fetch');
    let url = uri.includes('alt=') ? uri : `${uri}${uri.includes('?') ? '&' : '?'}alt=media`;
    for (let hop = 0; hop < 5; hop++) {
      const host = new URL(url).hostname.toLowerCase();
      const trusted = GOOGLE_API_HOST.test(host) || (this.baseUrl && new URL(this.baseUrl).hostname.toLowerCase() === host);
      const headers = trusted ? await this._credentialHeaders() : {};
      const response = await fetch(url, { headers, redirect: 'manual' });
      if ([301, 302, 303, 307, 308].includes(response.status) && response.headers.get('location')) {
        url = new URL(response.headers.get('location'), url).toString();
        continue;
      }
      if (!response.ok) {
        const error = new Error(`HTTP error ${response.status}: ${await response.text().catch(() => '')}`);
        error.status = response.status;
        throw this._apiError('Download error', error);
      }
      return Buffer.from(await response.arrayBuffer());
    }
    throw new GoogleAIError('Download error: too many redirects');
  }

  // ------------------------------------------------------------------
  // Music (Lyria) and speech (Gemini TTS)
  // ------------------------------------------------------------------

  /**
   * Generate music. Lyria 2 (lyria-002, Vertex AI) uses :predict; Lyria 3 models (lyria-3.5, Developer API) use
   * generateContent. Read the audio with extractAudio and audioToWav.
   */
  async generateMusic(prompt, { model = null, negativePrompt = null, seed = null, sampleCount = null, generationConfig = null, location = null } = {}) {
    const target = model || this._defaultModel('music');
    if (!target.includes('/') && /^lyria-0\d\d/.test(target)) {
      if (!this.vertex) {
        throw new GoogleAIError(`${target} runs on Vertex AI. Create the wrapper with { vertex: true }, or use a Lyria 3 model on the Developer API.`);
      }
      const instance = { prompt, ...(negativePrompt && { negative_prompt: negativePrompt }), ...(seed !== null && { seed }) };
      const body = { instances: [instance], ...(sampleCount && { parameters: { sample_count: sampleCount } }) };
      return this._post(await this._modelUrl(target, 'predict', this._locationFor('music', location)), body, 'Lyria music error');
    }
    const text = negativePrompt ? `${prompt}\nAvoid: ${negativePrompt}` : prompt;
    const body = this._prepareBody({
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: { responseModalities: ['AUDIO', 'TEXT'], ...(seed !== null && { seed }), ...(generationConfig || {}) },
    });
    return this._post(await this._modelUrl(target, 'generateContent', location), body, 'Lyria music error');
  }

  /**
   * Speech with a Gemini TTS model (default voice Kore). Returns the response: extractAudio(response) then
   * audioToWav(item) gives a playable WAV. Style the voice in the text ("Say cheerfully: ...").
   */
  async generateGeminiSpeech(text, voiceConfig = null, modelOverride = null, { voice = null, languageCode = null } = {}) {
    const body = this._prepareBody({
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voice || 'Kore' }, ...camelize(voiceConfig || {}) },
          ...(languageCode && { languageCode }),
        },
      },
    });
    return this._post(await this._modelUrl(modelOverride || this._defaultModel('tts'), 'generateContent'), body, 'Gemini TTS error');
  }

  /** Multi-speaker speech: speakerConfigs [{ speaker, voiceConfig: { prebuiltVoiceConfig: { voiceName } } }]. */
  async generateMultiSpeakerSpeech(text, speakerConfigs, modelOverride = null) {
    const body = this._prepareBody({
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: { multiSpeakerVoiceConfig: { speakerVoiceConfigs: camelize(speakerConfigs) } },
      },
    });
    return this._post(await this._modelUrl(modelOverride || this._defaultModel('tts'), 'generateContent'), body, 'Gemini Multi-Speaker TTS error');
  }

  /** Text to a WAV Buffer in one call (Gemini TTS). */
  async textToSpeech(text, { voice = 'Kore', model = null, languageCode = null } = {}) {
    const response = await this.generateGeminiSpeech(text, null, model, { voice, languageCode });
    const [audio] = GeminiAIWrapper.extractAudio(response);
    if (!audio) throw new GoogleAIError(`Gemini TTS error: the response has no audio (finishReason ${GeminiAIWrapper.extractFinishReason(response)})`);
    return GeminiAIWrapper.audioToWav(audio);
  }

  // ------------------------------------------------------------------
  // Embeddings
  // ------------------------------------------------------------------

  static _contentText(content) {
    if (typeof content === 'string') return content;
    return ((content && content.parts) || []).filter((part) => part && part.text).map((part) => part.text).join('\n');
  }

  // Vertex AI embeddings: gemini-embedding-001 and text-embedding-* use :predict (gemini-embedding-001 takes one
  // input per request, the others up to 250); newer Gemini embedding models use :embedContent.
  async _vertexEmbed(modelId, texts, { taskType = null, title = null, outputDimensionality = null } = {}) {
    const vectors = [];
    if (modelId.includes('gemini') && modelId !== 'gemini-embedding-001') {
      for (const text of texts) {
        const embedConfig = { ...(taskType && { taskType }), ...(title && { title }), ...(outputDimensionality && { outputDimensionality }) };
        const body = { content: { role: 'user', parts: [{ text }] }, ...(Object.keys(embedConfig).length && { embedContentConfig: embedConfig }) };
        const data = await this._post(await this._modelUrl(modelId, 'embedContent'), body, 'Gemini API error');
        vectors.push((data.embedding && data.embedding.values) || []);
      }
      return vectors;
    }
    const maxCount = modelId.startsWith('gemini-embedding') ? 1 : 250;
    for (let start = 0; start < texts.length; start += maxCount) {
      const instances = texts.slice(start, start + maxCount).map((text) => ({ content: text, ...(taskType && { task_type: taskType }), ...(title && { title }) }));
      const body = { instances, ...(outputDimensionality && { parameters: { outputDimensionality } }) };
      const data = await this._post(await this._modelUrl(modelId, 'predict'), body, 'Gemini API error');
      for (const prediction of data.predictions || []) vectors.push((prediction.embeddings && prediction.embeddings.values) || []);
    }
    return vectors;
  }

  /**
   * One embedding: params { model?, content: { parts: [{ text }] }, taskType?, outputDimensionality? }.
   * Returns the embedding object ({ values }) on both backends.
   */
  async getEmbeddings(params) {
    const modelId = GeminiAIWrapper.getModelId(params.model || this._defaultModel('embed')).split('/').pop();
    if (this.vertex) {
      const [values] = await this._vertexEmbed(modelId, [GeminiAIWrapper._contentText(params.content)], {
        taskType: params.taskType || params.task_type, title: params.title, outputDimensionality: params.outputDimensionality || params.output_dimensionality,
      });
      return { values: values || [] };
    }
    const response = await this._post(await this._modelUrl(modelId, 'embedContent'), { ...camelize(params), model: `models/${modelId}` }, 'Gemini API error');
    return response.embedding;
  }

  /** Batch embeddings: params { requests: [{ model?, content }] }. Returns [{ values }]. */
  async getBatchEmbeddings(params) {
    const requests = params.requests || [];
    const requestedModel = requests.length > 0 ? requests[0].model : null;
    const modelId = GeminiAIWrapper.getModelId(requestedModel || this._defaultModel('embed')).split('/').pop();
    if (this.vertex) {
      const vectors = await this._vertexEmbed(modelId, requests.map((request) => GeminiAIWrapper._contentText(request.content)));
      return vectors.map((values) => ({ values }));
    }
    const response = await this._post(await this._modelUrl(modelId, 'batchEmbedContents'), {
      ...params,
      requests: requests.map((request) => ({ ...camelize(request), model: `models/${modelId}` })),
    }, 'Gemini API error');
    return response.embeddings;
  }

  /**
   * Embed texts and return the vectors (number[][]).
   * @param {object} options - { taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY' | 'SEMANTIC_SIMILARITY' | ..., title, outputDimensionality }.
   */
  async embedTexts(texts, model = null, { taskType = null, title = null, outputDimensionality = null } = {}) {
    const list = Array.isArray(texts) ? texts : [texts];
    const modelId = GeminiAIWrapper.getModelId(model || this._defaultModel('embed')).split('/').pop();
    if (this.vertex) return this._vertexEmbed(modelId, list, { taskType, title, outputDimensionality });
    const vectors = [];
    // batchEmbedContents takes at most 100 requests
    for (let start = 0; start < list.length; start += 100) {
      const requests = list.slice(start, start + 100).map((text) => ({
        model: `models/${modelId}`,
        content: { parts: [{ text: String(text) }] },
        ...(taskType && { taskType }),
        ...(title && { title }),
        ...(outputDimensionality && { outputDimensionality }),
      }));
      const data = await this._post(await this._modelUrl(modelId, 'batchEmbedContents'), { requests }, 'Gemini API error');
      for (const item of data.embeddings || []) vectors.push(item.values || []);
    }
    return vectors;
  }

  // ------------------------------------------------------------------
  // Files API (Gemini Developer API only)
  // ------------------------------------------------------------------

  _developerApiOnly(feature) {
    if (this.vertex) {
      throw new GoogleAIError(`${feature} is only available on the Gemini Developer API. On Vertex AI send files inline (mediaPart) or as gs:// URIs.`);
    }
  }

  _fileUrl(name) {
    const file = String(name).startsWith('files/') ? name : `files/${name}`;
    return `${this.baseUrl || this._devApiBase}/${file}`;
  }

  /**
   * Upload a file (a path, or bytes with { mimeType }) with the resumable Files API and return the file
   * ({ name, uri, mimeType, state, ... }). Videos are PROCESSING at first: use waitForFileActive before asking about them.
   */
  async uploadFile(source, { displayName = null, mimeType = null } = {}) {
    this._developerApiOnly('The Files API');
    let data;
    let type = mimeType;
    let name = displayName;
    if (typeof source === 'string') {
      const fs = require('fs');
      if (!IS_NODE || !fs.existsSync(source)) throw new Error(`File not found: ${source}`);
      data = fs.readFileSync(source);
      type = type || knownMimeType(source) || 'application/octet-stream';
      name = name || require('path').basename(source);
    } else {
      data = toBuffer(source);
      if (!type) throw new Error('mimeType is required when uploading bytes');
    }
    const fetch = require('cross-fetch');
    const credentials = await this._credentialHeaders();
    const start = await fetch(this._devUploadBase, {
      method: 'POST',
      headers: {
        ...credentials,
        'Content-Type': 'application/json',
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Command': 'start',
        'X-Goog-Upload-Header-Content-Length': String(data.length),
        'X-Goog-Upload-Header-Content-Type': type,
      },
      body: JSON.stringify({ file: { display_name: name || 'upload' } }),
    });
    if (!start.ok) {
      const error = Object.assign(new Error(`HTTP error ${start.status}: ${await start.text().catch(() => '')}`), { status: start.status });
      throw this._apiError('File upload error', error);
    }
    const uploadUrl = start.headers.get('x-goog-upload-url');
    if (!uploadUrl) throw new GoogleAIError('File upload error: the upload URL is missing from the response headers');
    const upload = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Length': String(data.length), 'X-Goog-Upload-Offset': '0', 'X-Goog-Upload-Command': 'upload, finalize' },
      body: data,
    });
    const text = await upload.text();
    if (!upload.ok) throw this._apiError('File upload error', Object.assign(new Error(`HTTP error ${upload.status}: ${text}`), { status: upload.status }));
    const result = JSON.parse(text);
    return result.file || result;
  }

  async getFile(name) {
    this._developerApiOnly('The Files API');
    return this._get(this._fileUrl(name), 'Get file error');
  }

  async listFiles({ pageSize = null, pageToken = null } = {}) {
    this._developerApiOnly('The Files API');
    return this._get(`${this.baseUrl || this._devApiBase}/files${GeminiAIWrapper._query({ pageSize, pageToken })}`, 'List files error');
  }

  async deleteFile(name) {
    this._developerApiOnly('The Files API');
    return this._delete(this._fileUrl(name), 'Delete file error');
  }

  /** Wait until an uploaded file leaves PROCESSING; returns the file, throws if it FAILED or the wait times out. */
  async waitForFileActive(name, { maxWaitMs = 300000, pollMs = 3000 } = {}) {
    const started = Date.now();
    while (Date.now() - started < maxWaitMs) {
      const file = await this.getFile(typeof name === 'object' ? name.name : name);
      if (file.state === 'ACTIVE' || !file.state) return file;
      if (file.state === 'FAILED') throw new GoogleAIError(`File processing failed: ${JSON.stringify(file.error || {})}`);
      await sleep(pollMs);
    }
    throw new Error(`The file was not ready within ${Math.round(maxWaitMs / 1000)} seconds`);
  }

  // ------------------------------------------------------------------
  // Models, context caching and Agent Engine
  // ------------------------------------------------------------------

  /** List models. On Vertex AI this lists Google publisher models and needs OAuth; use modelCatalog() offline. */
  async listModels({ pageSize = null, pageToken = null } = {}) {
    const query = GeminiAIWrapper._query({ pageSize, pageToken });
    const url = this.vertex
      ? `${this.baseUrl || `${this._vertexHost(null)}/${this.apiVersion}`}/publishers/google/models${query}`
      : `${this.baseUrl || this._devApiBase}/models${query}`;
    return this._get(url, 'List models error');
  }

  /** Known Vertex AI model ids by capability (from config). */
  static modelCatalog() {
    return JSON.parse(JSON.stringify(config.url.gemini.vertex.catalog));
  }

  async _cacheUrl(name = null, location = null) {
    if (this.vertex) {
      if (name && name.startsWith('projects/')) return this._nameUrl(name);
      const project = await this._requireProject('Context caching');
      const path = name ? `cachedContents/${name.split('/').pop()}` : 'cachedContents';
      return this._vertexProjectUrl(project, location || this.location || 'global', path);
    }
    const root = this.baseUrl || this._devApiBase;
    if (name) return `${root}/${name.startsWith('cachedContents/') ? name : `cachedContents/${name}`}`;
    return `${root}/cachedContents`;
  }

  /**
   * Cache a large prompt prefix (documents, video, a long system instruction) and reuse it with
   * generateContent({ cachedContent: cache.name, contents }). Google enforces a minimum size; the generate call
   * must use the same model. Vertex AI needs a project and OAuth.
   */
  async createCachedContent(model, contents, { systemInstruction = null, ttl = '3600s', displayName = null, tools = null, toolConfig = null, location = null } = {}) {
    const body = this._prepareBody({ contents });
    if (this.vertex) {
      const project = await this._requireProject('Context caching');
      const modelPath = GeminiAIWrapper._vertexModelPath(model);
      body.model = modelPath.startsWith('projects/') ? modelPath : `projects/${project}/locations/${location || this.location || 'global'}/${modelPath}`;
    } else {
      body.model = this._modelPath(model);
    }
    if (systemInstruction) body.systemInstruction = typeof systemInstruction === 'string' ? { parts: [{ text: systemInstruction }] } : systemInstruction;
    if (ttl) body.ttl = ttl;
    if (displayName) body.displayName = displayName;
    if (tools) body.tools = tools;
    if (toolConfig) body.toolConfig = toolConfig;
    return this._post(await this._cacheUrl(null, location), body, 'Context cache error');
  }

  async getCachedContent(name) {
    return this._get(await this._cacheUrl(name), 'Context cache error');
  }

  async listCachedContents({ pageSize = null, pageToken = null, location = null } = {}) {
    return this._get(`${await this._cacheUrl(null, location)}${GeminiAIWrapper._query({ pageSize, pageToken })}`, 'Context cache error');
  }

  async deleteCachedContent(name) {
    return this._delete(await this._cacheUrl(name), 'Context cache error');
  }

  async _agentEngineName(name, location = null) {
    if (name.startsWith('projects/')) return name;
    const project = await this._requireProject('Agent Engine');
    return `projects/${project}/locations/${this._locationFor('agent_engine', location) || 'us-central1'}/reasoningEngines/${name}`;
  }

  /** Agents deployed to Vertex AI Agent Engine in the project. */
  async listAgentEngines({ location = null, pageSize = null, pageToken = null, filter = null } = {}) {
    const project = await this._requireProject('Agent Engine');
    const url = this._vertexProjectUrl(project, this._locationFor('agent_engine', location) || 'us-central1', 'reasoningEngines');
    return this._get(`${url}${GeminiAIWrapper._query({ pageSize, pageToken, filter })}`, 'Agent Engine error');
  }

  async getAgentEngine(name, { location = null } = {}) {
    return this._get(this._nameUrl(await this._agentEngineName(name, location)), 'Agent Engine error');
  }

  /** Call a deployed agent's query method: returns { output }. Input keys depend on the agent (ADK: message, user_id). */
  async queryAgentEngine(name, input = {}, { classMethod = null, location = null } = {}) {
    const url = `${this._nameUrl(await this._agentEngineName(name, location))}:query`;
    return this._post(url, { input: input || {}, ...(classMethod && { classMethod }) }, 'Agent Engine error');
  }

  /** Call a deployed agent's streaming method and yield each event (object, or text when not JSON). */
  async* streamQueryAgentEngine(name, input = {}, { classMethod = 'stream_query', location = null } = {}) {
    const url = `${this._nameUrl(await this._agentEngineName(name, location))}:streamQuery?alt=sse`;
    const stream = await this._post(url, { input: input || {}, ...(classMethod && { classMethod }) }, 'Agent Engine error', { responseType: 'stream' });
    let buffer = '';
    const parse = (line) => {
      const text = line.startsWith('data:') ? line.slice(5).trim() : line.trim();
      if (!text) return undefined;
      try {
        return JSON.parse(text);
      } catch (error) {
        return text;
      }
    };
    for await (const chunk of readStreamChunks(stream)) {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop();
      for (const line of lines) {
        const event = parse(line);
        if (event !== undefined) yield event;
      }
    }
    const last = parse(buffer);
    if (last !== undefined) yield last;
  }

  // ------------------------------------------------------------------
  // Grounding tools
  // ------------------------------------------------------------------

  /** Google Search grounding tool: tools: [GeminiAIWrapper.googleSearchTool()]. */
  static googleSearchTool() {
    return { googleSearch: {} };
  }

  /** Vertex AI RAG Engine grounding tool for one or more corpora (names or ids with projectId). */
  ragTool(corpora, { topK = 5, vectorDistanceThreshold = null, location = null } = {}) {
    const list = Array.isArray(corpora) ? corpora : [corpora];
    const ragResources = list.map((corpus) => ({
      ragCorpus: String(corpus).startsWith('projects/') ? corpus
        : `projects/${this.projectId}/locations/${location || this._locationFor('rag') || 'us-central1'}/ragCorpora/${corpus}`,
    }));
    return {
      retrieval: {
        vertexRagStore: {
          ragResources,
          ragRetrievalConfig: { topK, ...(vectorDistanceThreshold !== null && { filter: { vectorDistanceThreshold } }) },
        },
      },
    };
  }

  /** Vertex AI Search grounding tool for a data store (full resource name). */
  static vertexAISearchTool(datastore) {
    return { retrieval: { vertexAiSearch: { datastore } } };
  }

  // ------------------------------------------------------------------
  // Live API (bidirectional streaming over a websocket)
  // ------------------------------------------------------------------

  async _liveEndpoint(model = null, location = null) {
    const target = model || this._defaultModel('live');
    if (this.vertex) {
      const project = await this._requireProject('The Live API');
      const liveLocation = this._locationFor('live', location) || 'us-central1';
      const host = this._vertexHost(liveLocation).replace(/^https:\/\//, 'wss://');
      const url = `${host}/ws/google.cloud.aiplatform.${this.apiVersion}.LlmBidiService/BidiGenerateContent`;
      const modelPath = GeminiAIWrapper._vertexModelPath(target);
      const modelName = modelPath.startsWith('projects/') ? modelPath : `projects/${project}/locations/${liveLocation}/${modelPath}`;
      return { url, modelName, headers: await this._credentialHeaders() };
    }
    const host = /^https:\/\/[^/]+/.exec(this._devApiBase)[0].replace(/^https:\/\//, 'wss://');
    const url = `${host}/ws/google.ai.generativelanguage.${this.apiVersion}.GenerativeService.BidiGenerateContent`;
    // the Developer API documents the key as a query parameter for the websocket
    if (this.API_KEY) return { url: `${url}?key=${encodeURIComponent(this.API_KEY)}`, modelName: this._modelPath(target), headers: {} };
    return { url, modelName: this._modelPath(target), headers: await this._credentialHeaders() };
  }

  /**
   * Open a Live API session (voice or text, with tools) and return a GoogleAILiveSession after setup completes.
   * config is the setup message without `model`, e.g. { generationConfig: { responseModalities: ['AUDIO'] },
   * systemInstruction, outputAudioTranscription: {} }. Needs a WebSocket: Node 22+ has one built in; on older
   * Node pass { WebSocket: require('ws') } to the wrapper. Vertex AI needs projectId (Live models run in us-central1).
   */
  async liveConnect({ model = null, config: setupConfig = null, location = null } = {}) {
    const { url, modelName, headers } = await this._liveEndpoint(model, location);
    const setup = { model: modelName, ...camelize(setupConfig || {}) };
    setup.generationConfig = { responseModalities: ['AUDIO'], ...(setup.generationConfig || {}) };
    const WebSocketClass = this.WebSocket || (typeof globalThis !== 'undefined' ? globalThis.WebSocket : null);
    if (!WebSocketClass) {
      throw new GoogleAIError('The Live API needs a WebSocket: use Node 22+ or pass { WebSocket: require("ws") } to the wrapper.');
    }
    let socket;
    try {
      const isBrowser = typeof window !== 'undefined' && WebSocketClass === window.WebSocket;
      if (isBrowser) {
        // browsers cannot set headers; the Developer API URL already carries the key
        if (this.vertex) throw new Error('In the browser the Live API works with a Developer API key only.');
        socket = new WebSocketClass(url);
      } else {
        socket = Object.keys(headers).length ? new WebSocketClass(url, { headers }) : new WebSocketClass(url);
      }
    } catch (error) {
      throw new GoogleAIError(this._redact(`Live API connection error: ${error.message}`));
    }
    const session = new GoogleAILiveSession(socket);
    try {
      await session._opened();
      session.send({ setup });
      const first = await session._next();
      if (!first || first.setupComplete === undefined) {
        throw new GoogleAIError(this._redact(`Live API setup failed: ${JSON.stringify(first)}`));
      }
      session.setupResponse = first;
    } catch (error) {
      session.close();
      throw error instanceof GoogleAIError ? error : new GoogleAIError(this._redact(`Live API setup error: ${error.message}`));
    }
    return session;
  }

  /** One text turn over the Live API: { text, transcription, audio (Buffer, 24 kHz PCM), toolCalls, usage }. */
  async liveGenerate(text, { model = null, config: setupConfig = null, location = null } = {}) {
    const settings = camelize(setupConfig || {});
    const modalities = (settings.generationConfig && settings.generationConfig.responseModalities) || ['AUDIO'];
    if (modalities.includes('AUDIO') && settings.outputAudioTranscription === undefined) settings.outputAudioTranscription = {};
    const session = await this.liveConnect({ model, config: settings, location });
    try {
      session.sendText(text);
      return await session.receiveTurn();
    } finally {
      session.close();
    }
  }
}

/**
 * A multi-turn Gemini chat. The history keeps the model turns as returned, including thought signatures, which
 * Gemini 3 needs for multi-turn tool use and image editing. history is plain JSON: store it to resume later.
 */
class GoogleAIChatSession {
  constructor(wrapper, { model = null, systemInstruction = null, generationConfig = null, tools = null, toolConfig = null, safetySettings = null, cachedContent = null, history = null } = {}) {
    this.wrapper = wrapper;
    this.model = model || wrapper._defaultModel('chat');
    this.systemInstruction = systemInstruction;
    this.generationConfig = generationConfig;
    this.tools = tools;
    this.toolConfig = toolConfig;
    this.safetySettings = safetySettings;
    this.cachedContent = cachedContent;
    this.history = (history || []).map((content) => wrapper._content(content));
    this.lastResponse = null;
  }

  _body(userContent) {
    return this.wrapper._buildRequest(null, {
      systemInstruction: this.systemInstruction,
      generationConfig: this.generationConfig,
      tools: this.tools,
      toolConfig: this.toolConfig,
      safetySettings: this.safetySettings,
      cachedContent: this.cachedContent,
      history: [...this.history, userContent],
    });
  }

  _userContent(message, media, parts) {
    return { role: 'user', parts: parts || this.wrapper._toParts(message, media) };
  }

  /** Send a user turn and return the full response; the turn and the reply join the history. */
  async send(message = null, media = null, { parts = null } = {}) {
    const userContent = this._userContent(message, media, parts);
    const response = await this.wrapper.generateContent(this._body(userContent), false, this.model);
    this.lastResponse = response;
    const candidate = response.candidates && response.candidates[0];
    const modelContent = candidate && candidate.content;
    // a blocked or empty reply leaves the history unchanged, so it cannot block the next turn
    if (modelContent && Array.isArray(modelContent.parts) && modelContent.parts.length) {
      this.history.push(userContent, { role: 'model', ...modelContent });
    }
    return response;
  }

  /** Send a user turn and return only the reply text. */
  async sendText(message = null, media = null) {
    return GeminiAIWrapper.extractText(await this.send(message, media));
  }

  /** Return one tool result after the model asked for a function call. For several calls use send(null, null, { parts }). */
  async sendFunctionResponse(name, response, callId = null) {
    const functionResponse = { name, response, ...(callId && { id: callId }) };
    return this.send(null, null, { parts: [{ functionResponse }] });
  }

  /** Yield reply text chunks; the turn joins the history when the stream ends. lastResponse keeps the last chunk. */
  async* stream(message = null, media = null) {
    const userContent = this._userContent(message, media, null);
    const parts = [];
    let last = null;
    for await (const chunk of this.wrapper.streamGenerateContent(this._body(userContent), false, this.model)) {
      last = chunk;
      for (const part of GeminiAIWrapper._parts(chunk)) parts.push(part);
      const text = GeminiAIWrapper.extractText(chunk);
      if (text) yield text;
    }
    this.lastResponse = last;
    if (parts.length) this.history.push(userContent, { role: 'model', parts: GoogleAIChatSession._mergeTextParts(parts) });
  }

  static _mergeTextParts(parts) {
    const merged = [];
    for (const part of parts) {
      const plain = Object.keys(part).length === 1 && typeof part.text === 'string';
      const previous = merged[merged.length - 1];
      if (plain && previous && Object.keys(previous).length === 1 && typeof previous.text === 'string') {
        merged[merged.length - 1] = { text: previous.text + part.text };
      } else {
        merged.push({ ...part });
      }
    }
    return merged;
  }

  reset() {
    this.history = [];
    this.lastResponse = null;
  }
}

/** An open Live API session (from wrapper.liveConnect). Close it when done. */
class GoogleAILiveSession {
  constructor(socket) {
    this.socket = socket;
    this.setupResponse = null;
    this._queue = [];
    this._waiters = [];
    this._closed = false;
    this._error = null;
    const onMessage = async (event) => {
      try {
        let raw = event && event.data !== undefined ? event.data : event;
        if (raw && typeof raw !== 'string') {
          raw = typeof raw.text === 'function' ? await raw.text() : toBuffer(raw).toString('utf8');
        }
        this._push(JSON.parse(raw));
      } catch (error) {
        this._fail(error);
      }
    };
    const onClose = () => {
      this._closed = true;
      this._flush();
    };
    const onError = (event) => this._fail(new Error((event && event.message) || 'Live API websocket error'));
    if (typeof socket.addEventListener === 'function') {
      socket.addEventListener('message', onMessage);
      socket.addEventListener('close', onClose);
      socket.addEventListener('error', onError);
    } else {
      socket.on('message', (data) => onMessage({ data }));
      socket.on('close', onClose);
      socket.on('error', onError);
    }
  }

  _opened() {
    const OPEN = 1;
    if (this.socket.readyState === OPEN) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const done = () => resolve();
      const failed = (event) => reject(new Error((event && event.message) || 'could not open the websocket'));
      if (typeof this.socket.addEventListener === 'function') {
        this.socket.addEventListener('open', done, { once: true });
        this.socket.addEventListener('error', failed, { once: true });
      } else {
        this.socket.once('open', done);
        this.socket.once('error', failed);
      }
    });
  }

  _push(message) {
    const waiter = this._waiters.shift();
    if (waiter) waiter.resolve(message);
    else this._queue.push(message);
  }

  _fail(error) {
    this._error = error;
    this._flush();
  }

  _flush() {
    while (this._waiters.length) {
      const waiter = this._waiters.shift();
      if (this._error) waiter.reject(this._error);
      else waiter.resolve(null);
    }
  }

  // The next server message, or null when the socket closed.
  _next() {
    if (this._queue.length) return Promise.resolve(this._queue.shift());
    if (this._error) return Promise.reject(this._error);
    if (this._closed) return Promise.resolve(null);
    return new Promise((resolve, reject) => this._waiters.push({ resolve, reject }));
  }

  /** Send a raw client message. */
  send(message) {
    this.socket.send(JSON.stringify(message));
  }

  sendText(text, turnComplete = true) {
    this.send({ clientContent: { turns: [{ role: 'user', parts: [{ text }] }], turnComplete } });
  }

  /** Stream a chunk of microphone audio (16-bit PCM, 16 kHz by default). */
  sendAudio(data, mimeType = 'audio/pcm;rate=16000') {
    const encoded = typeof data === 'string' ? data : toBuffer(data).toString('base64');
    this.send({ realtimeInput: { audio: { data: encoded, mimeType } } });
  }

  sendAudioStreamEnd() {
    this.send({ realtimeInput: { audioStreamEnd: true } });
  }

  /** functionResponses: [{ id, name, response }]. */
  sendToolResponse(functionResponses) {
    this.send({ toolResponse: { functionResponses } });
  }

  /** Every server message, until the socket closes. */
  async* receive() {
    while (true) {
      const message = await this._next();
      if (message === null) return;
      yield message;
    }
  }

  /** Collect messages until the model finishes its turn or asks for a tool call. */
  async receiveTurn() {
    const result = { text: '', transcription: '', inputTranscription: '', audio: Buffer.alloc(0), audioMimeType: null, toolCalls: [], usage: null, messages: 0 };
    const audioChunks = [];
    let received = false;
    for await (const message of this.receive()) {
      result.messages += 1;
      if (message.usageMetadata) result.usage = message.usageMetadata;
      if (message.toolCall) {
        result.toolCalls.push(...(message.toolCall.functionCalls || []));
        // the turn that asked for the tool still sends its own turnComplete later
        this._skipCompletion = true;
        break;
      }
      const content = message.serverContent || {};
      if (this._skipCompletion && !received && !content.modelTurn && !content.outputTranscription) {
        if (content.turnComplete) this._skipCompletion = false;
        continue;
      }
      received = true;
      this._skipCompletion = false;
      for (const part of (content.modelTurn && content.modelTurn.parts) || []) {
        if (part.text && !part.thought) result.text += part.text;
        if (part.inlineData && part.inlineData.data) {
          audioChunks.push(Buffer.from(part.inlineData.data, 'base64'));
          result.audioMimeType = part.inlineData.mimeType;
        }
      }
      if (content.outputTranscription && content.outputTranscription.text) result.transcription += content.outputTranscription.text;
      if (content.inputTranscription && content.inputTranscription.text) result.inputTranscription += content.inputTranscription.text;
      if (content.turnComplete) break;
    }
    result.audio = Buffer.concat(audioChunks);
    return result;
  }

  close() {
    try {
      this.socket.close();
    } catch (error) {
      // already closed
    }
  }
}

module.exports = GeminiAIWrapper;
module.exports.GeminiAIWrapper = GeminiAIWrapper;
module.exports.GoogleAIError = GoogleAIError;
module.exports.GoogleAIChatSession = GoogleAIChatSession;
module.exports.GoogleAILiveSession = GoogleAILiveSession;
