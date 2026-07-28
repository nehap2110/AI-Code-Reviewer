const SavedReview = require("../models/SavedReview");
const { asyncHandler, AppError } = require("../utils/errorHandler");
const { SAVED_REVIEWS_LIMIT } = require("../constants");

/**
 * Save a review the user explicitly wants to keep
 * POST /api/saved
 */
const createSavedReview = asyncHandler(async (req, res) => {
  const { title, code, language, action, result } = req.body;

  if (!code || !language || !action || !result) {
    throw new AppError("code, language, action, and result are all required", 400);
  }

  const saved = await SavedReview.create({
    user: req.user._id,
    title: (title || "").trim(),
    code,
    language,
    action,
    result,
  });

  res.status(201).json({ success: true, message: "Review saved!", saved });
});

/**
 * List the user's saved reviews (paginated)
 * GET /api/saved?page=1&limit=50
 */
const getSavedReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 50, SAVED_REVIEWS_LIMIT);
  const skip = (page - 1) * limit;

  const [saved, total] = await Promise.all([
    SavedReview.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-code -result"),
    SavedReview.countDocuments({ user: req.user._id }),
  ]);

  res.json({
    success: true,
    saved,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

/**
 * Get a single saved review with full content
 * GET /api/saved/:id
 */
const getSavedReview = asyncHandler(async (req, res) => {
  const item = await SavedReview.findOne({ _id: req.params.id, user: req.user._id });

  if (!item) {
    throw new AppError("Saved review not found", 404);
  }

  res.json({ success: true, item });
});

/**
 * Rename a saved review
 * PATCH /api/saved/:id
 */
const updateSavedReview = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const item = await SavedReview.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { title: (title || "").trim() },
    { new: true }
  );

  if (!item) {
    throw new AppError("Saved review not found", 404);
  }

  res.json({ success: true, item });
});

/**
 * Delete a saved review
 * DELETE /api/saved/:id
 */
const deleteSavedReview = asyncHandler(async (req, res) => {
  const item = await SavedReview.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!item) {
    throw new AppError("Saved review not found", 404);
  }

  res.json({ success: true, message: "Saved review deleted" });
});

module.exports = {
  createSavedReview,
  getSavedReviews,
  getSavedReview,
  updateSavedReview,
  deleteSavedReview,
};
