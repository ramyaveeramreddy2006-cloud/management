const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PREVIEW_PORT || 3000;
const buildDir = path.join(__dirname, '..', 'build');

const types = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const requestPath = req.url.split('?')[0];
  const filePath = path.join(buildDir, requestPath === '/' ? 'index.html' : requestPath);
  const safePath = filePath.startsWith(buildDir) ? filePath : path.join(buildDir, 'index.html');
  const finalPath = fs.existsSync(safePath) && fs.statSync(safePath).isFile()
    ? safePath
    : path.join(buildDir, 'index.html');

  fs.readFile(finalPath, (error, content) => {
    if (error) {
      res.writeHead(500);
      res.end('Could not load preview');
      return;
    }

    res.writeHead(200, {
      'Content-Type': types[path.extname(finalPath)] || 'text/plain'
    });
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`Preview running at http://localhost:${port}`);
});
