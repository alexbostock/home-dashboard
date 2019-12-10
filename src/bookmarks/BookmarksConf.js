import React from 'react';
import { Map } from 'immutable';

class BookmarksConf extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      newName: '',
      newUrl: '',
    };
  }

  renderItem(item, index) {
    if (item.has('name') && item.has('url')) {
      return (
        <li key={item} className="bookmark">
          <a href={item.get('url')}>
            {item.get('name')}
          </a>

          <button onClick={() => this.removeBookmark(index)}>
            X
          </button>
        </li>
      );
    } else {
      console.error('Bookmark has invalid format');
      console.error(item);
      return null;
    }
  }

  render() {
    const items = this.props.items.map((item, i) => this.renderItem(item, i));
    return (
      <div className="widget">
        <h3>Bookmarks</h3>
        <ul>
          {items}
          <li key="newBookmark">
            <input
              type="text"
              value={this.state.newName}
              onChange={(event) => this.setState({newName: event.target.value})}
            />
            <input
              type="text"
              value={this.state.newUrl}
              onChange={(event) => this.setState({newUrl: event.target.value})}
            />
            <button onClick={() => this.addBookmark()}>Add</button>
          </li>
        </ul>
      </div>
    );
  }

  addBookmark() {
    const newBookmark = Map({
      name: this.state.newName,
      url: this.state.newUrl,
    });

    this.props.updateState(this.props.items.push(newBookmark));

    this.setState({
      newName: '',
      newUrl: '',
    });
  }

  removeBookmark(index) {
    this.props.updateState(this.props.items.delete(index));
  }
}

export default BookmarksConf;