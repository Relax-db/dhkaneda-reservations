/* eslint-disable no-console */
const Sequelize = require('sequelize');
const Promise = require('bluebird');

const database = 'reservation_service';
const user = 'dhkaneda';
const password = null;

const connection = new Sequelize(database, user, password, {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 9,
    min: 0,
    idle: 10000,
  },
});

const db = Promise.promisifyAll(connection, { multiArgs: true });

db.authenticate()
  .then(() => {
    console.log(`Connected to ${database}.`);
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = db;
