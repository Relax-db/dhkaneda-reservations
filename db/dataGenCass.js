/* eslint-disable max-classes-per-file */
const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const cliProgress = require('cli-progress');

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const bar2 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

let startTime = new Date().getTime();
const originalTime = new Date().getTime();
const USER_COUNT = 500000; // 500000
const HOST_COUNT = USER_COUNT * 0.06;
const BOOKING_COUNT = 200000; // 200000
const LOCATION_COUNT = BOOKING_COUNT / 2;

let elapsedWrites = 0;
let multiplier = 20; // 100
const multiplierStart = multiplier;

const bookingsByLocationWriter = createCsvWriter({
  path: './cassandra/data/bookingsByLocation.csv',
  header: ['bookingid', 'userid', 'locationid', 'hostid','address', 'rate', 'avg_rating', 'total_reviews', 'service_fee', 'cleaning_fee', 'occupancy_tax', 'checkin', 'checkout', 'total_cost', 'adults', 'children', 'infants'],
});

const bookingsByUserWriter = createCsvWriter({
  path: './cassandra/data/bookingsByUser.csv',
  header: ['bookingid', 'userid', 'username', 'password', 'locationid', 'checkin', 'checkout', 'total_cost', 'adults', 'children', 'infants'],
});

class BookingByLocation {
  constructor(id, userId, hostId, locationId) {
    this.date = new Date();
    this.yearLater = new Date(this.date.getTime() + (24 * 60 * 60 * 1000) * 90);
    this.duration = faker.random.number({ min: 1, max: 14 });

    this.locationid = id;
    this.hostid = hostId;
    this.address = faker.fake('{{address.streetAddress}}');
    this.rate = faker.random.number({ min: 50, max: 300 });
    this.avg_rating = Math.round(((faker.random.number({ min: 1, max: 4 }) + Math.random()) * 10) / 10);
    this.total_reviews = faker.random.number({ min: 1, max: 2000 });
    this.service_fee = faker.random.number({ min: 30, max: 50 });
    this.cleaning_fee = faker.random.number({ min: 10, max: 30 });
    this.occupancy_tax = this.rate * 0.15;

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

class BookingByUser {
  constructor(id, userId, locationId) {
    this.date = new Date();
    this.yearLater = new Date(this.date.getTime() + (24 * 60 * 60 * 1000) * 90);
    this.duration = faker.random.number({ min: 1, max: 14 });

    this.userid = userId;
    this.dateCreated = faker.date.between(2010, 2020);
    this.username = faker.internet.userName();
    this.password = faker.internet.password();

    this.bookingid = id;
    this.locationid = locationId;
    this.checkin = faker.date.between(this.date, this.yearLater);
    this.checkout = new Date(this.checkin.getTime() + (24 * 60 * 60 * 1000) * this.duration);
    this.total_cost = faker.random.number({ min: 50, max: 300 }) * this.duration;
    this.adults = faker.random.number({ min: 1, max: 7 });
    this.children = faker.random.number({ min: 0, max: 12 });
    this.infants = faker.random.number({ min: 0, max: 3 });
  }
}


const generateBookingsByLocation = (elapsedMult) => {
  let startIndex = 0;
  startIndex += BOOKING_COUNT * elapsedMult;

  let endIndex = BOOKING_COUNT;
  endIndex += BOOKING_COUNT * elapsedMult;

  const bookingsByLocation = [];
  for (let i = startIndex; i < endIndex; i += 1) {
    const newBookingByLocation = new BookingByLocation(
      i,
      faker.random.number({ min: 0, max: USER_COUNT }),
      faker.random.number({ min: 0, max: HOST_COUNT }),
      faker.random.number({ min: 0, max: LOCATION_COUNT }),
    );
    bookingsByLocation.push(newBookingByLocation);
    bar.increment();
  }
  return bookingsByLocation;
};

const generateBookingsByUser = (elapsedMult) => {
  let startIndex = 0;
  startIndex += BOOKING_COUNT * elapsedMult;

  let endIndex = BOOKING_COUNT;
  endIndex += BOOKING_COUNT * elapsedMult;

  const bookingsByUser = [];
  for (let i = startIndex; i < endIndex; i += 1) {
    const newBookingByUser = new BookingByUser(
      i,
      faker.random.number({ min: 0, max: USER_COUNT }),
      faker.random.number({ min: 0, max: LOCATION_COUNT }),
    );
    bookingsByUser.push(newBookingByUser);
    bar2.increment();
  }
  return bookingsByUser;
};


const writeBookingsByUser = () => {
  if (multiplier !== 0) {
    multiplier -= 1;
    const bookingsByUser = generateBookingsByUser(elapsedWrites);
    elapsedWrites += 1;
    bookingsByUserWriter.writeRecords(bookingsByUser)
      .then(() => {
        writeBookingsByUser();
      });
  } else {
    bar2.stop();
    elapsedWrites = 0;
    console.log(`BookingsByUser written - ${Math.abs(startTime - new Date().getTime())}ms elapsed`);
    console.log(`${Math.abs(originalTime - new Date().getTime())}ms elapsed in total`);
  }
};

const writeBookingsByLocation = () => {
  if (multiplier !== 0) {
    multiplier -= 1;
    const bookingsByLocation = generateBookingsByLocation(elapsedWrites);
    elapsedWrites += 1;
    bookingsByLocationWriter.writeRecords(bookingsByLocation)
      .then(() => {
        writeBookingsByLocation();
      });
  } else {
    bar.stop();
    elapsedWrites = 0;
    console.log(`BookingsByLocation written - ${Math.abs(startTime - new Date().getTime())}ms elapsed`);
    startTime = new Date();
    multiplier = multiplierStart;
    bar2.start(BOOKING_COUNT * multiplierStart, 0);
    writeBookingsByUser();
  }
};

bar.start(BOOKING_COUNT * multiplier, 0);
writeBookingsByLocation();
