import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { deleteMovie } from "../../services/movieService";
import { getAdminMovies } from "../../services/adminService";
import { AuthContext } from "../../context/AuthContextBase";
import AdminLayout from "../../components/AdminLayout";

export default function ManageMovies() {
  const { token } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setError("");
        const data = await getAdminMovies(token);
        setMovies(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
      await deleteMovie(id, token);
      setMovies((prev) => prev.filter((movie) => movie._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <AdminLayout title="Manage Movies">
      <div className="mb-4 flex justify-end">
        <Link to="/admin/add-movie" className="rounded-md bg-red-600 px-4 py-2 text-sm hover:bg-red-700">
          Add Movie
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading movies...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <div key={movie._id} className="overflow-hidden rounded-xl border border-gray-800 bg-black/40">
              <img
                src={`${import.meta.env.VITE_API_URL}/${(movie.posterUrl || "").replace(/\\\\/g, "/")}`}
                className="h-64 w-full object-cover"
                alt={movie.title}
              />
              <div className="space-y-3 p-3">
                <p className="text-lg font-semibold">{movie.title}</p>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/edit-movie/${movie._id}`}
                    className="rounded bg-yellow-600 px-3 py-1 text-sm hover:bg-yellow-700"
                  >
                    Edit
                  </Link>
                  <button
                    className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
                    onClick={() => handleDelete(movie._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
