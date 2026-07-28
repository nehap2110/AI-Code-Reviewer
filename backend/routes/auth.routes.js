const express = require("express");
const { register, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { authLimiter } = require("../middleware/rateLimiter");
const { validateRegister, validateLogin } = require("../middleware/validation");

const router = express.Router();

// POST /api/auth/register - User registration
router.post("/register", authLimiter, validateRegister, register);

// POST /api/auth/login - User login
router.post("/login", authLimiter, validateLogin, login);

// GET /api/auth/me - Get authenticated user
router.get("/me", protect, getMe);

module.exports = router;
