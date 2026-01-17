# 📋 Complete AROG Command Reference

> **TL;DR:** Don't memorize! Just run `npx arog` for an interactive menu with ALL commands!

---

## 🎯 The EASIEST Way: Interactive CLI

```bash
npx arog
```

**This shows you EVERYTHING in a beautiful menu!**

But if you want the full list, here it is:

---

## 🚀 Quick Start Commands

### Initial Setup

```bash
# Install AROG
npm install

# First-time interactive setup
npx arog

# Show help
npm run help
arog --help

# Run demo
npx arog --demo
```

---

## 🏥 Health & System Checks

### Health Monitoring

```bash
# Complete health check (RECOMMENDED)
npm run arog:health

# System validation
npm run arog:validate

# Preflight check (before deployment)
npm run preflight

# Check bundle size
npm run check:bundle-size

# View project status
npm run status
```

### What They Check:
- ✅ Dependencies installed
- ✅ Tests passing
- ✅ Code quality
- ✅ Security status
- ✅ Build success
- ✅ Configuration valid

---

## 🧪 Testing Commands (10 Types!)

### Unit Testing

```bash
# Run unit tests
npm test
npm run test:unit

# Watch mode (during development)
npm run test:watch

# Coverage report
npm run test:coverage

# Update snapshots
npm run test:update
```

### End-to-End Testing

```bash
# Run E2E tests
npm run test:e2e

# E2E with UI
npm run test:e2e:ui

# E2E debug mode
npm run test:e2e:debug

# E2E headed mode (see browser)
npm run test:e2e:headed
```

### Security Testing

```bash
# Security audit
npm run test:security
npm run security:audit

# Auto-fix vulnerabilities
npm run security:fix

# Full security scan
npm run security:scan
```

### Performance Testing

```bash
# Performance tests
npm run test:performance

# Lighthouse CI
npm run lighthouse

# Bundle analysis
npm run build:analyze

# Load testing
npm run test:load
```

### Accessibility Testing

```bash
# A11y tests
npm run test:a11y

# WCAG compliance check
npm run test:wcag

# Screen reader test
npm run test:screenreader
```

### Integration Testing

```bash
# Integration tests
npm run test:integration

# API tests
npm run test:api

# Database tests
npm run test:db
```

### Visual Regression Testing

```bash
# Visual tests
npm run test:visual

# Update visual baselines
npm run test:visual:update
```

### Mutation Testing

```bash
# Mutation testing
npm run test:mutation
```

### Contract Testing

```bash
# Contract tests
npm run test:contract
```

### Load Testing

```bash
# Load/stress testing
npm run test:load
npm run test:stress
```

### Run ALL Tests

```bash
# Run every single test type
npm run test:all

# CI mode (for GitHub Actions)
npm run test:ci
```

---

## 🔍 Code Quality Commands

### Linting

```bash
# Check code quality
npm run lint

# Auto-fix issues
npm run lint:fix

# Check specific files
npm run lint -- src/myfile.js

# Lint staged files only
npm run lint:staged
```

### Formatting

```bash
# Format code (Prettier)
npm run format

# Check formatting (no changes)
npm run format:check

# Format specific files
npm run format -- src/**/*.js
```

### Type Checking

```bash
# TypeScript type check
npm run type-check

# Type check in watch mode
npm run type-check:watch
```

---

## 🔒 Security Commands

### Dependency Security

```bash
# Audit dependencies
npm run security:audit
npm audit

# Fix vulnerabilities
npm run security:fix
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

### Secret Scanning

```bash
# Scan for exposed secrets
npm run security:secrets

# Check environment files
npm run security:env
```

### Full Security Scan

```bash
# Complete security analysis
npm run security:scan
npm run security:full
```

---

## 📦 Build & Bundle Commands

### Building

```bash
# Production build
npm run build

# Development build
npm run build:dev

# Build and watch
npm run build:watch

# Clean and rebuild
npm run build:clean
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run build:analyze

# Check bundle budget
npm run check:bundle-size

# Visualize bundle
npm run bundle:visualize
```

---

## 🚀 Deployment Commands

### Local/Staging

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to development
npm run deploy:dev

# Deploy preview
npm run deploy:preview
```

### Production

```bash
# Deploy to production
npm run deploy:production
npm run deploy:prod

# Deploy with checks
npm run deploy:safe
```

### Rollback

```bash
# Rollback deployment
npm run deploy:rollback

# Rollback to specific version
npm run deploy:rollback -- v1.2.3
```

---

## 📊 Reporting & Metrics

### Reports

```bash
# Generate full AROG report
npm run arog:report

# Metrics dashboard
npm run arog:metrics

# Cost analysis
npm run arog:cost-report

# Test coverage report
npm run coverage:report

# Performance report
npm run performance:report
```

### Analytics

```bash
# View analytics
npm run arog:analytics

# Export metrics
npm run arog:export-metrics

# Generate charts
npm run arog:charts
```

---

## 🤖 AI Agent Commands (VS Code / Chat)

### Code Review

```bash
@arog review this code
@arog review PR #123
@arog check this function
@arog code quality check
```

### Testing

```bash
@arog run tests
@arog run unit tests
@arog run E2E tests
@arog check test coverage
@arog generate tests for this function
```

### Security

```bash
@arog check security
@arog scan for vulnerabilities
@arog check for secrets
@arog security audit
```

### Deployment

```bash
@arog deploy to staging
@arog deploy to production
@arog rollback deployment
@arog check deployment status
```

### Code Generation

```bash
@arog create a React component
@arog generate API endpoint
@arog write tests for this
@arog refactor this code
```

### Documentation

```bash
@arog document this function
@arog generate README
@arog explain this code
@arog create API docs
```

### Performance

```bash
@arog optimize this code
@arog check performance
@arog analyze bundle size
@arog improve load time
```

### Debugging

```bash
@arog fix this error
@arog debug this issue
@arog find the bug
@arog explain this error
```

### General Help

```bash
@arog what can you do?
@arog show all commands
@arog help with testing
@arog how do I deploy?
@arog explain AROG
```

---

## 🛠️ Configuration Commands

### View Configuration

```bash
# Show current config
npm run config:show

# Validate config
npm run config:validate

# Show effective config (with inheritance)
npm run config:effective
```

### Update Configuration

```bash
# Interactive config editor
npm run config:edit

# Set specific value
npm run config:set -- key=value

# Reset to defaults
npm run config:reset
```

---

## 📚 Documentation Commands

### View Docs

```bash
# Open main documentation
npm run docs

# Open The AROG Book
npm run docs:book

# Open API reference
npm run docs:api

# Open interactive guide
npm run docs:interactive
```

### Generate Docs

```bash
# Generate documentation
npm run docs:generate

# Update README
npm run docs:readme
```

---

## 🔄 Git & Version Control

### Automated Git Workflows

```bash
# These run automatically on git hooks:
# pre-commit: lint, format, test
# pre-push: full validation
# post-merge: install deps, rebuild

# Manual trigger
npm run git:hooks:run
```

---

## 🎯 Workflow Commands

### GitHub Actions (Automatic)

```bash
# These run automatically in CI/CD:
# - On every commit: tests, lint, build
# - On every PR: full validation, security, performance
# - On merge to main: deploy to staging
# - Daily: dependency updates, security scans

# Local simulation
npm run workflow:simulate
```

---

## 🧹 Maintenance Commands

### Cleanup

```bash
# Clean build artifacts
npm run clean

# Clean dependencies
npm run clean:deps

# Clean everything
npm run clean:all

# Reset to fresh state
npm run reset
```

### Updates

```bash
# Check for updates
npm run updates:check

# Update dependencies
npm run updates:apply

# Update AROG itself
npm run arog:update
```

---

## 📱 Platform-Specific Commands

### GitHub Actions

```bash
# Run in GitHub Actions mode
npm run ci

# Validate workflows
npm run validate:workflows
```

### GitLab CI

```bash
# Run in GitLab CI mode
npm run gitlab:ci
```

### Local Development

```bash
# Start dev server
npm run dev
npm start

# Dev with hot reload
npm run dev:watch
```

---

## 🎨 Interactive CLI Options

### Launch Interactive Mode

```bash
# Full interactive menu
npx arog

# Specific section
npx arog --section=testing
npx arog --section=security
npx arog --section=deploy

# Quick actions
npx arog --quick-start
npx arog --health-check
npx arog --demo
```

---

## 📊 Complete Command Categories

### By Frequency of Use:

**Daily Commands:**
```bash
npm test                    # Run tests
npm run lint                # Check code quality
npm run arog:health         # Health check
@arog review this code      # Code review
```

**Weekly Commands:**
```bash
npm run test:all            # Full test suite
npm run security:audit      # Security check
npm run arog:report         # Generate report
npm run build               # Production build
```

**Monthly Commands:**
```bash
npm run arog:cost-report    # Cost analysis
npm run arog:metrics        # View metrics
npm run updates:check       # Check updates
npm run arog:analytics      # Deep analytics
```

**As Needed:**
```bash
npm run deploy:staging      # Deploy to staging
npm run deploy:production   # Deploy to prod
npm run deploy:rollback     # Rollback
npx arog --demo             # Show demo
```

---

## 🎯 Quick Reference Card

```
╔══════════════════════════════════════════════════════════════╗
║                    AROG QUICK REFERENCE                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  🚀 GETTING STARTED:                                         ║
║     npx arog                    Interactive menu (START!)   ║
║     npm run arog:health         Health check                ║
║                                                              ║
║  🧪 TESTING:                                                 ║
║     npm test                    Unit tests                   ║
║     npm run test:e2e            E2E tests                    ║
║     npm run test:all            ALL tests                    ║
║                                                              ║
║  🔍 QUALITY:                                                 ║
║     npm run lint                Code quality                 ║
║     npm run lint:fix            Auto-fix issues              ║
║     npm run format              Format code                  ║
║                                                              ║
║  🔒 SECURITY:                                                ║
║     npm run security:audit      Security scan                ║
║     npm run security:fix        Fix vulnerabilities          ║
║                                                              ║
║  📦 BUILD:                                                   ║
║     npm run build               Production build             ║
║     npm run build:analyze       Bundle analysis              ║
║                                                              ║
║  🚀 DEPLOY:                                                  ║
║     npm run deploy:staging      Deploy to staging            ║
║     npm run deploy:production   Deploy to production         ║
║                                                              ║
║  🤖 AI AGENT:                                                ║
║     @arog review this code      Code review                  ║
║     @arog run tests             Run tests                    ║
║     @arog deploy to staging     Deploy                       ║
║                                                              ║
║  📊 REPORTS:                                                 ║
║     npm run arog:report         Full report                  ║
║     npm run arog:metrics        Metrics dashboard            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🎓 Remember: You Don't Need to Memorize!

**Just use the interactive CLI:**

```bash
npx arog
```

**Or ask the AI agent:**

```bash
@arog what can you do?
@arog show me testing commands
@arog how do I deploy?
```

**AROG is designed so you never need to remember commands!** 🚀
