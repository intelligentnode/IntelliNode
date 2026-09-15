const assert = require('assert');
const http = require('http');
const FetchClient = require('../../utils/FetchClient');

// A local server whose behaviour is scripted per path, so timeouts, retries and cancellation are deterministic.
function startServer() {
  const state = { hits: {}, closedEarly: false };
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const path = url.pathname;
    state.hits[path] = (state.hits[path] || 0) + 1;
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      if (path === '/flaky') {
        // 429 with Retry-After on the first two hits, then success
        if (state.hits[path] < 3) {
          res.writeHead(429, { 'Retry-After': '0', 'Content-Type': 'application/json' });
          return res.end('{"error":"rate limited"}');
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: true, attempts: state.hits[path], echo: JSON.parse(body) }));
      }
      if (path === '/bad') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end('{"error":"bad request"}');
      }
      if (path === '/slow') {
        return setTimeout(() => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{"late":true}'); }, 400);
      }
      if (path === '/stream') {
        res.writeHead(200, { 'Content-Type': 'text/event-stream' });
        res.write('data: one\n\n');
        const timer = setInterval(() => res.write('data: more\n\n'), 50);
        const stop = () => { clearInterval(timer); };
        res.on('close', () => { stop(); state.closedEarly = true; });
        return setTimeout(() => { stop(); res.end(); }, 5000).unref();
      }
      if (path === '/slow-body') {
        // headers now, body later: a timeout during the download must still be a timeout
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write('{"ok":');
        return setTimeout(() => res.end('true}'), 400);
      }
      if (path === '/retry-after') {
        res.writeHead(429, { 'Retry-After': '20', 'Content-Type': 'application/json' });
        return res.end('{"error":"slow down"}');
      }
      if (path === '/echo-headers') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const contentTypes = req.rawHeaders.filter((_, i) => i % 2 === 0 && req.rawHeaders[i].toLowerCase() === 'content-type').length;
        return res.end(JSON.stringify({ contentTypes, contentType: req.headers['content-type'] || '', body }));
      }
      if (path === '/finite-stream') {
        res.writeHead(200, { 'Content-Type': 'text/event-stream' });
        return res.end('data: a\n\ndata: b\n\n');
      }
      if (path === '/models') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ data: [{ id: 'm1' }], auth: req.headers.authorization || null }));
      }
      res.writeHead(404);
      res.end();
    });
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, state, baseURL: `http://127.0.0.1:${server.address().port}` }));
  });
}

module.exports = async function testFetchClient() {
  const { server, state, baseURL } = await startServer();
  const client = new FetchClient({ baseURL, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer t' } });
  try {
    // retries: 2 x 429 (Retry-After: 0) then 200; the JSON body is re-sent on every attempt
    client.setRequestOptions({ retries: 2, retryDelay: 1 });
    const flaky = await client.post('/flaky', { hello: 'world' });
    assert.deepStrictEqual(flaky, { ok: true, attempts: 3, echo: { hello: 'world' } });

    // no retries for a 4xx: the error carries the status and body
    await assert.rejects(client.post('/bad', {}), (error) => {
      assert.strictEqual(error.status, 400);
      assert.match(error.message, /HTTP error 400/);
      assert.strictEqual(error.body, '{"error":"bad request"}');
      return true;
    });
    assert.strictEqual(state.hits['/bad'], 1);

    // retries exhausted: the last error is thrown after retries + 1 attempts
    const exhausted = new FetchClient({ baseURL, retries: 1, retryDelay: 1 });
    state.hits['/flaky'] = 0;
    await assert.rejects(exhausted.post('/flaky', {}), /HTTP error 429/);
    assert.strictEqual(state.hits['/flaky'], 2);

    // timeout: ETIMEDOUT, no retry when retries is 0
    await assert.rejects(client.post('/slow', {}, { timeout: 50, retries: 0 }), (error) => {
      assert.strictEqual(error.code, 'ETIMEDOUT');
      assert.match(error.message, /timed out after 50ms/);
      return true;
    });

    // cancellation through the caller's AbortSignal
    const controller = new AbortController();
    const pending = client.post('/slow', {}, { signal: controller.signal, retries: 0 });
    setTimeout(() => controller.abort(), 20);
    await assert.rejects(pending, (error) => error.name === 'AbortError');
    // an already aborted signal never sends the request
    const hits = state.hits['/slow'];
    await assert.rejects(client.post('/slow', {}, { signal: controller.signal }), (error) => error.name === 'AbortError');
    assert.strictEqual(state.hits['/slow'], hits);

    // GET with the default headers
    const models = await client.get('/models');
    assert.deepStrictEqual(models, { data: [{ id: 'm1' }], auth: 'Bearer t' });

    // a stream the consumer stops reading early releases the connection
    const stream = await client.post('/stream', {}, { responseType: 'stream', timeout: 1000 });
    let received = '';
    for await (const chunk of stream) {
      received += chunk;
      if (received.includes('one')) break;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    assert.strictEqual(state.closedEarly, true, 'the server should see the connection close after the consumer stops reading');

    // an abort while waiting for Retry-After rejects right away
    const waiting = new AbortController();
    const started = Date.now();
    const rateLimited = client.post('/retry-after', {}, { retries: 1, signal: waiting.signal });
    setTimeout(() => waiting.abort(), 50);
    await assert.rejects(rateLimited, (error) => error.name === 'AbortError');
    assert.ok(Date.now() - started < 2000, 'abort during the retry wait must not wait for Retry-After');

    // a timeout during the body download is ETIMEDOUT and is retried
    state.hits['/slow-body'] = 0;
    await assert.rejects(client.post('/slow-body', {}, { timeout: 150, retries: 1, retryDelay: 1 }), (error) => {
      assert.strictEqual(error.code, 'ETIMEDOUT');
      return true;
    });
    assert.strictEqual(state.hits['/slow-body'], 2);

    // finished streams remove their listener from the caller's signal
    const { getEventListeners } = require('events');
    const shared = new AbortController();
    for (let i = 0; i < 12; i++) {
      const finite = await client.post('/finite-stream', {}, { responseType: 'stream', signal: shared.signal });
      for await (const chunk of finite) { void chunk; }
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.strictEqual(getEventListeners(shared.signal, 'abort').length, 0);

    // multipart bodies: one Content-Type, and Node's global FormData is converted instead of sent as text
    const FormDataPackage = require('form-data');
    const packaged = new FormDataPackage();
    packaged.append('purpose', 'fine-tune');
    const packagedEcho = await client.post('/echo-headers', packaged);
    assert.strictEqual(packagedEcho.contentTypes, 1);
    assert.match(packagedEcho.contentType, /^multipart\/form-data; boundary=/);
    const native = new globalThis.FormData();
    native.append('purpose', 'fine-tune');
    native.append('file', new Blob(['{"a":1}\n'], { type: 'application/jsonl' }), 'data.jsonl');
    const nativeEcho = await client.post('/echo-headers', native);
    assert.match(nativeEcho.contentType, /^multipart\/form-data; boundary=/);
    assert.match(nativeEcho.body, /name="file"; filename="data.jsonl"/);
    assert.match(nativeEcho.body, /\{"a":1\}/);

    // wrappers keep the HTTP metadata on the errors they rethrow (the fake server has no /chat/completions)
    const OpenAICompatibleWrapper = require('../../wrappers/OpenAICompatibleWrapper');
    const wrapper = new OpenAICompatibleWrapper('k', { baseUrl: baseURL, model: 'm' });
    wrapper.client.setRequestOptions({ retries: 0 });
    await assert.rejects(wrapper.generateChatText({ messages: [] }), (error) => {
      assert.strictEqual(error.status, 404);
      assert.match(error.message, /HTTP error 404/);
      return true;
    });
    const cancelled = new AbortController();
    cancelled.abort();
    wrapper.client.setRequestOptions({ signal: cancelled.signal });
    await assert.rejects(wrapper.generateChatText({ messages: [] }), (error) => error.name === 'AbortError');

    // global defaults are picked up by later clients and can be overridden per client
    const before = { ...FetchClient.defaults };
    try {
      FetchClient.configure({ retries: 0, timeout: 25 });
      const fresh = new FetchClient({ baseURL });
      assert.deepStrictEqual(fresh.resolveOptions({}), { timeout: 25, retries: 0, retryDelay: before.retryDelay, signal: null });
      fresh.setRequestOptions({ timeout: 90 });
      assert.strictEqual(fresh.resolveOptions({}).timeout, 90);
      assert.strictEqual(fresh.resolveOptions({ timeout: 5 }).timeout, 5);
    } finally {
      FetchClient.configure(before);
    }
  } finally {
    server.close();
  }
  console.log('FetchClient tests passed.');
};

if (require.main === module) {
  module.exports().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
