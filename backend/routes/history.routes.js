const express = require("express");
const { getHistory, getHistoryItem, deleteHistoryItem, clearHistory } = require("../controllers/history.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// All history routes require authentication
router.use(protect);

// GET /api/history - Get user's history (paginated)
router.get("/", getHistory);

// DELETE /api/history - Clear all history
router.delete("/", clearHistory);

// GET /api/history/:id - Get specific history item
router.get("/:id", getHistoryItem);

// DELETE /api/history/:id - Delete specific history item
router.delete("/:id", deleteHistoryItem);

module.exports = router;
