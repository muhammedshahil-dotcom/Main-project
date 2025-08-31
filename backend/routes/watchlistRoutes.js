import express from "express";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../controllers/watchlistController.js";

const router = express.Router();

// Add a movie to watchlist
router.post("/", addToWatchlist);

// Get all movies in watchlist
router.get("/", getWatchlist);

// Remove a movie from watchlist
router.delete("/:id", removeFromWatchlist);

export default router;
