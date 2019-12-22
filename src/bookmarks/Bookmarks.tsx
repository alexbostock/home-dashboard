import React from 'react';

import { List, Map } from 'immutable';

function renderBookmark(item: Map<string, string>) {
  if (item.has('name') && item.has('url')) {
    return (
      <li key={item.toString()} className="bookmark">
        <a href={item.get('url')}>
          {item.get('name')}
        </a>
      </li>
    );
  } else {
    console.error('Bookmark has invalid format');
    console.error(item);
    return null;
  }
}

function Bookmarks(props: BookmarksProps) {
  let body;
  if (props.items) {
    const items = props.items.map(renderBookmark);
    body = <ul>{items}</ul>;
  } else {
    body = <p>No bookmarks saved</p>;
  }

  return (
    <div>
      <h3>Bookmarks</h3>
      {body}
    </div>
  );
}

interface BookmarksProps {
  items: List<Map<string, string>>;
}

export default Bookmarks;