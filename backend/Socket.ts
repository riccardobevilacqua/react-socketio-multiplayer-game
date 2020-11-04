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


export const createSocket = (server: http.Server) => {
  const serverIO = socket(server);
  const victoryThreshold = 2;

  let gameData: GameData = {
    players: [],
    currentMoves: [],
    isRoundInProgress: true,
    winner: null,
  };

  serverIO.on(ClientEvents.CONNECT, function (serverSocket: GameSocket) {
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
            // console.log(`Player-${userId} joined`);
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

          // console.log(`Player-${userId} selected ${selection}`);

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
        // console.log(`Player-${serverSocket.userId} left`);
      } catch (err) {
        console.log(err);
      }
    });
  });
};

// const { updateScoreBoard } = require('./scoreboard');

// const victoryThreshold = 2;
// let scoreBoard = [];
// let currentSelections = [];

// io.on('connection', function (socket) {
//   socket.on('joinServer', function (payload) {
//     try {
//       if (payload && payload.userId) {
//         const { userId } = payload;
//         socket.userId = userId;
//         scoreBoard.push({
//           userId,
//           score: 0,
//           isWinner: false
//         });
//         io.emit('joinServer', scoreBoard);
//         console.log(`Player-${userId} joined.`);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   });

//   socket.on('setSelection', function (payload) {
//     try {
//       if (payload && payload.userId && payload.selection) {
//         const { userId, selection } = payload;

//         currentSelections.push({
//           userId,
//           selection,
//           score: 0
//         });

//         if (scoreBoard.length === currentSelections.length) {
//           scoreBoard = updateScoreBoard({
//             currentSelections,
//             scoreBoard,
//           });
//           const winner = scoreBoard[0].score >= victoryThreshold ? scoreBoard[0].userId : null;
//           io.emit('endRound', {
//             currentSelections,
//             scoreBoard,
//             winner,
//           });

//           currentSelections = [];
//         }

//         console.log(`Player-${userId} selected ${selection}`);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   });

//   socket.on('playAgain', function () {
//     scoreBoard = [...scoreBoard].map(item => {
//       if (item) {
//         item.score = 0;
//         item.isWinner = false;
//       }
//     });
//     currentSelections = [];
//     winner = null;
//     io.emit('restartGame', { scoreBoard });
//   });

//   socket.on('disconnect', function () {
//     try {
//       scoreBoard = [...scoreBoard].filter(item => item && item.userId !== socket.userId);
//       io.emit('leaveServer', socket.userId);
//       console.log(`Player-${socket.userId} left.`);
//     } catch (err) {
//       console.log(err);
//     }
//   });
// });