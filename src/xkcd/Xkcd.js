import React from 'react';
import axios from 'axios';
import { setIntervalAsync } from 'set-interval-async/dynamic';
import { clearIntervalAsync } from 'set-interval-async';

class Xkcd extends React.PureComponent {
  constructor() {
    super();

    this.state = {comic: null};
  }

  render() {
    let body;
    if (this.state.comic) {
      console.log(this.state.comic);
      body = (
        <div>
          <h4>{this.state.comic.title}</h4>
          <img
            src={this.state.comic.img}
            title={this.state.comic.alt}
            alt={this.state.comic.safe_title}
          />
        </div>
      );
    } else {
      body = <p>No comic loaded.</p>;
    }

    return (
      <div className="widget">
        <h3>Latest XKCD</h3>
        {body}
      </div>
    );
  }

  async refresh() {
    const url = 'http://localhost:4000/xkcd/latest';

    try {
      const res = await axios.get(url);

      this.setState({comic: res.data});
    } catch (err) {
      console.error(err);
    }
  }

  componentDidMount() {
    const timer = setIntervalAsync(
      this.refresh.bind(this),
      60 * 60 * 1000
    );

    this.setState({timer: timer});

    this.refresh();
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearIntervalAsync(this.state.timer);
    }
  }
}

export default Xkcd;