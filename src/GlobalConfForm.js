import React from 'react';

import stateManagement from './stateManagement';

function GlobalConfForm(props) {
  const themes = stateManagement.themesAvailable;
  const widgets = stateManagement.widgetsAvailable;

  const renderThemeOption = (theme) => {
    return <option value={theme.key} key={theme.key}>{theme.name}</option>;
  }

  const renderWidgetOption = (key) => {
    return <option value={key} key={key}>{widgets[key].name}</option>;
  }

  const setTheme = (event) => {
    props.setTheme(event.target.value);
  }

  return (
    <div className="widget">
      <h3>Global Settings</h3>

      <form className="globalConfForm">
        <label htmlFor="addWidgetSelect">Add new widget</label>
        <select 
          id="addWidgetSelect"
          value="no-selection"
          onChange={e => props.addWidget(e.target.value)}
        >
          <option value="no-selection" disabled>Select widget type</option>
          {Object.keys(widgets).map(renderWidgetOption)}
        </select>

        <label htmlFor="themeSelect">Select theme</label>
        <select
          id="themeSelect"
          value={props.currentTheme}
          onChange={setTheme}
        >
          {themes.map(renderThemeOption)}
        </select>

        <button
          type="button"
          disabled={!props.canUndo}
          onClick={props.undo}
        >
          Undo
        </button>
        <button
          type="button"
          disabled={!props.canRedo}
          onClick={props.redo}
        >
          Redo
        </button>
      </form>
    </div>
  );
}

export default GlobalConfForm;