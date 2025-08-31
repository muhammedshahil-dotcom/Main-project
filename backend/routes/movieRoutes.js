import express from "express";
import upload from "../middleware/uploadMiddleware.js";

import { addMovie, getMovies } from "../controllers/movieController.js";

const router = express.Router();

// Add a movie with poster upload
router.post("/", upload.single("poster"), addMovie);

// Get all movies
router.get("/", getMovies);

export default router;