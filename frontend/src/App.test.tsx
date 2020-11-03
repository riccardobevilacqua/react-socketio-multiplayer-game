import React from 'react';
import { render } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  test('renders app', () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId('app')).toBeInTheDocument();
  });
});
