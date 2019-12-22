import React from 'react';

import './App.css';

import Widget from './Widget';
import GlobalConf from './GlobalConf';
import Theme from './Theme';
import Snowfall from './snow/Snowfall';

class Main extends React.PureComponent {
  render() {
    const globalConfWidget = this.props.configMode ? <GlobalConf key="globalConf" />: null;

    const widgets = this.props.widgets
      .map((config, i) => (
        <Widget
          key={config + i}
          config={config}
          index={i}
          configMode={this.props.configMode}
          deleteWidget={this.props.removeWidget}
          swapWidgets={this.props.swapWidgets}
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
            <button type="button" onClick={this.props.toggleConfigMode}>
              {this.props.configMode ? 'Go back' : 'Settings'}
            </button>
          </div>
        </footer>

        <Theme themeKey={this.props.theme} />
        <Snowfall />
      </div>
    );
  }
}

export default Main;