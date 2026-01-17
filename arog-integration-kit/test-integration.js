#!/usr/bin/env node

/**
 * 🧪 AROG Integration Test Script
 * 
 * This script tests if .arog and .github folders are properly set up
 * for integration into a new project.
 * 
 * Usage:
 *   node test-integration.js [path-to-test-project]
 * 
 * If no path provided, tests the current AROG repository.
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import chalk from 'chalk';
import Table from 'cli-table3';

const projectPath = process.argv[2] || process.cwd();
const arogPath = join(projectPath, '.arog');
const githubPath = join(projectPath, '.github');

console.log('\n' + '='.repeat(70));
console.log(chalk.bold.cyan('  🧪 AROG INTEGRATION VALIDATION TEST'));
console.log('='.repeat(70) + '\n');

console.log(chalk.dim(`Testing project: ${projectPath}\n`));

// Test results
const results = {
  critical: [],
  required: [],
  optional: [],
  warnings: []
};

// Helper functions
function checkFile(filePath, category = 'required') {
  const exists = existsSync(filePath);
  const relativePath = filePath.replace(projectPath + '/', '');
  
  results[category].push({
    item: relativePath,
    status: exists ? '✅' : '❌',
    exists
  });
  
  return exists;
}

function checkDirectory(dirPath, category = 'required') {
  const exists = existsSync(dirPath);
  const relativePath = dirPath.replace(projectPath + '/', '');
  
  results[category].push({
    item: relativePath + '/',
    status: exists ? '✅' : '❌',
    exists
  });
  
  return exists;
}

// ============================================================================
// CRITICAL FILES (Must exist for AROG to work)
// ============================================================================

console.log(chalk.bold.yellow('🔴 CRITICAL FILES (MUST EXIST)\n'));

const criticalFiles = [
  '.arog/package.json',
  '.arog/bin/arog-cli.js',
  '.arog/scripts/first-time-setup.js',
  '.github/copilot-instructions.md'
];

criticalFiles.forEach(file => {
  checkFile(join(projectPath, file), 'critical');
});

// Check if package.json has bin entry
if (existsSync(join(arogPath, 'package.json'))) {
  const pkg = JSON.parse(readFileSync(join(arogPath, 'package.json'), 'utf-8'));
  const hasBin = pkg.bin && pkg.bin.arog;
  results.critical.push({
    item: '.arog/package.json → bin.arog',
    status: hasBin ? '✅' : '❌',
    exists: hasBin
  });
  
  const hasPostinstall = pkg.scripts && pkg.scripts.postinstall;
  results.critical.push({
    item: '.arog/package.json → scripts.postinstall',
    status: hasPostinstall ? '✅' : '❌',
    exists: hasPostinstall
  });
}

// ============================================================================
// REQUIRED FILES (Should exist for full functionality)
// ============================================================================

console.log(chalk.bold.yellow('\n🟡 REQUIRED FILES (HIGHLY RECOMMENDED)\n'));

const requiredFiles = [
  '.arog/README.md',
  '.arog/config/eslint/eslintrc.js',
  '.arog/config/eslint/prettierrc.json',
  '.arog/config/jest/jest.config.js',
  '.arog/config/playwright/playwright.config.js',
  '.arog/config/typescript/tsconfig.json',
  '.arog/config/webpack/webpack.config.js'
];

requiredFiles.forEach(file => {
  checkFile(join(projectPath, file), 'required');
});

// Check workflows
const workflowsPath = join(githubPath, 'workflows');
if (existsSync(workflowsPath)) {
  const workflows = readdirSync(workflowsPath).filter(f => f.endsWith('.yml'));
  
  results.required.push({
    item: `.github/workflows/ (${workflows.length} workflows)`,
    status: workflows.length > 0 ? '✅' : '❌',
    exists: workflows.length > 0
  });
  
  // Check for key workflows
  const keyWorkflows = [
    'arog-master-orchestrator.yml',
    'arog-unit-tests.yml',
    'arog-code-quality.yml'
  ];
  
  keyWorkflows.forEach(workflow => {
    const exists = workflows.includes(workflow);
    results.required.push({
      item: `.github/workflows/${workflow}`,
      status: exists ? '✅' : '❌',
      exists
    });
  });
} else {
  results.required.push({
    item: '.github/workflows/',
    status: '❌',
    exists: false
  });
}

// ============================================================================
// OPTIONAL FEATURES (Nice to have)
// ============================================================================

console.log(chalk.bold.yellow('\n🟢 OPTIONAL FEATURES\n'));

const optionalDirs = [
  '.arog/skills',
  '.arog/prompts',
  '.arog/config'
];

optionalDirs.forEach(dir => {
  checkDirectory(join(projectPath, dir), 'optional');
});

// ============================================================================
// PRINT RESULTS
// ============================================================================

function printTable(title, items, severity) {
  if (items.length === 0) return;
  
  console.log(chalk.bold(title) + '\n');
  
  const table = new Table({
    head: ['Status', 'Item'],
    colWidths: [10, 60],
    style: {
      head: severity === 'critical' ? ['red', 'bold'] :
            severity === 'required' ? ['yellow', 'bold'] :
            ['green', 'bold']
    }
  });
  
  items.forEach(item => {
    table.push([item.status, item.item]);
  });
  
  console.log(table.toString());
  console.log('');
}

console.log('\n' + '='.repeat(70));
console.log(chalk.bold.cyan('  📊 VALIDATION RESULTS'));
console.log('='.repeat(70) + '\n');

printTable('🔴 CRITICAL FILES', results.critical, 'critical');
printTable('🟡 REQUIRED FILES', results.required, 'required');
printTable('🟢 OPTIONAL FEATURES', results.optional, 'optional');

// ============================================================================
// SUMMARY
// ============================================================================

const criticalPassed = results.critical.filter(r => r.exists).length;
const criticalTotal = results.critical.length;
const requiredPassed = results.required.filter(r => r.exists).length;
const requiredTotal = results.required.length;
const optionalPassed = results.optional.filter(r => r.exists).length;
const optionalTotal = results.optional.length;

const allCriticalPassed = criticalPassed === criticalTotal;
const allRequiredPassed = requiredPassed === requiredTotal;

console.log('='.repeat(70));
console.log(chalk.bold('  📈 SUMMARY'));
console.log('='.repeat(70) + '\n');

const summaryTable = new Table({
  head: ['Category', 'Passed', 'Total', 'Status'],
  colWidths: [20, 10, 10, 30]
});

summaryTable.push(
  [
    'Critical Files',
    criticalPassed,
    criticalTotal,
    allCriticalPassed ? chalk.green('✅ PASS') : chalk.red('❌ FAIL')
  ],
  [
    'Required Files',
    requiredPassed,
    requiredTotal,
    allRequiredPassed ? chalk.green('✅ PASS') : chalk.yellow('⚠️  INCOMPLETE')
  ],
  [
    'Optional Features',
    optionalPassed,
    optionalTotal,
    chalk.dim('ℹ️  Optional')
  ]
);

console.log(summaryTable.toString());
console.log('');

// ============================================================================
// FINAL VERDICT
// ============================================================================

console.log('='.repeat(70));

if (allCriticalPassed && allRequiredPassed) {
  console.log(chalk.bold.green('\n  ✅ INTEGRATION READY!'));
  console.log(chalk.green('  All critical and required files are present.'));
  console.log(chalk.green('  You can safely copy .arog/ and .github/ folders.\n'));
  console.log(chalk.dim('  Next steps:'));
  console.log(chalk.dim('    1. cd .arog && npm install'));
  console.log(chalk.dim('    2. npx arog'));
  console.log(chalk.dim('    3. Enjoy automated workflows! 🚀\n'));
  process.exit(0);
} else if (allCriticalPassed) {
  console.log(chalk.bold.yellow('\n  ⚠️  MOSTLY READY'));
  console.log(chalk.yellow('  All critical files present, but some required files missing.'));
  console.log(chalk.yellow('  AROG will work, but some features may be limited.\n'));
  console.log(chalk.dim('  Missing required files:'));
  results.required
    .filter(r => !r.exists)
    .forEach(r => console.log(chalk.dim(`    - ${r.item}`)));
  console.log('');
  process.exit(0);
} else {
  console.log(chalk.bold.red('\n  ❌ NOT READY'));
  console.log(chalk.red('  Critical files are missing. AROG will not work.\n'));
  console.log(chalk.dim('  Missing critical files:'));
  results.critical
    .filter(r => !r.exists)
    .forEach(r => console.log(chalk.dim(`    - ${r.item}`)));
  console.log('');
  console.log(chalk.yellow('  Fix these issues before integrating AROG.\n'));
  process.exit(1);
}

console.log('='.repeat(70) + '\n');
