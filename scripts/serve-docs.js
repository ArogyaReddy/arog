#!/usr/bin/env node

/**
 * AROG Documentation Server
 * Serves the HTML documentation on localhost
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DOCS_DIR = path.join(__dirname, '..', 'docs');

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // Parse URL and remove query string
  let filePath = req.url.split('?')[0];
  
  // Default to arog-agent.html (main page)
  if (filePath === '/' || filePath === '') {
    filePath = '/arog-agent.html';
  }

  // Security: prevent directory traversal
  filePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
  filePath = path.join(DOCS_DIR, filePath);

  // Get file extension
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found - try index.html
      const indexPath = path.join(DOCS_DIR, 'index.html');
      fs.access(indexPath, fs.constants.F_OK, (indexErr) => {
        if (indexErr) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 - Not Found</h1><p>The requested file was not found.</p>');
        } else {
          serveFile(indexPath, 'text/html');
        }
      });
      return;
    }

    serveFile(filePath, contentType);
  });

  function serveFile(file, type) {
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Internal Server Error</h1>');
        console.error('Error reading file:', err);
      } else {
        res.writeHead(200, { 'Content-Type': type });
        res.end(data);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                                                        ║');
  console.log('║    🤖  AROG Documentation Server                       ║');
  console.log('║                                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📚 Documentation available at:`);
  console.log('');
  console.log(`   🌐 Main Page:         http://localhost:${PORT}/`);
  console.log(`   📖 AROG Agent:        http://localhost:${PORT}/arog-agent.html`);
  console.log(`   🏠 Docs Home:         http://localhost:${PORT}/index.html`);
  console.log(`   🏗️  Architecture:      http://localhost:${PORT}/architecture-guide.html`);
  console.log(`   🚀 Setup Guide:       http://localhost:${PORT}/setup-guide.html`);
  console.log(`   ⚙️  Configuration:     http://localhost:${PORT}/configuration.html`);
  console.log(`   📚 API Reference:     http://localhost:${PORT}/api-reference.html`);
  console.log(`   🤖 @arog Agent:       http://localhost:${PORT}/arog-agent-complete-guide.html`);
  console.log(`   🚀 Deployment:        http://localhost:${PORT}/deployment-success.html`);
  console.log('');
  console.log(`📁 Serving files from: ${DOCS_DIR}`);
  console.log('');
  console.log('Press Ctrl+C to stop the server');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down AROG Documentation Server...');
  server.close(() => {
    console.log('✅ Server stopped successfully');
    process.exit(0);
  });
});
