/**
 * Destination.js
 * Data-access layer for the "destinations" collection.
 */
const { getCollection } = require('../utils/db');

async function findAll() {
  return getCollection('destinations');
}

async function findById(id) {
  const destinations = await getCollection('destinations');
  return destinations.find((d) => d.id === id) || null;
}

module.exports = { findAll, findById };
