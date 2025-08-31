import Watchlist from "../models/Watchlist.js";

// Add movie to watchlist
export const addToWatchlist = async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    const item = await Watchlist.create({ userId: userId, movieId: movieId });

    res.status(201).json({ message: "Movie added to watchlist", item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get watchlist for a user
export const getWatchlist = async (req, res) => {
  try {
    const items = await Watchlist.find()
      .populate("user", "name email")
      .populate("movie", "title");

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove movie from watchlist
export const removeFromWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    await Watchlist.findByIdAndDelete(id);
    res.json({ message: "Movie removed from watchlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
