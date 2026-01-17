#!/usr/bin/env node

/**
 * Comprehensive CLI Test Script
 * Tests all features of the interactive CLI
 */

import { spawn } from 'child_process';
import chalk from 'chalk';

console.log(chalk.cyan.bold('\n🧪 TESTING AROG INTERACTIVE CLI\n'));
console.log('='.repeat(70) + '\n');

const tests = [
  {
    name: 'Help Flag',
    command: 'node bin/arog-cli.js --help',
    expectedOutput: 'AROG Interactive CLI',
    timeout: 5000
  },
  {
    name: 'Health Check',
    command: 'node bin/arog-cli.js --health',
    expectedOutput: 'PROJECT STATUS',
    timeout: 5000
  },
  {
    name: 'Welcome Screen',
    command: 'node bin/arog-cli.js --welcome',
    expectedOutput: 'QUICK START GUIDE',
    timeout: 5000
  }
];

let passed = 0;
let failed = 0;

async function runTest(test) {
  return new Promise((resolve) => {
    console.log(chalk.yellow(`Testing: ${test.name}...`));
    
    const child = spawn(test.command, { shell: true, timeout: test.timeout });
    let output = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    const timer = setTimeout(() => {
      child.kill();
      console.log(chalk.red(`  ✗ ${test.name} - TIMEOUT\n`));
      failed++;
      resolve();
    }, test.timeout);
    
    child.on('close', (code) => {
      clearTimeout(timer);
      
      if (output.includes(test.expectedOutput)) {
        console.log(chalk.green(`  ✓ ${test.name} - PASSED\n`));
        passed++;
      } else {
        console.log(chalk.red(`  ✗ ${test.name} - FAILED`));
        console.log(chalk.dim(`    Expected: "${test.expectedOutput}"`));
        console.log(chalk.dim(`    Got: ${output.substring(0, 100)}...\n`));
        failed++;
      }
      
      resolve();
    });
  });
}

async function runAllTests() {
  for (const test of tests) {
    await runTest(test);
  }
  
  console.log('='.repeat(70));
  console.log(chalk.cyan.bold('\n📊 TEST RESULTS\n'));
  console.log(chalk.green(`✓ Passed: ${passed}`));
  console.log(chalk.red(`✗ Failed: ${failed}`));
  console.log(chalk.cyan(`📈 Total:  ${passed + failed}\n`));
  
  if (failed === 0) {
    console.log(chalk.green.bold('🎉 ALL TESTS PASSED!\n'));
  } else {
    console.log(chalk.yellow.bold('⚠️  SOME TESTS FAILED\n'));
  }
  
  console.log('='.repeat(70) + '\n');
}

runAllTests().catch(console.error);
