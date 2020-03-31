/* eslint-disable import/extensions */
/* eslint-disable no-undef */
/* eslint-disable comma-dangle */
import React from 'react';
import { shallow } from 'enzyme';
import RateReview from '../client/src/RateReview.jsx';

describe('Rate Review ', () => {
  const mockReview = {
    rate: 35,
    avg: 3.5,
    total: 120
  };

  const wrapper = shallow(
    <RateReview
      rate={mockReview.rate}
      avg={mockReview.avg}
      total={mockReview.total}
    />
  );

  test('RateReview should render a line that has the rate per night', () => {
    expect(wrapper.find('#rate').text()).toEqual('$35/night');
  });

  test('RateReview should render a line that has the avg review with the total reviews', () => {
    expect(wrapper.find('#reviews').text()).toEqual('3.5(120 reviews)');
  });
});
