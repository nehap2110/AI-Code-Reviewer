const express = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  getStats,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { authLimiter } = require("../middleware/rateLimiter");
const { validateRegister, validateLogin } = require("../middleware/validation");

const router = express.Router();

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);
router.patch("/password", protect, updatePassword);
router.get("/stats", protect, getStats);

module.exports = router;
