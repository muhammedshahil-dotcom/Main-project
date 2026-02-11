import express from "express";
import {
  addReview,
  getReviewsByMovie,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:movieId", verifyToken, addReview);
router.get("/movie/:movieId", getReviewsByMovie);
router.put("/:id", verifyToken, updateReview);
router.delete("/:id", verifyToken, deleteReview);

export default router;
