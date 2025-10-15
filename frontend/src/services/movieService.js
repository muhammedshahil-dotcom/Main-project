import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

//  Get all movies
export const getAllMovies = async () => {
  try {
    const res = await axios.get(`${API_URL}/movies`);
    return res.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

// Add a new movie (with FormData for poster upload)
export const addMovie = async (formData, token) => {
  try {
    const res = await axios.post(`${API_URL}/movies`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding movie:", error);
    throw error;
  }
};

// Get single movie by ID
export const getMovieById = async (id) => {
  if (!id) throw new Error("Movie ID is required");

  try {
    const res = await axios.get(`${API_URL}/movies/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};
