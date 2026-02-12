import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/my", verifyToken, getMyBookings);
router.put("/:id/cancel", verifyToken, cancelBooking);

export default router;
