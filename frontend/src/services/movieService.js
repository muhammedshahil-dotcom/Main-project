import api from "./api";

const asArray = (value) => (Array.isArray(value) ? value : []);

export const getAllMovies = async () => {
  const res = await api.get("/movies", { skipGlobalLoader: true });
  return asArray(res.data?.data ?? res.data);
};

export const searchMovies = async (query) => {
  const res = await api.get(`/movies/search?q=${encodeURIComponent(query)}`, {
    skipGlobalLoader: true,
  });
  return asArray(res.data?.data ?? res.data);
};

export const getMovieById = async (id) => {
  const res = await api.get(`/movies/${id}`, { skipGlobalLoader: true });
  return res.data?.data ?? res.data;
};

export const addMovie = async (formData, token) => {
  const res = await api.post("/admin/movies", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateMovie = async (id, formData, token) => {
  const res = await api.put(`/admin/movies/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteMovie = async (id, token) => {
  const res = await api.delete(`/admin/movies/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
