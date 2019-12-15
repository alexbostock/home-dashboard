import React from 'react';
import PropTypes from 'prop-types';

import { Map } from 'immutable';

import Bookmarks from './bookmarks/Bookmarks';
import BookmarksConf from './bookmarks/BookmarksConf';
import Clock from './clock/Clock';
import TrainTimes from './trains/TrainTimes';
import TrainTimesConf from './trains/TrainTimesConf';
import Xkcd from './xkcd/Xkcd';

function renderWidgetComponent(config) {
  switch (config.get('type')) {
    case 'bookmarks':
      return (
        <Bookmarks
          items={config.get('items')}
        />
      );
    case 'clock':
      return <Clock />;
    case 'live-trains':
      return (
        <TrainTimes
          station={config.get('station')}
          arrivals={config.get('arrivals')}
          numServices={config.get('numServices')}
        />
      );
    case 'xkcd':
      return <Xkcd />;
    default:
      console.error(`Invalid widget type: ${config.get('type')}`);
      return null;
  }
}

function renderConfWidgetComponent(config, index, updateFunc) {
  switch (config.get('type')) {
    case 'bookmarks':
      return (
        <BookmarksConf
          items={config.get('items')}
          updateState={update => {
            updateFunc(index, config.set('items', update));
          }}
        />
      );
    case 'clock':
      return <Clock />;
    case 'live-trains':
      return (
        <TrainTimesConf
          station={config.get('station')}
          arrivals={config.get('arrivals')}
          numServices={config.get('numServices')}
          updateState={update => updateFunc(index, update)}
          widgetIndex={index}
        />
      );
    case 'xkcd':
      return <Xkcd />;
    default:
      console.error(`Invalid widget type: ${config.get('type')}`);
      return null;
  }
}

function Widget(props) {
  const config = props.config;
  const index = props.index;

  let widget;
  if (props.configMode) {
    widget = renderConfWidgetComponent(config, index, props.updateConfig);
  } else {
    widget = renderWidgetComponent(config);
  }

  const className = config.get('type') === 'clock' ? 'widget clockWidget' : 'widget';

  if (props.configMode) {
    return (
      <div
        className={className}
        draggable="true"
        onDragStart={e => onDragStart(e, index)}
        onDragOver={e => e.preventDefault()}
        onDrop={e => onDrop(e, index, props.swapWidgets)}
      >
        <div className="widgetMenuBar">
          <span>Drag widget to reposition</span>
          <button type="button" onClick={() => props.deleteWidget(index)}>Delete</button>
        </div>
        {widget}
      </div>
    )
  } else {
    return <div className={className} key={config + index}>{widget}</div>;
  }
}

function onDragStart(event, index) {
  if (event.dataTransfer.getData('bookmark')) {
    return;
  }

  event.dataTransfer.setData('draggedIndex', index);
}

function onDrop(event, index, callback) {
  event.preventDefault();

  if (event.dataTransfer.getData('bookmark')) {
    return;
  }

  const draggedIndex = event.dataTransfer.getData('draggedIndex');

  callback(draggedIndex, index);
}

Widget.propTypes = {
  config: PropTypes.instanceOf(Map).isRequired,
  index: PropTypes.number.isRequired,
  configMode: PropTypes.bool.isRequired,
  updateConfig: PropTypes.func.isRequired,
  deleteWidget: PropTypes.func.isRequired,
  swapWidgets: PropTypes.func.isRequired,
}

export default Widget;