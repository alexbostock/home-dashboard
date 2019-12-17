import { connect } from 'react-redux'
import BookmarksConfForm from './BookmarksConfForm';

import * as actions from '../actions';

const mapStateToProps = _ => ({});

const mapDispatchToProps = dispatch => ({
  addBookmark: (widget, name, url) => dispatch(actions.addBookmark(widget, name, url)),
  removeBookmark: (widget, index) => dispatch(actions.removeBookmark(widget, index)),
  swapBookmarks: (widget, i1, i2) => dispatch(actions.swapBookmarks(widget, i1, i2)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarksConfForm);