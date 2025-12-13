import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      const res = await axios.post(`${API_URL}/users/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/success"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Reset Password</h1>
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded-lg font-semibold"
          >
            Reset Password
          </button>
        </form>
        <p className="text-gray-400 text-center text-sm mt-4">
          <Link to="/login" className="text-red-500 hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
