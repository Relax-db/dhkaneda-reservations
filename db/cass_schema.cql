
CREATE KEYSPACE booking WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};

CREATE TABLE booking.location (
  host_id
  location_id uuid,
  address text,
  rate number,
  service fee number,
  cleaning fee number,
  occupancy tax number
  booking_id uuid,
  checkin date,
  checkout date,
  price number,
  user_id uuid,
  PRIMARY KEY ((location_id), checkin) WITH CLUSTERING ORDER BY (checkin ASC)
) WITH comment = ‘Q1. Find bookings by location’;

CREATE TABLE booking.user (
  user_id UUID,
  username text,
  password text,
  salt text,
  location_id uuid,
  booking_id uuid,
  checkin date,
  checkout date,
  price number,
  PRIMARY KEY (user_id)
) WITH comment = ‘Q2. Find users with locations & bookings’;



