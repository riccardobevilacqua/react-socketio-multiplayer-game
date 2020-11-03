import { join as pathJoin } from 'path';
import { createServer } from './backend/Server';
import { defaultPort, frontendPath } from './backend/Constants';
import { createSocket } from './backend/Socket';

const staticPath = pathJoin(__dirname, frontendPath);
const port = process.env.PORT || defaultPort;

const server = createServer({
  port,
  staticPath,
});

createSocket(server);
