const assert = require('assert');
const config = require('../../config.json');
const FetchClient = require('../../utils/FetchClient');
const SystemHelper = require('../../utils/SystemHelper');
const { Gen } = require('../../function/Gen');
const { stripThinking, extractBlocks, extractCode, extractMarkdown, parseJson, extractSvg } = require('../../utils/OutputParser');

// Fake provider replies so Gen runs offline while still building real requests through the wrappers.
function fakeReply(baseURL, endpoint, text) {
  if (baseURL.includes('anthropic')) return { content: [{ type: 'thinking', thinking: 'x' }, { type: 'text', text }], stop_reason: 'end_turn' };
  if (baseURL.includes('generativelanguage')) return { candidates: [{ content: { parts: [{ text }] } }] };
  if (baseURL.includes('cohere')) return { text };
  if (endpoint.includes('/responses')) return { output: [{ type: 'reasoning', content: [] }, { type: 'message', content: [{ type: 'output_text', text }] }] };
  return { choices: [{ message: { content: `<think>ignore me</think>${text}` } }] };
}

async function withMockedProviders(replyText, run) {
  const calls = [];
  const original = FetchClient.prototype.post;
  FetchClient.prototype.post = async function (endpoint, data) {
    calls.push({ url: endpoint.startsWith('http') ? endpoint : this.baseURL + endpoint, body: data });
    return fakeReply(this.baseURL, endpoint, typeof replyText === 'function' ? replyText(calls.length) : replyText);
  };
  try {
    return await run(calls);
  } finally {
    FetchClient.prototype.post = original;
  }
}

const PROVIDER_HOSTS = {
  openai: 'api.openai.com/v1/responses',
  anthropic: 'api.anthropic.com/v1/messages',
  gemini: 'generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
  mistral: 'api.mistral.ai/v1/chat/completions',
  cohere: 'api.cohere.ai/chat',
  nvidia: 'integrate.api.nvidia.com/v1/chat/completions',
};

function testOutputParser() {
  assert.strictEqual(stripThinking('<think>a</think>\nresult'), 'result');
  assert.deepStrictEqual(parseJson('```json\n{"a": 1}\n```'), { a: 1 });
  assert.deepStrictEqual(parseJson('Sure! {"html": "<p class=\\"x\\">{not json}</p>"} Enjoy.'), { html: '<p class="x">{not json}</p>' });
  assert.deepStrictEqual(parseJson('<think>{"wrong": true}</think>[{"q": "a"}]'), [{ q: 'a' }]);
  assert.deepStrictEqual(parseJson('use {placeholder} then {"ok": true}'), { ok: true });
  assert.throws(() => parseJson('no json here'), /not valid JSON/);
  // small syntax slips are repaired: trailing commas and raw newlines inside strings
  assert.deepStrictEqual(parseJson('{"a": "line1\nline2", "b": [1, 2,],}'), { a: 'line1\nline2', b: [1, 2] });
  // a broken outer object is never replaced by one of its nested objects
  assert.throws(() => parseJson('{"outer": {"inner": 1}, "bad": }'), /not valid JSON/);
  assert.deepStrictEqual(parseJson('{"bad": } then {"ok": true}'), { ok: true });
  // the longest block wins when several are returned without a language hint
  assert.strictEqual(extractCode('```\n\n```\n```javascript\nconst real = 1;\n```'), 'const real = 1;');
  assert.deepStrictEqual(extractBlocks('```html\n<b></b>\n```\n```json\n[]\n```'), [{ lang: 'html', code: '<b></b>' }, { lang: 'json', code: '[]' }]);
  assert.strictEqual(extractCode('```jsx\nexport default function A() {}\n```'), 'export default function A() {}');
  assert.strictEqual(extractCode('Intro\n```css\n.a{}\n```\n```html\n<b></b>\n```', 'html'), '<b></b>');
  assert.strictEqual(extractCode('const x = 1;'), 'const x = 1;');
  assert.strictEqual(extractCode('```ts\nconst y: number = 2;'), 'const y: number = 2;');
  assert.strictEqual(extractMarkdown('```markdown\n# Title\n```'), '# Title');
  assert.strictEqual(extractMarkdown('# Title'), '# Title');
  // an outer markdown wrapper around nested code blocks (Cohere style): code keeps the real block, markdown keeps the nesting
  const wrapped = '```markdown\n```javascript\nconst { add } = require("./math");\ntest("adds", () => {});\n```\n\n**Note:** divide by zero.\n\n```javascript\nfunction divide() {}\n```';
  assert.strictEqual(extractCode(wrapped), 'const { add } = require("./math");\ntest("adds", () => {});');
  assert.strictEqual(extractMarkdown('```markdown\n# T\n\n```bash\nnpm i\n```\n```'), '# T\n\n```bash\nnpm i\n```');
  assert.strictEqual(extractMarkdown('Here is the README:\n```md\n# T\n```\nHope it helps!'), '# T');
  // a ```md block after real content is an example inside the document, not a wrapper
  const guide = '# Guide\n\nUse this:\n```md\n**bold**\n```\nDone.';
  assert.strictEqual(extractMarkdown(guide), guide);
  // a document that only starts with a code block is not unwrapped
  const startsWithCode = '```bash\nnpm i\n```\n\n# Title\nText';
  assert.strictEqual(extractMarkdown(startsWithCode), startsWithCode);
  // a wrapper closer followed by prose does not become a block
  assert.strictEqual(extractCode('```\n```js\nconst a = 1;\n```\n```\nSome prose'), 'const a = 1;');
  assert.strictEqual(extractSvg('Here:\n```svg\n<svg viewBox="0 0 24 24"><path d="M1 1"/></svg>\n```'), '<svg viewBox="0 0 24 24"><path d="M1 1"/></svg>');
  assert.throws(() => extractSvg('<div></div>'), /<svg>/);
}

function testTemplatesExist() {
  const helper = new SystemHelper();
  const templates = [
    'landing_copy', 'faq', 'seo_meta', 'translate_strings', 'release_notes', 'readme', 'html_page', 'graph_dashboard',
    'component', 'form', 'page_section', 'styles', 'accessibility', 'email_template', 'svg_icon', 'color_palette',
    'api_endpoint', 'sql', 'json_schema', 'mock_data', 'regex', 'unit_tests', 'code_review', 'explain_code',
    'fix_code', 'convert_code', 'commit_message', 'instruct_update',
  ];
  for (const name of templates) {
    const template = helper.loadPrompt(name);
    assert.ok(template.includes('${text}') || template.includes('${model_output}'), `${name} template must take the user input`);
  }
}

async function testSameCallForEveryProvider() {
  const regexReply = 'Here is the regex:\n```json\n{"pattern": "^\\\\d+$", "flags": "", "explanation": "digits", "matches": ["1"], "nonMatches": ["a"]}\n```';
  for (const [provider, host] of Object.entries(PROVIDER_HOSTS)) {
    await withMockedProviders(regexReply, async (calls) => {
      const result = await Gen.generate_regex('digits only', 'key', provider);
      assert.strictEqual(result.pattern, '^\\d+$', provider);
      assert.ok(result.regex.test('123') && !result.regex.test('a'), `${provider} regex compiled`);
      assert.strictEqual(calls.length, 1, `${provider} makes one request`);
      assert.ok(calls[0].url.includes(host), `${provider} request goes to ${host}, got ${calls[0].url}`);
    });
  }

  // options.model and maxTokens reach the provider request through the input classes
  await withMockedProviders('ok', async (calls) => {
    await Gen.generate_text('hi', 'key', 'anthropic', { model: 'claude-haiku-4-5', maxTokens: 300, temperature: 0.2 });
    assert.strictEqual(calls[0].body.model, 'claude-haiku-4-5');
    assert.strictEqual(calls[0].body.max_tokens, 300);
    assert.strictEqual(calls[0].body.temperature, 0.2);
    await Gen.generate_text('hi', 'key', 'openai', { model: 'gpt-4.1', maxTokens: 300, temperature: 0.2 });
    assert.strictEqual(calls[1].body.model, 'gpt-4.1');
    assert.strictEqual(calls[1].body.max_tokens, 300);
    // reasoning models are not capped, since thinking counts toward the output budget
    const text = await Gen.generate_text('hi', 'key', 'openai', { maxTokens: 300 });
    assert.strictEqual(text, 'ok');
    assert.strictEqual(calls[2].body.model, config.url.openai.models.chat);
    assert.strictEqual(calls[2].body.max_output_tokens, undefined);
  });

  await assert.rejects(Gen.generate_text('hi', 'key', 'replicate'), /Unsupported provider/);
  await assert.rejects(Gen.translate_ui_strings({ a: 'b' }, 'key', 'openai'), /targetLanguage/);
}

async function testLegacyFunctionsKeepTheirContracts() {
  const page = '{"html": "<!DOCTYPE html><html><body><h1>Hi</h1></body></html>", "message": "ready"}';
  await withMockedProviders(`\`\`\`json\n${page}\n\`\`\``, async (calls) => {
    // openai keeps the positional model name and token budget
    const openai = await Gen.generate_html_page('a page', 'key', 'gpt-4o');
    assert.strictEqual(openai.html.startsWith('<!DOCTYPE html>'), true);
    assert.strictEqual(calls[0].body.model, 'gpt-4o');
    assert.strictEqual(calls[0].body.max_tokens, 12000);
    assert.strictEqual(calls[0].body.temperature, 0.8);

    // nvidia ignores the "deepseek" placeholder model name the old tests pass
    await Gen.generate_html_page('a page', 'key', 'deepseek', 'nvidia');
    assert.strictEqual(calls[1].body.model, config.nvidia.models.chat);

    // new providers use their own default model instead of the OpenAI default name
    const claude = await Gen.generate_html_page('a page', 'key', undefined, 'anthropic');
    assert.strictEqual(claude.message, 'ready');
    assert.strictEqual(calls[2].body.model, config.url.anthropic.models.chat);
    assert.strictEqual(calls[2].body.max_tokens, 8000);
  });

  await withMockedProviders(`[${page}]`, async () => {
    const dashboard = await Gen.generate_dashboard('a,b\n1,2', 'topic', 'key', 'gpt-4o', 2);
    assert.strictEqual(dashboard.message, 'ready', 'dashboard returns the first element of the array');
  });
  await withMockedProviders(page, async () => {
    const dashboard = await Gen.generate_dashboard('a,b\n1,2', 'topic', 'key', 'gpt-4o', 2, 'cohere');
    assert.strictEqual(dashboard.message, 'ready', 'dashboard accepts a bare object too');
  });
  await assert.rejects(Gen.generate_dashboard('a', 'b', 'key', 'gpt-4o', 5), /num_graphs/);

  await withMockedProviders('  <think>plan</think> A marketing text ', async (calls) => {
    assert.strictEqual(await Gen.get_marketing_desc('chair', 'key'), 'A marketing text');
    assert.strictEqual(calls[0].body.input[0].content, 'generate marketing description');
    assert.strictEqual(await Gen.get_marketing_desc('chair', 'key', 'cohere'), 'A marketing text');
    assert.strictEqual(calls[1].body.max_tokens, 800);
    assert.strictEqual(await Gen.instructUpdate('Title1', 'change to Title2', 'text', 'key'), 'A marketing text');
  });
}

async function testWebDevOutputs() {
  await withMockedProviders('```tsx\nexport default function Card() { return <div className="p-4" />; }\n```', async (calls) => {
    const code = await Gen.generate_component('a card', 'key', 'openai', { framework: 'react', language: 'typescript', styling: 'tailwind' });
    assert.strictEqual(code, 'export default function Card() { return <div className="p-4" />; }');
    const prompt = calls[0].body.input[1].content;
    assert.ok(prompt.includes('React') && prompt.includes('typescript') && prompt.includes('tailwind'), 'options reach the prompt');
  });
  await withMockedProviders('<svg viewBox="0 0 24 24"><title>x</title></svg>', async () => {
    assert.strictEqual(await Gen.generate_svg_icon('x', 'key'), '<svg viewBox="0 0 24 24"><title>x</title></svg>');
  });
  await withMockedProviders('[{"id": 1}, {"id": 2}]', async () => {
    assert.deepStrictEqual(await Gen.generate_mock_data('id', 'key', 'openai', { count: 2 }), [{ id: 1 }, { id: 2 }]);
  });
  await withMockedProviders('{"greeting": "Hola {name}"}', async (calls) => {
    assert.deepStrictEqual(await Gen.translate_ui_strings({ greeting: 'Hello {name}' }, 'key', 'openai', { targetLanguage: 'es' }), { greeting: 'Hola {name}' });
    assert.ok(calls[0].body.input[1].content.includes('"greeting": "Hello {name}"'), 'object input is serialized into the prompt');
  });
  await withMockedProviders('```markdown\n## 1.2.0\n### Bug Fixes\n- x\n```', async () => {
    assert.strictEqual(await Gen.generate_release_notes('fix x', 'key', 'openai', { version: '1.2.0' }), '## 1.2.0\n### Bug Fixes\n- x');
  });
  await withMockedProviders('feat(api): add endpoint\n\n- adds it', async () => {
    assert.strictEqual(await Gen.generate_commit_message('diff', 'key'), 'feat(api): add endpoint\n\n- adds it');
  });
  await withMockedProviders('```html\n<img src="a.jpg" alt="A cat">\n```\n```json\n[{"issue": "missing alt", "fix": "added alt", "wcag": "1.1.1"}]\n```', async () => {
    const result = await Gen.improve_accessibility('<img src="a.jpg">', 'key');
    assert.strictEqual(result.html, '<img src="a.jpg" alt="A cat">');
    assert.strictEqual(result.issues[0].wcag, '1.1.1');
  });
  await withMockedProviders('```javascript\nfunction f() { return 1; }\n```\n```json\n{"explanation": "off by one", "changes": ["fixed loop"]}\n```', async () => {
    const result = await Gen.fix_code('function f() { return 0; }', 'key', 'openai', { problem: 'returns 0' });
    assert.strictEqual(result.code, 'function f() { return 1; }');
    assert.deepStrictEqual(result.changes, ['fixed loop']);
  });
  await withMockedProviders('{"title": "T & Co", "description": "D", "keywords": ["a"], "openGraph": {"og:title": "T"}, "twitter": {"twitter:card": "summary"}, "jsonLd": {"@type": "WebPage", "name": "<x>"}}', async () => {
    const meta = await Gen.generate_seo_meta('page', 'key');
    assert.ok(meta.html.includes('<title>T &amp; Co</title>') && meta.html.includes('<meta property="og:title" content="T">'), 'html is rendered from the fields');
    assert.ok(meta.html.includes('\\u003cx>'), 'json-ld is escaped for script tags');
  });
  await withMockedProviders('{"pattern": "^a+$", "flags": "g", "matches": ["aa"], "nonMatches": ["b", "aa"]}', async () => {
    const result = await Gen.generate_regex('as', 'key');
    assert.strictEqual(result.verified, false, 'a non-match that matches is reported');
    assert.ok(result.regex.test('aaa') && result.regex.test('aaa'), 'the g flag is dropped so test() is stateless');
  });
}

async function testStructuredGenerators() {
  // parser repairs the structured generators rely on
  assert.strictEqual(stripThinking('the user wants a regex</think>\nAnswer'), 'Answer', 'orphan closing tag from a pre-opened think block');
  assert.deepStrictEqual(parseJson('{"pattern": "^\\d{3}$"}'), { pattern: '^\\d{3}$' }, 'lone backslash escapes are doubled');
  assert.deepStrictEqual(parseJson('{"a": "x, ]", "b": [1,],}'), { a: 'x, ]', b: [1] }, 'trailing commas are removed outside strings only');

  const helper = new SystemHelper();
  for (const name of ['openapi_spec', 'design_tokens']) {
    assert.ok(helper.loadPrompt(name).includes('${text}'), `${name} template`);
  }

  // anthropic gets an output floor so adaptive thinking cannot use up the 2048 input default
  await withMockedProviders('ok', async (calls) => {
    await Gen.generate_text('hi', 'key', 'anthropic');
    assert.strictEqual(calls[0].body.max_tokens, 16000, 'anthropic output floor');
    await Gen.generate_text('hi', 'key', 'anthropic', { maxTokens: 500 });
    assert.strictEqual(calls[1].body.max_tokens, 500, 'an explicit maxTokens wins');
  });

  // new functions report an empty answer; legacy functions keep returning the text as before
  await withMockedProviders('', async () => {
    await assert.rejects(Gen.generate_faq('coffee', 'key'), /empty response/);
    assert.strictEqual(await Gen.instructUpdate('a', 'b', 'text', 'key'), '');
  });

  // OpenAPI output is normalised: brace paths, base path, path parameters, unique ids, resolvable refs
  const openapiReply = JSON.stringify({
    openapi: '3.0.0',
    info: { title: 'Model title', version: '0.1' },
    paths: {
      users: { get: { operationId: 'listUsers', responses: { 200: { description: 'ok' } } } },
      '/users/:id': {
        get: {
          operationId: 'listUsers',
          requestBody: { content: {} },
          responses: { 200: { description: 'ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } },
        },
        delete: { summary: 'remove' },
      },
    },
    components: { schemas: {} },
  });
  await withMockedProviders(openapiReply, async () => {
    const spec = await Gen.generate_openapi_spec('routes', 'key', 'openai', { title: 'Users', basePath: 'api', serverUrl: 'https://example.com' });
    assert.strictEqual(spec.openapi, '3.1.0');
    assert.deepStrictEqual(spec.info, { title: 'Users', version: '0.1' });
    assert.deepStrictEqual(spec.servers, [{ url: 'https://example.com' }]);
    assert.deepStrictEqual(Object.keys(spec.paths).sort(), ['/api/users', '/api/users/{id}']);
    const byId = spec.paths['/api/users/{id}'];
    assert.strictEqual(byId.get.requestBody, undefined, 'GET has no request body');
    assert.ok(byId.delete.parameters.some((p) => p.name === 'id' && p.in === 'path' && p.required === true), 'missing path parameter added');
    assert.ok(Object.keys(byId.delete.responses).length > 0, 'responses added');
    const ids = [spec.paths['/api/users'].get.operationId, byId.get.operationId, byId.delete.operationId];
    assert.strictEqual(new Set(ids).size, 3, `unique operationIds: ${ids}`);
    assert.ok(spec.components.schemas.User, 'a referenced schema is added so the $ref resolves');
  });

  // design tokens: colors normalised, references resolved, contrast, CSS and Tailwind computed by the library
  const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
  const scale = (hex) => Object.fromEntries(steps.map((step) => [step, hex]));
  const palette = {
    primary: scale('#4338ca'), secondary: scale('#0ea5e9'), neutral: scale('#64748b'),
    success: scale('#16a34a'), warning: scale('#d97706'), danger: scale('#dc2626'),
  };
  palette.neutral['50'] = '#fff';
  palette.neutral['950'] = 'rgb(2, 6, 23)';
  palette.secondary['500'] = 'hsl(0, 0%, 100%)';
  const roles = (background, foreground) => ({
    background, foreground, muted: 'neutral.100', 'muted-foreground': 'neutral.950', primary: 'primary.600',
    'primary-foreground': '#ffffff', secondary: 'secondary.500', 'secondary-foreground': '#000000', accent: 'primary.100',
    border: 'neutral.200', ring: 'primary.500', danger: 'danger.600', 'danger-foreground': '#ffffff',
  });
  const tokensReply = {
    name: 'Fintech',
    palette,
    semantic: { light: roles('neutral.50', 'neutral.950'), dark: roles('neutral.950', 'neutral.50') },
    radius: { sm: '2px' },
    typography: { fontFamily: { sans: 'Inter, sans-serif', mono: 'monospace' }, fontSize: { base: '1rem' } },
    spacing: { 4: '1rem' },
  };
  await withMockedProviders(JSON.stringify(tokensReply), async () => {
    const tokens = await Gen.generate_design_tokens('fintech', 'key', 'openai', { brandColor: '#4F46E5' });
    assert.strictEqual(tokens.palette.primary['500'], '#4f46e5', 'brand color pinned');
    assert.ok(tokens.warnings.some((warning) => warning.includes('primary.500')), 'brand overwrite is reported');
    assert.strictEqual(tokens.palette.neutral['50'], '#ffffff', 'short hex expanded');
    assert.strictEqual(tokens.palette.neutral['950'], '#020617', 'rgb converted');
    assert.strictEqual(tokens.palette.secondary['500'], '#ffffff', 'hsl converted');
    assert.strictEqual(tokens.semantic.light.foreground, '#020617', 'scale references resolved');
    const main = tokens.contrast.find((c) => c.mode === 'light' && c.pair === 'foreground/background');
    assert.ok(main.aa && main.ratio > 19, `light contrast ${main.ratio}`);
    const darkMuted = tokens.contrast.find((c) => c.mode === 'dark' && c.pair === 'muted-foreground/background');
    assert.strictEqual(darkMuted.aa, false, 'low contrast pairs are flagged');
    assert.match(tokens.css, /--color-primary-500: #4f46e5;/);
    assert.match(tokens.css, /\[data-theme="dark"\]/);
    assert.match(tokens.css, /prefers-color-scheme: dark/);
    const colors = tokens.tailwind.theme.extend.colors;
    assert.strictEqual(colors.primary['500'], '#4f46e5');
    assert.strictEqual(colors.primary.DEFAULT, 'var(--primary)');
    assert.strictEqual(colors.primary.foreground, 'var(--primary-foreground)');
    assert.strictEqual(tokens.radius.sm, '2px');
    assert.strictEqual(tokens.radius.full, '9999px', 'missing radius sizes get defaults');
  });

  const incomplete = JSON.parse(JSON.stringify(tokensReply));
  delete incomplete.palette.danger['950'];
  await withMockedProviders(JSON.stringify(incomplete), async () => {
    await assert.rejects(Gen.generate_design_tokens('fintech', 'key'), /danger\.950/);
  });
  const unsupported = JSON.parse(JSON.stringify(tokensReply));
  unsupported.palette.success['500'] = 'oklch(0.7 0.1 150)';
  await withMockedProviders(JSON.stringify(unsupported), async () => {
    await assert.rejects(Gen.generate_design_tokens('fintech', 'key'), /palette\.success\.500/);
  });
}

async function testGen() {
  testOutputParser();
  testTemplatesExist();
  await testSameCallForEveryProvider();
  await testLegacyFunctionsKeepTheirContracts();
  await testWebDevOutputs();
  await testStructuredGenerators();
}

module.exports = testGen;
