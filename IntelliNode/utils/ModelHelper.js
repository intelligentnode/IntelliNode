/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/

// Trailing tokens that force a gpt-5+ model onto /v1/chat/completions instead of /v1/responses.
const CHAT_ROUTE_OVERRIDE_SUFFIXES = [':chat', '#chat', '|chat'];

// "<family>-<major>[-<minor>]" inside a Claude id, e.g. claude-opus-4-8 -> (opus, 4, 8).
// The trailing (?!\d) keeps date suffixes (-20251001) and legacy "claude-3-7-sonnet-..." ids out.
const CLAUDE_VERSION_RE = /(opus|sonnet|haiku|fable|mythos)-(\d{1,2})(?:-(\d{1,2}))?(?!\d)/;

function hasRouteOverride(model) {
  if (!model) return false;
  const lowered = String(model).toLowerCase().trim();
  return CHAT_ROUTE_OVERRIDE_SUFFIXES.some((suffix) => lowered.endsWith(suffix));
}

/** Remove a trailing :chat / #chat / |chat token so the API receives a clean model id. */
function stripRouteOverride(model) {
  if (!hasRouteOverride(model)) return model;
  const trimmed = String(model).trim();
  const suffix = CHAT_ROUTE_OVERRIDE_SUFFIXES.find((s) => trimmed.toLowerCase().endsWith(s));
  return trimmed.slice(0, -suffix.length);
}

// Matches "gpt-<major>" anywhere in the name, as earlier releases routed any name containing
// "gpt-5" (e.g. Azure deployments like "prod-gpt-5") to the Responses API.
function gptMajorVersion(model) {
  const match = /gpt-(\d+)/.exec(String(model || '').toLowerCase().trim());
  return match ? parseInt(match[1], 10) : null;
}

/**
 * True for OpenAI gpt-5 and newer models, which use the /v1/responses endpoint.
 * A ":chat" suffix keeps a gpt-5+ model or deployment on chat completions.
 */
function isReasoningModel(model) {
  if (!model || hasRouteOverride(model)) return false;
  const major = gptMajorVersion(model);
  return major !== null && major >= 5;
}

/** True for chat-completions models that need max_completion_tokens and reject custom temperature (o-series, gpt-5+). */
function isReasoningChatModel(model) {
  const cleaned = String(stripRouteOverride(model) || '').toLowerCase().trim();
  if (/^o\d+(?:-|$)/.test(cleaned)) return true;
  const major = gptMajorVersion(cleaned);
  return major !== null && major >= 5;
}

/** The *-pro reasoning models only accept medium/high/xhigh effort. */
function defaultReasoningEffort(model) {
  return String(model || '').toLowerCase().includes('-pro') ? 'medium' : 'low';
}

/**
 * True for Claude models that reject temperature/top_p/top_k (Opus 4.7+ and the Claude 5 family).
 * Sonnet 4.x, Opus <= 4.6 and Haiku 4.5 still accept them.
 */
function claudeRejectsSamplingParams(model) {
  if (!model) return false;
  const lowered = String(model).toLowerCase();
  if (lowered.includes('mythos-preview')) return true;

  const match = CLAUDE_VERSION_RE.exec(lowered);
  if (!match) return false;
  const family = match[1];
  const major = parseInt(match[2], 10);
  const minor = match[3] !== undefined ? parseInt(match[3], 10) : null;
  if (major >= 5) return true;
  return family === 'opus' && major === 4 && minor !== null && minor >= 7;
}

// Tools can be written in chat-completions format ({type:'function', function:{...}}) or the flat
// Responses format ({type:'function', name, parameters}); these helpers convert to what each API expects.
// Accepts chat-completions tools ({ type, function }), Responses tools ({ type, name, parameters }) and plain
// definitions ({ name, description, parameters | input_schema }); returns the chat-completions shape.
function toChatTools(tools) {
  if (!Array.isArray(tools)) return tools;
  return tools.map((tool) => {
    if (!tool || typeof tool !== 'object' || tool.function) return tool;
    const plain = !tool.type && tool.name && (tool.parameters || tool.input_schema || tool.description);
    if ((tool.type === 'function' || plain) && tool.name) {
      const { name, description, strict } = tool;
      const parameters = tool.parameters !== undefined ? tool.parameters : tool.input_schema;
      return {
        type: 'function',
        function: {
          name,
          ...(description !== undefined && { description }),
          ...(parameters !== undefined && { parameters }),
          ...(strict !== undefined && { strict }),
        },
      };
    }
    return tool;
  });
}

function toResponsesTools(tools) {
  if (!Array.isArray(tools)) return tools;
  return toChatTools(tools).map((tool) => (tool && tool.type === 'function' && tool.function ? { type: 'function', ...tool.function } : tool));
}

function toAnthropicTools(tools) {
  if (!Array.isArray(tools)) return tools;
  return toChatTools(tools).map((tool) => {
    if (tool && tool.type === 'function') {
      const fn = tool.function || tool;
      return {
        name: fn.name,
        ...(fn.description !== undefined && { description: fn.description }),
        input_schema: fn.parameters || { type: 'object', properties: {} },
      };
    }
    return tool;
  });
}

function toChatToolChoice(choice) {
  if (choice && typeof choice === 'object' && choice.type === 'function' && !choice.function && choice.name) {
    return { type: 'function', function: { name: choice.name } };
  }
  return choice;
}

function toResponsesToolChoice(choice) {
  if (choice && typeof choice === 'object' && choice.type === 'function' && choice.function) {
    return { type: 'function', name: choice.function.name };
  }
  return choice;
}

function toAnthropicToolChoice(choice) {
  if (typeof choice === 'string') {
    const mapped = { auto: { type: 'auto' }, any: { type: 'any' }, required: { type: 'any' }, none: { type: 'none' } };
    return mapped[choice] || choice;
  }
  if (choice && typeof choice === 'object' && choice.type === 'function') {
    return { type: 'tool', name: choice.function ? choice.function.name : choice.name };
  }
  return choice;
}

/** Convert legacy chat-completions `functions` / `function_call` into tools / tool_choice. */
function functionsToTools(functions) {
  if (!Array.isArray(functions)) return functions;
  return functions.map((fn) => ({ type: 'function', function: fn }));
}

function functionCallToToolChoice(functionCall) {
  if (functionCall && typeof functionCall === 'object' && functionCall.name) {
    return { type: 'function', function: { name: functionCall.name } };
  }
  return functionCall;
}

module.exports = {
  stripRouteOverride,
  isReasoningModel,
  isReasoningChatModel,
  defaultReasoningEffort,
  claudeRejectsSamplingParams,
  toChatTools,
  toResponsesTools,
  toAnthropicTools,
  toChatToolChoice,
  toResponsesToolChoice,
  toAnthropicToolChoice,
  functionsToTools,
  functionCallToToolChoice,
};
