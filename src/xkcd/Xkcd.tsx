import React from 'react';
import axios from 'axios';

class Xkcd extends React.PureComponent<{}, XkcdState> {
  state: XkcdState = {
    axiosCancelToken: axios.CancelToken.source(),
  };

  render() {
    let body;
    if (this.state.comic) {
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
      <div>
        <h3>Latest XKCD</h3>
        <a href="https://xkcd.com" className="xkcd-link">{body}</a>
      </div>
    );
  }

  refresh = () => {
    const url = 'https://api.alexbostock.co.uk/xkcd/latest';

    axios.get(url, { cancelToken: this.state.axiosCancelToken.token })
      .then(res => this.setState({comic: res.data}))
      .catch(err => {
        if (err.message !== 'Cancelled on unmount') {
          console.error(err);
        }
      });
  }

  componentDidMount() {
    const timer = setInterval(this.refresh, 60 * 60 * 1000);

    this.setState({timer: timer});

    this.refresh();
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }

    this.state.axiosCancelToken.cancel('Cancelled on unmount');
  }
}

interface XkcdState {
  comic?: {
    title: string;
    safe_title: string;
    alt: string;
    img: string;
  };
  axiosCancelToken: any;
  timer?: any;
}

export default Xkcd;