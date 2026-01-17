import { test, expect } from '@playwright/test';

/**
 * SEED TEST for Playwright Test Agents
 * 
 * This test provides:
 * 1. A ready-to-use `page` context for the planner agent
 * 2. Example test structure for the generator agent
 * 3. Environment setup and fixtures initialization
 * 
 * The planner agent will run this test first to:
 * - Execute any global setup needed
 * - Initialize fixtures and hooks
 * - Establish the testing environment
 * 
 * The generator agent will use this as an example of:
 * - Import statements
 * - Test structure
 * - Assertion patterns
 */

test.describe('Environment Setup', () => {
  test('seed - initialize testing environment', async ({ page }) => {
    // Basic navigation to verify the environment works
    await page.goto('https://playwright.dev');
    
    // Verify page loaded correctly
    await expect(page).toHaveTitle(/Playwright/);
    
    // Example: Check for a key element
    const getStarted = page.getByRole('link', { name: 'Get started' });
    await expect(getStarted).toBeVisible();
    
    // This test demonstrates:
    // - Navigation patterns
    // - Title assertions
    // - Element visibility checks
    // - Accessible selector usage (getByRole, getByLabel, etc.)
  });

  test('seed - example form interaction', async ({ page }) => {
    // Navigate to a page with a form
    await page.goto('https://playwright.dev');
    
    // Example: Search functionality
    const searchButton = page.getByLabel('Search');
    if (await searchButton.isVisible()) {
      await searchButton.click();
      
      // Type in search field
      const searchInput = page.getByPlaceholder('Search docs');
      await searchInput.fill('testing');
      
      // Verify results appear
      await expect(page.getByText('Search results')).toBeVisible({ timeout: 5000 });
    }
    
    // This test demonstrates:
    // - Form interactions
    // - Input field filling
    // - Search functionality
    // - Conditional logic for UI elements
  });
});
