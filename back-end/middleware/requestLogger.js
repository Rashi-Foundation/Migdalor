const logger = require("../utils/logger");

// Middleware to log all incoming requests
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Override res.json to capture response status
  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - start;
    const status = res.statusCode;

    // Create a simple message based on the route and status
    let message = "";
    if (duration > 1000) {
      message = `(slow: ${duration}ms)`;
    }

    // Log the request
    logger.logRoute(req.method, req.path, status, message);

    // Call original json method
    return originalJson.call(this, data);
  };

  // Override res.status to capture status codes
  const originalStatus = res.status;
  res.status = function (code) {
    const duration = Date.now() - start;
    let message = "";
    if (duration > 1000) {
      message = `(slow: ${duration}ms)`;
    }

    // Log the request
    logger.logRoute(req.method, req.path, code, message);

    return originalStatus.call(this, code);
  };

  next();
};

module.exports = requestLogger;
