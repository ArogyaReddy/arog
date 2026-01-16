#!/bin/bash

# AROG Structure Migration Script
# Migrates event-driven-app to new AROG structure
# Date: January 16, 2026

set -e  # Exit on error

echo "======================================================================="
echo ""
echo "   ███████╗██████╗  ██████╗  ██████╗ "
echo "  ██╔══██╗██╔══██╗██╔═══██╗██╔════╝ "
echo "  ███████║██████╔╝██║   ██║██║  ███╗"
echo "  ██╔══██║██╔══██╗██║   ██║██║   ██║"
echo "  ██║  ██║██║  ██║╚██████╔╝╚██████╔╝"
echo "  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ "
echo ""
echo "  🤖 Structure Migration Tool"
echo "  📍 Migrating to Latest AROG Architecture"
echo ""
echo "======================================================================="
echo ""

# Configuration
SOURCE_DIR="/Users/arog/Learn/arog"
TARGET_DIR="/Users/arog/Learn/event-driven-app"

echo "📋 Migration Plan:"
echo "   Source: $SOURCE_DIR (latest structure)"
echo "   Target: $TARGET_DIR (your project)"
echo ""

# Confirm
read -p "🤔 Continue with migration? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Migration cancelled"
    exit 1
fi

echo ""
echo "🔄 Starting migration..."
echo ""

# Step 1: Backup
echo "📦 Step 1/5: Creating backups..."
cd "$TARGET_DIR"
if [ -d ".arog" ]; then
    cp -r .arog .arog.backup.$(date +%Y%m%d_%H%M%S)
    echo "   ✅ Backed up .arog folder"
fi
if [ -d ".github" ]; then
    cp -r .github .github.backup.$(date +%Y%m%d_%H%M%S)
    echo "   ✅ Backed up .github folder"
fi
echo ""

# Step 2: Copy AI Prompts
echo "🤖 Step 2/5: Installing AI prompts and templates..."
mkdir -p .arog/prompts
cp -r "$SOURCE_DIR/.arog/prompts/templates" .arog/prompts/
cp "$SOURCE_DIR/.arog/prompts/README.md" .arog/prompts/
echo "   ✅ Copied 3 prompt templates"
echo "      - code-review-comprehensive.md"
echo "      - test-generation-comprehensive.md"
echo "      - performance-optimization.md"
echo ""

# Step 3: Copy Skills
echo "🎯 Step 3/5: Installing professional skills..."
mkdir -p .arog/skills
cp -r "$SOURCE_DIR/.arog/skills/implementations" .arog/skills/
cp "$SOURCE_DIR/.arog/skills/README.md" .arog/skills/
echo "   ✅ Copied 6 professional skills"
echo "      - code-complexity-analyzer.json"
echo "      - test-generator-pro.json"
echo "      - vulnerability-scanner-pro.json"
echo "      - bundle-optimizer.json"
echo "      - code-modernizer.json"
echo "      - health-monitor-pro.json"
echo ""

# Step 4: Copy Model Routing (Cost Optimization)
echo "💰 Step 4/5: Installing smart cost optimization..."
cp "$SOURCE_DIR/.arog/model-routing.json" .arog/
echo "   ✅ Copied model-routing.json"
echo "      - Automatic routing between FREE and PAID models"
echo "      - 70-85% cost savings on AI usage"
echo ""

# Step 5: Copy AI Agents
echo "🎭 Step 5/5: Installing 15 specialized AI agents..."
mkdir -p .github/agents
cp -r "$SOURCE_DIR/.github/agents/"* .github/agents/
echo "   ✅ Copied 15 AI agents:"
echo "      - arog.agent.md (master orchestrator)"
echo "      - code-review-agent.md"
echo "      - test-generation-agent.md"
echo "      - security-agent.md"
echo "      - performance-agent.md"
echo "      - documentation-agent.md"
echo "      - refactoring-agent.md"
echo "      - api-design-agent.md"
echo "      - database-agent.md"
echo "      - And 6 more specialized agents!"
echo ""

# Copy GitHub Skills
echo "📚 Installing GitHub Copilot skills..."
mkdir -p .github/skills
cp -r "$SOURCE_DIR/.github/skills/"* .github/skills/
echo "   ✅ Copied skill library"
echo ""

# Copy Copilot Instructions
echo "📝 Installing Copilot instructions..."
cp "$SOURCE_DIR/.github/copilot-instructions.md" .github/
echo "   ✅ Copied copilot-instructions.md"
echo ""

# Summary
echo ""
echo "======================================================================="
echo ""
echo "✅ Migration Complete!"
echo ""
echo "📊 What You Got:"
echo "   🤖 15 Specialized AI Agents"
echo "   📝 3 Professional Prompt Templates"
echo "   🎯 6 Production-Ready Skills"
echo "   💰 Smart Cost Optimization (70-85% savings)"
echo "   📚 Complete Skill Library"
echo "   🎓 GitHub Copilot Integration"
echo ""
echo "📁 New Structure:"
echo "   .arog/"
echo "   ├── prompts/templates/     (AI prompt templates)"
echo "   ├── skills/implementations/ (Professional tools)"
echo "   └── model-routing.json      (Cost optimization)"
echo ""
echo "   .github/"
echo "   ├── agents/                 (15 AI specialists)"
echo "   ├── skills/                 (Skill library)"
echo "   └── copilot-instructions.md (AI instructions)"
echo ""
echo "🧪 Test Your New Setup:"
echo "   cd $TARGET_DIR"
echo "   @arog health check          # Should use FREE model"
echo "   @arog-code-reviewer --help  # Test specialized agent"
echo ""
echo "📖 Learn More:"
echo "   cat docs/STRUCTURE-EVOLUTION.md  # Full explanation"
echo "   cat docs/model-routing-guide.md  # Cost optimization"
echo "   cat .github/agents/README.md     # Agent documentation"
echo ""
echo "💾 Backups Created:"
echo "   .arog.backup.* (if existed)"
echo "   .github.backup.* (if existed)"
echo ""
echo "======================================================================="
echo ""
echo "🚀 You're all set! Enjoy the new AI-powered AROG!"
echo ""
