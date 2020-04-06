const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: './data/locations.csv',
  header: [
    { id: 'id', title: 'id' },
  ],
});

// const address = faker.fake('{{address.streetAddress}}, {{address.city}}, {{address.state}}');
// const zipCode = faker.address.zipCode().slice(0, 5);
// const onMarket = faker.random.boolean();
// const sqft = faker.random.number({ min: 500, max: 8000 });
// const bedCount = faker.random.number({ min: 1, max: 10 });
// const bathCount = faker.random.number({ min: 1, max: 10 });
// const listingValue = faker.random.number({ min: 200000, max: 3000000 });

const locations = [];
const quantity = 10;

const generateData = () => {
  for (let i = 1; i <= quantity; i += 1) {
    const location = {
      id: i,
    };

    locations.push(location);
  }
  return locations;
};

const startTime = new Date().getTime();
csvWriter.writeRecords(generateData())
  .then(() => {
    const endTime = new Date().getTime();
    console.log(`Time elaped: ${endTime - startTime}ms`);
    console.log('Write sucess!');
  }).catch((error) => {
    console.log(error);
  });
