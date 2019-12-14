import React from 'react';
import { Map } from 'immutable';

class BookmarksConf extends React.PureComponent {
  state = {
    newName: '',
    newUrl: 'https://',
  };

  renderItem(item, index) {
    if (item.has('name') && item.has('url')) {
      return (
        <li
          key={item}
          className="bookmark"
          draggable="true"
          onDragStart={e => this.onDragStart(e, index)}
          onDragOver={e => e.preventDefault()}
          onDrop={e => this.onDrop(e, index)}
        >
          <a href={item.get('url')} className="disabled">
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

    return (
      <div>
        <h3>Bookmarks (Drag to reorder)</h3>
        <ul>
          {items}
          <li key="newBookmark">
            <form className="newBookmark" onSubmit={this.addBookmark}>
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

  addBookmark = (event) => {
    event.preventDefault();

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

  swapBookmarks(index1, index2) {
    const bookmark1 = this.props.items.get(index1);
    const bookmark2 = this.props.items.get(index2);

    const bookmarks = this.props.items
      .set(index2, bookmark1)
      .set(index1, bookmark2);
    
    this.props.updateState(bookmarks);
  }

  onDragStart(event, index) {
    event.dataTransfer.setData('draggedIndex', index);
    event.dataTransfer.setData('bookmark', true);
  }

  onDrop(event, index) {
    event.preventDefault();

    const draggedIndex = event.dataTransfer.getData('draggedIndex');

    this.swapBookmarks(draggedIndex, index);
  }
}

export default BookmarksConf;