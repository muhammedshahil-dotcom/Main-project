import express from "express";
import { registerUser, loginUser, getAllUsers, deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/authMiddleware.js";


const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Admin: Get all users
router.get("/", protect, admin, getAllUsers);

// Admin: Delete user
router.delete("/:id", protect, admin, deleteUser);

export default router;
