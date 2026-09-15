const assert = require('assert');
const { Readable } = require('stream');
const {
  GPTStreamParser,
  AnthropicStreamParser,
  CohereStreamParser,
  readStreamChunks,
} = require('../../utils/StreamParser');

async function collect(parser, chunks) {
  const output = [];
  for (const chunk of chunks) {
    for await (const text of parser.feed(chunk)) {
      output.push(text);
    }
  }
  return output;
}

async function testStreamParser() {
  // chat completions, split mid-event and with CRLF separators
  assert.deepStrictEqual(await collect(new GPTStreamParser(), [
    'data: {"choices":[{"delta":{"content":"Hel"}}]}\r\n\r\ndata: {"choi',
    'ces":[{"delta":{"content":"lo"}}]}\n\ndata: [DONE]\n\n',
  ]), ['Hel', 'lo']);

  // Responses API events carry an `event:` line before `data:`
  assert.deepStrictEqual(await collect(new GPTStreamParser(), [
    'event: response.created\ndata: {"type":"response.created"}\n\nevent: response.output_text.delta\ndata: {"type":"response.output_text.delta","delta":"1"}\n\n',
    'event: response.output_text.delta\ndata: {"type":"response.output_text.delta","delta":"2"}\n\nevent: response.completed\ndata: {"type":"response.completed"}\n\n',
  ]), ['1', '2']);
  await assert.rejects(collect(new GPTStreamParser(), ['event: error\ndata: {"type":"error","message":"boom"}\n\n']), /boom/);

  // Anthropic: thinking and signature deltas are skipped
  assert.deepStrictEqual(await collect(new AnthropicStreamParser(), [
    'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"thinking_delta","thinking":"hmm"}}\n\n',
    'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"signature_delta","signature":"x"}}\n\nevent: content_block_delta\ndata: {"type":"content_block_delta","index":1,"delta":{"type":"text_delta","text":"A"}}\n\n',
    'event: content_block_delta\ndata: {"type":"content_block_delta","index":1,"delta":{"type":"text_delta","text":"B"}}\n\nevent: message_stop\ndata: {"type":"message_stop"}\n\n',
  ]), ['A', 'B']);
  await assert.rejects(collect(new AnthropicStreamParser(), ['event: error\ndata: {"type":"error","error":{"type":"overloaded_error","message":"Overloaded"}}\n\n']), /Overloaded/);

  // Cohere: several events in one chunk and a line split across chunks
  assert.deepStrictEqual(await collect(new CohereStreamParser(), [
    '{"event_type":"stream-start"}\n{"event_type":"text-generation","text":"1"}\n{"event_type":"text-generation","text":","}\n{"event_type":"text-gen',
    'eration","text":" 2"}\n{"is_finished":true,"event_type":"stream-end","response":{"text":"1, 2"}}\n',
  ]), ['1', ',', ' 2']);

  // browser ReadableStream with a multi-byte character split across chunks
  const bytes = new TextEncoder().encode('héllo');
  const webStream = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes.slice(0, 2));
      controller.enqueue(bytes.slice(2));
      controller.close();
    },
  });
  let webText = '';
  for await (const text of readStreamChunks(webStream)) webText += text;
  assert.strictEqual(webText, 'héllo');

  // Node stream with Buffer chunks
  let nodeText = '';
  for await (const text of readStreamChunks(Readable.from([Buffer.from('ab'), Buffer.from('c')]))) nodeText += text;
  assert.strictEqual(nodeText, 'abc');
}

module.exports = testStreamParser;
