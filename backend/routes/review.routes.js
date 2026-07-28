const express = require("express");
const { review } = require("../controllers/review.controller.js");
const { optionalAuth } = require("../middleware/auth.middleware");
const { reviewLimiter } = require("../middleware/rateLimiter");
const { validateReview } = require("../middleware/validation");

const router = express.Router();

// POST /api/review - Submit code for review
router.post("/", reviewLimiter, optionalAuth, validateReview, review);

module.exports = router;
