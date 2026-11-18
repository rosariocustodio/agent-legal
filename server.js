const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 3000;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  
  let filePath = path.join(__dirname, reqPath);
  
  // Fallbacks if directly requested from root
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
    const contentType = MIME[ext] || 'application/octet-stream';
    const isHtml = ext === '.html';
    
    // Cache headers: immutable cache for static assets, no-cache validation for html
    const cacheControl = isHtml 
      ? 'public, max-age=0, must-revalidate'
      : 'public, max-age=31536000, immutable';

    const acceptEncoding = req.headers['accept-encoding'] || '';
    const rawStream = fs.createReadStream(filePath);

    // Compress text assets (html, css, js, svg) with GZIP if supported
    const isCompressible = /html|css|javascript|svg/.test(contentType);

    if (isCompressible && acceptEncoding.includes('gzip')) {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Encoding': 'gzip',
        'Cache-Control': cacheControl,
        'Access-Control-Allow-Origin': '*'
      });
      rawStream.pipe(zlib.createGzip()).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'Access-Control-Allow-Origin': '*'
      });
      rawStream.pipe(res);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`High-Performance Server running at:`);
  console.log(`- http://localhost:${PORT}`);
  console.log(`- http://127.0.0.1:${PORT}`);
});
