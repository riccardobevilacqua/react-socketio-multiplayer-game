import React, { useState, useEffect } from 'react';

import { GameData, ClientEvents, ServerEvents } from '../../common/Constants';
import { gameIO } from '../../common/GameIO';
import { MoveSelector } from '../MoveSelector/MoveSelector';
import { ScoreBoard } from '../ScoreBoard/ScoreBoard';

export interface MoveSelection {
  userId: string;
  selection: string;
  score: number;
}

const roundTransitionTime = 1500;

export const Game: React.FunctionComponent<{}> = () => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    gameIO.emit(ClientEvents.JOIN_SERVER, { userId: gameIO.userId });

    gameIO.on(ServerEvents.PLAYER_JOINED, handlePlayerJoined);

    gameIO.on(ServerEvents.ROUND_STARTED, handleRoundStarted);

    gameIO.on(ServerEvents.ROUND_COMPLETED, handleRoundCompleted);

    gameIO.on(ServerEvents.WIN, handleWin);

    return () => {
      gameIO.on(ServerEvents.PLAYER_JOINED, handlePlayerJoined);
      gameIO.on(ServerEvents.ROUND_STARTED, handleRoundStarted);
      gameIO.on(ServerEvents.ROUND_COMPLETED, handleRoundCompleted);
      gameIO.off(ServerEvents.WIN, handleWin);
    }
  },
    // eslint-disable-next-line
    []
  );

  function handlePlayerJoined(data: GameData) {
    if (data) {
      if (!nickname) {
        const player = data.players.find(item => item.userId === gameIO.userId);

        if (player?.nickname) {
          setNickname(player.nickname);
        }
      }

      setGameData(data);
    }
  }

  function handleRoundStarted(data: GameData) {
    if (data) {
      setGameData(data);
    }
  }

  function handleRoundCompleted(data: GameData) {
    if (data) {
      setGameData(data);
      setTimeout(() => {
        gameIO.emit(ClientEvents.REQUEST_NEXT_ROUND);
      }, roundTransitionTime);
    }
  }

  function handleWin(data: GameData) {
    if (data) {
      setGameData(data);
    }
  }

  // const handleSetMove = () => {

  // };

  const handlePlayAgain = (e: React.MouseEvent) => {
    e.stopPropagation();

    gameIO.emit(ClientEvents.REQUEST_NEW_GAME);
  };

  return (
    <>
      <div>Welcome, {nickname}</div>
      <MoveSelector gameIO={gameIO} gameData={gameData} />
      {
        gameData?.winner &&
        (
          <div>
            <p>{gameData.winner} wins!</p>
            <button className="button" onClick={e => handlePlayAgain(e)} >Play Again</button>
          </div>
        )
      }
      <ScoreBoard gameData={gameData} />
    </>
  );
};