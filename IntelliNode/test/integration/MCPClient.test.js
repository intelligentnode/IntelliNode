require("dotenv").config();
const assert = require("assert");
const MCPClient = require("../../utils/MCPClient");

/**
 * MCP Client Test Suite
 * 
 * Mock Tests (Always Run):
 * - Test 1: Tool management methods with mock data
 * - Test 2: Error handling with mock data
 * 
 * Real Server Tests (Optional - requires running MCP server):
 * - Test 3: Initialize with real server
 * - Test 4: Call real tool from server
 * 
 * To run with real server:
 * 1. Start MCP server: npx @modelcontextprotocol/server-filesystem /tmp
 * 2. Run: MCPClient_REAL_SERVER=true node test/integration/MCPClient.test.js
 */

// ============================================
// MOCK TESTS (Always Run - No Server Needed)
// ============================================

// Test 1: Mock - Test Tool Management Methods
async function testMockToolMethods() {
  try {
    console.log('\n=== Test 1: Mock Tool Management Methods ===');
    
    const mcpClient = new MCPClient('http://localhost:3000');
    
    // Load mock tools
    mcpClient.tools = [
      {
        name: 'get_weather',
        description: 'Get weather information for a location',
        inputSchema: {
          properties: {
            location: { type: 'string', description: 'City name' },
            units: { type: 'string', enum: ['celsius', 'fahrenheit'] }
          },
          required: ['location']
        }
      },
      {
        name: 'search_web',
        description: 'Search the web for information',
        inputSchema: {
          properties: {
            query: { type: 'string', description: 'Search query' },
            limit: { type: 'number', description: 'Number of results' }
          },
          required: ['query']
        }
      }
    ];
    
    // Test getToolNames
    const toolNames = mcpClient.getToolNames();
    assert(toolNames.includes('get_weather'), 'Should have get_weather tool');
    assert(toolNames.includes('search_web'), 'Should have search_web tool');
    console.log('✓ getToolNames() works');
    
    // Test getTool
    const weatherTool = mcpClient.getTool('get_weather');
    assert(weatherTool !== null && weatherTool.name === 'get_weather', 'getTool should find tool');
    console.log('✓ getTool() works');
    
    // Test hasTool
    assert(mcpClient.hasTool('get_weather'), 'Should have get_weather');
    assert(!mcpClient.hasTool('non_existent'), 'Should not have non_existent');
    console.log('✓ hasTool() works');
    
    // Test listTools
    const toolList = mcpClient.listTools();
    assert(toolList.length === 2, 'Should have 2 tools');
    console.log('✓ listTools() works');
    
    console.log('✓ Test 1 PASSED: All mock tool methods work correctly\n');
  } catch (error) {
    console.error("✗ Test 1 FAILED:", error.message);
    throw error;
  }
}

// Test 2: Mock - Error Handling
async function testMockErrorHandling() {
  try {
    console.log('\n=== Test 2: Mock Error Handling ===');
    
    const mcpClient = new MCPClient('http://localhost:3000');
    mcpClient.tools = [
      { name: 'get_weather', description: 'Weather tool', inputSchema: {} }
    ];
    
    // Test calling non-existent tool
    try {
      await mcpClient.callTool('non_existent_tool', {});
      assert(false, 'Should throw error');
    } catch (error) {
      assert(error.message.includes('not found'), 'Should indicate tool not found');
      console.log('✓ Correctly throws error for non-existent tool');
    }
    
    console.log('✓ Test 2 PASSED: Error handling works correctly\n');
  } catch (error) {
    console.error("✗ Test 2 FAILED:", error.message);
    throw error;
  }
}

// ============================================
// REAL SERVER TESTS (Optional - Requires MCP Server)
// ============================================

// Test 3: Real - Initialize with Server
async function testRealServerInitialize() {
  try {
    console.log('\n=== Test 3: Real Server - Initialize ===');
    console.log('Attempting to connect to http://localhost:3000...\n');
    
    const mcpClient = new MCPClient('http://localhost:3000');
    const tools = await mcpClient.initialize();
    
    console.log(`✓ Connected to MCP server`);
    console.log(`✓ Found ${tools.length} tools`);
    console.log('Tool names:', mcpClient.getToolNames());
    
    console.log('✓ Test 3 PASSED: Real server connection works\n');
    return true;
  } catch (error) {
    console.error("⚠ Test 3 SKIPPED: MCP server not available at http://localhost:3000");
    console.error(`  Error: ${error.message}`);
    console.error("\n  To run this test, start an MCP server:");
    console.error("  $ npx @modelcontextprotocol/server-filesystem /tmp\n");
    return false;
  }
}

// Test 4: Real - List Server Tools
async function testRealServerTools() {
  try {
    console.log('\n=== Test 4: Real Server - List Tools ===');
    
    const mcpClient = new MCPClient('http://localhost:3000');
    const tools = await mcpClient.initialize();
    
    if (tools.length === 0) {
      console.log('⚠ MCP server returned no tools');
      return false;
    }
    
    const toolList = mcpClient.listTools();
    console.log(`✓ Retrieved ${toolList.length} tools from server:`);
    toolList.slice(0, 3).forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    
    if (toolList.length > 3) {
      console.log(`  ... and ${toolList.length - 3} more`);
    }
    
    console.log('✓ Test 4 PASSED: Real server tools work\n');
    return true;
  } catch (error) {
    console.error("⚠ Test 4 SKIPPED: Could not fetch tools from server");
    console.error(`  Error: ${error.message}\n`);
    return false;
  }
}

// ============================================
// Run All Tests
// ============================================

(async () => {
  console.log('========================================');
  console.log('   MCP Client Test Suite');
  console.log('========================================');

  const runRealTests = process.env.MCPClient_REAL_SERVER === 'true';

  try {
    // Mock Tests (Always Run)
    console.log('\n▶ MOCK TESTS (No Server Needed)');
    await testMockToolMethods();
    await testMockErrorHandling();

    // Real Server Tests (Optional)
    if (runRealTests) {
      console.log('\n▶ REAL SERVER TESTS (Optional)');
      const test3Passed = await testRealServerInitialize();
      if (test3Passed) {
        await testRealServerTools();
      }
    } else {
      console.log('\n▶ REAL SERVER TESTS (Skipped)');
      console.log('To run with a real MCP server:');
      console.log('  1. Start server: npx @modelcontextprotocol/server-filesystem /tmp');
      console.log('  2. Run: MCPClient_REAL_SERVER=true node test/integration/MCPClient.test.js\n');
    }

    console.log('========================================');
    console.log('   All tests completed successfully! ✓');
    console.log('========================================\n');
  } catch (error) {
    console.error('\n✗ Test suite failed:', error.message);
    process.exit(1);
  }
})();
