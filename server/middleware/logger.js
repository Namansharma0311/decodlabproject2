/**
 * logger.js
 * Custom request logger middleware.
 * Logs method, path, status code and response time for every request.
 */
function logger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const stamp = new Date().toISOString();
    console.log(`[${stamp}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
}

module.exports = logger;
