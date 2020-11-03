import React from 'react';
import { Game } from './components/Game/Game';

export const App: React.FunctionComponent<{}> = () => {
  return (
    <section className="section" data-testid="app">
      <div className="container">
        <Game />
      </div>
    </section>
  );
}

export default App;
