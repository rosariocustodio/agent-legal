const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  
  // Try direct path first
  let filePath = path.join(__dirname, reqPath);
  
  // If not found, try fallback in css/, js/, or images/
  if (!fs.existsSync(filePath)) {
    const base = path.basename(reqPath);
    if (fs.existsSync(path.join(__dirname, 'css', base))) {
      filePath = path.join(__dirname, 'css', base);
    } else if (fs.existsSync(path.join(__dirname, 'js', base))) {
      filePath = path.join(__dirname, 'js', base);
    } else if (fs.existsSync(path.join(__dirname, 'images', base))) {
      filePath = path.join(__dirname, 'images', base);
    }
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File Not Found');
  }
});

// Listening without specifying host binds to both IPv4 (0.0.0.0) and IPv6 (::)
server.listen(PORT, () => {
  console.log(`Server running at:`);
  console.log(`- http://localhost:${PORT}`);
  console.log(`- http://127.0.0.1:${PORT}`);
});
