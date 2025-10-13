const http = require('http');
// Ensure JWT secret is defined to avoid signup token generation failures
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'dev_secret_change_me';
}
const app = require('./app');

// Start server with automatic port fallback if in use
function startServer(startPort) {
  let currentPort = startPort;
  const server = http.createServer(app);

  function listen() {
    server.listen(currentPort, () => {
      console.log(`Server is running on port ${currentPort}`);
    });
  }

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${currentPort} is in use, trying ${currentPort + 1}...`);
      currentPort += 1;
      setTimeout(listen, 250);
    } else {
      console.error('Server failed to start:', err);
      process.exit(1);
    }
  });

  listen();
}

const desiredPort = Number(process.env.PORT) || 3000;
startServer(desiredPort);