/* eslint-disable import/no-unresolved */
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 200,
  duration: '60s',
};

export default function () {
  http.get('http://localhost:3000/api/locations');
  sleep(1);
  http.get('http://localhost:3000/api/bookings');
  sleep(1);
}
