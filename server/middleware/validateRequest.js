/**
 * validateRequest.js
 * Generic middleware that inspects express-validator results.
 * If validation errors exist, short-circuits with a 400 response
 * in the project's standard error shape.
 */
const { validationResult } = require('express-validator');
const { error } = require('../utils/apiResponse');

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return error(res, 400, 'Validation failed', formatted);
  }
  next();
}

module.exports = validateRequest;
