export function joinServer() {
  console.log('Joined');
}

// const express = require('express');
// const socket = require('socket.io');

// const { updateScoreBoard } = require('./scoreboard');

// const port = 4000;
// const app = express();

// const server = app.listen(port, () => {
//   console.log(`listening on port ${port}`);
// });

// const io = socket(server);
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