/* eslint-disable no-console */
const Sequelize = require('sequelize');
const Promise = require('bluebird');

const database = 'reservation_service';
const user = 'dhkaneda';
const password = 'changelater';

const db = new Sequelize(database, user, password, {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 9,
    min: 0,
    idle: 10000,
  },
});

db.authenticate()
  .then(() => {
    console.log(`Connected to ${database}.`);
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = db;
