/**
 * errorHandler.js
 * Centralized error-handling middleware. Must be registered
 * last, after all routes, so Express routes thrown/next(err)
 * errors here.
 */
const { error } = require('../utils/apiResponse');

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} ->`, err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return error(res, statusCode, message, err.errors || []);
}

/**
 * notFound
 * Handles requests to undefined routes with a clean 404 JSON payload.
 */
function notFound(req, res) {
  return error(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}

module.exports = { errorHandler, notFound };
