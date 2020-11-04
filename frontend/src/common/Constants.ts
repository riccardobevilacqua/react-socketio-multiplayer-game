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

export interface GameIO extends SocketIOClient.Socket {
  userId?: string;
}

export interface Player {
  userId: string;
  nickname: string;
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
  winner: string | null;
}
