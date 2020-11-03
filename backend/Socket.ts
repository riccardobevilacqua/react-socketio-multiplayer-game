import { Server } from 'socket.io';
import {
  IncomingMessages,
  OutgoingMessages,
  GameSocket,
  GameSocketHandlerProps,
} from './Constants';

let gameSocket: GameSocket;
let gameIO: Server;
let gameData = {
  scoreBoard: []
};

export const handleGameSocket = ({
  socket,
  io,
}: GameSocketHandlerProps) => {
  gameSocket = socket;
  gameIO = io;

  socket.on(IncomingMessages.JOIN_SERVER, function ({ userId }: { userId: string }) {
    try {
      if (userId) {
        gameSocket.userId = userId;
        if (!gameData.scoreBoard.find(item => item.userId === userId)) {
          gameData.scoreBoard.push({
            userId,
            score: 0,
            isWinner: false
          });
          gameIO.emit(OutgoingMessages.PLAYER_JOINED, gameData);
          console.log(`Player-${userId} joined`);
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on(IncomingMessages.DISCONNECT, function () {
    try {
      console.log(`Player-${gameSocket.userId} left`);
    } catch (err) {
      console.log(err);
    }
  });
}

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