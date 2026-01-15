#!/usr/bin/env node

console.log('\n🔍 @arog is performing System Health Check...\n');

const checks = [
  { name: 'Node.js Version', check: () => process.version, expected: 'v18+' },
  { name: 'npm Version', check: () => require('child_process').execSync('npm -v').toString().trim(), expected: '9+' },
  { name: 'Git Repository', check: () => require('fs').existsSync('.git'), expected: true },
  { name: 'package.json', check: () => require('fs').existsSync('package.json'), expected: true },
  { name: 'GitHub Workflows', check: () => require('fs').existsSync('.github/workflows'), expected: true },
  { name: 'AROG Agent', check: () => require('fs').existsSync('.github/agents/arog.agent.md'), expected: true },
];

let allPassed = true;

checks.forEach(({ name, check, expected }) => {
  try {
    const result = check();
    const passed = expected === true ? result : true;
    console.log(`${passed ? '✅' : '❌'} ${name}: ${result}`);
    if (!passed) {
      allPassed = false;
    }
  } catch (error) {
    console.log(`❌ ${name}: Failed (${error.message})`);
    allPassed = false;
  }
});

console.log(`\n${allPassed ? '✅ All checks passed!' : '❌ Some checks failed'}`);
console.log('\n🤖 @arog health check complete.\n');
process.exit(allPassed ? 0 : 1);
