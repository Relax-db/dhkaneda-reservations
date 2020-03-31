const Models = require('./Models.js');

const getFirstReservations = (req, res) => {
  const { id } = req.query;
  Models.getFirstReservations(id, (err, data) => {
    if (err) {
      res.status(404).send();
    } else {
      res.status(200).send(data);
    }
  });
};

const getLocation = (req, res) => {
  const { id } = req.query;
  Models.getLocation(id, (err, data) => {
    if (err) {
      res.status(404).send('cant find');
    } else {
      res.send(data);
    }
  });
};

module.exports = { getFirstReservations, getLocation };
