const rateLimit = require("express-rate-limit");
const { RATE_LIMIT } = require("../constants");

/**
 * Auth endpoints rate limiter
 * Prevents brute force attacks on login/register
 */
const authLimiter = rateLimit({
  windowMs: RATE_LIMIT.AUTH_WINDOW_MS,
  max: RATE_LIMIT.AUTH_MAX_REQUESTS,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Review endpoints rate limiter
 * Prevents AI API quota abuse
 */
const reviewLimiter = rateLimit({
  windowMs: RATE_LIMIT.REVIEW_WINDOW_MS,
  max: RATE_LIMIT.REVIEW_MAX_REQUESTS,
  message: {
    success: false,
    message: "Too many review requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user?.isAdmin, // Admins bypass rate limit
});

module.exports = { authLimiter, reviewLimiter };
