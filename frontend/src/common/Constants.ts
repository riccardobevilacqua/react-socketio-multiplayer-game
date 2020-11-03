export enum ClientEvents {
  CONNECT = 'connection',
  DISCONNECT = 'disconnect',
  JOIN_SERVER = 'joinServer',
  SET_MOVE = 'setMove',
}

export enum ServerEvents {
  PLAYER_JOINED = 'playerJoined',
}

export interface GameIO extends SocketIOClient.Socket {
  userId?: string;
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
