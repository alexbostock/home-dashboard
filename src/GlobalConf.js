import React from 'react';

class GlobalConf extends React.PureComponent {
  state = {
    theme: this.props.currentTheme || 'light',
    widget: 'no-selection',
  };

  renderThemeOption = (theme) => {
    return <option value={theme.key} key={theme.key}>{theme.name}</option>;
  }

  renderWidgetOption = (key) => {
    return <option value={key} key={key}>{this.props.widgets[key].name}</option>;
  }

  setTheme = (event) => {
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

export default GlobalConf;