import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { User } from "lucide-react";
import logo from "../assets/1.png";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-4 md:px-6 py-3 shadow-lg flex items-center justify-between sticky top-0 z-50">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <img
            src={logo}
            alt="CineRate Logo"
            className="w-28 md:w-36 h-auto"
          />
        </Link>

        {user?.role === "admin" && (
          <Link
            to="/admin/movies"
            className="hidden sm:block hover:text-red-400 transition text-sm md:text-base"
          >
            Manage Movies
          </Link>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 md:gap-6 text-sm md:text-base">
        {user ? (
          <>
            <div className="hidden sm:flex items-center gap-2 text-gray-300">
              <User className="w-4 h-4 text-indigo-400" />
              <span>{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-indigo-400">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-indigo-700"
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
