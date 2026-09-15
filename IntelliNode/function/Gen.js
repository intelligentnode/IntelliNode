/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const { RemoteImageModel, SupportedImageModels } = require("../controller/RemoteImageModel");
const { RemoteSpeechModel } = require("../controller/RemoteSpeechModel");
const { SupportedLangModels } = require('../controller/RemoteLanguageModel');
const ImageModelInput = require("../model/input/ImageModelInput");
const Text2SpeechInput = require("../model/input/Text2SpeechInput");
const { Chatbot, SupportedChatModels } = require("../function/Chatbot");
const {
  ChatGPTInput,
  AnthropicInput,
  GeminiInput,
  MistralInput,
  CohereInput,
  NvidiaInput,
  VLLMInput
} = require("../model/input/ChatModelInput");
const SystemHelper = require("../utils/SystemHelper");
const Prompt = require("../utils/Prompt");
const FileHelper = require("../utils/FileHelper");
const path = require('path');
const config = require('../config.json');
const { isReasoningModel } = require('../utils/ModelHelper');
const { stripThinking, extractBlocks, extractCode, extractMarkdown, parseJson, extractSvg } = require('../utils/OutputParser');

const DEFAULT_OPENAI_MODEL = config.url.openai.models.chat;
const DEFAULT_SYSTEM = 'You are a helpful assistant.';

// The chat input class of every provider Gen can talk to through the Chatbot.
const CHAT_INPUTS = {
  [SupportedChatModels.OPENAI]: ChatGPTInput,
  [SupportedChatModels.ANTHROPIC]: AnthropicInput,
  [SupportedChatModels.GEMINI]: GeminiInput,
  [SupportedChatModels.MISTRAL]: MistralInput,
  [SupportedChatModels.COHERE]: CohereInput,
  [SupportedChatModels.NVIDIA]: NvidiaInput,
  [SupportedChatModels.VLLM]: VLLMInput,
};

// Output token budgets for the generation use cases (ignored for OpenAI reasoning models).
const TOKENS = { short: 1200, medium: 4000, long: 8000, page: 12000 };

// Output floors for providers whose input class default cap is too small once adaptive thinking counts toward it.
const MAX_TOKEN_FLOORS = {
  [SupportedChatModels.ANTHROPIC]: 16000,
};

function buildChatInput(provider, system, options) {
  const InputClass = CHAT_INPUTS[provider];
  if (!InputClass) {
    throw new Error(`Unsupported provider '${provider}'. Use one of: ${Object.keys(CHAT_INPUTS).join(', ')}`);
  }
  const inputOptions = { ...(options.model && { model: options.model }) };
  // reasoning models (gpt-5+) spend output tokens on thinking, so only cap and tune the other models
  const reasoning = provider === SupportedChatModels.OPENAI && isReasoningModel(options.model || DEFAULT_OPENAI_MODEL);
  if (!reasoning) {
    const maxTokens = options.maxTokens || MAX_TOKEN_FLOORS[provider];
    if (maxTokens) inputOptions.maxTokens = maxTokens;
    if (options.temperature != null) inputOptions.temperature = options.temperature;
  }
  return new InputClass(system, inputOptions);
}

// The legacy functions take an OpenAI model name positionally; other providers only use it when it is theirs.
function resolveLegacyModel(provider, modelName) {
  if (!modelName || modelName === DEFAULT_OPENAI_MODEL) {
    return provider === SupportedChatModels.OPENAI ? modelName : null;
  }
  if (provider === SupportedChatModels.NVIDIA && !modelName.includes('/')) {
    return null;
  }
  return modelName;
}

function legacyTokenSize(modelName, base) {
  const name = modelName || '';
  if (name.includes('-16k')) return 8000;
  if (name.includes('gpt-4o')) return 12000;
  if (name.includes('gpt-4')) return base;
  if (name.includes('deepseek')) return 15000;
  return 8000;
}

function quoteBlock(title, content, language = '') {
  return content ? `${title}\n\`\`\`${language}\n${content}\n\`\`\`\n` : '';
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Render <title>, <meta> and JSON-LD tags from the parsed SEO fields (safer than asking the model for HTML inside JSON).
function renderSeoHtml(meta) {
  const lines = [`<title>${escapeHtml(meta.title)}</title>`];
  if (meta.description) lines.push(`<meta name="description" content="${escapeHtml(meta.description)}">`);
  if (Array.isArray(meta.keywords) && meta.keywords.length) {
    lines.push(`<meta name="keywords" content="${escapeHtml(meta.keywords.join(', '))}">`);
  }
  for (const [property, content] of Object.entries(meta.openGraph || {})) {
    lines.push(`<meta property="${escapeHtml(property)}" content="${escapeHtml(content)}">`);
  }
  for (const [name, content] of Object.entries(meta.twitter || {})) {
    lines.push(`<meta name="${escapeHtml(name)}" content="${escapeHtml(content)}">`);
  }
  if (meta.jsonLd) {
    lines.push(`<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`);
  }
  return lines.join('\n');
}

// "code block + json block" answers: the main block is the longest non-json block, the json block carries the details.
function parseCodeWithDetails(text, codeKey, language = null) {
  const blocks = extractBlocks(text);
  const jsonBlock = blocks.find((block) => block.lang === 'json');
  const codeBlocks = blocks.filter((block) => block !== jsonBlock && block.code.trim());
  const preferred = language ? codeBlocks.find((block) => block.lang === String(language).toLowerCase()) : null;
  const codeBlock = preferred || codeBlocks.reduce((best, block) => (!best || block.code.length > best.code.length ? block : best), null);
  let details = {};
  if (jsonBlock) {
    try {
      details = parseJson(jsonBlock.code);
    } catch (error) {
      details = {};
    }
  }
  return { [codeKey]: codeBlock ? codeBlock.code : extractCode(text, language), details };
}

const FRAMEWORK_LABELS = {
  html: 'plain HTML, CSS and JavaScript (one self-contained .html file)',
  react: 'React (function component with hooks)',
  vue: 'Vue 3 (single-file component with <script setup>)',
  svelte: 'Svelte (single-file component)',
  angular: 'Angular (standalone component)',
};

const STYLE_FORMATS = {
  css: 'plain CSS',
  scss: 'SCSS',
  tailwind: 'HTML markup styled with Tailwind CSS utility classes (return the markup with the classes applied)',
};

// ---------------------------------------------------------------------
// OpenAPI normalisation
// ---------------------------------------------------------------------

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

function operationIdFor(method, pathKey) {
  const words = `${method} ${pathKey}`.split(/[^A-Za-z0-9]+/).filter(Boolean);
  return words.map((word, index) => (index === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1))).join('');
}

function resolveRef(doc, ref) {
  return ref.slice(2).split('/').reduce(
    (node, part) => (node == null ? undefined : node[part.replace(/~1/g, '/').replace(/~0/g, '~')]), doc);
}

function collectRefs(node, refs = new Set()) {
  if (Array.isArray(node)) {
    node.forEach((item) => collectRefs(item, refs));
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (key === '$ref' && typeof value === 'string') refs.add(value);
      else collectRefs(value, refs);
    }
  }
  return refs;
}

// Make a model-written OpenAPI document internally consistent so Swagger UI and code generators accept it.
function normalizeOpenApi(doc, options = {}) {
  if (!doc || typeof doc !== 'object' || Array.isArray(doc) || !doc.paths || typeof doc.paths !== 'object') {
    throw new Error('Gen: the model did not return an OpenAPI document with paths.');
  }
  const basePath = options.basePath ? `/${String(options.basePath).replace(/^\/+|\/+$/g, '')}` : '';
  const info = doc.info || {};
  const result = {
    ...doc,
    openapi: options.openapiVersion || '3.1.0',
    info: { ...info, title: options.title || info.title || 'Generated API', version: options.version || info.version || '1.0.0' },
    paths: {},
  };
  if (options.serverUrl) result.servers = [{ url: options.serverUrl }];

  const usedIds = new Set();
  for (const [rawPath, rawItem] of Object.entries(doc.paths)) {
    let pathKey = `/${String(rawPath).trim().replace(/^\/+/, '')}`.replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, '{$1}');
    if (basePath && pathKey !== basePath && !pathKey.startsWith(`${basePath}/`)) {
      pathKey = pathKey === '/' ? basePath : `${basePath}${pathKey}`;
    }
    const item = { ...(result.paths[pathKey] || {}) };
    const pathLevelParams = Array.isArray(rawItem && rawItem.parameters) ? rawItem.parameters : [];
    for (const [key, value] of Object.entries(rawItem || {})) {
      if (!HTTP_METHODS.includes(key.toLowerCase())) item[key] = value;
    }
    const templateParams = [...pathKey.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);

    for (const [key, value] of Object.entries(rawItem || {})) {
      const method = key.toLowerCase();
      if (!HTTP_METHODS.includes(method) || !value || typeof value !== 'object') continue;
      const operation = { ...value };
      if (method === 'get' || method === 'delete') delete operation.requestBody;
      if (!operation.responses || typeof operation.responses !== 'object' || Object.keys(operation.responses).length === 0) {
        operation.responses = { 200: { description: 'Successful response' } };
      }
      const parameters = (Array.isArray(operation.parameters) ? operation.parameters : [])
        .map((param) => (param && param.in === 'path' ? { ...param, required: true } : param));
      const declared = new Set([...pathLevelParams, ...parameters]
        .filter((param) => param && param.in === 'path')
        .map((param) => param.name));
      for (const name of templateParams.filter((param) => !declared.has(param))) {
        parameters.push({ name, in: 'path', required: true, schema: { type: 'string' } });
      }
      if (parameters.length) operation.parameters = parameters;

      const base = operation.operationId || operationIdFor(method, pathKey);
      let id = base;
      for (let n = 2; usedIds.has(id); n++) id = `${base}${n}`;
      operation.operationId = id;
      usedIds.add(id);
      item[method] = operation;
    }
    result.paths[pathKey] = item;
  }

  // a dangling component reference breaks Swagger UI and code generators, so give it a placeholder schema
  for (const ref of collectRefs(result)) {
    if (!ref.startsWith('#/') || resolveRef(result, ref) !== undefined) continue;
    const match = /^#\/components\/schemas\/([^/]+)$/.exec(ref);
    if (!match) {
      throw new Error(`Gen: the OpenAPI document references ${ref}, which it does not define.`);
    }
    const name = match[1].replace(/~1/g, '/').replace(/~0/g, '~');
    result.components = { ...(result.components || {}) };
    result.components.schemas = {
      ...(result.components.schemas || {}),
      [name]: { type: 'object', description: 'Referenced by the API; the model did not define this schema.' },
    };
  }
  return result;
}

// ---------------------------------------------------------------------
// Design token normalisation
// ---------------------------------------------------------------------

const TOKEN_SCALES = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'];
const TOKEN_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const TOKEN_ROLES = [
  'background', 'foreground', 'muted', 'muted-foreground', 'primary', 'primary-foreground', 'secondary',
  'secondary-foreground', 'accent', 'border', 'ring', 'danger', 'danger-foreground',
];
const CONTRAST_PAIRS = [
  ['foreground', 'background'], ['muted-foreground', 'background'], ['primary-foreground', 'primary'], ['danger-foreground', 'danger'],
];
const NAMED_COLORS = {
  white: '#ffffff', black: '#000000', red: '#ff0000', green: '#008000', blue: '#0000ff', gray: '#808080', grey: '#808080',
  silver: '#c0c0c0', navy: '#000080', teal: '#008080', purple: '#800080', orange: '#ffa500', yellow: '#ffff00',
};

function toHex(red, green, blue) {
  return `#${[red, green, blue].map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, '0')).join('')}`;
}

function hslToRgb(hue, saturation, lightness) {
  const h = (((hue % 360) + 360) % 360) / 360;
  const s = saturation / 100;
  const l = lightness / 100;
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [channel(h + 1 / 3) * 255, channel(h) * 255, channel(h - 1 / 3) * 255];
}

// Normalise a color to a lowercase six digit hex; anything that cannot be converted exactly throws.
function normalizeColor(value, key) {
  const text = String(value).trim().toLowerCase();
  let match = /^#([0-9a-f]{3,4})$/.exec(text);
  if (match) return `#${match[1].slice(0, 3).split('').map((digit) => digit + digit).join('')}`;
  match = /^#([0-9a-f]{6})(?:[0-9a-f]{2})?$/.exec(text);
  if (match) return `#${match[1]}`;
  match = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(text);
  if (match) return toHex(Number(match[1]), Number(match[2]), Number(match[3]));
  match = /^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%/.exec(text);
  if (match) return toHex(...hslToRgb(Number(match[1]), Number(match[2]), Number(match[3])));
  if (NAMED_COLORS[text]) return NAMED_COLORS[text];
  throw new Error(`Gen: unsupported color "${value}" at ${key}; expected a hex, rgb() or hsl() color.`);
}

function relativeLuminance(hex) {
  const [red, green, blue] = [1, 3, 5]
    .map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first, second) {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function buildTokenCss(palette, semantic, radius, modes, prefix) {
  const declarations = (entries, indent = '  ') => entries.map(([name, value]) => `${indent}--${name}: ${value};`).join('\n');
  const rootEntries = [];
  for (const [scaleName, scaleSteps] of Object.entries(palette)) {
    for (const [step, value] of Object.entries(scaleSteps)) rootEntries.push([`${prefix}-${scaleName}-${step}`, value]);
  }
  for (const [size, value] of Object.entries(radius)) rootEntries.push([`radius-${size}`, value]);
  rootEntries.push(...Object.entries(semantic[modes[0]]));

  const blocks = [`:root {\n${declarations(rootEntries)}\n}`];
  for (const mode of modes.slice(1)) {
    const entries = Object.entries(semantic[mode]);
    blocks.push(`[data-theme="${mode}"] {\n${declarations(entries)}\n}`);
    if (mode === 'dark') {
      blocks.push(`@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n${declarations(entries, '    ')}\n  }\n}`);
    }
  }
  return blocks.join('\n\n');
}

function buildTailwindTheme(palette, semantic, typography, radius, spacing, modes) {
  const colors = {};
  for (const [scaleName, scaleSteps] of Object.entries(palette)) colors[scaleName] = { ...scaleSteps };
  const roles = Object.keys(semantic[modes[0]]);
  for (const role of roles.filter((name) => !name.endsWith('-foreground'))) {
    colors[role] = { ...(colors[role] || {}), DEFAULT: `var(--${role})` };
  }
  for (const role of roles.filter((name) => name.endsWith('-foreground'))) {
    const base = role.slice(0, -'-foreground'.length);
    colors[base] = { ...(colors[base] || {}), foreground: `var(--${role})` };
  }
  const extend = { colors, borderRadius: { ...radius } };
  if (typography && typography.fontFamily) extend.fontFamily = { ...typography.fontFamily };
  if (typography && typography.fontSize) extend.fontSize = { ...typography.fontSize };
  if (spacing) extend.spacing = { ...spacing };
  return { theme: { extend } };
}

// Validate and complete model-written design tokens; syntax (hex, CSS, Tailwind) is produced by the library.
function normalizeDesignTokens(raw, options) {
  if (!raw || typeof raw !== 'object' || !raw.palette || typeof raw.palette !== 'object') {
    throw new Error('Gen: the model did not return design tokens with a palette.');
  }
  const modes = options.modes;
  const warnings = [];

  const palette = {};
  const missingSteps = [];
  for (const scaleName of TOKEN_SCALES) {
    palette[scaleName] = {};
    for (const step of TOKEN_STEPS) {
      const value = raw.palette[scaleName] && raw.palette[scaleName][step];
      if (value == null || value === '') {
        missingSteps.push(`${scaleName}.${step}`);
      } else {
        palette[scaleName][step] = normalizeColor(value, `palette.${scaleName}.${step}`);
      }
    }
  }
  if (missingSteps.length) {
    throw new Error(`Gen: the design tokens are missing palette steps: ${missingSteps.join(', ')}`);
  }
  if (options.brandColor) {
    const brand = normalizeColor(options.brandColor, 'options.brandColor');
    if (palette.primary['500'] !== brand) {
      warnings.push(`primary.500 was ${palette.primary['500']} and was set to the brand color ${brand}.`);
      palette.primary['500'] = brand;
    }
  }

  const resolve = (value, key) => {
    const reference = /^\s*([a-z]+)[.-](\d{2,3})\s*$/i.exec(String(value));
    if (reference) {
      const scaleSteps = palette[reference[1].toLowerCase()];
      if (scaleSteps && scaleSteps[reference[2]]) return scaleSteps[reference[2]];
    }
    return normalizeColor(value, key);
  };

  const semantic = {};
  const missingRoles = [];
  for (const mode of modes) {
    const source = (raw.semantic && raw.semantic[mode]) || {};
    semantic[mode] = {};
    for (const role of TOKEN_ROLES) {
      if (source[role] == null || source[role] === '') {
        missingRoles.push(`${mode}.${role}`);
      } else {
        semantic[mode][role] = resolve(source[role], `semantic.${mode}.${role}`);
      }
    }
  }
  if (missingRoles.length) {
    throw new Error(`Gen: the design tokens are missing semantic roles: ${missingRoles.join(', ')}`);
  }

  const contrast = [];
  for (const mode of modes) {
    for (const [foreground, background] of CONTRAST_PAIRS) {
      const ratio = Math.round(contrastRatio(semantic[mode][foreground], semantic[mode][background]) * 100) / 100;
      contrast.push({ mode, pair: `${foreground}/${background}`, ratio, aa: ratio >= 4.5 });
      if (ratio < 4.5) {
        warnings.push(`${mode}: ${foreground} on ${background} has a contrast of ${ratio}:1, below WCAG AA (4.5:1).`);
      }
    }
  }

  const typography = options.includeTypography === false ? null : (raw.typography || null);
  const spacing = options.includeSpacing === false ? null : (raw.spacing || null);
  const radius = { sm: '0.25rem', md: '0.5rem', lg: '1rem', full: '9999px', ...(raw.radius || {}) };
  return {
    name: raw.name || 'Design tokens',
    palette,
    semantic,
    typography,
    radius,
    spacing,
    contrast,
    css: buildTokenCss(palette, semantic, radius, modes, options.cssPrefix || 'color'),
    tailwind: buildTailwindTheme(palette, semantic, typography, radius, spacing, modes),
    warnings,
  };
}

class Gen {
  /**
   * One call to any chat provider. Returns the model text with reasoning blocks removed.
   *
   * @param {string} prompt - the user message.
   * @param {string} apiKey - the provider key.
   * @param {string} provider - openai, anthropic, gemini, mistral, cohere, nvidia or vllm.
   * @param {object} options - { system, model, maxTokens, temperature, customProxyHelper, baseUrl }.
   */
  static async generate_text(prompt, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const input = buildChatInput(provider, options.system || DEFAULT_SYSTEM, options);
    input.addUserMessage(prompt);

    const chatbotOptions = options.baseUrl ? { baseUrl: options.baseUrl } : {};
    const chatbot = new Chatbot(apiKey, provider, options.customProxyHelper || null, chatbotOptions);
    const responses = await chatbot.chat(input);

    const first = responses[0];
    const text = typeof first === 'string' ? first : (first && first.content) || '';
    return stripThinking(text);
  }

  // Fill a prompt template, call the provider and parse the output as text, markdown, code, json or svg.
  static async _generate(templateName, variables, apiKey, provider, options = {}, settings = {}) {
    const template = new SystemHelper().loadPrompt(templateName);
    const prompt = new Prompt(template).format(variables);
    const text = await Gen.generate_text(prompt, apiKey, provider, {
      ...settings.defaults,
      ...options,
      system: options.system || settings.system || DEFAULT_SYSTEM,
    });

    if (!text && !settings.legacy) {
      const model = options.model ? ` (${options.model})` : '';
      throw new Error(`Gen: empty response from ${provider}${model}. The output budget may have been spent before any text was produced; raise options.maxTokens.`);
    }

    if (typeof settings.parse === 'function') {
      return settings.parse(text);
    }
    switch (settings.parse) {
      case 'json': return parseJson(text);
      case 'code': return extractCode(text, settings.language || null);
      case 'markdown': return extractMarkdown(text);
      case 'svg': return extractSvg(text);
      default: return text;
    }
  }

  // ---------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------

  // Marketing description generation
  static async get_marketing_desc(promptString, apiKey, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    return Gen.generate_text(`Create a marketing description for the following: ${promptString}`, apiKey, provider,
      { system: 'generate marketing description', maxTokens: 800, customProxyHelper });
  }

  // Blog post generation
  static async get_blog_post(promptString, apiKey, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    return Gen.generate_text(`Write a blog post with section titles about ${promptString}`, apiKey, provider,
      { system: 'generate blog post', maxTokens: 1200, customProxyHelper });
  }

  // Image description
  static async getImageDescription(promptString, apiKey, customProxyHelper = null, provider = SupportedChatModels.OPENAI) {
    return Gen.generate_text(`Generate image description from the following text: ${promptString}`, apiKey, provider,
      { system: 'Generate image description', customProxyHelper });
  }

  // Generate image from description
  static async generate_image_from_desc(promptString, openaiKey, imageApiKey, is_base64 = true, width = 1024,
                                          height = 1024, provider = SupportedImageModels.STABILITY, customProxyHelper = null) {
    const imageDescription = await Gen.getImageDescription(promptString, openaiKey, customProxyHelper);
    const imgModel = new RemoteImageModel(imageApiKey, provider);
    const images = await imgModel.generateImages(
      new ImageModelInput({
        prompt: imageDescription,
        numberOfImages: 1,
        width: width,
        height: height,
        responseFormat: 'b64_json'
      })
    );
    return is_base64 ? images[0] : Buffer.from(images[0], "base64");
  }

  // Speech synthesis
  static async generate_speech_synthesis(text, googleKey) {
    const speechModel = new RemoteSpeechModel(googleKey, "google");
    const input = new Text2SpeechInput({ text: text, language: "en-gb" });
    return await speechModel.generateSpeech(input);
  }

  /** Landing page copy: { headline, subheadline, features, cta, socialProof, faq }. options: { featureCount, tone }. */
  static async generate_landing_copy(product, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('landing_copy', {
      text: product,
      feature_count: options.featureCount || 3,
      tone: options.tone || 'professional',
    }, apiKey, provider, options, { parse: 'json', defaults: { maxTokens: TOKENS.medium } });
  }

  /** FAQ list: [{ question, answer }]. options: { count, tone }. */
  static async generate_faq(topic, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('faq', {
      text: topic,
      count: options.count || 5,
      tone: options.tone || 'friendly and professional',
    }, apiKey, provider, options, { parse: 'json', defaults: { maxTokens: TOKENS.medium } });
  }

  /** SEO metadata: { title, description, keywords, openGraph, twitter, jsonLd, html }. options: { url, siteName }. */
  static async generate_seo_meta(pageDescription, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const meta = await Gen._generate('seo_meta', {
      text: pageDescription,
      url: options.url || 'https://example.com/',
      site_name: options.siteName || 'the website',
    }, apiKey, provider, options, { parse: 'json', defaults: { maxTokens: TOKENS.medium } });
    return { ...meta, html: renderSeoHtml(meta) };
  }

  /**
   * Translate a UI strings object (or JSON string) keeping keys and placeholders.
   * options: { targetLanguage (required), sourceLanguage }.
   */
  static async translate_ui_strings(strings, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    if (!options.targetLanguage) {
      throw new Error("translate_ui_strings requires options.targetLanguage, e.g. { targetLanguage: 'es' }");
    }
    const text = typeof strings === 'string' ? strings : JSON.stringify(strings, null, 2);
    return Gen._generate('translate_strings', {
      text,
      source_language: options.sourceLanguage || 'the source language',
      target_language: options.targetLanguage,
    }, apiKey, provider, options, { parse: 'json', defaults: { maxTokens: TOKENS.long, temperature: 0.2 } });
  }

  /** Release notes in Markdown. options: { version }. */
  static async generate_release_notes(changes, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('release_notes', {
      text: changes,
      version: options.version || 'Unreleased',
    }, apiKey, provider, options, { parse: 'markdown', defaults: { maxTokens: TOKENS.medium } });
  }

  /** README.md content in Markdown for a project description. */
  static async generate_readme(projectDescription, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('readme', { text: projectDescription }, apiKey, provider, options,
      { parse: 'markdown', defaults: { maxTokens: TOKENS.long } });
  }

  // ---------------------------------------------------------------------
  // Frontend
  // ---------------------------------------------------------------------

  // Generate HTML page
  static async generate_html_page(text, apiKey, model_name = DEFAULT_OPENAI_MODEL, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    return Gen._generate('html_page', { text }, apiKey, provider, {
      model: resolveLegacyModel(provider, model_name),
      maxTokens: legacyTokenSize(model_name, 4000),
      temperature: 0.8,
      customProxyHelper,
    }, {
      parse: 'json',
      system: 'generate html, css and javascript. Follow this template: {"html": "<code>", "message":"<text>"}',
    });
  }

  // Save HTML page (calls generate_html_page)
  static async save_html_page(text, folder, file_name, apiKey, model_name = DEFAULT_OPENAI_MODEL, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    const htmlCode = await Gen.generate_html_page(text, apiKey, model_name, provider, customProxyHelper);
    const folderPath = path.join(folder, file_name + '.html');
    FileHelper.writeDataToFile(folderPath, htmlCode['html']);
    return true;
  }

  // Generate dashboard
  static async generate_dashboard(csvStrData, topic, apiKey, model_name = DEFAULT_OPENAI_MODEL, num_graphs = 1, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    if (num_graphs < 1 || num_graphs > 4) {
      throw new Error('num_graphs must be between 1 and 4.');
    }
    const result = await Gen._generate('graph_dashboard', { count: num_graphs, topic, text: csvStrData }, apiKey, provider, {
      model: resolveLegacyModel(provider, model_name),
      maxTokens: legacyTokenSize(model_name, 3900),
      temperature: 0.3,
      customProxyHelper,
    }, {
      parse: 'json',
      system: 'Generate HTML graphs from CSV data. Response must be valid JSON with full HTML code.',
    });
    return Array.isArray(result) ? result[0] : result;
  }

  /**
   * UI component source code. options: { framework: react|vue|svelte|angular|html, language: javascript|typescript,
   * styling: css|tailwind|css-modules|styled-components }.
   */
  static async generate_component(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const framework = options.framework || 'react';
    return Gen._generate('component', {
      text: description,
      framework: FRAMEWORK_LABELS[framework] || framework,
      language: options.language || 'javascript',
      styling: options.styling || 'css',
    }, apiKey, provider, options, { parse: 'code', defaults: { maxTokens: TOKENS.long, temperature: 0.2 } });
  }

  /** Form with client-side validation. options: { framework: html|react|vue|svelte, action (URL to POST the values to) }. */
  static async generate_form(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const framework = options.framework || 'html';
    return Gen._generate('form', {
      text: description,
      framework: FRAMEWORK_LABELS[framework] || framework,
      submit: options.action
        ? `On submit, POST the values as JSON to ${options.action} and show the result to the user.`
        : 'On submit, prevent the default action and log the collected values as JSON.',
    }, apiKey, provider, options, { parse: 'code', defaults: { maxTokens: TOKENS.long, temperature: 0.2 } });
  }

  /** A page section (hero, pricing, features, testimonials, footer, ...). options: { sectionType, styling }. */
  static async generate_page_section(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('page_section', {
      text: description,
      section_type: options.sectionType || 'hero',
      styling: options.styling === 'tailwind' ? 'Tailwind CSS utility classes' : 'plain CSS',
    }, apiKey, provider, options, { parse: 'code', defaults: { maxTokens: TOKENS.long, temperature: 0.3 } });
  }

  /** Stylesheet or Tailwind markup. options: { format: css|scss|tailwind, html (markup to style) }. */
  static async generate_css(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const format = options.format || 'css';
    return Gen._generate('styles', {
      text: description,
      format: STYLE_FORMATS[format] || format,
      html_section: quoteBlock('Target this HTML markup:', options.html, 'html'),
    }, apiKey, provider, options, { parse: 'code', defaults: { maxTokens: TOKENS.medium, temperature: 0.2 } });
  }

  /** Accessibility fixes: { html, issues: [{ issue, fix, wcag }] }. */
  static async improve_accessibility(html, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('accessibility', { text: html }, apiKey, provider, options, {
      defaults: { maxTokens: TOKENS.long, temperature: 0.1 },
      parse: (text) => {
        const { html: fixed, details } = parseCodeWithDetails(text, 'html', 'html');
        return { html: fixed, issues: Array.isArray(details) ? details : (details.issues || []) };
      },
    });
  }

  /** Responsive, email-client-safe HTML email. */
  static async generate_email_template(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('email_template', { text: description }, apiKey, provider, options,
      { parse: 'code', language: 'html', defaults: { maxTokens: TOKENS.long, temperature: 0.3 } });
  }

  /** SVG icon markup. options: { size, style: outline|filled }. */
  static async generate_svg_icon(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('svg_icon', {
      text: description,
      size: options.size || 24,
      style: options.style === 'filled' ? 'filled (solid shapes)' : 'outline (stroke based, stroke-width 2, round line caps)',
    }, apiKey, provider, options, { parse: 'svg', defaults: { maxTokens: TOKENS.short, temperature: 0.2 } });
  }

  /** Color palette: { name, colors: [{ name, hex, usage }], css }. options: { count }. */
  static async generate_color_palette(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('color_palette', { text: description, count: options.count || 6 }, apiKey, provider, options,
      { parse: 'json', defaults: { maxTokens: TOKENS.short } });
  }

  // ---------------------------------------------------------------------
  // Backend and developer workflow
  // ---------------------------------------------------------------------

  /** API endpoint source. options: { framework: express|fastify|nextjs|koa|hono|flask|fastapi, language }. */
  static async generate_api_endpoint(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('api_endpoint', {
      text: description,
      framework: options.framework || 'Express',
      language: options.language || 'javascript',
    }, apiKey, provider, options, { parse: 'code', defaults: { maxTokens: TOKENS.medium, temperature: 0.2 } });
  }

  /** SQL statements. options: { dialect: postgresql|mysql|sqlite|sqlserver, schema (existing tables) }. */
  static async generate_sql(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('sql', {
      text: description,
      dialect: options.dialect || 'PostgreSQL',
      schema_section: quoteBlock('Existing schema:', options.schema, 'sql'),
    }, apiKey, provider, options, { parse: 'code', language: 'sql', defaults: { maxTokens: TOKENS.medium, temperature: 0.1 } });
  }

  /** JSON Schema (draft 2020-12) object for a data description. */
  static async generate_json_schema(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('json_schema', { text: description }, apiKey, provider, options,
      { parse: 'json', defaults: { maxTokens: TOKENS.medium, temperature: 0.1 } });
  }

  /** Realistic mock records as an array. options: { count }. */
  static async generate_mock_data(schema, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const text = typeof schema === 'string' ? schema : JSON.stringify(schema, null, 2);
    const result = await Gen._generate('mock_data', { text, count: options.count || 5 }, apiKey, provider, options,
      { parse: 'json', defaults: { maxTokens: TOKENS.long, temperature: 0.7 } });
    return Array.isArray(result) ? result : [result];
  }

  /**
   * Regular expression: { pattern, flags, explanation, matches, nonMatches, regex (RegExp), verified }.
   * verified is true when the pattern compiles and behaves as the model's own examples claim. options: { language }.
   */
  static async generate_regex(description, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const result = await Gen._generate('regex', { text: description, language: options.language || 'JavaScript' },
      apiKey, provider, options, { parse: 'json', defaults: { maxTokens: TOKENS.short, temperature: 0.1 } });
    result.matches = Array.isArray(result.matches) ? result.matches : [];
    result.nonMatches = Array.isArray(result.nonMatches) ? result.nonMatches : [];
    try {
      result.regex = new RegExp(result.pattern, (result.flags || '').replace('g', ''));
      result.verified = result.matches.every((sample) => result.regex.test(sample))
        && result.nonMatches.every((sample) => !result.regex.test(sample));
    } catch (error) {
      result.regex = null;
      result.verified = false;
    }
    return result;
  }

  /** Unit test file source. options: { framework: jest|vitest|mocha|pytest, modulePath }. */
  static async generate_unit_tests(code, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('unit_tests', {
      text: code,
      framework: options.framework || 'Jest',
      module_path: options.modulePath || './module',
    }, apiKey, provider, options, { parse: 'code', defaults: { maxTokens: TOKENS.long, temperature: 0.2 } });
  }

  /** Code review: { summary, score, issues: [{ severity, title, description, suggestion }] }. options: { language }. */
  static async review_code(code, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('code_review', { text: code, language: options.language || '' }, apiKey, provider, options,
      { parse: 'json', defaults: { maxTokens: TOKENS.medium, temperature: 0.1 } });
  }

  /** Explain code in Markdown. options: { language, audience }. */
  static async explain_code(code, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('explain_code', {
      text: code,
      language: options.language || '',
      audience: options.audience || 'junior developer',
    }, apiKey, provider, options, { parse: 'markdown', defaults: { maxTokens: TOKENS.medium } });
  }

  /** Fix a bug: { code, explanation, changes }. options: { problem (error message or description), language }. */
  static async fix_code(code, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('fix_code', {
      text: code,
      problem: options.problem || 'the code does not work as intended',
      language: options.language || '',
    }, apiKey, provider, options, {
      defaults: { maxTokens: TOKENS.long, temperature: 0.1 },
      parse: (text) => {
        const { code: fixed, details } = parseCodeWithDetails(text, 'code');
        return { code: fixed, explanation: details.explanation || '', changes: Array.isArray(details.changes) ? details.changes : [] };
      },
    });
  }

  /** Convert code between languages or frameworks. options: { from, to }. */
  static async convert_code(code, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('convert_code', {
      text: code,
      from: options.from || 'JavaScript',
      to: options.to || 'TypeScript',
    }, apiKey, provider, options, { parse: 'code', defaults: { maxTokens: TOKENS.long, temperature: 0.1 } });
  }

  /** Commit message for a diff. options: { style: conventional|plain }. */
  static async generate_commit_message(diff, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    return Gen._generate('commit_message', {
      text: diff,
      style_rule: options.style === 'plain'
        ? 'Use an imperative, capitalized subject line without a trailing period.'
        : 'Use the Conventional Commits format for the subject: type(scope): summary, where type is one of feat, fix, docs, style, refactor, perf, test, chore, build or ci, and the summary is imperative and lowercase.',
    }, apiKey, provider, options, { parse: 'text', defaults: { maxTokens: TOKENS.short, temperature: 0.2 } });
  }

  /**
   * OpenAPI document (plain object) from route code or an API description. The library normalises it so paths use
   * {param} keys, path parameters are declared, operationIds are unique and every $ref resolves.
   * options: { title, version, openapiVersion ('3.1.0'), basePath, serverUrl }.
   */
  static async generate_openapi_spec(input, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const doc = await Gen._generate('openapi_spec', {
      text: input,
      openapi_version: options.openapiVersion || '3.1.0',
    }, apiKey, provider, options, { parse: 'json', defaults: { maxTokens: TOKENS.long, temperature: 0.1 } });
    return normalizeOpenApi(doc, options);
  }

  /**
   * Design tokens: 11-step color scales, light/dark semantic roles, typography, radius and spacing, plus WCAG contrast,
   * CSS custom properties and a Tailwind theme.extend object computed by the library.
   * options: { brandColor, modes (['light', 'dark']), includeTypography, includeSpacing, cssPrefix ('color') }.
   */
  static async generate_design_tokens(input, apiKey, provider = SupportedChatModels.OPENAI, options = {}) {
    const modes = Array.isArray(options.modes) && options.modes.length ? options.modes : ['light', 'dark'];
    const raw = await Gen._generate('design_tokens', {
      text: input,
      brand_color_rule: options.brandColor
        ? `Use ${options.brandColor} exactly as primary 500.`
        : 'Choose a primary 500 color that fits the brand.',
      modes: modes.join(', '),
      typography_rule: options.includeTypography === false
        ? '- Set typography to null.'
        : '- typography has fontFamily with sans and mono font stacks, and fontSize from xs to 4xl as rem strings.',
      spacing_rule: options.includeSpacing === false
        ? '- Set spacing to null.'
        : '- spacing maps 1, 2, 3, 4, 6, 8, 12 and 16 to rem strings.',
    }, apiKey, provider, options, { parse: 'json', defaults: { maxTokens: TOKENS.long, temperature: 0.3 } });
    return normalizeDesignTokens(raw, { ...options, modes });
  }

  // Instruct update
  static async instructUpdate(modelOutput, userInstruction, type = '', apiKey, model_name = DEFAULT_OPENAI_MODEL, provider = SupportedLangModels.OPENAI, customProxyHelper = null) {
    return Gen._generate('instruct_update', { model_output: modelOutput, user_instruction: userInstruction, type }, apiKey, provider, {
      model: resolveLegacyModel(provider, model_name),
      maxTokens: (model_name || '').includes('gpt-4') ? 3900 : 2000,
      temperature: 0.2,
      customProxyHelper,
    }, {
      parse: 'text',
      legacy: true,
      system: 'Update the model message based on user feedback while maintaining format.',
    });
  }
}

module.exports = { Gen };
