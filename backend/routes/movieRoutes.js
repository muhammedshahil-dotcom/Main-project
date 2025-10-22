import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  addMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

const router = express.Router();

// Public
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

// Admin routes
router.post("/", protect, admin, upload.single("poster"), addMovie);
router.put("/:id", protect, admin, upload.single("poster"), updateMovie);
router.delete("/:id", protect, admin, deleteMovie);

export default router;
