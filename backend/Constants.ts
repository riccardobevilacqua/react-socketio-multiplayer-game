import { Socket, Server } from 'socket.io';

export enum ClientEvents {
  CONNECT = 'connection',
  DISCONNECT = 'disconnect',
  JOIN_SERVER = 'joinServer',
  SET_MOVE = 'setMove',
}

export enum ServerEvents {
  PLAYER_JOINED = 'playerJoined',
}

export interface GameSocket extends Socket {
  userId: string;
}

export interface GameSocketHandlerProps {
  socket: GameSocket;
  io: Server;
}

export interface Player {
  userId: string;
  score: number;
  isWinner: boolean;
}

export interface Move {
  userId: string;
  selection: string;
}

export interface GameData {
  players: Player[];
  currentMoves: Move[];
  isRoundInProgress: boolean;
}

export const defaultPort = 8080;

export const frontendPath = './frontend';
