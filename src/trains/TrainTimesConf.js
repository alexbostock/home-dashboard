import React from 'react';
import axios from 'axios';
import { Map } from 'immutable';

class TrainTimesConf extends React.PureComponent {
  state = {
    station: this.props.station ? printStation(this.props.station) : '',
    arrivals: Boolean(this.props.arrivals),
    numServices: this.props.numServices ? this.props.numServices : 3,
    stations: {},
    axiosCancelToken: axios.CancelToken.source(),
  };

  valid(crs = this.state.station) {
    crs = parsePrintedStation(crs);
    return Boolean(this.state.stations[crs]);
  }

  unsavedChanges() {
    const station = parsePrintedStation(this.state.station);
    const propStation = parsePrintedStation(this.props.station);

    return (station !== propStation && this.valid())
      || this.state.arrivals !== this.props.arrivals
      || this.state.numServices !== this.props.numServices;
  }

  updateStation = (event) => {
    let value = event.target.value;
    if (this.valid(value)) {
      value = printStation(value, this.state.stations[value]);
    }

    this.setState({station: value}, () => {
      // Save only if the value is stable for a short time
      const station = this.state.station;

      setTimeout(() => {
        if (station === this.state.station) {
          this.saveState();
        }
      }, 500);
    });
  }

  updateArrivals = (event) => {
    this.setState({arrivals: Boolean(event.target.value)}, this.saveState);
  }

  updateNumServices = (event) => {
    this.setState({numServices: event.target.value}, this.saveState);
  }

  saveState() {
    if (!this.unsavedChanges()) {
      return;
    }

    // If the station input is invalid, don't save it,
    // but don't let that block saving other properties.
    const crs = parsePrintedStation(this.valid() ? this.state.station : this.props.station);

    this.props.updateState(Map({
      type: 'live-trains',
      station: crs,
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
      <div>
        <h3>Live Trains</h3>

        <form className="trainConfigForm">
          <input
            className={this.valid() ? 'stationInput' : 'stationInput invalidInput'}
            list={'stationOptions' + widgetIndex}
            value={station}
            onChange={this.updateStation}
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
            onChange={this.updateArrivals}
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
            onChange={this.updateArrivals}
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
            onChange={this.updateNumServices}
          />
        </form>
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

    axios.get(url, { cancelToken: this.state.axiosCancelToken.token })
      .then((res) => {
        const stations = {};
        res.data.forEach((s) => stations[s.crs] = s.name);
        this.setState({stations: stations});
      })
      .catch(err => {
        if (err.message !== 'Cancelled on unmount') {
          console.error(err);
        }
      });
  }

  componentWillUnmount() {
    this.state.axiosCancelToken.cancel();
  }
}

function printStation(crs, name) {
  return name ? `${name} (${crs.toUpperCase()})` : crs;
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