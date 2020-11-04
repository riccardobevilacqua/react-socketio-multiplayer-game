import React from 'react';

import { Player } from '../../common/Constants';
import { Avatar } from '../Avatar/Avatar';

export interface ScoreCardProps {
  player: Player;
}

export const ScoreCard: React.FunctionComponent<ScoreCardProps> = ({
  player
}) => {
  return (
    <div className="box">
      <article className="media">
        <div className="media-left">
          <Avatar text={player.userId} />
        </div>
        <div className="media-content">
          <div className="content">
            {player.nickname}
          </div>
        </div>
        <div className="media-right">
          {player.score > 0 ? player.score : '-'}
        </div>
      </article>
    </div>
  );
}
