/* eslint-disable react/prop-types */
import React from 'react';

const Pricing = ({
  rate, service, occupancy, nights
}) => (
  <div>
    <div>
      {`$${rate} x ${nights} nights`}
      {` $${rate * nights}`}
    </div>
    <hr />
    <div>
      {`Service Fee $${service} `}
    </div>
    <hr />
    <div>
      {`Occupancy taxes and fees $${occupancy} `}
    </div>
    <hr />
    <div>
      {`Total ${rate * nights + occupancy + service}`}
    </div>
  </div>
);

export default Pricing;
