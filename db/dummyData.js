/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
const db = require('./index.js');

// random num between range, takes in a max and a min
const randRange = (min, max) => Math.floor((Math.random() * (max - min)) + min);

// 100 homes seeder
const seedLocations = () => {
  for (let i = 0; i < 100; i++) {
    let rate = randRange(20, 100);
    let reviewAvg = (Math.random() * 5).toFixed(2);
    let totalReview = randRange(50, 200);
    let serviceFee = randRange(5, 10);
    let occupancyTax = randRange(1, 8);

    db.query(`INSERT INTO locations (rate, review_avg, total_review, service_fee, occupancy_tax) VALUES (${rate}, ${reviewAvg}, ${totalReview}, ${serviceFee}, ${occupancyTax})`, (err) => {
      if (err) {
        throw err;
      }
    });
  }
};


// 5 to 10 reservations per home
const seedReservations = () => {
  for (let i = 1; i <= 100; i++) {
    for (let j = 0; j < Math.floor((Math.random() * 5) + 5); j++) {
      let checkin = `2020-${j + 1}-${randRange(1, 14)}`;
      let checkout = `2020-${j + 1}-${randRange(15, 28)}`;
      let adults = randRange(1, 5);
      let children = randRange(0, 5);
      let infants = randRange(0, 5);
      db.query(`INSERT INTO reservations (checkin_date, checkout_date, adults, children, infants, locationId) VALUES ('${checkin}', '${checkout}', ${adults}, ${children}, ${infants}, ${i})`);
    }
  }
  db.query('UPDATE reservations INNER JOIN locations ON reservations.locationId = locations.id SET price = locations.rate * DATEDIFF(reservations.checkout_date, reservations.checkin_date)');
  console.log('SEEDED');
};


seedLocations();
seedReservations();
