const express = require("express");
const {
  createSavedReview,
  getSavedReviews,
  getSavedReview,
  updateSavedReview,
  deleteSavedReview,
} = require("../controllers/saved.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Every saved-review route requires a logged-in user
router.use(protect);

router.post("/", createSavedReview);
router.get("/", getSavedReviews);
router.get("/:id", getSavedReview);
router.patch("/:id", updateSavedReview);
router.delete("/:id", deleteSavedReview);

module.exports = router;
