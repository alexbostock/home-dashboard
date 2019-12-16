import React from 'react';

import { List } from 'immutable';

class GlobalConf extends React.PureComponent<GlobalConfProps, GlobalConfState> {
  state = {
    theme: this.props.currentTheme || 'light',
    widget: 'no-selection',
  };

  renderThemeOption = (theme: Theme) => {
    return <option value={theme.key} key={theme.key}>{theme.name}</option>;
  }

  renderWidgetOption = (key: string) => {
    return <option value={key} key={key}>{this.props.widgets[key].name}</option>;
  }

  setTheme = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({theme: event.target.value});
    this.props.setTheme(event.target.value);
  }

  render() {
    if (this.props.render) {
      return (
        <div className="widget">
          <h3>Global Settings</h3>

          <form className="globalConfForm">
            <label htmlFor="addWidgetSelect">Add new widget</label>
            <select 
              id="addWidgetSelect"
              value={this.state.widget}
              onChange={e => this.props.addWidget(e.target.value)}
            >
              <option value="no-selection" disabled>Select widget type</option>
              {Object.keys(this.props.widgets).map(this.renderWidgetOption)}
            </select>

            <label htmlFor="themeSelect">Select theme</label>
            <select
              id="themeSelect"
              value={this.state.theme}
              onChange={this.setTheme}
            >
              {this.props.themes.map(this.renderThemeOption)}
            </select>

            <button
              type="button"
              disabled={!this.props.canUndo}
              onClick={this.props.undo}
            >
              Undo
            </button>
            <button
              type="button"
              disabled={!this.props.canRedo}
              onClick={this.props.redo}
            >
              Redo
            </button>
          </form>
        </div>
      );
    } else {
      return null;
    }
  }
}

interface GlobalConfState {
  theme: string;
  widget: string;
}

interface GlobalConfProps {
  render: boolean;

  currentTheme: string; // Consider changing this to an enum
  themes: List<Theme>;
  setTheme(theme: string): void;

  widgets: { [name: string]: {name: string}};
  addWidget(widget: string): void;

  canUndo: boolean;
  canRedo: boolean;
  undo(): void;
  redo(): void;
}

interface Theme {
  key: string;
  name: string
}

export default GlobalConf;