import http from 'http';
import socket from 'socket.io';
import {
  ClientEvents,
  ServerEvents,
  GameData,
  Move,
  GameSocket
} from './Constants';
import { generateNickname } from './Nickname';
import { updateScores } from './Score';


export const createSocket = (server: http.Server, sessionMiddleware: any) => {
  const victoryThreshold = 5;
  const serverIO = socket(server);

  serverIO.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  let gameData: GameData = {
    players: [],
    currentMoves: [],
    isRoundInProgress: true,
    winner: null,
  };

  serverIO.on(ClientEvents.CONNECT, function (serverSocket: GameSocket) {
    const session = serverSocket.request.session;

    session.connections++;
    session.save();

    serverSocket.on(ClientEvents.JOIN_SERVER, function ({ userId }: { userId: string }) {
      try {
        if (userId) {
          serverSocket.userId = userId;
          if (!gameData.players.find(item => item.userId === userId)) {
            const nickname = generateNickname();
            gameData.players.push({
              userId,
              nickname,
              score: 0,
              isWinner: false
            });
            serverIO.emit(ServerEvents.PLAYER_JOINED, gameData);
          }
        }
      } catch (err) {
        console.log(err);
      }
    });

    serverSocket.on(ClientEvents.SET_MOVE, function ({ userId, selection }: Move) {
      try {
        if (userId && selection && !gameData.currentMoves.find(item => item.userId === userId)) {
          gameData.currentMoves.push({
            userId,
            selection,
          });
          serverIO.emit(ServerEvents.MOVE_ADDED, gameData);
          if (gameData.players?.length === gameData.currentMoves?.length) {
            gameData = updateScores(gameData);

            if (gameData.players[0]?.score >= victoryThreshold) {
              gameData.winner = gameData.players[0].userId;
            }

            gameData.isRoundInProgress = false;

            const completionEvent = gameData.winner ? ServerEvents.WIN : ServerEvents.ROUND_COMPLETED;

            serverIO.emit(completionEvent, gameData);
          }
        }
      } catch (err) {
        console.log(err);
      }
    });

    serverSocket.on(ClientEvents.REQUEST_NEXT_ROUND, function () {
      try {
        gameData.currentMoves = [];
        gameData.isRoundInProgress = true;
        gameData.players = [...gameData.players].filter(item => !!item.userId);
        serverIO.emit(ServerEvents.ROUND_STARTED, gameData);
      } catch (err) {
        console.log(err);
      }
    });

    serverSocket.on(ClientEvents.REQUEST_NEW_GAME, function () {
      try {
        gameData.currentMoves = [];
        gameData.players = [...gameData.players].map(item => {
          if (item) {
            item.isWinner = false;
            item.score = 0;
          }

          return item;
        });
        gameData.players = [...gameData.players].filter(item => !!item.userId);
        gameData.winner = null;
        gameData.isRoundInProgress = true;
        serverIO.emit(ServerEvents.ROUND_STARTED, gameData);
      } catch (err) {
        console.log(err);
      }
    });

    serverSocket.on(ClientEvents.DISCONNECT, function () {
      try {
        gameData.players = [...gameData.players].filter(item => item && item.userId !== serverSocket.userId);
        serverIO.emit(ServerEvents.PLAYER_LEFT, gameData);
      } catch (err) {
        console.log(err);
      }
    });
  });
};
