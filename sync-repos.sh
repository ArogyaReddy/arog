#!/bin/bash

# AROG Repository Sync Script
# Syncs integration kit to main repo

echo "======================================================================"
echo "  🔄 AROG REPOSITORY SYNC"
echo "======================================================================"
echo ""
echo "Syncing from:"
echo "  SOURCE: /Users/arog/Learn/arog/arog-integration-kit/"
echo "  TARGET: /Users/arog/Learn/arog/"
echo ""

cd /Users/arog/Learn/arog || exit 1

echo "📦 Syncing .arog/scripts..."
cp -v arog-integration-kit/.arog/scripts/setup-mcp-servers.js .arog/scripts/
cp -v arog-integration-kit/.arog/scripts/restart-reminder.js .arog/scripts/
cp -v arog-integration-kit/.arog/scripts/test-mcp-setup.js .arog/scripts/
cp -v arog-integration-kit/.arog/scripts/setup-mcp-server.js .arog/scripts/

echo ""
echo "📦 Syncing .arog/package.json..."
cp -v arog-integration-kit/.arog/package.json .arog/

echo ""
echo "📦 Syncing .vscode/settings.json..."
mkdir -p .vscode
cp -v arog-integration-kit/.vscode/settings.json .vscode/

echo ""
echo "📦 Syncing .github/agents..."
cp -rv arog-integration-kit/.github/agents .github/

echo ""
echo "======================================================================"
echo "  ✅ SYNC COMPLETE!"
echo "======================================================================"
echo ""
echo "Verification:"
echo ""

echo "1. Check JIRA in setup-mcp-servers.js:"
grep -c "jira" .arog/scripts/setup-mcp-servers.js | xargs echo "   JIRA references found:"

echo ""
echo "2. Check MCP servers in VS Code settings:"
grep -c '"command": "npx"' .vscode/settings.json | xargs echo "   MCP servers configured:"

echo ""
echo "3. Check package.json scripts:"
grep -q "arog:setup-mcp-servers" .arog/package.json && echo "   ✅ arog:setup-mcp-servers found" || echo "   ❌ Missing"
grep -q "arog:test-mcp-setup" .arog/package.json && echo "   ✅ arog:test-mcp-setup found" || echo "   ❌ Missing"

echo ""
echo "======================================================================"
echo "  Both locations are now synced and up-to-date!"
echo "  You can use EITHER folder for new repos ✅"
echo "======================================================================"
echo ""
