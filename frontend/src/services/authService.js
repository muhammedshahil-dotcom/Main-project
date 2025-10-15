import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth"; 

// Login
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data; // Expecting { token, user }
    } catch (error) {
        throw error.response?.data || { message: "Login failed" };
    }
};

// Register
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data; // Expecting { token, user }
    } catch (error) {
        throw error.response?.data || { message: "Registration failed" };
    }
};