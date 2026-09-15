/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const fs = require('fs');
const path = require('path');

// Directories skipped when listing or searching.
const SKIP_DIRS = new Set(['.git', '__pycache__', 'node_modules', '.venv', 'venv', '.idea', 'dist']);

/**
 * Local file and shell tools for coding agents, scoped to one workspace directory: the toolkit refuses to read
 * or write anything outside it. Used by CodingAgent, usable on its own. Node only.
 *
 * const tools = new WorkspaceToolkit('./repo', { allowBash: true, bashTimeout: 120000 });
 * tools.readFile('src/index.js'); tools.runBash('npm test');
 */
class WorkspaceToolkit {
  constructor(workspaceDir, { allowBash = true, bashTimeout = 120000, maxReadChars = 60000, maxOutputChars = 20000 } = {}) {
    if (!workspaceDir || !fs.existsSync(workspaceDir) || !fs.statSync(workspaceDir).isDirectory()) {
      throw new Error(`Workspace directory does not exist: ${workspaceDir}`);
    }
    this.workspace = fs.realpathSync(workspaceDir);
    this.allowBash = allowBash;
    // milliseconds
    this.bashTimeout = bashTimeout;
    this.maxReadChars = maxReadChars;
    this.maxOutputChars = maxOutputChars;
    this.skipDirs = new Set(SKIP_DIRS);
  }

  // ---- internals ----

  /** Resolve a relative path inside the workspace; reject escapes (including through symlinks). */
  resolve(relativePath) {
    const target = path.resolve(this.workspace, relativePath || '');
    // follow symlinks of the deepest existing ancestor so a link cannot point outside
    let existing = target;
    while (!fs.existsSync(existing)) {
      const parent = path.dirname(existing);
      if (parent === existing) break;
      existing = parent;
    }
    const real = fs.realpathSync(existing) + target.slice(existing.length);
    if (real !== this.workspace && !real.startsWith(this.workspace + path.sep)) {
      throw new Error(`Path escapes the workspace: ${relativePath}`);
    }
    return real;
  }

  truncate(text, limit) {
    if (text.length > limit) {
      return `${text.slice(0, limit)}\n... [truncated ${text.length - limit} chars]`;
    }
    return text;
  }

  *iterFiles(dir = this.workspace) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (error) {
      return;
    }
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!this.skipDirs.has(entry.name)) yield* this.iterFiles(full);
      } else if (entry.isFile()) {
        yield full;
      }
    }
  }

  // ---- tools ----

  readFile(relativePath) {
    const full = this.resolve(relativePath);
    return this.truncate(fs.readFileSync(full, 'utf8'), this.maxReadChars);
  }

  writeFile(relativePath, content = '') {
    const full = this.resolve(relativePath);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content, 'utf8');
    return `Wrote ${content.length} chars to ${relativePath}`;
  }

  /** Exact, unique string replacement (safer than a regex for code edits). */
  editFile(relativePath, oldText = '', newText = '') {
    const full = this.resolve(relativePath);
    const content = fs.readFileSync(full, 'utf8');
    if (!oldText) return `Error: old_text is required for edit_file`;
    const count = content.split(oldText).length - 1;
    if (count === 0) return `Error: old_text not found in ${relativePath}`;
    if (count > 1) return `Error: old_text appears ${count} times in ${relativePath}; provide a unique snippet`;
    fs.writeFileSync(full, content.replace(oldText, () => newText), 'utf8');
    return `Edited ${relativePath}`;
  }

  listFiles(maxFiles = 200) {
    const files = [];
    for (const full of this.iterFiles()) {
      files.push(path.relative(this.workspace, full));
      if (files.length >= maxFiles) {
        files.push('... [more files omitted]');
        break;
      }
    }
    return files.length ? files.join('\n') : '(empty workspace)';
  }

  /** Regex search across workspace files; returns file:line: text matches. */
  search(pattern, maxResults = 50) {
    let regex;
    try {
      regex = new RegExp(pattern);
    } catch (error) {
      return `Error: invalid regex: ${error.message}`;
    }
    const results = [];
    for (const full of this.iterFiles()) {
      const relative = path.relative(this.workspace, full);
      let lines;
      try {
        lines = fs.readFileSync(full, 'utf8').split('\n');
      } catch (error) {
        continue;
      }
      for (let i = 0; i < lines.length; i++) {
        if (regex.test(lines[i])) {
          results.push(`${relative}:${i + 1}: ${lines[i].trimEnd().slice(0, 200)}`);
          if (results.length >= maxResults) {
            results.push('... [more results omitted]');
            return results.join('\n');
          }
        }
      }
    }
    return results.length ? results.join('\n') : 'No matches found.';
  }

  /** Run a shell command in the workspace; returns the exit code and the combined output. */
  runBash(command) {
    if (!this.allowBash) return 'Error: bash execution is disabled for this agent';
    // required lazily: the browser bundle maps child_process to an empty module
    const { spawnSync } = require('child_process');
    // no .pyc caching for Python workspaces: rapid edit and test cycles would run stale bytecode
    const env = { ...process.env, PYTHONDONTWRITEBYTECODE: '1' };
    const result = spawnSync(command, { shell: true, cwd: this.workspace, env, timeout: this.bashTimeout, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    if (result.error && result.error.code === 'ETIMEDOUT') {
      return `Error: command timed out after ${Math.round(this.bashTimeout / 1000)}s`;
    }
    if (result.error) return `Error: ${result.error.message}`;
    const output = (result.stdout || '') + (result.stderr || '');
    const code = result.status === null ? `signal ${result.signal}` : result.status;
    return `[exit code ${code}]\n${this.truncate(output, this.maxOutputChars)}`;
  }

  // ---- dispatch used by the agent loop ----

  /** Execute a named tool with an args object; always returns a string observation. */
  execute(tool, args = {}) {
    const need = (name) => {
      if (args[name] === undefined || args[name] === null) throw new Error(`missing required argument '${name}' for tool '${tool}'`);
      return args[name];
    };
    try {
      switch (tool) {
        case 'read_file': return this.readFile(need('path'));
        case 'write_file': return this.writeFile(need('path'), args.content === undefined ? '' : String(args.content));
        case 'edit_file': return this.editFile(need('path'), args.old_text === undefined ? '' : String(args.old_text), args.new_text === undefined ? '' : String(args.new_text));
        case 'list_files': return this.listFiles();
        case 'search': return this.search(args.pattern === undefined ? '' : String(args.pattern));
        case 'bash': return this.runBash(args.command === undefined ? '' : String(args.command));
        default: return `Error: unknown tool '${tool}'`;
      }
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }
}

module.exports = WorkspaceToolkit;
