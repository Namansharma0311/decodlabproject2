/**
 * Newsletter.js
 * Data-access layer for the "newsletter" collection.
 */
const { getCollection, setCollection, generateId } = require('../utils/db');

async function exists(email) {
  const list = await getCollection('newsletter');
  return list.some((entry) => entry.email.toLowerCase() === email.toLowerCase());
}

async function subscribe(email) {
  const list = await getCollection('newsletter');
  const entry = {
    id: generateId('sub'),
    email,
    subscribedAt: new Date().toISOString(),
  };
  list.push(entry);
  await setCollection('newsletter', list);
  return entry;
}

module.exports = { exists, subscribe };
