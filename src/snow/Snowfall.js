import React from 'react';

import Snowflake from './Snowflake';

function Snowfall() {
  const numFlakes = 70;

  const flakes = [];

  for (let i = 0; i < numFlakes; i++) {
    flakes.push(<Snowflake key={i} />)
  }

  return (
    <div className="backdrop">
      {flakes}
    </div>
  );
}

export default Snowfall;