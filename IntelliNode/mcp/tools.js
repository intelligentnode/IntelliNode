/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const fetch = require('cross-fetch');
const { Gen } = require('../function/Gen');
const { SupportedChatModels } = require('../function/Chatbot');
const { RemoteImageModel, SupportedImageModels } = require('../controller/RemoteImageModel');
const ImageModelInput = require('../model/input/ImageModelInput');
const config = require('../config.json');

/**
 * The IntelliNode MCP tool set: one tool per Gen use case, callable from any MCP client (Claude Code, Cursor,
 * VS Code, ...). Every tool routes to whichever LLM provider has a key configured, so a coding assistant gets
 * cross-provider access without leaving its own session.
 */

const presets = config.url.openai_compatible.presets;

// Chat providers in default-selection order; the first configured one becomes the default provider.
// A provider is configured when its key variable is set (or it is local) and a model is known: the preset
// default, or the optional <PROVIDER>_MODEL variable (required for groq, xai, together and ollama).
const PROVIDERS = [
  { id: SupportedChatModels.OPENAI, key: 'OPENAI_API_KEY', model: config.url.openai.models.chat },
  { id: SupportedChatModels.ANTHROPIC, key: 'ANTHROPIC_API_KEY', model: config.url.anthropic.models.chat },
  { id: SupportedChatModels.GEMINI, key: 'GEMINI_API_KEY', model: config.url.gemini.models.chat },
  { id: SupportedChatModels.MISTRAL, key: 'MISTRAL_API_KEY', model: config.url.mistral.models.chat },
  { id: SupportedChatModels.COHERE, key: 'COHERE_API_KEY', model: config.url.cohere.models.chat },
  { id: SupportedChatModels.NVIDIA, key: 'NVIDIA_API_KEY', model: config.nvidia.models.chat },
  { id: SupportedChatModels.OPENROUTER, key: 'OPENROUTER_API_KEY', modelEnv: 'OPENROUTER_MODEL', model: presets.openrouter.chat_model },
  { id: SupportedChatModels.DEEPSEEK, key: 'DEEPSEEK_API_KEY', modelEnv: 'DEEPSEEK_MODEL', model: presets.deepseek.chat_model },
  { id: SupportedChatModels.GROQ, key: 'GROQ_API_KEY', modelEnv: 'GROQ_MODEL', model: presets.groq.chat_model },
  { id: SupportedChatModels.XAI, key: 'XAI_API_KEY', modelEnv: 'XAI_MODEL', model: presets.xai.chat_model },
  { id: SupportedChatModels.TOGETHER, key: 'TOGETHER_API_KEY', modelEnv: 'TOGETHER_MODEL', model: presets.together.chat_model },
  { id: SupportedChatModels.OLLAMA, key: null, modelEnv: 'OLLAMA_MODEL', model: presets.ollama.chat_model, local: true },
];

function providerModel(provider, env) {
  return (provider.modelEnv && env[provider.modelEnv]) || provider.model || null;
}

function isConfigured(provider, env) {
  return Boolean((provider.local || env[provider.key]) && providerModel(provider, env));
}

// The variables still unset for a provider that is not configured (a key that is already set is not repeated).
function missingVariables(provider, env) {
  const variables = [];
  if (provider.key && !env[provider.key]) variables.push(provider.key);
  if (provider.modelEnv && !provider.model && !env[provider.modelEnv]) variables.push(provider.modelEnv);
  return variables;
}

// Names every key variable plus OLLAMA_MODEL, then the keys that also need a model variable.
function noProviderMessage() {
  const keys = PROVIDERS.filter((provider) => provider.key).map((provider) => provider.key);
  const needModel = PROVIDERS.filter((provider) => provider.key && provider.modelEnv && !provider.model)
    .map((provider) => `${provider.key} also needs ${provider.modelEnv}`);
  return `No LLM provider is configured. Set at least one of ${keys.join(', ')} (or OLLAMA_MODEL for a local Ollama model) ${KEY_HINT}.`
    + (needModel.length ? ` ${needModel.join('; ')}.` : '');
}

const IMAGE_PROVIDERS = [
  { id: SupportedImageModels.OPENAI, key: 'OPENAI_API_KEY' },
  { id: SupportedImageModels.STABILITY, key: 'STABILITY_API_KEY' },
];

const PROVIDER_IDS = PROVIDERS.map((provider) => provider.id);
const KEY_HINT = 'in the environment, or in a .env file in the directory where the intellinode MCP server starts';

function configuredProviders(env) {
  return PROVIDERS.filter((provider) => isConfigured(provider, env));
}

function configuredImageProviders(env) {
  return IMAGE_PROVIDERS.filter((provider) => env[provider.key]);
}

function describeConfigured(env) {
  const configured = configuredProviders(env).map((provider) => provider.id);
  return configured.length ? `Configured providers: ${configured.join(', ')}.` : 'No provider is configured yet.';
}

// { provider, apiKey, model } for the requested provider, or the first configured one. Throws a message the
// model can act on (which variable to set) when the key is missing.
function resolveProvider(requested, env) {
  if (requested !== undefined && requested !== null && requested !== '') {
    const id = String(requested).trim().toLowerCase();
    const provider = PROVIDERS.find((candidate) => candidate.id === id);
    if (!provider) {
      throw new Error(`Unknown provider '${requested}'. Use one of: ${PROVIDER_IDS.join(', ')}. ${describeConfigured(env)}`);
    }
    if (!isConfigured(provider, env)) {
      throw new Error(`${provider.id} is not configured. Set ${missingVariables(provider, env).join(' and ')} ${KEY_HINT}. ${describeConfigured(env)}`);
    }
    return { provider: provider.id, apiKey: provider.key ? env[provider.key] : null, model: providerModel(provider, env) };
  }
  const [first] = configuredProviders(env);
  if (!first) {
    throw new Error(noProviderMessage());
  }
  return { provider: first.id, apiKey: first.key ? env[first.key] : null, model: providerModel(first, env) };
}

function resolveImageProvider(requested, env) {
  if (requested !== undefined && requested !== null && requested !== '') {
    const id = String(requested).trim().toLowerCase();
    const provider = IMAGE_PROVIDERS.find((candidate) => candidate.id === id);
    if (!provider) {
      throw new Error(`Unknown image provider '${requested}'. Use one of: ${IMAGE_PROVIDERS.map((p) => p.id).join(', ')}.`);
    }
    if (!env[provider.key]) {
      throw new Error(`No API key configured for ${provider.id} images. Set ${provider.key} ${KEY_HINT}.`);
    }
    return { provider: provider.id, apiKey: env[provider.key] };
  }
  const [first] = configuredImageProviders(env);
  if (!first) {
    throw new Error(`No image provider key is configured. Set OPENAI_API_KEY or STABILITY_API_KEY ${KEY_HINT}.`);
  }
  return { provider: first.id, apiKey: env[first.key] };
}

function parseSize(size) {
  const text = size ? String(size).trim().toLowerCase() : '1024x1024';
  const match = /^(\d{2,5})x(\d{2,5})$/.exec(text);
  if (!match) throw new Error(`Invalid size '${size}': use WIDTHxHEIGHT, for example 1024x1024.`);
  return { width: Number(match[1]), height: Number(match[2]), imageSize: `${match[1]}x${match[2]}` };
}

async function downloadBase64(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not download the generated image (HTTP ${response.status})`);
  return Buffer.from(await response.arrayBuffer()).toString('base64');
}

// ---------------------------------------------------------------------
// Schema helpers
// ---------------------------------------------------------------------

const CROSS_PROVIDER = 'Gives a coding assistant cross-provider access: the work runs on any configured provider '
  + '(OpenAI, Anthropic, Gemini, Mistral, Cohere, NVIDIA, OpenRouter, DeepSeek, Groq, xAI, Together or a local Ollama model), '
  + 'so you can use a different model family than the one you run on.';

const providerProperty = {
  type: 'string',
  enum: PROVIDER_IDS,
  description: `LLM provider to use. Defaults to the first configured of ${PROVIDER_IDS.join(', ')}.`,
};

function string(description, extra = {}) {
  return { type: 'string', description, ...extra };
}

function schema(properties, required = []) {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    properties,
    ...(required.length && { required }),
    additionalProperties: false,
  };
}

// Gen functions that take (input, apiKey, provider, options); the tool adds provider resolution.
function genTool(env, { name, title, description, properties, required, run }) {
  return {
    name,
    title,
    description,
    inputSchema: schema({ ...properties, provider: providerProperty }, required),
    handler: async (args) => {
      const { provider, apiKey, model } = resolveProvider(args.provider, env);
      // compatible providers need their configured model; the built-in providers use the IntelliNode defaults
      const defaults = model && presets[provider] ? { model } : {};
      return run(args, apiKey, provider, defaults);
    },
  };
}

function withoutRegExp(result) {
  const { regex, ...rest } = result;
  return rest;
}

// ---------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------

/** Build the tool list for the given environment (defaults to process.env). */
function createTools(env = process.env) {
  return [
    genTool(env, {
      name: 'ask_model',
      title: 'Ask a model',
      description: `Send a prompt to a specific LLM provider and return its answer. ${CROSS_PROVIDER} `
        + 'Use it for a second opinion, to compare answers across model families, or to route a question to a model that fits it better. '
        + 'Optional model name and system prompt.',
      properties: {
        prompt: string('The question or instruction for the model.'),
        model: string('Model name at the provider (defaults to the provider default in IntelliNode).'),
        system: string('System prompt (defaults to a helpful assistant).'),
      },
      required: ['prompt'],
      run: (args, apiKey, provider, defaults) => Gen.generate_text(args.prompt, apiKey, provider, {
        ...defaults,
        ...(args.model && { model: args.model }),
        ...(args.system && { system: args.system }),
      }),
    }),

    {
      name: 'consensus',
      title: 'Consensus across providers',
      description: 'Ask the same prompt to several LLM providers in parallel and return every answer side by side. '
        + 'Gives a coding assistant a cross-provider check: compare how different model families answer a design, debugging or '
        + 'fact question before deciding. Uses every configured provider unless a providers list is given.',
      inputSchema: schema({
        prompt: string('The question or instruction sent to every provider.'),
        providers: {
          type: 'array',
          items: { type: 'string', enum: PROVIDER_IDS },
          description: 'Providers to ask (defaults to every provider with an API key configured).',
        },
      }, ['prompt']),
      handler: async (args) => {
        const requested = Array.isArray(args.providers) && args.providers.length ? args.providers : configuredProviders(env).map((p) => p.id);
        if (!requested.length) resolveProvider(undefined, env); // throws the "no key configured" message
        const answers = await Promise.all(requested.map(async (id) => {
          try {
            const { provider, apiKey, model } = resolveProvider(id, env);
            const answer = await Gen.generate_text(args.prompt, apiKey, provider, presets[provider] ? { model } : {});
            return { provider, model, answer };
          } catch (error) {
            return { provider: String(id), error: error.message };
          }
        }));
        const text = answers.map((entry) => (entry.error
          ? `## ${entry.provider}\nError: ${entry.error}`
          : `## ${entry.provider} (${entry.model})\n${entry.answer}`)).join('\n\n');
        return { content: [{ type: 'text', text }], structuredContent: { answers } };
      },
    },

    genTool(env, {
      name: 'review_code',
      title: 'Review code',
      description: `Review code and return a structured report: summary, score and issues with severity and suggestions. ${CROSS_PROVIDER} `
        + 'Use it to get a review from a model other than the one writing the code.',
      properties: {
        code: string('The source code to review.'),
        language: string('Programming language of the code (helps the reviewer).'),
      },
      required: ['code'],
      run: (args, apiKey, provider, defaults) => Gen.review_code(args.code, apiKey, provider, { ...defaults, ...(args.language && { language: args.language }) }),
    }),

    genTool(env, {
      name: 'generate_component',
      title: 'Generate UI component',
      description: `Generate UI component source code for React, Vue, Svelte, Angular or plain HTML. ${CROSS_PROVIDER} `
        + 'Returns only the code, ready to save to a file.',
      properties: {
        description: string('What the component does and looks like.'),
        framework: string('react (default), vue, svelte, angular or html.', { enum: ['react', 'vue', 'svelte', 'angular', 'html'] }),
        language: string('javascript (default) or typescript.', { enum: ['javascript', 'typescript'] }),
        styling: string('css (default), tailwind, css-modules or styled-components.'),
      },
      required: ['description'],
      run: (args, apiKey, provider, defaults) => Gen.generate_component(args.description, apiKey, provider, {
        ...defaults,
        ...(args.framework && { framework: args.framework }),
        ...(args.language && { language: args.language }),
        ...(args.styling && { styling: args.styling }),
      }),
    }),

    genTool(env, {
      name: 'generate_form',
      title: 'Generate form',
      description: `Generate a form with client-side validation for HTML, React, Vue or Svelte. ${CROSS_PROVIDER} `
        + 'Optionally POSTs the values to an action URL.',
      properties: {
        description: string('The fields, validation rules and purpose of the form.'),
        framework: string('html (default), react, vue or svelte.', { enum: ['html', 'react', 'vue', 'svelte'] }),
        action: string('URL that receives the submitted values as JSON.'),
      },
      required: ['description'],
      run: (args, apiKey, provider, defaults) => Gen.generate_form(args.description, apiKey, provider, {
        ...defaults,
        ...(args.framework && { framework: args.framework }),
        ...(args.action && { action: args.action }),
      }),
    }),

    genTool(env, {
      name: 'generate_sql',
      title: 'Generate SQL',
      description: `Generate SQL statements for a dialect, optionally against an existing schema. ${CROSS_PROVIDER} `
        + 'Returns only the SQL.',
      properties: {
        description: string('What the query or migration should do.'),
        dialect: string('postgresql (default), mysql, sqlite or sqlserver.'),
        schema: string('Existing tables as CREATE TABLE statements, so the SQL matches them.'),
      },
      required: ['description'],
      run: (args, apiKey, provider, defaults) => Gen.generate_sql(args.description, apiKey, provider, {
        ...defaults,
        ...(args.dialect && { dialect: args.dialect }),
        ...(args.schema && { schema: args.schema }),
      }),
    }),

    genTool(env, {
      name: 'generate_openapi_spec',
      title: 'Generate OpenAPI spec',
      description: `Generate an OpenAPI 3.1 document from route code or an API description. ${CROSS_PROVIDER} `
        + 'IntelliNode normalises the document (path parameters, unique operationIds, resolvable $refs) so Swagger UI and generators accept it.',
      properties: {
        input: string('Route handlers, controller code or a prose description of the API.'),
        title: string('API title for the info block.'),
        basePath: string('Prefix added to every path, for example /api/v1.'),
      },
      required: ['input'],
      run: (args, apiKey, provider, defaults) => Gen.generate_openapi_spec(args.input, apiKey, provider, {
        ...defaults,
        ...(args.title && { title: args.title }),
        ...(args.basePath && { basePath: args.basePath }),
      }),
    }),

    genTool(env, {
      name: 'generate_design_tokens',
      title: 'Generate design tokens',
      description: `Generate design tokens for a brand: color scales, light/dark roles, typography, radius and spacing, plus CSS custom properties and a Tailwind theme computed by IntelliNode with WCAG contrast checks. ${CROSS_PROVIDER}`,
      properties: {
        brand: string('The brand, product or mood the tokens should express.'),
        brandColor: string('Primary brand color as hex, rgb() or hsl(); used exactly as primary 500.'),
      },
      required: ['brand'],
      run: (args, apiKey, provider, defaults) => Gen.generate_design_tokens(args.brand, apiKey, provider, {
        ...defaults,
        ...(args.brandColor && { brandColor: args.brandColor }),
      }),
    }),

    genTool(env, {
      name: 'generate_regex',
      title: 'Generate regex',
      description: `Generate a regular expression with flags, an explanation and matching / non-matching examples. ${CROSS_PROVIDER} `
        + 'For JavaScript the examples are verified locally (verified: true/false).',
      properties: {
        description: string('What the pattern must match and must not match.'),
        language: string('Regex flavour: JavaScript (default), Python, Go, Java, ...'),
      },
      required: ['description'],
      run: async (args, apiKey, provider, defaults) => withoutRegExp(await Gen.generate_regex(args.description, apiKey, provider, {
        ...defaults,
        ...(args.language && { language: args.language }),
      })),
    }),

    genTool(env, {
      name: 'generate_mock_data',
      title: 'Generate mock data',
      description: `Generate realistic mock records for a schema or a description of the data. ${CROSS_PROVIDER} `
        + 'Useful for fixtures, seeds and UI previews.',
      properties: {
        schema: string('JSON Schema, a TypeScript type, a SQL table or a plain description of the records.'),
        count: { type: 'integer', minimum: 1, maximum: 200, description: 'Number of records (default 5).' },
      },
      required: ['schema'],
      run: async (args, apiKey, provider, defaults) => {
        const records = await Gen.generate_mock_data(args.schema, apiKey, provider, { ...defaults, ...(args.count && { count: args.count }) });
        return { records, count: records.length };
      },
    }),

    genTool(env, {
      name: 'generate_seo_meta',
      title: 'Generate SEO meta tags',
      description: `Generate SEO metadata for a page: title, description, keywords, Open Graph, Twitter cards, JSON-LD and the rendered HTML tags. ${CROSS_PROVIDER}`,
      properties: {
        page: string('What the page is about and who it is for.'),
        url: string('Canonical URL of the page.'),
        siteName: string('Site name for Open Graph.'),
      },
      required: ['page'],
      run: (args, apiKey, provider, defaults) => Gen.generate_seo_meta(args.page, apiKey, provider, {
        ...defaults,
        ...(args.url && { url: args.url }),
        ...(args.siteName && { siteName: args.siteName }),
      }),
    }),

    genTool(env, {
      name: 'generate_unit_tests',
      title: 'Generate unit tests',
      description: `Generate a unit test file for a piece of code with Jest, Vitest, Mocha or pytest. ${CROSS_PROVIDER} `
        + 'Have a different model write the tests than the one that wrote the code.',
      properties: {
        code: string('The code under test.'),
        framework: string('jest (default), vitest, mocha or pytest.'),
        modulePath: string('Import path of the module under test, for example ./utils/math.'),
      },
      required: ['code'],
      run: (args, apiKey, provider, defaults) => Gen.generate_unit_tests(args.code, apiKey, provider, {
        ...defaults,
        ...(args.framework && { framework: args.framework }),
        ...(args.modulePath && { modulePath: args.modulePath }),
      }),
    }),

    genTool(env, {
      name: 'fix_code',
      title: 'Fix code',
      description: `Fix a bug and return the corrected code with an explanation and the list of changes. ${CROSS_PROVIDER} `
        + 'Pass the error message or a description of the wrong behaviour as problem.',
      properties: {
        code: string('The code that does not work.'),
        problem: string('Error message, failing test or description of the wrong behaviour.'),
        language: string('Programming language of the code.'),
      },
      required: ['code'],
      run: (args, apiKey, provider, defaults) => Gen.fix_code(args.code, apiKey, provider, {
        ...defaults,
        ...(args.problem && { problem: args.problem }),
        ...(args.language && { language: args.language }),
      }),
    }),

    {
      name: 'generate_image',
      title: 'Generate image',
      description: 'Generate a PNG image from a text prompt with OpenAI or Stability AI and return it as an image content block. '
        + 'Gives a coding assistant image generation for placeholders, icons, hero images and mockups without leaving the session. '
        + 'The provider defaults to the first configured of openai, stability.',
      inputSchema: schema({
        prompt: string('Description of the image.'),
        provider: string('openai or stability (defaults to the first configured).', { enum: IMAGE_PROVIDERS.map((p) => p.id) }),
        size: string('WIDTHxHEIGHT, default 1024x1024.'),
      }, ['prompt']),
      handler: async (args) => {
        const { provider, apiKey } = resolveImageProvider(args.provider, env);
        const { width, height, imageSize } = parseSize(args.size);
        const input = provider === SupportedImageModels.OPENAI
          ? new ImageModelInput({ prompt: args.prompt, numberOfImages: 1, imageSize, responseFormat: 'b64_json' })
          : new ImageModelInput({ prompt: args.prompt, numberOfImages: 1, width, height, engine: 'stable-diffusion-xl-1024-v1-0' });
        const [image] = await new RemoteImageModel(apiKey, provider).generateImages(input);
        if (!image) throw new Error(`${provider} returned no image`);
        const data = /^https?:\/\//i.test(image) ? await downloadBase64(image) : image;
        return {
          content: [
            { type: 'image', data, mimeType: 'image/png' },
            { type: 'text', text: `Generated a ${imageSize} PNG image with ${provider}.` },
          ],
        };
      },
    },

    {
      name: 'list_providers',
      title: 'List providers',
      description: 'List which LLM and image providers have API keys configured for this IntelliNode server, the default provider '
        + 'and the default model per provider. Call it first to know which providers the other tools can route to.',
      inputSchema: schema({}),
      handler: async () => {
        const configured = configuredProviders(env).map((provider) => ({ provider: provider.id, model: providerModel(provider, env), keyVariable: provider.key }));
        // per unconfigured provider, only the variables that are still unset
        const unconfigured = PROVIDERS.filter((provider) => !isConfigured(provider, env))
          .map((provider) => ({ provider: provider.id, missing: missingVariables(provider, env) }));
        const image = configuredImageProviders(env).map((provider) => provider.id);
        const summary = {
          default: configured.length ? configured[0].provider : null,
          configured,
          image: { default: image[0] || null, configured: image },
          unconfigured,
        };
        const notConfigured = unconfigured.map((entry) => `${entry.provider} (set ${entry.missing.join(' and ')})`).join(', ');
        const text = configured.length
          ? `Configured providers: ${configured.map((entry) => `${entry.provider} (${entry.model})`).join(', ')}. Default: ${summary.default}. `
            + `Image providers: ${image.join(', ') || 'none'}.${unconfigured.length ? ` Not configured: ${notConfigured}.` : ''}`
          : noProviderMessage();
        return { content: [{ type: 'text', text }], structuredContent: summary };
      },
    },
  ];
}

module.exports = { createTools, resolveProvider, configuredProviders, PROVIDERS, IMAGE_PROVIDERS };
