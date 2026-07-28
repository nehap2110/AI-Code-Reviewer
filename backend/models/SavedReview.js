const mongoose = require("mongoose");

// Manually saved reviews. Unlike History (which logs every run automatically),
// a SavedReview only exists because the user explicitly clicked "Save".
const savedReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, trim: true, default: "" }, // user-editable label; falls back to preview on the client
    code: { type: String, required: true },
    language: { type: String, required: true },
    action: { type: String, required: true },
    result: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedReview", savedReviewSchema);
