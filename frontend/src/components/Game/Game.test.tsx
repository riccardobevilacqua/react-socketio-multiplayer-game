import React from 'react';
import { render } from '@testing-library/react';
import { Game } from './Game';

describe('Game', () => {
  test('renders Game', () => {
    const { getByTestId } = render(<Game />);

    expect(getByTestId('hero')).toBeInTheDocument();
    expect(getByTestId('controls')).toBeInTheDocument();
    expect(getByTestId('scores')).toBeInTheDocument();
  });
});
