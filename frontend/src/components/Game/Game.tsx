import React, { useState, useEffect } from 'react';

import {
  GameData,
  Player,
  ClientEvents,
  ServerEvents,
} from '../../common/Constants';
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
  const [player, setCurrentPlayer] = useState<Player | null>(null);

  useEffect(
    () => {
      gameIO.emit(ClientEvents.JOIN_SERVER, { userId: gameIO.userId });
      gameIO.on(ServerEvents.PLAYER_JOINED, handlePlayerJoined);
      gameIO.on(ServerEvents.PLAYER_LEFT, handlePlayerLeft);
      gameIO.on(ServerEvents.ROUND_STARTED, handleRoundStarted);
      gameIO.on(ServerEvents.ROUND_COMPLETED, handleRoundCompleted);
      gameIO.on(ServerEvents.WIN, handleWin);
      gameIO.on(ServerEvents.MOVE_ADDED, handleMoveAdded);

      return () => {
        gameIO.off(ServerEvents.PLAYER_JOINED, handlePlayerJoined);
        gameIO.off(ServerEvents.PLAYER_LEFT, handlePlayerLeft);
        gameIO.off(ServerEvents.ROUND_STARTED, handleRoundStarted);
        gameIO.off(ServerEvents.ROUND_COMPLETED, handleRoundCompleted);
        gameIO.off(ServerEvents.WIN, handleWin);
        gameIO.off(ServerEvents.MOVE_ADDED, handleMoveAdded);
      };
    },
    // eslint-disable-next-line
    []
  );

  function handlePlayerJoined(data: GameData) {
    // console.log("handlePlayerJoined", data);
    if (data) {
      if (!player) {
        const player = data.players.find(
          (item) => item.userId === gameIO.userId
        );

        if (player?.nickname) {
          setCurrentPlayer(player);
        }
      }
      setGameData(data);
    }
  }

  function handlePlayerLeft(data: GameData) {
    // console.log("handlePlayerLeft", data);
    if (data) {
      setGameData(data);
    }
  }

  function handleRoundStarted(data: GameData) {
    // console.log("handleRoundStarted", data);
    if (data) {
      setGameData(data);
    }
  }

  function handleRoundCompleted(data: GameData) {
    // console.log("handleRoundCompleted", data);
    if (data) {
      setGameData(data);
      setTimeout(() => {
        gameIO.emit(ClientEvents.REQUEST_NEXT_ROUND);
      }, roundTransitionTime);
    }
  }

  function handleWin(data: GameData) {
    // console.log("handleWin", data);
    if (data) {
      setGameData(data);
    }
  }

  function handleMoveAdded(data: GameData) {
    if (data) {
      setGameData(data);
    }
  }

  const handlePlayAgain = (e: React.MouseEvent) => {
    e.stopPropagation();

    gameIO.emit(ClientEvents.REQUEST_NEW_GAME);
  };

  const currentPlayerMove = gameData?.currentMoves.find(
    (move) => move.userId === player?.userId
  );

  const otherPlayerMove = gameData?.currentMoves.find(
    (move) => move.userId !== player?.userId
  );

  return (
    <>
      <section className="hero is-link is-bold" data-testid="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title is-capitalized">
              Welcome, {player?.nickname}
            </h1>
          </div>
        </div>
      </section>
      <section className="section" data-testid="controls">
        <div className="container has-text-centered">
          <MoveSelector gameIO={gameIO} gameData={gameData} />
          {currentPlayerMove && (
            <>
              <div>Current choice: {currentPlayerMove.selection}</div>
              {otherPlayerMove ? (
                <div>Opponent choice: {otherPlayerMove.selection}</div>
              ) : (
                <div>waiting for oppenents to choose</div>
              )}
            </>
          )}
          {gameData?.winner && (
            <div className="notification is-info mt-4">
              <p className="is-uppercase my-4">
                {gameData.players[0].nickname} wins!
              </p>
              <button className="button" onClick={(e) => handlePlayAgain(e)}>
                Play Again
              </button>
            </div>
          )}
        </div>
      </section>
      <section className="section" data-testid="scores">
        <div className="container">
          <ScoreBoard gameData={gameData} />
        </div>
      </section>
    </>
  );
};
