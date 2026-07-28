/**
 * API Error Handler Utility
 * Centralized error handling for consistent error responses
 */

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const handleError = (error, res) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  console.error(`[${statusCode}] ${message}`, error);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: error.stack }),
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { AppError, handleError, asyncHandler };
