import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {addMovie, getMovies, deleteMovie, } from "../controllers/movieController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all movies
router.get("/", getMovies);

// Add a movie 
router.post("/", protect, upload.single("poster"), addMovie);

// Delete a movie 
router.delete("/:id", protect, deleteMovie);

export default router;
