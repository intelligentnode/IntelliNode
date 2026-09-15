/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const WorkspaceToolkit = require('../utils/WorkspaceToolkit');
const { Chatbot } = require('./Chatbot');

const SYSTEM_PROMPT = `You are an autonomous coding agent working inside a repository workspace.

You interact ONLY by replying with a single JSON object per turn (no prose outside it):
{"thought": "<brief reasoning>", "tool": "<tool_name>", "args": { ... }}

Tools:
- read_file   {"path": "relative/path"}
- write_file  {"path": "relative/path", "content": "full file content"}
- edit_file   {"path": "relative/path", "old_text": "unique snippet", "new_text": "replacement"}
- list_files  {}
- search      {"pattern": "regex"}
- bash        {"command": "shell command"}
- finish      {"summary": "what you changed and why"}

Rules:
- One tool call per reply. Read code before editing it. Prefer minimal edits.
- old_text for edit_file must match the file content exactly and be unique.
- Call finish only when the task is complete.`;

// Find the end of the JSON object that starts at text[start]; string and escape aware, so braces inside
// file content do not end the object early. Returns -1 when the object is not closed.
function objectEnd(text, start) {
  let depth = 0;
  let inString = false;
  for (let i = start; i < text.length; i++) {
    const char = text[i];
    if (inString) {
      if (char === '\\') i += 1;
      else if (char === '"') inString = false;
    } else if (char === '"') {
      inString = true;
    } else if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

// Models routinely put literal newlines and tabs inside JSON strings (multi-line file content); escape them.
function escapeControlChars(json) {
  let out = '';
  let inString = false;
  for (let i = 0; i < json.length; i++) {
    const char = json[i];
    if (inString) {
      if (char === '\\') {
        out += char + (json[i + 1] || '');
        i += 1;
        continue;
      }
      if (char === '"') inString = false;
      else if (char === '\n') { out += '\\n'; continue; }
      else if (char === '\r') { out += '\\r'; continue; }
      else if (char === '\t') { out += '\\t'; continue; }
    } else if (char === '"') {
      inString = true;
    }
    out += char;
  }
  return out;
}

function parseObject(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    try {
      return JSON.parse(escapeControlChars(json));
    } catch (retryError) {
      return null;
    }
  }
}

/**
 * An autonomous coding loop over a workspace (SWE-agent pattern), on any chat provider.
 *
 * Each model reply is one JSON object choosing a tool (read_file, write_file, edit_file, list_files, search,
 * bash, finish); tool observations go back as user messages until the task is done. With a testCommand the
 * agent keeps iterating until the tests pass (exit code 0) or maxIterations is reached.
 *
 * const agent = new CodingAgent({ apiKey, provider: 'anthropic', workspace: './repo' });
 * const result = await agent.run('Fix the divide() bug', { testCommand: 'npm test' });
 */
class CodingAgent {
  /**
   * @param {object} settings - { apiKey, provider, model, options, workspace, allowBash, bashTimeout, maxIterations, chatFn, log, onAction }.
   *   apiKey/provider/model/options go to the Chatbot (options: baseUrl, timeout, retries, signal, ...).
   *   workspace: the directory the agent works in (every path is confined to it).
   *   chatFn: optional async (system, history) => text override, for tests or custom backends;
   *     history is [{ role: 'user' | 'assistant', content }].
   *   onAction: optional callback ({ iteration, tool, args, thought }) called before each tool runs.
   */
  constructor({
    apiKey = null, provider = 'openai', model = null, options = {}, workspace = '.',
    allowBash = true, bashTimeout = 120000, maxIterations = 20, chatFn = null, log = false, onAction = null,
  } = {}) {
    this.toolkit = new WorkspaceToolkit(workspace, { allowBash, bashTimeout });
    this.maxIterations = maxIterations;
    this.log = log;
    this.onAction = onAction;
    this.provider = provider;
    this.chatFn = chatFn || this.buildDefaultChatFn(apiKey, provider, model, options);
  }

  buildDefaultChatFn(apiKey, provider, model, options) {
    const chatbot = new Chatbot(apiKey, provider, options.customProxyHelper || null, options);
    return async (system, history) => {
      const input = Chatbot.createInput(provider, system, { ...(model && { model }), temperature: 0.2, maxTokens: 4096 });
      for (const message of history) {
        if (message.role === 'user') input.addUserMessage(message.content);
        else input.addAssistantMessage(message.content);
      }
      const response = await chatbot.chat(input);
      const replies = Array.isArray(response) ? response : response.result;
      const first = replies[0];
      if (typeof first === 'string') return first;
      return first && first.content ? String(first.content) : JSON.stringify(first);
    };
  }

  /**
   * Extract the intended tool-call JSON object from a model reply. Scans from every '{' with a string-aware
   * matcher, so braces inside file content do not corrupt parsing; when several objects are present the LAST
   * tool-bearing one wins, since models emit their chosen action after any reasoning.
   */
  static extractAction(text) {
    if (!text) return null;
    let found = null;
    let i = 0;
    while (i < text.length) {
      if (text[i] !== '{') {
        i += 1;
        continue;
      }
      const end = objectEnd(text, i);
      const object = end > 0 ? parseObject(text.slice(i, end)) : null;
      if (object && typeof object === 'object' && !Array.isArray(object) && 'tool' in object) {
        found = object;
        i = end;
      } else {
        i += 1;
      }
    }
    return found;
  }

  /**
   * Execute the coding task.
   * @param {string} task - what to do.
   * @param {object} options - { testCommand }: shell command that must exit 0 before finish is accepted.
   * @returns {Promise<{ success: boolean, summary: string, iterations: number, testOutput: string | null }>}
   */
  async run(task, { testCommand = null } = {}) {
    const history = [{ role: 'user', content: `Task: ${task}\n\nWorkspace files:\n${this.toolkit.listFiles()}` }];
    let testOutput = null;

    for (let iteration = 1; iteration <= this.maxIterations; iteration++) {
      const reply = await this.chatFn(SYSTEM_PROMPT, history);
      history.push({ role: 'assistant', content: reply });

      const action = CodingAgent.extractAction(reply);
      if (!action) {
        history.push({ role: 'user', content: 'Reply with a single valid JSON object using the documented format.' });
        continue;
      }

      const tool = action.tool;
      const args = action.args && typeof action.args === 'object' ? action.args : {};
      if (this.log) {
        const shown = tool === 'write_file' ? { path: args.path } : args;
        console.log(`[coder iter ${iteration}] ${tool} ${JSON.stringify(shown)}`);
      }
      if (this.onAction) await this.onAction({ iteration, tool, args, thought: action.thought });

      if (tool === 'finish') {
        const summary = args.summary || action.summary || 'Task finished.';
        if (testCommand) {
          testOutput = this.toolkit.runBash(testCommand);
          if (testOutput.startsWith('[exit code 0]')) {
            return { success: true, summary, iterations: iteration, testOutput };
          }
          // tests still failing: push the output back and keep iterating
          history.push({ role: 'user', content: `Tests are still failing. Fix them before finishing.\n${testOutput}` });
          continue;
        }
        return { success: true, summary, iterations: iteration, testOutput: null };
      }

      const observation = this.toolkit.execute(tool, args);
      history.push({ role: 'user', content: `[${tool} result]\n${observation}` });
    }

    // iteration budget exhausted; report the final test state when there is a test command
    if (testCommand && testOutput === null) testOutput = this.toolkit.runBash(testCommand);
    const success = Boolean(testCommand && testOutput && testOutput.startsWith('[exit code 0]'));
    return { success, summary: 'Stopped: max iterations reached.', iterations: this.maxIterations, testOutput };
  }
}

CodingAgent.SYSTEM_PROMPT = SYSTEM_PROMPT;

module.exports = { CodingAgent };
