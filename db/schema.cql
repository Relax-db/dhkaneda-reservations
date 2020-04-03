CREATE KEYSPACE location WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

CREATE TYPE location.address (
  street text,
  city text,
  state text,
  zip text,
  country text
);

CREATE TABLE location.users (
  user_id uuid PRIMARY KEY,
  location_id  uuid,
  address frozen<address>,
  rate number,
  service fee number,
  cleaning fee number,
  occupancy tax number
) WITH comment = ‘Q1. Find information about a location’;

CREATE KEYSPACE booking WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

CREATE TABLE booking.locations (
  location_id uuid,
  booking_id uuid,
  checkin date,
  checkout date,
  price number,
  user_id uuid,
  PRIMARY KEY ((location_id), booking_id) WITH CLUSTERING ORDER BY (checkin ASC)
) WITH comment = ‘Q2. Find bookings by location’;