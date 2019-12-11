import React from 'react';
import axios from 'axios';
import { Map } from 'immutable';

class TrainTimesConf extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      station: this.props.station ? printStation(this.props.station) : '',
      arrivals: Boolean(props.arrivals),
      stations: {},
    };
  }

  valid(crs = this.state.station) {
    crs = parsePrintedStation(crs);
    return Boolean(this.state.stations[crs]);
  }

  unsavedChanges() {
    return parsePrintedStation(this.state.station) !== this.props.station
      || this.state.arrivals !== this.props.arrivals;
  }

  updateStation(event) {
    this.setState({station: event.target.value});
  }

  updateArrivals(event) {
    this.setState({arrivals: Boolean(event.target.value)}, () => this.saveState());
  }

  saveState() {
    const crs = parsePrintedStation(this.state.station);

    if (!this.unsavedChanges() || !this.valid(crs)) {
      return;
    }

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
          <input
            id="stationInput"
            list="stationOptions"
            value={station}
            onChange={(e) => this.updateStation(e)}
            placeholder="Station name (CRS)"
          />
          <datalist id="stationOptions">
            {this.stationOptions()}
          </datalist>

          <p>
            {this.valid() ? 'Valid station' : 'Invalid station'}
          </p>

          <div className="radioButtons">
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
          </div>

          <p>
            {this.unsavedChanges() && this.valid() ? 'Unsaved changes' : 'All changes saved'}
          </p>
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
    
    const timer = setInterval(() => {
      // Save only if the value is stable for a short time
      const station = this.state.station;

      setTimeout(() => {
        if (station === this.state.station) {
          this.saveState();
        }
      }, 500);
    }, 500);

    this.setState({timer: timer});
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }
  }
}

function printStation(crs, name) {
  return name ? `${name} (${crs})` : crs;
}

function parsePrintedStation(str) {
  if (!str) {
    return null;
  }

  if (str.length === 3) {
    return str.toUpperCase();
  }
  
  if (str[str.length - 1] === ')' && str[str.length - 5] === '(') {
    return str.slice(str.length - 4, str.length - 1).toUpperCase();
  }

  return null;
}

export default TrainTimesConf;