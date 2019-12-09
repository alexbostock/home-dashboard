import React from 'react';

function Services(props) {
  if (!props.trains || !props.trains.services) {
    return <p>No data.</p>;
  }

  const services = props.trains.services.slice(0, 3)
    .sort((a, b) => a.realTime - b.realTime)
    .map(renderService);

  return (
    <div>
      <p>{props.trains.location}</p>
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
      className="service"
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