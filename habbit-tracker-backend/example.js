const net = require('net');

const port = 3000;  // change to port you want to test

const server = net.createServer();

server.once('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${port} is already in use`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.once('listening', () => {
  console.log(`Port ${port} is available`);
  server.close();
});

server.listen(port);

