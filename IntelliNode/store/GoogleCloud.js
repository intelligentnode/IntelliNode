/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FetchClient = require('../utils/FetchClient');
const connHelper = require('../utils/ConnHelper');

/**
 * Shared plumbing for the Google Cloud stores (Firestore, RAG Engine, Vector Search): OAuth headers and one
 * FetchClient. These APIs reject API keys, so credentials come from an access token, a service account or
 * Application Default Credentials (`gcloud auth application-default login`), see utils/GoogleAuth.js.
 */
class GoogleCloudService {
  constructor({ projectId = null, accessToken = null, credentials = null, quotaProjectId = null, timeout, retries, label = 'Google Cloud' } = {}) {
    this.projectId = projectId || (typeof process !== 'undefined' && process.env ? process.env.GOOGLE_CLOUD_PROJECT || null : null);
    this.label = label;
    this.client = new FetchClient({ headers: { 'Content-Type': 'application/json' }, timeout, retries });
    this._accessToken = accessToken;
    this._credentials = credentials;
    this._quotaProjectId = quotaProjectId;
    this._auth = null;
  }

  async _headers() {
    if (this._accessToken) {
      const token = typeof this._accessToken === 'function' ? await this._accessToken() : this._accessToken;
      return { Authorization: `Bearer ${token}`, ...(this._quotaProjectId && { 'x-goog-user-project': this._quotaProjectId }) };
    }
    return this._getAuth().getHeaders();
  }

  _getAuth() {
    if (!this._auth) {
      const GoogleAuth = require('../utils/GoogleAuth');
      if (typeof GoogleAuth !== 'function') throw new Error(`${this.label} needs an accessToken in the browser.`);
      this._auth = new GoogleAuth({ credentials: this._credentials, quotaProjectId: this._quotaProjectId });
    }
    return this._auth;
  }

  async _project() {
    if (this.projectId) return this.projectId;
    if (!this._accessToken) this.projectId = await this._getAuth().getProjectId();
    if (!this.projectId) throw new Error(`${this.label} needs a projectId (or GOOGLE_CLOUD_PROJECT).`);
    return this.projectId;
  }

  async _request(method, url, body, extra = {}) {
    try {
      const headers = { ...(await this._headers()), ...(extra.headers || {}) };
      if (method === 'GET') return await this.client.get(url, { ...extra, headers });
      if (method === 'POST') return await this.client.post(url, body, { ...extra, headers });
      const text = await this.client.request(method, url, body, { ...extra, headers, responseType: 'text' });
      return text && String(text).trim() ? JSON.parse(text) : {};
    } catch (error) {
      const wrapped = connHelper.wrapError(error);
      wrapped.message = `${this.label} error: ${wrapped.message}`;
      throw wrapped;
    }
  }

  /** Poll a long-running operation until it is done; returns its response (or throws its error). */
  async waitForOperation(operation, operationUrl, { maxWaitMs = 600000, pollMs = 3000 } = {}) {
    let current = operation;
    const started = Date.now();
    while (!current.done) {
      if (Date.now() - started > maxWaitMs) throw new Error(`${this.label}: operation ${current.name} did not finish in time.`);
      await new Promise((resolve) => setTimeout(resolve, pollMs));
      current = await this._request('GET', operationUrl(current.name));
    }
    if (current.error) throw new Error(`${this.label} operation failed: ${JSON.stringify(current.error)}`);
    return current.response || current;
  }
}

// Firestore REST values <-> JavaScript values. Vectors use the map form the Firestore SDKs write.
const Firestore = {
  toValue(value) {
    if (value === null || value === undefined) return { nullValue: null };
    if (value instanceof FirestoreVector) {
      return { mapValue: { fields: { __type__: { stringValue: '__vector__' }, value: { arrayValue: { values: value.values.map((v) => ({ doubleValue: v })) } } } } };
    }
    if (typeof value === 'boolean') return { booleanValue: value };
    if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
    if (typeof value === 'string') return { stringValue: value };
    if (value instanceof Date) return { timestampValue: value.toISOString() };
    if (Array.isArray(value)) return { arrayValue: { values: value.map((item) => Firestore.toValue(item)) } };
    if (typeof value === 'object') return { mapValue: { fields: Firestore.toFields(value) } };
    return { stringValue: String(value) };
  },

  toFields(object) {
    const fields = {};
    for (const [key, value] of Object.entries(object || {})) {
      if (value !== undefined) fields[key] = Firestore.toValue(value);
    }
    return fields;
  },

  fromValue(value) {
    if (!value || typeof value !== 'object') return null;
    if ('nullValue' in value) return null;
    if ('booleanValue' in value) return value.booleanValue;
    if ('integerValue' in value) return Number(value.integerValue);
    if ('doubleValue' in value) return Number(value.doubleValue);
    if ('stringValue' in value) return value.stringValue;
    if ('timestampValue' in value) return value.timestampValue;
    if ('arrayValue' in value) return (value.arrayValue.values || []).map((item) => Firestore.fromValue(item));
    if ('mapValue' in value) {
      const fields = value.mapValue.fields || {};
      if (fields.__type__ && fields.__type__.stringValue === '__vector__') return Firestore.fromValue(fields.value);
      return Firestore.fromFields(fields);
    }
    if ('referenceValue' in value) return value.referenceValue;
    if ('geoPointValue' in value) return value.geoPointValue;
    if ('bytesValue' in value) return value.bytesValue;
    return null;
  },

  fromFields(fields) {
    const result = {};
    for (const [key, value] of Object.entries(fields || {})) result[key] = Firestore.fromValue(value);
    return result;
  },

  // A document id from any record id: '/' is not allowed in Firestore ids.
  docId(id) {
    const encoded = encodeURIComponent(String(id)).replace(/\./g, '%2E');
    if (!encoded || /^__.*__$/.test(encoded)) throw new Error(`Invalid Firestore document id '${id}'.`);
    return encoded;
  },

  // field filter(s) for metadata equality: { key: value } -> where clause on metadata.key
  where(filter, prefix = '') {
    const filters = Object.entries(filter || {}).map(([key, expected]) => ({
      fieldFilter: {
        field: { fieldPath: `${prefix}${Firestore.fieldPath(key)}` },
        op: Array.isArray(expected) ? 'IN' : 'EQUAL',
        value: Array.isArray(expected) ? { arrayValue: { values: expected.map((item) => Firestore.toValue(item)) } } : Firestore.toValue(expected),
      },
    }));
    if (!filters.length) return null;
    return filters.length === 1 ? filters[0] : { compositeFilter: { op: 'AND', filters } };
  },

  // A field path segment: simple names as is, others in backticks.
  fieldPath(name) {
    return /^[A-Za-z_][A-Za-z_0-9]*$/.test(name) ? name : `\`${String(name).replace(/[`\\]/g, '\\$&')}\``;
  },
};

class FirestoreVector {
  constructor(values) {
    this.values = values;
  }
}

module.exports = { GoogleCloudService, Firestore, FirestoreVector };
