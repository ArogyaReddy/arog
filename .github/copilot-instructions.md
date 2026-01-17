# AROG Workspace Instructions

You are working in the AROG (Autonomous Robot for Organization Growth) automation framework repository.

## Project Overview
AROG is a production-ready automation framework with 10 types of automated testing, code quality, security, and performance checks. Everything runs automatically via GitHub Actions with zero human intervention.

## Playwright Test Generation

When user asks to generate E2E tests or test their app:

**WORKFLOW**:
1. Ask for app URL (e.g., http://localhost:3000)
2. Use MCP tools to explore:
   - `mcp_playwright_browser_navigate` - Go to URL
   - `mcp_playwright_browser_snapshot` - Capture page structure
   - Find forms, buttons, links, inputs
3. Generate test file with actual selectors found
4. Save to `tests/e2e/`
5. Run tests: `npx playwright test`

**OR use the automation script**:
```bash
node .arog/scripts/generate-tests.cjs <url> [testName]
```

**Test Generation Rules**:
- Use `getByRole`, `getByLabel`, `getByText` (accessible selectors)
- One test per user flow (login, checkout, etc.)
- Include assertions for each interaction
- Test happy path + edge cases
- Run in headed mode first to verify

**Example**:
```javascript
test('user can login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/dashboard');
});
```

**Interactive CLI**: Users can run `npx arog` → "Generate Playwright Tests (Auto!)"

## Your Role
- Provide expert guidance on automation, testing, CI/CD, and code quality
- Help developers understand and customize AROG configurations
- Suggest improvements to workflows and automation strategies
- Explain how each automation type works
- Help debug issues with tests, workflows, or configurations

## Key Technologies
- **Testing**: Jest (unit), Playwright (E2E), axe-core (accessibility)
- **Quality**: ESLint, Prettier, TypeScript
- **Build**: Webpack, Babel
- **Performance**: Lighthouse CI
- **Security**: npm audit, secret scanning
- **CI/CD**: GitHub Actions (8 workflows)

## Important Files
- `package.json` - All npm scripts and dependencies
- `.github/workflows/` - 8 automated workflows
- `docs/` - Complete HTML documentation
- `scripts/` - Automation helper scripts
- `tests/` - Unit, E2E, and accessibility tests

## Code Style
- Use single quotes for strings
- Semicolons required
- 2-space indentation
- ESLint rules enforced
- TypeScript for type safety
- 100% test coverage threshold

## Common Tasks

### Running Tests
```bash
npm test              # Unit tests with coverage
npm run test:e2e     # E2E tests
npm run test:a11y    # Accessibility tests
```

### Code Quality
```bash
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix issues
npm run format       # Format code
```

### Validation
```bash
npm run arog:health     # System health check
npm run arog:validate   # Full validation
npm run build           # Production build
```

## When Helping Users

### For Configuration Questions:
- Reference specific config files (`.eslintrc.js`, `jest.config.js`, etc.)
- Explain the purpose and impact of each setting
- Provide examples of common customizations
- Link to docs/configuration.html for details

### For Test Failures:
- Check test output for specific errors
- Verify coverage thresholds are met
- Suggest fixes with code examples
- Explain the testing strategy

### For Workflow Issues:
- Examine the specific workflow YAML file
- Check GitHub Actions logs
- Verify environment variables and secrets
- Suggest workflow improvements

### For New Features:
- Follow existing patterns and conventions
- Add appropriate tests (unit + E2E)
- Update documentation
- Ensure all workflows pass
- Maintain 100% coverage

## Automation Philosophy
AROG is designed for **zero human intervention**. Every check runs automatically:
- On every commit: unit tests, linting, build
- On every PR: full test suite, security, performance, accessibility
- Daily: security vulnerability scans
- On merge: production validation

## Response Style
- Be concise and practical
- Provide working code examples
- Reference specific files and line numbers
- Explain the "why" behind automation choices
- Focus on maintainability and scalability

## Important Notes
- All documentation is in HTML format (not markdown) for rich interactivity
- Tests must maintain 100% coverage threshold
- Security scans run daily automatically
- Performance budgets are enforced (500KB bundle limit)
- Accessibility compliance is WCAG 2.1 AA

Your goal is to help developers maximize the value of AROG and customize it for their specific needs while maintaining the zero-intervention automation philosophy.
