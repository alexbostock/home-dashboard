import { connect } from 'react-redux'
import Main from './Main'

import * as actions from './actions';

const mapStateToProps = state => ({
  configMode: state.get('configMode'),
  theme: state.getIn(['data', 'theme']),
  canUndo: state.get('dataHistory').count() > 0,
  canRedo: state.get('dataFuture').count() > 0,
  widgets: state.getIn(['data', 'widgets']),
  // TEMPORARY:
  data: state.get('data'),
});

const mapDispatchToProps = dispatch => ({
  toggleConfigMode: () => dispatch(actions.toggleConfigMode()),
  addWidget: type => dispatch(actions.addWidget(type)),
  removeWidget: index => dispatch(actions.removeWidget(index)),
  swapWidgets: (i1, i2) => dispatch(actions.swapWidgets(i1, i2)),
  setTheme: theme => dispatch(actions.setTheme(theme)),
  undo: () => dispatch(actions.undo()),
  redo: () => dispatch(actions.redo()),
  // TEMP
  updateState: state => dispatch(actions.updateState(state)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)
