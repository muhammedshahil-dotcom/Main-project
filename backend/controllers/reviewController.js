import Review from "../models/Review.js";
import Movie from "../models/Movie.js";

// ✅ Add Review (linked to movieId from URL)
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { movieId } = req.params; // ✅ now we take it from the URL

    // Validate
    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const review = new Review({
      movie: movieId,
      user: req.user.id,
      rating,
      comment,
    });

    await review.save();

    // ✅ Recalculate movie’s average rating
    const reviews = await Review.find({ movie: movieId });
    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await Movie.findByIdAndUpdate(movieId, { rating: avgRating.toFixed(1) });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add review", error: error.message });
  }
};

// ✅ Get Reviews for a Movie
export const getReviewsByMovie = async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reviews", error: error.message });
  }
};
