import React from 'react';

import { Player } from '../../common/Constants';
import { Avatar } from '../Avatar/Avatar';

export interface ScoreCardProps {
  player: Player;
  rank: number;
}

export const ScoreCard: React.FunctionComponent<ScoreCardProps> = ({
  player,
  rank,
}) => {
  return (
    <div className="box">
      <div className="level is-mobile">
        <div className="level-item">
          <div>
            <Avatar text={player.userId} size="48" />
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Player</p>
            <p className="is-capitalized">{player.nickname}</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Score</p>
            <p>{player.score}</p>
          </div>
        </div>
        <div className="level-item has-text-centered is-hidden-mobile">
          <div>
            <p className="heading">Rank</p>
            <p>{rank}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
