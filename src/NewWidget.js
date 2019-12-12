import React from 'react';

class NewWidget extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selection: 'no-selection'
    };
  }

  renderOption(key) {
    return <option value={key} key={key}>{this.props.widgets[key].name}</option>;
  }

  render() {
    if (this.props.render) {
      return (
        <div className="widget">
          <label>
            Add new widget
            <select value={this.state.selection} onChange={(e) => this.props.add(e.target.value)}>
              <option value="no-selection" disabled="disabled">Select widget type</option>
              {Object.keys(this.props.widgets).map(key => this.renderOption(key))}
            </select>
          </label>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default NewWidget;