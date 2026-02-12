import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
      index: true,
    },
    showDate: {
      type: Date,
      required: true,
    },
    showTime: {
      type: String,
      required: true,
      trim: true,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },
    paymentProvider: {
      type: String,
      enum: ["stripe", "none"],
      default: "stripe",
    },
    stripeSessionId: {
      type: String,
      default: null,
      index: true,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
