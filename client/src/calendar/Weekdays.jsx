import React from 'react';

const Weekdays = ({ weekdays }) => (
  <tr>
    {weekdays.map((day) => (
      <td key={day} className="week-day">{day}</td>
    ))}
  </tr>
);

export default Weekdays;
