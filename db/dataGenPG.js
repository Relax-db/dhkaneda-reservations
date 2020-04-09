/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const cliProgress = require('cli-progress');

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const bar2 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const bar3 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

let startTime = new Date().getTime();
const originalTime = new Date().getTime();
const USER_COUNT = 500000; // 500000
const HOST_COUNT = USER_COUNT * 0.06;
const BOOKING_COUNT = 200000; // 200000
const LOCATION_COUNT = BOOKING_COUNT / 2;

let elapsedWrites = 0;
let multiplier = 100; // 100`
const multiplierStart = multiplier;

const userWriter = createCsvWriter({
  path: './postgres/data/user.csv',
  header: ['userid', 'dateCreated', 'username', 'password'],
});

const locationWriter = createCsvWriter({
  path: './postgres/data/locations.csv',
  header: ['locationid', 'hostid', 'address', 'rate', 'avg_rating', 'total_reviews', 'service_fee', 'cleaning_fee', 'occupancy_tax'],
});

const bookingWriter = createCsvWriter({
  path: './postgres/data/bookings.csv',
  header: ['bookingid', 'userid', 'locationid', 'checkin', 'checkout', 'total_cost', 'adults', 'children', 'infants'],
});


class User {
  constructor(id) {
    this.userid = id;
    this.dateCreated = faker.date.between(2010, 2020);
    this.username = faker.internet.userName();
    this.password = faker.internet.password();
  }
}

class Location {
  constructor(id, userId) {
    this.locationid = id;
    this.hostid = userId;
    this.address = faker.fake('{{address.streetAddress}}');
    this.rate = faker.random.number({ min: 50, max: 300 });
    this.avg_rating = Math.round(((faker.random.number({ min: 1, max: 4 }) + Math.random()) * 10) / 10);
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
    this.bookingid = id;
    this.userid = userId;
    this.locationid = locationId;
    this.checkin = faker.date.between(this.date, this.yearLater);
    this.checkout = new Date(this.checkin.getTime() + (24 * 60 * 60 * 1000) * this.duration);
    this.total_cost = faker.random.number({ min: 50, max: 300 }) * this.duration;
    this.adults = faker.random.number({ min: 1, max: 7 });
    this.children = faker.random.number({ min: 0, max: 12 });
    this.infants = faker.random.number({ min: 0, max: 3 });
  }
}


const generateUsers = (elapsedMult) => {
  let startIndex = 0;
  startIndex += USER_COUNT * elapsedMult;

  let endIndex = USER_COUNT;
  endIndex += USER_COUNT * elapsedMult;

  const users = [];
  for (let i = startIndex; i < endIndex; i += 1) {
    users.push(new User(i));
    bar.increment();
  }
  return users;
};

const generateLocations = (elapsedMult) => {
  let startIndex = 0;
  startIndex += LOCATION_COUNT * elapsedMult;

  let endIndex = LOCATION_COUNT;
  endIndex += LOCATION_COUNT * elapsedMult;

  const locations = [];
  for (let i = startIndex; i < endIndex; i += 1) {
    locations.push(new Location(i, faker.random.number({ min: 0, max: HOST_COUNT * multiplier })));
    bar2.increment();
  }
  return locations;
};

const generateBookings = (elapsedMult) => {
  let startIndex = 0;
  startIndex += BOOKING_COUNT * elapsedMult;

  let endIndex = BOOKING_COUNT;
  endIndex += BOOKING_COUNT * elapsedMult;

  const bookings = [];
  for (let i = startIndex; i < endIndex; i += 1) {
    const newBooking = new Booking(
      i,
      faker.random.number({ min: 0, max: USER_COUNT * multiplier }),
      faker.random.number({ min: 0, max: LOCATION_COUNT * multiplier }),
    );
    bookings.push(newBooking);
    bar3.increment();
  }
  return bookings;
};


const writeBookings = () => {
  if (multiplier !== 0) {
    multiplier -= 1;
    const bookingsData = generateBookings(elapsedWrites);
    elapsedWrites += 1;
    bookingWriter.writeRecords(bookingsData)
      .then(() => {
        writeBookings();
      });
  } else {
    bar3.stop();
    elapsedWrites = 0;
    console.log(`Bookings written - ${Math.abs(startTime - new Date().getTime())}ms elapsed`);
    console.log(`${Math.abs(originalTime - new Date().getTime())}ms elapsed in total`);
  }
};

const writeLocations = () => {
  if (multiplier !== 0) {
    multiplier -= 1;
    const locationsData = generateLocations(elapsedWrites);
    elapsedWrites += 1;
    locationWriter.writeRecords(locationsData)
      .then(() => {
        writeLocations();
      });
  } else {
    bar2.stop();
    elapsedWrites = 0;
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
    const usersData = generateUsers(elapsedWrites);
    elapsedWrites += 1;
    userWriter.writeRecords(usersData)
      .then(() => {
        writeUsers();
      });
  } else {
    bar.stop();
    elapsedWrites = 0;
    console.log(`Users written - ${Math.abs(startTime - new Date().getTime())}ms elapsed`);
    startTime = new Date();
    multiplier = multiplierStart;
    bar2.start(LOCATION_COUNT * multiplierStart, 0);
    writeLocations();
  }
};

bar.start(USER_COUNT * multiplier, 0);
writeUsers();
