/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { Chatbot, SupportedChatModels } = require('./Chatbot');
const GeminiAIWrapper = require('../wrappers/GeminiAIWrapper');
const { MemoryChatHistory } = require('../store/ChatHistory');
const { newId } = require('../store/VectorStore');
const TextSplitter = require('../utils/TextSplitter');

const DEFAULT_SYSTEM = 'You are a helpful assistant. Answer clearly and concisely.';
const GEMINI_PROVIDERS = new Set([SupportedChatModels.GEMINI, SupportedChatModels.VERTEX]);
const TEXT_EXTENSIONS = new Set(['txt', 'md', 'markdown', 'csv', 'json', 'html', 'htm', 'xml', 'yaml', 'yml', 'js', 'ts', 'py', 'java', 'go', 'rs', 'sql', 'log']);
const MIME_BY_EXTENSION = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', pdf: 'application/pdf',
  mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', m4a: 'audio/mp4', mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm',
  txt: 'text/plain', md: 'text/markdown', csv: 'text/csv', html: 'text/html', json: 'application/json',
};

/**
 * A ready-made chat assistant for Gemini- or ChatGPT-style apps, on any Chatbot provider:
 * conversations kept in a ChatHistory (memory, JSON files, Firestore), answers grounded on your documents
 * (a knowledge VectorStore, with numbered references), long-term memory recalled from earlier conversations
 * (a memory VectorStore), attachments (images, PDFs, audio, video on Gemini), Google Search grounding on
 * Gemini / Vertex AI, tools, and streaming.
 *
 *   const assistant = new Assistant({ provider: 'vertex', apiKey: process.env.VERTEX_API_KEY,
 *     history: new FileChatHistory({ dir: './conversations' }),
 *     knowledge: new MemoryVectorStore({ embedder: { provider: 'vertex', apiKey } }) });
 *   await assistant.addDocuments([{ id: 'handbook', text: handbookText }]);
 *   const reply = await assistant.chat('What is the refund policy?', { conversationId: 'c1' });
 *   // reply: { conversationId, text, references, citations, memories, usage }
 */
class Assistant {
  /**
   * @param {object} settings
   * @param {string} settings.provider - any Chatbot provider: openai, anthropic, gemini, vertex, mistral, cohere,
   *   nvidia, vllm, ollama, openrouter, ...
   * @param {string} settings.apiKey
   * @param {string} settings.model - chat model; the provider default when omitted.
   * @param {object} settings.options - Chatbot options: Gemini / Vertex { projectId, location, accessToken },
   *   compatible providers { baseUrl }, request { timeout, retries }.
   * @param {string} settings.systemMessage
   * @param {ChatHistory} settings.history - conversation store (default MemoryChatHistory).
   * @param {VectorStore} settings.knowledge - documents to ground answers on (RAG).
   * @param {VectorStore} settings.memory - long-term memory: every exchange is stored and recalled later.
   * @param {number} settings.maxHistory - recent messages sent with each turn (default 20).
   * @param {number} settings.topK - knowledge chunks per turn (default 4).
   * @param {number} settings.memoryTopK - recalled memories per turn (default 3).
   * @param {number} settings.minScore - drop knowledge and memory matches below this similarity.
   * @param {boolean} settings.googleSearch - ground answers on Google Search (gemini and vertex providers).
   * @param {object|Array} settings.tools - a Chatbot.runTools tool set; turns then run the tool loop.
   * @param {boolean} settings.autoTitle - name a new conversation after its first exchange (one extra model call).
   */
  constructor({
    provider = SupportedChatModels.OPENAI,
    apiKey = null,
    model = null,
    options = {},
    systemMessage = DEFAULT_SYSTEM,
    history = null,
    knowledge = null,
    memory = null,
    maxHistory = 20,
    topK = 4,
    memoryTopK = 3,
    minScore = null,
    googleSearch = false,
    tools = null,
    maxToolSteps = 5,
    maxTokens = null,
    temperature = null,
    inputOptions = {},
    autoTitle = false,
  } = {}) {
    this.provider = provider;
    this.model = model;
    this.options = options || {};
    this.chatbot = new Chatbot(apiKey, provider, this.options.customProxyHelper || null, this.options);
    this.systemMessage = systemMessage;
    this.history = history || new MemoryChatHistory();
    this.knowledge = knowledge;
    this.memory = memory;
    this.maxHistory = maxHistory;
    this.topK = topK;
    this.memoryTopK = memoryTopK;
    this.minScore = minScore;
    this.googleSearch = googleSearch;
    this.tools = tools;
    this.maxToolSteps = maxToolSteps;
    this.maxTokens = maxTokens;
    this.temperature = temperature;
    this.inputOptions = inputOptions || {};
    this.autoTitle = autoTitle;
    if (googleSearch && !GEMINI_PROVIDERS.has(provider)) {
      throw new Error('googleSearch grounding needs the gemini or vertex provider.');
    }
  }

  /**
   * Answer a message in a conversation (a new one when conversationId is omitted).
   * @param {string} message
   * @param {object} options - { conversationId, userId, attachments, filter (knowledge metadata filter), systemMessage,
   *   googleSearch (this turn only, gemini and vertex) }.
   *   attachments: file paths (Node), { data (base64 or bytes), mimeType, name } or { uri, mimeType }.
   * @returns {Promise<{conversationId, messageId, text, references, citations, memories, usage, model, toolSteps}>}
   *   references are the retrieved chunks; `cited: true` marks the ones the answer cites as [n].
   */
  async chat(message, options = {}) {
    const turn = await this._prepare(message, options);
    const bot = this._turnChatbot();
    let text;
    let toolSteps = [];
    if (this.tools) {
      const result = await bot.runTools(turn.input, this.tools, { maxSteps: this.maxToolSteps });
      text = result.text;
      toolSteps = result.steps;
    } else {
      const replies = await bot.chat(turn.input);
      const first = Array.isArray(replies) ? replies[0] : replies.result[0];
      text = typeof first === 'string' ? first : (first && first.content) || '';
    }
    return this._finish(turn, text, bot.lastResponse, toolSteps);
  }

  /**
   * Stream the answer. Yields { type: 'start', conversationId, references, memories }, then { type: 'text', text }
   * chunks, then { type: 'done', ...result } with the same fields as chat().
   */
  async* stream(message, options = {}) {
    const turn = await this._prepare(message, options);
    yield { type: 'start', conversationId: turn.conversationId, references: turn.references, memories: turn.memories };
    const bot = this._turnChatbot();
    let text = '';
    let toolSteps = [];
    if (this.tools) {
      // the tool loop needs whole replies; the final answer is sent as one chunk
      const result = await bot.runTools(turn.input, this.tools, { maxSteps: this.maxToolSteps });
      text = result.text;
      toolSteps = result.steps;
      if (text) yield { type: 'text', text };
    } else {
      for await (const chunk of bot.stream(turn.input)) {
        text += chunk;
        yield { type: 'text', text: chunk };
      }
    }
    yield { type: 'done', ...(await this._finish(turn, text, bot.lastResponse, toolSteps)) };
  }

  /** Answer the last user message of a conversation again (the previous answer is removed from the history). */
  async regenerate(conversationId, options = {}) {
    const messages = await this.history.getMessages(conversationId, { limit: 2 });
    if (messages.length < 2 || messages[1].role !== 'assistant' || messages[0].role !== 'user') {
      throw new Error('The conversation does not end with a user message and an answer.');
    }
    await this.history.deleteLastMessages(conversationId, 2);
    if (this.memory) await this.memory.delete([messages[0].id]).catch(() => {});
    return this.chat(messages[0].content, { ...options, conversationId });
  }

  /**
   * Add documents to the knowledge store, split into chunks.
   * @param {Array<string|{id?, text, metadata?}>} documents - metadata.source / title / url are shown in references.
   * @param {object} options - { chunkSize = 1200, chunkOverlap = 150 }.
   * @returns {Promise<string[]>} chunk ids.
   */
  async addDocuments(documents, { chunkSize = 1200, chunkOverlap = 150 } = {}) {
    if (!this.knowledge) throw new Error('addDocuments needs a knowledge VectorStore: new Assistant({ knowledge }).');
    const chunks = [];
    for (const document of documents || []) {
      const item = typeof document === 'string' ? { text: document } : document;
      const id = item.id || newId();
      const metadata = { source: id, ...(item.metadata || {}) };
      chunks.push(...TextSplitter.toDocuments(item.text, metadata, { chunkSize, chunkOverlap, idPrefix: String(id) }));
    }
    return this.knowledge.addDocuments(chunks);
  }

  /** Add text files (txt, md, csv, json, html, code) to the knowledge store; the file name becomes the source (Node). */
  async addFiles(paths, options = {}) {
    const fs = require('fs');
    const path = require('path');
    const documents = [];
    for (const file of Array.isArray(paths) ? paths : [paths]) {
      const extension = path.extname(file).slice(1).toLowerCase();
      if (!TEXT_EXTENSIONS.has(extension)) {
        throw new Error(`addFiles reads text files; extract the text of ${path.basename(file)} first (for a PDF on Gemini: GeminiAIWrapper.mediaToText).`);
      }
      documents.push({ id: path.basename(file), text: await fs.promises.readFile(file, 'utf8'), metadata: { source: path.basename(file), path: file } });
    }
    return this.addDocuments(documents, options);
  }

  async listConversations(options = {}) {
    return this.history.listConversations(options);
  }

  async getMessages(conversationId, options = {}) {
    return this.history.getMessages(conversationId, options);
  }

  /** Delete a conversation and its long-term memories. */
  async deleteConversation(conversationId) {
    if (this.memory) {
      const ids = (await this.history.getMessages(conversationId)).filter((message) => message.role === 'user').map((message) => message.id);
      if (ids.length) await this.memory.delete(ids).catch(() => {});
    }
    return this.history.deleteConversation(conversationId);
  }

  async renameConversation(conversationId, title) {
    return this.history.saveConversation({ id: conversationId, title });
  }

  /** Name a conversation from its first message (a short model call) and save the title. */
  async generateTitle(conversationId) {
    const [first] = await this.history.getMessages(conversationId, { limit: null }).then((messages) => messages.filter((m) => m.role === 'user'));
    if (!first) return null;
    const input = this._createInput('You write short titles for chat conversations.', { maxTokens: null, tools: null });
    input.addUserMessage(`Write a title of at most six words for a conversation that starts with the message below. Reply with the title only, no quotes.\n\n${first.content.slice(0, 2000)}`);
    const replies = await this._turnChatbot().chat(input);
    const reply = Array.isArray(replies) ? replies[0] : replies.result[0];
    const title = String(typeof reply === 'string' ? reply : (reply && reply.content) || '').replace(/^["'#\s]+|["'\s]+$/g, '').split('\n')[0].slice(0, 80) || null;
    if (title) await this.history.saveConversation({ id: conversationId, title });
    return title;
  }

  // ------------------------------------------------------------------
  // Turn building
  // ------------------------------------------------------------------

  // A per-turn view of the shared Chatbot (same wrappers and credentials), so concurrent turns keep their own
  // lastResponse. Request options (timeout, retries) are set once on assistant.chatbot.
  _turnChatbot() {
    const bot = Object.create(this.chatbot);
    bot.lastResponse = null;
    return bot;
  }

  _createInput(systemText, overrides = {}, googleSearch = this.googleSearch) {
    const isGemini = GEMINI_PROVIDERS.has(this.provider);
    const options = {
      ...this.inputOptions,
      ...(this.model && { model: this.model }),
      ...(this.maxTokens && { maxTokens: this.maxTokens }),
      ...(this.temperature !== null && this.temperature !== undefined && { temperature: this.temperature }),
      ...(isGemini && { systemInstruction: true }),
      ...overrides,
    };
    if (isGemini && googleSearch && overrides.tools !== null) {
      options.tools = [...(options.tools || []), { googleSearch: {} }];
    }
    if (overrides.tools === null) delete options.tools;
    if (overrides.maxTokens === null) delete options.maxTokens;
    return Chatbot.createInput(this.provider, systemText, options);
  }

  async _prepare(message, options) {
    const text = String(message === undefined || message === null ? '' : message);
    const conversationId = options.conversationId || newId();
    const existing = await this.history.getConversation(conversationId);
    if (existing && existing.userId && options.userId && existing.userId !== options.userId) {
      throw new Error(`Conversation '${conversationId}' belongs to another user.`);
    }
    if (!existing || (options.userId && !existing.userId)) {
      await this.history.saveConversation({ id: conversationId, ...(options.userId && { userId: options.userId }) });
    }
    const recent = this.maxHistory > 0 ? await this.history.getMessages(conversationId, { limit: this.maxHistory }) : [];
    const references = await this._searchKnowledge(text, options.filter || null);
    const memories = await this._recall(text, conversationId, options.userId || (existing && existing.userId) || null, recent);
    const attachments = (options.attachments || []).map((attachment) => Assistant._readAttachment(attachment));

    if (options.googleSearch && !GEMINI_PROVIDERS.has(this.provider)) {
      throw new Error('googleSearch grounding needs the gemini or vertex provider.');
    }
    const googleSearch = options.googleSearch !== undefined ? Boolean(options.googleSearch) : this.googleSearch;
    const input = this._createInput(this._systemText(options.systemMessage || this.systemMessage, references, memories), {}, googleSearch);
    for (const item of recent) {
      if (!item.content) continue;
      if (item.role === 'user') input.addUserMessage(item.content);
      else input.addAssistantMessage(item.content);
    }
    this._addUserTurn(input, text, attachments);
    return { conversationId, isNew: !existing, text, attachments, references, memories, input, userId: options.userId || (existing && existing.userId) || null };
  }

  _systemText(systemMessage, references, memories) {
    const sections = [systemMessage];
    if (references.length) {
      sections.push('Use the sources below when they are relevant to the question. Cite them inline as [1], [2] by their numbers. '
        + 'If the sources do not answer the question, say so before answering from general knowledge.');
      sections.push(`Sources:\n${references.map((reference) => `[${reference.index}] ${Assistant._sourceLabel(reference)}\n${reference.text}`).join('\n\n')}`);
    }
    if (memories.length) {
      sections.push('Notes from earlier conversations with this user (use them only when they help):\n'
        + memories.map((memory) => `- ${memory.text.replace(/\s+/g, ' ').slice(0, 600)}`).join('\n'));
    }
    return sections.join('\n\n');
  }

  static _sourceLabel(reference) {
    const metadata = reference.metadata || {};
    const label = metadata.title || metadata.source || reference.id;
    return metadata.url ? `${label} (${metadata.url})` : String(label);
  }

  async _searchKnowledge(text, filter) {
    if (!this.knowledge || !text.trim() || !this.topK) return [];
    const matches = await this.knowledge.query({ text, topK: this.topK, filter });
    return matches
      .filter((match) => this._relevant(match))
      .map((match, index) => ({ index: index + 1, id: match.id, text: match.text || '', score: match.score, metadata: match.metadata || {} }));
  }

  async _recall(text, conversationId, userId, recent) {
    if (!this.memory || !text.trim() || !this.memoryTopK) return [];
    const recentIds = new Set(recent.map((message) => message.id));
    const matches = await this.memory.query({ text, topK: this.memoryTopK + recent.length, filter: userId ? { userId } : null });
    return matches
      .filter((match) => !recentIds.has(match.id))
      .filter((match) => this._relevant(match))
      .slice(0, this.memoryTopK)
      .map((match) => ({ id: match.id, text: match.text || '', score: match.score, conversationId: match.metadata && match.metadata.conversationId }));
  }

  // A match passes minScore; stores that return no score (null) always pass.
  _relevant(match) {
    return this.minScore === null || this.minScore === undefined || typeof match.score !== 'number' || match.score >= this.minScore;
  }

  _addUserTurn(input, text, attachments) {
    if (!attachments.length) {
      input.addUserMessage(text);
      return;
    }
    if (GEMINI_PROVIDERS.has(this.provider)) {
      input.addUserMessage(text, attachments.map((item) => (item.uri ? { uri: item.uri, mimeType: item.mimeType } : { data: item.data, mimeType: item.mimeType })));
    } else if (this.provider === SupportedChatModels.ANTHROPIC) {
      const blocks = attachments.map((item) => {
        if (item.uri) throw new Error('Anthropic attachments need the file data, not a URI.');
        if (item.mimeType === 'application/pdf') return { type: 'document', source: { type: 'base64', media_type: item.mimeType, data: item.data } };
        if (item.mimeType.startsWith('image/')) return { type: 'image', source: { type: 'base64', media_type: item.mimeType, data: item.data } };
        throw new Error(`Anthropic takes image and PDF attachments, not ${item.mimeType}.`);
      });
      input.addUserMessage([...blocks, { type: 'text', text }]);
    } else {
      const parts = attachments.map((item) => {
        if (!item.mimeType.startsWith('image/')) throw new Error(`${this.provider} takes image attachments; ${item.mimeType} needs the gemini, vertex or anthropic provider.`);
        return { type: 'image_url', image_url: { url: item.uri || `data:${item.mimeType};base64,${item.data}` } };
      });
      input.addUserMessage([{ type: 'text', text }, ...parts]);
    }
  }

  // { data (base64), mimeType, name } or { uri, mimeType, name } from a path, bytes, a data URL or an object.
  static _readAttachment(attachment) {
    if (typeof attachment === 'string') {
      if (/^(gs|https?):\/\//i.test(attachment)) {
        const extension = attachment.split('?')[0].split('.').pop().toLowerCase();
        return { uri: attachment, mimeType: MIME_BY_EXTENSION[extension] || 'application/octet-stream', name: attachment.split('/').pop() };
      }
      if (attachment.startsWith('data:')) {
        const match = /^data:([^;,]+);base64,(.*)$/s.exec(attachment);
        if (!match) throw new Error('Attachments as data URLs must be base64.');
        return { data: match[2], mimeType: match[1], name: 'attachment' };
      }
      const fs = require('fs');
      const path = require('path');
      const extension = path.extname(attachment).slice(1).toLowerCase();
      return { data: fs.readFileSync(attachment).toString('base64'), mimeType: MIME_BY_EXTENSION[extension] || 'application/octet-stream', name: path.basename(attachment) };
    }
    if (attachment && (attachment.uri || attachment.fileUri)) {
      return { uri: attachment.uri || attachment.fileUri, mimeType: attachment.mimeType, name: attachment.name || null };
    }
    if (attachment && attachment.data !== undefined) {
      if (!attachment.mimeType) throw new Error('An attachment with data needs a mimeType.');
      const data = typeof attachment.data === 'string' ? attachment.data.replace(/^data:[^,]*,/, '') : Buffer.from(attachment.data).toString('base64');
      return { data, mimeType: attachment.mimeType, name: attachment.name || null };
    }
    throw new Error('An attachment is a file path, a data URL, { data, mimeType } or { uri, mimeType }.');
  }

  async _finish(turn, text, lastResponse, toolSteps) {
    const isGemini = GEMINI_PROVIDERS.has(this.provider);
    const citations = isGemini && lastResponse ? GeminiAIWrapper.extractCitations(lastResponse) : [];
    const usage = Assistant._usage(lastResponse);
    // the retrieved chunks the answer cites as [n]
    const cited = new Set([...String(text).matchAll(/\[(\d+(?:\s*,\s*\d+)*)\]/g)].flatMap((match) => match[1].split(',').map(Number)));
    for (const reference of turn.references) reference.cited = cited.has(reference.index);
    const [userMessage, assistantMessage] = await this.history.addMessages(turn.conversationId, [
      {
        role: 'user',
        content: turn.text,
        metadata: turn.attachments.length ? { attachments: turn.attachments.map((item) => ({ name: item.name, mimeType: item.mimeType })) } : null,
      },
      {
        role: 'assistant',
        content: text,
        metadata: {
          ...(turn.references.length && { references: turn.references.map(({ index, id, metadata, cited: isCited }) => ({ index, id, cited: isCited, source: metadata.source || null, title: metadata.title || null, url: metadata.url || null })) }),
          ...(citations.length && { citations }),
        },
      },
    ]);
    if (this.memory && text) {
      await this.memory.addDocuments([{
        id: userMessage.id,
        text: `User: ${turn.text}\nAssistant: ${text}`,
        metadata: { conversationId: turn.conversationId, ...(turn.userId && { userId: turn.userId }), createdAt: userMessage.createdAt },
      }]);
    }
    if (this.autoTitle && turn.isNew) {
      await this.generateTitle(turn.conversationId).catch(() => null);
    }
    return {
      conversationId: turn.conversationId,
      messageId: assistantMessage.id,
      text,
      references: turn.references,
      citations,
      memories: turn.memories,
      usage,
      model: Assistant._model(lastResponse, turn.input),
      toolSteps,
    };
  }

  // The model that answered: the response's own record when it has one, else the input's model.
  static _model(response, input) {
    if (response && typeof response === 'object') {
      if (response.modelVersion) return response.modelVersion;
      if (typeof response.model === 'string') return response.model;
    }
    return (input && input.model) || null;
  }

  // Token usage in one shape for every provider: { inputTokens, outputTokens, totalTokens }.
  static _usage(response) {
    if (!response || typeof response !== 'object') return null;
    const usage = response.usageMetadata || response.usage || (response.meta && response.meta.billed_units) || null;
    if (!usage) return null;
    const inputTokens = usage.promptTokenCount ?? usage.input_tokens ?? usage.prompt_tokens ?? null;
    const outputTokens = usage.candidatesTokenCount ?? usage.output_tokens ?? usage.completion_tokens ?? null;
    const totalTokens = usage.totalTokenCount ?? usage.total_tokens ?? (inputTokens !== null && outputTokens !== null ? inputTokens + outputTokens : null);
    return { inputTokens, outputTokens, totalTokens };
  }
}

module.exports = { Assistant };
