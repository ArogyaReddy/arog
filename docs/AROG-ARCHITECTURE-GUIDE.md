# 🎓 AROG Architecture: Complete Guide

## Overview: The Three Layers of Automation

@arog uses a **three-layer architecture** for comprehensive automation:

```
┌─────────────────────────────────────────────────────┐
│                   WORKFLOWS                         │
│              (Orchestration Layer)                  │
│   When: Events, Schedule, Manual                   │
│   Where: GitHub Actions                            │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                  AI AGENTS                          │
│              (Intelligence Layer)                   │
│   What: Specialized AI assistants                  │
│   How: Run on demand via workflows/CLI              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                    SKILLS                           │
│              (Capability Layer)                     │
│   What: Reusable automation modules                │
│   How: Invoked by agents and workflows             │
└─────────────────────────────────────────────────────┘
```

---

## 1. 🤖 CUSTOM AGENTS (.github/agents/)

### What Are They?

**AI Agents** are specialized automation assistants that perform expert-level tasks. Think of them as virtual team members with specific expertise.

### The 8 Agents:

| Agent | Expertise | What It Does |
|-------|-----------|--------------|
| **code-review-agent** | Code Quality | Reviews code for quality, security, performance |
| **test-generation-agent** | Testing | Generates comprehensive test suites automatically |
| **documentation-agent** | Documentation | Creates API docs, README, architecture diagrams |
| **performance-agent** | Optimization | Finds bottlenecks, optimizes algorithms |
| **security-agent** | Security | OWASP Top 10 scanning, vulnerability detection |
| **refactoring-agent** | Code Quality | Refactors code, applies design patterns |
| **api-design-agent** | API Design | Reviews REST APIs, generates OpenAPI specs |
| **database-agent** | Database | Optimizes queries, suggests indexes |

### How Are They Used?

#### Method 1: Via CLI (Direct Invocation)
```bash
# Run specific agent on a file
arog-cli agent run code-review src/app.js

# Run agent on entire directory
arog-cli agent run security-agent src/

# Generate tests
arog-cli agent run test-generation src/calculator.js

# Run all agents
arog-cli agent run-all
```

#### Method 2: Via GitHub Workflows (Automated)
```yaml
# Triggered automatically on pull requests
# See: .github/workflows/arog-ai-analysis.yml

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-code-review:
    runs-on: ubuntu-latest
    steps:
      - name: Run Code Review Agent
        run: arog-cli agent run code-review
```

#### Method 3: Via Interactive CLI (Wizard)
```bash
# Start interactive wizard
arog-wizard

# Choose: "🔍 Code Review (AI)"
# Agent runs interactively with prompts
```

### When Do They Get Triggered?

| Trigger | Agent | Condition |
|---------|-------|-----------|
| **Pull Request Opened** | code-review-agent | Automatically |
| **Push to main** | security-agent | Automatically |
| **Manual CLI** | Any agent | On demand |
| **Master Orchestrator** | All agents | When level='ultimate' |
| **Low test coverage** | test-generation-agent | Via workflow |
| **Performance issue** | performance-agent | On demand |

### How Do They Work?

**Execution Flow:**
```
1. Agent Activation
   ↓
2. Code Analysis (reads your source files)
   ↓
3. AI Processing (uses prompts from .arog/prompts/)
   ↓
4. Generate Report (findings + recommendations)
   ↓
5. Output (console/file/PR comment)
```

**Example: Code Review Agent in Action**
```bash
$ arog-cli agent run code-review src/app.js

🤖 Running Code Review Agent...

## Code Review Summary

### ✅ Strengths
- Good variable naming
- Proper error handling

### 🔴 Critical Issues
1. SQL Injection (Line 45)
   - Problem: Unsanitized user input
   - Fix: Use parameterized queries

### Score: 7/10
```

---

## 2. 🎯 SKILLS (.arog/skills/)

### What Are They?

**Skills** are **reusable automation modules** with specific capabilities. Think of them as tools in a toolbox that agents and workflows can use.

### The 6 Skills:

| Skill | Category | Level | What It Does |
|-------|----------|-------|--------------|
| **code-complexity-analyzer** | Analysis | Advanced | Calculates cyclomatic/cognitive complexity |
| **test-generator-pro** | Generation | Expert | AI-powered test generation (90% coverage) |
| **code-modernizer** | Transformation | Advanced | Converts to ES2023+ syntax |
| **bundle-optimizer** | Optimization | Expert | Code splitting, tree shaking |
| **vulnerability-scanner-pro** | Security | Expert | Multi-layer security scanning |
| **health-monitor-pro** | Monitoring | Advanced | Real-time health checks |

### Skill Categories:

```
📊 Analysis Skills
   ├─ code-complexity-analyzer
   └─ dependency-analyzer

🎨 Generation Skills
   ├─ test-generator-pro
   └─ doc-generator

🔄 Transformation Skills
   ├─ code-modernizer
   └─ refactoring-engine

⚡ Optimization Skills
   ├─ bundle-optimizer
   └─ performance-tuner

🔒 Security Skills
   ├─ vulnerability-scanner-pro
   └─ secret-detector

📈 Monitoring Skills
   ├─ health-monitor-pro
   └─ metrics-collector
```

### How Are They Used?

#### Method 1: Via CLI
```bash
# Activate a skill
arog-cli skill activate test-generator-pro

# Use a skill
arog-cli skill run code-complexity-analyzer src/

# List available skills
arog-cli skill list
```

#### Method 2: Via Agents (Automatic)
```javascript
// Agents use skills automatically
// Example: test-generation-agent uses test-generator-pro skill

Agent: test-generation-agent
  ↓
Uses Skill: test-generator-pro
  ↓
Generates: 45 tests with 92% coverage
```

#### Method 3: Via Workflows
```yaml
# In .github/workflows/arog-master-orchestrator.yml

- name: Run complexity analysis
  run: |
    arog-cli skill run code-complexity-analyzer
```

### When Do They Get Triggered?

| Trigger | Skill | Usage |
|---------|-------|-------|
| **Agent invocation** | Any skill | Agents call skills as needed |
| **Workflow job** | Specific skill | Direct skill invocation |
| **Scheduled job** | health-monitor-pro | Daily at 2 AM UTC |
| **Pre-commit** | code-modernizer | Git hook |
| **Build process** | bundle-optimizer | During webpack build |
| **Security scan** | vulnerability-scanner-pro | Daily/on PR |

### How Do They Work?

**Skill Execution:**
```
1. Skill Configuration (.arog/skills/implementations/*.json)
   ↓
2. Execute Skill Command
   ↓
3. Process Files/Data
   ↓
4. Generate Output (JSON/Files)
   ↓
5. Return Results
```

**Example: Test Generator Skill**
```bash
$ arog-cli skill run test-generator-pro src/calculator.js

🧪 Test Generator Pro (Expert Level)

Analyzing: src/calculator.js
Functions found: 5

Generating tests:
  ✓ add() - 8 tests (happy path + edge cases)
  ✓ subtract() - 6 tests
  ✓ multiply() - 7 tests
  ✓ divide() - 9 tests (includes divide-by-zero)
  ✓ power() - 5 tests

Total: 35 tests generated
Coverage: 98%
File: tests/unit/calculator.test.js
```

---

## 3. 🚀 WORKFLOWS (.github/workflows/)

### What Are They?

**Workflows** are **automated pipelines** that orchestrate agents and skills. They run on GitHub Actions and execute automatically based on events or schedules.

### The 22 Workflows:

#### **Core Workflows (8)**
| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **arog-build.yml** | Push | Build + type check |
| **arog-code-quality.yml** | Push/PR | ESLint + Prettier |
| **arog-e2e-tests.yml** | PR | Playwright E2E tests |
| **arog-visual-regression.yml** | PR | Visual diff testing |
| **arog-load-tests.yml** | Workflow dispatch | k6 load testing |
| **arog-api-tests.yml** | PR | Supertest API tests |
| **arog-docker.yml** | PR | Docker build + scan |
| **arog-code-review.yml** | PR | Automated review |

#### **Automation Workflows (5)**
| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **arog-release.yml** | Tag | Auto-release + changelog |
| **arog-pre-commit.yml** | Push | Pre-commit validation |
| **arog-code-metrics.yml** | Daily | Collect metrics |
| **arog-monitoring.yml** | Schedule | Health monitoring |
| **arog-scheduler.yml** | Cron | Time-based jobs |

#### **Advanced Workflows (6)**
| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **arog-orchestrator.yml** | Workflow dispatch | Complex multi-step workflows |
| **arog-ifttt.yml** | Events | IF-THIS-THEN-THAT automation |
| **arog-ai-analysis.yml** | PR | AI-powered code analysis |
| **arog-zero-downtime-deploy.yml** | Workflow dispatch | Production deployment |
| **arog-master-orchestrator.yml** | Daily/Manual | Ultimate 8-phase pipeline |

#### **Test Workflows (3)**
| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **arog-mutation-tests.yml** | Workflow dispatch | Stryker mutation testing |
| **arog-accessibility.yml** | PR | axe-core a11y testing |
| **arog-performance.yml** | PR | Lighthouse performance |

### How Are They Used?

#### Automatic Triggers
```yaml
# Example: Runs automatically on pull request
on:
  pull_request:
    types: [opened, synchronize]
```

#### Manual Triggers
```yaml
# Example: Run manually from GitHub Actions UI
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [staging, production]
```

#### Scheduled Triggers
```yaml
# Example: Runs daily at 2 AM UTC
on:
  schedule:
    - cron: '0 2 * * *'
```

### When Do They Get Triggered?

#### **Event-Based Triggers:**
```
PR Opened → arog-code-review.yml
          → arog-e2e-tests.yml
          → arog-ai-analysis.yml
          → arog-accessibility.yml

Push to main → arog-build.yml
             → arog-code-quality.yml
             → arog-monitoring.yml

Tag created → arog-release.yml

Issue opened → arog-ifttt.yml
```

#### **Time-Based Triggers:**
```
Daily 2 AM UTC → arog-scheduler.yml (health check)
Monday 9 AM    → arog-scheduler.yml (dependency update)
1st of month   → arog-scheduler.yml (security audit)
Every 6 hours  → arog-scheduler.yml (performance baseline)
```

#### **Manual Triggers:**
```
Developer → GitHub Actions UI → Select workflow → "Run workflow"

Examples:
- arog-zero-downtime-deploy.yml (production deploy)
- arog-master-orchestrator.yml (full automation)
- arog-load-tests.yml (stress testing)
```

### How Do They Work?

**Workflow Execution Flow:**
```
1. Trigger Event
   ↓
2. GitHub Actions Runner Starts
   ↓
3. Checkout Code
   ↓
4. Setup Environment (Node.js, dependencies)
   ↓
5. Run Jobs (sequential or parallel)
   ↓
6. Execute Steps
   ├─ Run Skills
   ├─ Invoke Agents
   └─ Execute Commands
   ↓
7. Generate Reports/Artifacts
   ↓
8. Post Results (PR comments, Slack, etc.)
```

**Example: Master Orchestrator Workflow**
```yaml
# .github/workflows/arog-master-orchestrator.yml

# PHASE 1: Analysis (Parallel)
jobs:
  code-analysis:
    - Run code complexity analyzer
  security-analysis:
    - Run vulnerability scanner
  performance-analysis:
    - Run performance profiler

# PHASE 2: Testing (Sequential)
  unit-tests:
    needs: [code-analysis]
  integration-tests:
    needs: [unit-tests]
  e2e-tests:
    needs: [integration-tests]

# PHASE 3: AI Agents (Parallel)
  ai-agents:
    needs: [e2e-tests]
    - Run all 8 AI agents

# PHASE 4: Build
  build-optimize:
    - Production build
    - Bundle optimization

# PHASE 5: Deployment Checks
  deployment-checks:
    - Database migrations
    - Smoke tests

# PHASE 6: Monitoring
  setup-monitoring:
    - Configure alerts

# PHASE 7: Reporting
  generate-reports:
    - Aggregate all results

# PHASE 8: Notification
  notify:
    - Send to Slack/Email
```

---

## 📊 Integration: How They Work Together

### Example Scenario: Pull Request Workflow

```
Developer opens PR
        ↓
1. WORKFLOW: arog-ai-analysis.yml triggers
        ↓
2. AGENTS: Multiple agents activated
   ├─ code-review-agent (analyzes code quality)
   ├─ security-agent (scans for vulnerabilities)
   └─ test-generation-agent (generates missing tests)
        ↓
3. SKILLS: Agents use skills
   ├─ code-complexity-analyzer (by code-review-agent)
   ├─ vulnerability-scanner-pro (by security-agent)
   └─ test-generator-pro (by test-generation-agent)
        ↓
4. OUTPUT: Results posted to PR
   ├─ Code review comments
   ├─ Security findings
   └─ Generated test files
```

### Example: Scheduled Maintenance

```
Daily at 2 AM UTC
        ↓
1. WORKFLOW: arog-scheduler.yml triggers
        ↓
2. JOB: daily-health-check
        ↓
3. SKILL: health-monitor-pro
   ├─ Check API endpoints
   ├─ Verify database connections
   ├─ Monitor resource usage
        ↓
4. AGENT: If issues found → monitoring-agent
   ├─ Analyze problems
   └─ Suggest fixes
        ↓
5. OUTPUT: Health report + alerts
```

---

## 🎯 Quick Reference

### When to Use Each Layer:

| Need | Use | Example |
|------|-----|---------|
| **Expert analysis** | Agent | `arog-cli agent run code-review` |
| **Specific capability** | Skill | `arog-cli skill run bundle-optimizer` |
| **Automated pipeline** | Workflow | Push triggers build workflow |
| **Complex orchestration** | Master Orchestrator | Full validation before deploy |
| **Event-driven automation** | IFTTT Workflow | PR merge → auto-deploy |
| **Scheduled tasks** | Scheduler Workflow | Daily health checks |

### Access Methods:

```bash
# CLI (Command Line)
arog-cli agent run <agent-name>
arog-cli skill run <skill-name>

# Interactive (Wizards)
arog-wizard

# GitHub Actions (Automatic)
- Push/PR/Tag events
- Manual workflow dispatch
- Scheduled cron jobs
```

---

## 📚 Documentation Files

- **Agents**: [.github/agents/README.md](.github/agents/README.md)
- **Skills**: [.arog/skills/README.md](../.arog/skills/README.md)
- **Workflows**: Check individual `.github/workflows/*.yml` files
- **Complete Guide**: [AROG-100-PERCENT-COMPLETE.md](AROG-100-PERCENT-COMPLETE.md)

---

**Summary**: Workflows orchestrate everything, Agents provide intelligence, Skills provide capabilities. Together, they create a comprehensive automation platform that requires zero human intervention! 🚀
