# Setting Up Playwright MCP Server for AROG

## Quick Setup (5 minutes)

### 1. Install MCP Server Dependencies

```bash
cd /Users/arog/Learn/arog/.arog/mcp-servers/playwright
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install chromium
```

### 3. Configure VS Code

**Option A: Workspace Settings** (Recommended)

Create/edit `.vscode/settings.json` in your project root:

```json
{
  "mcp.servers": {
    "arog-playwright": {
      "command": "node",
      "args": [
        "${workspaceFolder}/.arog/mcp-servers/playwright/index.js"
      ],
      "env": {}
    }
  }
}
```

**Option B: Global Settings**

1. Open VS Code Settings (Cmd+,)
2. Search for "MCP"
3. Click "Edit in settings.json"
4. Add:

```json
{
  "mcp.servers": {
    "arog-playwright": {
      "command": "node",
      "args": [
        "/Users/arog/Learn/arog/.arog/mcp-servers/playwright/index.js"
      ],
      "env": {}
    }
  }
}
```

### 4. Restart VS Code

Close and reopen VS Code to activate the MCP server.

### 5. Verify It Works

In VS Code Copilot Chat:

```
@arog navigate to https://example.com
```

If you see @arog opening a browser and navigating, **IT WORKS!** 🎉

## What You Get

Once configured, @arog can:

✅ **Open browsers** in headed mode (you can watch!)  
✅ **Navigate** to any URL  
✅ **Capture** page structure and elements  
✅ **Click** buttons and links  
✅ **Fill** forms and inputs  
✅ **Take** screenshots  
✅ **Generate** test code automatically  
✅ **Run** tests to verify they work  

## Usage Examples

### Example 1: Explore a Website

```
@arog navigate to https://github.com
Tell me what elements you see
```

### Example 2: Generate Login Tests

```
@arog
1. Go to http://localhost:3000/login
2. Explore the login form
3. Generate tests for:
   - Valid login
   - Invalid credentials
   - Empty fields
   - Password visibility toggle
```

### Example 3: Complete User Journey

```
@arog explore my e-commerce app at http://localhost:3000
Generate tests for:
- Browse products
- Add to cart
- Checkout flow
- Order confirmation
```

### Example 4: Visual Testing

```
@arog take screenshots of all pages on http://localhost:3000
Save them to .playwright-mcp/screenshots/
```

## Troubleshooting

### MCP Server Not Found

Check VS Code Output panel:
1. View → Output
2. Select "Model Context Protocol" from dropdown
3. Look for errors

### Browser Doesn't Open

```bash
# Install browsers
npx playwright install

# Or specific browser
npx playwright install chromium
```

### Permission Denied

```bash
chmod +x .arog/mcp-servers/playwright/index.js
```

### Wrong Node Version

MCP requires Node.js 18+:

```bash
node --version  # Should be >= 18.0.0
```

## Advanced Configuration

### Run in Headless Mode

Edit `.arog/mcp-servers/playwright/index.js`:

```javascript
browser = await chromium.launch({
  headless: true,  // Change to true
});
```

### Use Different Browser

```javascript
import { firefox } from 'playwright';

browser = await firefox.launch({
  headless: false,
});
```

### Mobile Testing

```javascript
import { devices } from 'playwright';

context = await browser.newContext({
  ...devices['iPhone 13'],
});
```

## Files Created

After setup, you'll have:

```
.arog/mcp-servers/playwright/
├── package.json          # MCP server dependencies
├── index.js             # MCP server implementation
├── README.md            # Full documentation
└── node_modules/        # Installed dependencies
```

## Integration with @arog

The MCP server works with:

1. **Agent Config**: `.arog/agents/playwright-test-generator.md`
2. **Setup Script**: `.arog/scripts/auto-generate-e2e-tests.js`
3. **Generated Tests**: `tests/e2e/*.spec.js`

## Why This Is Needed

**Before**: @arog could only document how to write tests

**After**: @arog can actually:
- Control browsers
- Explore your UI
- Generate working test code
- All automatically!

## Next Steps

1. ✅ Install dependencies (`npm install`)
2. ✅ Configure VS Code (add MCP server to settings)
3. ✅ Restart VS Code
4. ✅ Test it: `@arog navigate to https://example.com`
5. 🚀 Generate tests for YOUR app!

---

**Questions?** Just ask @arog! 😊
