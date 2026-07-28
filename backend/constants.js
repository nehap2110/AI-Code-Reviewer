/**
 * Backend Configuration Constants
 */

module.exports = {
  // Code validation
  MAX_CODE_SIZE: 50 * 1024, // 50KB
  MIN_CODE_SIZE: 1,
  
  // Password policy
  MIN_PASSWORD_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  
  // Rate limiting
  RATE_LIMIT: {
    AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    AUTH_MAX_REQUESTS: 20,
    REVIEW_WINDOW_MS: 60 * 60 * 1000, // 1 hour
    REVIEW_MAX_REQUESTS: 50,
  },
  
  // JWT
  JWT_DEFAULT_EXPIRES: '7d',
  
  // History
  HISTORY_LIMIT: 100,
  HISTORY_PREVIEW_LENGTH: 60,
};
