# AROG Autonomous E2E Test Generation

## What This Does

@arog can now **AUTOMATICALLY GENERATE E2E TESTS** for your application using:

1. **Playwright MCP Server** - Browser automation
2. **Custom Agents** - Intelligent test generation
3. **UI Exploration** - Automatic page discovery
4. **Smart Test Writing** - Context-aware test creation

## How It Works

### Automatic Mode

Just talk to @arog in VS Code:

```
@arog generate E2E tests for my application at http://localhost:3000
```

@arog will:
1. ✅ Open browser in headed mode (you can watch!)
2. ✅ Navigate through your application
3. ✅ Identify all interactive elements
4. ✅ Generate test code automatically
5. ✅ Save tests to your project
6. ✅ Run tests to verify they work

### Manual Setup (if needed)

```bash
cd .arog
node scripts/auto-generate-e2e-tests.js
```

Then tell @arog:
```
@arog I've configured my app, please explore it and write tests
```

## What @arog Can Test

### Automatically Detected:
- 🔍 Login/Signup forms
- 🛒 Shopping carts and checkouts
- 📝 Contact forms
- 🔘 Buttons and links
- 📋 Forms and inputs
- 🎯 Navigation menus
- 📱 Responsive layouts
- ✅ Form validations
- 🔄 Dynamic content

### Smart Test Generation:
```javascript
// @arog sees a login form and writes:
test('should login with valid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});

// @arog sees a shopping cart and writes:
test('should add item to cart', async ({ page }) => {
  await page.goto('/products');
  await page.click('.product:first-child .add-to-cart');
  await expect(page.locator('.cart-count')).toHaveText('1');
});
```

## Available Playwright MCP Tools

@arog has access to these Playwright automation tools:

- `mcp_playwright_browser_navigate` - Go to URLs
- `mcp_playwright_browser_snapshot` - Get page structure
- `mcp_playwright_browser_click` - Click elements
- `mcp_playwright_browser_type` - Fill forms
- `mcp_playwright_browser_select_option` - Select dropdowns
- `mcp_playwright_browser_hover` - Hover over elements
- `mcp_playwright_browser_take_screenshot` - Capture screens
- `mcp_playwright_browser_evaluate` - Run JavaScript
- `mcp_playwright_browser_wait_for` - Wait for elements

## Example Conversation

**You:**
```
@arog my app is at http://localhost:3000
Please explore it and write E2E tests
Run in headed mode so I can watch
```

**@arog:**
```
🤖 Opening browser at http://localhost:3000...
📸 Capturing page structure...
🔍 Found login form with email and password fields
🔍 Found navigation menu with Home, Products, About links
🔍 Found search bar
✍️ Generating tests...

Created tests/e2e/auto-generated.spec.js:
- Login flow test
- Navigation test
- Search functionality test

🧪 Running tests in headed mode...
✅ All tests passing!
```

## Configuration

### Auto-Generated Config

When you run the setup script, @arog creates:

```javascript
// playwright.config.js
{
  baseURL: 'http://localhost:3000',
  headless: false,  // Visible browser
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
  }
}
```

### Custom Configuration

Tell @arog:
```
@arog my app URL is http://localhost:8080
Start command is: npm run dev
Please generate tests
```

## Advanced Features

### Multi-Page Testing

```
@arog explore all pages starting from homepage
Generate tests for:
- User registration flow
- Product browsing
- Checkout process
```

### Visual Testing

```
@arog take screenshots of all pages
Generate visual regression tests
```

### Accessibility Testing

```
@arog check accessibility on all pages
Generate a11y tests
```

### Performance Testing

```
@arog measure page load times
Generate performance tests
```

## How @arog Learns Your UI

1. **Page Snapshot** - Gets accessible element tree
2. **Element Detection** - Identifies forms, buttons, links
3. **Interaction Patterns** - Recognizes common workflows
4. **Smart Selectors** - Uses data-testid, roles, labels
5. **Test Generation** - Creates meaningful test scenarios

## Example: Full User Journey

**You say:**
```
@arog generate a complete user journey test:
1. User signs up
2. Logs in
3. Adds product to cart
4. Checks out
```

**@arog generates:**
```javascript
test('complete user journey', async ({ page }) => {
  // Step 1: Signup
  await page.goto('/signup');
  await page.fill('[data-testid="email"]', 'newuser@test.com');
  await page.fill('[data-testid="password"]', 'Test123!');
  await page.click('[data-testid="signup-btn"]');
  
  // Step 2: Login
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'newuser@test.com');
  await page.fill('[data-testid="password"]', 'Test123!');
  await page.click('[data-testid="login-btn"]');
  await expect(page).toHaveURL('/dashboard');
  
  // Step 3: Add to cart
  await page.goto('/products');
  await page.click('.product:first-child .add-to-cart');
  await expect(page.locator('.cart-count')).toHaveText('1');
  
  // Step 4: Checkout
  await page.click('.cart-icon');
  await page.click('[data-testid="checkout-btn"]');
  await page.fill('[data-testid="address"]', '123 Main St');
  await page.click('[data-testid="place-order"]');
  await expect(page).toHaveURL(/order-confirmation/);
});
```

## Best Practices @arog Follows

✅ Uses semantic selectors (data-testid, roles)  
✅ Waits for elements properly  
✅ Tests user workflows, not just clicks  
✅ Includes assertions  
✅ Handles errors gracefully  
✅ Takes screenshots on failure  
✅ Groups related tests  

## Quick Start

### Option 1: Interactive Setup
```bash
cd .arog
node scripts/auto-generate-e2e-tests.js
```

### Option 2: Direct Command
In VS Code Copilot Chat:
```
@arog generate E2E tests for http://localhost:3000
Use headed mode
Start with homepage
```

### Option 3: Conversation
```
@arog I need E2E tests for my React app
It's running on port 3000
Can you explore it and write tests?
Show me the browser while you work
```

## Watching @arog Work

With headed mode, you'll see:
1. 🌐 Browser opens
2. 📄 @arog navigates pages
3. 🖱️ @arog clicks elements
4. ⌨️ @arog fills forms
5. ✅ @arog verifies behaviors
6. 💾 Tests are saved
7. 🧪 Tests run automatically

**IT'S LIKE MAGIC!** 🎩✨

## Troubleshooting

**Q: Browser doesn't open?**
```
@arog install playwright browsers
```

**Q: Tests fail?**
```
@arog debug the failing test
Show me what's wrong
```

**Q: Need to update tests?**
```
@arog regenerate tests for login page
I changed the UI
```

## Future Enhancements

Coming soon:
- 🔄 Auto-update tests when UI changes
- 🎯 Smart element selection strategies
- 📊 Coverage reporting
- 🔍 Visual diff testing
- 🤖 Self-healing tests
- 🌍 Multi-browser testing
- 📱 Mobile testing

---

**The future is here!** @arog can now write E2E tests automatically! 🚀

Just tell @arog what to test, and watch the magic happen! 🎭
