export const ADD_WIDGET = 'ADD_WIDGET';
export const REMOVE_WIDGET = 'REMOVE_WIDGET';
export const SWAP_WIDGETS = 'SWAP_WIDGETS';

export const WIDGETS = {
  TRAIN_TIMES: 'live-trains',
  BOOKMARKS: 'bookmarks',
  XKCD: 'xkcd',
  CLOCK: 'clock',
};

export function addWidget(type) {
  return {
    type: ADD_WIDGET,
    widgetType: type,
  };
}

export function removeWidget(index) {
  return {
    type: REMOVE_WIDGET,
    index,
  };
}

export function swapWidgets(index1, index2) {
  return {
    type: SWAP_WIDGETS,
    index1,
    index2,
  };
}

export const SET_THEME = 'SET_THEME';
export const UNDO = 'UNDO';
export const REDO = 'REDO';

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SPOOKY: 'spoopy',
}

export function setTheme(theme) {
  return {
    type: SET_THEME,
    theme,
  };
}

export function undo() {
  return {
    type: UNDO,
  };
}

export function redo() {
  return {
    type: REDO,
  };
}

export const SET_TRAIN_TIMES_STATION = 'SET_TRAIN_TIMES_STATION';
export const SET_TRAIN_TIMES_ARRIVALS = 'SET_TRAIN_TIMES_ARRIVALS';
export const SET_TRAIN_TIMES_NUM_SERVICES = 'SET_TRAIN_TIMES_NUM_SERVICES';
export const SET_TRAIN_TIMES_SERVICES_PER_PAGE = 'SET_TRAIN_TIMES_SERVICES_PER_PAGE';

export function setStation(widget, station) {
  return {
    type: SET_TRAIN_TIMES_STATION,
    widgetIndex: widget,
    station,
  };
}

export function setArrivals(widget, arrivals) {
  return {
    type: SET_TRAIN_TIMES_ARRIVALS,
    widgetIndex: widget,
    arrivals,
  };
}

export function setNumServices(widget, numServices) {
  return {
    type: SET_TRAIN_TIMES_ARRIVALS,
    widgetIndex: widget,
    numServices,
  };
}

export function setServicesPerPage(widget, servicesPerPage) {
  return {
    type: SET_TRAIN_TIMES_ARRIVALS,
    widgetIndex: widget,
    servicesPerPage,
  };
}

export const ADD_BOOKMARK = 'ADD_BOOKMARK';
export const REMOVE_BOOKMARK = 'REMOVE_BOOKMARK';
export const SWAP_BOOKMARKS = 'SWAP_BOOKMARKS';

export function addBookmark(widget, name, url) {
  return {
    type: ADD_BOOKMARK,
    widgetIndex: widget,
    name,
    url,
  };
}

export function removeBookmark(widget, bookmark) {
  return {
    type: REMOVE_BOOKMARK,
    widgetIndex: widget,
    bookmarkIndex: bookmark,
  };
}

export function swapBookmarks(widget, index1, index2) {
  return {
    type: SWAP_BOOKMARKS,
    widgetIndex: widget,
    index1,
    index2,
  };
}

export const TOGGLE_CONFIG_MODE = 'TOGGLE_CONFIG_MODE';

export function toggleConfigMode() {
  return {
    type: TOGGLE_CONFIG_MODE,
  };
}

// TEMPORARY ACTION for transition period only
export const UPDATE_STATE = 'UPDATE_STATE';

export function updateState(state) {
  return {
    type: UPDATE_STATE,
    data: state,
  }
}