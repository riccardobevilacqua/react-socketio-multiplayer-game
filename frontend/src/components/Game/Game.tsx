import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import { GameData, ClientEvents, ServerEvents, GameIO } from '../../common/Constants';
import { generateUserId } from '../../utils/utils';
import { MoveSelector } from '../MoveSelector/MoveSelector';
import { ScoreBoard } from '../ScoreBoard/ScoreBoard';

export interface MoveSelection {
  userId: string;
  selection: string;
  score: number;
}

const roundTransitionTime = 1500;
const gameIO: GameIO = io();
gameIO.userId = generateUserId();

export const Game: React.FunctionComponent<{}> = () => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    gameIO.emit(ClientEvents.JOIN_SERVER, { userId: gameIO.userId });
  }, []);

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

  gameIO.on(ServerEvents.ROUND_STARTED, function (data: GameData) {
    if (data) {
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

  gameIO.on(ServerEvents.WIN, function (data: GameData) {
    if (data) {
      setGameData(data);
    }
  });

  const handlePlayAgain = (e: React.MouseEvent) => {
    e.stopPropagation();

    gameIO.emit(ClientEvents.REQUEST_NEW_GAME);
  }

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