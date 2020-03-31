/* eslint-disable react/prop-types */
import React from 'react';
import styled from './Styles.jsx';
import star from './pics/star.svg';

const { Price, Star } = styled;

const RateReview = ({ rate, avg, total }) => (
  <div>
    <div id="rate">
      <Price>{`$${rate}`}</Price>
      <span> per night</span>
    </div>
    <div id="reviews">
      <Star src="http://localhost:3000/images/34ce20a35fdf492194a5fd8389349ed7-star.svg" alt={star} />
      {`${avg}(${total} reviews)`}
    </div>
  </div>
);

export default RateReview;
