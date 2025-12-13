import express from "express";
import { addReview, getReviewsByMovie } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add revieie
router.post("/:movieId", protect, addReview);

// Get reviews for movie
router.get("/movie/:movieId", getReviewsByMovie);

export default router;
