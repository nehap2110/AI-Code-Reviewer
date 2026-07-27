const History = require("../models/History");
const { asyncHandler } = require("../utils/errorHandler");
const { HISTORY_LIMIT } = require("../constants");

/**
 * Get user's review history (paginated)
 * GET /api/history?page=1&limit=50
 */
const getHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 50, HISTORY_LIMIT);
  const skip = (page - 1) * limit;

  // Fetch history items
  const [history, total] = await Promise.all([
    History.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-code -result"), // Exclude large fields for list view
    History.countDocuments({ user: req.user._id }),
  ]);

  res.json({
    success: true,
    history,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * Get a specific history item with full content
 * GET /api/history/:id
 */
const getHistoryItem = asyncHandler(async (req, res) => {
  const item = await History.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "History item not found",
    });
  }

  res.json({ success: true, item });
});

/**
 * Delete a history item
 * DELETE /api/history/:id
 */
const deleteHistoryItem = asyncHandler(async (req, res) => {
  const item = await History.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "History item not found",
    });
  }

  res.json({
    success: true,
    message: "History item deleted successfully",
  });
});

/**
 * Clear all history items for user
 * DELETE /api/history
 */
const clearHistory = asyncHandler(async (req, res) => {
  const result = await History.deleteMany({ user: req.user._id });

  res.json({
    success: true,
    message: `Deleted ${result.deletedCount} history items`,
    deletedCount: result.deletedCount,
  });
});

module.exports = { getHistory, getHistoryItem, deleteHistoryItem, clearHistory };
