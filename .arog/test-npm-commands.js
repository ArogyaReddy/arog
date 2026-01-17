#!/usr/bin/env node

// Simple test of the CLI npm command execution
import { spawn } from 'child_process';
import { join } from 'path';

const projectRoot = '/Users/arog/Learn/arog';

console.log('Testing npm command execution from CLI...\n');

console.log(`Project Root: ${projectRoot}\n`);

// Test 1: Simple npm test
console.log('Test 1: Running npm test...');
const child1 = spawn('npm test', {
  shell: true,
  cwd: projectRoot,
  env: { ...process.env, NODE_OPTIONS: '' },
  stdio: ['ignore', 'pipe', 'pipe']
});

let output1 = '';
child1.stdout.on('data', (data) => output1 += data.toString());
child1.stderr.on('data', (data) => output1 += data.toString());

child1.on('close', (code) => {
  console.log(`Exit code: ${code}`);
  if (code === 0) {
    console.log('✅ npm test SUCCESS\n');
  } else {
    console.log('❌ npm test FAILED');
    console.log('Output:', output1.substring(0, 200), '\n');
  }
  
  // Test 2: npm run (non-existent) || npm test
  console.log('Test 2: Running npm run nonexistent || npm test...');
  const child2 = spawn('npm run nonexistent || npm test', {
    shell: true,
    cwd: projectRoot,
    env: { ...process.env, NODE_OPTIONS: '' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  let output2 = '';
  child2.stdout.on('data', (data) => output2 += data.toString());
  child2.stderr.on('data', (data) => output2 += data.toString());
  
  child2.on('close', (code2) => {
    console.log(`Exit code: ${code2}`);
    if (code2 === 0) {
      console.log('✅ Fallback worked! npm test ran successfully\n');
    } else {
      console.log('❌ Fallback FAILED');
      console.log('Output:', output2.substring(0, 200), '\n');
    }
    
    console.log('Tests complete!');
  });
});
