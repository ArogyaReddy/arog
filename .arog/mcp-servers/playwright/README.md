# AROG Playwright MCP Server

## What This Is

This is the **MCP (Model Context Protocol) server** that enables @arog to control browsers and generate E2E tests automatically.

**Based on**: [Microsoft's Playwright MCP](https://github.com/microsoft/playwright-mcp)

## Installation

### Step 1: Install Dependencies

```bash
cd .arog/mcp-servers/playwright
npm install
```

### Step 2: Configure VS Code

Add to your VS Code settings (`.vscode/settings.json` or global settings):

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

**Important**: Replace `/Users/arog/Learn/arog/` with your actual project path!

### Step 3: Restart VS Code

The MCP server will automatically start when you open VS Code.

## Verify Installation

In VS Code Copilot Chat:

```
@arog test playwright mcp connection
```

You should see @arog able to control the browser!

## Available Tools

Once configured, @arog can use these tools:

1. **playwright_navigate** - Go to URLs
2. **playwright_snapshot** - Get page structure
3. **playwright_click** - Click elements
4. **playwright_type** - Fill forms
5. **playwright_screenshot** - Take screenshots
6. **playwright_evaluate** - Run JavaScript
7. **playwright_close** - Close browser

## Usage

### Generate Tests Automatically

```
@arog generate E2E tests for http://localhost:3000
```

@arog will:
1. Open browser (visible!)
2. Navigate to your app
3. Explore the UI
4. Generate test code
5. Save tests to your project

### Explore a Page

```
@arog navigate to https://example.com and tell me what you see
```

### Interactive Testing

```
@arog
1. Go to http://localhost:3000/login
2. Fill in email: user@example.com
3. Fill in password: password123
4. Click login button
5. Generate a test for this flow
```

## Configuration Options

Edit `index.js` to customize:

```javascript
browser = await chromium.launch({
  headless: false,  // Set to true for headless mode
  slowMo: 100,      // Slow down actions (ms)
  devtools: true,   // Open devtools
});
```

## Troubleshooting

### MCP Server Not Starting

Check VS Code Output panel → "Model Context Protocol" for errors.

### Browser Doesn't Open

Make sure Playwright browsers are installed:
```bash
npx playwright install chromium
```

### Port Conflicts

The MCP server uses stdio transport (no ports needed).

### Permissions Issues

Make sure the script is executable:
```bash
chmod +x .arog/mcp-servers/playwright/index.js
```

## Advanced Usage

### Test Multiple Browsers

Modify `index.js` to use Firefox or WebKit:

```javascript
import { firefox, webkit } from 'playwright';

// For Firefox
browser = await firefox.launch({ headless: false });

// For WebKit (Safari)
browser = await webkit.launch({ headless: false });
```

### Custom Browser Context

```javascript
context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  userAgent: 'Custom User Agent',
  locale: 'en-US',
  timezoneId: 'America/New_York',
});
```

### Mobile Testing

```javascript
import { devices } from 'playwright';

context = await browser.newContext({
  ...devices['iPhone 13'],
});
```

## Integration with @arog

The MCP server integrates with @arog's agent system:

1. **Agent**: `.arog/agents/playwright-test-generator.md`
2. **Scripts**: `.arog/scripts/auto-generate-e2e-tests.js`
3. **MCP Server**: `.arog/mcp-servers/playwright/` (this directory)

## References

- [Microsoft Playwright MCP](https://github.com/microsoft/playwright-mcp)
- [Playwright Docs](https://playwright.dev/docs/test-agents)
- [MCP Videos](https://playwright.dev/community/mcp-videos)
- [Execute Automation MCP](https://executeautomation.github.io/mcp-playwright/docs/intro)
- [MCP Protocol Spec](https://modelcontextprotocol.io/)

## Development

### Run Server Directly

```bash
cd .arog/mcp-servers/playwright
node index.js
```

### Watch Mode

```bash
npm run dev
```

### Add New Tools

Edit `index.js` and add to the tools array:

```javascript
{
  name: 'my_new_tool',
  description: 'What it does',
  inputSchema: {
    type: 'object',
    properties: {
      param: { type: 'string' }
    },
    required: ['param']
  }
}
```

Then add the handler in the switch statement.

## Security Notes

- The MCP server runs locally only
- No network exposure
- Browser runs in your user context
- Screenshots saved to local filesystem only

---

**Status**: Ready for installation!

**Next Steps**:
1. Run `npm install` in this directory
2. Configure VS Code settings
3. Restart VS Code
4. Tell @arog to generate tests!
