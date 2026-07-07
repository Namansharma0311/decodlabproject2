/**
 * timestamp.js
 * Attaches a request timestamp to every incoming request.
 * Useful for auditing and for including in responses/logs.
 */
function timestamp(req, res, next) {
  req.requestTime = new Date().toISOString();
  res.setHeader('X-Request-Timestamp', req.requestTime);
  next();
}

module.exports = timestamp;
