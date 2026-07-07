/**
 * db.js
 * ------------------------------------------------------
 * Lightweight JSON-file "database" utility.
 * Provides safe, synchronous-feeling async read/write access
 * to server/data/db.json so controllers never touch fs directly.
 * ------------------------------------------------------
 */

const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

/**
 * Reads and parses the entire JSON database.
 * @returns {Promise<Object>} the parsed database object
 */
async function readDB() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to read database: ${err.message}`);
  }
}

/**
 * Persists the given data object back to db.json.
 * @param {Object} data - full database object to persist
 */
async function writeDB(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    throw new Error(`Failed to write database: ${err.message}`);
  }
}

/**
 * Returns a specific collection (array) from the database.
 * @param {string} key - collection name e.g. "destinations"
 */
async function getCollection(key) {
  const db = await readDB();
  return db[key] || [];
}

/**
 * Replaces a specific collection in the database and saves it.
 * @param {string} key - collection name
 * @param {Array} value - new array value
 */
async function setCollection(key, value) {
  const db = await readDB();
  db[key] = value;
  await writeDB(db);
  return value;
}

/**
 * Generates a simple unique id with a given prefix.
 * @param {string} prefix
 */
function generateId(prefix = 'id') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

module.exports = {
  readDB,
  writeDB,
  getCollection,
  setCollection,
  generateId,
};
