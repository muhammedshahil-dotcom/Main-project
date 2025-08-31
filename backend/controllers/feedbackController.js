import Feedback from "../models/Feedback.js";

// Add new feedback
export const addFeedback = async (req, res) => {
  try {
    const { message, rating, movieId } = req.body;

    // user comes from token (protect middleware)
    const feedback = await Feedback.create({
      message,
      rating,
      user: req.user.id,
      movie: movieId,
    });

    res.status(201).json({ message: "Feedback added successfully", feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all feedbacks
export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email") // populate user info
      .populate("movie", "title"); // populate movie title

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
