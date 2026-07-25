const History = require("../models/History");

const getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .select("-code -result"); // list view stays light; full content fetched per-item

    res.json({ success: true, history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not fetch history" });
  }
};

const getHistoryItem = async (req, res) => {
  try {
    const item = await History.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ success: false, message: "History item not found" });
    res.json({ success: true, item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not fetch history item" });
  }
};

const deleteHistoryItem = async (req, res) => {
  try {
    const item = await History.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ success: false, message: "History item not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not delete history item" });
  }
};

module.exports = { getHistory, getHistoryItem, deleteHistoryItem };