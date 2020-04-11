const Model = require('./model');

const BOOKING_COUNT = 20000000;

class Bookings extends Model {
  constructor() {
    super('bookings');
  }

  // returns PROMISE<object> with a random booking id
  getRandomOne() {
    const randomId = {
      bookingid: Math.floor(Math.random() * BOOKING_COUNT),
    };
    return super.get.call(this, randomId)
      .then((booking) => {
        return super.getAll.call(this, { locationid: booking.locationid });
      });
  }
}

module.exports = new Bookings();
