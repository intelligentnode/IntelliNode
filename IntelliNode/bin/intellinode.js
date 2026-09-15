#!/usr/bin/env node
/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const path = require('path');

const HELP = `intellinode - IntelliNode command line

Usage:
  intellinode mcp                       start the MCP server on stdio (for Claude Code, Cursor, VS Code, ...)
  intellinode mcp --http [options]      start the MCP server over Streamable HTTP
  intellinode --version                 print the package version
  intellinode help                      show this help

HTTP options:
  --port <n>       port to listen on (default 3210)
  --host <name>    interface to bind (default 127.0.0.1)
  --path <path>    MCP endpoint path (default /mcp)
  --origin <url>   extra allowed Origin (repeatable; localhost origins are always allowed)
  --debug          log protocol details to stderr

Provider keys are read from the environment or from a .env file in the current directory:
  OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, MISTRAL_API_KEY, COHERE_API_KEY, NVIDIA_API_KEY
  STABILITY_API_KEY (image generation)

Install in Claude Code:   claude mcp add intellinode -- npx -y intellinode mcp
`;

function parseArgs(argv) {
  const options = { http: false, port: 3210, host: '127.0.0.1', path: '/mcp', origins: [], debug: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (argv[i] === undefined) throw new Error(`${arg} needs a value`);
      return argv[i];
    };
    if (arg === '--http') options.http = true;
    else if (arg === '--stdio') options.http = false;
    else if (arg === '--debug') options.debug = true;
    else if (arg === '--port') options.port = Number(next());
    else if (arg === '--host') options.host = next();
    else if (arg === '--path') options.path = next();
    else if (arg === '--origin') options.origins.push(next());
    else if (arg.startsWith('--port=')) options.port = Number(arg.slice(7));
    else if (arg.startsWith('--host=')) options.host = arg.slice(7);
    else if (arg.startsWith('--path=')) options.path = arg.slice(7);
    else throw new Error(`Unknown option '${arg}'`);
  }
  if (!Number.isInteger(options.port) || options.port < 0 || options.port > 65535) throw new Error('--port must be 0-65535');
  if (!options.path.startsWith('/')) options.path = `/${options.path}`;
  return options;
}

function main(argv) {
  const [command, ...rest] = argv;
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    process.stdout.write(HELP);
    return;
  }
  if (command === '--version' || command === '-v' || command === 'version') {
    process.stdout.write(`${require('../package.json').version}\n`);
    return;
  }
  if (command !== 'mcp') {
    process.stderr.write(`Unknown command '${command}'.\n\n${HELP}`);
    process.exitCode = 1;
    return;
  }

  let options;
  try {
    options = parseArgs(rest);
  } catch (error) {
    process.stderr.write(`${error.message}\n\n${HELP}`);
    process.exitCode = 1;
    return;
  }

  // On stdio, stdout carries only MCP messages: route every console channel to stderr before loading the library.
  if (!options.http) {
    const toStderr = (...args) => console.error(...args);
    console.log = toStderr;
    console.info = toStderr;
    console.debug = toStderr;
  }
  require('dotenv').config({ path: path.join(process.cwd(), '.env'), quiet: true });

  const { MCPServer } = require('../mcp/server');
  const { createTools, configuredProviders } = require('../mcp/tools');
  const packageInfo = require('../package.json');

  const server = new MCPServer({
    name: 'intellinode',
    version: packageInfo.version,
    instructions: 'IntelliNode gives you the same tools on several LLM providers. Call list_providers to see which providers '
      + 'have keys, then use ask_model / consensus for cross-provider answers and the generate_* / review_code / fix_code '
      + 'tools for code. Pass provider to pick a provider explicitly; otherwise the first configured one is used.',
    tools: createTools(process.env),
    pageSize: Number(process.env.INTELLINODE_MCP_PAGE_SIZE) || 0,
    debug: options.debug,
  });
  const providers = configuredProviders(process.env).map((provider) => provider.id);
  const providerNote = providers.length ? `providers: ${providers.join(', ')}` : 'no provider key configured';

  const shutdown = () => {
    server.stop().then(() => process.exit(0), () => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  if (!options.http) {
    server.startStdio();
    process.stderr.write(`intellinode ${packageInfo.version} MCP server on stdio (${providerNote})\n`);
    return;
  }
  server.startHttp({ host: options.host, port: options.port, path: options.path, allowedOrigins: options.origins })
    .then((httpServer) => {
      const { port } = httpServer.address();
      process.stderr.write(`intellinode ${packageInfo.version} MCP server on http://${options.host}:${port}${options.path} (${providerNote})\n`);
    })
    .catch((error) => {
      process.stderr.write(`Could not start the HTTP server: ${error.message}\n`);
      process.exit(1);
    });
}

main(process.argv.slice(2));
