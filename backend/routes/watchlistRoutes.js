import express from "express";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../controllers/watchlistController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add a movie to watchlist
router.post("/", verifyToken, addToWatchlist);

// Get all movies in watchlist
router.get("/", verifyToken, getWatchlist);

// Remove a movie from watchlist
router.delete("/:id", verifyToken, removeFromWatchlist);

export default router;
