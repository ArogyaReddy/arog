# 🎯 AROG MCP Servers - Complete SDLC Automation

## Overview

AROG now includes **5 powerful MCP servers** covering your entire Software Development Lifecycle:

| Server | Tier | Purpose | Package |
|---|---|---|---|
| 🎭 **Playwright** | 1 | E2E test generation & automation | `@playwright/mcp@latest` |
| 🐙 **GitHub** | 1 | Code review & PR management | `@modelcontextprotocol/server-github` |
| 🦊 **GitLab** | 2 | GitLab CI/CD & repo management | `gitlab-mcp-server` |
| 💬 **Slack** | 2 | Team notifications | `slack-mcp-server` |
| 🐘 **PostgreSQL** | 3 | Database management | `@modelcontextprotocol/server-postgres` |

## 🚀 Quick Start

### 1. Automatic Setup (Recommended)

When you run `npm install` in your project with AROG integration kit, the setup happens automatically:

```bash
cd your-project
npm install
```

This will:
- ✅ Install all MCP server packages globally
- ✅ Create `.vscode/settings.json` with server configurations
- ✅ Generate `.env.mcp.template` with required environment variables
- ✅ Create `MCP-SERVERS-SETUP.md` documentation

### 2. Manual Setup (If Needed)

```bash
npm run arog:setup-mcp-servers
```

### 3. Configure Authentication

Copy the environment template:

```bash
cp .env.mcp.template .env
```

Edit `.env` and add your credentials:

```bash
# GitHub MCP Server (Tier 1 - ESSENTIAL)
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here

# GitLab MCP Server (Tier 2 - HIGH VALUE) - Optional
GITLAB_PERSONAL_ACCESS_TOKEN=glpat_your_token_here
GITLAB_API_URL=https://gitlab.com/api/v4

# Slack MCP Server (Tier 2 - HIGH VALUE) - Optional
SLACK_BOT_TOKEN=xoxb-your-token-here
SLACK_TEAM_ID=T01234567

# PostgreSQL MCP Server (Tier 3 - STRATEGIC) - Optional
POSTGRES_CONNECTION_STRING=postgresql://user:pass@localhost:5432/dbname
```

**⚠️ SECURITY**: Add `.env` to `.gitignore` to avoid committing secrets!

### 4. Restart VS Code

**CRITICAL STEP:**

1. **Quit VS Code completely** (Cmd+Q on Mac, Alt+F4 on Windows)
2. **Relaunch VS Code**
3. **Open your project**

MCP servers will now be active! 🎉

## 📚 Server Details

### 🎭 Playwright MCP Server (Tier 1 - ESSENTIAL)

**Purpose**: E2E test generation, browser automation, visual testing

**Capabilities**:
- Generate Playwright tests from user flows
- Take screenshots and PDFs
- Run browser automation tasks
- Debug failing tests

**Example Commands**:
```
@arog create E2E tests for the login flow
@arog take a screenshot of https://example.com
@arog test the checkout process
@arog debug the failing payment test
```

**Configuration**: No API keys required! ✅

**Official Docs**: https://playwright.dev/docs/test-agents

---

### 🐙 GitHub MCP Server (Tier 1 - ESSENTIAL)

**Purpose**: Code review, PR management, issue tracking

**Capabilities**:
- Review pull requests
- Create/update/close issues
- Search code and commits
- Manage repositories
- Create branches and tags

**Example Commands**:
```
@arog review this PR for security vulnerabilities
@arog create an issue for bug in auth.ts
@arog summarize recent commits in main branch
@arog search for TODO comments in the codebase
```

**Setup**:

1. **Create GitHub Personal Access Token**:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `read:org`, `workflow`
   - Copy the token

2. **Add to `.env`**:
   ```bash
   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
   ```

**Official Docs**: https://github.com/modelcontextprotocol/servers/tree/main/src/github

---

### 🦊 GitLab MCP Server (Tier 2 - HIGH VALUE)

**Purpose**: GitLab repository management, CI/CD, merge requests

**Capabilities**:
- Manage GitLab projects
- Create/update merge requests
- Trigger CI/CD pipelines
- Review code changes
- Manage issues and milestones

**Example Commands**:
```
@arog create a merge request from feature branch
@arog trigger CI pipeline for staging
@arog review recent merge requests
@arog check pipeline status
```

**Setup**:

1. **Create GitLab Personal Access Token**:
   - Go to https://gitlab.com/-/profile/personal_access_tokens
   - Click "Add new token"
   - Select scopes: `api`, `read_repository`, `write_repository`
   - Copy the token

2. **Add to `.env`**:
   ```bash
   GITLAB_PERSONAL_ACCESS_TOKEN=glpat_your_token_here
   GITLAB_API_URL=https://gitlab.com/api/v4
   ```

**Official Docs**: https://docs.gitlab.com/user/gitlab_duo/model_context_protocol/

---

### 💬 Slack MCP Server (Tier 2 - HIGH VALUE)

**Purpose**: Team communication, notifications, status updates

**Capabilities**:
- Post messages to channels
- Send direct messages
- Update team on automation status
- Share test results
- Notify on deployment events

**Example Commands**:
```
@arog notify #engineering when tests pass
@arog post deployment status to #releases
@arog send test report to #qa
@arog message the team about the release
```

**Setup**:

1. **Create Slack App**:
   - Go to https://api.slack.com/apps
   - Click "Create New App"
   - Select "From scratch"
   - Name: "AROG Automation Bot"
   - Select your workspace

2. **Add Bot Token Scopes**:
   - Go to "OAuth & Permissions"
   - Add scopes: `chat:write`, `channels:read`, `groups:read`

3. **Install to Workspace**:
   - Click "Install to Workspace"
   - Copy the "Bot User OAuth Token"

4. **Get Team ID**:
   - Go to https://api.slack.com/methods/auth.test/test
   - Run the test to get your `team_id`

5. **Add to `.env`**:
   ```bash
   SLACK_BOT_TOKEN=xoxb-your-token-here
   SLACK_TEAM_ID=T01234567
   ```

**Official Docs**: https://github.com/modelcontextprotocol/servers-archived/tree/main/src/slack

---

### 🐘 PostgreSQL MCP Server (Tier 3 - STRATEGIC)

**Purpose**: Database management, query optimization, schema analysis

**Capabilities**:
- Execute SQL queries
- Inspect database schema
- Optimize slow queries
- Check database health
- Manage tables and indexes

**Example Commands**:
```
@arog show me the users table schema
@arog optimize this slow query
@arog check for missing indexes
@arog explain this query plan
```

**Setup**:

1. **Get PostgreSQL Connection String**:
   ```
   postgresql://username:password@hostname:5432/database_name
   ```

2. **Add to `.env`**:
   ```bash
   POSTGRES_CONNECTION_STRING=postgresql://user:pass@localhost:5432/mydb
   ```

**Official Docs**: https://github.com/modelcontextprotocol/servers/tree/main/src/postgres

---

## 🎯 Complete SDLC Workflow Example

Here's how all MCP servers work together:

```
1. CODE DEVELOPMENT
   @arog search GitHub for similar implementations
   @arog create a feature branch on GitLab

2. CODE REVIEW
   @arog review this PR for security issues
   @arog check code quality standards

3. AUTOMATED TESTING
   @arog generate E2E tests for new feature
   @arog run Playwright tests on staging

4. DATABASE CHANGES
   @arog verify database migration is safe
   @arog check query performance

5. DEPLOYMENT
   @arog trigger GitLab CI/CD pipeline
   @arog notify Slack when deployment completes

6. POST-DEPLOYMENT
   @arog check PostgreSQL database health
   @arog send test results to #qa channel
```

## 🔧 Troubleshooting

### MCP servers not appearing?

1. ✅ Verify `.vscode/settings.json` exists
2. ✅ Check all environment variables are set in `.env`
3. ✅ Restart VS Code completely (quit and relaunch)
4. ✅ Check VS Code > Help > Toggle Developer Tools > Console

### Authentication errors?

1. ✅ Verify tokens are valid and not expired
2. ✅ Check token has required scopes/permissions
3. ✅ Ensure token format is correct:
   - GitHub: `ghp_...`
   - GitLab: `glpat_...`
   - Slack: `xoxb-...`

### Server not responding?

```bash
# Check if installed globally
npm list -g @playwright/mcp
npm list -g @modelcontextprotocol/server-github

# Reinstall if needed
npm install -g @playwright/mcp@latest
npm install -g @modelcontextprotocol/server-github
```

## 📖 Additional Resources

- **MCP Official Docs**: https://modelcontextprotocol.io/
- **MCP TypeScript SDK**: https://github.com/modelcontextprotocol/typescript-sdk
- **MCP Server Registry**: https://github.com/modelcontextprotocol/servers
- **Playwright Test Agents**: https://playwright.dev/docs/test-agents
- **AROG Documentation**: docs/arog-agent.html

## 🚀 Next Steps

1. **Start Simple**: Use Playwright and GitHub MCP servers first
2. **Add as Needed**: Enable GitLab/Slack/PostgreSQL when required
3. **Explore**: Try different commands and workflows
4. **Automate**: Build custom @arog workflows combining multiple servers

---

**Built with ❤️ by AROG - Autonomous Robot for Organization Growth**

**Now with FULL SDLC automation via MCP servers!** 🎯🤖
