const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { AppError, asyncHandler } = require("../utils/errorHandler");
const { MIN_PASSWORD_LENGTH } = require("../constants");

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists",
    });
  }

  // Create new user
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
  });

  // Return success response with token
  res.status(201).json({
    success: true,
    message: "Registration successful! Please log in.",
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and select password field
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Return success response with token
  res.json({
    success: true,
    message: "Login successful!",
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

module.exports = { register, login, getMe };
