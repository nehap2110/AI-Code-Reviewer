const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { getHistory, getHistoryItem, deleteHistoryItem } = require("../controllers/history.controller");

const router = express.Router();

router.use(protect); // everything below requires login

router.get("/", getHistory);
router.get("/:id", getHistoryItem);
router.delete("/:id", deleteHistoryItem);

module.exports = router;