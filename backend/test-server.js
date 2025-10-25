import http from 'http';
import fs from 'fs';
import path from 'path';

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/test-dropdowns.html') {
    fs.readFile('test-dropdowns.html', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🧪 Test server running at http://localhost:${PORT}`);
  console.log('📝 Open the URL to test dropdown functionality');
});