import React from 'react';
import { List, Map } from 'immutable';

class BookmarksConf extends React.PureComponent<BookmarksConfProps, {}> {
  state = {
    newName: '',
    newUrl: 'https://',
  };

  renderItem(item: Map<string, string>, index: number) {
    if (item.has('name') && item.has('url')) {
      return (
        <li
          key={item.toString()}
          className="bookmark"
          draggable="true"
          onDragStart={e => this.onDragStart(e, index)}
          onDragOver={e => e.preventDefault()}
          onDrop={e => this.onDrop(e, index)}
        >
          <a href={item.get('url')} className="disabled">
            {item.get('name')}
          </a>

          <button type="button" onClick={() => this.removeBookmark(index)}>
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
              <button type="submit" className="addBookmarkButton">Add</button>
            </form>
          </li>
        </ul>
      </div>
    );
  }

  addBookmark = (event: React.SyntheticEvent) => {
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

  removeBookmark(index: number) {
    this.props.updateState(this.props.items.delete(index));
  }

  swapBookmarks(index1: number, index2: number) {
    const bookmark1 = this.props.items.get(index1)!;
    const bookmark2 = this.props.items.get(index2)!;

    const bookmarks = this.props.items
      .set(index2, bookmark1)
      .set(index1, bookmark2);
    
    this.props.updateState(bookmarks);
  }

  onDragStart(event: React.DragEvent, index: number) {
    event.dataTransfer.setData('draggedIndex', index.toString());
    event.dataTransfer.setData('bookmark', true.toString());
  }

  onDrop(event: React.DragEvent, index: number) {
    event.preventDefault();

    const draggedIndex = event.dataTransfer.getData('draggedIndex');

    this.swapBookmarks(parseInt(draggedIndex), index);
  }
}

interface BookmarksConfProps {
  items: List<Map<string, string>>;
  updateState(update: List<Map<string, string>>): void;
}

export default BookmarksConf;