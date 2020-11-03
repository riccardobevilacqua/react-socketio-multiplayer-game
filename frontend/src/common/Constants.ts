export enum ClientEvents {
  CONNECT = 'connection',
  DISCONNECT = 'disconnect',
  JOIN_SERVER = 'joinServer',
}

export enum ServerEvents {
  PLAYER_JOINED = 'playerJoined',
}

export interface Player {
  userId: string;
  score: number;
  isWinner: boolean;
}

export interface GameData {
  players: Player[];
}
