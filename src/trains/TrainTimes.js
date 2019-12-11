import React from 'react';
import axios from 'axios';
import { setIntervalAsync } from 'set-interval-async/dynamic';
import { clearIntervalAsync } from 'set-interval-async';

import Services from './Services';

class TrainTimes extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      trains: {},
    };
  }

  render() {
    let body
    if (this.props.station) {
      body = <Services
        trains={this.state.trains}
        arrivals={this.props.arrivals}
        numServices={this.props.numServices}
      />;
    } else {
      body = <p>No station specified.</p>;
    }

    return (
      <div className="widget">
        <h3>Live Trains</h3>
        {body}
      </div>
    )
  }

  async refresh() {
    let baseURL
    if (process.env.NODE_ENV === 'production') {
      baseURL = 'https://api.alexbostock.co.uk/trains';
    } else {
      baseURL = 'http://localhost:4000/trains';
    }

    let endPoint = '/' + this.props.station + '/';
    endPoint += this.props.arrivals ? 'arrivals' : 'departures';
    const url = baseURL + endPoint;

    try {
      const res = await axios.get(url);

      this.setState({trains: res.data});
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    if (!this.props.station) {
      return;
    }
    
    const timer = setIntervalAsync(this.refresh.bind(this), 30 * 1000);

    this.setState({
      timer: timer,
      trains: null,
    });

    this.refresh();
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearIntervalAsync(this.state.timer);
    }
  }
}

export default TrainTimes;