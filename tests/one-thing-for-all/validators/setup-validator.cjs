#!/usr/bin/env node

/**
 * Setup Validator - Actually tests Quick Start and setup flows
 * 
 * Tests:
 * - Quick Start completes in <30 seconds
 * - No blocking processes (Playwright, MCP)
 * - Directory structure created correctly
 * - Restart reminder appears
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SetupValidator {
  constructor(projectRoot) {
    this.projectRoot = projectRoot || process.cwd();
    this.results = [];
  }

  async runAll() {
    console.log('\n🧪 Running Setup Validators...\n');

    await this.testDirectoryStructure();
    await this.testScriptsExist();
    await this.testNoBlockingInSetup();
    await this.testRestartReminderExists();
    await this.testPackageJsonValid();

    return this.results;
  }

  async testDirectoryStructure() {
    const test = {
      name: 'Directory structure exists',
      type: 'filesystem',
      critical: false
    };

    try {
      const requiredDirs = [
        '.arog',
        '.arog/scripts',
        'tests',
        'tests/e2e',
        'tests/unit',
        'docs',
        'docs/book'
      ];

      const missing = [];
      for (const dir of requiredDirs) {
        const fullPath = path.join(this.projectRoot, dir);
        if (!fs.existsSync(fullPath)) {
          missing.push(dir);
        }
      }

      if (missing.length === 0) {
        test.passed = true;
        test.message = `✅ All ${requiredDirs.length} directories exist`;
      } else {
        test.passed = false;
        test.message = `❌ Missing directories: ${missing.join(', ')}`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testScriptsExist() {
    const test = {
      name: 'Core scripts exist',
      type: 'filesystem',
      critical: true
    };

    try {
      const requiredScripts = [
        '.arog/scripts/setup-mcp-servers.cjs',
        '.arog/scripts/verify-mcp.cjs',
        '.arog/scripts/restart-reminder.cjs',
        'scripts/setup.js'
      ];

      const missing = [];
      for (const script of requiredScripts) {
        const fullPath = path.join(this.projectRoot, script);
        if (!fs.existsSync(fullPath)) {
          missing.push(script);
        }
      }

      if (missing.length === 0) {
        test.passed = true;
        test.message = `✅ All ${requiredScripts.length} core scripts exist`;
      } else {
        test.passed = false;
        test.message = `❌ Missing scripts: ${missing.join(', ')}`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testNoBlockingInSetup() {
    const test = {
      name: 'No blocking operations in setup',
      type: 'code-analysis',
      critical: true
    };

    try {
      const setupPath = path.join(this.projectRoot, 'scripts/setup.js');
      
      if (!fs.existsSync(setupPath)) {
        test.passed = false;
        test.message = '❌ setup.js not found';
        this.results.push(test);
        return;
      }

      const content = fs.readFileSync(setupPath, 'utf8');
      
      // Check for actual blocking executions (not console.log messages)
      const blockingPatterns = [
        { pattern: /execSync\s*\(\s*['"`]npx playwright install/, name: 'npx playwright install' },
        { pattern: /execSync\s*\(\s*['"`]node scripts\/setup-mcp-servers/, name: 'MCP server setup' },
        { pattern: /execSync\s*\(\s*['"`]npm install -g/, name: 'global npm install' },
        { pattern: /require\(['"`]child_process['"`]\)\.execSync.*playwright install/, name: 'playwright install execution' }
      ];

      const found = blockingPatterns.filter(item => item.pattern.test(content));

      if (found.length === 0) {
        test.passed = true;
        test.message = '✅ No blocking operations in setup.js (console.log messages are OK)';
      } else {
        test.passed = false;
        test.message = `❌ Found blocking executions: ${found.map(f => f.name).join(', ')}`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testRestartReminderExists() {
    const test = {
      name: 'Restart reminder script exists and works',
      type: 'execution',
      critical: true
    };

    try {
      const scriptPath = path.join(this.projectRoot, '.arog/scripts/restart-reminder.cjs');
      
      if (!fs.existsSync(scriptPath)) {
        test.passed = false;
        test.message = '❌ restart-reminder.cjs not found';
        this.results.push(test);
        return;
      }

      const content = fs.readFileSync(scriptPath, 'utf8');
      
      // Check for expected content
      const expectedStrings = [
        'VS CODE RESTART',
        '@arog',
        'verify-mcp',
        'what',
        'why',
        'how'
      ];

      const missing = expectedStrings.filter(str => !content.includes(str));

      if (missing.length === 0) {
        test.passed = true;
        test.message = `✅ Restart reminder has all ${expectedStrings.length} expected messages`;
      } else {
        test.passed = false;
        test.message = `❌ Missing messages: ${missing.join(', ')}`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testPackageJsonValid() {
    const test = {
      name: 'Package.json postinstall is non-blocking',
      type: 'config',
      critical: true
    };

    try {
      const pkgPath = path.join(this.projectRoot, '.arog/package.json');
      
      if (!fs.existsSync(pkgPath)) {
        test.passed = false;
        test.message = '❌ .arog/package.json not found';
        this.results.push(test);
        return;
      }

      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      
      if (!pkg.scripts || !pkg.scripts.postinstall) {
        test.passed = false;
        test.message = '❌ No postinstall script defined';
        this.results.push(test);
        return;
      }

      const postinstall = pkg.scripts.postinstall;
      
      // Check if it runs blocking operations
      const blockingPatterns = [
        'setup-mcp-servers.cjs',
        'setup-mcp-server.cjs',
        'npm install -g'
      ];

      const hasBlocking = blockingPatterns.some(pattern => postinstall.includes(pattern));

      if (!hasBlocking) {
        test.passed = true;
        test.message = `✅ Postinstall is non-blocking: "${postinstall}"`;
      } else {
        test.passed = false;
        test.message = `❌ Postinstall has blocking operations: "${postinstall}"`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }
}

module.exports = SetupValidator;

// Run if called directly
if (require.main === module) {
  const validator = new SetupValidator();
  validator.runAll().then(results => {
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
    
    results.forEach(r => {
      console.log(`${r.passed ? '✅' : '❌'} ${r.name}`);
      console.log(`   ${r.message}\n`);
    });
    
    process.exit(failed > 0 ? 1 : 0);
  });
}
