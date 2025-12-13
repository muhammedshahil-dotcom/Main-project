import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      const res = await axios.post(`${API_URL}/api/users/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Forgot Password</h1>
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded-lg font-semibold"
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-gray-400 text-center text-sm mt-4">
          <Link to="/login" className="text-red-500 hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
