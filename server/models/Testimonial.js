/**
 * Testimonial.js
 * Data-access layer for the "testimonials" collection.
 */
const { getCollection } = require('../utils/db');

async function findAll() {
  return getCollection('testimonials');
}

module.exports = { findAll };
