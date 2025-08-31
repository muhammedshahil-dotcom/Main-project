import express from "express";
import { addReview, getReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add a review (protected route)
router.post("/", protect, addReview);

// Get all reviews for a movie
router.get("/:movieId", getReviews);

export default router;
