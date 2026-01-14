#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MAX_SIZE = 500 * 1024; // 500KB
const WARN_SIZE = 400 * 1024; // 400KB

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function checkBundleSize() {
  const bundlePath = path.join(__dirname, '..', 'dist', 'bundle.js');
  
  if (!fs.existsSync(bundlePath)) {
    console.log('⚠️  Bundle file not found. Run build first: npm run build');
    return;
  }
  
  const size = getFileSize(bundlePath);
  console.log(`\n📦 Bundle Size Check\n`);
  console.log(`File: ${bundlePath}`);
  console.log(`Size: ${formatSize(size)}`);
  console.log(`Limit: ${formatSize(MAX_SIZE)}`);
  console.log(`Warning: ${formatSize(WARN_SIZE)}\n`);
  
  if (size > MAX_SIZE) {
    console.error(`❌ Bundle size exceeds limit!`);
    console.error(`   Current: ${formatSize(size)}`);
    console.error(`   Maximum: ${formatSize(MAX_SIZE)}`);
    process.exit(1);
  } else if (size > WARN_SIZE) {
    console.warn(`⚠️  Bundle size approaching limit`);
    console.warn(`   Current: ${formatSize(size)}`);
    console.warn(`   Warning: ${formatSize(WARN_SIZE)}`);
  } else {
    console.log(`✅ Bundle size is within limits`);
  }
}

checkBundleSize();
