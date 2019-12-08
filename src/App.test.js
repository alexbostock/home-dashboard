import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import App from './app';

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders Bookmarks and TrainTimes by default', () => {
  act(() => {
    render(<App />, container);
  });
  expect(container.textContent.includes('Bookmarks'))
    .toBe(true);
  expect(container.textContent.includes('Live Trains'))
    .toBe(true);
});