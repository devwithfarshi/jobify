/**
 * Custom error class for handling API errors.
 *
 * @param {number} statusCode - The HTTP status code.
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @param {string} [stack] - The error stack trace.
 */
function ApiError(statusCode, message, errors = [], stack) {
  Error.call(this, message);
  this.statusCode = statusCode;
  this.message = message || "Something went wrong";
  this.success = false;
  this.errors = errors;

  if (stack) {
    this.stack = stack;
  } else {
    Error.captureStackTrace(this, this.constructor);
  }
}

ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

/**
 * Creates a new ApiError instance with the specified status code and message.
 *
 * @param {number} statusCode - The HTTP status code.
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @returns {ApiError} - A new ApiError instance.
 */
ApiError.createError = function (statusCode, message, errors = []) {
  return new ApiError(statusCode, message, errors);
};

/**
 * Creates a bad request error (HTTP 400).
 *
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @returns {ApiError} - A new ApiError instance.
 */
ApiError.badRequest = function (message, errors = []) {
  return ApiError.createError(400, message, errors);
};

/**
 * Creates a not found error (HTTP 404).
 *
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @returns {ApiError} - A new ApiError instance.
 */
ApiError.notFound = function (message, errors = []) {
  return ApiError.createError(404, message, errors);
};

/**
 * Creates a forbidden error (HTTP 403).
 *
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @returns {ApiError} - A new ApiError instance.
 */
ApiError.forbidden = function (message, errors = []) {
  return ApiError.createError(403, message, errors);
};

/**
 * Creates an unauthorized error (HTTP 401).
 *
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @returns {ApiError} - A new ApiError instance.
 */
ApiError.unauthorized = function (message, errors = []) {
  return ApiError.createError(401, message, errors);
};

/**
 * Creates a conflict error (HTTP 409).
 *
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @returns {ApiError} - A new ApiError instance.
 */
ApiError.conflict = function (message, errors = []) {
  return ApiError.createError(409, message, errors);
};

/**
 * Creates an internal server error (HTTP 500).
 *
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @returns {ApiError} - A new ApiError instance.
 */
ApiError.internal = function (message, errors = []) {
  return ApiError.createError(500, message, errors);
};

module.exports = ApiError;
