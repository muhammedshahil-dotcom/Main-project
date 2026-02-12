import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";

const TICKET_PRICE = 250;

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
  });

  res.status(201).json({
    success: true,
    message: "Ticket booked successfully",
    data: booking,
  });
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
