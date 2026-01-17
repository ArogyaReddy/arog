# Integrating AROG into Your Project

## The Two-Folder Integration System

AROG is designed to be integrated into ANY project by copying just 2 folders:

```
your-project/
├── .arog/          ← Copy this entire folder
├── .github/        ← Copy this entire folder
└── (your existing code)
```

**That's it!** Everything AROG needs is self-contained in these 2 folders.

## Quick Integration (60 seconds)

### Step 1: Copy AROG to Your Project

**Option A: Use the Integration Kit**

```bash
# From AROG repository
cd /path/to/arog
cp -r .arog .github /path/to/your-project/
```

**Option B: Clone and Copy**

```bash
# Clone AROG
git clone https://github.com/ArogyaReddy/arog.git

# Copy to your project
cd arog
cp -r .arog .github /path/to/your-project/

# Clean up
cd /path/to/your-project
rm -rf arog/
```

### Step 2: Install AROG Dependencies

```bash
cd /path/to/your-project/.arog
npm install
```

### Step 3: Configure MCP Server (ONE TIME)

```bash
node .arog/scripts/setup-mcp-server.js
```

This script will:
- ✅ Create `.vscode/settings.json` in your project
- ✅ Configure AROG Playwright MCP server
- ✅ Install Playwright browsers
- ✅ Add `.vscode/` to your `.gitignore`

### Step 4: Restart VS Code

Close and reopen VS Code. AROG is now active!

## Verify Integration

### Test 1: Check AROG Health

```bash
cd .arog
npx arog
# Select: "System Health Check"
```

### Test 2: Test MCP Server

In VS Code Copilot Chat:
```
@arog navigate to https://example.com
```

You should see a browser window open!

### Test 3: Generate Tests

```
@arog generate E2E tests for my app at http://localhost:3000
```

## What Gets Integrated

### `.arog/` Folder (The Brain)

```
.arog/
├── bin/
│   └── arog.js              # Interactive CLI
├── scripts/
│   ├── setup-mcp-server.js  # MCP configuration setup ⭐
│   ├── health-check.js      # System validation
│   ├── validate-system.js   # Full validation
│   └── auto-generate-e2e-tests.js  # Test generation
├── mcp-servers/
│   └── playwright/
│       ├── index.js         # MCP server implementation
│       ├── package.json     # MCP dependencies
│       └── README.md        # Documentation
├── agents/
│   └── playwright-test-generator.md  # Agent configuration
└── package.json             # AROG dependencies
```

### `.github/` Folder (The Automation)

```
.github/
└── workflows/
    ├── test.yml             # Run tests on every commit
    ├── test-on-pr.yml       # Full test suite on PRs
    ├── security-scan.yml    # Security vulnerability scans
    ├── performance.yml      # Performance testing
    ├── accessibility.yml    # A11y compliance checks
    ├── deploy.yml           # Deployment automation
    ├── code-quality.yml     # Linting and formatting
    └── scheduled-tests.yml  # Daily automated tests
```

## Why This Design?

### ✅ Portable
- Just 2 folders to copy
- Works in ANY project
- No global installations

### ✅ Self-Contained
- All dependencies in `.arog/package.json`
- No conflicts with your project dependencies
- Isolated from your code

### ✅ Version Controlled
- `.arog/` and `.github/` committed to your repo
- Everyone on team gets same automation
- Easy to update (copy new versions)

### ✅ Configurable
- All configs in `.arog/` folder
- Customize for your project
- Override defaults easily

## Configuration After Integration

### 1. Configure for Your Tech Stack

Edit `.arog/package.json` scripts to match your project:

```json
{
  "scripts": {
    "test": "npm test",           // Your test command
    "lint": "npm run lint",       // Your lint command
    "build": "npm run build"      // Your build command
  }
}
```

### 2. Configure GitHub Workflows

Edit `.github/workflows/*.yml` to match your setup:

```yaml
# Example: .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install YOUR dependencies
        run: npm ci
      - name: Run YOUR tests
        run: npm test
```

### 3. Configure MCP Server

If you need custom browser settings, edit:

```javascript
// .arog/mcp-servers/playwright/index.js

browser = await chromium.launch({
  headless: false,    // true for CI/CD
  slowMo: 100,        // Slow down for debugging
  devtools: true,     // Open devtools
});
```

## One-Time Setup: MCP Server

**CRITICAL**: After copying `.arog/` and `.github/` to your project, you MUST run the MCP setup script:

```bash
node .arog/scripts/setup-mcp-server.js
```

### Why This Step?

- `.vscode/settings.json` is user-specific (not in `.arog/` or `.github/`)
- Different developers may have different VS Code configs
- The setup script creates/updates `.vscode/settings.json` automatically
- It adds `.vscode/` to `.gitignore` so it doesn't get committed

### What It Does

1. Creates `.vscode/settings.json` if missing
2. Adds AROG Playwright MCP server configuration
3. Preserves your existing VS Code settings
4. Installs Playwright browsers
5. Adds `.vscode/` to `.gitignore`

**Run this ONCE per project**, then commit `.arog/` and `.github/` to your repo.

## Updating AROG

To update AROG in your project:

```bash
# In AROG repository
git pull origin main

# Copy updated folders to your project
cp -r .arog .github /path/to/your-project/

# Reinstall dependencies (if needed)
cd /path/to/your-project/.arog
npm install
```

## Team Onboarding

When a new developer joins:

```bash
# 1. Clone your project
git clone <your-repo>

# 2. Install AROG dependencies
cd .arog
npm install

# 3. Setup MCP server (one-time)
node scripts/setup-mcp-server.js

# 4. Restart VS Code
```

**That's it!** They now have full AROG capabilities.

## Troubleshooting

### MCP Server Not Working After Integration

**Symptom**: @arog can't control browser

**Solution**:
```bash
# Run the setup script
node .arog/scripts/setup-mcp-server.js

# Restart VS Code
```

### GitHub Workflows Failing

**Symptom**: Actions fail after integration

**Solution**: Update workflow files to match your project's commands:
```yaml
# Change from AROG's example commands
- run: npm test

# To your actual commands
- run: npm run test:ci
```

### Dependencies Conflicts

**Symptom**: npm install fails with conflicts

**Solution**: AROG dependencies are isolated in `.arog/package.json`:
```bash
# Install AROG deps separately
cd .arog
npm install

# Install your project deps
cd ..
npm install
```

## Best Practices

### ✅ DO:
- Commit `.arog/` and `.github/` to your repo
- Run `setup-mcp-server.js` after integration
- Add `.vscode/` to `.gitignore`
- Customize workflows for your project
- Keep AROG updated

### ❌ DON'T:
- Commit `.vscode/settings.json` (user-specific)
- Modify AROG core files (update instead)
- Mix AROG dependencies with your project dependencies
- Skip the MCP setup step

## Support

**Issues?** 
- GitHub Issues: https://github.com/ArogyaReddy/arog/issues
- Or ask: `@arog help me debug integration`

---

**That's it!** Two folders + one setup script = Full automation. 🚀
