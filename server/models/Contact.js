/**
 * Contact.js
 * Data-access layer for the "contacts" collection.
 */
const { getCollection, setCollection, generateId } = require('../utils/db');

async function create({ name, email, phone, message }) {
  const contacts = await getCollection('contacts');
  const entry = {
    id: generateId('contact'),
    name,
    email,
    phone,
    message,
    createdAt: new Date().toISOString(),
  };
  contacts.push(entry);
  await setCollection('contacts', contacts);
  return entry;
}

module.exports = { create };
