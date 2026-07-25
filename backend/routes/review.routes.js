const express = require("express");
const { review } = require("../controllers/review.controller.js");
const { optionalAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", optionalAuth, review);

module.exports = router;