import { createServer } from './backend/Server';
import { handleGameSocket } from './backend/Socket';
import { defaultPort, frontendPath, ClientEvents, GameSocket } from './backend/Constants';
import { join as pathJoin } from 'path';
import socket from 'socket.io';

const staticPath = pathJoin(__dirname, frontendPath);
const port = process.env.PORT || defaultPort;

const server = createServer({
  port,
  staticPath,
});

const io = socket(server);

io.on(ClientEvents.CONNECT, function (socket: GameSocket) {
  handleGameSocket({
    socket,
    io
  });
});
