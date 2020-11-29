import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';

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
  },
];

export interface MoveSelectorProps {
  gameIO: GameIO;
  gameData: GameData | null;
}

export const MoveSelector: React.FunctionComponent<MoveSelectorProps> = ({
  gameIO,
  gameData,
}) => {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (gameData?.isRoundInProgress) {
      setDisabled(false);
    }
  }, [gameData?.isRoundInProgress]);

  const handleClick = (selection: string) => {
    if (!disabled) {
      setDisabled(true);
      gameIO.emit(ClientEvents.SET_MOVE, {
        userId: gameIO.userId,
        selection,
      });
    }
  };

  const moves = movesList.map((item) => {
    const { name, image } = item;
    const figureClassName = [
      'image',
      'px-1',
      isMobile ? 'is-64x64' : 'is-128x128',
      disabled ? 'is-disabled' : 'is-clickable',
    ].join(' ');

    return (
      <figure
        className={figureClassName}
        onClick={() => !disabled && handleClick(name)}
        key={name}
      >
        <img src={image} alt={name} />
      </figure>
    );
  });

  return <div className="move-selector">{moves}</div>;
};
