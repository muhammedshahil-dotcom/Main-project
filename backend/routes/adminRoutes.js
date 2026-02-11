import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import {
  addMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";
import {
  getDashboardStats,
  getAdminMovies,
  getAdminReviews,
  getAdminUsers,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(verifyToken, verifyAdmin);

router.get("/stats", getDashboardStats);
router.get("/movies", getAdminMovies);
router.get("/reviews", getAdminReviews);
router.get("/users", getAdminUsers);

router.post(
  "/movies",
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  addMovie
);

router.put(
  "/movies/:id",
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  updateMovie
);

router.delete("/movies/:id", deleteMovie);

export default router;
