import React from 'react';

import { List } from 'immutable';

import './App.css';

import Widget from './Widget';
import GlobalConf from './GlobalConf';
import Theme from './Theme';
import Snowfall from './snow/Snowfall';

import stateManagement from './stateManagement';

class App extends React.Component {
  state = {
    data: stateManagement.loadSavedState(),
    dataHistory: List(),
    dataFuture: List(),

    configMode: false,
  };

  toggleConfigMode = () => {
    this.setState({configMode: !this.state.configMode});
  }

  updateState(newState) {
    this.setState({
      data: newState,
      dataHistory: this.state.dataHistory.push(this.state.data),
      dataFuture: List(),
    }, () => stateManagement.saveState(this.state.data));
  }

  addWidget = (type) => {
    const widgets = this.state.data.get('widgets')
      .concat([stateManagement.defaultWidgetState(type)]);
    
    const data = this.state.data.set('widgets', widgets);
    
    this.updateState(data);
  }

  deleteWidget = (index) => {
    const data = this.state.data.deleteIn(['widgets', index]);

    this.updateState(data);
  }

  swapWidgets = (index1, index2) => {
    const widget1 = this.state.data.getIn(['widgets', index1]);
    const widget2 = this.state.data.getIn(['widgets', index2]);

    const widgets = this.state.data.get('widgets')
      .set(index2, widget1)
      .set(index1, widget2);

    const data = this.state.data.set('widgets', widgets);

    this.updateState(data);
  }

  setTheme = (key) => {
    const data = this.state.data.set('theme', key);

    this.updateState(data);
  }

  updateWidgetConfig = (index, update) => {
    const newState = this.state.data
      .setIn(['widgets', index], update);
    this.updateState(newState);
  }

  undo = (event) => {
    event.preventDefault();

    const data = this.state.dataHistory.last();

    this.setState({
      data: data,
      dataHistory: this.state.dataHistory.pop(),
      dataFuture: this.state.dataFuture.push(this.state.data),
    }, () => stateManagement.saveState(this.state.data));
  }

  redo = (event) => {
    event.preventDefault();

    const data = this.state.dataFuture.last();

    this.setState({
      data: data,
      dataHistory: this.state.dataHistory.push(this.state.data),
      dataFuture: this.state.dataFuture.pop(),
    }, () => stateManagement.saveState(this.state.data));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(nextState.data.equals(this.state.data))
      || nextState.configMode !== this.state.configMode;
  }

  render() {
    const globalConfWidget = (
      <GlobalConf
        key="globalConf"
        render={this.state.configMode}

        currentTheme={this.state.data.get('theme')}
        themes={stateManagement.themesAvailable}
        setTheme={this.setTheme}

        widgets={stateManagement.widgetsAvailable}
        addWidget={this.addWidget}

        canUndo={this.state.dataHistory.count() > 0}
        canRedo={this.state.dataFuture.count() > 0}
        undo={this.undo}
        redo={this.redo}
      />
    );

    const widgets = this.state.data.get('widgets')
      .map((config, i) => (
        <Widget
          key={config + i}
          config={config}
          index={i}
          configMode={this.state.configMode}
          updateConfig={this.updateWidgetConfig}
          deleteWidget={this.deleteWidget}
          swapWidgets={this.swapWidgets}
        />
      ))
      .concat([globalConfWidget]);

    return (
      <div className="app">
        {widgets}
        <footer className="widget">
          <p>View on <a href="https://github.com/alexbostock/home-dashboard">GitHub</a>.</p>
          <p>Train data from <a href="https://www.realtimetrains.co.uk/">Realtime Trains</a>.</p>
          <div>
            <button type="button" onClick={this.toggleConfigMode}>
              {this.state.configMode ? 'Go back' : 'Settings'}
            </button>
          </div>
        </footer>

        <Theme themeKey={this.state.data.get('theme')} />
        {this.state.data.get('theme') === 'festive' ? <Snowfall /> : null}
      </div>
    );
  }
}

export default App;