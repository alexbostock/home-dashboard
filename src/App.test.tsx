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

it('renders one of each widget by default', () => {
  act(() => {
    render(<App />, container);
  });

  const renderedText = container.textContent;

  expect(renderedText.includes('Bookmarks'))
    .toBe(true);
  expect(renderedText.includes('Live Trains'))
    .toBe(true);
  expect(renderedText.includes('Latest XKCD'))
    .toBe(true);
});