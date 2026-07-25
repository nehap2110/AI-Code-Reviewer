const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    code: { type: String, required: true },
    preview: { type: String, required: true }, // first line, truncated — keeps list view light
    language: { type: String, required: true },
    action: { type: String, required: true },
    result: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);