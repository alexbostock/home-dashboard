import { connect } from 'react-redux'
import TrainTimesConfForm from './TrainTimesConfForm';

import * as actions from '../actions';

const mapStateToProps = _ => ({});

const mapDispatchToProps = dispatch => ({
  saveStation: (i, crs) => dispatch(actions.setStation(i, crs)),
  saveArrivals: (i, arrivals) => dispatch(actions.setArrivals(i, arrivals)),
  saveNumServices: (i, num) => dispatch(actions.setNumServices(i, num)),
  savePageSize: (i, num) => dispatch(actions.setServicesPerPage(i, num)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrainTimesConfForm);