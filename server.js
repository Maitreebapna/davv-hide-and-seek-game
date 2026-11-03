// Zero-dependency local development server for VS Code
const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = parseInt(process.env.PORT, 10) || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/') reqUrl = '/index.html';

  const safePath = path.normalize(path.join(BASE_DIR, reqUrl));
  if (!safePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(safePath).pipe(res);
  });
});

function listen(portToTry) {
  server.listen(portToTry, () => {
    console.log(`\n======================================================`);
    console.log(`  DAVV Campus 2D Hide & Seek Game Server Running!`);
    console.log(`  Open in browser: http://localhost:${portToTry}`);
    console.log(`======================================================\n`);
  });
}

// Automatically fallback to next available port if current port is busy
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`  Port ${PORT} is already in use by another app.`);
    PORT += 1;
    console.log(` Trying port ${PORT} instead...`);
    listen(PORT);
  } else {
    console.error('Server error:', err);
  }
});

listen(PORT);
