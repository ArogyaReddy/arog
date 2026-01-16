#!/usr/bin/env node

/**
 * AROG - Mutation Testing Runner
 * Tests the quality of your tests by introducing mutations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(`
======================================================================

   🧬 MUTATION TESTING - Testing Your Tests

   "If your tests don't fail when code is broken,
    what are they actually testing?"

======================================================================
`);

function runCommand(command, description) {
  console.log(`\n🔧 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed`);
    return false;
  }
}

function checkStrykerInstalled() {
  try {
    require.resolve('@stryker-mutator/core');
    return true;
  } catch {
    console.log('\n⚠️  Stryker Mutator not installed!');
    console.log('Installing @stryker-mutator/core...\n');
    return runCommand('npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner', 'Installing Stryker');
  }
}

function createStrykerConfig() {
  const configPath = path.join(process.cwd(), 'stryker.conf.json');
  
  if (!fs.existsSync(configPath)) {
    console.log('\n📝 Creating Stryker configuration...');
    
    const config = {
      "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
      "packageManager": "npm",
      "reporters": ["html", "clear-text", "progress", "dashboard"],
      "testRunner": "jest",
      "coverageAnalysis": "perTest",
      "mutate": [
        "src/**/*.js",
        "!src/**/*.test.js",
        "!src/**/*.spec.js"
      ],
      "thresholds": {
        "high": 80,
        "low": 60,
        "break": 50
      },
      "timeoutMS": 60000,
      "maxConcurrentTestRunners": 2
    };
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('✅ Stryker configuration created');
  }
}

function runMutationTests() {
  console.log('\n🧬 Running mutation tests...');
  console.log('This may take several minutes...\n');
  
  const success = runCommand('npx stryker run', 'Mutation testing');
  
  if (success) {
    console.log('\n✅ Mutation testing complete!');
    console.log('📊 Report: ./reports/mutation/html/index.html');
  } else {
    console.log('\n⚠️  Mutation testing not yet configured');
    console.log('Run: npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner');
  }
}

// Main execution
if (require.main === module) {
  console.log('🔍 Checking Stryker installation...');
  
  const isInstalled = checkStrykerInstalled();
  
  if (isInstalled) {
    createStrykerConfig();
    runMutationTests();
  }
}

module.exports = { checkStrykerInstalled, createStrykerConfig, runMutationTests };
