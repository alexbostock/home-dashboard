import React from 'react';

import { List, Map } from 'immutable';
import { serialize, deserialize } from 'json-immutable';

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
    return !(nextState.data.equals(this.state.data));
  }

  renderWidget(config) {
    switch (config.get('type')) {
      case 'live-trains':
        return (
          <TrainTimes
            key={config}
            station={config.get('station')}
            arrivals={config.get('arrivals')}
          />
        );
      default:
        console.error(`Invalid widget type: ${config.get('type')}`);
        return null;
    }
  }

  render() {
    const widgets = this.state.data.get('widgets')
      .map(this.renderWidget);

    return (<div className="App">{widgets}</div>);
  }
}

function defaultState() {
  return Map({
    widgets: List([
      Map({
        type: 'live-trains',
        station: 'STP',
        arrivals: false,
      }),
    ]),
  });
}

function loadSavedState() {
  const state = localStorage.getItem('config');

  return state ? deserialize(state) : defaultState();
}

function saveState(state) {
  try {
    localStorage.setItem('config', serialize(state));
    return true;
  } catch (err) {
    console.err('Saving to local storage failed.');
    console.error(err);
    return false;
  }
}

export default App;