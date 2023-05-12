const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const STATIC_FOLDER = 'static';
const LOG_FILE = 'mycoolserver.log';

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();

  if (method !== 'GET') {
    res.writeHead(405);
    res.end('Method Not Allowed');
    console.error(`${timestamp} - ${method} ${url} 405 Method Not Allowed`);
    return;
  }

  let filePath = path.join(__dirname, STATIC_FOLDER, url === '/' ? '/index.html' : url);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    console.error(`${timestamp} - ${method} ${url} 404 Not Found`);
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal Server Error');
      console.error(`${timestamp} - ${method} ${url} 500 Internal Server Error: ${err.message}`);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
    console.log(`${timestamp} - ${method} ${url} 200 OK`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

fs.appendFile(LOG_FILE, `Server started at ${new Date().toISOString()}\n`, (err) => {
  if (err) {
    console.error(`Cannot write to log file: ${err.message}`);
  } else {
    console.log(`Log file: ${LOG_FILE}`);
  }
});