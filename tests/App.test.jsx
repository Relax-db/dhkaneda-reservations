/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
// eslint-disable-next-line import/extensions
import App from '../client/src/App.jsx';


describe('App', () => {
  const wrapper = shallow(<App />);
  test('App should exist and render', () => {
    expect(wrapper).toExist();
  });
});
