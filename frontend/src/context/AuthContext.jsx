import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/authService"; // Import authService

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser && savedUser !== "undefined") {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);



    const login = async (credentials) => {
        try {
            const data = await loginUser(credentials); // Call loginUser from authService
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
            console.error("Login error:", error);
            throw error; // Re-throw the error to be caught in the component
        }
    };

    const register = async (userData) => {
        try {
            const data = await registerUser(userData); // Call registerUser from authService
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
            console.error("Registration error:", error);
            throw error; // Re-throw the error to be caught in the component
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};