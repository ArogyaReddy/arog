#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 AROG Setup Script\n');

const steps = [
  {
    name: 'Install Dependencies',
    command: 'npm install',
  },
  {
    name: 'Install Playwright Browsers',
    command: 'npx playwright install',
  },
  {
    name: 'Create Test Directory Structure',
    action: () => {
      const dirs = ['tests/e2e', 'tests/accessibility', 'tests/unit', 'src/utils'];
      dirs.forEach(dir => {
        const fullPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
          console.log(`  ✅ Created ${dir}`);
        }
      });
    },
  },
  {
    name: 'Validate Configuration',
    command: 'node scripts/health-check.js',
  },
];

steps.forEach((step, index) => {
  console.log(`\n📋 Step ${index + 1}/${steps.length}: ${step.name}`);
  try {
    if (step.command) {
      execSync(step.command, { stdio: 'inherit' });
    } else if (step.action) {
      step.action();
    }
    console.log(`✅ ${step.name} - Complete`);
  } catch (error) {
    console.error(`❌ ${step.name} - Failed`);
    console.error(error.message);
  }
});

console.log('\n\n🎉 AROG Setup Complete!\n');
console.log('Next steps:');
console.log('  1. Run tests: npm test');
console.log('  2. Start docs server: npm run docs:serve');
console.log('  3. Chat with @arog in VS Code\n');
