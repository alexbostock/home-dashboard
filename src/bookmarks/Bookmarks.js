import React from 'react';

function renderBookmark(item) {
  if (item.has('name') && item.has('url')) {
    return (
      <li key={item} className="bookmark">
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

function Bookmarks(props) {
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

export default Bookmarks;