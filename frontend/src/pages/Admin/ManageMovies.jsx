import { useEffect, useState, useContext } from "react";
import { getAllMovies, deleteMovie } from "../../services/movieService";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

export default function ManageMovies() {
  const { user, token } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const data = await getAllMovies();
      setMovies(data);
    } catch (err) {
      console.log("❌ Failed to load movies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-red-500 text-xl">
        ❌ Access Denied — Admin Only
      </div>
    );
  }

  // delete movie handler
  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;

    try {
      await deleteMovie(id, token);
      setMovies(movies.filter((m) => m._id !== id));
      alert("Movie deleted successfully.");
    } catch (err) {
      alert("Delete failed.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="px-10 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Movies</h1>
          <Link
            to="/add-movie"
            className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition"
          >
            ➕ Add Movie
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie._id}
                className="relative group rounded-xl overflow-hidden 
                   bg-[#111111] border border-gray-800 
                   shadow-[0_0_15px_rgba(255,0,0,0.05)]
                   hover:shadow-[0_0_25px_rgba(255,0,0,0.4)]
                   hover:scale-105 transition-all duration-300 ease-out"

              >

                <img
                  src={`${import.meta.env.VITE_API_URL}/${movie.posterUrl}`}
                  className="
                    w-full h-64 object-cover 
                    transition-all duration-300
                    group-hover:brightness-75 
                    group-hover:scale-110"
                />

                {/* Overlay Buttons */}
                <div className="
                    absolute inset-0 flex flex-col items-center justify-center gap-3 
                    opacity-0 group-hover:opacity-100 
                    backdrop-blur-md bg-black/30
                    transition-all duration-300">

                  <Link
                    to={`/admin/movie/${movie._id}`}
                    className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                  >
                    View
                  </Link>

                  <Link
                    to={`/admin/edit-movie/${movie._id}`}
                    className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>

                  <button
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDelete(movie._id)}
                  >
                    Delete
                  </button>
                </div>

                <p className="text-center py-3 font-semibold text-lg text-gray-200 tracking-wide">
                  {movie.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
