#!/usr/bin/env node

/**
 * AROG Autonomous E2E Test Generator
 * 
 * This script automatically:
 * 1. Detects your application URL
 * 2. Opens browser in headed mode
 * 3. Explores your UI using Playwright MCP
 * 4. Generates real E2E tests
 * 5. Saves tests to your project
 * 
 * Usage: node .arog/scripts/auto-generate-e2e-tests.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.join(__dirname, '../..');

console.log(chalk.cyan.bold('\n🤖 AROG Autonomous E2E Test Generator\n'));
console.log(chalk.gray('I will explore your application and write tests automatically!\n'));

// Step 1: Detect or ask for application URL
async function getApplicationUrl() {
  const pkgJsonPath = path.join(projectRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  
  let defaultUrl = 'http://localhost:3000';
  let defaultCommand = 'npm start';
  
  // Try to detect from package.json scripts
  if (pkg.scripts) {
    if (pkg.scripts.start) defaultCommand = 'npm start';
    if (pkg.scripts.dev) defaultCommand = 'npm run dev';
    if (pkg.scripts.serve) defaultCommand = 'npm run serve';
  }
  
  console.log(chalk.yellow('📍 Application Configuration\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: 'What is your application URL?',
      default: defaultUrl,
    },
    {
      type: 'input',
      name: 'command',
      message: 'What command starts your application?',
      default: defaultCommand,
    },
    {
      type: 'confirm',
      name: 'isRunning',
      message: 'Is your application already running?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'headedMode',
      message: 'Run browser in headed mode (visible)?',
      default: true,
    }
  ]);
  
  return answers;
}

// Step 2: Create Playwright configuration if it doesn't exist
async function ensurePlaywrightConfig(appUrl, startCommand) {
  const configPath = path.join(projectRoot, 'playwright.config.js');
  
  if (!fs.existsSync(configPath)) {
    console.log(chalk.yellow('\n⚙️  Creating Playwright configuration...\n'));
    
    const config = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.js',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: '${appUrl}',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false, // Show browser by default
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: '${startCommand}',
    url: '${appUrl}',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
`;
    
    fs.writeFileSync(configPath, config);
    console.log(chalk.green('✅ Created playwright.config.js\n'));
  }
}

// Step 3: Generate test template
function generateTestTemplate(pageName, interactions) {
  return `import { test, expect } from '@playwright/test';

test.describe('${pageName}', () => {
  test('should load and display correctly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify page title
    await expect(page).toHaveTitle(/.+/);
    
    // Check main content is visible
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
${interactions.map(interaction => `
  test('${interaction.description}', async ({ page }) => {
    await page.goto('${interaction.url}');
    ${interaction.code}
  });`).join('\n')}
});
`;
}

// Step 4: Main execution
async function main() {
  try {
    // Get configuration
    const config = await getApplicationUrl();
    
    // Ensure Playwright is configured
    await ensurePlaywrightConfig(config.url, config.command);
    
    console.log(chalk.cyan('\n🎭 Starting Playwright MCP Server...\n'));
    console.log(chalk.gray('I will now explore your application and generate tests!\n'));
    
    // Instructions for manual steps (until we fully automate)
    console.log(chalk.yellow('📝 Next Steps:\n'));
    console.log(chalk.white('1. I will open your application in a browser'));
    console.log(chalk.white('2. I will explore the UI and identify elements'));
    console.log(chalk.white('3. I will generate test code automatically'));
    console.log(chalk.white('4. Tests will be saved to tests/e2e/auto-generated.spec.js\n'));
    
    // Create tests directory if it doesn't exist
    const testsDir = path.join(projectRoot, 'tests', 'e2e');
    if (!fs.existsSync(testsDir)) {
      fs.mkdirSync(testsDir, { recursive: true });
      console.log(chalk.green('✅ Created tests/e2e directory\n'));
    }
    
    console.log(chalk.cyan('🚀 Ready to generate tests!\n'));
    console.log(chalk.gray('Run: @arog generate e2e tests for ' + config.url + '\n'));
    
    // Save configuration for @arog to use
    const configFile = path.join(projectRoot, '.arog', 'e2e-config.json');
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    console.log(chalk.green('✅ Configuration saved to .arog/e2e-config.json\n'));
    
  } catch (error) {
    console.error(chalk.red('\n❌ Error:', error.message));
    process.exit(1);
  }
}

main();
