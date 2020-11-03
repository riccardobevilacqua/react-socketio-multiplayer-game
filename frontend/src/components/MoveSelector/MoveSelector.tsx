import React, { useState, useEffect } from 'react';

import { ClientEvents, GameData, GameIO } from '../../common/Constants';

import rockSVG from './img/rock.svg';
import paperSVG from './img/paper.svg';
import scissorsSVG from './img/scissors.svg';
import lizardSVG from './img/lizard.svg';
import spockSVG from './img/spock.svg';
import './MoveSelector.scss';

export interface MoveOption {
  name: string;
  image: string;
}

const movesList: MoveOption[] = [
  {
    name: 'rock',
    image: rockSVG,
  },
  {
    name: 'paper',
    image: paperSVG,
  },
  {
    name: 'scissors',
    image: scissorsSVG,
  },
  {
    name: 'lizard',
    image: lizardSVG,
  },
  {
    name: 'spock',
    image: spockSVG,
  }
];

export interface MoveSelectorProps {
  gameIO: GameIO;
  gameData: GameData | null;
}

export const MoveSelector: React.FunctionComponent<MoveSelectorProps> = ({
  gameIO,
  gameData,
}) => {
  const [selection, setSelection] = useState('');
  // eslint-disable-next-line
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (selection.length > 0) {
      setDisabled(true);
      gameIO.emit(ClientEvents.SET_MOVE, {
        userId: gameIO.userId,
        selection,
      });
    }
  },
    // eslint-disable-next-line
    [selection]
  );

  useEffect(() => {
    if (gameData?.isRoundInProgress) {
      setDisabled(!gameData.isRoundInProgress);
    }
  },
    [gameData?.isRoundInProgress]
  )

  const handleClick = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    if (!disabled) {
      console.log(`Selected: ${item}`);
      setSelection(item);
    }
  };

  const moves = movesList.map(item => {
    const { name, image } = item;

    return (
      <figure
        className={['image', 'is-64x64', disabled ? 'is-disabled' : 'is-clickable'].join(' ')}
        onClick={e => handleClick(e, name)}
        key={name}
      >
        <img src={image} alt={name} />
      </figure>
    );
  });

  return (
    <div className="move-selector">
      {moves}
    </div>
  );
};
