DROP KEYSPACE IF EXISTS bookings;

CREATE KEYSPACE IF NOT EXISTS bookings
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 3};

USE bookings;

CREATE TABLE locations (
  bookingid int,
  userid int,
  locationid int,
  hostid int,
  address text,
  rate int,
  avg_rating float,
  total_reviews int,
  service_fee int,
  cleaning_fee int,
  occupancy_tax float,
  checkin text,
  checkout text,
  total_cost int,
  adults int,
  children int,
  infants int,
  PRIMARY KEY (locationid, checkin)
);

CREATE TABLE users (
  bookingid int,
  userid int,
  username text,
  password text,
  locationid int,
  checkin text,
  checkout text,
  total_cost INT,
  adults int,
  children int,
  infants int,
  PRIMARY KEY (userid)
);

COPY locations (bookingid, userid, locationid, hostid,address, rate, avg_rating, total_reviews, service_fee, cleaning_fee, occupancy_tax, checkin, checkout, total_cost, adults, children, infants) FROM '/Users/dhkaneda/Development/reservation-services/db/cassandra/data/bookingsByLocation.csv';

COPY users (bookingid, userid, username, password, locationid, checkin, checkout, total_cost, adults, children, infants) FROM '/Users/dhkaneda/Development/reservation-services/db/cassandra/data/bookingsByUser.csv';