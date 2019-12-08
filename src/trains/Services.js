import React from 'react';

function Services(props) {
  if (!props.trains || !props.trains.services) {
    return <p>No data.</p>;
  }

  return (
    <div>
      <p>{props.trains.location}</p>
      <table>
        {props.trains.services.slice(0, 3).map(renderService)}
      </table>
    </div>
  );
}

function renderService(service) {
  const ontimeness = ontimenessMessage(
    service.scheduledDepartureTime, service.realDepartureTime);
  return (
    <tbody
      className="service"
      key={service.scheduledDepartureTime + service.destination}
    >
      <tr>
        <th>{leftpad(service.scheduledDepartureTime)}</th>
        <th>{service.destination}</th>
      </tr>
      <tr>
        <td>Platform {service.platform}</td>
        <td>{ontimeness}</td>
      </tr>
      <tr><td>{service.operator}</td></tr>
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
    const msg = `${minsLate} minute${minsLate > 1 ? 's' : ''} late`;
    return <span className="delayed">{msg}</span>;
  }
}

function leftpad(num) {
  num = num.toString();
  return num.length === 4 ? num : '0' + num;
}

export default Services;