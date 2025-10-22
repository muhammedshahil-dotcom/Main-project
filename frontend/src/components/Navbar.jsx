import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { User } from "lucide-react"; // user icon
import logo from "../assets/logo.png"; // logo image


function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-lg flex justify-between items-center">
      {/* Logo */}
      <Link to="/" >
        <img src={logo} alt="CineRate Logo" className="w-40 h-auto mr-3" />
      </Link>

      {/* Links */}
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="w-5 h-5 text-indigo-400" /> {/* user icon */}
              <span>{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-indigo-400 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
