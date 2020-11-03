import { createServer } from './backend/Server';
import { handleGameSocket, GameSocket } from './backend/Socket';
import { IncomingMessages } from './backend/Constants';
import { join as pathJoin } from 'path';
import socket from 'socket.io';

const staticPath = pathJoin(__dirname, './frontend');
const port = process.env.PORT || 8080;

const server = createServer({
  port,
  staticPath,
});

const io = socket(server);

io.on(IncomingMessages.CONNECT, function (socket: GameSocket) {
  handleGameSocket({
    socket,
    io
  });
});
