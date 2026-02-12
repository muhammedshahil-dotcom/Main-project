import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createBooking,
  createStripeCheckoutSession,
  confirmStripePayment,
  getMyBookings,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.post("/create-checkout-session", verifyToken, createStripeCheckoutSession);
router.post("/confirm-payment", verifyToken, confirmStripePayment);
router.get("/my", verifyToken, getMyBookings);
router.put("/:id/cancel", verifyToken, cancelBooking);

export default router;
