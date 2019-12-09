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
      scheduledTime: 727,
      realTime: 728,
      platform: "A",
      operator: "Thameslink",
    },
    {
      destination: "Cambridge",
      arrived: false,
      scheduledTime: 731,
      realTime: 731,
      platform: "B",
      operator: "Thameslink",
    },
    {
      destination: "Rainham (Kent)",
      arrived: false,
      scheduledTime: 732,
      realTime: 732,
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
    const rendered = container.getElementsByClassName('train-service')[index];
    const text = rendered.textContent;

    if (service.scheduledTime === service.realTime) {
      expect(text.includes('On-time')).toBe(true);
    } else {
      expect(text.includes('late')).toBe(true);
    }

    expect(text.includes(service.scheduledTime)).toBe(true);
    
    expect(text.includes(service.platform)).toBe(true);
    expect(text.includes(service.operator)).toBe(true);
  });
});