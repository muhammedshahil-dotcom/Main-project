import api from "./api";

export const addReview = async (movieId, reviewData, token) => {
  const res = await api.post(`/reviews/${movieId}`, reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getReviewsByMovie = async (movieId) => {
  const res = await api.get(`/reviews/movie/${movieId}`);
  return res.data.data || [];
};

export const updateReview = async (reviewId, reviewData, token) => {
  const res = await api.put(`/reviews/${reviewId}`, reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteReview = async (reviewId, token) => {
  const res = await api.delete(`/reviews/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
