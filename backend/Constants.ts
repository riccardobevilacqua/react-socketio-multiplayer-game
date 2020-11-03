import { Socket, Server } from 'socket.io';

export enum IncomingMessages {
  CONNECT = 'connection',
  DISCONNECT = 'disconnect',
  JOIN_SERVER = 'joinServer',
}

export enum OutgoingMessages {
  PLAYER_JOINED = 'playerJoined',
}

export interface GameSocket extends Socket {
  userId: string;
}

export interface GameSocketHandlerProps {
  socket: GameSocket;
  io: Server;
}
