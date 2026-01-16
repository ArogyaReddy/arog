#!/bin/bash

# AROG Documentation Quick Start
# This script provides easy access to AROG documentation

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║    📚  AROG Documentation - Quick Start                ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Choose how you want to view the documentation:"
echo ""
echo "1. 🌐 Start local server (recommended)"
echo "2. 🌍 Open in browser (file://)"
echo "3. 📝 View available documentation"
echo "4. ❌ Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
  1)
    echo ""
    echo "🚀 Starting AROG Documentation Server..."
    echo ""
    npm run docs:serve
    ;;
  2)
    echo ""
    echo "🌍 Opening AROG Agent in your default browser..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      open docs/arog-agent.html
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
      # Linux
      xdg-open docs/arog-agent.html
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
      # Windows
      start docs/arog-agent.html
    fi
    ;;
  3)
    echo ""
    echo "📚 Available Documentation:"
    echo ""
    echo "Core Documentation:"
    echo "  📖 arog-agent.html - Complete AROG story (MAIN PAGE)"
    echo "  🏠 index.html - Documentation home"
    echo "  🚀 setup-guide.html - Getting started"
    echo ""
    echo "Architecture & Configuration:"
    echo "  🏗️  architecture-guide.html - System architecture"
    echo "  ⚙️  configuration.html - Configuration guide"
    echo "  📚 api-reference.html - API documentation"
    echo ""
    echo "Advanced Guides:"
    echo "  🤖 arog-agent-complete-guide.html - @arog agent"
    echo "  🚀 deployment-success.html - Deployment guide"
    echo "  🔗 context-sharing-guide.html - Context sharing"
    echo ""
    echo "To view any page:"
    echo "  - Run this script and choose option 1 (server)"
    echo "  - Or run: npm run docs:serve"
    echo ""
    ;;
  4)
    echo ""
    echo "👋 Goodbye!"
    echo ""
    exit 0
    ;;
  *)
    echo ""
    echo "❌ Invalid choice. Please run the script again."
    echo ""
    exit 1
    ;;
esac
