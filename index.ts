import { createServer } from './backend/Server';
import { joinServer } from './backend/Socket';
import { join as pathJoin } from 'path';
import socket from 'socket.io';

// const app = express();
const staticPath = pathJoin(__dirname, './frontend');
const port = process.env.PORT || 8080;

const server = createServer({
  port,
  staticPath,
});

const io = socket(server);

io.on('connection', function (socket: socket.Socket) {
  socket.on('joinServer', joinServer);
});
