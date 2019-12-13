import React from 'react';

import { List, Map } from 'immutable';
import { serialize, deserialize } from 'json-immutable';

import './App.css';
import Bookmarks from './bookmarks/Bookmarks';
import BookmarksConf from './bookmarks/BookmarksConf';
import Clock from './clock/Clock';
import TrainTimes from './trains/TrainTimes';
import TrainTimesConf from './trains/TrainTimesConf';
import Xkcd from './xkcd/Xkcd';
import NewWidget from './NewWidget';

const widgetsAvailable = {
  'bookmarks': {
    name: 'Bookmarks',
    config: Map({
      items: List([
        Map({name: 'Google', 'url': 'https://google.com'}),
      ]),
    }),
  },
  'clock': {
    name: 'Clock',
    config: Map(),
  },
  'live-trains': {
    name: 'Live train times',
    config: Map({
      station: 'STP',
      arrivals: false,
      numServices: 3,
    }),
  },
  'xkcd': {
    name: 'Latest xkcd comic',
    config: Map(),
  },
};

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      data: loadSavedState(),
      unsavedChanges: false,
      configMode: false,
    };
  }

  toggleConfigMode() {
    this.setState({configMode: !this.state.configMode});
  }

  updateState(newState) {
    this.setState({data: newState}, () => {
      const saved = saveState(this.state.data);
      this.setState({unsavedChanges: !saved});
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(nextState.data.equals(this.state.data))
      || nextState.configMode !== this.state.configMode;
  }

  renderWidgetComponent(config, index) {
    switch (config.get('type')) {
      case 'bookmarks':
        if (this.state.configMode) {
          return (
            <BookmarksConf
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
              items={config.get('items')}
            />
          );
        }
      case 'clock':
        return <Clock />;
      case 'live-trains':
        if (this.state.configMode) {
          return (
            <TrainTimesConf
              station={config.get('station')}
              arrivals={config.get('arrivals')}
              numServices={config.get('numServices')}
              updateState={(update) => {
                const newState = this.state.data
                  .setIn(['widgets', index], update);
                this.updateState(newState);
              }}
              widgetIndex={index}
            />
          );
        } else {
          return (
            <TrainTimes
              station={config.get('station')}
              arrivals={config.get('arrivals')}
              numServices={config.get('numServices')}
            />
          );
        }
      case 'xkcd':
        return <Xkcd />;
      default:
        console.error(`Invalid widget type: ${config.get('type')}`);
        return null;
    }
  }

  renderWidget(config, index) {
    const widget = this.renderWidgetComponent(config, index);

    if (this.state.configMode) {
      return (
        <div
          className="widget"
          key={config + index}
          draggable="true"
          onDragStart={e => this.onDragStart(e, index)}
          onDragOver={e => e.preventDefault()}
          onDrop={e => this.onDrop(e, index)}
        >
          <div className="widgetMenuBar">
            Drag widget to reposition
            <button onClick={() => this.deleteWidget(index)}>Delete</button>
          </div>
          {widget}
        </div>
      )
    } else {
      return <div className="widget" key={config + index}>{widget}</div>;
    }
  }

  render() {
    const newWidgetForm = (
      <NewWidget
        key="newWidgetWidget"
        render={this.state.configMode}
        widgets={widgetsAvailable}
        add={this.addWidget.bind(this)}
      />
    );

    const widgets = this.state.data.get('widgets')
      .map((config, i) => this.renderWidget(config, i))
      .concat([newWidgetForm]);

    return (
      <div className="app">
        {widgets}
        <footer className="widget">
          <p>View on <a href="https://github.com/alexbostock/home-dashboard">GitHub</a>.</p>
          <p>Train data from <a href="https://www.realtimetrains.co.uk/">Realtime Trains</a>.</p>
          <div>
            <button onClick={() => this.toggleConfigMode()}>
              {this.state.configMode ? 'Go back' : 'Settings'}
            </button>
          </div>
        </footer>
      </div>
    );
  }

  onDragStart(event, index) {
    if (event.dataTransfer.getData('bookmark')) {
      return;
    }

    event.dataTransfer.setData('draggedIndex', index);
  }

  onDrop(event, index) {
    event.preventDefault();

    if (event.dataTransfer.getData('bookmark')) {
      return;
    }

    const draggedIndex = event.dataTransfer.getData('draggedIndex');

    const widget1 = this.state.data.getIn(['widgets', draggedIndex]);
    const widget2 = this.state.data.getIn(['widgets', index]);

    const widgets = this.state.data.get('widgets')
      .set(index, widget1)
      .set(draggedIndex, widget2);

    const data = this.state.data.set('widgets', widgets);

    this.updateState(data);
  }

  addWidget(type) {
    const widgets = this.state.data.get('widgets')
      .concat([defaultWidgetState(type)]);
    
    const data = this.state.data.set('widgets', widgets);
    
    this.updateState(data);
  }

  deleteWidget(index) {
    const data = this.state.data.deleteIn(['widgets', index]);

    this.updateState(data);
  }
}

function defaultWidgetState(key) {
  return widgetsAvailable[key].config.set('type', key);
}

function defaultState() {
  return Map({
    widgets: List(Object.keys(widgetsAvailable)).map(defaultWidgetState),
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