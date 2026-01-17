#!/usr/bin/env node

/**
 * AROG Playwright Test Generator
 * Automatically explores web apps and generates E2E tests
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

async function exploreAndGenerate(url, options = {}) {
  const {
    outputDir = 'tests/e2e',
    headless = false,
    testName = 'generated-test',
  } = options;

  log('\n🔍 Starting app exploration...', 'blue');
  log(`URL: ${url}`, 'cyan');

  const browser = await chromium.launch({ headless });
  const context = await browser.newContext();
  const page = await context.newPage();

  const interactions = [];
  const pages = new Set([url]);

  try {
    // Navigate to main page
    log(`\n→ Navigating to ${url}`, 'yellow');
    await page.goto(url);
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    log(`✓ Page loaded: ${title}`, 'green');

    // Capture page structure using evaluate
    const pageInfo = await page.evaluate(() => {
      const elements = [];
      
      // Find forms and inputs
      document.querySelectorAll('form').forEach((form, idx) => {
        const inputs = form.querySelectorAll('input, textarea, select');
        elements.push({ type: 'form', index: idx, inputs: inputs.length });
      });
      
      // Find links
      document.querySelectorAll('a[href]').forEach(link => {
        elements.push({ 
          type: 'link', 
          text: link.textContent.trim(),
          href: link.getAttribute('href')
        });
      });
      
      // Find buttons
      document.querySelectorAll('button, input[type="button"], input[type="submit"]').forEach(btn => {
        elements.push({ 
          type: 'button',
          text: btn.textContent.trim() || btn.value || 'unnamed'
        });
      });
      
      return elements;
    });
    
    log(`\n📋 Found ${pageInfo.length} interactive elements:`, 'cyan');
    pageInfo.slice(0, 10).forEach(el => {
      log(`  • ${el.type}: ${el.text || `${el.inputs || 0} inputs`}`, 'reset');
    });

    // Record interactions
    interactions.push({
      action: 'navigate',
      url,
      assertion: { type: 'title', value: title },
    });

    // Explore forms
    const forms = await page.locator('form').all();
    for (const form of forms.slice(0, 3)) {
      const inputs = await form.locator('input, textarea, select').all();
      const submitBtn = await form.locator('button[type="submit"], input[type="submit"]').first();
      
      if (inputs.length > 0) {
        log(`\n📝 Found form with ${inputs.length} inputs`, 'yellow');
        
        for (const input of inputs) {
          const type = await input.getAttribute('type') || 'text';
          const name = await input.getAttribute('name') || await input.getAttribute('id') || 'unknown';
          const placeholder = await input.getAttribute('placeholder') || '';
          
          interactions.push({
            action: 'fill',
            selector: `input[name="${name}"]`,
            value: getTestValue(type, placeholder),
            fieldName: name,
          });
        }
      }
    }

    // Explore links
    const links = await page.locator('a[href]').all();
    log(`\n🔗 Found ${links.length} links`, 'yellow');
    
    for (const link of links.slice(0, 5)) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        const fullUrl = new URL(href, url).href;
        if (fullUrl.startsWith(url)) {
          pages.add(fullUrl);
          interactions.push({
            action: 'click',
            selector: `a:has-text("${text?.trim()}")`,
            expectedUrl: fullUrl,
          });
        }
      }
    }

    // Explore buttons
    const buttons = await page.locator('button, input[type="button"]').all();
    log(`\n🔘 Found ${buttons.length} buttons`, 'yellow');

    for (const btn of buttons.slice(0, 5)) {
      const text = await btn.textContent();
      if (text?.trim()) {
        interactions.push({
          action: 'click',
          selector: `button:has-text("${text.trim()}")`,
        });
      }
    }

  } catch (error) {
    log(`\n❌ Error during exploration: ${error.message}`, 'red');
  } finally {
    await browser.close();
  }

  // Generate test file
  log('\n📝 Generating test file...', 'blue');
  const testContent = generateTestCode(url, interactions, testName);
  
  const projectRoot = findProjectRoot();
  const outputPath = path.join(projectRoot, outputDir);
  
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const filename = path.join(outputPath, `${testName}.spec.js`);
  fs.writeFileSync(filename, testContent);
  
  log(`\n✅ Test generated: ${filename}`, 'green');
  log(`📊 Captured ${interactions.length} interactions`, 'cyan');
  log(`🌐 Found ${pages.size} pages to test`, 'cyan');

  return { filename, interactions: interactions.length, pages: pages.size };
}

function findInteractiveElements(node, elements = []) {
  if (!node) return elements;
  
  const interactiveRoles = ['button', 'link', 'textbox', 'checkbox', 'radio', 'combobox', 'searchbox'];
  
  if (node.role && interactiveRoles.includes(node.role)) {
    elements.push({
      type: node.role,
      name: node.name || 'unnamed',
    });
  }

  if (node.children) {
    node.children.forEach(child => findInteractiveElements(child, elements));
  }

  return elements;
}

function getTestValue(type, placeholder) {
  const values = {
    email: 'test@example.com',
    password: 'TestPassword123!',
    tel: '555-0123',
    number: '42',
    date: '2026-01-16',
    url: 'https://example.com',
    search: 'test query',
  };
  return values[type] || placeholder || 'test value';
}

function generateTestCode(url, interactions, testName) {
  const imports = `import { test, expect } from '@playwright/test';`;
  
  const tests = [];
  
  // Homepage test
  const navInteraction = interactions.find(i => i.action === 'navigate');
  if (navInteraction) {
    tests.push(`
test('homepage loads correctly', async ({ page }) => {
  await page.goto('${url}');
  await expect(page).toHaveTitle(/${navInteraction.assertion.value}/);
});`);
  }

  // Form tests
  const formInteractions = interactions.filter(i => i.action === 'fill');
  if (formInteractions.length > 0) {
    const fillActions = formInteractions
      .map(i => `  await page.fill('${i.selector}', '${i.value}');`)
      .join('\n');
    
    tests.push(`
test('form can be filled', async ({ page }) => {
  await page.goto('${url}');
${fillActions}
  // Add form submission logic here
});`);
  }

  // Navigation tests
  const linkInteractions = interactions.filter(i => i.action === 'click' && i.expectedUrl);
  linkInteractions.slice(0, 3).forEach(i => {
    // Clean up selector text - remove newlines and extra spaces
    const cleanSelector = i.selector.replace(/\s+/g, ' ').trim();
    const truncatedSelector = cleanSelector.length > 50 ? cleanSelector.substring(0, 50) + '...' : cleanSelector;
    
    tests.push(`
test('navigation to ${i.expectedUrl}', async ({ page }) => {
  await page.goto('${url}');
  await page.click('${truncatedSelector}');
  await expect(page).toHaveURL('${i.expectedUrl}');
});`);
  });

  // Button interaction tests
  const btnInteractions = interactions.filter(i => i.action === 'click' && !i.expectedUrl);
  if (btnInteractions.length > 0) {
    const firstBtn = btnInteractions[0];
    const cleanSelector = firstBtn.selector.replace(/\s+/g, ' ').trim();
    const truncatedSelector = cleanSelector.length > 50 ? cleanSelector.substring(0, 50) + '...' : cleanSelector;
    
    tests.push(`
test('button interaction', async ({ page }) => {
  await page.goto('${url}');
  await page.click('${truncatedSelector}');
  // Add assertions for button click results
});`);
  }

  return `${imports}

/**
 * Auto-generated by @arog
 * Date: ${new Date().toISOString()}
 * Source: ${url}
 * Interactions captured: ${interactions.length}
 */

${tests.join('\n')}
`;
}

function findProjectRoot() {
  let dir = __dirname;
  while (dir !== '/') {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      // Skip if this is @arog's package.json
      const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json')));
      if (pkg.name !== '@arog/cli') {
        return dir;
      }
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const url = args[0];
  
  if (!url) {
    log('Usage: node generate-tests.cjs <url> [testName]', 'yellow');
    log('Example: node generate-tests.cjs http://localhost:3000 my-app', 'cyan');
    process.exit(1);
  }

  const testName = args[1] || 'auto-generated';
  
  exploreAndGenerate(url, { testName, headless: false })
    .then(result => {
      log('\n🎉 Test generation complete!', 'green');
      log(`\nNext steps:`, 'cyan');
      log(`  1. Review: ${result.filename}`, 'reset');
      log(`  2. Run: npx playwright test ${path.basename(result.filename)}`, 'reset');
      log(`  3. Edit test to add custom assertions`, 'reset');
    })
    .catch(error => {
      log(`\n❌ Error: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = { exploreAndGenerate };
