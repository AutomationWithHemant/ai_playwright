// Tiny local app for the course - no internet needed. Started automatically by Playwright.
const http = require('http');
const fs = require('fs');
const path = require('path');

const routes = { '/': 'login.html', '/login': 'login.html', '/inventory': 'inventory.html',
  '/register': 'register.html', '/signup': 'signup.html' };

http.createServer((req, res) => {
  const file = routes[req.url.split('?')[0]];
  if (!file) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync(path.join(__dirname, 'public', file)));
}).listen(3000, () => console.log('Demo app on http://localhost:3000'));
