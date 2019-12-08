import React from 'react';

import './App.css';
import TrainTimes from './trains/TrainTimes';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      data: loadSavedState(),
      unsavedChanges: false,
    };
  }

  updateState(newState) {
    this.setState({data: newState}, () => {
      const saved = saveState(this.state.data);
      this.setState({unsavedChanges: !saved});
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.data === this.state.data;
  }

  renderWidget(config) {
    switch (config.type) {
      case 'live-trains':
        return (
          <TrainTimes
            key={config}
            station={config.station}
            arrivals={config.arrivals}
          />
        );
      default:
        console.error(`Invalid widget type: ${config.type}`);
        return null;
    }
  }

  render() {
    const widgets = this.state.data.widgets
      .map(this.renderWidget);

    return (<div className="App">{widgets}</div>);
  }
}

function defaultState() {
  return {
    widgets: [
      {
        type: 'live-trains',
        station: 'STP',
        arrivals: false,
      },
    ],
  };
}

function loadSavedState() {
  const state = localStorage.getItem('config');
  return state ? JSON.parse(state) : defaultState();
}

function saveState(state) {
  try {
    localStorage.setItem('config', JSON.stringify(state));
    return true;
  } catch (err) {
    console.err('Saving to local storage failed.');
    console.error(err);
    return false;
  }
}

export default App;