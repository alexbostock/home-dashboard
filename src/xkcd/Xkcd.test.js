import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import Xkcd from './xkcd';
import { isTSAnyKeyword, exportAllDeclaration } from '@babel/types';

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
    render(<Xkcd />, container);
  });
  const heading = container.getElementsByTagName('h3')[0];
  expect(heading.textContent).toBe('Latest XKCD');
});