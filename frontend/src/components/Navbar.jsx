import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Menu, Search, User, X } from "lucide-react";
import { AuthContext } from "../context/AuthContextBase";
import logo from "../assets/logo.png";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("q") || "");
  }, [location.search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (location.pathname !== "/") return;
      const params = new URLSearchParams(location.search);
      const current = params.get("q") || "";
      if (current === search.trim()) return;
      if (search.trim()) {
        navigate(`/?q=${encodeURIComponent(search.trim())}`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [search, navigate, location.pathname, location.search]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 px-4 py-3 text-white backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            className="rounded-md p-2 hover:bg-gray-800 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="shrink-0">
            <img src={logo} alt="CineRate Logo" className="h-9 w-auto md:h-11" />
          </Link>
        </div>

        <div className="hidden w-full max-w-md items-center rounded-lg border border-gray-700 bg-gray-900 px-3 md:flex">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or genre..."
            className="w-full bg-transparent px-3 py-2 text-sm outline-none"
          />
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {user?.role === "admin" && (
            <Link to="/admin" className="text-sm text-gray-300 hover:text-red-400">
              Admin
            </Link>
          )}

          {user ? (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <User className="h-4 w-4 text-red-400" />
                <span>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm hover:text-red-400">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-red-600 px-3 py-2 text-sm hover:bg-red-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="mt-3 space-y-3 border-t border-gray-800 pt-3 md:hidden">
          <div className="flex items-center rounded-lg border border-gray-700 bg-gray-900 px-3">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or genre..."
              className="w-full bg-transparent px-3 py-2 text-sm outline-none"
            />
          </div>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-2 py-1 text-sm hover:bg-gray-800"
            >
              Admin Dashboard
            </Link>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full rounded-lg border border-gray-700 px-3 py-2 text-center text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="w-full rounded-lg bg-red-600 px-3 py-2 text-center text-sm hover:bg-red-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
