/**
 * Live test of the Gen web-dev functions against one provider.
 * Usage: node test/integration/GenWebDev.test.js [openai|anthropic|cohere|gemini|mistral|nvidia] [model]
 */
require('dotenv').config();
const assert = require('assert');
const { Gen } = require('../../function/Gen');

const provider = process.argv[2] || 'openai';
const model = process.argv[3] || null;
const KEYS = {
  openai: 'OPENAI_API_KEY', anthropic: 'ANTHROPIC_API_KEY', cohere: 'COHERE_API_KEY',
  gemini: 'GEMINI_API_KEY', mistral: 'MISTRAL_API_KEY', nvidia: 'NVIDIA_API_KEY',
};
const apiKey = process.env[KEYS[provider]];
if (!apiKey) {
  console.error(`Set ${KEYS[provider]} in .env to run the ${provider} tests.`);
  process.exit(1);
}
const opts = (extra = {}) => ({ ...(model && { model }), ...extra });

const SAMPLE_CODE = `function add(a, b) {\n  return a + b;\n}\n\nfunction divide(a, b) {\n  return a / b;\n}\n\nmodule.exports = { add, divide };`;
const BUGGY_CODE = `function average(numbers) {\n  let total = 0;\n  for (let i = 0; i <= numbers.length; i++) {\n    total += numbers[i];\n  }\n  return total / numbers.length;\n}`;
const SAMPLE_DIFF = `diff --git a/src/api/users.js b/src/api/users.js\n--- a/src/api/users.js\n+++ b/src/api/users.js\n@@ -10,6 +10,12 @@ router.get('/users', async (req, res) => {\n+router.delete('/users/:id', async (req, res) => {\n+  const removed = await users.remove(req.params.id);\n+  if (!removed) return res.status(404).json({ error: 'not found' });\n+  res.status(204).end();\n+});`;
const SAMPLE_HTML = `<div><img src="hero.jpg"><h3>Welcome</h3><h1>Our shop</h1><input type="text" placeholder="Email"><a href="/more">click here</a></div>`;

function noFences(text) {
  return !text.includes('```');
}

const cases = [
  ['generate_text', async () => {
    const text = await Gen.generate_text('What is the capital of France? Answer with one word.', apiKey, provider, opts());
    assert.match(text, /paris/i);
    return text;
  }],
  ['get_marketing_desc (legacy)', async () => {
    const text = await Gen.get_marketing_desc('an ergonomic gaming chair', apiKey, provider);
    assert.ok(text.length > 50);
    return `${text.length} chars`;
  }],
  ['generate_html_page (legacy)', async () => {
    const page = await Gen.generate_html_page('a registration page with a flat modern theme', apiKey, model || undefined, provider);
    assert.ok(page.html.includes('<form') || page.html.includes('<input'), 'page has a form');
    return `${page.html.length} chars`;
  }],
  ['generate_dashboard (legacy)', async () => {
    const csv = 'month,visits,signups\nJan,1200,80\nFeb,1500,95\nMar,1700,120\nApr,2100,150';
    const dashboard = await Gen.generate_dashboard(csv, 'website growth', apiKey, model || undefined, 2, provider);
    assert.ok(dashboard.html.toLowerCase().includes('chart'), 'dashboard uses charts');
    return `${dashboard.html.length} chars`;
  }],
  ['instructUpdate (legacy)', async () => {
    const text = await Gen.instructUpdate('{"html": "<h1>Title1</h1>"}', 'change Title1 to Title2', 'json with html content', apiKey, model || undefined, provider);
    assert.ok(text.includes('Title2'));
    return text;
  }],
  ['generate_component', async () => {
    const code = await Gen.generate_component('a pricing card with a plan name, price, feature list and a call-to-action button', apiKey, provider,
      opts({ framework: 'react', language: 'typescript', styling: 'tailwind' }));
    assert.ok(noFences(code) && /export default/.test(code) && /className=/.test(code), 'react + tailwind component');
    return `${code.split('\n').length} lines`;
  }],
  ['generate_form', async () => {
    const code = await Gen.generate_form('a contact form with name, email, subject select (sales, support) and message', apiKey, provider, opts());
    assert.ok(noFences(code) && code.includes('<form') && /required|validat/i.test(code), 'html form with validation');
    return `${code.split('\n').length} lines`;
  }],
  ['generate_page_section', async () => {
    const code = await Gen.generate_page_section('a hero for a note-taking app with a headline, a short description, two buttons and a screenshot placeholder', apiKey, provider,
      opts({ sectionType: 'hero' }));
    assert.ok(noFences(code) && /<section|<header|<div/.test(code) && !/<html/i.test(code), 'section snippet without a document wrapper');
    return `${code.split('\n').length} lines`;
  }],
  ['generate_css', async () => {
    const code = await Gen.generate_css('a responsive three column card grid that collapses to one column on phones', apiKey, provider, opts());
    assert.ok(noFences(code) && code.includes('{') && code.includes('}') && /@media|grid|flex/.test(code), 'responsive css');
    return `${code.split('\n').length} lines`;
  }],
  ['improve_accessibility', async () => {
    const result = await Gen.improve_accessibility(SAMPLE_HTML, apiKey, provider, opts());
    assert.ok(/alt=/.test(result.html), 'alt text added');
    assert.ok(Array.isArray(result.issues) && result.issues.length >= 2, 'issues reported');
    return `${result.issues.length} issues`;
  }],
  ['generate_email_template', async () => {
    const code = await Gen.generate_email_template('a welcome email for new users of a project management app with a "Create your first project" button', apiKey, provider, opts());
    assert.ok(noFences(code) && /<table/i.test(code) && /style=/.test(code) && /unsubscribe/i.test(code), 'table-based email with inline css');
    return `${code.length} chars`;
  }],
  ['generate_svg_icon', async () => {
    const svg = await Gen.generate_svg_icon('a shopping cart', apiKey, provider, opts());
    assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>') && svg.includes('viewBox') && /currentColor/.test(svg), 'svg icon');
    return `${svg.length} chars`;
  }],
  ['generate_color_palette', async () => {
    const palette = await Gen.generate_color_palette('a calm fintech dashboard', apiKey, provider, opts({ count: 5 }));
    assert.strictEqual(palette.colors.length, 5);
    palette.colors.forEach((color) => assert.match(color.hex, /^#[0-9a-fA-F]{6}$/));
    assert.ok(palette.css.includes('--'), 'css variables');
    return palette.colors.map((c) => c.hex).join(' ');
  }],
  ['generate_api_endpoint', async () => {
    const code = await Gen.generate_api_endpoint('POST /api/todos that creates a todo with a required title and optional dueDate', apiKey, provider, opts({ framework: 'express' }));
    assert.ok(noFences(code) && /\.post\(/.test(code) && /res\.status\(/.test(code), 'express handler');
    return `${code.split('\n').length} lines`;
  }],
  ['generate_sql', async () => {
    const sql = await Gen.generate_sql('list the 10 customers with the highest total order amount in the last 30 days', apiKey, provider,
      opts({ dialect: 'postgresql', schema: 'customers(id, name, email)\norders(id, customer_id, total, created_at)' }));
    assert.ok(noFences(sql) && /select/i.test(sql) && /join/i.test(sql) && /limit\s+10|rank\S*\s*<=\s*10|fetch first 10|top\s*\(?10/i.test(sql), 'select with join and a top-10 limit');
    return `${sql.split('\n').length} lines`;
  }],
  ['generate_json_schema', async () => {
    const schema = await Gen.generate_json_schema('a blog post with a title, slug, published date, tags list and an author object with name and email', apiKey, provider, opts());
    assert.strictEqual(schema.type, 'object');
    assert.ok(schema.properties.title && schema.properties.author && Array.isArray(schema.required), 'schema shape');
    return Object.keys(schema.properties).join(', ');
  }],
  ['generate_mock_data', async () => {
    const rows = await Gen.generate_mock_data('a user with id (integer), fullName, email, role (admin|editor|viewer) and createdAt (ISO date)', apiKey, provider, opts({ count: 4 }));
    assert.strictEqual(rows.length, 4);
    const keys = Object.keys(rows[0]).join(',');
    rows.forEach((row) => assert.strictEqual(Object.keys(row).join(','), keys, 'same keys'));
    rows.forEach((row) => assert.match(String(row.email), /@/));
    return keys;
  }],
  ['generate_regex', async () => {
    const result = await Gen.generate_regex('a US phone number like 555-123-4567 or (555) 123-4567', apiKey, provider, opts());
    assert.ok(result.regex instanceof RegExp, 'compiles');
    assert.ok(result.regex.test('555-123-4567') && result.regex.test('(555) 123-4567'), 'matches the requested formats');
    result.matches.forEach((sample) => assert.ok(result.regex.test(sample), `should match ${sample}`));
    // whether the model's own non-match examples hold is reported, not asserted (weaker models get it wrong)
    return `${result.pattern} (verified: ${result.verified})`;
  }],
  ['generate_unit_tests', async () => {
    const code = await Gen.generate_unit_tests(SAMPLE_CODE, apiKey, provider, opts({ framework: 'jest', modulePath: './math' }));
    assert.ok(noFences(code) && /(describe|test|it)\(/.test(code) && code.includes('./math'), 'jest tests');
    return `${code.split('\n').length} lines`;
  }],
  ['review_code', async () => {
    const review = await Gen.review_code(BUGGY_CODE, apiKey, provider, opts({ language: 'javascript' }));
    assert.ok(typeof review.summary === 'string' && Array.isArray(review.issues) && review.issues.length >= 1, 'review shape');
    assert.ok(Number.isInteger(review.score), 'integer score');
    return `score ${review.score}, ${review.issues.length} issues`;
  }],
  ['explain_code', async () => {
    const text = await Gen.explain_code(SAMPLE_CODE, apiKey, provider, opts());
    assert.ok(/divide/.test(text) && /how it works/i.test(text), 'explains the functions');
    return `${text.length} chars`;
  }],
  ['fix_code', async () => {
    const result = await Gen.fix_code(BUGGY_CODE, apiKey, provider, opts({ problem: 'average([1, 2, 3]) returns NaN', language: 'javascript' }));
    assert.ok(/i < numbers\.length/.test(result.code), 'off-by-one fixed');
    assert.ok(Array.isArray(result.changes) && result.changes.length >= 1);
    return result.changes[0];
  }],
  ['convert_code', async () => {
    const code = await Gen.convert_code(SAMPLE_CODE, apiKey, provider, opts({ from: 'JavaScript', to: 'TypeScript' }));
    assert.ok(noFences(code) && /:\s*number/.test(code), 'typescript types');
    return `${code.split('\n').length} lines`;
  }],
  ['generate_commit_message', async () => {
    const message = await Gen.generate_commit_message(SAMPLE_DIFF, apiKey, provider, opts());
    assert.match(message, /^(feat|fix|docs|style|refactor|perf|test|chore|build|ci)(\([^)]+\))?!?: /, 'conventional subject');
    assert.ok(message.split('\n')[0].length <= 72, 'subject length');
    return message.split('\n')[0];
  }],
  ['generate_readme', async () => {
    const text = await Gen.generate_readme('intellinode-cli: a Node.js command line tool that generates web components from a text prompt using any AI provider', apiKey, provider, opts());
    assert.ok(text.startsWith('# ') && /## Installation/.test(text) && /## Usage/.test(text), 'readme sections');
    return `${text.length} chars`;
  }],
  ['generate_seo_meta', async () => {
    const meta = await Gen.generate_seo_meta('a product page for a noise cancelling wireless headphone with 40 hour battery life', apiKey, provider,
      opts({ url: 'https://example.com/headphones', siteName: 'SoundLab' }));
    assert.ok(meta.title.length > 0 && meta.title.length <= 70, `title length ${meta.title.length}`);
    assert.ok(meta.description.length >= 80 && meta.description.length <= 200, `description length ${meta.description.length}`);
    assert.ok(/<meta/.test(meta.html) && /<title>/.test(meta.html), 'html tags');
    assert.ok(meta.jsonLd && meta.jsonLd['@type'], 'json-ld');
    return meta.title;
  }],
  ['translate_ui_strings', async () => {
    const strings = { greeting: 'Hello, {name}!', buttons: { save: 'Save', cancel: 'Cancel' }, errors: { required: 'This field is required' } };
    const result = await Gen.translate_ui_strings(strings, apiKey, provider, opts({ targetLanguage: 'Spanish', sourceLanguage: 'English' }));
    assert.deepStrictEqual(Object.keys(result).sort(), Object.keys(strings).sort(), 'same keys');
    assert.deepStrictEqual(Object.keys(result.buttons).sort(), ['cancel', 'save']);
    assert.ok(result.greeting.includes('{name}'), 'placeholder kept');
    assert.notStrictEqual(result.buttons.save, 'Save', 'translated');
    return result.greeting;
  }],
  ['generate_faq', async () => {
    const faq = await Gen.generate_faq('a subscription box for specialty coffee beans', apiKey, provider, opts({ count: 3 }));
    assert.strictEqual(faq.length, 3);
    faq.forEach((item) => assert.ok(item.question && item.answer));
    return faq[0].question;
  }],
  ['generate_landing_copy', async () => {
    const copy = await Gen.generate_landing_copy('an AI assistant that turns meeting recordings into action items', apiKey, provider, opts({ featureCount: 3 }));
    assert.ok(copy.headline && copy.subheadline && copy.cta, 'copy fields');
    assert.strictEqual(copy.features.length, 3);
    return copy.headline;
  }],
  ['generate_release_notes', async () => {
    const text = await Gen.generate_release_notes('- add dark mode (#120)\n- fix crash when the profile image is missing (#131)\n- drop support for Node 16', apiKey, provider,
      opts({ version: '2.4.0' }));
    assert.ok(text.includes('2.4.0') && /### /.test(text) && /#131/.test(text), 'grouped notes with references');
    return `${text.split('\n').length} lines`;
  }],
  ['generate_openapi_spec', async () => {
    const routes = "const router = require('express').Router();\nrouter.get('/users', (req, res) => res.json(listUsers(Number(req.query.limit) || 20)));\nrouter.get('/users/:id', (req, res) => res.json(findUser(req.params.id)));\nrouter.post('/users', (req, res) => { const { email, name } = req.body; res.status(201).json(createUser(email, name)); });\nrouter.delete('/users/:id', (req, res) => res.status(204).end());\nmodule.exports = router;";
    const spec = await Gen.generate_openapi_spec(routes, apiKey, provider, opts({ title: 'Users' }));
    assert.ok(spec.openapi.startsWith('3.') && spec.info.title === 'Users', 'openapi and info');
    assert.ok(Object.keys(spec.paths).every((key) => key.startsWith('/') && !key.includes(':')), 'brace path keys');
    assert.ok(spec.paths['/users'] && spec.paths['/users'].get && spec.paths['/users'].post, '/users operations');
    assert.ok(spec.paths['/users/{id}'] && spec.paths['/users/{id}'].get && spec.paths['/users/{id}'].delete, '/users/{id} operations');
    assert.ok(Object.keys(spec.paths['/users'].post.responses).includes('201'), 'created status');
    const operations = Object.values(spec.paths)
      .flatMap((item) => Object.entries(item).filter(([method]) => ['get', 'post', 'put', 'patch', 'delete'].includes(method)).map(([, op]) => op));
    assert.strictEqual(new Set(operations.map((op) => op.operationId)).size, operations.length, 'unique operationIds');
    return `${operations.length} operations`;
  }],
  ['generate_design_tokens', async () => {
    const tokens = await Gen.generate_design_tokens('a calm, trustworthy fintech dashboard', apiKey, provider, opts({ brandColor: '#4F46E5' }));
    assert.strictEqual(tokens.palette.primary['500'], '#4f46e5', 'brand color pinned');
    Object.values(tokens.palette).forEach((scale) => assert.strictEqual(Object.keys(scale).length, 11));
    assert.match(tokens.css, /--color-primary-500:\s*#4f46e5/);
    assert.match(tokens.css, /\[data-theme="dark"\]/);
    assert.strictEqual(tokens.tailwind.theme.extend.colors.primary['500'], '#4f46e5');
    const main = tokens.contrast.find((c) => c.mode === 'light' && c.pair === 'foreground/background');
    assert.ok(main && main.ratio >= 4.5, `light foreground contrast ${main && main.ratio}`);
    return `${tokens.contrast.filter((c) => c.aa).length}/${tokens.contrast.length} AA pairs`;
  }],
];

async function runWithConcurrency(items, limit, worker) {
  const queue = [...items];
  const results = [];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) {
      const item = queue.shift();
      results.push(await worker(item));
    }
  });
  await Promise.all(workers);
  return results;
}

// GEN_CASES=generate_sql,generate_regex runs only the listed cases.
const only = process.env.GEN_CASES ? process.env.GEN_CASES.split(',').map((name) => name.trim()).filter(Boolean) : null;
const selected = only ? cases.filter(([name]) => only.some((wanted) => name.startsWith(wanted))) : cases;

(async () => {
  console.log(`Gen web-dev tests for ${provider}${model ? ` (${model})` : ''}\n`);
  const started = Date.now();
  const results = await runWithConcurrency(selected, 3, async ([name, fn]) => {
    const start = Date.now();
    try {
      const detail = await fn();
      console.log(`✓ ${name} (${Math.round((Date.now() - start) / 1000)}s) -> ${String(detail).replace(/\s+/g, ' ').slice(0, 90)}`);
      return { name, ok: true };
    } catch (error) {
      console.log(`✗ ${name} (${Math.round((Date.now() - start) / 1000)}s) -> ${error.message.replace(/\s+/g, ' ').slice(0, 200)}`);
      return { name, ok: false };
    }
  });
  const failed = results.filter((result) => !result.ok);
  console.log(`\n${provider}: ${results.length - failed.length}/${results.length} passed in ${Math.round((Date.now() - started) / 1000)}s`);
  if (failed.length) {
    console.log('failed:', failed.map((result) => result.name).join(', '));
    process.exitCode = 1;
  }
})();
