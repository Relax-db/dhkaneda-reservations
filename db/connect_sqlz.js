/* eslint-disable no-console */
const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres', 'dhkaneda', 'changelater', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 9,
    min: 0,
    idle: 10000,
  },
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection success!');
  })
  .catch((err) => {
    console.error(err);
  });
