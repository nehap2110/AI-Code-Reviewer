const { reviewCode, ACTIONS } = require("../services/ai.service.js");
const History = require("../models/History");
const { asyncHandler } = require("../utils/errorHandler");
const { HISTORY_PREVIEW_LENGTH } = require("../constants");

const VALID_ACTIONS = Object.values(ACTIONS);

/**
 * Build code preview from first line
 */
const buildPreview = (code) => code.trim().split("\n")[0].slice(0, HISTORY_PREVIEW_LENGTH);

/**
 * Submit code for AI review
 * POST /api/review
 */
const review = asyncHandler(async (req, res) => {
  const { code, language, action } = req.body;

  // Validate action
  const selectedAction = action || ACTIONS.REVIEW;
  if (!VALID_ACTIONS.includes(selectedAction)) {
    return res.status(400).json({
      success: false,
      message: `Invalid action "${selectedAction}". Must be one of: ${VALID_ACTIONS.join(", ")}`,
    });
  }

  // Call AI service
  const result = await reviewCode({
    code,
    language: language || "javascript",
    action: selectedAction,
  });

  // Save to history if user is authenticated
  if (req.user) {
    await History.create({
      user: req.user._id,
      code,
      preview: buildPreview(code),
      language: language || "javascript",
      action: selectedAction,
      result,
    });
  }

  // Return success response
  res.json({
    success: true,
    review: result,
    action: selectedAction,
    saved: !!req.user,
  });
});

module.exports = { review };
