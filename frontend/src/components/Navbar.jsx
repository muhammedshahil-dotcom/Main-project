import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { User } from "lucide-react";
import logo from "../assets/1.png";

function Navbar({ search = "", setSearch }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-lg flex items-center justify-between gap-6 sticky top-0 z-50">
      
      {/* LEFT: Logo + Admin */}
      <div className="flex items-center gap-6">
        <Link to="/">
          <img src={logo} alt="CineRate Logo" className="w-40 h-auto" />
        </Link>

        {user?.role === "admin" && (
          <Link
            to="/admin/movies"
            className="hover:text-red-400 transition font-medium"
          >
            Manage Movies
          </Link>
        )}
      </div>

      {/* CENTER: Search Bar */}
      {setSearch && (
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg w-72
                     focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      )}

      {/* RIGHT: Auth */}
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="w-5 h-5 text-indigo-400" />
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
