/**
 * Booking.js
 * Data-access layer for the "bookings" collection.
 */
const { getCollection, setCollection, generateId } = require('../utils/db');

async function create({ destination, email, checkIn, checkOut, persons, budget }) {
  const bookings = await getCollection('bookings');
  const entry = {
    id: generateId('booking'),
    destination,
    email,
    checkIn,
    checkOut,
    persons,
    budget,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  bookings.push(entry);
  await setCollection('bookings', bookings);
  return entry;
}

module.exports = { create };
