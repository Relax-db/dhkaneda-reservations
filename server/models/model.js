const _ = require('lodash');
const db = require('../../db');

const executeQuery = (query, values) => {
  return db.queryAsync(query, values).spread((results) => results);
};

const parseData = (options) => {
  return _.reduce(options, (parsed, value, key) => {
    parsed.string.push(`${key} = ?`);
    parsed.values.push(value);
    return parsed;
  }, { string: [], values: [] });
};

class Model {
  constructor(tablename) {
    this.tablename = tablename;
  }

  getAll(options) {
    if (!options) {
      const queryString = `SELECT * FROM ${this.tablename}`;
      return executeQuery(queryString);
    }
    const parsedOptions = parseData(options);
    const queryString = `SELECT * FROM ${this.tablename} WHERE ${parsedOptions.string.join(' AND ')}`;
    return executeQuery(queryString, parsedOptions.values);
  }

  create(options) {
    const queryString = `INSERT INTO ${this.tablename} SET ?`;
    return executeQuery(queryString, options);
  }

  update(options, values) {
    const parsedOptions = parseData(options);
    const queryString = `UPDATE ${this.tablename} SET ? WHERE ${parsedOptions.string.join(' AND ')}`;
    return executeQuery(queryString, Array.prototype.concat(values, parsedOptions.values));
  }

  delete(options) {
    const parsedOptions = parseData(options);
    const queryString = `DELETE FROM ${this.tablename} WHERE ${parsedOptions.string.join(' AND ')}`;
    return executeQuery(queryString, parsedOptions.values);
  }

  deleteAll() {
    const queryString = `TRUNCATE TABLE ${this.tablename}`;
    return executeQuery(queryString);
  }
}

module.exports = Model;
