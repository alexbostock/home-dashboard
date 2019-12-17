import { List, Map } from 'immutable';

import * as actions from '../actions';

import stateManagement from '../stateManagement';

const defaultState = Map({
  data: stateManagement.loadSavedState(),
  dataHistory: List(),
  dataFuture: List(),

  configMode: false,
});

export default function reduceAndSave(oldState, action) {
  const state = reduce(oldState, action);

  stateManagement.saveState(state.get('data'));

  return state;
}

function reduce(state = defaultState, action) {
  switch (action.type) {
    case actions.UNDO:
      return undo(state);
    case actions.REDO:
      return redo(state);
    case actions.TOGGLE_CONFIG_MODE:
      return state.set('configMode', !state.get('configMode'));
    case actions.ADD_WIDGET:
    case actions.REMOVE_WIDGET:
    case actions.SWAP_WIDGETS:
    case actions.SET_THEME:
    case actions.SET_TRAIN_TIMES_STATION:
    case actions.SET_TRAIN_TIMES_ARRIVALS:
    case actions.SET_TRAIN_TIMES_NUM_SERVICES:
    case actions.SET_TRAIN_TIMES_SERVICES_PER_PAGE:
    case actions.ADD_BOOKMARK:
    case actions.REMOVE_BOOKMARK:
    case actions.SWAP_BOOKMARKS:
    case actions.UPDATE_STATE:
      return state
      .set('dataHistory', state.get('dataHistory').push(state.get('data')))
      .set('dataFuture', List())
      .set('data', reduceUndoable(state.get('data'), action));
    default:
      return state;
  }
}

function undo(state) {
  return state
    .set('data', state.get('dataHistory').last())
    .set('dataHistory', state.get('dataHistory').pop())
    .set('dataFuture', state.get('dataFuture').push(state.get('data')));
}

function redo(state) {
  return state
    .set('data', state.get('dataFuture').last())
    .set('dataHistory', state.get('dataHistory').push(state.get('data')))
    .set('dataFuture', state.get('dataFuture').pop());
}

function reduceUndoable(state, action) {
  switch (action.type) {
    case actions.ADD_WIDGET:
    case actions.REMOVE_WIDGET:
    case actions.SWAP_WIDGETS:
      const widgets = reduceWidgets(state.get('widgets'), action);
      return state.set('widgets', widgets);
    case actions.SET_THEME:
      return setTheme(state, action);
    case actions.SET_TRAIN_TIMES_STATION:
    case actions.SET_TRAIN_TIMES_ARRIVALS:
    case actions.SET_TRAIN_TIMES_NUM_SERVICES:
    case actions.SET_TRAIN_TIMES_SERVICES_PER_PAGE:
    case actions.ADD_BOOKMARK:
    case actions.REMOVE_BOOKMARK:
    case actions.SWAP_BOOKMARKS:
      const widget = state.getIn(['widgets', action.widgetIndex]);
      const reducedWidget = reduceWidget(widget, action);
      return state.setIn(['widgets', action.index], reducedWidget);
    case actions.UPDATE_STATE:
      return action.data;
    default:
      console.error('unexpected action');
      console.error(action);
  }
}

function reduceWidgets(widgets, action) {
  switch (action.type) {
    case actions.ADD_WIDGET:
        const widget = stateManagement.defaultWidgetState(action.widgetType);
      return widgets.push(widget);
    case actions.REMOVE_WIDGET:
      return widgets.delete(action.index);
    case actions.SWAP_WIDGETS:
      const widget1 = widgets.get(action.index1);
      const widget2 = widgets.get(action.index2);

      return widgets
        .set(action.index1, widget2)
        .set(action.index2, widget1);
    default:
      console.error('unexpected action');
      console.error(action);
  }
}

function setTheme(state, action) {
  return state.set('theme', action.theme);
}

function reduceWidget(widget, action) {
  switch (action.type) {
    case actions.SET_TRAIN_TIMES_STATION:
      return widget.set('station', action.station);
    case actions.SET_TRAIN_TIMES_ARRIVALS:
      return widget.set('arrivals', action.arrivals);
    case actions.SET_TRAIN_TIMES_NUM_SERVICES:
      return widget.set('numServices', action.numServices);
    case actions.SET_TRAIN_TIMES_SERVICES_PER_PAGE:
      return widget.set('servicesPerPage', action.servicesPerPage);
    case actions.ADD_BOOKMARK:
      const newBookmark = Map({
        name: action.name,
        url: action.url,
      });

      return widget.set('items', widget.get('items').push(newBookmark));
    case actions.REMOVE_BOOKMARK:
      return widget.deleteIn(['items', action.bookmarkIndex]);
    case actions.SWAP_BOOKMARKS:
      const bookmark1 = widget.getIn(['items'], action.index1);
      const bookmark2 = widget.getIn(['items'], action.index2);

      return widget
        .setIn(['items', action.index1], bookmark2)
        .setIn(['items', action.index2], bookmark1);
    default:
      console.error('unexpected action');
      console.error(action);
  }
}