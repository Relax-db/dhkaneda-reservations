const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123', // TODO! Fill in password to your personal mysql password
  database: 'relaxly',
});

connection.connect();
// connection.query('SELECT 1 +1 AS solution', (error, results) => {
//   if (error) {
//     throw error;
//   }
//   console.log('The solution is: ', results[0].solution);
// });

module.exports = connection;
