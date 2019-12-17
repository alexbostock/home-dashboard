import React from 'react';

import './App.css';

import Widget from './Widget';
import GlobalConf from './GlobalConf';
import Theme from './Theme';

import stateManagement from './stateManagement';

class Main extends React.PureComponent {
  updateWidgetConfig = (index, update) => {
    const newState = this.props.data
      .setIn(['widgets', index], update);
    this.props.updateState(newState);
  }

  undo = (event) => {
    event.preventDefault();

    this.props.undo();
  }

  redo = (event) => {
    event.preventDefault();

    this.props.redo();
  }

  render() {
    const globalConfWidget = (
      <GlobalConf
        key="globalConf"
        render={this.props.configMode}

        currentTheme={this.props.theme}
        themes={stateManagement.themesAvailable}
        setTheme={this.props.setTheme}

        widgets={stateManagement.widgetsAvailable}
        addWidget={this.props.addWidget}

        canUndo={this.props.canUndo}
        canRedo={this.props.canRedo}
        undo={this.undo}
        redo={this.redo}
      />
    );

    const widgets = this.props.widgets
      .map((config, i) => (
        <Widget
          key={config + i}
          config={config}
          index={i}
          configMode={this.props.configMode}
          updateConfig={this.updateWidgetConfig}
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
      </div>
    );
  }
}

export default Main;