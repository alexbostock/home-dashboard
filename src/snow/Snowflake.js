import React from 'react';

class Snowflake extends React.Component {
  state = {
    duration: (Math.random() * 10 + 15) * 1000,
    leftPos: Math.random() * 100 + '%',
    width: Math.random() * 5 + 1 + '%',
    falling: false,
    timer: null,
  };

  reset = () => {
    this.setState({
      leftPos: 0.8 * Math.random() * 100 + '%',
      width: Math.random() * 5 + 1 + '%',
      falling: false
    }, () => {
      const timer = setTimeout(this.fall, Math.random() * 1000);
      this.setState({timer: timer});
    })
  }

  fall = () => {
    this.setState({
      leftPos: (1 - 0.8 * Math.random()) * 100 + '%',
      falling: true,
    });
  }

  shouldComponentUpdate(nextState) {
    return nextState.falling !== this.state.falling;
  }

  render() {
    const components = [0, 1, 2, 3, 4, 5]
      .map(num => <g key={num} transform={`rotate(${num * 60})`}>{component}</g>);

    return (
      <svg
        className={this.state.falling ? 'snowflake falling' : 'snowflake waiting'}
        viewBox="-100 -100 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: this.state.width,
          left: this.state.leftPos,
          transitionDuration: this.state.falling ? this.state.duration + 'ms' : null,
        }}
        onTransitionEnd={this.state.falling ? this.reset : null}
      >
        <g transform={`rotate(${Math.random() * 30})`}>
          {components}
        </g>
      </svg>
    );
  }

  componentDidMount() {
    const timer = setTimeout(this.reset, Math.random() * 20 * 1000);
    this.setState({timer: timer});
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
    }
  }
}

const component = (
  <g>
    <line fill="none" stroke="white" x1="0" x2="60" y1="0" y2="0" />
    <path fill="none" stroke="white" d="M 0 0 l 17.3205080757 10 l 17.32051 -10" />
    <path fill="none" stroke="white" d="M 0 0 l 17.3205080757 -10 l 17.32051 10" />

    <path fill="none" stroke="white" d="M 60 0 L 72.3205080757 10 L 100 0" />
    <path fill="none" stroke="white" d="M 60 0 L 72.3205080757 -10 L 100 0" />

    <line fill="none" stroke="white" x1="0" y1="0" x2="0" y2="50" />
    <path fill="none" stroke="white" d="M 0 50 l 5 10 l -5 10 l -5 -10 l 5 -10" />
  </g>
);

export default Snowflake;