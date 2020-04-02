# Relaxly Booking Module

> A booking module that allows users to select dates to reserve for a stay at a location in the Relaxly app.

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

-go to booking-services/db/index.js to change mysql password

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


## API

### Create a listing
#### Request Method and URL
```
POST /api/locations
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
| `host_id` | `number` | Reflects the user id of the host  |
| `location` | `string` | Reflects the address, city, and country |
| `rate` | `number` | Reflects the base cost of the location per night |
| [`cleaning_fee`] | [`number`] | Reflects the base cleaning fee to be added to the total checkout price |
| [`occupancy_tax`] | [`number`] | Reflects the location based percentage tax charged for the booking (decimal between 0 and 0.2) |

#### Example input data
```
{
  "host_id" : 0000013
  "location": "123 Outback Drive, Sydney, Australia",
  "rate": 59,
  "cleaning_fee": null,
  "occupancy_tax": 0.15
}
```

#### Reponse:
```
Status: 201 Created
Location: /api/locations:location_id
```

```
Status: 403 Forbidden
Error: Listing already exists
Location: /api/locations/:location_id
```

```
Status: 401 Forbidden
Error: Unauthorized request
```


## Create a booking

#### Request Method and URL
```
POST /api/locations/:location_id/bookings
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
| `user_id` | `number` | Refers to the user making the booking |
| `location_id` | `number` | Refers to the location with which the booking will be associated |
| `price` | `number` | Reflects the total calculated price of the booking |
| `checkin` | `date` | Reflects the check in date of the booking |
| `checkout` | `date` | Reflects the check out date of the booking |
| `adults` | `number` | Reflects the number adults associated with the booking |
| [`children`] | [`number`] | Reflects the number children associated with the booking |
| [`infants`] | [`number`] | Reflects the number infants associated with the booking |

#### Example input data
```
{
  "user_id": 000034,
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
Status: 201 Created
Location: /api/locations/:location_id/bookings/:booking_id
```
```
Status: 404 Forbidden
Error: Listing does not exist
Location: /api/locations/:location_id
```
```
Status: 403 Forbidden
Error: booking already exists
Location: /api/location/:location_id/bookings/:booking_id
```
```
Status: 401 Forbidden
Error: Unauthorized request
```


### Get location listing details

#### Request Method and URL
```
GET /locations/:location_id
```
#### Response
The response body will be an `object` upon success. Example responses shown below.
```
Status: 200 OK
Body: {
  "host_id": 0000013,
  "location_id": 000034,
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
Location: /api/location/:location_id
```
```
Status: 401 Forbidden
Error: Unauthorized request
```

### Get booking(s) from listing
#### Request Method and URL
```
GET /api/:location_id/bookings
```
#### Response
The response body will be an `list of objects` upon success. Example responses shown below.
```
Status: 200 OK
Body: [{
  "booking_id": 000003
  "user_id": 000034
  "location_id": 00001,
  "price": 1549,
  "checkin": "Wed Apr 01 2020 11:02:47 GMT-0700 (Pacific Daylight Time)",
  "checkout": "Wed Apr 03 2020 11:02:47 GMT-0700 (Pacific Daylight Time)",
  "adults": 2,
  "children": null,
  "infants": 1,
},
{
  "booking_id": 000004
  "user_id": 000036
  "location_id": 00002,
  "price": 719,
  "checkin": "Wed Apr 04 2020 11:02:47 GMT-0700 (Pacific Daylight Time)",
  "checkout": "Wed Apr 06 2020 11:02:47 GMT-0700 (Pacific Daylight Time)",
  "adults": 4,
  "children": 6,
  "infants": null, 
}]
```
```
Status: 404 Forbidden
Error: Listing does not exist
Location: /api/locations/:location_id
```
```
Status: 401 Forbidden
Error: Unauthorized request
```

### Update location listing details
#### Request Method and URL
```
PATCH /api/locations/:location_id
```
#### Parameters
The request body data will include the field in the document to be updated. Only the fields included will be updated, and will replace the existing document's corresponding field with the new value.

Omitted fields will keep their original values.
| Name | Type | Description |
| ---- | ---- | ----------- |
| data | object | **Required** The data of the updated database record. Should include the properties described below that need to be updated.  |

#### Data Properties
At least one of the properties described below should be included with the **required** `host_id` and `location_id`.

| Name | Type | Description |
| --- | --- | --- |
| `host_id` | `number` | **Required** Reflects the unique id of the host for verification|
| `location_id` | `number` | **Required** Reflects the unique id of the location|
| [`location`] | [`string`] | Reflects the address, city, and country |
| [`rate`] | [`number`] | Reflects the base cost of the location per night |
| [`avg_rating`]  | [`number`] | Reflects the average review rating of the location (decimal between 0 and 5.0) |
| [`total_reviews`] | [`number`] | Reflects the total number of reviews related to the location |
| [`service_fee`] | `number` | Reflects the base service fee to be added to the total checkout price |
| [`cleaning_fee`] | [`number`] | Reflects the base cleaning fee to be added to the total checkout price |
| [`occupancy_tax`] | [`number`] | Reflects the location based percentage tax charged for the booking (decimal between 0 and 0.2) |

#### Example input data
```
{
  "host_id": 0000012
  "location_id": 000034
  "location": "124 Outback Drive, Sydney, Australia",
  "rate": 68,
  "avg_rating": 3.40,
}
```

#### Reponse:
```
Status: 200 OK
Location: /api/bookings/location/:location_id
Updated Record: {
  "location_id": 00001,
  "location": "124 Outback Drive, Sydney, Australia",
  "rate": 68,
  "avg_rating": 3.40,
  "total_reviews": 79,
  "service_fee": 42,
  "cleaning_fee": null,
  "occupancy_tax": 0.15
}
```
```
Status: 404 Forbidden
Error: Listing does not exist
Location: /api/bookings/location/:location_id
```
```
Status: 401 Forbidden
Error: Unauthorized request
```
### Update booking details
#### Request Method and URL
```
PATCH /api/bookings/:booking_id
```
#### Parameters
The request body data will include the field in the document to be updated. Only the fields included will be updated, and will replace the existing document's corresponding field with the new value.

Omitted fields will keep their original values.
| Name | Type | Description |
| ---- | ---- | ----------- |
| data | object | **Required** The data of the updated database record. Should include the properties described below that need to be updated.  |

#### Data Properties
At least one of the properties described below should be included with the **required** `user_id` and `booking_id`.

| Name | Type | Description |
| --- | --- | --- |
| `user_id` | `number` | **Required** Reflects the unique id of the user for verification|
| `booking_id` | `number` | **Required** Reflects the unique id of the booking|
| [`location_id`] | [`number`] | Refers to the location with which the booking will be associated |
| [`price`] | [`number`] | Reflects the total calculated price of the booking |
| [`checkin`] | [`date`] | Reflects the check in date of the booking |
| [`checkout`] | [`date`] | Reflects the check out date of the booking |
| [`adults`] | [`number`] | Reflects the number adults associated with the booking |
| [`children`] | [`number`] | Reflects the number children associated with the booking |
| [`infants`] | [`number`] | Reflects the number infants associated with the booking |

#### Example input data
```
{
  "user_id": 000012,
  "booking_id": 000001,
  "price": 1949,
  "checkin": "Wed Apr 01 2020 11:02:47 GMT-0700 (Pacific Daylight Time)",
  "checkout": "Wed Apr 05 2020 11:02:47 GMT-0700 (Pacific Daylight Time)",
}
```

#### Reponse:
```
Status: 200 OK
Location: /api/bookings/:booking_id
Updated Record: {
  "user_id": 000012,
  "booking_id": 000001,
  "location_id": 00001,
  "price": 1949,
  "checkin": "Wed Apr 01 2020 11:02:47 GMT-0700 (Pacific Daylight Time)",
  "checkout": "Wed Apr 05 2020 11:02:47 GMT-0700 (Pacific Daylight Time)",
  "adults": 2,
  "children": null,
  "infants": 1,
}
```
```
Status: 404 Forbidden
Error: booking does not exist
Location: /api/bookings/location/:location_id/bookings/:booking_id
```
```
Status: 401 Forbidden
Error: Unauthorized request
```

### Delete a location listing
#### Request Method and URL
```
DELETE /api/locations/:location_id
```
#### Parameters
The request body data will include the field in the document to be updated. Only the fields included will be updated, and will replace the existing document's corresponding field with the new value.

Omitted fields will keep their original values.
| Name | Type | Description |
| ---- | ---- | ----------- |
| data | object | **Required** The data of the updated database record. Should include the properties described below that need to be updated.  |

#### Data Properties
At least one of the properties described below should be included with the **required** `host_id` and `location_id`.

| Name | Type | Description |
| --- | --- | --- |
| `host_id` | `number` | **Required** Reflects the unique id of the host for verification|
| `location_id` | `number` | **Required** Reflects the unique id of the location|

#### Reponse:
```
Status: 200 OK
Location and associated bookings deleted: /locations/:location_id
```
```
Status: 404 Forbidden
Error: Listing does not exist
Location: /api/bookings/location/:location_id
```
```
Status: 401 Forbidden
Error: Unauthorized request
```

### Delete a booking
#### Request Method and URL
```
DELETE /api/bookings/:booking_id
```
#### Parameters
The request body data will include the field in the document to be updated. Only the fields included will be updated, and will replace the existing document's corresponding field with the new value.

Omitted fields will keep their original values.
| Name | Type | Description |
| ---- | ---- | ----------- |
| data | object | **Required** The data of the updated database record. Should include the properties described below that need to be updated.  |

#### Data Properties
At least one of the properties described below should be included with the **required** `user_id` and `booking_id`.

| Name | Type | Description |
| --- | --- | --- |
| `user_id` | `number` | **Required** Reflects the unique id of the user for verification|
| `booking_id` | `number` | **Required** Reflects the unique id of the booking|

#### Reponse:
```
Status: 200 OK
booking deleted: /api/locations/:location_id/bookings/:booking_id
```
```
Status: 404 Forbidden
Error: booking does not exist
Location: /api/bookings/location/:location_id/bookings/:booking_id
```
```
Status: 401 Forbidden
Error: Unauthorized request
```