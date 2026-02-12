import api from "./api";
const asArray = (value) => (Array.isArray(value) ? value : []);

export const getAdminStats = async (token) => {
  const res = await api.get("/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
    skipGlobalLoader: true,
  });
  return res.data?.data ?? res.data;
};

export const getAdminMovies = async (token) => {
  const res = await api.get("/admin/movies", {
    headers: { Authorization: `Bearer ${token}` },
    skipGlobalLoader: true,
  });
  return asArray(res.data?.data ?? res.data);
};

export const getAdminReviews = async (token) => {
  const res = await api.get("/admin/reviews", {
    headers: { Authorization: `Bearer ${token}` },
    skipGlobalLoader: true,
  });
  return asArray(res.data?.data ?? res.data);
};
