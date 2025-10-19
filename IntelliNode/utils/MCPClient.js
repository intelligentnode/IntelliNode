/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const fetch = require('cross-fetch');
const connHelper = require('./ConnHelper');

/**
 * MCPClient - Simple Model Context Protocol client for connecting to MCP servers
 * Supports HTTP/SSE transport for tool execution and data retrieval
 * 
 * Usage:
 * const mcpClient = new MCPClient('http://localhost:3000');
 * const tools = await mcpClient.getTools();
 * const result = await mcpClient.callTool('tool_name', { param: 'value' });
 */
class MCPClient {
  constructor(serverUrl) {
    this.serverUrl = serverUrl.replace(/\/$/, ''); // remove trailing slash
    this.requestId = 0;
    this.tools = [];
  }

  /**
   * Initialize connection to MCP server and fetch available tools
   */
  async initialize() {
    try {
      this.tools = await this.getTools();
      return this.tools;
    } catch (error) {
      throw new Error(`Failed to initialize MCP client: ${error.message}`);
    }
  }

  /**
   * Get all available tools from MCP server
   */
  async getTools() {
    try {
      const response = await fetch(`${this.serverUrl}/mcp/tools`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.tools || [];
    } catch (error) {
      throw new Error(`Failed to fetch tools from MCP server: ${error.message}`);
    }
  }

  /**
   * Call a specific tool on the MCP server
   * @param {string} toolName - Name of the tool to call
   * @param {object} input - Input parameters for the tool
   * @returns {Promise<object>} Tool execution result
   */
  async callTool(toolName, input = {}) {
    try {
      const tool = this.tools.find(t => t.name === toolName);
      if (!tool) {
        throw new Error(`Tool '${toolName}' not found on MCP server`);
      }

      const payload = {
        jsonrpc: '2.0',
        id: ++this.requestId,
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: input
        }
      };

      const response = await fetch(`${this.serverUrl}/mcp/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Tool execution error: ${data.error.message}`);
      }

      return data.result || data;
    } catch (error) {
      throw new Error(`Failed to call tool '${toolName}': ${error.message}`);
    }
  }

  /**
   * Get tool by name with full details
   */
  getTool(toolName) {
    return this.tools.find(t => t.name === toolName) || null;
  }

  /**
   * Get all tool names
   */
  getToolNames() {
    return this.tools.map(t => t.name);
  }

  /**
   * Check if a tool exists
   */
  hasTool(toolName) {
    return this.tools.some(t => t.name === toolName);
  }

  /**
   * List tools with descriptions
   */
  listTools() {
    return this.tools.map(tool => ({
      name: tool.name,
      description: tool.description || 'No description available',
      inputSchema: tool.inputSchema || {}
    }));
  }
}

module.exports = MCPClient;
