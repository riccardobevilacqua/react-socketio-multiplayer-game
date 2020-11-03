// import { Server } from './backend/Server';
import express, { Request, Response } from 'express';
import { join as pathJoin } from 'path';
import socket from 'socket.io';

const app = express();
const staticPath = pathJoin(__dirname, './frontend');
const port = process.env.PORT || 8080;

// const server = new Server(app, staticPath);
// server.start(port);
app.use(express.static(staticPath));

app.get('/api', (_req: Request, res: Response): void => {
  res.send('You have reached the API!');
});

app.get('*', (_req: Request, res: Response): void => {
  res.sendFile(staticPath);
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const io = socket(server);

io.on('connection', function (socket: socket.Socket) {
  socket.on('joinServer', function () {
    console.log('Joined');
  });
});
