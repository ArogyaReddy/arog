#!/usr/bin/env node

/**
 * AROG Playwright MCP Server
 * 
 * This is the MCP server that enables @arog to:
 * - Control browsers programmatically
 * - Navigate web applications
 * - Capture page structure
 * - Interact with UI elements
 * - Generate E2E tests automatically
 * 
 * Based on: https://github.com/microsoft/playwright-mcp
 * 
 * Usage:
 * 1. Start server: node index.js
 * 2. Configure in VS Code MCP settings
 * 3. Use with @arog commands
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { chromium } from 'playwright';

let browser = null;
let context = null;
let page = null;

const server = new Server(
  {
    name: 'arog-playwright-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper function to ensure browser is running
async function ensureBrowser() {
  if (!browser) {
    browser = await chromium.launch({
      headless: false, // Show browser by default for @arog
    });
    context = await browser.newContext();
    page = await context.newPage();
  }
  return page;
}

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'playwright_navigate',
        description: 'Navigate to a URL in the browser',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'The URL to navigate to',
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'playwright_snapshot',
        description: 'Get the accessibility tree of the current page',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'playwright_click',
        description: 'Click an element on the page',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector or text to click',
            },
          },
          required: ['selector'],
        },
      },
      {
        name: 'playwright_type',
        description: 'Type text into an input field',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector for the input field',
            },
            text: {
              type: 'string',
              description: 'Text to type',
            },
          },
          required: ['selector', 'text'],
        },
      },
      {
        name: 'playwright_screenshot',
        description: 'Take a screenshot of the current page',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to save the screenshot',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'playwright_evaluate',
        description: 'Execute JavaScript in the page context',
        inputSchema: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: 'JavaScript expression to evaluate',
            },
          },
          required: ['expression'],
        },
      },
      {
        name: 'playwright_close',
        description: 'Close the browser',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'playwright_navigate': {
        const currentPage = await ensureBrowser();
        await currentPage.goto(args.url);
        const title = await currentPage.title();
        return {
          content: [
            {
              type: 'text',
              text: `Navigated to ${args.url}\nPage title: ${title}`,
            },
          ],
        };
      }

      case 'playwright_snapshot': {
        const currentPage = await ensureBrowser();
        const snapshot = await currentPage.accessibility.snapshot();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(snapshot, null, 2),
            },
          ],
        };
      }

      case 'playwright_click': {
        const currentPage = await ensureBrowser();
        await currentPage.click(args.selector);
        return {
          content: [
            {
              type: 'text',
              text: `Clicked: ${args.selector}`,
            },
          ],
        };
      }

      case 'playwright_type': {
        const currentPage = await ensureBrowser();
        await currentPage.fill(args.selector, args.text);
        return {
          content: [
            {
              type: 'text',
              text: `Typed "${args.text}" into ${args.selector}`,
            },
          ],
        };
      }

      case 'playwright_screenshot': {
        const currentPage = await ensureBrowser();
        await currentPage.screenshot({ path: args.path });
        return {
          content: [
            {
              type: 'text',
              text: `Screenshot saved to ${args.path}`,
            },
          ],
        };
      }

      case 'playwright_evaluate': {
        const currentPage = await ensureBrowser();
        const result = await currentPage.evaluate(args.expression);
        return {
          content: [
            {
              type: 'text',
              text: `Result: ${JSON.stringify(result)}`,
            },
          ],
        };
      }

      case 'playwright_close': {
        if (browser) {
          await browser.close();
          browser = null;
          context = null;
          page = null;
        }
        return {
          content: [
            {
              type: 'text',
              text: 'Browser closed',
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('AROG Playwright MCP server running');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
