/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
// API: Firestore REST v1 (documents:commit, runQuery, runAggregationQuery)
const { ChatHistory } = require('./ChatHistory');
const { GoogleCloudService, Firestore } = require('./GoogleCloud');

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';
const BATCH = 500;

/**
 * Conversations in Google Cloud Firestore, for multi-user Gemini / ChatGPT-style apps:
 *   <collection>/{conversationId}                 { title, userId, createdAt, updatedAt, metadata }
 *   <collection>/{conversationId}/messages/{id}   { role, content, createdAt, seq, metadata }
 *
 * No composite index is needed. Credentials: OAuth (accessToken, a service account, or
 * `gcloud auth application-default login`).
 */
class FirestoreChatHistory extends ChatHistory {
  /** @param {object} options - { projectId, database = '(default)', collection = 'conversations', accessToken, credentials }. */
  constructor(options = {}) {
    super();
    this.service = new GoogleCloudService({ ...options, label: 'Firestore' });
    this.client = this.service.client;
    this.database = options.database || '(default)';
    this.collection = options.collection || 'conversations';
  }

  async _root() {
    return `projects/${await this.service._project()}/databases/${this.database}/documents`;
  }

  async _conversationName(conversationId) {
    return `${await this._root()}/${this.collection}/${Firestore.docId(conversationId)}`;
  }

  async _commit(writes) {
    const url = `${FIRESTORE_BASE}/${await this._root()}:commit`;
    for (let start = 0; start < writes.length; start += BATCH) {
      await this.service._request('POST', url, { writes: writes.slice(start, start + BATCH) });
    }
  }

  async _runQuery(parent, structuredQuery) {
    const rows = await this.service._request('POST', `${FIRESTORE_BASE}/${parent}:runQuery`, { structuredQuery });
    return (Array.isArray(rows) ? rows : [rows]).filter((row) => row && row.document).map((row) => row.document);
  }

  static _message(document) {
    const data = Firestore.fromFields(document.fields);
    return {
      id: data.id || decodeURIComponent(document.name.split('/').pop()),
      role: data.role,
      content: data.content || '',
      createdAt: data.createdAt,
      ...(data.metadata && Object.keys(data.metadata).length && { metadata: data.metadata }),
    };
  }

  // Newest messages first: [{ name, ...message }].
  async _latest(conversationId, limit) {
    const documents = await this._runQuery(await this._conversationName(conversationId), {
      from: [{ collectionId: 'messages' }],
      orderBy: [{ field: { fieldPath: 'seq' }, direction: 'DESCENDING' }],
      ...(limit && { limit }),
    });
    return documents.map((document) => ({ name: document.name, ...FirestoreChatHistory._message(document) }));
  }

  async getMessages(conversationId, { limit = null } = {}) {
    const latest = await this._latest(conversationId, limit);
    return latest.reverse().map(({ name, ...message }) => message);
  }

  async addMessages(conversationId, messages) {
    const conversationName = await this._conversationName(conversationId);
    const stamped = ChatHistory._stamp(messages);
    const base = Date.now() * 100;
    const writes = stamped.map((message, index) => ({
      update: {
        name: `${conversationName}/messages/${Firestore.docId(message.id)}`,
        fields: Firestore.toFields({ ...message, seq: base + index }),
      },
    }));
    // touching updatedAt only (the conversation keeps its other fields)
    writes.push({
      update: { name: conversationName, fields: Firestore.toFields({ updatedAt: new Date().toISOString() }) },
      updateMask: { fieldPaths: ['updatedAt'] },
    });
    await this._commit(writes);
    return stamped;
  }

  async getConversation(conversationId) {
    const name = await this._conversationName(conversationId);
    let document;
    try {
      document = await this.service._request('GET', `${FIRESTORE_BASE}/${name}`);
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
    const data = Firestore.fromFields(document.fields);
    const count = await this.service._request('POST', `${FIRESTORE_BASE}/${name}:runAggregationQuery`, {
      structuredAggregationQuery: {
        structuredQuery: { from: [{ collectionId: 'messages' }] },
        aggregations: [{ alias: 'count', count: {} }],
      },
    }).catch(() => null);
    const aggregate = Array.isArray(count) && count[0] && count[0].result && count[0].result.aggregateFields;
    return {
      id: conversationId,
      title: data.title || null,
      userId: data.userId || null,
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null,
      metadata: data.metadata || {},
      ...(aggregate && aggregate.count && { messageCount: Number(Firestore.fromValue(aggregate.count)) }),
    };
  }

  async saveConversation(conversation) {
    const existing = await this.getConversation(conversation.id);
    const merged = ChatHistory._conversation(conversation.id, existing, conversation);
    const { id, ...fields } = merged;
    await this._commit([{ update: { name: await this._conversationName(conversation.id), fields: Firestore.toFields(fields) } }]);
    return merged;
  }

  async listConversations({ userId = null, limit = 50 } = {}) {
    const root = await this._root();
    // userId equality without orderBy needs no composite index; sorting happens here
    const documents = await this._runQuery(root, {
      from: [{ collectionId: this.collection }],
      ...(userId
        ? { where: Firestore.where({ userId }), limit: 500 }
        : { orderBy: [{ field: { fieldPath: 'updatedAt' }, direction: 'DESCENDING' }], limit }),
    });
    return documents
      .map((document) => {
        const data = Firestore.fromFields(document.fields);
        return {
          id: decodeURIComponent(document.name.split('/').pop()),
          title: data.title || null,
          userId: data.userId || null,
          createdAt: data.createdAt || null,
          updatedAt: data.updatedAt || null,
          metadata: data.metadata || {},
        };
      })
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
      .slice(0, limit);
  }

  async deleteConversation(conversationId) {
    const latest = await this._latest(conversationId, null);
    const writes = latest.map((message) => ({ delete: message.name }));
    writes.push({ delete: await this._conversationName(conversationId) });
    await this._commit(writes);
  }

  async deleteLastMessages(conversationId, count = 1) {
    const latest = await this._latest(conversationId, count);
    if (latest.length) await this._commit(latest.map((message) => ({ delete: message.name })));
  }
}

module.exports = { FirestoreChatHistory };
