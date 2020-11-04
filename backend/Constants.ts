import { Socket, Server } from 'socket.io';

export enum ClientEvents {
  CONNECT = 'connection',
  DISCONNECT = 'disconnect',
  JOIN_SERVER = 'joinServer',
  SET_MOVE = 'setMove',
  REQUEST_NEXT_ROUND = 'requestNextRound',
}

export enum ServerEvents {
  PLAYER_JOINED = 'playerJoined',
  ROUND_COMPLETED = 'roundCompleted',
  WIN = 'win',
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
  score?: number;
}

export interface GameData {
  players: Player[];
  currentMoves: Move[];
  isRoundInProgress: boolean;
  winner: string | null;
}

export const defaultPort = 8080;

export const frontendPath = './frontend';
