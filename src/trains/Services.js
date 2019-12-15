import React from 'react';

function Services(props) {
  if (!props.trains || !props.trains.services) {
    return <p>No data.</p>;
  }

  const numServicesToRender = props.numServices || 3;

  const trains = props.trains.services
    .sort((a, b) => compareTimes(a.realTime, b.realTime))
    .slice(0, numServicesToRender)
    .map(renderService);

  const caption = props.arrivals ? 'Arrivals at' : 'Departures from';

  return (
    <div>
      <p className="TrainTimesCaption">
        <strong>{caption} {props.trains.location}</strong>
      </p>
      {trains.length > 0 ? <table>{trains}</table> : <p>No upcoming trains.</p>}
    </div>
  );
}

function renderService(service) {
  const ontimeness = ontimenessMessage(
    service.scheduledTime, service.realTime);
  return (
    <tbody
      className="train-service"
      key={service.scheduledTime + service.destination}
    >
      <tr>
        <th colSpan="2">
          <div>
            <span>{leftpad(service.scheduledTime)}</span>
            <span>{service.destination}</span>
          </div>
        </th>
      </tr>
      <tr>
        <td>Platform {service.platform}</td>
        <td>{ontimeness}</td>
      </tr>
      <tr><td colSpan="2">{service.operator}</td></tr>
    </tbody>
  );
}

function ontimenessMessage(scheduled, actual) {
  if (actual === null || actual === undefined) {
    return 'Live data not available';
  } else if (scheduled === actual) {
    return <span className="ontime">On-time</span>;
  } else {
    const minsLate = actual - scheduled;
    let msg;
    if (minsLate > 0) {
      msg = `${minsLate} minute${minsLate > 1 ? 's' : ''} late`;
    } else {
      msg = `${-minsLate} minute${-minsLate > 1 ? 's' : ''} early`
    }
    return <span className="delayed">{msg}</span>;
  }
}

function leftpad(num) {
  num = num.toString();
  return new Array(4 - num.length).fill('0').join('') + num;
}

// When comparing services running the same night but different sides of
// midnight, chronological order is not the same as comparison of times.
// This assmues that, if one train is expected between 1800 and 2359, and
// another is expected between 0000 and 0559, the first is sooner.
function compareTimes(t1, t2) {
  const smaller = Math.min(t1, t2);
  const larger = Math.max(t1, t2);

  if (0 <= smaller && smaller < 600 && 1800 < larger && larger <= 2359) {
    return t2 - t1;
  } else {
    return t1 - t2;
  }
}

export default Services;