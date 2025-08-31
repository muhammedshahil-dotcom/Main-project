import Review from "../models/Review.js";

// Add a review
export const addReview = async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;

    const review = new Review({
      movieId,
      userId: req.user.id, // pulled from JWT
      rating,
      comment
    });

    await review.save();
    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to add review", error: error.message });
  }
};

// Get all reviews for a movie
export const getReviews = async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId }).populate("userId", "name email");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};
