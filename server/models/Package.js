/**
 * Package.js
 * Data-access layer for the "packages" collection.
 */
const { getCollection } = require('../utils/db');

async function findAll() {
  return getCollection('packages');
}

module.exports = { findAll };
