#!/bin/bash

# Quick test script for AROG CLI
cd /Users/arog/Learn/arog/.arog

echo "=== Testing AROG CLI ==="
echo ""

echo "1. Testing project root finder..."
node test-root-finder.js 2>&1 | grep -v "Debugger"

echo ""
echo "2. Testing if npm test works from project root..."
cd /Users/arog/Learn/arog
NODE_OPTIONS="" timeout 10 npm test 2>&1 | grep -E "(Tests:|Test Suites:)" || echo "Test timed out or failed"

echo ""
echo "3. Checking npm scripts available..."
cd /Users/arog/Learn/arog
npm run 2>&1 | grep -E "(test|lint|security|build)" | head -10

echo ""
echo "Done!"
