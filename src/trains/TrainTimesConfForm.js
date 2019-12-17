import React from 'react';

import stationsSource from './stationList';

class TrainTimesConfForm extends React.PureComponent {
  state = {
    station: this.props.station || '',
    timer: null,
  };

  valid(crs = this.state.station) {
    crs = parsePrintedStation(crs).toUpperCase();
    return Boolean(stationsSource.stations[crs]);
  }

  updateStation = (event) => {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
    }

    this.setState({station: event.target.value}, () => {
      if (!this.valid()) {
        return;
      }

      const timer = setTimeout(() => {
        const crs = parsePrintedStation(this.state.station);
        this.props.saveStation(this.props.widgetIndex, crs);
      }, 500);

      this.setState({timer: timer})
    });
  }

  updateArrivals = (event) => {
    this.props.saveArrivals(this.props.widgetIndex, Boolean(event.target.value));
  }

  updateNumServices = (event) => {
    this.props.saveNumServices(this.props.widgetIndex, parseInt(event.target.value));
  }

  updateServicesPerPage = (event) => {
    this.props.savePageSize(this.props.widgetIndex, parseInt(event.target.value));
  }

  render() {
    // Get widget index to avoid rendering duplicate IDs.
    const widgetIndex = this.props.widgetIndex;

    let station = this.state.station;
    if (this.state.station === this.props.station) {
      station = this.printStation(this.state.station);
    }

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
            checked={!this.props.arrivals}
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
            checked={this.props.arrivals}
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
            value={this.props.numServices}
            onChange={this.updateNumServices}
          />

          <label htmlFor={'servicesPerPageInput' + widgetIndex}>
            Services per page
          </label>
          <input
            type="number"
            id={'servicesPerPageInput' + widgetIndex}
            step="1"
            min="1"
            max="99"
            value={this.props.servicesPerPage}
            onChange={this.updateServicesPerPage}
          />
        </form>
      </div>
    );
  }

  stationOptions() {
    if (!stationsSource.stations) {
      return null;
    }

    return Object.keys(stationsSource.stations).map((crs) => {
      const val = this.printStation(crs, stationsSource.stations[crs]);
      return <option value={val} key={crs + stationsSource.stations[crs]} />;
    });
  }

  printStation(station, name) {
    if (station.length !== 3 || !this.valid(station)) {
      return station;
    }
  
    const crs = station.toUpperCase();
    name = name || stationsSource.stations[crs];
  
    return name ? `${name} (${crs})` : station;
  }
}

function parsePrintedStation(str) {
  if (!str) {
    return '';
  }
  
  if (str[str.length - 1] === ')' && str[str.length - 5] === '(') {
    return str.slice(str.length - 4, str.length - 1).toUpperCase();
  }

  return str;
}

export default TrainTimesConfForm;