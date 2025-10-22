import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Fetch all users
export const getAllUsers = async (token) => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Delete user by ID
export const deleteUser = async (id, token) => {
  const res = await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
