import React from 'react';

class Bookmarks extends React.PureComponent {
  renderItem(item) {
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

  render() {
    let body;
    if (this.props.items) {
      const items = this.props.items.map(this.renderItem);
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
}

export default Bookmarks;