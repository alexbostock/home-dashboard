import { List, Map } from 'immutable';
import { serialize, deserialize } from 'json-immutable';

const themesAvailable = [
  {
    key: 'light',
    name: 'Light (default)',
  },
  {
    key: 'dark',
    name: 'Dark',
  },
];

const widgetsAvailable = {
  'bookmarks': {
    name: 'Bookmarks',
    config: Map({
      items: List([
        Map({name: 'Google', 'url': 'https://google.com'}),
      ]),
    }),
  },
  'clock': {
    name: 'Clock',
    config: Map(),
  },
  'live-trains': {
    name: 'Live train times',
    config: Map({
      station: 'STP',
      arrivals: false,
      numServices: 3,
    }),
  },
  'xkcd': {
    name: 'Latest xkcd comic',
    config: Map(),
  },
};

function defaultWidgetState(key) {
  return widgetsAvailable[key].config.set('type', key);
}

function defaultState() {
  return Map({
    theme: null,
    widgets: List(Object.keys(widgetsAvailable)).map(defaultWidgetState),
  });
}

function loadSavedState() {
  const state = localStorage.getItem('config');

  return state ? deserialize(state) : defaultState();
}

function saveState(state) {
  try {
    localStorage.setItem('config', serialize(state));
    return true;
  } catch (err) {
    console.err('Saving to local storage failed.');
    console.error(err);
    return false;
  }
}

export default {
  themesAvailable: themesAvailable,
  widgetsAvailable: widgetsAvailable,
  defaultWidgetState: defaultWidgetState,
  loadSavedState: loadSavedState,
  saveState: saveState,
};