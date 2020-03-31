/* eslint-disable react/prop-types */
import React from 'react';
import styled from './Styles.jsx';

const { CircleButton } = styled;

const Guests = ({
  decrease, increase, children, infants, adults
}) => (
  <div>
    <table className="guests">
      <tbody>
        <tr>
          <td>Adults</td>
          <td>
            <CircleButton type="button" name="adults" onClick={decrease}> - </CircleButton>
            {adults}
            <CircleButton type="button" name="adults" onClick={increase}> + </CircleButton>
          </td>
        </tr>
        <tr>
          <td>Children</td>
          <td>
            <CircleButton type="button" name="children" onClick={decrease}> - </CircleButton>
            {children}
            <CircleButton type="button" name="children" onClick={increase}> + </CircleButton>
          </td>
        </tr>
        <tr>
          <td>Infants</td>
          <td>
            <CircleButton type="button" name="infants" onClick={decrease}> - </CircleButton>
            {infants}
            <CircleButton type="button" name="infants" onClick={increase}> + </CircleButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default Guests;
