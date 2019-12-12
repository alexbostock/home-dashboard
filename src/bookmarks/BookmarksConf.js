import React from 'react';
import { Map } from 'immutable';

class BookmarksConf extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      newName: '',
      newUrl: 'https://',
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
            Delete
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

    const submitFunc = (event) => {
      event.preventDefault();
      this.addBookmark();
    }

    return (
      <div>
        <h3>Bookmarks</h3>
        <ul>
          {items}
          <li key="newBookmark">
            <form className="newBookmark" onSubmit={submitFunc}>
              <div>
                <input
                  type="text"
                  className="bookmarkNameInput"
                  value={this.state.newName}
                  onChange={(event) => this.setState({newName: event.target.value})}
                  placeholder="Name"
                />
                <input
                  type="text"
                  className="bookmarkURLInput"
                  value={this.state.newUrl}
                  onChange={(event) => this.setState({newUrl: event.target.value})}
                  placeholder="URL"
                />
              </div>
              <button className="addBookmarkButton">Add</button>
            </form>
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
      newUrl: 'https://',
    });
  }

  removeBookmark(index) {
    this.props.updateState(this.props.items.delete(index));
  }
}

export default BookmarksConf;