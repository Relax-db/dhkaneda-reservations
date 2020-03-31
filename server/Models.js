const db = require('../db');

const getFirstReservations = (id, callback) => {
  db.query(`SELECT * FROM reservations WHERE locationId = ${id}`, (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

const getLocation = (id, callback) => {
  db.query(`SELECT * FROM locations WHERE id = ${id}`, (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

module.exports = { getFirstReservations, getLocation };
