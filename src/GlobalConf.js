import { connect } from 'react-redux';
import GlobalConfForm from './GlobalConfForm';

import * as actions from './actions';

const mapStateToProps = state => ({
  currentTheme: state.getIn(['data', 'theme']),
  canUndo: state.get('dataHistory').count() > 0,
  canRedo: state.get('dataFuture').count() > 0,
});

const mapDispatchToProps = dispatch => ({
  setTheme: theme => dispatch(actions.setTheme(theme)),
  addWidget: type => dispatch(actions.addWidget(type)),
  undo: () => dispatch(actions.undo()),
  redo: () => dispatch(actions.redo()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalConfForm);