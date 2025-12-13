import axios from "axios";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

//  Get all movies
export const getAllMovies = async () => {
  try {
    const res = await axios.get(`${API}/api/movies`);
    return res.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

// Add a new movie (Admin only)
export const addMovie = async (formData, token) => {
  try {
    const res = await axios.post(
      `${API}/api/movies`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Add movie error:", err);
    throw err;
  }
};


// Get single movie by ID
export const getMovieById = async (id) => {
  if (!id) throw new Error("Movie ID is required");

  try {
    const res = await axios.get(`${API}/api/movies/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};
// Delete movie (Admin only)
export const deleteMovie = async (id, token) => {
  try {
    const res = await axios.delete(`${API}/api/movies/${id}`, {
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
    const res = await axios.put(`${API}/api/movies/${id}`, formData, {
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
