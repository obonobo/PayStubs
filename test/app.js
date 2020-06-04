/**
 * This is my starter app
 */
const http = require('http');

const hostAllInterfaces = '0.0.0.0';
const localHost = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!');
});

const myHost = localHost;
server.listen(port, myHost, () => 
{
  console.log(`Server running at http://${myHost}:${port}/`);
});
