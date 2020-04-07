DROP KEYSPACE IF EXISTS bookings;

CREATE KEYSPACE IF NOT EXISTS bookings
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 3};

USE bookings;

CREATE TABLE locations (
  host_id int,
  user_id int,

  location_id int,
  address text,
  rate int,
  avg_rating float,
  total_reviews int,
  service_fee int,
  cleaning_fee int,
  occupancy_tax int,

  booking_id int,
  checkin date,
  checkout date,
  total_cost int,
  adults int,
  children int,
  infants int,
  PRIMARY KEY (location_id, checkin)
) WITH CLUSTERING ORDER BY (checkin ASC);

CREATE TABLE users (
  user_id int,
  username varchar,
  password varchar,
  location_id int,
  booking_id int,
  checkin date,
  checkout date,
  total_cost INT,
  adults int,
  children int,
  infants int,
  PRIMARY KEY (user_id)
);