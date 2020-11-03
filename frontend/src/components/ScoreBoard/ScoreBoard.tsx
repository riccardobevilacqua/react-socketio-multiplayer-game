import React, { useState, useEffect } from 'react';

import { GameData, Player } from '../../common/Constants';
import { ScoreCard } from '../ScoreCard/ScoreCard';

export interface ScoreBoardProps {
  gameData: GameData | null;
}

export const sortByScore = (a: Player, b: Player) => b.score - a.score;

export const ScoreBoard: React.FunctionComponent<ScoreBoardProps> = ({
  gameData
}) => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (gameData?.players) {
      setPlayers(gameData.players.sort(sortByScore));
    }
  },
    [gameData?.players]
  );

  return (
    <div className="score-board">
      {players.map((item: Player) => (
        <ScoreCard player={item} key={item.userId} />
      ))}
    </div>
  );
};