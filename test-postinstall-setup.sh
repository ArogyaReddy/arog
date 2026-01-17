#!/bin/bash
# Test script to verify postinstall auto-setup works

set -e  # Exit on error

echo "======================================================================"
echo "🧪 Testing AROG Postinstall Auto-Setup"
echo "======================================================================"
echo ""

# Create temp directory
TEST_DIR="/tmp/test-arog-integration-$$"
echo "📁 Creating test directory: $TEST_DIR"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo ""
echo "📦 Copying AROG integration kit..."
cp -r /Users/arog/Learn/arog/arog-integration-kit/.arog .
cp -r /Users/arog/Learn/arog/arog-integration-kit/.github .

echo ""
echo "🔧 Running npm install (this should trigger MCP setup automatically)..."
cd .arog
npm install 2>&1 | tee install.log

echo ""
echo "✅ Checking if MCP setup ran..."

# Check if .vscode/settings.json was created
if [ -f "../.vscode/settings.json" ]; then
    echo "   ✅ .vscode/settings.json exists"
    echo "   📄 Contents:"
    cat ../.vscode/settings.json | head -20
else
    echo "   ❌ .vscode/settings.json NOT found (MCP setup may have failed)"
fi

echo ""
echo "📊 Installation log (last 30 lines):"
tail -30 install.log

echo ""
echo "🧹 Cleanup..."
cd /
rm -rf "$TEST_DIR"

echo ""
echo "======================================================================"
echo "✅ Test Complete!"
echo "======================================================================"
