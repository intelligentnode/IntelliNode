/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { newId } = require('./VectorStore');

/**
 * Where an Assistant keeps its conversations. Messages are { id, role: 'user' | 'assistant', content, createdAt,
 * metadata? }; conversations are { id, title, userId, createdAt, updatedAt, metadata }.
 *
 * Implementations: MemoryChatHistory (in process), FileChatHistory (JSON files, Node), FirestoreChatHistory (Google
 * Cloud Firestore). Write your own by extending ChatHistory and implementing the six methods.
 */
class ChatHistory {
  /** The last `limit` messages of a conversation, oldest first. */
  async getMessages() {
    throw new Error(`${this.constructor.name}.getMessages is not implemented.`);
  }

  /** Append messages; fills id and createdAt and updates the conversation's updatedAt. Returns the stored messages. */
  async addMessages() {
    throw new Error(`${this.constructor.name}.addMessages is not implemented.`);
  }

  async getConversation() {
    throw new Error(`${this.constructor.name}.getConversation is not implemented.`);
  }

  /** Create or update a conversation's fields (title, userId, metadata). */
  async saveConversation() {
    throw new Error(`${this.constructor.name}.saveConversation is not implemented.`);
  }

  /** Conversations, most recently updated first; { userId } keeps one user's. */
  async listConversations() {
    throw new Error(`${this.constructor.name}.listConversations is not implemented.`);
  }

  async deleteConversation() {
    throw new Error(`${this.constructor.name}.deleteConversation is not implemented.`);
  }

  /** Remove the last `count` messages (used to regenerate an answer). */
  async deleteLastMessages() {
    throw new Error(`${this.constructor.name}.deleteLastMessages is not implemented.`);
  }

  static _stamp(messages) {
    const now = new Date().toISOString();
    return (messages || []).map((message) => ({
      id: message.id || newId(),
      role: message.role,
      content: message.content === undefined || message.content === null ? '' : String(message.content),
      createdAt: message.createdAt || now,
      ...(message.metadata && Object.keys(message.metadata).length && { metadata: message.metadata }),
    }));
  }

  static _conversation(id, existing, fields = {}) {
    const now = new Date().toISOString();
    return {
      id,
      title: fields.title !== undefined ? fields.title : (existing && existing.title) || null,
      userId: fields.userId !== undefined ? fields.userId : (existing && existing.userId) || null,
      createdAt: (existing && existing.createdAt) || now,
      updatedAt: now,
      metadata: { ...((existing && existing.metadata) || {}), ...(fields.metadata || {}) },
    };
  }
}

/** Conversations in process memory (lost on restart). */
class MemoryChatHistory extends ChatHistory {
  constructor() {
    super();
    this.conversations = new Map();
  }

  _entry(id) {
    if (!this.conversations.has(id)) this.conversations.set(id, { conversation: ChatHistory._conversation(id, null), messages: [] });
    return this.conversations.get(id);
  }

  async getMessages(conversationId, { limit = null } = {}) {
    const entry = this.conversations.get(conversationId);
    if (!entry) return [];
    return limit ? entry.messages.slice(-limit) : [...entry.messages];
  }

  async addMessages(conversationId, messages) {
    const entry = this._entry(conversationId);
    const stamped = ChatHistory._stamp(messages);
    entry.messages.push(...stamped);
    entry.conversation = ChatHistory._conversation(conversationId, entry.conversation);
    return stamped;
  }

  async getConversation(conversationId) {
    const entry = this.conversations.get(conversationId);
    return entry ? { ...entry.conversation, messageCount: entry.messages.length } : null;
  }

  async saveConversation(conversation) {
    const entry = this._entry(conversation.id);
    entry.conversation = ChatHistory._conversation(conversation.id, entry.conversation, conversation);
    return entry.conversation;
  }

  async listConversations({ userId = null, limit = 50 } = {}) {
    return [...this.conversations.values()]
      .map((entry) => entry.conversation)
      .filter((conversation) => !userId || conversation.userId === userId)
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
      .slice(0, limit);
  }

  async deleteConversation(conversationId) {
    this.conversations.delete(conversationId);
  }

  async deleteLastMessages(conversationId, count = 1) {
    const entry = this.conversations.get(conversationId);
    if (entry) entry.messages.splice(Math.max(0, entry.messages.length - count), count);
  }
}

/**
 * Conversations as JSON files in a directory (Node only), one file per conversation. Good for local apps,
 * desktop tools and development; use FirestoreChatHistory (or your database) for multi-user servers.
 */
class FileChatHistory extends ChatHistory {
  constructor({ dir = '.intellinode/conversations' } = {}) {
    super();
    this.dir = dir;
  }

  _file(conversationId) {
    const safe = String(conversationId).replace(/[^A-Za-z0-9_.-]/g, '_');
    if (!safe || safe === '.' || safe === '..') throw new Error(`Invalid conversation id '${conversationId}'.`);
    return require('path').join(this.dir, `${safe}.json`);
  }

  async _read(conversationId) {
    try {
      return JSON.parse(await require('fs').promises.readFile(this._file(conversationId), 'utf8'));
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  }

  async _write(conversationId, data) {
    const fs = require('fs');
    await fs.promises.mkdir(this.dir, { recursive: true });
    const file = this._file(conversationId);
    await fs.promises.writeFile(`${file}.tmp`, JSON.stringify(data, null, 2));
    await fs.promises.rename(`${file}.tmp`, file);
  }

  async getMessages(conversationId, { limit = null } = {}) {
    const data = await this._read(conversationId);
    if (!data) return [];
    return limit ? data.messages.slice(-limit) : data.messages;
  }

  async addMessages(conversationId, messages) {
    const data = (await this._read(conversationId)) || { conversation: null, messages: [] };
    const stamped = ChatHistory._stamp(messages);
    data.messages.push(...stamped);
    data.conversation = ChatHistory._conversation(conversationId, data.conversation);
    await this._write(conversationId, data);
    return stamped;
  }

  async getConversation(conversationId) {
    const data = await this._read(conversationId);
    return data ? { ...data.conversation, messageCount: data.messages.length } : null;
  }

  async saveConversation(conversation) {
    const data = (await this._read(conversation.id)) || { conversation: null, messages: [] };
    data.conversation = ChatHistory._conversation(conversation.id, data.conversation, conversation);
    await this._write(conversation.id, data);
    return data.conversation;
  }

  async listConversations({ userId = null, limit = 50 } = {}) {
    const fs = require('fs');
    let files;
    try {
      files = (await fs.promises.readdir(this.dir)).filter((file) => file.endsWith('.json'));
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
    const conversations = [];
    for (const file of files) {
      try {
        const data = JSON.parse(await fs.promises.readFile(require('path').join(this.dir, file), 'utf8'));
        if (data.conversation && (!userId || data.conversation.userId === userId)) conversations.push(data.conversation);
      } catch (error) {
        // skip a file that is being written or is not a conversation
      }
    }
    return conversations.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))).slice(0, limit);
  }

  async deleteConversation(conversationId) {
    await require('fs').promises.rm(this._file(conversationId), { force: true });
  }

  async deleteLastMessages(conversationId, count = 1) {
    const data = await this._read(conversationId);
    if (!data) return;
    data.messages.splice(Math.max(0, data.messages.length - count), count);
    await this._write(conversationId, data);
  }
}

module.exports = { ChatHistory, MemoryChatHistory, FileChatHistory };
