import React from 'react';
import axios from 'axios';
import { Map } from 'immutable';

class TrainTimesConf extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      station: this.props.station ? printStation(this.props.station) : '',
      arrivals: Boolean(props.arrivals),
      numServices: this.props.numServices ? this.props.numServices : 3,
      stations: {},
    };
  }

  valid(crs = this.state.station) {
    crs = parsePrintedStation(crs);
    return Boolean(this.state.stations[crs]);
  }

  unsavedChanges() {
    return parsePrintedStation(this.state.station) !== this.props.station
      || this.state.arrivals !== this.props.arrivals
      || this.state.numServices !== this.props.numServices;
  }

  updateStation(event) {
    this.setState({station: event.target.value});
  }

  updateArrivals(event) {
    this.setState({arrivals: Boolean(event.target.value)}, () => this.saveState());
  }

  updateNumServices(event) {
    this.setState({numServices: event.target.value}, () => this.saveState());
  }

  saveState() {
    const crs = parsePrintedStation(this.state.station);
    // If the station input is invalid, don't save it,
    // but don't let that block saving other properties.
    const station = this.valid(crs) ? crs : this.props.station;

    if (!this.unsavedChanges()) {
      return;
    }

    this.props.updateState(Map({
      type: 'live-trains',
      station: station,
      arrivals: this.state.arrivals,
      numServices: this.state.numServices,
    }));
  }

  render() {
    const crs = this.state.station;
    const station = printStation(crs, this.state.stations[crs]);

    // Get widget index to avoid rendering duplicate IDs.
    const widgetIndex = this.props.widgetIndex;

    return (
      <div className="widget">
        <h3>Live Trains</h3>

        <div className="trainConfigForm">
          <input
            className={this.valid() ? 'stationInput' : 'stationInput invalidInput'}
            list={'stationOptions' + widgetIndex}
            value={station}
            onChange={(e) => this.updateStation(e)}
            placeholder="Station name (CRS)"
          />
          <datalist id={'stationOptions' + widgetIndex}>
            {this.stationOptions()}
          </datalist>

          <label htmlFor={'departuresButton' + widgetIndex}>
            Departures
          </label>
          <input
            type="radio"
            name="arrivals"
            id={'departuresButton' + widgetIndex}
            value=""
            checked={!this.state.arrivals}
            onChange={(e) => this.updateArrivals(e)}
          />

          <label htmlFor={'arrivalsButton' + widgetIndex}>
            Arrivals
          </label>
          <input
            type="radio"
            name="arrivals"
            id={'arrivalsButton' + widgetIndex}
            value="truthy"
            checked={this.state.arrivals}
            onChange={(e) => this.updateArrivals(e)}
          />

          <label htmlFor={'numServicesInput' + widgetIndex}>
            Number of services displayed
          </label>
          <input
            type="number"
            id={'numServicesInput' + widgetIndex}
            step="1"
            min="1"
            max="99"
            value={this.state.numServices}
            onChange={(e) => this.updateNumServices(e)}
          />
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
      }, 1000);
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