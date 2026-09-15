// Regression tests for the Gen review findings: each case reproduces a reported failure scenario.
const assert = require('assert');
const config = require('../../config.json');
const FetchClient = require('../../utils/FetchClient');
const { Gen } = require('../../function/Gen');

// Provider-shaped replies that carry the text exactly as given, so each test controls any <think> content itself.
function fakeReply(baseURL, endpoint, text) {
  if (baseURL.includes('anthropic')) return { content: [{ type: 'text', text }], stop_reason: 'end_turn' };
  if (baseURL.includes('generativelanguage')) return { candidates: [{ content: { parts: [{ text }] } }] };
  if (baseURL.includes('cohere')) return { text };
  if (endpoint.includes('/responses')) return { output: [{ type: 'message', content: [{ type: 'output_text', text }] }] };
  return { choices: [{ message: { content: text } }] };
}

async function withMockedProviders(replyText, run) {
  const calls = [];
  const original = FetchClient.prototype.post;
  FetchClient.prototype.post = async function (endpoint, data) {
    calls.push({ url: endpoint.startsWith('http') ? endpoint : this.baseURL + endpoint, body: data });
    return fakeReply(this.baseURL, endpoint, replyText);
  };
  try {
    return await run(calls);
  } finally {
    FetchClient.prototype.post = original;
  }
}

async function testThinkTagsOnlyStrippedForInlineReasoning() {
  const regexReply = '{"pattern": "<think>[\\\\s\\\\S]*?</think>", "flags": "", "matches": ["<think>plan</think>"], "nonMatches": ["plain text"]}';
  await withMockedProviders(regexReply, async () => {
    const result = await Gen.generate_regex('match think blocks', 'key', 'openai');
    assert.strictEqual(result.pattern, '<think>[\\s\\S]*?</think>', 'a regex about think tags is kept');
    assert.strictEqual(result.verified, true);
  });

  await withMockedProviders('The </think> tag closes reasoning.', async () => {
    assert.strictEqual(await Gen.generate_text('x', 'key', 'openai'), 'The </think> tag closes reasoning.');
    assert.strictEqual(await Gen.generate_text('x', 'key', 'cohere'), 'The </think> tag closes reasoning.');
  });

  await withMockedProviders('<think>plan</think>\nThe </think> tag closes reasoning.', async () => {
    assert.strictEqual(await Gen.generate_text('x', 'key', 'nvidia'), 'The </think> tag closes reasoning.', 'only the leading block is removed');
  });

  await withMockedProviders('the user wants FAQs</think>\n[{"question": "q", "answer": "a"}]', async () => {
    assert.deepStrictEqual(await Gen.generate_faq('coffee', 'key', 'nvidia'), [{ question: 'q', answer: 'a' }], 'pre-opened think template');
  });

  // reasoning cut off by the output budget is not mistaken for the answer
  await withMockedProviders('<think>\nA first draft: [{"question": "q", "answer": "a"}]. Let me reconsider the', async () => {
    await assert.rejects(Gen.generate_faq('coffee', 'key', 'nvidia'), /empty response/);
  });
}

async function testCodeExtraction() {
  const fastapiReply = [
    '```python', 'from fastapi import FastAPI', 'app = FastAPI()', '', '@app.post("/items")', 'async def create_item(item: dict):',
    '    """Create an item.', '', '    Example request:', '    ```json', '    {"name": "Pen"}', '    ```', '    """', '    return item', '```',
  ].join('\n');
  await withMockedProviders(fastapiReply, async (calls) => {
    const code = await Gen.generate_api_endpoint('create item', 'key', 'openai', { framework: 'fastapi' });
    assert.ok(code.startsWith('from fastapi import FastAPI') && code.endsWith('    return item'), 'a docstring fence stays inside the code');
    assert.ok(calls[0].body.input[1].content.includes('fastapi API endpoint in python'), 'python is the default language for fastapi');
  });

  await withMockedProviders('```python\nfrom module import add\n\ndef test_add():\n    assert add(1, 2) == 3\n```', async (calls) => {
    await Gen.generate_unit_tests('def add(a, b): return a + b', 'key', 'openai', { framework: 'pytest' });
    assert.ok(calls[0].body.input[1].content.includes('Import the code under test from "module"'), 'pytest imports a module name');
  });

  await withMockedProviders('```ts\nexport class CardComponent {}\n```', async (calls) => {
    await Gen.generate_component('a card', 'key', 'openai', { framework: 'angular' });
    assert.ok(calls[0].body.input[1].content.includes('in typescript'), 'angular components default to TypeScript');
  });

  const readme = '````markdown\n# Demo\n\nInstall it:\n\n```bash\nnpm install demo\n```\n\n## Usage\nRun it.\n````';
  await withMockedProviders(readme, async () => {
    assert.strictEqual(await Gen.generate_readme('demo', 'key'), '# Demo\n\nInstall it:\n\n```bash\nnpm install demo\n```\n\n## Usage\nRun it.');
  });

  const explanation = 'This function converts Markdown to HTML.\n\n```markdown\n# Hello\n**bold** text\n```\n\n## How it works\n1. Parse.\n\n## Things to watch\n- Sanitize.';
  await withMockedProviders(explanation, async () => {
    assert.strictEqual(await Gen.explain_code('render(md)', 'key', 'gemini'), explanation, 'a markdown example is not a wrapper');
  });

  // fixed code that is itself JSON is not mistaken for the details block
  const jsonFix = '```json\n{\n  "name": "demo",\n  "scripts": {"test": "jest"}\n}\n```\n```json\n{"explanation": "Removed the trailing comma.", "changes": ["removed trailing comma"]}\n```';
  await withMockedProviders(jsonFix, async () => {
    const result = await Gen.fix_code('{"name": "demo", "scripts": {"test": "jest"},}', 'key', 'anthropic', { language: 'json', problem: 'Unexpected token }' });
    assert.deepStrictEqual(JSON.parse(result.code), { name: 'demo', scripts: { test: 'jest' } });
    assert.strictEqual(result.explanation, 'Removed the trailing comma.');
    assert.deepStrictEqual(result.changes, ['removed trailing comma']);
  });

  const svgReply = '```svg\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Home</title></svg>\n```\n\nReact:\n```jsx\nexport const Home = (props) => (\n  <svg viewBox="0 0 24 24" width={24} {...props}>\n    <title>Home</title>\n  </svg>\n);\n```';
  await withMockedProviders(svgReply, async () => {
    assert.strictEqual(await Gen.generate_svg_icon('home', 'key'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Home</title></svg>');
  });
}

async function testJsonKindsAndLegacyErrors() {
  await withMockedProviders('Here is the review (score on a [1, 10] scale):\n{"summary": "ok", "score": 7, "issues": []}', async () => {
    assert.deepStrictEqual(await Gen.review_code('x', 'key'), { summary: 'ok', score: 7, issues: [] }, 'an array in prose is skipped');
  });

  // released page functions rejected with a SyntaxError; a JavaScript array inside an HTML answer is not a page
  const htmlAnswer = '```html\n<!DOCTYPE html><html><body><script>const labels = ["Q1", "Q2"]; const options = { responsive: true };</script></body></html>\n```';
  await withMockedProviders(htmlAnswer, async () => {
    await assert.rejects(Gen.generate_html_page('page', 'key', 'gpt-4o'), SyntaxError);
    await assert.rejects(Gen.generate_dashboard('a,b', 'sales', 'key', 'gpt-4o', 1), SyntaxError);
  });
  await withMockedProviders('not json', async () => {
    await assert.rejects(Gen.generate_html_page('page', 'key'), SyntaxError);
  });

  await withMockedProviders('{"html": "<p>x</p>", "message": "ok"}', async (calls) => {
    await Gen.generate_html_page('page', 'key', 'deepseek-ai/deepseek-r1', 'nvidia');
    assert.strictEqual(calls[0].body.model, config.nvidia.models.chat, 'released nvidia calls always used the default model');
    await Gen.generate_html_page('page', 'key', 'gpt-4o', 'anthropic');
    assert.strictEqual(calls[1].body.model, config.url.anthropic.models.chat, 'an OpenAI model name is not sent to another provider');
  });
}

async function testRegexVerification() {
  await withMockedProviders('{"regex": "^\\\\d+$", "flags": ""}', async () => {
    const result = await Gen.generate_regex('digits', 'key');
    assert.strictEqual(result.regex, null);
    assert.strictEqual(result.verified, false, 'no pattern');
  });
  await withMockedProviders('{"pattern": "^a+$", "flags": ""}', async () => {
    assert.strictEqual((await Gen.generate_regex('as', 'key')).verified, false, 'no examples to check');
  });
  await withMockedProviders('{"pattern": "^a+$", "flags": "y", "matches": ["aa", "aa"], "nonMatches": ["b"]}', async () => {
    const result = await Gen.generate_regex('as', 'key');
    assert.strictEqual(result.verified, true, 'the sticky flag is dropped');
    assert.ok(result.regex.test('aaa') && result.regex.test('aaa'), 'test() is stateless');
  });
  await withMockedProviders('{"pattern": "\\bcat\\b", "flags": "", "matches": ["a cat here"], "nonMatches": ["concatenate"]}', async () => {
    const result = await Gen.generate_regex('the word cat', 'key');
    assert.strictEqual(result.pattern, '\\bcat\\b', 'a JSON backspace becomes a word boundary');
    assert.strictEqual(result.verified, true);
  });
  await withMockedProviders('{"pattern": "^\\\\d+\\\\Z", "flags": "", "matches": ["123"], "nonMatches": ["12a"]}', async () => {
    const result = await Gen.generate_regex('digits', 'key', 'openai', { language: 'Python' });
    assert.strictEqual(result.verified, null, 'verification only runs for JavaScript patterns');
  });
}

async function testSeoAndOpenApi() {
  const seoReply = '{"title": "T", "description": "D", "openGraph": {"og:image": ["https://a/x.jpg", "https://a/y.jpg"], "og:type": "website", "og:extra": {"x": 1}}, "twitter": {}}';
  await withMockedProviders(seoReply, async () => {
    const meta = await Gen.generate_seo_meta('page', 'key');
    assert.strictEqual((meta.html.match(/property="og:image"/g) || []).length, 2, 'one tag per array value');
    assert.ok(meta.html.includes('content="https://a/y.jpg"'));
    assert.ok(!meta.html.includes('[object Object]'));
  });

  const doc = {
    openapi: '3.0.0',
    info: { title: 'x', version: '1' },
    paths: {
      '/orders/{orderId}': {
        parameters: [{ name: 'orderId', in: 'path', schema: { type: 'string' } }, { name: 'stale', in: 'path', required: true }],
        get: { parameters: [{ $ref: '#/components/parameters/OrderId' }], responses: { 200: { description: 'ok' } } },
      },
      '/v1/jobs/{name}:cancel': { post: { parameters: [{ name: 'name', in: 'path', required: true }], responses: { 200: { description: 'ok' } } } },
      '/users': { get: { operationId: 'first', responses: { 200: { description: 'ok' } } } },
      users: { get: { operationId: 'second' }, post: { operationId: 'third' } },
      '/': { get: { responses: { 200: { description: 'root' } } } },
    },
    components: { parameters: { OrderId: { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } } } },
  };
  await withMockedProviders(JSON.stringify(doc), async () => {
    const spec = await Gen.generate_openapi_spec('routes', 'key', 'openai', { basePath: '/' });
    assert.deepStrictEqual(Object.keys(spec.paths).sort(), ['/', '/orders/{orderId}', '/users', '/v1/jobs/{name}:cancel'], 'basePath "/" adds nothing');
    const order = spec.paths['/orders/{orderId}'];
    assert.deepStrictEqual(order.parameters.map((p) => p.name), ['orderId'], 'an unknown path parameter is removed');
    assert.strictEqual(order.parameters[0].required, true, 'path-level path parameters are required');
    assert.deepStrictEqual(order.get.parameters, [{ $ref: '#/components/parameters/OrderId' }], 'a referenced parameter is not duplicated');
    assert.deepStrictEqual(spec.paths['/v1/jobs/{name}:cancel'].post.parameters.map((p) => p.name), ['name'], 'custom method paths keep their colon');
    assert.strictEqual(spec.paths['/users'].get.operationId, 'first', 'the first definition wins on a collision');
    assert.strictEqual(spec.paths['/users'].post.operationId, 'third');
  });
}

async function testDesignTokenColors() {
  const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
  const scale = (hex) => Object.fromEntries(steps.map((step) => [step, hex]));
  const palette = {
    primary: scale('#4338ca'), secondary: scale('#0ea5e9'), neutral: scale('#64748b'),
    success: scale('#16a34a'), warning: scale('#d97706'), danger: scale('#dc2626'),
  };
  palette.neutral['50'] = '#ffffff';
  palette.neutral['950'] = '#020617';
  palette.neutral['200'] = '#0f172a1a';
  const roles = (background, foreground, mutedForeground, border) => ({
    background, foreground, muted: 'neutral.100', 'muted-foreground': mutedForeground, primary: 'primary.600',
    'primary-foreground': '#ffffff', secondary: 'secondary.500', 'secondary-foreground': '#000000', accent: 'primary.100',
    border, ring: 'primary.500', danger: 'danger.600', 'danger-foreground': '#ffffff',
  });
  const reply = {
    name: 'Review',
    palette,
    semantic: {
      light: roles('neutral.50', 'neutral.950', '#078a22', 'neutral.200'),
      dark: roles('neutral.950', 'neutral.50', 'neutral.50', 'rgb(255 255 255 / 10%)'),
    },
    radius: {},
  };
  await withMockedProviders(JSON.stringify(reply), async (calls) => {
    const tokens = await Gen.generate_design_tokens('brand', 'key', 'openai', { brandColor: 'hsl(210, 40%, 50%)' });
    assert.strictEqual(tokens.palette.primary['500'], '#4d80b3', 'hsl .5 channels round up like browsers');
    assert.ok(calls[0].body.input[1].content.includes('Use #4d80b3 exactly as primary 500.'), 'the prompt gets the normalised brand color');
    const muted = tokens.contrast.find((c) => c.mode === 'light' && c.pair === 'muted-foreground/background');
    assert.strictEqual(muted.aa, false, 'a 4.499:1 ratio fails AA');
    assert.ok(muted.ratio < 4.5, `reported ratio ${muted.ratio}`);
    assert.ok(tokens.warnings.some((w) => w.includes('palette.neutral.200') && w.includes('translucent')), 'translucent palette color warns');
    assert.ok(tokens.warnings.some((w) => w.includes('semantic.dark.border')), 'translucent semantic color warns');
    assert.match(tokens.css, /:root:not\(\[data-theme\]\)/, 'the dark media rule never overrides an explicit theme');
  });

  await withMockedProviders('{}', async (calls) => {
    await assert.rejects(Gen.generate_design_tokens('brand', 'key', 'openai', { brandColor: 'rebeccapurple' }), /rebeccapurple/);
    assert.strictEqual(calls.length, 0, 'an unsupported brand color fails before any request');
  });
}

async function testGenReview() {
  await testThinkTagsOnlyStrippedForInlineReasoning();
  await testCodeExtraction();
  await testJsonKindsAndLegacyErrors();
  await testRegexVerification();
  await testSeoAndOpenApi();
  await testDesignTokenColors();
}

module.exports = testGenReview;
