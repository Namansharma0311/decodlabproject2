/**
 * Review.js
 * Data-access layer for the "reviews" collection.
 */
const { getCollection, setCollection, generateId } = require('../utils/db');

async function create({ rating, review, name }) {
  const reviews = await getCollection('reviews');
  const entry = {
    id: generateId('review'),
    rating,
    review,
    name,
    createdAt: new Date().toISOString(),
  };
  reviews.push(entry);
  await setCollection('reviews', reviews);
  return entry;
}

async function findAll() {
  return getCollection('reviews');
}

module.exports = { create, findAll };
