const User = require("../models/User");
const History = require("../models/History");
const SavedReview = require("../models/SavedReview");
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
      theme: req.user.theme,
      createdAt: req.user.createdAt,
    },
  });
});

/**
 * Update profile fields (display name and/or theme preference)
 * PATCH /api/auth/profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, theme } = req.body;
  const updates = {};

  if (name !== undefined) {
    if (!name.trim()) {
      throw new AppError("Name cannot be empty", 400);
    }
    updates.name = name.trim();
  }

  if (theme !== undefined) {
    if (!["light", "dark"].includes(theme)) {
      throw new AppError('Theme must be "light" or "dark"', 400);
    }
    updates.theme = theme;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Profile updated",
    user: { id: user._id, name: user.name, email: user.email, theme: user.theme },
  });
});

/**
 * Change password
 * PATCH /api/auth/password
 */
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError("Current and new password are both required", 400);
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(`New password must be at least ${MIN_PASSWORD_LENGTH} characters`, 400);
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = newPassword; // pre-save hook re-hashes it
  await user.save();

  res.json({ success: true, message: "Password updated successfully" });
});

/**
 * Lightweight usage stats for the dashboard home page
 * GET /api/auth/stats
 */
const getStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [totalReviews, totalSaved, actionBreakdown, languageBreakdown] = await Promise.all([
    History.countDocuments({ user: userId }),
    SavedReview.countDocuments({ user: userId }),
    History.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$action", count: { $sum: 1 } } },
    ]),
    History.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$language", count: { $sum: 1 } } },
    ]),
  ]);

  res.json({
    success: true,
    stats: {
      totalReviews,
      totalSaved,
      byAction: Object.fromEntries(actionBreakdown.map((a) => [a._id, a.count])),
      byLanguage: Object.fromEntries(languageBreakdown.map((l) => [l._id, l.count])),
    },
  });
});

module.exports = { register, login, getMe, updateProfile, updatePassword, getStats };
