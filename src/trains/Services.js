import React from 'react';

function Services(props) {
  if (!props.trains || !props.trains.services) {
    return <p>No data.</p>;
  }

  return (
    <div>
      <p>{props.trains.location}</p>
      <div>
        {props.trains.services.slice(0, 3).map(renderService)}
      </div>
    </div>
  );
}

function renderService(service) {
  const ontimeness = ontimenessMessage(
    service.scheduledDepartureTime, service.realDepartureTime);
  return (
    <div
      className="service"
      key={service.scheduledDepartureTime + service.destination}
    >
      <h4>{service.scheduledDepartureTime} {service.destination}</h4>
      <p>Platform {service.platform}, {ontimeness}</p>
      <p>{service.operator}</p>
    </div>
  );
}

function ontimenessMessage(scheduled, actual) {
  if (scheduled === actual) {
    return <span className="ontime">on-time</span>;
  } else {
    const minsLate = actual - scheduled;
    const msg = `${minsLate} minute${minsLate > 1 ? 's' : ''} late`;
    return <span className="delayed">{msg}</span>;
  }
}

export default Services;