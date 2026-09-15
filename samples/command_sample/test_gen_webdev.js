/**
 * Gen web-dev examples: the same one-line calls work with any chat provider.
 *
 * Usage: node test_gen_webdev.js [openai|anthropic|cohere|gemini|mistral|nvidia]
 */
const { Gen } = require('intellinode');
require('dotenv').config();

const provider = process.argv[2] || 'openai';
const keys = {
  openai: process.env.OPENAI_API_KEY,
  anthropic: process.env.ANTHROPIC_API_KEY,
  cohere: process.env.COHERE_API_KEY,
  gemini: process.env.GEMINI_API_KEY,
  mistral: process.env.MISTRAL_API_KEY,
  nvidia: process.env.NVIDIA_API_KEY,
};
const apiKey = keys[provider];

(async () => {
  console.log(`\n🔹 Gen web-dev examples using ${provider}\n`);

  // 1. a React component with Tailwind classes
  const component = await Gen.generate_component(
    'a pricing card with a plan name, price, three features and a call-to-action button',
    apiKey, provider, { framework: 'react', language: 'typescript', styling: 'tailwind' });
  console.log('--- component ---\n', component.slice(0, 400), '...\n');

  // 2. an Express endpoint
  const endpoint = await Gen.generate_api_endpoint('POST /api/todos that creates a todo with a required title', apiKey, provider,
    { framework: 'express' });
  console.log('--- endpoint ---\n', endpoint.slice(0, 400), '...\n');

  // 3. a regular expression with examples that are checked before returning
  const regex = await Gen.generate_regex('a US phone number like 555-123-4567', apiKey, provider);
  console.log('--- regex ---\n', regex.pattern, regex.regex.test('555-123-4567'), '\n');

  // 4. realistic mock data for a UI
  const users = await Gen.generate_mock_data('a user with id, fullName, email and role (admin|editor|viewer)', apiKey, provider, { count: 3 });
  console.log('--- mock data ---\n', JSON.stringify(users, null, 2), '\n');

  // 5. SEO metadata for a page
  const meta = await Gen.generate_seo_meta('a product page for noise cancelling wireless headphones', apiKey, provider,
    { url: 'https://example.com/headphones', siteName: 'SoundLab' });
  console.log('--- seo ---\n', meta.title, '\n', meta.html.slice(0, 300), '...\n');

  // 6. translate UI strings while keeping keys and placeholders
  const spanish = await Gen.translate_ui_strings({ greeting: 'Hello, {name}!', save: 'Save', cancel: 'Cancel' }, apiKey, provider,
    { targetLanguage: 'Spanish' });
  console.log('--- translation ---\n', spanish, '\n');

  // 7. review code and get structured findings
  const review = await Gen.review_code('function avg(n) { let t = 0; for (let i = 0; i <= n.length; i++) t += n[i]; return t / n.length; }',
    apiKey, provider, { language: 'javascript' });
  console.log('--- review ---\n', `score ${review.score}:`, review.issues.map((issue) => issue.title).join(' | '), '\n');

  // 8. a conventional commit message from a diff
  const commit = await Gen.generate_commit_message('+router.delete("/users/:id", remove);\n-// TODO delete route', apiKey, provider);
  console.log('--- commit ---\n', commit, '\n');

  // 9. an OpenAPI document from Express routes (paths, parameters and operationIds are normalised)
  const openapi = await Gen.generate_openapi_spec(
    "router.get('/users/:id', getUser);\nrouter.post('/users', (req, res) => { const { email } = req.body; res.status(201).json(create(email)); });",
    apiKey, provider, { title: 'Users API' });
  console.log('--- openapi ---\n', Object.keys(openapi.paths), '\n');

  // 10. design tokens with CSS variables and a Tailwind theme
  const tokens = await Gen.generate_design_tokens('a calm fintech dashboard', apiKey, provider, { brandColor: '#4F46E5' });
  console.log('--- design tokens ---\n', tokens.css.split('\n').slice(0, 6).join('\n'), '\n', tokens.warnings, '\n');
})();
