# Relaxly Reservation Module

> A reservation module that allows users to select dates to reserve for a stay at a location in the Relaxly app.

## Related Projects

  - https://github.com/Relax-ly/Header-images
  - https://github.com/Relax-ly/reviews-service
  - https://github.com/Relax-ly/related-homes

## Table of Contents

1. [Requirements](#requirements)
1. [Development](#development)
1. [Usage](#Usage)
1. [API](#API)

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```
## Usage
### To Run App - Once Dependencies Installed

All occurs from within the root directory:

-go to reservation-services/db/index.js to change mysql password

Create mysql tables
```sh
mysql -u root -p < ./db/schema.sql
```
Seed your database with seeding script:

```sh
npm run seed
```
Build react app with script:

```sh
npm run react-dev
```
Run server:

```sh
npm start
```
> Point browser to http://localhost:3000/ to view app module


## Module API

### Create a location listing
#### Request Method and URL
```
POST /api/reservations/locations
```
#### Parameters
The request body `data` includes up to **7** properties pertaining to details for the location listing
| Name | Type | Description |
| ---- | ---- | ----------- |
| data | object | **Required** The data of the new database record. Should include the properties described below.  |

#### Data Properties
All properties are **Required** except for `cleaning_fee` and `occupancy_tax`

| Name | Type | Description |
| --- | --- | --- |
| `location` | `string` | Reflects the address, city, and country |
| `rate` | `number` | Reflects the base cost of the location per night |
| `avg_rating`  | `number` | Reflects the average review rating of the location (decimal between 0 and 5.0) |
| `total_reviews` | `number` | Reflects the total number of reviews related to the location |
| `service_fee` | `number` | Reflects the base service fee to be added to the total checkout price |
| [`cleaning_fee`] | [`number`] | Reflects the base cleaning fee to be added to the total checkout price |
| [`occupancy_tax`] | [`number`] | Reflects the location based percentage tax charged for the reservation (decimal between 0 and 0.2) |

#### Example input data
```
{
  "location": "123 Outback Drive, Sydney, Australia",
  "rate": 59,
  "avg_rating": 4.89,
  "total_reviews": 79,
  "service_fee": 42,
  "cleaning_fee": null,
  "occupancy_tax": 0.15
}
```

#### Reponse:
```
Status: 200 Created
Location: /api/reservations/location/:location_id
```

```
Status: 403 Forbidden
Error: Listing already exists
Location: /api/reservations/location/:location_id
```

```
Status: 401 Forbidden
Error: Unauthorized request
```


## Create a reservation

#### Request Method and URL
```
POST /api/reservations/locations/:location_id/reservations
```
#### Parameters
The request body `data` includes up to **7** properties pertaining to details for the location listing
| Name | Type | Description |
| ---- | ---- | ----------- |
| data | object | **Required** The data of the new database record. Should include the properties described below.  |

#### Data Properties
All properties are **Required** except for `children` and `infants`

| Name | Type | Description |
| --- | --- | --- |
| `location_id` | `number` | Refers to the location with which the reservation will be associated |
| `price` | `number` | Reflects the total calculated price of the reservation |
| `checkin` | `date` | Reflects the check in date of the reservation |
| `checkout` | `date` | Reflects the check out date of the reservation |
| `adults` | `number` | Reflects the number adults associated with the reservation |
| [`children`] | [`number`] | Reflects the number children associated with the reservation |
| [`infants`] | [`number`] | Reflects the number infants associated with the reservation |

#### Example input data
```
{
  "location_id": 00001,
  "price": 1549,
  "checkin": "Wed Apr 01 2020 11:02:47 GMT-0700 (Pacific Daylight Time)",
  "checkout": "Wed Apr 03 2020 11:02:47 GMT-0700 (Pacific Daylight Time)",
  "adults": 2,
  "children": null,
  "infants": 1,
}
```

#### Reponse:
```
Status: 200 Created
Location: /api/reservations/location/:location_id/reservations/:reservation_id
```
```
Status: 404 Forbidden
Error: Listing does not exist
Location: /api/reservations/location/:location_id
```
```
Status: 403 Forbidden
Error: Reservation already exists
Location: /api/reservations/location/:location_id/reservations/:reservation_id
```
```
Status: 401 Forbidden
Error: Unauthorized request
```


## Get location listing(s)

#### Request Method and URL
```
GET /api/reservations/locations/:location_id
```
#### Response
The response body will be an `object` upon success. Example responses shown below.
```
Status: 200 OK
Body: {
    "location": "123 Outback Drive, Sydney, Australia",
  "rate": 59,
  "avg_rating": 4.89,
  "total_reviews": 79,
  "service_fee": 42,
  "cleaning_fee": null,
  "occupancy_tax": 0.15
}
```
```
Status: 404 Forbidden
Error: Listing does not exist
Location: /api/reservations/location/:location_id
```
```
Status: 401 Forbidden
Error: Unauthorized request
```

## Get reservation(s)
#### Request Method and URL
```
GET /api/reservations/locations/:location_id/reservations
```
#### Response
The response body will be an `object` upon success. Example responses shown below.
```
Status: 200 OK
Body: {
  "location_id": 00001,
  "price": 1549,
  "checkin": "Wed Apr 01 2020 11:02:47 GMT-0700 (Pacific Daylight Time)",
  "checkout": "Wed Apr 03 2020 11:02:47 GMT-0700 (Pacific Daylight Time)",
  "adults": 2,
  "children": null,
  "infants": 1,
}
```
```
Status: 404 Forbidden
Error: Listing does not exist
Location: /api/reservations/location/:location_id
```
```
Status: 401 Forbidden
Error: Unauthorized request
```

### Update

```
PATCH /api/reservations/locations/:location_id
```

```
PATCH /api/reservations/locations/:location_id/reservations/:reservation_id
```

### Delete

```
DELETE /api/reservations/locations/:location_id
```

```
DELETE /api/reservations/locations/:location_id/reservations/:reservation_id
```