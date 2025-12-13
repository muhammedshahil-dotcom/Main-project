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

// Public Routes
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

// Admin Routes
router.post("/",
  protect,
  admin,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "gallery", maxCount: 10 }
  ]),
  addMovie
);

router.put(
  "/:id",
  protect,
  admin,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
    { name: "banner", maxCount: 1 }
  ]),
  updateMovie
);

router.delete("/:id", protect, admin, deleteMovie);

export default router;
