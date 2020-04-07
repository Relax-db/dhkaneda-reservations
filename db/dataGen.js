/* eslint-disable max-classes-per-file */
const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const cliProgress = require('cli-progress');
const _ = require('lodash');

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const bar2 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const bar3 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

let startTime = new Date().getTime();
let originalTime = new Date().getTime();
const USER_COUNT = 5000; // 500000
const HOST_COUNT = USER_COUNT * 0.06;
const BOOKING_COUNT = 1000; // 100000
const LOCATION_COUNT = BOOKING_COUNT / 2;

let multiplier = 1; // 100
const multiplierStart = multiplier;

const userWriter = createCsvWriter({
  path: './db/postgres/data/user.csv',
  header: [
    { id: 'user_id', title: 'user_id' },
    { id: 'dateCreated', title: 'dateCreated' },
    { id: 'userName', title: 'username' },
    { id: 'password', title: 'password' },
  ],
});

const locationWriter = createCsvWriter({
  path: './db/postgres/data/locations.csv',
  header: [
    { id: 'location_id', title: 'location_id' },
    { id: 'host_id', title: 'host_id' },
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
  path: './db/postgres/data/bookings.csv',
  header: [
    { id: 'booking_id', title: 'booking_id' },
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

const bookingsByLocationWriter = createCsvWriter({
  path: './db/cassandra/data/bookingsByLocation.csv',
  header: [
    { id: 'booking_id', title: 'id' },
    { id: 'user_id', title: 'user_id' },
    { id: 'location_id', title: 'location_id' },
    { id: 'host_id', title: 'host_id' },
    { id: 'address', title: 'address' },
    { id: 'rate', title: 'rate' },
    { id: 'avg_rating', title: 'avg_rating' },
    { id: 'total_reviews', title: 'total_reviews' },
    { id: 'service_fee', title: 'service_fee' },
    { id: 'cleaning_fee', title: 'cleaning_fee' },
    { id: 'occupancy_tax', title: 'occupancy_tax' },
    { id: 'checkin', title: 'checkin' },
    { id: 'checkout', title: 'checkout' },
    { id: 'total_cost', title: 'total_cost' },
    { id: 'adults', title: 'adults' },
    { id: 'children', title: 'children' },
    { id: 'infants', title: 'infants' },
  ],
});

const bookingsByUserWriter = createCsvWriter({
  path: './db/cassandra/data/bookingsByUser.csv',
  header: [
    { id: 'booking_id', title: 'bookding_id' },
    { id: 'user_id', title: 'user_id' },
    { id: 'userName', title: 'username' },
    { id: 'password', title: 'password' },
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
    this.user_id = id;
    this.dateCreated = faker.date.between(2010, 2020);
    this.userName = faker.internet.userName();
    this.password = faker.internet.password();
  }
}

class Location {
  constructor(id, userId) {
    this.location_id = id;
    this.host_id = userId;
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
    this.yearLater = new Date(this.date.getTime() + (24 * 60 * 60 * 1000) * 90);
    this.duration = faker.random.number({ min: 1, max: 14 });
    this.booking_id = id;
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
const users = [];
const locations = [];
const bookings = [];
const bookingsByLocation = [];
const bookingsByUser = [];

const generateUsers = () => {
  for (let i = 0; i < USER_COUNT; i += 1) {
    users.push(new User(i));
    bar.increment();
  }
  return users;
};

const generateLocations = () => {
  for (let i = 0; i < LOCATION_COUNT; i += 1) {
    locations.push(new Location(i, faker.random.number({ min: 0, max: HOST_COUNT })));
    bar2.increment();
  }
  return locations;
};

const generateBookings = () => {
  for (let i = 0; i < BOOKING_COUNT; i += 1) {
    const newBooking = new Booking(
      i,
      faker.random.number({ min: 0, max: USER_COUNT }),
      faker.random.number({ min: 0, max: LOCATION_COUNT }),
    );
    bookings.push(newBooking);

    const newBookingWithLocation = _.assign({}, newBooking);
    _.assign(newBookingWithLocation, locations[newBooking.location_id]);
    bookingsByLocation.push(newBookingWithLocation);

    const newBookingWithUser = _.assign({}, newBooking);
    _.assign(newBookingWithUser, users[newBooking.user_id]);
    bookingsByUser.push(newBookingWithUser);

    bar3.increment();
  }
  return bookings;
};


const writeBookingsByUser = () => {
  if (multiplier !== 0) {
    multiplier -= 1;
    bookingsByUserWriter.writeRecords(bookingsByUser)
      .then(() => {
        writeBookingsByUser();
      });
  } else {
    console.log(`BookingsByUser written - ${Math.abs(startTime - new Date().getTime())}ms elapsed`);
    console.log(`${Math.abs(originalTime - new Date().getTime())}ms elapsed in total`);
  }
};

const writeBookingsByLocation = () => {
  if (multiplier !== 0) {
    multiplier -= 1;
    bookingsByLocationWriter.writeRecords(bookingsByLocation)
      .then(() => {
        writeBookingsByLocation();
      });
  } else {
    console.log(`BookingsByLocation written - ${Math.abs(startTime - new Date().getTime())}ms elapsed`);
    startTime = new Date();
    multiplier = multiplierStart;
    writeBookingsByUser();
  }
};

const writeBookings = () => {
  if (multiplier !== 0) {
    multiplier -= 1;
    const bookingsData = generateBookings();
    bookingWriter.writeRecords(bookingsData)
      .then(() => {
        writeBookings();
      });
  } else {
    bar3.stop();
    console.log(`Bookings written - ${Math.abs(startTime - new Date().getTime())}ms elapsed`);
    startTime = new Date();
    multiplier = multiplierStart;
    writeBookingsByLocation();
  }
};

const writeLocations = () => {
  if (multiplier !== 0) {
    multiplier -= 1;
    const locationsData = generateLocations();
    locationWriter.writeRecords(locationsData)
      .then(() => {
        writeLocations();
      });
  } else {
    bar2.stop();
    console.log(`Locations written - ${Math.abs(startTime - new Date().getTime())}ms elapsed`);
    startTime = new Date();
    multiplier = multiplierStart;
    bar3.start(BOOKING_COUNT * multiplierStart, 0);
    writeBookings();
  }
};

const writeUsers = () => {
  if (multiplier !== 0) {
    multiplier -= 1;
    const usersData = generateUsers();
    userWriter.writeRecords(usersData)
      .then(() => {
        writeUsers();
      });
  } else {
    bar.stop();
    console.log(`Users written - ${Math.abs(startTime - new Date().getTime())}ms elapsed`);
    startTime = new Date();
    multiplier = multiplierStart;
    bar2.start(LOCATION_COUNT * multiplierStart, 0);
    writeLocations();
  }
};

bar.start(USER_COUNT * multiplier, 0);
writeUsers();
