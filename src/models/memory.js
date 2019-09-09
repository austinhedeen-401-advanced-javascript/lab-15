'use strict';

const uuid = require('uuid/v4');

/** Class representing a generic in-memory model.
 *
 *  Acknowledgements: Thanks to Vinicio Sanchez and Code Fellows for providing
 *  this interface.
 */
class Model {

  /**
   * Model Constructor - initializes data array
   */
  constructor() {
    this.database = [];
  }

  /**
   * Retrieves one or more records
   * @param id {string} optional record id
   * @returns {*}
   */
  get(id) {
    let response = id ? this.database.filter((record) => record.id === id) : this.database;
    return Promise.resolve(response);
  }

  /**
   * Create a new record
   * @param entry {object} matches the format of the schema
   * @returns {*}
   */
  create(entry) {
    entry.id = uuid();
    let record = this.sanitize(entry);
    if (record.id) { this.database.push(record); }
    return Promise.resolve(record);
  }

  /**
   * Replaces a record in the database
   * @param id {string} Record ID
   * @param entry {object} The record data to replace. ID is a required field
   * @returns {*}
   */
  update(id, entry) {
    let record = this.sanitize(entry);
    if (record.id) { this.database = this.database.map((item) => (item.id === id) ? record : item); }
    return Promise.resolve(record);
  }

  /**
   * Deletes a record in the model
   * @param id {string} Record ID
   * @returns {*}
   */
  delete(id) {
    this.database = this.database.filter((record) => record.id !== id);
    return Promise.resolve();
  }

  /**
   * Validates a record entry to verify schema matching
   * @param entry - The record data to sanitize
   * @returns {boolean}
   */
  sanitize(entry) {

    let valid = true;
    let record = {};
    let schema = this.schema();

    Object.keys(schema).forEach(field => {
      if (schema[field].required) {
        if (entry[field]) {
          record[field] = entry[field];
        } else {
          valid = false;
        }
      }
      else {
        record[field] = entry[field];
      }
    });

    return valid ? record : undefined;
  }

}

module.exports = Model;
