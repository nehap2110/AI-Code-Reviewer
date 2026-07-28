/**
 * Shared error-handling utilities.
 *
 * AppError   - throw this for expected/operational errors (bad input, not found, etc.)
 *              with a specific HTTP status code.
 * asyncHandler - wraps an async route/controller so rejected promises are
 *              forwarded to Express's error-handling middleware instead of
 *              crashing the process or hanging the request.
 * errorMiddleware - final Express error handler, mounted last in server.js.
 */

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid identifier" });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    return res.status(400).json({ success: false, message });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "This record already exists" });
  }

  const statusCode = err.statusCode || 500;
  const message =
    err.isOperational || statusCode < 500 ? err.message : "Something went wrong. Please try again.";

  res.status(statusCode).json({ success: false, message });
};

module.exports = { AppError, asyncHandler, errorMiddleware };
