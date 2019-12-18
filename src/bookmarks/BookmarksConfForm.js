import React from 'react';

class BookmarksConfForm extends React.PureComponent {
  state = {
    newName: '',
    newUrl: 'https://',
  };

  renderItem(item, index) {
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

          <button
            type="button"
            onClick={() => this.props.removeBookmark(this.props.widgetIndex, index)}
          >
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

  addBookmark = (event) => {
    event.preventDefault();

    this.props.addBookmark(this.props.widgetIndex, this.state.newName, this.state.newUrl);

    this.setState({
      newName: '',
      newUrl: 'https://',
    });
  }

  onDragStart(event, index) {
    event.stopPropagation();

    event.dataTransfer.setData('draggedBookmark', index.toString());
  }

  onDrop(event, index) {
    const draggedIndex = event.dataTransfer.getData('draggedBookmark');

    if (draggedIndex) {
      event.stopPropagation();
      
      this.props.swapBookmarks(this.props.widgetIndex, parseInt(draggedIndex), index);
    }
  }
}

export default BookmarksConfForm;