# @arog CLI Commands Reference

Complete guide to all @arog command-line interface commands.

## Quick Start

```bash
# Show all commands
arog-cli --help

# Analyze existing project
arog-cli analyze

# Integrate @arog into project
arog-cli integrate

# Run all tests
arog-cli test-all
```

## Installation

```bash
npm install @arogyareddy/arog
```

## All Available Commands

### 📊 Project Analysis

#### `arog-cli analyze`
**Aliases**: `analyze-project`

Analyzes your existing project to understand:
- Languages and frameworks
- Build tools
- Existing test setup
- CI/CD configuration
- Testing gaps
- Recommendations

**Usage**:
```bash
arog-cli analyze
```

**Output**:
- Project structure analysis
- Technology stack detection
- Test coverage analysis
- Gap identification
- Actionable recommendations

---

### 🔧 Integration

#### `arog-cli integrate`

Integrates @arog automation into an existing project WITHOUT breaking your current setup.

**What it adds**:
- GitHub Copilot Agent configuration
- GitHub Actions workflows (only if missing)
- Test directory structure
- NPM scripts for @arog
- Documentation

**Usage**:
```bash
arog-cli integrate
```

**Safe Integration**:
- ✅ Backs up existing files to `.arog-backup/`
- ✅ Skips files that already exist
- ✅ Respects your existing configuration
- ✅ Adds only what's missing

---

### 🧪 Testing Commands

#### `arog-cli test-all`
**Aliases**: `run-all-tests`

Runs ALL test suites in your project:
- Unit tests
- Integration tests
- E2E tests
- Performance tests
- Security scans
- Accessibility tests

**Usage**:
```bash
arog-cli test-all
```

**Output**: Complete test summary with pass/fail/not-configured status

---

#### `arog-cli test-unit`
**Aliases**: `run-unit-tests`

Runs unit tests using your configured test framework.

**Auto-detects**:
- Jest
- Mocha
- Vitest
- AVA
- Jasmine

**Usage**:
```bash
arog-cli test-unit
```

**Tries these commands** (in order):
1. `npm test`
2. `npm run test:unit`
3. `jest`
4. `vitest run`
5. `mocha`

---

#### `arog-cli test-functional`
**Aliases**: `run-functional-tests`

Runs functional/integration tests.

**Usage**:
```bash
arog-cli test-functional
```

**Tries these commands**:
1. `npm run test:functional`
2. `npm run test:integration`
3. `npm run test:api`

---

#### `arog-cli test-e2e`
**Aliases**: `run-e2e-tests`

Runs end-to-end tests.

**Auto-detects**:
- Playwright
- Cypress
- Selenium
- Puppeteer

**Usage**:
```bash
arog-cli test-e2e
```

**Tries these commands**:
1. `npm run test:e2e`
2. `npx playwright test`
3. `npx cypress run`

---

#### `arog-cli test-performance`
**Aliases**: `run-performance-tests`

Runs performance tests and bundle size checks.

**Features**:
- Executes performance test scripts
- Checks bundle size limits
- Reports performance metrics

**Auto-detects**:
- k6
- Artillery
- Lighthouse

**Usage**:
```bash
arog-cli test-performance
```

---

#### `arog-cli test-security`
**Aliases**: `run-security-tests`

Runs security vulnerability scans.

**Features**:
- npm audit for dependency vulnerabilities
- Custom security test scripts
- Detailed vulnerability reports

**Usage**:
```bash
arog-cli test-security
```

**What it runs**:
1. `npm audit --audit-level=moderate`
2. `npm run test:security` (if exists)
3. `npm run snyk` (if configured)

---

#### `arog-cli test-accessibility`
**Aliases**: `run-accessibility-tests`

Runs accessibility (a11y) compliance tests.

**Features**:
- WCAG 2.1 AA compliance checks
- axe-core integration
- Detailed a11y reports

**Usage**:
```bash
arog-cli test-accessibility
```

**Tries these commands**:
1. `npm run test:a11y`
2. `npm run test:accessibility`
3. `npx playwright test tests/accessibility`
4. `pa11y-ci`

---

### ✅ Validation & Health

#### `arog-cli health`
**Aliases**: `health-check`

Checks @arog system health and all dependencies.

**Checks**:
- Node.js version
- npm version
- Git repository
- package.json
- GitHub workflows
- AROG agent configuration

**Usage**:
```bash
arog-cli health
```

---

#### `arog-cli validate`

Validates entire @arog system configuration.

**Validates**:
- Required files
- GitHub workflows
- Test setup
- Automation configuration

**Usage**:
```bash
arog-cli validate
```

---

### 🏗️ Build & Quality

#### `arog-cli test`

Runs your project's default test command.

**Options**:
- `-w, --watch`: Run tests in watch mode
- `-c, --coverage`: Run with coverage

**Usage**:
```bash
arog-cli test
arog-cli test --watch
arog-cli test --coverage
```

---

#### `arog-cli lint`

Runs code quality checks.

**Options**:
- `-f, --fix`: Automatically fix problems

**Usage**:
```bash
arog-cli lint
arog-cli lint --fix
```

---

#### `arog-cli security-scan`
**Aliases**: `security`

Runs security vulnerability scan.

**Options**:
- `-f, --fix`: Automatically fix vulnerabilities

**Usage**:
```bash
arog-cli security-scan
arog-cli security --fix
```

---

### 🚀 Deployment

#### `arog-cli deploy`

Deploy with AROG automation.

**Options**:
- `-e, --environment <env>`: Target environment (default: production)

**Usage**:
```bash
arog-cli deploy
arog-cli deploy --environment staging
```

---

### 🛠️ Setup

#### `arog-cli setup`

Set up AROG in current project (initial setup).

**Usage**:
```bash
arog-cli setup
```

---

## Command Workflow

### For New Projects

```bash
# 1. Install @arog
npm install @arogyareddy/arog

# 2. Set up @arog
arog-cli setup

# 3. Validate installation
arog-cli health

# 4. Run tests
arog-cli test-all
```

### For Existing Projects

```bash
# 1. Analyze your project
arog-cli analyze

# 2. Integrate @arog (safe - backs up files)
arog-cli integrate

# 3. Validate integration
arog-cli validate

# 4. Run all tests
arog-cli test-all
```

---

## Using with GitHub Copilot Chat

Instead of CLI commands, you can use @arog in GitHub Copilot Chat:

```
@arog analyze project
@arog run all tests
@arog check security
@arog help with testing
```

---

## Output Format

All @arog commands start with the branded banner:

```
======================================================================
   ███████╗██████╗  ██████╗  ██████╗ 
  ██╔══██╗██╔══██╗██╔═══██╗██╔════╝ 
  ███████║██████╔╝██║   ██║██║  ███╗
  ██╔══██║██╔══██╗██║   ██║██║   ██║
  ██║  ██║██║  ██║╚██████╔╝╚██████╔╝
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ 
  
  🤖 Autonomous Robot for Organization Growth
  📍 Currently Working On: [TASK]
  ⚡ Status: ACTIVE & AUTOMATING
======================================================================
```

This confirms @arog is actively working on your behalf!

---

## Environment Variables

### Optional Configuration

```bash
# Custom test timeout
export AROG_TEST_TIMEOUT=60000

# Skip certain test types
export AROG_SKIP_E2E=true
export AROG_SKIP_PERFORMANCE=true

# Custom test directories
export AROG_UNIT_DIR=spec/unit
export AROG_E2E_DIR=spec/e2e
```

---

## Exit Codes

- `0`: Success
- `1`: Tests failed or command error
- `2`: Configuration error

---

## Examples

### Analyze a React Project

```bash
cd my-react-app
arog-cli analyze

# Output shows:
# - Language: JavaScript/TypeScript
# - Framework: React
# - Test Framework: Jest, React Testing Library
# - Gaps: No E2E tests, No performance tests
# - Recommendations: Add Playwright, Add Lighthouse
```

### Run All Tests on Express API

```bash
cd my-express-api
arog-cli test-all

# Runs:
# ✅ Unit tests (Jest)
# ✅ Integration tests (Supertest)
# ❌ E2E tests (not configured)
# ⚠️  Performance tests (not configured)
# ✅ Security (npm audit)
# ❌ Accessibility (not applicable for API)
```

### Integrate into Existing Project

```bash
cd legacy-app
arog-cli analyze    # See what's missing
arog-cli integrate  # Add @arog safely
arog-cli test-all   # Run everything
```

---

## Troubleshooting

### Command not found

```bash
# Make sure @arog is installed
npm list @arogyareddy/arog

# Reinstall if needed
npm install @arogyareddy/arog
```

### Tests not running

```bash
# Check if test command exists
npm run test

# Analyze to see what's configured
arog-cli analyze
```

### Permission denied

```bash
# Make CLI executable
chmod +x node_modules/@arogyareddy/arog/bin/arog-cli.cjs
```

---

## Getting Help

```bash
# Show all commands
arog-cli --help

# Show help for specific command
arog-cli test-all --help
```

Or ask @arog in GitHub Copilot Chat:

```
@arog help me with [topic]
@arog how do I run tests?
@arog what commands are available?
```

---

## See Also

- [Integration Guide](./integrate-arog-into-any-app.md)
- [Agent Configuration](../arog-agent-complete-guide.html)
- [GitHub Workflows](../.github/workflows/)

---

**@arog = EVERYTHING** 🤖

Every command, every test, every automation - all handled by @arog!
