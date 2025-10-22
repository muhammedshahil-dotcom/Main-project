import axios from "axios";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

//  Get all movies
export const getAllMovies = async () => {
  try {
    const res = await axios.get(`${API}/movies`);
    return res.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

// Add a new movie (with FormData for poster upload)
export const addMovie = async (movieData, token) => {
  // movieData should include { title, description, genres, posterFile (File) }
  const form = new FormData();
  form.append("title", movieData.title);
  form.append("description", movieData.description || "");
  if (movieData.genres) form.append("genres", Array.isArray(movieData.genres) ? movieData.genres.join(",") : movieData.genres);
  if (movieData.posterFile) form.append("poster", movieData.posterFile);

  const res = await axios.post(`${API}/api/movies`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Get single movie by ID
export const getMovieById = async (id) => {
  if (!id) throw new Error("Movie ID is required");

  try {
    const res = await axios.get(`${API}/movies/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};
// Delete movie (Admin only)
export const deleteMovie = async (id, token) => {
  try {
    const res = await axios.delete(`${API}/movies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
};
// Update movie (Admins only)
export const updateMovie = async (id, formData, token) => {
  try {
    const res = await axios.put(`${API}/movies/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating movie:", error);
    throw error;
  }
};
