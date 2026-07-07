/**
 * apiResponse.js
 * ------------------------------------------------------
 * Standardized JSON response shape across the entire API.
 * Ensures every endpoint responds consistently, which makes
 * the frontend and Postman tests predictable.
 * ------------------------------------------------------
 */

function success(res, statusCode = 200, message = 'Success', data = null, meta = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  });
}

function error(res, statusCode = 500, message = 'Something went wrong', errors = []) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
}

module.exports = { success, error };
