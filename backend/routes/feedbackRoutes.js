import express from "express";
import { addFeedback, getFeedbacks } from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected feedback add
router.post("/", protect, addFeedback);

// Public get all feedback
router.get("/", getFeedbacks);

export default router;
