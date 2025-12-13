import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Add review
export const addReview = async (movieId, reviewData, token) => {
  const res = await axios.post(`${API_URL}/api/reviews/${movieId}`, reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Get reviews for a specific movie 
export const getReviewsByMovie = async (movieId) => {
  const res = await axios.get(`${API_URL}/api/reviews/movie/${movieId}`);

  return res.data;
};
