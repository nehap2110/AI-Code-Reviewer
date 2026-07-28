/**
 * Central constants for the backend.
 * Keeping these in one place avoids magic numbers scattered across
 * controllers/middleware and makes limits easy to tune.
 */

const MIN_PASSWORD_LENGTH = 8;

const MIN_CODE_SIZE = 3; // characters
const MAX_CODE_SIZE = 50000; // characters (~50kb of source) - keeps AI calls fast & affordable

const HISTORY_LIMIT = 100; // max page size for /api/history
const HISTORY_PREVIEW_LENGTH = 120; // characters kept for the list-view preview

const SAVED_REVIEWS_LIMIT = 100; // max page size for /api/saved

const RATE_LIMIT = {
  AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  AUTH_MAX_REQUESTS: 20,
  REVIEW_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  REVIEW_MAX_REQUESTS: 40,
};

// Supported languages <-> file extensions, shared by validation and file-upload detection
const LANGUAGE_EXTENSIONS = {
  javascript: [".js", ".jsx", ".mjs", ".cjs"],
  typescript: [".ts", ".tsx"],
  python: [".py"],
  java: [".java"],
  cpp: [".cpp", ".cc", ".cxx", ".hpp", ".h"],
  c: [".c"],
  ruby: [".rb"],
  go: [".go"],
  rust: [".rs"],
};

const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_EXTENSIONS);

const MAX_UPLOAD_FILE_SIZE = 300 * 1024; // 300kb

module.exports = {
  MIN_PASSWORD_LENGTH,
  MIN_CODE_SIZE,
  MAX_CODE_SIZE,
  HISTORY_LIMIT,
  HISTORY_PREVIEW_LENGTH,
  SAVED_REVIEWS_LIMIT,
  RATE_LIMIT,
  LANGUAGE_EXTENSIONS,
  SUPPORTED_LANGUAGES,
  MAX_UPLOAD_FILE_SIZE,
};
