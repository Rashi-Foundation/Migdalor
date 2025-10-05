const { validationResult } = require("express-validator");

// Collect validation errors from express-validator chains
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const details = errors
    .array({ onlyFirstError: true })
    .map((e) => ({ field: e.path, message: e.msg }));

  return res.status(400).json({
    success: false,
    message: "Validation failed",
    details,
  });
}

module.exports = { validate };
