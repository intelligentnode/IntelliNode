/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/

// Separators tried in order: paragraphs, lines, sentences, words.
const SEPARATORS = ['\n\n', '\n', '. ', '? ', '! ', '; ', ', ', ' '];

/**
 * Split long text into overlapping chunks for embeddings and RAG. Chunks break at paragraphs, then lines, then
 * sentences, then words, so a chunk rarely cuts a sentence in half. Sizes are in characters.
 *
 *   TextSplitter.split(text, { chunkSize: 1200, chunkOverlap: 150 })
 *   TextSplitter.toDocuments(text, { source: 'handbook.md' })  // [{ id, text, metadata: { source, chunk } }]
 */
class TextSplitter {
  static split(text, { chunkSize = 1200, chunkOverlap = 150 } = {}) {
    const clean = String(text || '').replace(/\r\n/g, '\n').trim();
    if (!clean) return [];
    if (chunkOverlap >= chunkSize) throw new Error('chunkOverlap must be smaller than chunkSize.');
    const pieces = TextSplitter._pieces(clean, chunkSize, 0);
    const chunks = [];
    let current = '';
    for (const piece of pieces) {
      if (current && current.length + piece.length > chunkSize) {
        chunks.push(current.trim());
        // start the next chunk with the tail of the previous one
        const tail = current.slice(Math.max(0, current.length - chunkOverlap));
        const boundary = tail.search(/\s/);
        current = chunkOverlap > 0 && boundary >= 0 ? tail.slice(boundary + 1) : '';
      }
      current += piece;
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }

  // Pieces no longer than size, each keeping its trailing separator.
  static _pieces(text, size, level) {
    if (text.length <= size) return [text];
    if (level >= SEPARATORS.length) {
      const parts = [];
      for (let start = 0; start < text.length; start += size) parts.push(text.slice(start, start + size));
      return parts;
    }
    const separator = SEPARATORS[level];
    const split = text.split(separator);
    if (split.length === 1) return TextSplitter._pieces(text, size, level + 1);
    const pieces = [];
    split.forEach((part, index) => {
      const piece = index < split.length - 1 ? part + separator : part;
      if (!piece) return;
      if (piece.length > size) pieces.push(...TextSplitter._pieces(piece, size, level + 1));
      else pieces.push(piece);
    });
    return pieces;
  }

  /** Chunks as vector store documents: [{ id, text, metadata: { ...metadata, chunk } }]. */
  static toDocuments(text, metadata = {}, options = {}) {
    const prefix = options.idPrefix || (metadata.source ? String(metadata.source) : null);
    return TextSplitter.split(text, options).map((chunk, index) => ({
      ...(prefix && { id: `${prefix}#${index}` }),
      text: chunk,
      metadata: { ...metadata, chunk: index },
    }));
  }
}

module.exports = TextSplitter;
