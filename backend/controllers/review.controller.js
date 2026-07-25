const { reviewCode, ACTIONS } = require("../services/ai.service.js");
const History = require("../models/History");

const VALID_ACTIONS = Object.values(ACTIONS);
const buildPreview = (code) => code.trim().split("\n")[0].slice(0, 60);

const review = async (req, res) => {
  try {
    const { code, language, action } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: "code is required" });
    }

    const selectedAction = action || ACTIONS.REVIEW;
    if (!VALID_ACTIONS.includes(selectedAction)) {
      return res.status(400).json({
        success: false,
        message: `Invalid action "${selectedAction}". Must be one of: ${VALID_ACTIONS.join(", ")}`,
      });
    }

    const result = await reviewCode({ code, language: language || "javascript", action: selectedAction });

    // Guests still get full reviewer access — history just isn't persisted for them
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

    res.json({ success: true, review: result, action: selectedAction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong while generating the review." });
  }
};

module.exports = { review };