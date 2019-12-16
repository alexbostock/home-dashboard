import React from 'react';

class Clock extends React.PureComponent<{}, ClockState> {
  state: ClockState = {
    time: '',
    timer: undefined,
  };

  render() {
    return (
      <div className="clock">
        <span>{this.state.time}</span>
      </div>
    );
  }

  refresh = () => {
    this.setState({
      time: this.formatTime(new Date()),
    });
  }

  formatTime(time: Date) {
    return [time.getHours(), time.getMinutes(), time.getSeconds()]
      .map(num => num.toString())
      .map(this.leftpad)
      .join(':');
  }

  leftpad(str: string) {
    return str.length === 2 ? str : '0' + str;
  }

  componentDidMount() {
    const timer = setInterval(this.refresh, 100);

    this.setState({timer: timer});

    this.refresh();
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }
  }
}

interface ClockState {
  time: string;
  timer?: any;
}

export default Clock;