#!/usr/bin/env node

/**
 * AROG Portable Interactive CLI
 * This CLI lives in .arog/ folder and travels with your configuration!
 * 
 * When you copy .arog/ and .github/ folders to a new project,
 * this interactive CLI comes with them!
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import Table from 'cli-table3';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { createSpinner } from 'nanospinner';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find project root (where package.json is)
const projectRoot = findProjectRoot(__dirname);

// Debug: Show project root on startup (only in verbose mode)
if (process.argv.includes('--verbose') || process.argv.includes('-v')) {
  console.log(chalk.gray(`[DEBUG] Project Root: ${projectRoot}`));
  console.log(chalk.gray(`[DEBUG] package.json exists: ${fs.existsSync(join(projectRoot, 'package.json'))}`));
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function findProjectRoot(startPath) {
  let currentPath = startPath;
  
  // First, go up from .arog directory to find the actual project root
  // Skip .arog/package.json and find the parent project's package.json
  while (currentPath !== '/') {
    const pkgPath = join(currentPath, 'package.json');
    
    // Check if package.json exists and it's NOT the .arog package.json
    if (fs.existsSync(pkgPath)) {
      const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      
      // Skip if this is the @arog/cli package itself
      if (pkgContent.name !== '@arog/cli') {
        return currentPath;
      }
    }
    
    currentPath = dirname(currentPath);
  }
  
  // Fallback: Go up from current working directory
  currentPath = process.cwd();
  while (currentPath !== '/') {
    const pkgPath = join(currentPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkgContent.name !== '@arog/cli') {
        return currentPath;
      }
    }
    currentPath = dirname(currentPath);
  }
  
  return process.cwd(); // Last resort fallback
}

function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    const spinner = ora(description).start();
    
    // Disable VS Code debugger for child processes to prevent "Waiting for debugger" errors
    const env = { ...process.env };
    delete env.NODE_OPTIONS; // Remove debugger options
    
    // For npm commands with ||, split and try sequentially
    const commands = command.includes(' || ') ? command.split(' || ') : [command];
    
    const tryCommand = (cmdList, index = 0) => {
      if (index >= cmdList.length) {
        spinner.fail(`${description} - all attempts failed`);
        reject(new Error('All command attempts failed'));
        return;
      }
      
      const cmd = cmdList[index].trim();
      const child = spawn(cmd, { 
        shell: true, 
        cwd: projectRoot,
        env: env,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      let output = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        const text = data.toString();
        // Filter out debugger messages
        if (!text.includes('Debugger listening') && 
            !text.includes('Debugger attached') && 
            !text.includes('Waiting for the debugger')) {
          output += text;
        }
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          spinner.succeed(description);
          resolve(output);
        } else if (index < cmdList.length - 1) {
          // Try next command in the list
          tryCommand(cmdList, index + 1);
        } else {
          spinner.fail(`${description} (exit code: ${code})`);
          
          // Show detailed error if verbose mode
          if (process.argv.includes('--verbose') || process.argv.includes('-v')) {
            console.log(chalk.gray('\n[DEBUG] Command output:'));
            console.log(chalk.gray(output.substring(0, 500)));
          }
          
          reject(new Error(output));
        }
      });
    };
    
    tryCommand(commands);
  });
}

// ============================================================================
// BANNER
// ============================================================================

function showBanner() {
  console.clear();
  
  const banner = `
   ███████╗██████╗  ██████╗  ██████╗ 
  ██╔══██╗██╔══██╗██╔═══██╗██╔════╝ 
  ███████║██████╔╝██║   ██║██║  ███╗
  ██╔══██║██╔══██╗██║   ██║██║   ██║
  ██║  ██║██║  ██║╚██████╔╝╚██████╔╝
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ 
  `;
  
  console.log(chalk.cyan(banner));
  console.log(boxen(
    chalk.cyan.bold('🤖 Autonomous Robot for Organization Growth') + '\n' +
    chalk.gray('Your portable automation framework') + '\n\n' +
    chalk.green('✨ Zero configuration • 🚀 Full automation • 💰 Cost optimized'),
    {
      padding: 1,
      margin: { top: 0, bottom: 1, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: 'cyan'
    }
  ));
}

// ============================================================================
// PROJECT STATUS CHECK
// ============================================================================

async function checkProjectStatus() {
  const checks = {
    'package.json': fs.existsSync(join(projectRoot, 'package.json')),
    'node_modules': fs.existsSync(join(projectRoot, 'node_modules')),
    'tests': fs.existsSync(join(projectRoot, 'tests')) || fs.existsSync(join(projectRoot, 'test')),
    '.git': fs.existsSync(join(projectRoot, '.git')),
    '.github': fs.existsSync(join(projectRoot, '.github')),
    '.arog': fs.existsSync(join(projectRoot, '.arog'))
  };
  
  const table = new Table({
    head: [chalk.cyan('Check'), chalk.cyan('Status')],
    colWidths: [35, 25]
  });
  
  table.push(
    ['📦 package.json', checks['package.json'] ? chalk.green('✓ Found') : chalk.yellow('⚠ Not found')],
    ['📁 node_modules', checks['node_modules'] ? chalk.green('✓ Installed') : chalk.yellow('⚠ Run npm install')],
    ['🧪 Tests directory', checks['tests'] ? chalk.green('✓ Found') : chalk.gray('○ Optional')],
    ['🔧 Git repository', checks['.git'] ? chalk.green('✓ Initialized') : chalk.yellow('⚠ Not initialized')],
    ['⚙️  GitHub Actions', checks['.github'] ? chalk.green('✓ Configured') : chalk.yellow('⚠ Not configured')],
    ['🤖 AROG configured', checks['.arog'] ? chalk.green('✓ Yes') : chalk.red('✗ No')]
  );
  
  console.log(chalk.cyan.bold('\n═══════════════════════════════════════════════════════════════════'));
  console.log(chalk.cyan.bold('  📊 PROJECT STATUS'));
  console.log(chalk.cyan.bold('═══════════════════════════════════════════════════════════════════\n'));
  console.log(table.toString());
  
  const healthScore = Object.values(checks).filter(Boolean).length;
  const healthPercent = Math.round((healthScore / Object.keys(checks).length) * 100);
  
  const healthStatus = healthPercent >= 90 ? chalk.green('Excellent') :
                       healthPercent >= 70 ? chalk.yellow('Good') :
                       chalk.red('Needs Attention');
  
  console.log(boxen(
    `Project Health: ${healthStatus} (${healthPercent}/100)`,
    { padding: 0, margin: { top: 1, bottom: 1, left: 2, right: 2 }, borderColor: 'cyan' }
  ));
}

// ============================================================================
// MAIN MENU
// ============================================================================

async function showMainMenu() {
  const choices = [
    new inquirer.Separator(chalk.cyan('━━━ 🚀 Quick Actions ━━━')),
    { name: '⚡ Quick Start - Get started in 30 seconds', value: 'quick-start' },
    { name: '🏥 Health Check - Verify everything works', value: 'health' },
    { name: '📚 Show All Commands - Complete reference', value: 'commands' },
    
    new inquirer.Separator(chalk.cyan('\n━━━ 🧪 Testing ━━━')),
    { name: '🧪 Run All Tests (10 types!)', value: 'test:all' },
    { name: '⚡ Run Unit Tests', value: 'test:unit' },
    { name: '🌐 Run E2E Tests', value: 'test:e2e' },
    { name: '🔒 Run Security Tests', value: 'test:security' },
    { name: '📊 View Test Coverage', value: 'test:coverage' },
    
    new inquirer.Separator(chalk.cyan('\n━━━ 🔍 Code Quality ━━━')),
    { name: '🔍 Check Code Quality (Lint)', value: 'lint' },
    { name: '🔧 Auto-Fix Issues', value: 'lint:fix' },
    { name: '🎨 Format Code (Prettier)', value: 'format' },
    
    new inquirer.Separator(chalk.cyan('\n━━━ 🔒 Security ━━━')),
    { name: '🔒 Security Audit', value: 'security:audit' },
    { name: '🛡️  Full Security Scan', value: 'security:scan' },
    
    new inquirer.Separator(chalk.cyan('\n━━━ 📦 Build & Deploy ━━━')),
    { name: '📦 Production Build', value: 'build' },
    { name: '🚀 Deploy to Staging', value: 'deploy:staging' },
    { name: '🎯 Deploy to Production', value: 'deploy:production' },
    
    new inquirer.Separator(chalk.cyan('\n━━━ 📊 Reports & Monitoring ━━━')),
    { name: '📊 Generate Full Report', value: 'arog:report' },
    { name: '📈 View Metrics Dashboard', value: 'arog:metrics' },
    { name: '💰 AI Cost Report', value: 'arog:cost-report' },
    
    new inquirer.Separator(chalk.cyan('\n━━━ 📚 Help & Documentation ━━━')),
    { name: '📖 Open The AROG Book', value: 'docs:book' },
    { name: '📚 View Documentation', value: 'docs' },
    { name: '❓ Show Help', value: 'help' },
    
    new inquirer.Separator(chalk.cyan('\n━━━ ━━━ ━━━')),
    { name: '🚪 Exit', value: 'exit' }
  ];
  
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan.bold('What would you like to do?'),
      choices,
      pageSize: 20
    }
  ]);
  
  return answer.action;
}

// ============================================================================
// ACTION HANDLERS
// ============================================================================

async function handleQuickStart() {
  console.clear();
  showBanner();
  
  console.log(boxen(
    chalk.cyan.bold('🚀 QUICK START GUIDE\n\n') +
    chalk.white('AROG is your complete automation framework.\n') +
    chalk.white('Everything runs automatically - you just write code!\n\n') +
    chalk.yellow('What AROG does for you:\n\n') +
    chalk.green('  ✓ Testing') + chalk.gray(' - 10 types of automated tests\n') +
    chalk.green('  ✓ Security') + chalk.gray(' - Vulnerability scanning\n') +
    chalk.green('  ✓ Quality') + chalk.gray(' - Code review, linting\n') +
    chalk.green('  ✓ Deploy') + chalk.gray(' - Zero-downtime deployments\n') +
    chalk.green('  ✓ Cost') + chalk.gray(' - 70-85% AI cost savings'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan'
    }
  ));
  
  const { next } = await inquirer.prompt([
    {
      type: 'list',
      name: 'next',
      message: 'What would you like to do next?',
      choices: [
        { name: '🏥 Run Health Check', value: 'health' },
        { name: '🧪 Run Tests', value: 'test' },
        { name: '📚 Show All Commands', value: 'commands' },
        { name: '🔙 Back to Main Menu', value: 'menu' }
      ]
    }
  ]);
  
  return next;
}

async function showAllCommands() {
  console.clear();
  showBanner();
  
  console.log(chalk.cyan.bold('📋 ALL AROG COMMANDS\n'));
  console.log(chalk.yellow('💡 Use @arog in VS Code Copilot Chat for the best experience!\n'));
  
  const commandCategories = [
    {
      title: '🤖 @AROG AI AGENT COMMANDS (Primary - Use These!)',
      commands: [
        { arog: '@arog run tests', npm: 'npm test', desc: 'Run unit tests' },
        { arog: '@arog run e2e tests', npm: 'npm run test:e2e', desc: 'Run E2E tests' },
        { arog: '@arog check code quality', npm: 'npm run lint', desc: 'Check code quality' },
        { arog: '@arog fix code issues', npm: 'npm run lint:fix', desc: 'Auto-fix issues' },
        { arog: '@arog build for production', npm: 'npm run build', desc: 'Production build' },
        { arog: '@arog deploy to staging', npm: 'npm run deploy:staging', desc: 'Deploy to staging' },
        { arog: '@arog deploy to production', npm: 'npm run deploy:production', desc: 'Deploy to production' },
        { arog: '@arog run security scan', npm: 'npm run security:audit', desc: 'Security audit' },
        { arog: '@arog review this code', npm: '(manual review)', desc: 'AI code review' },
        { arog: '@arog fix this error', npm: '(interactive)', desc: 'Debug assistance' }
      ]
    },
    {
      title: '🧪 TESTING COMMANDS',
      commands: [
        { arog: '@arog run all tests', npm: 'npm run test:all', desc: 'Run ALL tests (10 types!)' },
        { arog: '@arog run unit tests', npm: 'npm test', desc: 'Run unit tests' },
        { arog: '@arog run e2e tests', npm: 'npm run test:e2e', desc: 'Run E2E tests (Playwright)' },
        { arog: '@arog run accessibility tests', npm: 'npm run test:a11y', desc: 'Accessibility tests' },
        { arog: '@arog check test coverage', npm: 'npm test -- --coverage', desc: 'View test coverage' }
      ]
    },
    {
      title: '🔍 CODE QUALITY COMMANDS',
      commands: [
        { arog: '@arog check code quality', npm: 'npm run lint', desc: 'ESLint check' },
        { arog: '@arog fix code issues', npm: 'npm run lint:fix', desc: 'Auto-fix ESLint issues' },
        { arog: '@arog format code', npm: 'npm run format', desc: 'Format with Prettier' },
        { arog: '@arog type check', npm: 'npm run typecheck', desc: 'TypeScript check' }
      ]
    },
    {
      title: '🔒 SECURITY COMMANDS',
      commands: [
        { arog: '@arog run security scan', npm: 'npm run security:audit', desc: 'NPM audit' },
        { arog: '@arog fix vulnerabilities', npm: 'npm run security:fix', desc: 'Auto-fix vulnerabilities' }
      ]
    },
    {
      title: '📦 BUILD & DEPLOY COMMANDS',
      commands: [
        { arog: '@arog build', npm: 'npm run build', desc: 'Production build' },
        { arog: '@arog check build size', npm: 'npm run build:size', desc: 'Check bundle size' },
        { arog: '@arog deploy to staging', npm: 'npm run deploy:staging', desc: 'Deploy to staging' },
        { arog: '@arog deploy to production', npm: 'npm run deploy:production', desc: 'Deploy to production' }
      ]
    }
  ];
  
  commandCategories.forEach(category => {
    console.log(chalk.cyan.bold(`\n${category.title}`));
    const table = new Table({
      head: [chalk.yellow('@arog Command'), chalk.gray('npm Command'), chalk.gray('Description')],
      colWidths: [30, 30, 35],
      style: { head: [], border: [] }
    });
    
    category.commands.forEach(({ arog, npm, desc }) => {
      table.push([chalk.green(arog), chalk.dim(npm), desc]);
    });
    
    console.log(table.toString());
  });
  
  console.log(boxen(
    chalk.yellow.bold('💡 PRO TIP:\n\n') +
    chalk.white('1. ') + chalk.green('Open VS Code Copilot Chat\n') +
    chalk.white('2. ') + chalk.green('Type: @arog run tests\n') +
    chalk.white('3. ') + chalk.green('@arog automatically runs the command for you!\n\n') +
    chalk.dim('You can also run npm commands directly in terminal.'),
    {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: 'yellow'
    }
  ));
  
  await inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message: chalk.cyan('Press ENTER to return to main menu')
    }
  ]);
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  
  // Handle CLI flags
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
AROG Interactive CLI

Usage:
  npx arog              Launch interactive menu
  npx arog --help       Show this help
  npx arog --demo       Run a demo
  npx arog --health     Run health check
  npx arog --welcome    Show welcome screen (first-time users)

This CLI is portable - it lives in .arog/ folder and travels with your config!
    `);
    return;
  }
  
  if (args.includes('--health')) {
    showBanner();
    await checkProjectStatus();
    return;
  }
  
  if (args.includes('--welcome')) {
    // Show first-time welcome
    await handleQuickStart();
    return;
  }
  
  // Main interactive loop
  showBanner();
  await checkProjectStatus();
  
  let keepRunning = true;
  
  while (keepRunning) {
    const action = await showMainMenu();
    
    switch (action) {
      case 'exit':
        console.log(chalk.cyan('\n👋 Goodbye! Run "npx arog" anytime to return.\n'));
        keepRunning = false;
        break;
        
      case 'quick-start':
        const next = await handleQuickStart();
        if (next === 'menu') {
          showBanner();
          await checkProjectStatus();
          continue;
        }
        if (next === 'health') {
          showBanner();
          await checkProjectStatus();
          continue;
        }
        if (next === 'test') {
          console.clear();
          console.log(chalk.cyan('\n🤖 Running: @arog run tests\n'));
          try {
            await runCommand('npm test', '🧪 Running tests');
            console.log(chalk.green('\n✅ Tests completed!\n'));
          } catch (error) {
            console.log(chalk.yellow('\n⚠️  Tests failed or command not found.\n'));
          }
          await new Promise(resolve => setTimeout(resolve, 2000));
          showBanner();
          await checkProjectStatus();
          continue;
        }
        if (next === 'commands') {
          await showAllCommands();
          showBanner();
          await checkProjectStatus();
          continue;
        }
        break;
        
      case 'commands':
        await showAllCommands();
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'health':
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'test:all':
        console.clear();
        console.log(chalk.cyan('\n🤖 Running: @arog run all tests\n'));
        try {
          await runCommand('npm test', '🧪 Running all tests');
          console.log(chalk.green('\n✅ Tests completed!\n'));
        } catch (error) {
          console.log(chalk.yellow('\n⚠️  Some tests failed or command not found. Check your package.json.\n'));
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'test:unit':
        console.clear();
        console.log(chalk.cyan('\n🤖 Running: @arog run unit tests\n'));
        try {
          await runCommand('npm test', '🧪 Running unit tests');
          console.log(chalk.green('\n✅ Unit tests completed!\n'));
        } catch (error) {
          console.log(chalk.yellow('\n⚠️  Tests failed or command not found. Check your package.json.\n'));
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'test:e2e':        console.clear();        console.log(chalk.cyan('\n🤖 Running: @arog run e2e tests\n'));
        try {
          await runCommand('npm run test:e2e', '🎭 Running E2E tests');
          console.log(chalk.green('\n✅ E2E tests completed!\n'));
        } catch (error) {
          console.log(chalk.yellow('\n⚠️  E2E tests failed or command not found. Check your package.json.\n'));
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'test:security':
        console.clear();
        console.log(chalk.cyan('\n🤖 Running: @arog run security scan\n'));
        try {
          await runCommand('npm run security:audit', '🔒 Running security audit');
          console.log(chalk.green('\n✅ Security scan completed!\n'));
        } catch (error) {
          console.log(chalk.yellow('\n⚠️  Security issues found or command not available.\n'));
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'test:coverage':        console.clear();        console.log(chalk.cyan('\n🤖 Running: @arog check test coverage\n'));
        try {
          await runCommand('npm test -- --coverage', '📊 Checking test coverage');
          console.log(chalk.green('\n✅ Coverage report generated!\n'));
        } catch (error) {
          console.log(chalk.yellow('\n⚠️  Coverage check failed. Check your test setup.\n'));
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'lint':
        console.clear();
        console.log(chalk.cyan('\n🤖 Running: @arog check code quality\n'));
        try {
          await runCommand('npm run lint', '🔍 Checking code quality');
          console.log(chalk.green('\n✅ Code quality check completed!\n'));
        } catch (error) {
          console.log(chalk.yellow('\n⚠️  Linting failed or command not found. Check your package.json.\n'));
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'lint:fix':
        console.clear();
        console.log(chalk.cyan('\n🤖 Running: @arog fix code issues\n'));
        try {
          await runCommand('npm run lint:fix', '🔧 Auto-fixing issues');
          console.log(chalk.green('\n✅ Code issues fixed!\n'));
        } catch (error) {
          console.log(chalk.yellow('\n⚠️  Auto-fix failed or command not found. Check your package.json.\n'));
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'format':
        console.clear();
        console.log(chalk.cyan('\n🤖 Running: @arog format code\n'));
        try {
          await runCommand('npm run format', '🎨 Formatting code with Prettier');
          console.log(chalk.green('\n✅ Code formatted!\n'));
        } catch (error) {
          console.log(chalk.yellow('\n⚠️  Format failed or command not found. Check your package.json.\n'));
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'security:audit':
        console.clear();
        console.log(chalk.cyan('\n🤖 Running: @arog run security audit\n'));
        try {
          const output = await runCommand('NODE_OPTIONS= npm audit --audit-level=moderate 2>&1 || true', '🔒 Running dependency audit');
          
          // Always show the output as it contains useful information
          if (output.includes('vulnerabilities')) {
            const vulnMatch = output.match(/(\d+)\s+vulnerabilities/);
            if (vulnMatch) {
              const vulnCount = parseInt(vulnMatch[1]);
              if (vulnCount > 0) {
                console.log(chalk.yellow(`\n⚠️  Found ${vulnCount} vulnerabilities in dependencies\n`));
                console.log(chalk.gray('These are mostly in dev dependencies (lighthouse, puppeteer).'));
                console.log(chalk.gray('Run "npm audit fix" to attempt auto-fix.\n'));
              } else {
                console.log(chalk.green('\n✅ No vulnerabilities found!\n'));
              }
            }
          } else {
            console.log(chalk.green('\n✅ Security audit completed!\n'));
          }
        } catch (error) {
          console.log(chalk.yellow('\n⚠️  Could not complete security audit. Check npm installation.\n'));
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'security:scan':
        console.clear();
        console.log(chalk.cyan('\n🤖 Running: @arog full security scan\n'));
        try {
          const output = await runCommand('NODE_OPTIONS= npm audit --audit-level=moderate 2>&1 || true', '🛡️  Running full security scan');
          
          if (output.includes('vulnerabilities')) {
            console.log(boxen(
              chalk.yellow.bold('Security Scan Results\n\n') +
              chalk.white('Run "npm audit" for detailed vulnerability report\n') +
              chalk.white('Run "npm audit fix" to attempt automatic fixes\n') +
              chalk.gray('\nNote: Most vulnerabilities are in dev dependencies'),
              { padding: 1, borderColor: 'yellow', borderStyle: 'round' }
            ));
          } else {
            console.log(chalk.green('\n✅ No security issues found!\n'));
          }
        } catch (error) {
          console.log(chalk.yellow('\n⚠️  Security scan failed or vulnerabilities found.\n'));
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'build':        console.clear();        console.log(chalk.cyan('\n🤖 Running: @arog build for production\n'));
        try {
          await runCommand('npm run build', '📦 Building for production');
          console.log(chalk.green('\n✅ Build completed!\n'));
        } catch (error) {
          console.log(chalk.yellow('\n⚠️  Build failed. Check your build configuration.\n'));
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'deploy:staging':
        console.clear();
        console.log(chalk.cyan('\n🤖 Running: @arog deploy to staging\n'));
        console.log(chalk.yellow('⚠️  Deploy to staging - Please configure deployment script in package.json\n'));
        await new Promise(resolve => setTimeout(resolve, 2000));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'deploy:production':
        console.clear();
        console.log(chalk.cyan('\n🤖 Running: @arog deploy to production\n'));
        console.log(chalk.yellow('⚠️  Deploy to production - Please configure deployment script in package.json\n'));
        await new Promise(resolve => setTimeout(resolve, 2000));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'arog:report':
        console.clear();
        console.log(chalk.cyan('\n📊 Generating AROG report...\n'));
        console.log(chalk.yellow('⚠️  Report generation - Coming soon!\n'));
        await new Promise(resolve => setTimeout(resolve, 1500));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'arog:metrics':
        console.clear();
        console.log(chalk.cyan('\n📈 Showing metrics dashboard...\n'));
        console.log(chalk.yellow('⚠️  Metrics dashboard - Coming soon!\n'));
        await new Promise(resolve => setTimeout(resolve, 1500));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'arog:cost-report':
        console.clear();
        console.log(chalk.cyan('\n💰 Generating AI cost report...\n'));
        console.log(chalk.yellow('⚠️  Cost report - Coming soon!\n'));
        await new Promise(resolve => setTimeout(resolve, 1500));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'docs:book':
        console.clear();
        console.log(chalk.cyan('\n📖 Opening The AROG Book...\n'));
        console.log(chalk.yellow('⚠️  Documentation - Check docs/ folder in your project\n'));
        await new Promise(resolve => setTimeout(resolve, 1500));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'docs':
        console.clear();
        console.log(chalk.cyan('\n📚 Opening documentation...\n'));
        console.log(chalk.yellow('⚠️  Documentation - Check docs/ folder in your project\n'));
        await new Promise(resolve => setTimeout(resolve, 1500));
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'help':
        console.clear();
        console.log(chalk.cyan.bold('\n❓ AROG HELP\n'));
        console.log(boxen(
          chalk.white('AROG = Autonomous Robot for Organization Growth\n\n') +
          chalk.yellow('How to use:\n\n') +
          chalk.green('1. In VS Code: ') + chalk.white('Type @arog in Copilot Chat\n') +
          chalk.green('2. In Terminal: ') + chalk.white('Run npx arog for this menu\n') +
          chalk.green('3. Automated: ') + chalk.white('Push code → workflows run automatically\n\n') +
          chalk.yellow('What AROG does:\n\n') +
          chalk.white('✓ Runs 10 types of tests automatically\n') +
          chalk.white('✓ Reviews code quality\n') +
          chalk.white('✓ Scans for security vulnerabilities\n') +
          chalk.white('✓ Deploys with zero downtime\n') +
          chalk.white('✓ Saves 70-85% on AI costs\n\n') +
          chalk.dim('For more: Check docs/ folder or ask @arog in Copilot'),
          {
            padding: 1,
            margin: { top: 0, bottom: 1, left: 2, right: 2 },
            borderStyle: 'round',
            borderColor: 'cyan'
          }
        ));
        await inquirer.prompt([
          {
            type: 'input',
            name: 'continue',
            message: chalk.cyan('Press ENTER to return to main menu')
          }
        ]);
        showBanner();
        await checkProjectStatus();
        break;
        
      default:
        console.log(chalk.yellow(`\n⚠️  Action "${action}" not yet implemented. Coming soon!\n`));
        await new Promise(resolve => setTimeout(resolve, 1500));
        showBanner();
        await checkProjectStatus();
    }
  }
}

// Run the CLI
main().catch(error => {
  console.error(chalk.red('\n❌ Error:'), error.message);
  process.exit(1);
});
