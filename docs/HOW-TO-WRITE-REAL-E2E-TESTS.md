# How to Write Real E2E Tests for Your Application

## Current Situation

**AROG provides TEMPLATE tests** that test AROG's own documentation. These are examples to show you how E2E testing works.

**You need to write tests for YOUR actual application!**

## What's Currently Being Tested

File: `tests/e2e/example.spec.js`
- Tests AROG documentation at `http://localhost:8080`
- Checks for AROG homepage elements
- Template/example tests only

## How to Create Real Tests for Your App

### Step 1: Update Playwright Config

Edit `config/playwright/playwright.config.js`:

```javascript
export default defineConfig({
  testDir: './tests/e2e',
  
  use: {
    baseURL: 'http://localhost:3000',  // ← Change to YOUR app URL
  },

  webServer: {
    command: 'npm run start',  // ← Change to YOUR app start command
    url: 'http://localhost:3000',  // ← YOUR app URL
    reuseExistingServer: !process.env.CI,
  },
});
```

### Step 2: Write Tests for YOUR Application

**Example: Testing a Login Page**

```javascript
// tests/e2e/login.spec.js
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('should login with valid credentials', async ({ page }) => {
    // Navigate to your app
    await page.goto('/login');
    
    // Fill in login form
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Check for error message
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Invalid credentials');
  });
});
```

**Example: Testing E-commerce Flow**

```javascript
// tests/e2e/checkout.spec.js
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test('should add item to cart and checkout', async ({ page }) => {
    await page.goto('/products');
    
    // Add product to cart
    await page.click('button.add-to-cart:first-child');
    
    // Verify cart badge updates
    const cartBadge = page.locator('.cart-badge');
    await expect(cartBadge).toHaveText('1');
    
    // Go to checkout
    await page.click('.cart-icon');
    await expect(page).toHaveURL('/cart');
    
    // Verify product in cart
    const cartItems = page.locator('.cart-item');
    await expect(cartItems).toHaveCount(1);
    
    // Proceed to checkout
    await page.click('button.checkout');
    await expect(page).toHaveURL('/checkout');
  });
});
```

### Step 3: How to Find Locators for YOUR App

**Use Playwright Inspector** (this is the magic tool!):

```bash
# Start Playwright in debug mode
npx playwright test --debug

# Or use the codegen tool to RECORD tests
npx playwright codegen http://localhost:3000
```

**Playwright Codegen** will:
1. Open your app in a browser
2. Record your clicks and interactions
3. Generate test code automatically!

```bash
# Example: Generate tests by using your app
npx playwright codegen http://localhost:3000

# It opens a browser, you click around, and it writes the test code!
```

### Step 4: Run Tests with Visible Browser

```bash
# See the browser while tests run
npm run test:e2e:headed

# Use interactive UI mode (best for development)
npm run test:e2e:ui

# Run in headless mode (CI/CD)
npm run test:e2e
```

## Common Locator Strategies

### 1. By Role (Preferred)
```javascript
await page.getByRole('button', { name: 'Submit' });
await page.getByRole('textbox', { name: 'Email' });
await page.getByRole('link', { name: 'Sign up' });
```

### 2. By Label
```javascript
await page.getByLabel('Email address');
await page.getByLabel('Password');
```

### 3. By Placeholder
```javascript
await page.getByPlaceholder('Enter your email');
```

### 4. By Text
```javascript
await page.getByText('Welcome to our app');
```

### 5. By CSS Selector (less preferred)
```javascript
await page.locator('.button-primary');
await page.locator('#login-form input[type="email"]');
```

### 6. By Data Attribute (recommended for test stability)
```javascript
// In your HTML:
// <button data-testid="submit-button">Submit</button>

await page.getByTestId('submit-button');
```

## Real-World Example: Complete Test Suite

```javascript
// tests/e2e/user-journey.spec.js
import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test('new user signup to first purchase', async ({ page }) => {
    // Step 1: Sign up
    await page.goto('/signup');
    await page.fill('[data-testid="email"]', 'newuser@example.com');
    await page.fill('[data-testid="password"]', 'SecurePass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecurePass123!');
    await page.click('[data-testid="signup-button"]');
    
    // Step 2: Verify email sent message
    await expect(page.locator('.success-message')).toContainText('Check your email');
    
    // Step 3: Browse products
    await page.goto('/products');
    const products = page.locator('.product-card');
    await expect(products).toHaveCount.greaterThan(0);
    
    // Step 4: Search for product
    await page.fill('[data-testid="search-input"]', 'laptop');
    await page.press('[data-testid="search-input"]', 'Enter');
    
    // Step 5: Add to cart
    await page.click('.product-card:first-child .add-to-cart');
    await expect(page.locator('.cart-count')).toHaveText('1');
    
    // Step 6: Checkout
    await page.click('[data-testid="cart-button"]');
    await page.click('[data-testid="checkout-button"]');
    
    // Step 7: Fill shipping info
    await page.fill('[data-testid="address"]', '123 Main St');
    await page.fill('[data-testid="city"]', 'San Francisco');
    await page.selectOption('[data-testid="state"]', 'CA');
    await page.fill('[data-testid="zip"]', '94102');
    
    // Step 8: Submit order
    await page.click('[data-testid="place-order"]');
    
    // Step 9: Verify confirmation
    await expect(page).toHaveURL(/order-confirmation/);
    await expect(page.locator('.order-number')).toBeVisible();
  });
});
```

## Best Practices

### ✅ DO:
- Use `data-testid` attributes for reliable selectors
- Test user journeys, not just individual actions
- Use page objects for complex apps
- Test error states and edge cases
- Run tests in multiple browsers
- Use screenshots on failure

### ❌ DON'T:
- Rely on CSS classes that might change
- Write fragile XPath selectors
- Test every single click
- Ignore flaky tests
- Test third-party components extensively

## How @arog Helps

@arog provides:
1. ✅ Playwright configuration
2. ✅ Example test structure
3. ✅ npm scripts for running tests
4. ✅ CI/CD integration (GitHub Actions)
5. ✅ HTML reports

**What @arog CANNOT do:**
- ❌ Know your application's UI
- ❌ Write tests for your specific features
- ❌ Understand your business logic

**You must write the actual test content yourself!**

## Quick Start Checklist

- [ ] Install Playwright browsers: `npx playwright install`
- [ ] Update `playwright.config.js` with YOUR app URL
- [ ] Start your app locally
- [ ] Use `npx playwright codegen http://localhost:3000` to record tests
- [ ] Replace example tests in `tests/e2e/`
- [ ] Run tests: `npm run test:e2e:ui`
- [ ] Review test reports
- [ ] Commit your tests to git

## Resources

- [Playwright Docs](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)
- [Codegen Tool](https://playwright.dev/docs/codegen)

---

**Remember**: The example tests in AROG are just templates. They show you HOW to write tests, but YOU need to write tests for YOUR application's specific features! 🎯
