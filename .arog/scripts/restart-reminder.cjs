#!/usr/bin/env node

/**
 * AROG - VS Code Restart Reminder
 * Shows clear instructions for restarting VS Code to activate MCP server
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bgYellow: '\x1b[43m\x1b[30m', // Yellow background, black text
};

function boxMessage(message, color = colors.yellow) {
  const lines = message.split('\n');
  const maxLength = Math.max(...lines.map(l => l.length));
  const border = '═'.repeat(maxLength + 4);
  
  console.log('');
  console.log(`${color}╔${border}╗${colors.reset}`);
  lines.forEach(line => {
    const padding = ' '.repeat(maxLength - line.length);
    console.log(`${color}║  ${line}${padding}  ║${colors.reset}`);
  });
  console.log(`${color}╚${border}╝${colors.reset}`);
  console.log('');
}

console.log('\n' + '━'.repeat(70));
console.log(`${colors.cyan}${colors.bright}🔄 VS CODE RESTART REQUIRED${colors.reset}`);
console.log('━'.repeat(70) + '\n');

boxMessage(
  '🎯 HOW TO RESTART VS CODE:\n\n' +
  '┌─ Option 1: Reload Window (Fastest) ─┐\n' +
  '│                                       │\n' +
  '│  1. Press Cmd+Shift+P (Mac)          │\n' +
  '│     or Ctrl+Shift+P (Win/Linux)      │\n' +
  '│                                       │\n' +
  '│  2. Type: "Reload Window"             │\n' +
  '│                                       │\n' +
  '│  3. Press Enter                       │\n' +
  '│                                       │\n' +
  '└───────────────────────────────────────┘\n\n' +
  '┌─ Option 2: Complete Restart ─────────┐\n' +
  '│                                       │\n' +
  '│  • Close VS Code completely           │\n' +
  '│  • Reopen VS Code                     │\n' +
  '│                                       │\n' +
  '└───────────────────────────────────────┘',
  colors.bgYellow
);

console.log(`${colors.cyan}📌 Why restart is needed:${colors.reset}\n`);
console.log('   • MCP server configuration was just updated');
console.log('   • VS Code needs to reload settings to activate it');
console.log('   • After restart, @arog will have browser automation!\n');

console.log(`${colors.yellow}⚠️  Without restart:${colors.reset}`);
console.log('   ❌ @arog cannot generate E2E tests');
console.log('   ❌ Browser automation features disabled');
console.log('   ❌ Playwright MCP agents won\'t work\n');

console.log('━'.repeat(70));
console.log(`${colors.cyan}${colors.bright}✨ After restart, verify MCP setup and see the magic!${colors.reset}`);
console.log('━'.repeat(70) + '\n');

boxMessage(
  '🎭 POST-RESTART VERIFICATION:\n\n' +
  '   Run this command to confirm MCP servers:\n\n' +
  '      arog verify-mcp\n\n' +
  '   This will:\n' +
  '   ✅ Verify all 8 MCP servers are configured\n' +
  '   🎭 Launch interactive demo of @arog capabilities\n' +
  '   📊 Show MCP server status\n' +
  '   🚀 Guide you through quick start examples',
  colors.cyan
);

console.log('');
