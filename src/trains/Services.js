import React from 'react';

function Services(props) {
  if (!props.trains || !props.trains.services) {
    return <p>No data.</p>;
  }

  const services = props.trains.services.slice(0, 3)
    .sort((a, b) => a.realTime - b.realTime)
    .map(renderService);
  
  const caption = props.arrivals ? 'Arrivals at' : 'Departures from';

  return (
    <div>
      <p>
        <strong>{caption} {props.trains.location}</strong>
      </p>
      <table>
        {services}
      </table>
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
        <th>{leftpad(service.scheduledTime)}</th>
        <th>{service.destination}</th>
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
      msg = `${-minsLate} minutes${-minsLate > 1 ? 's' : ''} early`
    }
    return <span className="delayed">{msg}</span>;
  }
}

function leftpad(num) {
  num = num.toString();
  return num.length === 4 ? num : '0' + num;
}

export default Services;