#!/usr/bin/env node

/**
 * AROG MCP Server Configuration Setup
 * 
 * This script automatically configures VS Code to use AROG's Playwright MCP server.
 * 
 * Run this ONCE after integrating AROG into your project:
 *   node .arog/scripts/setup-mcp-server.js
 * 
 * What it does:
 * 1. Finds your project root
 * 2. Creates/updates .vscode/settings.json
 * 3. Adds AROG Playwright MCP server configuration
 * 4. Preserves your existing VS Code settings
 * 5. Installs Playwright browsers if needed
 * 
 * After running this, restart VS Code and @arog will have browser automation!
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  // Only log if not in silent mode
  if (!process.env.SILENT) {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }
}

function findProjectRoot() {
  let currentDir = __dirname;
  
  // Go up from .arog/scripts/ to project root
  while (currentDir !== '/') {
    const parentDir = path.dirname(currentDir);
    
    // Check if we're at the .arog directory
    if (path.basename(currentDir) === 'scripts' && 
        path.basename(path.dirname(currentDir)) === '.arog') {
      // Go up two levels: scripts -> .arog -> project root
      return path.dirname(path.dirname(currentDir));
    }
    
    currentDir = parentDir;
  }
  
  throw new Error('Could not find project root. Make sure this script is in .arog/scripts/');
}

function setupMCPServerConfig() {
  // Check if already configured
  const projectRoot = findProjectRoot();
  const settingsPath = path.join(projectRoot, '.vscode', 'settings.json');
  
  if (fs.existsSync(settingsPath)) {
    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      if (settings['mcp.servers'] && settings['mcp.servers']['arog-playwright']) {
        // Already configured, exit silently
        if (!process.env.VERBOSE) {
          return;
        }
        log('\n✓ MCP server already configured\n', 'green');
        return;
      }
    } catch (e) {
      // Continue with setup
    }
  }
  
  log('\n🤖 AROG MCP Server Setup\n', 'blue');
  
  try {
    // Find project root
    const projectRoot = findProjectRoot();
    log(`📁 Project root: ${projectRoot}`, 'green');
    
    // Path to .vscode/settings.json
    const vscodeDir = path.join(projectRoot, '.vscode');
    const settingsPath = path.join(vscodeDir, 'settings.json');
    
    // Create .vscode directory if it doesn't exist
    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir, { recursive: true });
      log('✅ Created .vscode directory', 'green');
    }
    
    // Read existing settings or create new
    let settings = {};
    if (fs.existsSync(settingsPath)) {
      try {
        const content = fs.readFileSync(settingsPath, 'utf8');
        settings = JSON.parse(content);
        log('✅ Found existing VS Code settings', 'green');
      } catch (error) {
        log('⚠️  Warning: Could not parse existing settings.json, will create new one', 'yellow');
      }
    }
    
    // Add/update MCP server configuration
    if (!settings['mcp.servers']) {
      settings['mcp.servers'] = {};
    }
    
    settings['mcp.servers']['arog-playwright'] = {
      "command": "node",
      "args": [
        "${workspaceFolder}/.arog/mcp-servers/playwright/index.js"
      ],
      "env": {},
      "description": "AROG Playwright MCP Server - Enables autonomous E2E test generation"
    };
    
    // Add search exclude for node_modules
    if (!settings['search.exclude']) {
      settings['search.exclude'] = {};
    }
    settings['search.exclude']['**/.arog/mcp-servers/playwright/node_modules'] = true;
    
    // Write settings back
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
    log('✅ Updated .vscode/settings.json with MCP server config', 'green');
    
    // Check if Playwright browsers are installed
    log('\n🌐 Checking Playwright browsers...', 'blue');
    try {
      execSync('npx playwright --version', { stdio: 'ignore' });
      log('✅ Playwright is installed', 'green');
      
      // Try to install browsers
      log('📥 Installing Playwright browsers (this may take a minute)...', 'yellow');
      execSync('npx playwright install chromium', { stdio: 'inherit' });
      log('✅ Playwright chromium browser installed', 'green');
    } catch (error) {
      log('⚠️  Warning: Could not install Playwright browsers automatically', 'yellow');
      log('   Please run manually: npx playwright install chromium', 'yellow');
    }
    
    // Success message (only if not in postinstall)
    if (!process.env.npm_lifecycle_event) {
      log('\n🎉 SUCCESS! MCP Server Configuration Complete\n', 'green');
      log('Next steps:', 'blue');
      log('  1. ✅ MCP server configured in .vscode/settings.json', 'green');
      log('  2. 🔄 Restart VS Code to activate the MCP server', 'yellow');
      log('  3. 🧪 Test it: @arog navigate to https://example.com', 'yellow');
      log('  4. 🚀 Generate tests: @arog generate E2E tests for my app\n', 'yellow');
    } else {
      log('✅ MCP server configured', 'green');
    }
    
    // Add .vscode to .gitignore if not already there
    const gitignorePath = path.join(projectRoot, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      let gitignore = fs.readFileSync(gitignorePath, 'utf8');
      if (!gitignore.includes('.vscode/')) {
        gitignore += '\n# VS Code settings (user-specific)\n.vscode/\n';
        fs.writeFileSync(gitignorePath, gitignore);
        log('✅ Added .vscode/ to .gitignore', 'green');
      }
    }
    
  } catch (error) {
    // Only show error if not in postinstall (silent mode)
    if (!process.env.npm_lifecycle_event) {
      log(`\n❌ Error: ${error.message}`, 'red');
      log('\nPlease report this issue at: https://github.com/ArogyaReddy/arog/issues', 'yellow');
    }
    // Don't exit with error in postinstall - don't break npm install
    if (process.env.npm_lifecycle_event === 'postinstall') {
      return;
    }
    process.exit(1);
  }
}

// Run setup
setupMCPServerConfig();
