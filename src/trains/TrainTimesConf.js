import React from 'react';
import axios from 'axios';
import { Map } from 'immutable';

class TrainTimesConf extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      station: this.props.station ? this.props.station : '',
      arrivals: Boolean(props.arrivals),
      stations: {},
    };
  }

  updateStation(event) {
    this.setState({station: event.target.value});
  }

  updateArrivals(event) {
    this.setState({arrivals: Boolean(event.target.value)});
  }

  saveState() {
    let crs;
    if (this.state.station.length === 3) {
      crs = this.state.station;
    } else {
      crs = parsePrintedStation(this.state.station);
    }
    crs = crs.toUpperCase();

    this.props.updateState(Map({
      type: 'live-trains',
      station: crs,
      arrivals: this.state.arrivals,
    }));
  }

  render() {
    const crs = this.state.station;
    const station = printStation(crs, this.state.stations[crs]);

    return (
      <div className="widget">
        <h3>Live Trains</h3>

        <div className="trainConfigForm">
          <label htmlFor="stationInput">Station</label>
          <input
            id="stationInput"
            list="stationOptions"
            value={station}
            onChange={(e) => this.updateStation(e)}
          />
          <datalist id="stationOptions">
            {this.stationOptions()}
          </datalist>

          <label htmlFor="departuresButton">
            Departures
          </label>
          <input
            type="radio"
            name="arrivals"
            id="departuresButton"
            value=""
            checked={!this.state.arrivals}
            onChange={(e) => this.updateArrivals(e)}
          />

          <label htmlFor="arrivalsButton">
            Arrivals
          </label>
          <input
            type="radio"
            name="arrivals"
            id="arrivalsButton"
            value="truthy"
            checked={this.state.arrivals}
            onChange={(e) => this.updateArrivals(e)}
          />

          <button onClick={() => this.saveState()}>Save</button>
        </div>
      </div>
    );
  }

  stationOptions() {
    if (!this.state.stations) {
      return null;
    }

    return Object.keys(this.state.stations).map((crs) => {
      const val = printStation(crs, this.state.stations[crs]);
      return <option value={val} key={crs + this.state.stations[crs]} />;
    });
  }

  componentDidMount() {
    let url;
    if (process.env.NODE_ENV === 'production') {
      url = 'https://api.alexbostock.co.uk/trains/stations';
    } else {
      url = 'http://localhost:4000/trains/stations';
    }

    axios.get(url)
      .then((res) => {
        const stations = {};
        res.data.forEach((s) => stations[s.crs] = s.name);
        this.setState({stations: stations});
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

function printStation(crs, name) {
  return name ? `${name} (${crs})` : crs;
}

function parsePrintedStation(str) {
  return str.slice(str.length - 4, str.length - 1);
}

export default TrainTimesConf;