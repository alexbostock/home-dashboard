import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import Services from './services';

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const exampleTrains = {
  location: "St Pancras International",
  services: [
    {
      destination: "Sutton (Surrey)",
      arrived: true,
      scheduledDepartureTime: 727,
      realDepartureTime: 728,
      platform: "A",
      operator: "Thameslink",
    },
    {
      destination: "Cambridge",
      arrived: false,
      scheduledDepartureTime: 731,
      realDepartureTime: 731,
      platform: "B",
      operator: "Thameslink",
    },
    {
      destination: "Rainham (Kent)",
      arrived: false,
      scheduledDepartureTime: 732,
      realDepartureTime: 732,
      platform: "A",
      operator: "Thameslink",
    },
  ],
};

it('renders a message when no data has loaded', () => {
  act(() => {
    render(<Services />, container);
  });
  expect(container.textContent).toBe('No data.');
});

it('renders the station name when a valid prop is given', () => {
  act(() => {
    render(<Services trains={exampleTrains} />, container);
  });
  expect(container.textContent.includes('St Pancras International'))
    .toBe(true);
});

it('renders information about each service', () => {
  act(() => {
    render(<Services trains={exampleTrains} />, container);
  })

  exampleTrains.services.forEach((service, index) => {
    const rendered = container.getElementsByClassName('service')[index];
    const text = rendered.textContent;

    if (service.scheduledDepartureTime === service.realDepartureTime) {
      expect(text.includes('On-time')).toBe(true);
    } else {
      expect(text.includes('late')).toBe(true);
    }

    expect(text.includes(service.scheduledDepartureTime)).toBe(true);
    
    expect(text.includes(service.platform)).toBe(true);
    expect(text.includes(service.operator)).toBe(true);
  });
});