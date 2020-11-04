// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import { GameData, ClientEvents, ServerEvents, GameIO } from '../../common/Constants';
import { generateUserId } from '../../utils/utils';
import { MoveSelector } from '../MoveSelector/MoveSelector';
import { ScoreBoard } from '../ScoreBoard/ScoreBoard';
// import { MoveSelector } from '../MoveSelector/MoveSelector';
// import { ScoreBoard } from '../ScoreBoard/ScoreBoard';
// import { PlayerScore } from '../ScoreCard/ScoreCard';

export interface MoveSelection {
  userId: string;
  selection: string;
  score: number;
}

const roundTransitionTime = 2000;
const gameIO: GameIO = io();
gameIO.userId = generateUserId();

export const Game: React.FunctionComponent<{}> = () => {
  // eslint-disable-next-line
  // const [currentSelections, setCurrentSelections] = useState<MoveSelection[]>([]);
  // const [scores, setScores] = useState<PlayerScore[]>([]);
  // const [isRoundInProgress, setIsRoundInProgress] = useState(true);
  // const [winner, setWinner] = useState(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

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
      if (!nickname) {
        const player = data.players.find(item => item.userId === gameIO.userId);

        if (player?.nickname) {
          setNickname(player.nickname);
        }
      }

      setGameData(data);
    }
  });

  gameIO.on(ServerEvents.ROUND_COMPLETED, function (data: GameData) {
    if (data) {
      setGameData(data);
      setTimeout(() => {
        gameIO.emit(ClientEvents.REQUEST_NEXT_ROUND);
      }, roundTransitionTime);
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
      <div>Welcome, {nickname}</div>
      <MoveSelector gameIO={gameIO} gameData={gameData} />
      <ScoreBoard gameData={gameData} />
    </>
  );
};