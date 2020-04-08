CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  dateCreated DATE,
  username VARCHAR(50),
  password VARCHAR(50)
);

CREATE TABLE locations (
  location_id SERIAL PRIMARY KEY,
  host_id INT,
  address VARCHAR(250),
  rate SMALLINT,
  avg_rating FLOAT,
  total_reviews SMALLINT,
  service_fee SMALLINT,
  cleaning_fee SMALLINT,
  occupancy_tax FLOAT
);

CREATE TABLE bookings (
  booking_id SERIAL PRIMARY KEY,
  user_id INT,
  location_id INT,
  checkin DATE,
  checkout DATE,
  total_cost INT,
  adults SMALLINT,
  children SMALLINT,
  infants SMALLINT
);

COPY users from '/Users/dhkaneda/Development/reservation-services/db/postgres/data/user.csv' (delimiter ',');

COPY locations from '/Users/dhkaneda/Development/reservation-services/db/postgres/data/locations.csv' (delimiter ',');

COPY bookings from '/Users/dhkaneda/Development/reservation-services/db/postgres/data/bookings.csv' (delimiter ',');

ALTER TABLE locations ADD CONSTRAINT fk1 FOREIGN KEY (host_id) REFERENCES users(user_id);

ALTER TABLE bookings ADD CONSTRAINT fk2 FOREIGN KEY (user_id) REFERENCES users(user_id);

ALTER TABLE bookings ADD CONSTRAINT fk3 FOREIGN KEY (location_id) REFERENCES locations(location_id);
