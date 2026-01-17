#!/bin/bash

# 🚀 AROG Integration Script
# 
# This script copies .arog and .github folders to a target project
# and sets up AROG automation.
#
# Usage:
#   ./copy-arog-to-project.sh /path/to/target/project

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Banner
echo ""
echo "======================================================================"
echo -e "${CYAN}${BOLD}"
echo "   ███████╗██████╗  ██████╗  ██████╗ "
echo "  ██╔══██╗██╔══██╗██╔═══██╗██╔════╝ "
echo "  ███████║██████╔╝██║   ██║██║  ███╗"
echo "  ██╔══██║██╔══██╗██║   ██║██║   ██║"
echo "  ██║  ██║██║  ██║╚██████╔╝╚██████╔╝"
echo "  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ "
echo ""
echo "  🤖 Autonomous Robot for Organization Growth"
echo "  📦 Integration Script v1.0"
echo -e "${NC}"
echo "======================================================================"
echo ""

# Check if target path provided
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: No target project path provided${NC}"
  echo ""
  echo "Usage:"
  echo "  $0 /path/to/target/project"
  echo ""
  echo "Example:"
  echo "  $0 ~/projects/my-app"
  echo ""
  exit 1
fi

TARGET_PATH="$1"
AROG_SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}📂 Source: ${AROG_SOURCE}${NC}"
echo -e "${BLUE}🎯 Target: ${TARGET_PATH}${NC}"
echo ""

# Verify source folders exist
if [ ! -d "$AROG_SOURCE/.arog" ]; then
  echo -e "${RED}❌ Error: .arog folder not found in source${NC}"
  exit 1
fi

if [ ! -d "$AROG_SOURCE/.github" ]; then
  echo -e "${RED}❌ Error: .github folder not found in source${NC}"
  exit 1
fi

# Create target directory if it doesn't exist
if [ ! -d "$TARGET_PATH" ]; then
  echo -e "${YELLOW}⚠️  Target directory doesn't exist. Creating...${NC}"
  mkdir -p "$TARGET_PATH"
fi

# Confirm with user
echo -e "${YELLOW}⚠️  This will copy AROG files to:${NC}"
echo -e "${YELLOW}   $TARGET_PATH/.arog${NC}"
echo -e "${YELLOW}   $TARGET_PATH/.github${NC}"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}❌ Cancelled${NC}"
  exit 0
fi

# Copy .arog folder
echo ""
echo -e "${CYAN}📦 Copying .arog folder...${NC}"
if [ -d "$TARGET_PATH/.arog" ]; then
  echo -e "${YELLOW}⚠️  .arog folder already exists. Creating backup...${NC}"
  mv "$TARGET_PATH/.arog" "$TARGET_PATH/.arog.backup.$(date +%s)"
fi
cp -r "$AROG_SOURCE/.arog" "$TARGET_PATH/.arog"
echo -e "${GREEN}✅ .arog folder copied${NC}"

# Copy .github folder
echo ""
echo -e "${CYAN}📦 Copying .github folder...${NC}"
if [ -d "$TARGET_PATH/.github" ]; then
  echo -e "${YELLOW}⚠️  .github folder already exists. Merging...${NC}"
  cp -r "$AROG_SOURCE/.github/"* "$TARGET_PATH/.github/" 2>/dev/null || true
else
  cp -r "$AROG_SOURCE/.github" "$TARGET_PATH/.github"
fi
echo -e "${GREEN}✅ .github folder copied${NC}"

# Install AROG CLI dependencies
echo ""
echo -e "${CYAN}📦 Installing AROG CLI dependencies...${NC}"
cd "$TARGET_PATH/.arog"

if command -v npm &> /dev/null; then
  npm install --silent
  echo -e "${GREEN}✅ Dependencies installed${NC}"
else
  echo -e "${RED}❌ npm not found. Please install Node.js first.${NC}"
  exit 1
fi

cd "$TARGET_PATH"

# Verify installation
echo ""
echo -e "${CYAN}🔍 Verifying installation...${NC}"

VALIDATION_PASSED=true

# Check critical files
if [ ! -f "$TARGET_PATH/.arog/package.json" ]; then
  echo -e "${RED}❌ .arog/package.json missing${NC}"
  VALIDATION_PASSED=false
fi

if [ ! -f "$TARGET_PATH/.arog/bin/arog-cli.js" ]; then
  echo -e "${RED}❌ .arog/bin/arog-cli.js missing${NC}"
  VALIDATION_PASSED=false
fi

if [ ! -f "$TARGET_PATH/.github/copilot-instructions.md" ]; then
  echo -e "${RED}❌ .github/copilot-instructions.md missing${NC}"
  VALIDATION_PASSED=false
fi

if [ "$VALIDATION_PASSED" = true ]; then
  echo -e "${GREEN}✅ All critical files present${NC}"
else
  echo -e "${RED}❌ Some critical files are missing${NC}"
  exit 1
fi

# Success message
echo ""
echo "======================================================================"
echo -e "${GREEN}${BOLD}  ✅ AROG INTEGRATION COMPLETE!${NC}"
echo "======================================================================"
echo ""
echo -e "${BOLD}📋 What was installed:${NC}"
echo "  ✅ .arog/          → Configuration + Interactive CLI"
echo "  ✅ .github/        → Automation workflows"
echo "  ✅ Dependencies    → CLI tools installed"
echo ""
echo -e "${BOLD}🚀 Next Steps:${NC}"
echo ""
echo "  1️⃣  Launch Interactive CLI:"
echo -e "     ${CYAN}cd $TARGET_PATH${NC}"
echo -e "     ${CYAN}.arog/node_modules/.bin/arog${NC}"
echo ""
echo "  2️⃣  (Optional) Add to your package.json:"
echo -e '     {
       "scripts": {
         "arog": ".arog/node_modules/.bin/arog"
       }
     }'
echo ""
echo "     Then run: ${CYAN}npm run arog${NC}"
echo ""
echo "  3️⃣  Configure your project:"
echo "     • Add AROG configs to package.json"
echo "     • Install dev dependencies (jest, eslint, etc.)"
echo "     • See: .arog/README.md for details"
echo ""
echo "  4️⃣  Push to GitHub to trigger workflows:"
echo -e "     ${CYAN}git add .arog .github${NC}"
echo -e "     ${CYAN}git commit -m 'Add AROG automation'${NC}"
echo -e "     ${CYAN}git push${NC}"
echo ""
echo -e "${BOLD}📚 Documentation:${NC}"
echo "  • .arog/README.md"
echo "  • arog-integration-kit/PRE-INTEGRATION-CHECKLIST.md"
echo "  • arog-integration-kit/INTEGRATE-UPDATED.md"
echo ""
echo -e "${BOLD}💡 Quick Test:${NC}"
echo -e "  ${CYAN}cd .arog && npx arog --help${NC}"
echo ""
echo "======================================================================"
echo -e "${GREEN}Happy automating! 🤖${NC}"
echo "======================================================================"
echo ""
