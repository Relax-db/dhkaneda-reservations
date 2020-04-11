const faker = require('faker');
const Model = require('./model');

const BOOKING_COUNT = 20000000;

class Bookings extends Model {
  constructor() {
    super('bookings');
  }

  // returns PROMISE<object> with a random booking id
  getRandomOne() {
    const randomId = {
      bookingid: faker.random.number({ min: 0, max: BOOKING_COUNT }),
    };
    return super.get.call(this, randomId);
  }
}

module.exports = new Bookings();
