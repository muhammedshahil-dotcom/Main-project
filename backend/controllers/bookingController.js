import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";

const TICKET_PRICE = 250;
const CURRENCY = "inr";

const hasStripeConfig = !!process.env.STRIPE_SECRET_KEY;
const stripe = hasStripeConfig ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export const createBooking = asyncHandler(async (req, res) => {
  const { movieId, showDate, showTime, seats } = req.body;

  if (!movieId || !showDate || !showTime || !seats) {
    throw new AppError("movieId, showDate, showTime and seats are required", 400);
  }

  const movie = await Movie.findById(movieId).lean();
  if (!movie) throw new AppError("Movie not found", 404);

  const parsedSeats = Number(seats);
  if (Number.isNaN(parsedSeats) || parsedSeats < 1 || parsedSeats > 20) {
    throw new AppError("Seats must be between 1 and 20", 400);
  }

  const booking = await Booking.create({
    user: req.user.id,
    movie: movieId,
    showDate: new Date(showDate),
    showTime,
    seats: parsedSeats,
    totalAmount: parsedSeats * TICKET_PRICE,
    currency: "INR",
    paymentStatus: "pending",
    paymentProvider: "none",
  });

  res.status(201).json({
    success: true,
    message: "Ticket booking created",
    data: booking,
  });
});

export const createStripeCheckoutSession = asyncHandler(async (req, res) => {
  if (!hasStripeConfig) throw new AppError("Stripe is not configured", 500);

  const { movieId, showDate, showTime, seats } = req.body;
  if (!movieId || !showDate || !showTime || !seats) {
    throw new AppError("movieId, showDate, showTime and seats are required", 400);
  }

  const movie = await Movie.findById(movieId).lean();
  if (!movie) throw new AppError("Movie not found", 404);

  const parsedSeats = Number(seats);
  if (Number.isNaN(parsedSeats) || parsedSeats < 1 || parsedSeats > 20) {
    throw new AppError("Seats must be between 1 and 20", 400);
  }

  const totalAmount = parsedSeats * TICKET_PRICE;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const booking = await Booking.create({
    user: req.user.id,
    movie: movieId,
    showDate: new Date(showDate),
    showTime,
    seats: parsedSeats,
    totalAmount,
    currency: "INR",
    paymentStatus: "pending",
    paymentProvider: "stripe",
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: movie.title,
            description: `Tickets: ${parsedSeats} | Show: ${showTime}`,
          },
          unit_amount: TICKET_PRICE * 100,
        },
        quantity: parsedSeats,
      },
    ],
    customer_email: req.user.email || undefined,
    metadata: {
      bookingId: booking._id.toString(),
      movieId: movieId.toString(),
      userId: req.user.id,
    },
    success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&bookingId=${booking._id}`,
    cancel_url: `${frontendUrl}/movies/${movieId}?payment=cancelled`,
  });

  booking.stripeSessionId = session.id;
  await booking.save();

  res.status(201).json({
    success: true,
    message: "Stripe checkout session created",
    data: {
      bookingId: booking._id,
      sessionId: session.id,
      checkoutUrl: session.url,
    },
  });
});

export const confirmStripePayment = asyncHandler(async (req, res) => {
  if (!hasStripeConfig) throw new AppError("Stripe is not configured", 500);

  const { bookingId, sessionId } = req.body;
  if (!bookingId || !sessionId) {
    throw new AppError("bookingId and sessionId are required", 400);
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  const isOwner = booking.user.toString() === req.user.id;
  if (!isOwner && req.user.role !== "admin") {
    throw new AppError("Not allowed to confirm this booking", 403);
  }

  if (booking.paymentStatus === "paid") {
    return res.status(200).json({
      success: true,
      message: "Payment already confirmed",
      data: booking,
    });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (!session) throw new AppError("Stripe session not found", 404);

  const metaBookingId = session.metadata?.bookingId;
  if (metaBookingId !== booking._id.toString()) {
    throw new AppError("Session does not match booking", 400);
  }

  if (session.payment_status === "paid") {
    booking.paymentStatus = "paid";
    booking.stripeSessionId = session.id;
    booking.stripePaymentIntentId = String(session.payment_intent || "");
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: booking,
    });
  }

  booking.paymentStatus = "failed";
  await booking.save();
  throw new AppError("Payment not completed", 400);
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate("movie", "title posterUrl releaseDate genre")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: bookings,
  });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError("Booking not found", 404);

  const isOwner = booking.user.toString() === req.user.id;
  if (!isOwner && req.user.role !== "admin") {
    throw new AppError("Not allowed to cancel this booking", 403);
  }

  booking.status = "cancelled";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking cancelled",
    data: booking,
  });
});
