import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalMovies, totalReviews] = await Promise.all([
    User.countDocuments(),
    Movie.countDocuments(),
    Review.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: { totalUsers, totalMovies, totalReviews },
  });
});

export const getAdminMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find().sort({ createdAt: -1 }).lean();
  res.status(200).json({ success: true, data: movies });
});

export const getAdminReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("user", "name email role")
    .populate("movie", "title")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ success: true, data: reviews });
});

export const getAdminUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
  res.status(200).json({ success: true, data: users });
});
