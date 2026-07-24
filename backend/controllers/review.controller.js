const { reviewCode, ACTIONS } = require("../services/ai.service.js");

const VALID_ACTIONS = Object.values(ACTIONS);

const review = async (req, res) => {
  try {
    const { code, language, action } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "code is required",
      });
    }

    const selectedAction = action || ACTIONS.REVIEW;

    if (!VALID_ACTIONS.includes(selectedAction)) {
      return res.status(400).json({
        success: false,
        message: `Invalid action "${selectedAction}". Must be one of: ${VALID_ACTIONS.join(", ")}`,
      });
    }

    const result = await reviewCode({
      code,
      language: language || "javascript",
      action: selectedAction,
    });

    res.json({
      success: true,
      review: result,
      action: selectedAction,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while generating the review.",
    });
  }
};

module.exports = { review };