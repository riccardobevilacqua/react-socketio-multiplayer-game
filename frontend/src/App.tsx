import React from 'react';
import { Game } from './components/Game/Game';

export const App: React.FunctionComponent<{}> = () => {
  return (
    <Game data-testid="game" />
  );
}

export default App;
