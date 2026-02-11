import api from "./api";

export const getAdminStats = async (token) => {
  const res = await api.get("/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const getAdminMovies = async (token) => {
  const res = await api.get("/admin/movies", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data || [];
};

export const getAdminReviews = async (token) => {
  const res = await api.get("/admin/reviews", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data || [];
};
