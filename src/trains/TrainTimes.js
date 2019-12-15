import React from 'react';
import axios from 'axios';

import Services from './Services';

class TrainTimes extends React.PureComponent {
  state = {
    trains: {},
    axiosCancelToken: axios.CancelToken.source(),
  };

  render() {
    let body
    if (this.props.station) {
      body = <Services
        trains={this.state.trains}
        arrivals={this.props.arrivals}
        numServices={this.props.numServices}
        servicesPerPage={this.props.servicesPerPage}
      />;
    } else {
      body = <p>No station specified.</p>;
    }

    return (
      <div>
        <h3>Live Trains</h3>
        {body}
      </div>
    )
  }

  refresh = () => {
    let baseURL
    if (process.env.NODE_ENV === 'production') {
      baseURL = 'https://api.alexbostock.co.uk/trains';
    } else {
      baseURL = 'http://localhost:4000/trains';
    }

    let endPoint = '/' + this.props.station + '/';
    endPoint += this.props.arrivals ? 'arrivals' : 'departures';
    const url = baseURL + endPoint;

    axios.get(url, { cancelToken: this.state.axiosCancelToken.token })
      .then(res => this.setState({trains: res.data}))
      .catch(err => {
        if (err.message !== 'Cancelled on unmount') {
          console.error(err);
        }
      });
  }

  componentDidMount() {
    if (!this.props.station) {
      return;
    }
    
    const timer = setInterval(this.refresh, 30 * 1000);

    this.setState({
      timer: timer,
      trains: null,
    });

    this.refresh();
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }

    this.state.axiosCancelToken.cancel('Cancelled on unmount');
  }
}

export default TrainTimes;