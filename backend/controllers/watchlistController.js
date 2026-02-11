import Watchlist from "../models/Watchlist.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";

export const addToWatchlist = asyncHandler(async (req, res) => {
  const { movieId } = req.body;
  if (!movieId) throw new AppError("movieId is required", 400);

  const existing = await Watchlist.findOne({ userId: req.user.id, movieId });
  if (existing) throw new AppError("Movie already in watchlist", 409);

  const item = await Watchlist.create({ userId: req.user.id, movieId });
  res.status(201).json({ success: true, message: "Movie added to watchlist", item });
});

export const getWatchlist = asyncHandler(async (req, res) => {
  const items = await Watchlist.find({ userId: req.user.id })
    .populate("movieId", "title posterUrl genre rating")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ success: true, data: items });
});

export const removeFromWatchlist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Watchlist.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!item) throw new AppError("Watchlist item not found", 404);
  res.status(200).json({ success: true, message: "Movie removed from watchlist" });
});
