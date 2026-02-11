import Movie from "../models/Movie.js";
import Review from "../models/Review.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";

const parseGenres = (genreValue) => {
  if (Array.isArray(genreValue)) return genreValue.map((g) => String(g).trim()).filter(Boolean);
  if (typeof genreValue === "string") {
    return genreValue
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);
  }
  return [];
};

const getReleaseYear = (releaseDate) => {
  if (!releaseDate) return undefined;
  return new Date(releaseDate).getFullYear();
};

export const addMovie = asyncHandler(async (req, res) => {
  const { title, description, genre, releaseDate } = req.body;

  const movie = await Movie.create({
    title,
    description,
    genre: parseGenres(genre),
    releaseDate,
    releaseYear: getReleaseYear(releaseDate),
    posterUrl: req.files?.poster?.[0]?.path || null,
    bannerUrl: req.files?.banner?.[0]?.path || null,
    gallery: req.files?.gallery?.map((file) => file.path) || [],
  });

  res.status(201).json({
    success: true,
    message: "Movie added successfully",
    movie,
  });
});

export const getAllMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find().sort({ createdAt: -1 }).lean();
  res.status(200).json({ success: true, data: movies });
});

export const getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id).lean();
  if (!movie) throw new AppError("Movie not found", 404);
  res.status(200).json({ success: true, data: movie });
});

export const updateMovie = asyncHandler(async (req, res) => {
  const { title, description, releaseDate, genre } = req.body;

  const updateData = {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(releaseDate !== undefined && { releaseDate, releaseYear: getReleaseYear(releaseDate) }),
    ...(genre !== undefined && { genre: parseGenres(genre) }),
  };

  if (req.files?.poster?.[0]) updateData.posterUrl = req.files.poster[0].path;
  if (req.files?.banner?.[0]) updateData.bannerUrl = req.files.banner[0].path;
  if (req.files?.gallery?.length) updateData.gallery = req.files.gallery.map((file) => file.path);

  const movie = await Movie.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!movie) throw new AppError("Movie not found", 404);

  res.status(200).json({
    success: true,
    message: "Movie updated successfully",
    movie,
  });
});

export const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) throw new AppError("Movie not found", 404);

  await Review.deleteMany({ movie: movie._id });
  await movie.deleteOne();

  res.status(200).json({ success: true, message: "Movie deleted successfully" });
});

export const searchMovies = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) {
    return res.status(200).json({ success: true, data: [] });
  }

  const regex = new RegExp(q, "i");
  const movies = await Movie.find({
    $or: [{ title: regex }, { genre: regex }],
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.status(200).json({ success: true, data: movies });
});
