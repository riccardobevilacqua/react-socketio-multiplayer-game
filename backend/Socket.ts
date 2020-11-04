import http from 'http';
import socket from 'socket.io';
import {
  ClientEvents,
  ServerEvents,
  GameData,
  Move,
  GameSocket
} from './Constants';
import { updateScores } from './Score';

const victoryThreshold = 2;
let gameData: GameData = {
  players: [],
  currentMoves: [],
  isRoundInProgress: true,
  winner: null,
};

export const createSocket = (server: http.Server) => {
  const serverIO = socket(server);

  serverIO.on(ClientEvents.CONNECT, function (serverSocket: GameSocket) {
    serverSocket.on(ClientEvents.JOIN_SERVER, function ({ userId }: { userId: string }) {
      try {
        if (userId) {
          serverSocket.userId = userId;
          if (!gameData.players.find(item => item.userId === userId)) {
            gameData.players.push({
              userId,
              score: 0,
              isWinner: false
            });
            serverIO.emit(ServerEvents.PLAYER_JOINED, gameData);
            console.log(`Player-${userId} joined`);
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

          console.log(`Player-${userId} selected ${selection}`);

          if (gameData.players.length === gameData.currentMoves.length) {
            gameData = updateScores(gameData);
            gameData.winner = gameData.players[0].score >= victoryThreshold ? gameData.players[0].userId : null;
            gameData.isRoundInProgress = false;

            const completionEvent = gameData.winner ? ServerEvents.WIN : ServerEvents.ROUND_COMPLETED;

            serverIO.emit(completionEvent, gameData);

            gameData.currentMoves = [];
          }
        }
      } catch (err) {
        console.log(err);
      }
    });

    serverSocket.on(ClientEvents.DISCONNECT, function () {
      try {
        console.log(`Player-${serverSocket.userId} left`);
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