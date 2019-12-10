import React from 'react';

import { List, Map } from 'immutable';
import { serialize, deserialize } from 'json-immutable';

import './App.css';
import TrainTimes from './trains/TrainTimes';
import TrainTimesConf from './trains/TrainTimesConf';
import Bookmarks from './bookmarks/Bookmarks';
import BookmarksConf from './bookmarks/BookmarksConf';
import Xkcd from './xkcd/Xkcd';

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

  renderWidget(config, index) {
    switch (config.get('type')) {
      case 'bookmarks':
        if (this.state.configMode) {
          return (
            <BookmarksConf
              key={'bookmarks-config' + config.get('items').join}
              items={config.get('items')}
              updateState={(update) => {
                const newState = this.state.data
                  .setIn(['widgets', index, 'items'], update);
                this.updateState(newState);
              }}
            />
          );
        } else {
          return (
            <Bookmarks
              key={'bookmarks' + config.get('items').join}
              items={config.get('items')}
            />
          );
        }
      case 'live-trains':
        if (this.state.configMode) {
          return (
            <TrainTimesConf
              key={`trains-config ${config.get('station')} ${config.get('arrivals')}`}
              station={config.get('station')}
              arrivals={config.get('arrivals')}
              updateState={(update) => {
                const newState = this.state.data
                  .setIn(['widgets', index], update);
                this.updateState(newState);
              }}
            />
          );
        } else {
          return (
            <TrainTimes
              key={`trains ${config.get('station')} ${config.get('arrivals')}`}
              station={config.get('station')}
              arrivals={config.get('arrivals')}
            />
          );
        }
      case 'xkcd':
        // xkcd widget has no config
        return <Xkcd key={config} />;
      default:
        console.error(`Invalid widget type: ${config.get('type')}`);
        return null;
    }
  }

  render() {
    const widgets = this.state.data.get('widgets')
      .map((config, i) => this.renderWidget(config, i));

    return (<div className="app">{widgets}</div>);
  }
}

function defaultState() {
  return Map({
    widgets: List([
      Map({
        type: 'bookmarks',
        items: List([
          Map({name: 'Google', url: 'https://google.com'}),
        ]),
      }),
      Map({
        type: 'live-trains',
        station: 'STP',
        arrivals: false,
      }),
      Map({
        type: 'xkcd',
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