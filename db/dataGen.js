/* eslint-disable max-classes-per-file */
const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const cliProgress = require('cli-progress');

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const bar2 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const bar3 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const USER_COUNT = 50000;
const HOST_COUNT = USER_COUNT * 0.06; //  300
const LOCATION_COUNT = USER_COUNT * 0.20; //  1000
const BOOKING_COUNT = USER_COUNT * 0.40; //  2000

const userWriter = createCsvWriter({
  path: './data/user.csv',
  header: [
    { id: 'id', title: 'id' },
    { id: 'dateCreated', title: 'dateCreated' },
    { id: 'userName', title: 'username' },
    { id: 'password', title: 'password' },
  ],
});

const locationWriter = createCsvWriter({
  path: './data/locations.csv',
  header: [
    { id: 'id', title: 'id' },
    { id: 'user_id', title: 'user_id' },
    { id: 'address', title: 'address' },
    { id: 'rate', title: 'rate' },
    { id: 'avg_rating', title: 'avg_rating' },
    { id: 'total_reviews', title: 'total_reviews' },
    { id: 'service_fee', title: 'service_fee' },
    { id: 'cleaning_fee', title: 'cleaning_fee' },
    { id: 'occupancy_tax', title: 'occupancy_tax' },
  ],
});

const bookingWriter = createCsvWriter({
  path: './data/bookings.csv',
  header: [
    { id: 'id', title: 'id' },
    { id: 'user_id', title: 'user_id' },
    { id: 'location_id', title: 'location_id' },
    { id: 'checkin', title: 'checkin' },
    { id: 'checkout', title: 'checkout' },
    { id: 'total_cost', title: 'total_cost' },
    { id: 'adults', title: 'adults' },
    { id: 'children', title: 'children' },
    { id: 'infants', title: 'infants' },
  ],
});

class User {
  constructor(id) {
    this.id = id;
    this.dateCreated = faker.date.between(2010, 2020);
    this.userName = faker.internet.userName();
    this.password = faker.internet.password();
  }
}

class Location {
  constructor(id, userId) {
    this.id = id;
    this.user_id = userId;
    this.address = faker.fake('{{address.streetAddress}}, {{address.city}}, {{address.state}}');
    this.rate = faker.random.number({ min: 50, max: 300 });
    this.avg_rating = faker.random.number({ min: 1, max: 4 }) + Math.random();
    this.total_reviews = faker.random.number({ min: 1, max: 2000 });
    this.service_fee = faker.random.number({ min: 30, max: 50 });
    this.cleaning_fee = faker.random.number({ min: 10, max: 30 });
    this.occupancy_tax = this.rate * 0.15;
  }
}

class Booking {
  constructor(id, userId, locationId) {
    this.date = new Date();
    this.yearLater = new Date(this.date.getTime() + (24 * 60 * 60 * 1000) * 365);
    this.duration = faker.random.number({ min: 1, max: 14 });
    this.id = id;
    this.user_id = userId;
    this.location_id = locationId;
    this.checkin = faker.date.between(this.date, this.yearLater);
    this.checkout = new Date(this.checkin.getTime() + (24 * 60 * 60 * 1000) * this.duration);
    this.total_cost = faker.random.number({ min: 50, max: 300 }) * this.duration;
    this.adults = faker.random.number({ min: 1, max: 7 });
    this.children = faker.random.number({ min: 0, max: 12 });
    this.infants = faker.random.number({ min: 0, max: 3 });
  }
}

const generateUsers = () => {
  const users = [];
  for (let i = 0; i < USER_COUNT; i += 1) {
    users.push(new User(i));
    bar.increment();
  }
  return users;
};

const generateLocations = () => {
  const locations = [];
  for (let i = 0; i < LOCATION_COUNT; i += 1) {
    locations.push(new Location(i, faker.random.number({ min: 0, max: HOST_COUNT })));
    bar2.increment();
  }
  return locations;
};

const generateBookings = () => {
  const bookings = [];
  for (let i = 0; i < BOOKING_COUNT; i += 1) {
    bookings.push(new Booking(
      i,
      faker.random.number({ min: 0, max: USER_COUNT }),
      faker.random.number({ min: 0, max: LOCATION_COUNT }),
    ));
    bar3.increment();
  }
  return bookings;
};

let multiplier = 1000;
const multiplierStart = multiplier;


const writeBookings = () => {
  if (multiplier !== 0) {
    multiplier -= 1;
    const bookings = generateBookings();
    bookingWriter.writeRecords(bookings)
      .then(() => {
        writeBookings();
      });
  } else {
    bar3.stop();
    console.log('Bookings written');
  }
};

const writeLocations = () => {
  if (multiplier !== 0) {
    multiplier -= 1;
    const locations = generateLocations();
    locationWriter.writeRecords(locations)
      .then(() => {
        writeLocations();
      });
  } else {
    bar2.stop();
    console.log('Locations written');
    multiplier = multiplierStart;
    bar3.start(BOOKING_COUNT * multiplierStart, 0);
    writeBookings();
  }
};

const writeUsers = () => {
  if (multiplier !== 0) {
    multiplier -= 1;
    const users = generateUsers();
    userWriter.writeRecords(users)
      .then(() => {
        writeUsers();
      });
  } else {
    bar.stop();
    console.log('Users written');
    multiplier = multiplierStart;
    bar2.start(LOCATION_COUNT * multiplierStart, 0);
    writeLocations();
  }
};

bar.start(USER_COUNT * multiplier, 0);
writeUsers();
