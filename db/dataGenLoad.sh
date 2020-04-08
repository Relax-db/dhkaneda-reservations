echo "Generating 50,000,000 users, 5,000,000 locations, and 10,000,000 bookings"
node --max-old-space-size=8192 dataGenPG.js

echo "Seeding users, locations, and bookings to reservation_service in PostgreSQL DB"
psql < ./postgres/pg_schema_down.sql
psql -d reservation_service < ./postgres/pg_schema_up.sql

echo "Generating 20,000,000 bookings by location and 20,000,000 bookings by user"
node --max-old-space-size=8192 dataGenCASS.js

echo "Seeding bookings to reservation_service in Cassandra DB"
cqlsh < ./cassandra/cass_schema.sql


