import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import TrainTimes from './traintimes';

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

it('renders a heading', () => {
  act(() => {
    render(<TrainTimes />, container);
  });
  const heading = container.getElementsByTagName('h3')[0];
  expect(heading.textContent).toBe('Live Trains');
});

it('renders a message when no props are given', () => {
  act(() => {
    render(<TrainTimes />, container);
  });
  const message = container.getElementsByTagName('p')[0];
  expect(message.textContent).toBe('No station specified.');
});