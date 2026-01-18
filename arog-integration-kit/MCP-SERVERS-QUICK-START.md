# 🎯 MCP Multi-Server Integration - QUICK START

## ✅ What You Just Got

AROG now includes **5 MCP servers** for complete SDLC automation:

```
🎭 Playwright     → E2E testing & browser automation
🐙 GitHub         → Code review & PR management  
🦊 GitLab         → CI/CD & repository management
💬 Slack          → Team notifications
🐘 PostgreSQL     → Database management
```

## 🚀 3-Step Setup

### Step 1: Copy Environment Template

```bash
cp .env.mcp.template .env
```

### Step 2: Add Your Credentials

Edit `.env` with your API keys:

```bash
# REQUIRED: GitHub (Tier 1)
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxxx

# OPTIONAL: GitLab (Tier 2)
GITLAB_PERSONAL_ACCESS_TOKEN=glpat_xxxxxxxxxxxxx
GITLAB_API_URL=https://gitlab.com/api/v4

# OPTIONAL: Slack (Tier 2)
SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxxx
SLACK_TEAM_ID=T01234567

# OPTIONAL: PostgreSQL (Tier 3)
POSTGRES_CONNECTION_STRING=postgresql://user:pass@localhost:5432/db
```

### Step 3: Restart VS Code

**CRITICAL**: Quit VS Code completely, then relaunch.

## 💡 Example Commands

```
@arog review this PR for security issues
@arog generate E2E tests for login flow
@arog notify #engineering about deployment
@arog optimize this database query
@arog trigger GitLab CI pipeline
```

## 📖 Full Documentation

See [MCP-SERVERS-README.md](./MCP-SERVERS-README.md) for:
- Detailed server capabilities
- Complete setup instructions
- Troubleshooting guide
- SDLC workflow examples

---

**Ready to automate your entire development workflow? Start with GitHub + Playwright! 🚀**
