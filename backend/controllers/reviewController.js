import Review from "../models/Review.js";
import Movie from "../models/Movie.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";

const recalcMovieRating = async (movieId) => {
  const reviews = await Review.find({ movie: movieId }).select("rating").lean();
  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  await Movie.findByIdAndUpdate(movieId, { rating: Number(avg.toFixed(1)) });
};

export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);
  if (!movie) throw new AppError("Movie not found", 404);

  const parsedRating = Number(rating);
  if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }

  if (!comment || !String(comment).trim()) {
    throw new AppError("Comment is required", 400);
  }

  const review = await Review.create({
    movie: movieId,
    user: req.user.id,
    rating: parsedRating,
    comment,
  });

  await recalcMovieRating(movieId);

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    review,
  });
});

export const getReviewsByMovie = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ movie: req.params.movieId })
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ success: true, data: reviews });
});

export const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError("Review not found", 404);

  const isOwner = review.user.toString() === req.user.id;
  if (!isOwner && req.user.role !== "admin") {
    throw new AppError("Not allowed to edit this review", 403);
  }

  if (rating !== undefined) {
    const parsedRating = Number(rating);
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }
    review.rating = parsedRating;
  }

  if (comment !== undefined) {
    if (!String(comment).trim()) throw new AppError("Comment is required", 400);
    review.comment = comment;
  }

  await review.save();
  await recalcMovieRating(review.movie);

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    review,
  });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError("Review not found", 404);

  const isOwner = review.user.toString() === req.user.id;
  if (!isOwner && req.user.role !== "admin") {
    throw new AppError("Not allowed to delete this review", 403);
  }

  const movieId = review.movie;
  await review.deleteOne();
  await recalcMovieRating(movieId);

  res.status(200).json({ success: true, message: "Review deleted successfully" });
});
