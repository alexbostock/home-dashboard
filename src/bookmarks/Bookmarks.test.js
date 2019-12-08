import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { List, Map } from 'immutable';

import Bookmarks from './bookmarks';
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
    render(<Bookmarks />, container);
  });
  const heading = container.getElementsByTagName('h3')[0];
  expect(heading.textContent).toBe('Bookmarks');
});

it('renders a message when no bookmarks are given', () => {
  act(() => {
    render(<Bookmarks />, container);
  });
  expect(container.textContent.includes('No bookmarks saved'))
    .toBe(true);
});

it('renders a list of bookmarks from props', () => {
  const bookmarks = List([
    Map({name: 'Google', url: 'https://google.com'}),
    Map({name: 'Github', url: 'https://github.com'}),
    Map({name: 'Twitter', url: 'https://twitter.com'}),
  ]);

  act(() => {
    render(<Bookmarks items={bookmarks} />, container);
  });
  const renderedItems = container.getElementsByTagName('a');
  bookmarks.forEach((bookmark, index) => {
    const rendered = renderedItems[index];
    expect(rendered.textContent)
      .toBe(bookmark.get('name'));
    expect(rendered.getAttribute('href'))
      .toBe(bookmark.get('url'));
  });
});