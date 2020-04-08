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
const BOOKING_COUNT = 200000; // 100000
const LOCATION_COUNT = BOOKING_COUNT / 2;

let multiplier = 100; // 100
const multiplierStart = multiplier;

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

class BookingByLocation {
  constructor(id, userId, hostId, locationId) {
    this.date = new Date();
    this.yearLater = new Date(this.date.getTime() + (24 * 60 * 60 * 1000) * 90);
    this.duration = faker.random.number({ min: 1, max: 14 });

    this.location_id = id;
    this.host_id = hostId;
    this.address = faker.fake('{{address.streetAddress}}, {{address.city}}, {{address.state}}');
    this.rate = faker.random.number({ min: 50, max: 300 });
    this.avg_rating = faker.random.number({ min: 1, max: 4 }) + Math.random();
    this.total_reviews = faker.random.number({ min: 1, max: 2000 });
    this.service_fee = faker.random.number({ min: 30, max: 50 });
    this.cleaning_fee = faker.random.number({ min: 10, max: 30 });
    this.occupancy_tax = this.rate * 0.15;

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

class BookingByUser {
  constructor(id, userId, locationId) {
    this.date = new Date();
    this.yearLater = new Date(this.date.getTime() + (24 * 60 * 60 * 1000) * 90);
    this.duration = faker.random.number({ min: 1, max: 14 });

    this.user_id = userId;
    this.dateCreated = faker.date.between(2010, 2020);
    this.userName = faker.internet.userName();
    this.password = faker.internet.password();

    this.booking_id = id;
    this.location_id = locationId;
    this.checkin = faker.date.between(this.date, this.yearLater);
    this.checkout = new Date(this.checkin.getTime() + (24 * 60 * 60 * 1000) * this.duration);
    this.total_cost = faker.random.number({ min: 50, max: 300 }) * this.duration;
    this.adults = faker.random.number({ min: 1, max: 7 });
    this.children = faker.random.number({ min: 0, max: 12 });
    this.infants = faker.random.number({ min: 0, max: 3 });
  }
}


const generateBookingsByLocation = () => {
  const bookingsByLocation = [];
  for (let i = 0; i < BOOKING_COUNT; i += 1) {
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

const generateBookingsByUser = () => {
  const bookingsByUser = [];
  for (let i = 0; i < BOOKING_COUNT; i += 1) {
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
    const bookingsByUser = generateBookingsByUser();
    bookingsByUserWriter.writeRecords(bookingsByUser)
      .then(() => {
        writeBookingsByUser();
      });
  } else {
    bar2.stop();
    console.log(`BookingsByUser written - ${Math.abs(startTime - new Date().getTime())}ms elapsed`);
    console.log(`${Math.abs(originalTime - new Date().getTime())}ms elapsed in total`);
  }
};

const writeBookingsByLocation = () => {
  if (multiplier !== 0) {
    multiplier -= 1;
    const bookingsByLocation = generateBookingsByLocation();
    bookingsByLocationWriter.writeRecords(bookingsByLocation)
      .then(() => {
        writeBookingsByLocation();
      });
  } else {
    console.log(`BookingsByLocation written - ${Math.abs(startTime - new Date().getTime())}ms elapsed`);
    startTime = new Date();
    multiplier = multiplierStart;
    bar2.start(BOOKING_COUNT * multiplierStart, 0);
    writeBookingsByUser();
  }
};

bar.start(BOOKING_COUNT * multiplier, 0);
writeBookingsByLocation();
