import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import { getAllUsers, deleteUser } from "../controllers/userController.js";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Backward-compatible auth aliases.
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);

export default router;
