import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Background from "../components/Background";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-950 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Background
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
        />
      </div>

      {/* Login Form */}
       <div className="relative z-10 w-full max-w-md mx-4 sm:mx-auto bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Login
          </h1>

          {error && (
            <p role="alert" className="text-red-500 text-sm sm:text-base mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                autoComplete="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm sm:text-base"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-gray-400 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm sm:text-base"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 transition text-white font-semibold py-2 sm:py-3 rounded-lg shadow-md text-sm sm:text-base"
            >
              Login
            </button>
          </form>

          <p className="text-gray-400 text-sm sm:text-base mt-6 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-red-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>

  );
}

export default Login;
