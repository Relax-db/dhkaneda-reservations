CREATE TABLE users (
  userid INT PRIMARY KEY,
  dateCreated VARCHAR(250),
  username VARCHAR(50),
  password VARCHAR(50)
);

CREATE TABLE locations (
  locationid INT PRIMARY KEY,
  hostid INT,
  locationaddress VARCHAR(250),
  rate SMALLINT,
  avg_rating FLOAT,
  total_reviews SMALLINT,
  service_fee SMALLINT,
  cleaning_fee SMALLINT,
  occupancy_tax FLOAT
);

CREATE TABLE bookings (
  bookingid INT PRIMARY KEY,
  userid INT,
  locationid INT,
  checkin VARCHAR(250),
  checkout VARCHAR(250),
  total_cost INT,
  adults SMALLINT,
  children SMALLINT,
  infants SMALLINT
);

COPY users from '/Users/dhkaneda/Development/reservation-services/db/postgres/data/user.csv' (delimiter ',');

COPY locations from '/Users/dhkaneda/Development/reservation-services/db/postgres/data/locations.csv' (delimiter ',');

COPY bookings from '/Users/dhkaneda/Development/reservation-services/db/postgres/data/bookings.csv' (delimiter ',');

ALTER TABLE locations ADD CONSTRAINT fk1 FOREIGN KEY (hostid) REFERENCES users(userid);

ALTER TABLE bookings ADD CONSTRAINT fk2 FOREIGN KEY (userid) REFERENCES users(userid);

ALTER TABLE bookings ADD CONSTRAINT fk3 FOREIGN KEY (locationid) REFERENCES locations(locationid);
