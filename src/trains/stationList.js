import axios from 'axios';

class StationList {
  constructor() {
    this.lastFetched = undefined;
    this.stations = undefined;
    this.ttl = 60 * 60 * 1000;

    this.load();

    setInterval(this.refresh, 60 * 1000);
  }

  refresh = () => {
    if (!this.stations || Date.now() - this.lastFetched < this.ttl) {
      this.fetchList();
    }
  }

  fetchList() {
    const url = 'https://api.alexbostock.co.uk/trains/stations';

    axios.get(url)
      .then(res => {
        this.stations = {};
        res.data.forEach(s => this.stations[s.crs] = s.name);
        this.lastFetched = Date.now();

        this.save();
      })
      .catch(err => {
        if (err.message !== 'Cancelled by client') {
          console.error(err);
        }
      });
  }

  load() {
    const state = localStorage.getItem('stationList');
    if (state) {
      this.stations = state.stations;
      this.lastFetched = state.fetched;
    }

    this.refresh();
  }

  save() {
    try {
      localStorage.setItem('stationList', JSON.stringify({
        fetched: this.lastFetched,
        stations: this.stations,
      }));
    } catch (err) {
      console.error('Saving to local storage failed');
      console.error(err);
    }
  }
}

const sl = new StationList()

export default sl;