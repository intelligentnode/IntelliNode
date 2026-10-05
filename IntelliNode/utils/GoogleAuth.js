/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('./FetchClient');

const CLOUD_SCOPE = 'https://www.googleapis.com/auth/cloud-platform';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const METADATA_TOKEN_URL = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';
const METADATA_PROJECT_URL = 'http://metadata.google.internal/computeMetadata/v1/project/project-id';
// refresh a token this long before it expires
const EXPIRY_MARGIN_MS = 60000;

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Google OAuth access tokens without the google-auth-library dependency (Node only), for Vertex AI features that
 * reject API keys (RAG Engine, Vector Search, Firestore, context caching, model listing) and for organizations that
 * block API keys.
 *
 * Sources, in order:
 * 1. accessToken: a token string, or a function (sync or async) that returns one.
 * 2. credentials: a service account or authorized_user JSON object, or the path to one.
 * 3. Application Default Credentials: GOOGLE_APPLICATION_CREDENTIALS, then the gcloud file written by
 *    `gcloud auth application-default login`, then the metadata server (Cloud Run, GKE, Compute Engine).
 */
class GoogleAuth {
  constructor({ accessToken = null, credentials = null, scopes = [CLOUD_SCOPE], quotaProjectId = null, timeout = 30000 } = {}) {
    this.accessToken = accessToken;
    this.credentialsInput = credentials;
    this.scopes = Array.isArray(scopes) ? scopes : [scopes];
    this.quotaProjectId = quotaProjectId;
    this.client = new FetchClient({ timeout, retries: 1 });
    this.cached = null;
    this.projectId = null;
    this._credentials = undefined;
  }

  /** A valid access token (cached until shortly before it expires). */
  async getAccessToken() {
    if (this.accessToken) {
      const token = typeof this.accessToken === 'function' ? await this.accessToken() : this.accessToken;
      if (!token) throw new Error('The accessToken function returned no token.');
      return String(token).trim();
    }
    if (this.cached && this.cached.expiresAt - EXPIRY_MARGIN_MS > Date.now()) return this.cached.token;
    const credentials = await this._loadCredentials();
    let result;
    if (credentials && credentials.type === 'service_account') {
      result = await this._serviceAccountToken(credentials);
    } else if (credentials && credentials.type === 'authorized_user') {
      result = await this._refreshToken(credentials);
    } else if (credentials) {
      throw new Error(`Unsupported Google credentials type '${credentials.type}'. Use a service account or authorized_user file.`);
    } else {
      result = await this._metadataToken();
    }
    this.cached = { token: result.access_token, expiresAt: Date.now() + (Number(result.expires_in) || 3600) * 1000 };
    return this.cached.token;
  }

  /** { Authorization: 'Bearer ...' } plus x-goog-user-project when a quota project is known. */
  async getHeaders() {
    const headers = { Authorization: `Bearer ${await this.getAccessToken()}` };
    const credentials = this._credentials || null;
    const quotaProject = this.quotaProjectId || (credentials && credentials.quota_project_id);
    if (quotaProject) headers['x-goog-user-project'] = quotaProject;
    return headers;
  }

  /** The project of the credentials (service account project_id, GOOGLE_CLOUD_PROJECT or the metadata server), or null. */
  async getProjectId() {
    if (this.projectId) return this.projectId;
    const credentials = this.accessToken ? null : await this._loadCredentials().catch(() => null);
    const fromEnv = typeof process !== 'undefined' && process.env
      ? process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT : null;
    this.projectId = (credentials && (credentials.project_id || credentials.quota_project_id)) || fromEnv || null;
    if (!this.projectId && !this.accessToken && !credentials) {
      try {
        this.projectId = String(await this.client.get(METADATA_PROJECT_URL, {
          headers: { 'Metadata-Flavor': 'Google' }, responseType: 'text', timeout: 3000, retries: 0,
        })).trim() || null;
      } catch (error) {
        this.projectId = null;
      }
    }
    return this.projectId;
  }

  async _loadCredentials() {
    if (this._credentials !== undefined) return this._credentials;
    let credentials = this.credentialsInput;
    if (typeof credentials === 'string') {
      credentials = JSON.parse(require('fs').readFileSync(credentials, 'utf8'));
    } else if (!credentials) {
      credentials = GoogleAuth._defaultCredentialsFile();
    }
    this._credentials = credentials || null;
    return this._credentials;
  }

  // GOOGLE_APPLICATION_CREDENTIALS, then the gcloud application default credentials file.
  static _defaultCredentialsFile() {
    if (typeof process === 'undefined' || !process.env) return null;
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    if (!fs.existsSync) return null;
    const candidates = [];
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) candidates.push(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    const configDir = process.env.CLOUDSDK_CONFIG
      || (process.platform === 'win32' ? path.join(process.env.APPDATA || '', 'gcloud') : path.join(os.homedir(), '.config', 'gcloud'));
    candidates.push(path.join(configDir, 'application_default_credentials.json'));
    for (const file of candidates) {
      if (file && fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    return null;
  }

  async _serviceAccountToken(credentials) {
    const crypto = require('crypto');
    const now = Math.floor(Date.now() / 1000);
    const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT', ...(credentials.private_key_id && { kid: credentials.private_key_id }) }));
    const claims = base64url(JSON.stringify({
      iss: credentials.client_email,
      scope: this.scopes.join(' '),
      aud: credentials.token_uri || TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }));
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(`${header}.${claims}`);
    const signature = signer.sign(credentials.private_key).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    return this._tokenRequest(credentials.token_uri || TOKEN_URL, {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claims}.${signature}`,
    });
  }

  async _refreshToken(credentials) {
    return this._tokenRequest(TOKEN_URL, {
      grant_type: 'refresh_token',
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      refresh_token: credentials.refresh_token,
    });
  }

  async _tokenRequest(url, form) {
    const body = Object.entries(form).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    try {
      // FetchClient sends JSON, so the form body goes through fetch directly
      const fetch = require('cross-fetch');
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      const text = await response.text();
      if (!response.ok) {
        const error = new Error(`Google token error ${response.status}: ${text.slice(0, 300)}`);
        error.status = response.status;
        throw error;
      }
      return JSON.parse(text);
    } catch (error) {
      if (error.status) {
        error.message += ' (run `gcloud auth application-default login` again, or check the service account key)';
      }
      throw error;
    }
  }

  async _metadataToken() {
    try {
      const scopes = encodeURIComponent(this.scopes.join(','));
      return await this.client.get(`${METADATA_TOKEN_URL}?scopes=${scopes}`, {
        headers: { 'Metadata-Flavor': 'Google' }, timeout: 3000, retries: 0,
      });
    } catch (error) {
      throw new Error('No Google credentials found. Pass an API key or accessToken, set GOOGLE_APPLICATION_CREDENTIALS '
        + 'to a service account key file, or run `gcloud auth application-default login`.');
    }
  }
}

GoogleAuth.CLOUD_SCOPE = CLOUD_SCOPE;

module.exports = GoogleAuth;
