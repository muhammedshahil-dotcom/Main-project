import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Login
export const loginUser = (credentials) =>
  axios.post(`${BASE_URL}/api/auth/login`, credentials).then(res => res.data);

// Register
export const registerUser = (data) =>
  axios.post(`${BASE_URL}/api/auth/register`, data).then(res => res.data);

// Forgot Password
export const forgotPassword = (email) =>
  axios.post(`${BASE_URL}/api/users/forgot-password`, { email }).then(res => res.data);

// Reset Password
export const resetPassword = (token, password) =>
  axios.post(`${BASE_URL}/api/users/reset-password/${token}`, { password }).then(res => res.data);
