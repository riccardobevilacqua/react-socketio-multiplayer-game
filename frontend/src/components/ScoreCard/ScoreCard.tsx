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
      <article className="media">
        <div className="media-left">
          <Avatar text={player.userId} />
        </div>
        <div className="media-content">
          <div className="content">
            <span className="is-size-5 is-capitalized">{player.nickname}</span>
          </div>
        </div>
        <div className="media-right">
          <span className="is-size-5">{player.score > 0 ? player.score : '-'}</span>
        </div>
      </article>
    </div>
  );
}
