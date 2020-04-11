const faker = require('faker');
const Model = require('./model');

const LOCATION_COUT = 10000000;

class Locations extends Model {
  constructor() {
    super('locations');
  }

  getRandomOne() {
    const randomId = {
      locationid: faker.random.number({ min: 0, max: LOCATION_COUT }),
    };
    return super.get.call(this, randomId);
  }
}

module.exports = new Locations();
