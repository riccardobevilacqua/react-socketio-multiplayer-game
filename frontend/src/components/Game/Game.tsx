// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import { GameData, ClientEvents, ServerEvents, GameIO } from '../../common/Constants';
import { generateUserId } from '../../utils/utils';
import { MoveSelector } from '../MoveSelector/MoveSelector';
// import { MoveSelector } from '../MoveSelector/MoveSelector';
// import { ScoreBoard } from '../ScoreBoard/ScoreBoard';
// import { PlayerScore } from '../ScoreCard/ScoreCard';

export interface MoveSelection {
  userId: string;
  selection: string;
  score: number;
}

const gameIO: GameIO = io();
gameIO.userId = generateUserId();

// Time between two rounds (ms)
// const roundTransitionTime = 2000;

export const Game: React.FunctionComponent<{}> = () => {
  // eslint-disable-next-line
  // const [currentSelections, setCurrentSelections] = useState<MoveSelection[]>([]);
  // const [scores, setScores] = useState<PlayerScore[]>([]);
  // const [isRoundInProgress, setIsRoundInProgress] = useState(true);
  // const [winner, setWinner] = useState(null);
  const [gameData, setGameData] = useState<GameData | null>(null);

  useEffect(() => {
    gameIO.emit(ClientEvents.JOIN_SERVER, { userId: gameIO.userId });
  }, []);

  // const nextRound = () => {
  //   setTimeout(() => {
  //     setCurrentSelections([]);
  //     setIsRoundInProgress(true);
  //   }, roundTransitionTime);
  // }

  gameIO.on(ServerEvents.PLAYER_JOINED, function (data: GameData) {
    if (data) {
      setGameData(data);
    }
  });

  // socket.on('endRound', function (data: any) {
  //   if (!!data) {
  //     setIsRoundInProgress(false);
  //     setCurrentSelections(data.currentSelections);
  //     setScores(data.scoreBoard);
  //     if (!!data.winner) {
  //       setWinner(data.winner);
  //     } else {
  //       nextRound();
  //     }
  //   }
  // });

  // socket.on('restartGame', function (data: any) {
  //   if (!!data) {
  //     setIsRoundInProgress(true);
  //     setScores(data.scoreBoard);
  //     setCurrentSelections([]);
  //     setWinner(null);
  //   }
  // });

  // const handlePlayAgain = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   e.stopPropagation();
  //   socket.emit('playAgain');
  // };

  return (
    <>
      <div>Welcome, Player-{gameIO.userId}</div>
      <pre>
        {JSON.stringify(gameData)}
      </pre>
      <MoveSelector gameIO={gameIO} gameData={gameData} />
    </>
  );
};