/* eslint-disable no-console */
require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const model = require('./models');
// const Bookings = require('./models/bookings');

const app = express();
const port = 3000;

app.use('/', express.static(path.resolve(__dirname, '../client/dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// // reservations
// app.get('/reservation/api/reservations', (req, res) => {
//   Controller.getFirstReservations(req, res);
// });

// // locations
// app.get('/reservation/api/location/', (req, res) => {
//   Controller.getLocation(req, res);
// });

// app.get('/*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
// });

app.get('/api/locations', (req, res) => {
  model.Bookings.getRandomOne()
    .then((booking) => {
      model.Locations.get({ locationid: booking.locationid })
        .then((location) => {
          res.send(location);
        })
        .catch((err) => {
          console.log(err);
        });
    });
});

app.get('/api/bookings', (req, res) => {
  model.Bookings.getRandomOne()
    .then((booking) => {
      model.Bookings.getAll({ locationid: booking.locationid })
        .then((bookings) => {
          res.send(bookings);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
