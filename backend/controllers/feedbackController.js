import Feedback from "../models/Feedback.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";

export const addFeedback = asyncHandler(async (req, res) => {
  const { message, rating, movieId } = req.body;

  if (!message || !movieId) {
    throw new AppError("message and movieId are required", 400);
  }

  const feedback = await Feedback.create({
    message,
    rating,
    user: req.user.id,
    movie: movieId,
  });

  res.status(201).json({
    success: true,
    message: "Feedback added successfully",
    feedback,
  });
});

export const getFeedbacks = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find()
    .populate("user", "name email")
    .populate("movie", "title")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ success: true, data: feedbacks });
});
